import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink, BracketLabel, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Button catalogue",
  description: "Development-only inventory of the button styles used across the Stratum website.",
  robots: { index: false, follow: false },
};

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10.5 3 5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m5.5 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M5.25.75h1.5v5.69l2.22-2.22 1.06 1.06L6 9.31 1.97 5.28l1.06-1.06 2.22 2.22V.75ZM.75 10.5h10.5V12H.75v-1.5Z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Specimen({
  name,
  where,
  children,
  light = false,
}: {
  name: string;
  where: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <article
      className={`flex min-h-52 flex-col justify-between gap-8 rounded-md border p-6 ${
        light
          ? "section-light border-line-soft bg-bg text-ink"
          : "border-line-soft bg-surface text-ink"
      }`}
    >
      <div>
        <h3 className="font-body text-sm font-semibold tracking-[-0.01em] text-ink-bright">{name}</h3>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-faint">{where}</p>
      </div>
      <div className="flex min-h-14 flex-wrap items-center gap-3">{children}</div>
    </article>
  );
}

function SectionTitle({ index, title, lede }: { index: string; title: string; lede: string }) {
  return (
    <div className="grid gap-4 border-t border-line pt-8 md:grid-cols-[8rem_1fr]">
      <span className="font-mono text-xs text-brand-light">{index}</span>
      <div className="max-w-2xl">
        <h2 className="display-3 text-ink-bright">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">{lede}</p>
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div id="catalog" className="min-h-screen bg-bg pb-28 pt-40">
      <header className="container">
        <div className="grid gap-10 border-b border-line pb-16 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div className="max-w-4xl">
            <BracketLabel>Local component index</BracketLabel>
            <h1 className="mt-8 max-w-3xl font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.055em] text-ink-bright text-balance">
              Components
            </h1>
          </div>
          <div className="flex flex-col gap-4 border-l border-brand/60 pl-5">
            <p className="text-sm leading-relaxed text-ink-dim text-pretty">
              A visual inventory of the current production system and the purpose-built controls found in internal tools.
            </p>
            <span className="w-fit rounded-full bg-brand/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-light">
              Development only · noindex
            </span>
          </div>
        </div>
      </header>

      <main className="container mt-20 flex flex-col gap-24">
        <section className="flex flex-col gap-8">
          <SectionTitle
            index="01 / BUTTON"
            title="One action button"
            lede="There is one shared action style. Its surface follows the context, while icons are optional and states never create a second visual hierarchy."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Specimen name="On dark · arrow" where="components/ui.tsx · Button default">
              <Button href="#catalog">Talk With Stratum</Button>
            </Specimen>
            <Specimen name="On dark · no icon" where="components/ui.tsx · icon={false}">
              <Button href="#catalog" icon={false}>Get in touch</Button>
            </Specimen>
            <Specimen name="On light · arrow" where="app/globals.css · .section-light .btn" light>
              <Button href="#catalog">How Stratum Works</Button>
            </Specimen>
            <Specimen name="On light · no icon" where="app/globals.css · .section-light .btn" light>
              <Button href="#catalog" icon={false}>See all industries</Button>
            </Specimen>
            <Specimen name="Custom icon" where="same button · custom icon node">
              <Button href="#catalog" icon={<DownloadIcon />}>Download SVG</Button>
            </Specimen>
            <Specimen name="Disabled" where="same button · native disabled state">
              <Button type="button" disabled>Sending…</Button>
            </Specimen>
          </div>
          <div className="rounded-md border border-line-soft bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Hover signature</p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <Button href="#catalog">Button arrow</Button>
              <span className="text-xs uppercase tracking-wider text-ink-faint">same movement as</span>
              <ArrowLink href="#catalog">Arrow link</ArrowLink>
            </div>
          </div>
          <div className="grid gap-4 rounded-md border border-line-soft bg-surface p-6 md:grid-cols-[10rem_1fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Component API</p>
              <p className="mt-2 text-sm text-ink-bright">Radius · 4px</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["href", "type", "onClick", "disabled", "download", "icon", "iconPosition", "className"].map((prop) => (
                <code key={prop} className="rounded-sm bg-black px-2.5 py-1.5 text-xs text-brand-light">
                  {prop}
                </code>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle
            index="02 / LINK"
            title="Link-like actions"
            lede="Lower-emphasis actions keep the affordance of a button without introducing another filled surface."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Specimen name="Arrow link" where="components/ui.tsx · .link-arrow">
              <ArrowLink href="#catalog">Get in touch: 1 855 200 0076</ArrowLink>
            </Specimen>
            <Specimen name="Text utility" where="internal tools · underline on hover">
              <button type="button" className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline">
                Reset to defaults
              </button>
            </Specimen>
            <Specimen name="Service shortcut" where="ServiceFilterChips.tsx · .chip">
              <button type="button" className="chip service-filter-chip transition-colors hover:text-ink-bright focus:outline-none focus-visible:text-ink-bright">
                Cybersecurity
              </button>
              <span className="chip-dot" />
              <button type="button" className="chip service-filter-chip transition-colors hover:text-ink-bright focus:outline-none focus-visible:text-ink-bright">
                Cloud
              </button>
            </Specimen>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle
            index="03 / SELECT"
            title="Filters and selectors"
            lede="These controls expose persistent state. The catalogue keeps active and inactive versions together so their contrast can be compared directly."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Specimen name="Category filter" where="ServiceCatalog.tsx · active / inactive">
              <button type="button" aria-pressed="true" className="rounded-sm border border-brand bg-brand/15 px-4 py-2 text-sm text-ink-bright transition-colors">All</button>
              <button type="button" aria-pressed="false" className="rounded-sm border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:text-ink-bright">Security</button>
            </Specimen>
            <Specimen name="Preset pill" where="PatternGenerator.tsx · rounded-full compact preset">
              <button type="button" aria-pressed="true" className="rounded-full border border-brand px-3 py-1 text-xs text-brand-light transition-colors">1920 × 1080</button>
              <button type="button" aria-pressed="false" className="rounded-full border border-line-strong px-3 py-1 text-xs text-ink-dim transition-colors hover:text-ink">Square</button>
            </Specimen>
            <Specimen name="Segmented tab" where="EmailSignatureBuilder.tsx · TAB(active)">
              <div role="tablist" className="flex w-fit gap-1 rounded-md border border-line p-1">
                <button type="button" role="tab" aria-selected="true" className="rounded-sm bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors">Preview</button>
                <button type="button" role="tab" aria-selected="false" className="rounded-sm px-4 py-1.5 text-sm font-medium text-ink-dim transition-colors hover:text-ink-bright">HTML</button>
              </div>
            </Specimen>
            <Specimen name="Compact ghost" where="IdBadgeBuilder.tsx · GHOST_BTN">
              <button type="button" className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-brand hover:text-ink-bright">Upload</button>
              <button type="button" className="rounded-sm border border-line px-3 py-1.5 text-xs text-ink-dim transition-colors disabled:cursor-not-allowed disabled:opacity-40" disabled>Remove</button>
            </Specimen>
            <Specimen name="Round swatch" where="BrandCenterConfigurator.tsx · Swatch">
              <button type="button" aria-pressed="true" aria-label="Amethyst" className="flex h-11 w-11 items-center justify-center rounded-full border border-brand bg-brand ring-1 ring-brand ring-offset-2 ring-offset-surface transition-colors" />
              <button type="button" aria-pressed="false" aria-label="Monochrome" className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-ink-faint" style={{ background: "linear-gradient(135deg, #fff 50%, #14141a 50%)" }} />
            </Specimen>
            <Specimen name="Selectable tile" where="BrandCenterConfigurator.tsx · type selector">
              <button type="button" aria-pressed="true" className="flex h-16 min-w-28 items-center justify-center rounded-md border border-brand bg-bg px-3 text-sm text-ink-bright transition-colors">Wordmark</button>
              <button type="button" aria-pressed="false" className="flex h-16 min-w-28 items-center justify-center rounded-md border border-line-strong bg-bg px-3 text-sm text-ink-dim transition-colors hover:border-ink-faint">Icon</button>
            </Specimen>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle
            index="04 / ICON"
            title="Icon controls"
            lede="Navigation, copying and menu controls use compact hit areas with the icon carrying the label visually."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Specimen name="Carousel pair" where="IndustriesTabs.tsx · light section" light>
              <button type="button" aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand"><ArrowLeft /></button>
              <button type="button" aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-black text-white transition-colors hover:bg-[#1b1b1b]"><ArrowRight /></button>
            </Specimen>
            <Specimen name="Slideshow arrow" where="BrandbookDeck.tsx · outline circle">
              <button type="button" aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-brand-light hover:text-brand-light"><ArrowLeft /></button>
              <button type="button" aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-dim transition-colors disabled:opacity-30" disabled><ArrowRight /></button>
            </Specimen>
            <Specimen name="Square utility" where="EmailSignatureBuilder.tsx · copy source">
              <button type="button" aria-label="Copy HTML" className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line-strong bg-surface text-ink-dim transition-colors hover:border-brand hover:text-ink-bright"><CopyIcon /></button>
            </Specimen>
            <Specimen name="Mobile menu" where="Nav.tsx · 44px icon control">
              <button type="button" aria-label="Toggle menu" className="flex h-11 w-11 items-center justify-center rounded-sm text-ink-bright"><MenuIcon /></button>
            </Specimen>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle
            index="05 / ROW"
            title="Structural buttons"
            lede="Some full-width rows act as controls. Their hierarchy comes from the surrounding list rather than a standalone button silhouette."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen name="Service accordion" where="ServiceCatalog.tsx · expandable row">
              <button type="button" aria-expanded="false" className="flex w-full items-center justify-between gap-4 rounded-sm bg-bg px-6 py-5 text-left">
                <span className="flex flex-col gap-1">
                  <span className="font-display text-[0.9375rem] leading-[1.3125rem] text-ink-bright">Managed detection & response</span>
                  <span className="text-xs uppercase tracking-wider text-brand-light">Cybersecurity</span>
                </span>
                <span className="text-ink-faint"><PlusIcon /></span>
              </button>
            </Specimen>
            <Specimen name="FAQ summary" where="FAQ.tsx · native details / summary">
              <details className="group w-full rounded-sm bg-bg">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left font-body text-[1.125rem] leading-[1.5rem] text-ink-bright transition-colors hover:text-brand-light [&::-webkit-details-marker]:hidden">
                  <span>What does managed IT include?</span>
                  <span aria-hidden className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-[2] text-ink-dim">Support, security, continuity and technology planning.</p>
              </details>
            </Specimen>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle
            index="06 / LAB"
            title="Lab-only controls"
            lede="The pattern calibration tools intentionally use a denser, utilitarian visual language. They are catalogued here, but should not be promoted into the public system by accident."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Specimen name="Control launcher" where="PatternLab.tsx · monospace overlay action">
              <button type="button" className="rounded-sm border border-white/15 bg-black/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-2xl backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-black">Show controls</button>
            </Specimen>
            <Specimen name="Lab primary" where="PatternLab.tsx · white utility action">
              <button type="button" className="rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b8c5ca]">Copy values</button>
            </Specimen>
            <Specimen name="Lab secondary" where="PatternLab.tsx · outline utility action">
              <button type="button" className="rounded-sm border border-white/15 px-4 py-3 text-sm text-white/65 transition-colors hover:border-white/30 hover:text-white">Reset</button>
            </Specimen>
          </div>
        </section>
      </main>
    </div>
  );
}
