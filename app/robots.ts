import type { MetadataRoute } from "next";

// Phase 2 routes are hidden via per-page `robots: { index: false }` metadata,
// NOT robots.txt disallow rules — a disallow would stop crawlers from ever
// seeing the noindex meta (and would publish the list of hidden URLs here).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://stratumtech.ca/sitemap.xml",
    host: "https://stratumtech.ca",
  };
}
