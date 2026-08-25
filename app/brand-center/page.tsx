import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader, BracketLabel, Button } from "@/components/ui";
import BrandCenterConfigurator from "@/components/BrandCenterConfigurator";
import { IconPattern } from "@/components/IconPattern";
import { BRANDBOOK_VERSION, SLIDES } from "@/components/brandbook/slides";

// Brand assets for the team, agencies and partners — linked from the footer,
// but kept out of search, the nav and the sitemap.
export const metadata: Metadata = {
  title: "Brand Center",
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
          <div className="grid items-center gap-12 lg:grid-cols-2" data-reveal>
            <div className="flex flex-col gap-5">
              <BracketLabel>Brandbook</BracketLabel>
              <h2 className="display-3 text-ink-bright">The whole system, in {SLIDES.length} slides.</h2>
              <p className="text-ink-dim">
                The logo files above are one chapter of a larger system. The brandbook is the
                complete reference — who Stratum is, why the mark looks the way it does, the
                colour palette on dark and on light, typography, voice and writing rules, and
                the imagery language with its hard exclusions. Built for the internal team,
                agencies and partners: every rule stated once, plainly.
              </p>
              <p className="text-ink-dim">
                It runs right here in the browser as a full-screen presentation — arrow keys or
                click to move through it, press <span className="text-ink">N</span> for the
                presenter notes.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Button href="/brand-center/brandbook">Start presentation</Button>
                <Button
                  href="/brand/Stratum-Brandbook.pdf"
                  download
                  icon={false}
                >
                  Download PDF
                </Button>
              </div>
            </div>
            <Link
              href="/brand-center/brandbook"
              aria-label="Open the Stratum brandbook presentation"
              className="group relative block aspect-video overflow-hidden rounded-md border border-line-soft transition-colors hover:border-brand-light/50"
            >
              <IconPattern className="absolute inset-0" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 20% 90%, rgba(125,52,255,0.16), transparent 55%), linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92))",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <BracketLabel>Brand guidelines</BracketLabel>
                <div className="flex flex-col gap-3">
                  <span className="font-display text-3xl leading-tight tracking-tight text-ink-bright md:text-4xl">
                    Structure behind dependable technology
                  </span>
                  <span className="flex items-center gap-3 text-sm text-ink-dim">
                    <span>{BRANDBOOK_VERSION}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{SLIDES.length} slides</span>
                    <span className="ml-auto text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                      Start →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-bg">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2" data-reveal>
            {/* Text leads in the DOM (so it also leads when the grid stacks);
                the tile takes the left column from lg up. */}
            <div className="flex flex-col gap-5">
              <BracketLabel>Pattern generator</BracketLabel>
              <h2 className="display-3 text-ink-bright">The icon, tiled to any canvas.</h2>
              <p className="text-ink-dim">
                The mark&apos;s geometry tessellates — the icon repeats across the plane with no
                seam and no visible repeat. The generator builds that field at whatever size you
                need: set the canvas, the motif scale, the line colour and the background
                gradient, then download a PNG.
              </p>
              <p className="text-ink-dim">
                Use it for deck backgrounds, document covers and social art — the same pattern
                that backs the brandbook cover above. Keep it quiet: near-black ground, one
                accent at most, and never behind body copy.
              </p>
              <div className="mt-2">
                <Button href="/pattern-generator">Open pattern generator</Button>
              </div>
            </div>
            <Link
              href="/pattern-generator"
              aria-label="Open the Stratum pattern generator"
              className="group relative block aspect-video overflow-hidden rounded-md border border-line-soft transition-colors hover:border-brand-light/50 lg:order-first"
            >
              <IconPattern className="absolute inset-0" scale={0.28} />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 80% 90%, rgba(125,52,255,0.16), transparent 55%), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85))",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <BracketLabel>Pattern</BracketLabel>
                <span className="flex items-center gap-3 text-sm text-ink-dim">
                  <span>Seamless tiling</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>PNG up to 6000 px</span>
                  <span className="ml-auto text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                    Open →
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
