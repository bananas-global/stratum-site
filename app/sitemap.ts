import type { MetadataRoute } from "next";
import { PHASE_1_SITEMAP_PATHS } from "@/lib/phase";
import { getAllPosts } from "@/lib/insights";

const BASE = "https://www.stratumtech.ca";

// Phase 1 pages only. Phase 2 routes stay in source but are intentionally
// excluded until they are re-enabled in lib/phase.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on the static pages — a hardcoded date goes stale, and a
  // wrong date is worse for crawlers than none at all.
  const pages = PHASE_1_SITEMAP_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  // Published insight posts (baked from Notion at build time).
  const posts = getAllPosts().map((post) => ({
    url: `${BASE}/insights/${post.slug}`,
    ...(post.date ? { lastModified: new Date(`${post.date}T00:00:00Z`) } : {}),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
