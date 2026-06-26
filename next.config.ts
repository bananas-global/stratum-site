import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Prefer AVIF (smaller on dark, near-black product renders), fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
