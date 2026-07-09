import type { ReactNode } from "react";
import Image from "next/image";
import { BracketLabel, Button, SectionHeader } from "./ui";
import { IconPattern } from "./IconPattern";

export type EditorialVisual = {
  src: string;
  alt: string;
  label?: string;
  caption?: string;
  contain?: boolean;
};

export function EditorialPanel({
  visual,
  className = "",
  priority,
}: {
  visual: EditorialVisual;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      data-reveal
      className={`group relative overflow-hidden rounded-md border border-line-soft bg-surface ${className}`.trim()}
    >
      <div className="relative aspect-[16/10] min-h-[260px]">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 44vw, 90vw"
          className={`transition-transform duration-700 group-hover:scale-[1.025] ${
            visual.contain ? "object-contain p-10" : "object-cover"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
      </div>
      {(visual.label || visual.caption) && (
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          {visual.label && (
            <span className="w-fit rounded-sm border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint backdrop-blur">
              {visual.label}
            </span>
          )}
          {visual.caption && <span className="max-w-md text-sm leading-relaxed text-ink-dim">{visual.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function CardMedia({ visual }: { visual: EditorialVisual }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-black">
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        className={visual.contain ? "object-contain p-4" : "object-cover"}
      />
    </div>
  );
}

/* ── Page hero (inner pages) ──────────────────────────────── */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-2">
          {it.href ? (
            <a href={it.href} className="transition-colors hover:text-ink-bright">
              {it.label}
            </a>
          ) : (
            <span className="text-ink-dim">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="opacity-50">›</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  lede,
  backgroundVisual,
  backgroundPattern,
  visual,
  children,
}: {
  breadcrumb: { label: string; href?: string }[];
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  backgroundVisual?: Pick<EditorialVisual, "src" | "alt">;
  /** Fill the hero with the live Stratum-icon tiling instead of an image. */
  backgroundPattern?: boolean;
  visual?: EditorialVisual;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pb-20 md:pt-48">
      {backgroundPattern && (
        <div className="pointer-events-none absolute inset-0">
          <IconPattern color="#000000" scale={0.34} />
          {/* Readability scrim: solid black on the left fading to transparent on the right,
              so heading + lede stay legible over the pattern. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
      )}
      {backgroundVisual && (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={backgroundVisual.src}
            alt={backgroundVisual.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[66%_42%]"
          />
          {/* Readability scrim: solid black on the left fading to transparent on the right,
              so heading + lede stay legible over the lighter Nano Banana hero renders. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
      )}
      {/* ambient brand glow — omitted on the pattern hero to keep it neutral */}
      {!backgroundPattern && (
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      )}
      <div
        className={`container relative grid gap-12 ${
          visual ? "items-end lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.72fr)]" : ""
        }`.trim()}
      >
        <div className="flex flex-col gap-6">
          <div data-reveal>
            <Breadcrumb items={breadcrumb} />
          </div>
          <div data-reveal data-reveal-delay="0.05" className="mt-2">
            <BracketLabel>{eyebrow}</BracketLabel>
          </div>
          <h1 data-reveal data-reveal-delay="0.1" className="display-1 max-w-4xl text-ink-bright">
            {title}
          </h1>
          <p data-reveal data-reveal-delay="0.16" className="max-w-2xl text-xl font-light leading-relaxed text-ink-dim">
            {lede}
          </p>
          {children && (
            <div data-reveal data-reveal-delay="0.22" className="mt-4">
              {children}
            </div>
          )}
        </div>
        {visual && <EditorialPanel visual={visual} priority className="lg:mb-2" />}
      </div>
    </section>
  );
}

/* ── Scope grid (label + small subtext) ───────────────────── */
export function ScopeGrid({
  items,
  cols = 3,
}: {
  items: { label: string; sub: string; image?: string }[];
  cols?: 2 | 3 | 4;
}) {
  const colCls = cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <div className={`grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft ${colCls}`}>
      {items.map((it) =>
        it.image ? (
          // Image card: the standardized 8:5 render is anchored to the bottom at its
          // natural (full-width) size; the taller card leaves extra white space at the
          // top for the overlaid text.
          <div
            key={it.label}
            className="relative aspect-[5/4] overflow-hidden bg-surface"
          >
            <Image
              src={it.image}
              alt=""
              width={1600}
              height={1000}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="absolute inset-x-0 bottom-0 w-full h-auto"
            />
            <div className="relative flex flex-col gap-2 p-6">
              <span className="font-medium text-ink-bright">{it.label}</span>
              <span className="text-sm leading-relaxed text-ink-dim">{it.sub}</span>
            </div>
          </div>
        ) : (
          <div key={it.label} className="flex flex-col gap-2 bg-surface p-6">
            <span className="font-medium text-ink-bright">{it.label}</span>
            <span className="text-sm leading-relaxed text-ink-dim">{it.sub}</span>
          </div>
        ),
      )}
    </div>
  );
}

/* ── Feature card grid (heading + body) ───────────────────── */
/* Glossy amethyst app-icon tile — same treatment as the active card in the
   homepage "Who we work with" carousel. */
function FeatureIconTile({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex h-16 w-16 items-center justify-center overflow-hidden"
      style={{
        borderRadius: "1.15rem",
        background: "#f7f4fc",
        border: "1px solid rgba(125, 52, 255, 0.2)",
        boxShadow: "0 10px 28px -10px rgba(125, 52, 255, 0.28)",
      }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute"
        style={{
          inset: "1px",
          borderRadius: "calc(1.15rem - 1px)",
          background: "linear-gradient(165deg, #ffffff 0%, #ede5ff 48%, #c9a8ff 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(125, 52, 255, 0.18), transparent 72%)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }}
      />
      <span
        className="relative [&>svg]:h-7 [&>svg]:w-7"
        style={{ color: "var(--color-brand)", filter: "drop-shadow(0 1px 2px rgba(125, 52, 255, 0.2))" }}
      >
        {children}
      </span>
    </div>
  );
}

export function FeatureGrid({
  items,
  cols = 3,
}: {
  items: { title: string; body: ReactNode; icon?: ReactNode }[];
  cols?: 2 | 3 | 4;
}) {
  const colCls = cols === 2 ? "md:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <div className={`grid gap-4 ${colCls}`}>
      {items.map((it) => (
        <div key={it.title} className="card flex flex-col gap-3">
          {it.icon ? (
            <FeatureIconTile>{it.icon}</FeatureIconTile>
          ) : (
            <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
          )}
          <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">{it.title}</h3>
          <p className="text-sm leading-relaxed text-ink-dim">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Numbered feature list (editorial rows with dividers) ─── */
export function FeatureList({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <div className="flex flex-col divide-y divide-line-soft border-y border-line-soft">
      {items.map((it, i) => (
        <div
          key={it.title}
          data-reveal
          data-reveal-delay={i * 0.05 || undefined}
          className="grid gap-2 py-7 md:grid-cols-[3.5rem_minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-baseline md:gap-10"
        >
          <span className="font-display text-[0.9375rem] leading-[1.3125rem] text-brand-light">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright md:text-[1.40625rem] md:leading-[1.6875rem]">{it.title}</h3>
          <p className="max-w-xl text-sm leading-relaxed text-ink-dim">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Numbered process steps ───────────────────────────────── */
export function HowSteps({ steps }: { steps: { n: string; title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <div key={s.n} className="panel-card flex flex-col gap-4 rounded-md border p-6">
          <span className="font-display text-[1.40625rem] leading-[1.6875rem] text-brand-light">{s.n}</span>
          <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">{s.title}</h3>
          <p className="text-sm leading-relaxed text-ink-dim">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Outcome / stat strip ─────────────────────────────────── */
export function OutcomeStrip({ items }: { items: { value: string; label: string; sub?: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1 bg-surface p-8">
          <span className="font-display text-[2.25rem] leading-none text-ink-bright">{it.value}</span>
          <span className="mt-2 font-medium text-ink">{it.label}</span>
          {it.sub && <span className="text-sm text-ink-faint">{it.sub}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── Generic band wrapper ─────────────────────────────────── */
export function Band({
  tone = "default",
  children,
  className = "",
}: {
  tone?: "default" | "surface" | "dark";
  children: ReactNode;
  className?: string;
}) {
  const bg = tone === "surface" ? "bg-surface" : tone === "dark" ? "bg-black" : "bg-bg";
  return (
    <section className={`section ${bg} ${className}`.trim()}>
      <div className="container flex flex-col gap-12">{children}</div>
    </section>
  );
}

export { SectionHeader, Button };
