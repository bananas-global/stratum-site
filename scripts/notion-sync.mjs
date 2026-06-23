// Pulls published posts from the "Stratum News" Notion database and bakes them
// into local content the Next.js build reads. Runs before `next build` (and
// `dev`). Network/expiring-URL concerns live here, NOT in the app: every image
// (cover + inline) is downloaded into /public so the static build is
// self-contained and immune to Notion's ~1h signed-URL expiry.
//
// Output:
//   content/insights/index.json   — listing metadata (no bodies), newest first
//   content/insights/<slug>.json  — full post: meta + markdown + image dims
//   public/insights/<slug>/*      — downloaded cover + inline images
//
// Resilience: if NOTION_TOKEN is absent (e.g. a contributor without secrets),
// the script logs a warning and exits 0, leaving any existing content in place
// so the build never breaks on a missing credential.

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { imageSize } from "image-size";
import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Load .env.local when present (local dev). On Vercel the vars are already in
// process.env, and the file won't exist — so this is best-effort.
try {
  process.loadEnvFile(path.resolve(".env.local"));
} catch {
  /* no .env.local — rely on process.env */
}

const TOKEN = process.env.NOTION_TOKEN;
const DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID || "3de72646-a2a5-41f9-9d23-5208fd336e48";

const CONTENT_DIR = path.resolve("content/insights");
const PUBLIC_DIR = path.resolve("public/insights");

if (!TOKEN) {
  console.warn(
    "[notion-sync] NOTION_TOKEN not set — skipping sync, keeping existing content.",
  );
  process.exit(0);
}

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

/* ── property helpers ─────────────────────────────────────── */
const plain = (rich) => (rich || []).map((r) => r.plain_text).join("");
const prop = (page, name) => page.properties[name];

function fileUrl(file) {
  if (!file) return null;
  return file.type === "external" ? file.external.url : file.file?.url ?? null;
}

/* ── image download + rewrite ─────────────────────────────── */
function safeName(url, fallback) {
  try {
    const base = path.basename(new URL(url).pathname) || fallback;
    return decodeURIComponent(base).replace(/[^a-zA-Z0-9._-]/g, "_") || fallback;
  } catch {
    return fallback;
  }
}

async function downloadImage(url, slug, index) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let name = safeName(url, `image-${index}`);
  if (!path.extname(name)) {
    const ct = res.headers.get("content-type") || "";
    const ext = ct.includes("png") ? ".png" : ct.includes("webp") ? ".webp" : ct.includes("gif") ? ".gif" : ".jpg";
    name = `${name}${ext}`;
  }
  const destDir = path.join(PUBLIC_DIR, slug);
  await mkdir(destDir, { recursive: true });
  await writeFile(path.join(destDir, name), buf);
  let dims = {};
  try {
    const { width, height } = imageSize(buf);
    dims = { width, height };
  } catch {
    /* non-raster or undetectable — renderer falls back to intrinsic */
  }
  return { src: `/insights/${slug}/${name}`, ...dims };
}

// Replace every markdown image URL with a downloaded local path and collect
// a src -> {width,height,alt} map the renderer uses for next/image sizing.
async function localizeInlineImages(markdown, slug) {
  const images = {};
  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const tasks = [];
  let m;
  let i = 0;
  while ((m = re.exec(markdown)) !== null) {
    const [, alt, url] = m;
    const idx = i++;
    tasks.push(
      downloadImage(url, slug, idx)
        .then((info) => ({ url, alt, info }))
        .catch((err) => {
          console.warn(`[notion-sync]   inline image failed (${url}): ${err.message}`);
          return null;
        }),
    );
  }
  const results = (await Promise.all(tasks)).filter(Boolean);
  let out = markdown;
  for (const { url, alt, info } of results) {
    out = out.split(url).join(info.src);
    images[info.src] = { width: info.width, height: info.height, alt };
  }
  return { markdown: out, images };
}

/* ── main ─────────────────────────────────────────────────── */
async function main() {
  console.log("[notion-sync] querying published posts…");
  const pages = [];
  let cursor;
  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ property: "Date", direction: "descending" }],
      start_cursor: cursor,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  console.log(`[notion-sync] ${pages.length} published posts`);

  // Clean output dirs so deletes/renames in Notion propagate.
  await rm(CONTENT_DIR, { recursive: true, force: true });
  await rm(PUBLIC_DIR, { recursive: true, force: true });
  await mkdir(CONTENT_DIR, { recursive: true });

  const index = [];
  for (const page of pages) {
    const title = plain(prop(page, "Title")?.title);
    const slug = plain(prop(page, "Slug")?.rich_text) || page.id;
    const date = prop(page, "Date")?.date?.start ?? null;
    const excerpt = plain(prop(page, "Excerpt")?.rich_text);
    const originalSlug = plain(prop(page, "Original Slug")?.rich_text);
    const sourceUrl = prop(page, "Source URL")?.url ?? null;

    // Cover image (optional).
    let cover = null;
    const coverFiles = prop(page, "Cover")?.files ?? [];
    const coverUrl = fileUrl(coverFiles[0]);
    if (coverUrl) {
      try {
        cover = await downloadImage(coverUrl, slug, "cover");
      } catch (err) {
        console.warn(`[notion-sync]   cover failed for ${slug}: ${err.message}`);
      }
    }

    // Body → markdown → localized images.
    const blocks = await n2m.pageToMarkdown(page.id);
    const rawMd = n2m.toMarkdownString(blocks).parent || "";
    const { markdown, images } = await localizeInlineImages(rawMd, slug);

    const words = markdown.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.round(words / 200));

    const meta = { slug, title, date, excerpt, originalSlug, sourceUrl, cover, readingMinutes };
    index.push(meta);
    await writeFile(
      path.join(CONTENT_DIR, `${slug}.json`),
      JSON.stringify({ ...meta, markdown, images }, null, 2),
    );
    console.log(`[notion-sync]   ✓ ${slug}${cover ? " (cover)" : ""}`);
  }

  await writeFile(path.join(CONTENT_DIR, "index.json"), JSON.stringify(index, null, 2));
  console.log(`[notion-sync] done — wrote ${index.length} posts`);
}

main().catch((err) => {
  console.error("[notion-sync] FAILED:", err);
  process.exit(1);
});
