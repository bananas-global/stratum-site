/* ────────────────────────────────────────────────────────────────
   brandbook-pdf.mjs — render the brandbook to a PDF.

   Drives a headless Chromium over the print surface at
   /brand-center/brandbook/print (all 26 slides stacked at their
   native 1920×1080, one per printed page) and writes a landscape,
   text-selectable, link-clickable PDF to public/brand/.

   Usage:
     pnpm gen:brandbook-pdf                 # spins up its own dev server
     BRANDBOOK_URL=http://localhost:3000 pnpm gen:brandbook-pdf
                                            # reuse a running server

   The PDF stays in sync with the site because it is rendered from the
   same React slides — regenerate after any brandbook change.
   ──────────────────────────────────────────────────────────────── */

import { createHash } from "node:crypto";
import { readFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";

const PRINT_PATH = "/brand-center/brandbook/print";
const OUT_PATH = path.resolve("public/brand/Stratum-Brandbook.pdf");

/** Deterministic dev port, matching scripts/port.mjs. */
function devPort() {
  const { name } = JSON.parse(readFileSync("./package.json", "utf8"));
  const n = createHash("md5").update(name).digest().readUInt16BE(0);
  return 3000 + (n % 4000);
}

async function reachable(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok || res.status === 405; // HEAD may be disallowed but server is up
  } catch {
    return false;
  }
}

/** Poll until the print surface responds, or time out. */
async function waitForServer(base, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await reachable(base + PRINT_PATH)) return true;
    await sleep(1000);
  }
  return false;
}

async function loadPlaywright() {
  try {
    const { chromium } = await import("playwright");
    return chromium;
  } catch {
    console.error(
      "\n✗ Playwright is not installed. Add it once with:\n" +
        "    pnpm add -D playwright && pnpm exec playwright install chromium\n",
    );
    process.exit(1);
  }
}

async function launchBrowser(chromium) {
  // Prefer the bundled Chromium; fall back to a system Chrome install.
  try {
    return await chromium.launch();
  } catch (err) {
    try {
      return await chromium.launch({ channel: "chrome" });
    } catch {
      console.error(
        "\n✗ Could not launch a browser. Install the Chromium bundle with:\n" +
          "    pnpm exec playwright install chromium\n",
      );
      throw err;
    }
  }
}

async function main() {
  mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  const chromium = await loadPlaywright();

  // Reuse a caller-provided server, otherwise spin up our own dev server.
  const externalBase = process.env.BRANDBOOK_URL?.replace(/\/$/, "");
  let base = externalBase;
  let server;

  if (!base) {
    const port = devPort();
    base = `http://localhost:${port}`;
    if (!(await reachable(base + PRINT_PATH))) {
      console.log(`• Starting dev server on :${port} …`);
      server = spawn("pnpm", ["exec", "next", "dev", "-p", String(port)], {
        stdio: "ignore",
        // Keep the dev-only feedback widget out of the rendered PDF.
        env: { ...process.env, HIDE_DEV_WIDGETS: "1" },
      });
    } else {
      console.log(`• Reusing dev server on :${port}`);
    }
  } else {
    console.log(`• Using ${base}`);
  }

  const url = base + PRINT_PATH;

  try {
    if (!(await waitForServer(base))) {
      throw new Error(`Server never became reachable at ${url}`);
    }

    const browser = await launchBrowser(chromium);
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
    });

    console.log(`• Rendering ${url} …`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });

    // Fonts + every image must be fully loaded before we snapshot to PDF.
    await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((res) => {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
              }),
        ),
      );
    });
    await sleep(400); // let the last paint settle

    await page.pdf({
      path: OUT_PATH,
      preferCSSPageSize: true, // honour @page { size: 1920px 1080px }
      printBackground: true,
    });

    await browser.close();
    console.log(`\n✓ Wrote ${path.relative(process.cwd(), OUT_PATH)}`);
  } finally {
    if (server) server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
