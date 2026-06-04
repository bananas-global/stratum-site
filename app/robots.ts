import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://stratumtech.ca/sitemap.xml",
    host: "https://stratumtech.ca",
  };
}
