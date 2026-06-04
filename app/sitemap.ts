import type { MetadataRoute } from "next";

const BASE = "https://stratumtech.ca";

// Phase 1 pages only. Per-service and per-industry detail pages are Phase 2
// (hidden + noindex) and intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", "/industries", "/why-stratum", "/about", "/insights", "/contact"];

  return paths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date("2026-06-04"),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
