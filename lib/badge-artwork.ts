/* Fixed brand assets used by both badge renderers.

   The preview uses the same SVG wordmark as the site header. The PDF uses
   the high-resolution PNG export of that exact white + amethyst lockup so
   jsPDF can place it reliably without changing its appearance. */

export const BADGE_ARTWORK = {
  background: {
    src: "/images/id-card-bg.jpg",
    naturalWidth: 914,
    naturalHeight: 1378,
  },
  logo: {
    previewSrc: "/images/logo.svg",
    pdfSrc: "/brand/stratum-logo-white.png",
    aspectRatio: 378 / 50,
  },
} as const;
