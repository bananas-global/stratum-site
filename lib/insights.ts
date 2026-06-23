// Read side of the Notion pipeline. Pages import from here; the data is the
// local content baked by `scripts/notion-sync.mjs` at build time — no Notion
// calls happen during `next build`. If the content dir is absent (e.g. a build
// without the NOTION_TOKEN secret), these return empty so the build still works.
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content/insights");

export type PostImage = { width?: number; height?: number; alt?: string };

export type PostMeta = {
  slug: string;
  title: string;
  date: string | null;
  excerpt: string;
  originalSlug: string;
  sourceUrl: string | null;
  cover: { src: string; width?: number; height?: number } | null;
  readingMinutes: number;
};

export type Post = PostMeta & {
  markdown: string;
  images: Record<string, PostImage>;
};

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")) as T;
  } catch {
    return null;
  }
}

/** All published posts, newest first. Empty if content hasn't been synced. */
export function getAllPosts(): PostMeta[] {
  return readJson<PostMeta[]>("index.json") ?? [];
}

/** Full post (meta + body + image dimensions) by slug, or null. */
export function getPost(slug: string): Post | null {
  return readJson<Post>(`${slug}.json`);
}

/** Human-readable post date, e.g. "May 28, 2020". */
export function formatPostDate(date: string | null): string {
  if (!date) return "";
  // Parse as UTC to avoid TZ drift on date-only strings.
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
