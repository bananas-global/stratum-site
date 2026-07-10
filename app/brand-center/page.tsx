import type { Metadata } from "next";
import { SectionHeader, BracketLabel } from "@/components/ui";
import BrandCenterConfigurator from "@/components/BrandCenterConfigurator";
import { SITE } from "@/lib/site";

// Hidden internal tool — not part of the public IA. Kept out of search,
// the nav, the footer, and the sitemap. Reachable only by direct link.
export const metadata: Metadata = {
  title: "Brand Center | Stratum",
  description: "Official Stratum logo files, colour palette and usage guidelines.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BrandCenterPage() {
  return (
    <>
      <section className="section bg-bg pt-40 md:pt-48">
        <div className="container flex flex-col gap-10">
          <SectionHeader
            eyebrow="Brand center"
            title="The Stratum mark."
            lede="Official logo files, ready to use. Pick the colour, accent and type for your context, then download the SVG or PNG — no redrawing, no screenshots."
          />
          <div data-reveal>
            <BrandCenterConfigurator />
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2" data-reveal>
            <div className="flex flex-col gap-4">
              <BracketLabel>Usage</BracketLabel>
              <h2 className="display-3 text-ink-bright">A few ground rules.</h2>
              <ul className="flex flex-col gap-3 text-ink-dim">
                <li>— Use the files from this page. Don&apos;t redraw, retype or trace the mark.</li>
                <li>— Keep the original proportions. No stretching, rotating, outlining or effects.</li>
                <li>— White versions go on dark backgrounds; black versions on light ones.</li>
                <li>— The amethyst accent stays amethyst. If it can&apos;t, use a monochrome version.</li>
                <li>— Monochrome versions are for single-colour contexts: print, engraving, embossing.</li>
                <li>— Give the mark room to breathe — clear space of at least the height of the A.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <BracketLabel>Formats</BracketLabel>
              <h2 className="display-3 text-ink-bright">SVG first.</h2>
              <p className="text-ink-dim">
                SVG is vector — it scales to any size and is the right choice for print,
                decks and anything large. PNG (transparent, 400&nbsp;px tall) is for quick
                digital use where vectors aren&apos;t supported.
              </p>
              <p className="text-ink-dim">
                Typography, if you need it alongside the mark: Lora or Instrument Serif for
                display headings, Manrope for body text.
              </p>
              <p className="text-ink-dim">
                Missing a format or unsure which version to use? Write to{" "}
                <a href={`mailto:${SITE.email}`} className="text-brand-light hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
