// Read side of the signature-CTA pipeline. The email signature builder imports
// from here; the data is baked by `scripts/notion-sync.mjs` from the "Signature
// CTA" Notion database at build time — no Notion calls happen during the build.
// If the file is absent (e.g. a build without NOTION_TOKEN, or before the first
// sync), this returns [] so the builder simply renders no banner.
import fs from "node:fs";
import path from "node:path";

const CTA_FILE = path.join(process.cwd(), "content/signature-cta.json");

export type SignatureCta = {
  headline: string;
  linkText: string;
  url: string;
};

/** Active CTAs, in Notion order. Empty if none are active or unsynced. */
export function getSignatureCtas(): SignatureCta[] {
  try {
    const raw = fs.readFileSync(CTA_FILE, "utf8");
    const parsed = JSON.parse(raw) as SignatureCta[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
