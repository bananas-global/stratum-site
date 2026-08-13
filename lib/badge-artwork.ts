/* Fixed brand assets used by both badge renderers.

   The background uses the canonical IconPattern geometry. The preview draws
   the React component directly; the PDF rasterises its standalone SVG
   counterpart with the same settings. */

export const BADGE_ARTWORK = {
  background: {
    logicalWidth: 600,
    logicalHeight: 920,
    scale: 0.445,
    color: "#000000",
    bgFrom: "#1B1B1B",
    bgTo: "#0A0A0A",
  },
  logo: {
    previewSrc: "/brand/stratum-logo-white-mono.svg",
    pdfSrc: "/brand/stratum-logo-white-mono.png",
    aspectRatio: 378 / 50,
  },
} as const;
