import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Prefer AVIF (smaller on dark, near-black product renders), fall back to WebP.
    formats: ["image/avif", "image/webp"],
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
