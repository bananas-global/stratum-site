import type { MetadataRoute } from "next";
import { PHASE_2_ROUTE_GROUPS } from "@/lib/phase";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: Object.values(PHASE_2_ROUTE_GROUPS).flat(),
    },
    sitemap: "https://stratumtech.ca/sitemap.xml",
    host: "https://stratumtech.ca",
  };
}
