import type { MetadataRoute } from "next";
import { PHASE_1_SITEMAP_PATHS } from "@/lib/phase";

const BASE = "https://stratumtech.ca";

// Phase 1 pages only. Phase 2 routes stay in source but are intentionally
// excluded until they are re-enabled in lib/phase.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return PHASE_1_SITEMAP_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date("2026-06-04"),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
