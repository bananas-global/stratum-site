import type { Metadata } from "next";
import { SLIDES } from "@/components/brandbook/slides";

/* ────────────────────────────────────────────────────────────────
   Brandbook — print surface.

   The presentation deck (../page) renders one 1920×1080 slide at a
   time, scaled to the viewport. This route instead stacks all slides
   in document flow, each at its native 1920×1080, one per printed
   page — the source `scripts/brandbook-pdf.mjs` renders to PDF with a
   headless browser (`@page { size: 1920px 1080px }`, one slide = one
   page). Not linked or indexed; reachable by direct link only.
   ──────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Brandbook — print",
  description: "Print/PDF layout of the Stratum brandbook.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

// Site chrome (Nav/Footer) lives in the root layout; this bare surface
// hides it. The @page rule + per-slide page break give a clean 16:9 PDF.
const PRINT_CSS = `
  header, footer { display: none !important; }
  html, body { background: #000; }
  main#main { margin: 0; padding: 0; }
  .bb-print { background: #000; }
  .bb-slide {
    position: relative;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #000;
  }
  @media print {
    @page { size: 1920px 1080px; margin: 0; }
    .bb-slide { break-after: page; page-break-after: always; }
    .bb-slide:last-child { break-after: auto; page-break-after: auto; }
  }
`;

export default function BrandbookPrintPage() {
  return (
    <div className="bb-print" data-brandbook-print>
      <style>{PRINT_CSS}</style>
      {SLIDES.map((slide, i) => (
        <section className="bb-slide" key={slide.label} aria-label={`${i + 1}. ${slide.label}`}>
          {slide.content}
        </section>
      ))}
    </div>
  );
}
