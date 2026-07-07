import type { NextConfig } from "next";

// Legacy stratum.it (Squarespace) → stratumtech.ca URL map, per the SEO
// migration plan. Auto-generated Squarespace slugs mapped by fetching each
// old post's title and matching it to the migrated Notion slug.
// "Maximizing Business Benefits" (mcb7mx…) was not migrated → /insights.
const LEGACY_NEWS_SLUGS: Record<string, string> = {
  "29xc4pesvxtghrtdoecnkovf98616z": "no-compromises-our-commitment-to-quality",
  "3jyezc0eeiyirjk36ucp1zntcuye2x": "we-are-moving",
  mkqpjqcggu8mqx5ipbepbpityt8shd: "stratum-systems-and-prism-pc-have-merged",
  bh5wk3ggdzl47c9e1mbyauqh5oyhdd: "beware-of-rogue-anti-virus",
  "blog-post-title-three-k4z6d": "efficient-health-i-t-could-save-408-million",
  "blog-post-title-four-4lkae":
    "leveraging-technology-to-increase-your-competitive-advantage",
  "blog-post-title-two-8nekm": "our-history",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Prefer AVIF (smaller on dark, near-black product renders), fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },
  // 301s for every indexed URL of the old Squarespace site. These work for
  // any path that reaches this deployment — including via the stratum.it
  // domain once it is attached to this Vercel project (domain-level redirect
  // preserves the path, then these rules map it to the new page).
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/about-1", destination: "/about", permanent: true },
      { source: "/managed-it-services", destination: "/services", permanent: true },
      { source: "/cybersecurity-services", destination: "/services", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/news", destination: "/insights", permanent: true },
      // Auto-generated Squarespace slugs → migrated slugs (must come before
      // the generic /news/:slug rule).
      ...Object.entries(LEGACY_NEWS_SLUGS).map(([from, to]) => ({
        source: `/news/${from}`,
        destination: `/insights/${to}`,
        permanent: true,
      })),
      { source: "/news/mcb7mxdrw59w0opq6ce386zoz52hgr", destination: "/insights", permanent: true },
      // Posts that kept their slug (the majority) fall through here.
      { source: "/news/:slug", destination: "/insights/:slug", permanent: true },
    ];
  },
  // Baseline hardening. No CSP here: the layout ships inline scripts
  // (JSON-LD + the reveal fallback), so a CSP needs nonces/hashes — do that
  // deliberately, not as a header one-liner.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
