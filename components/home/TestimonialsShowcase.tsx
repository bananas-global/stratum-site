import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "They reviewed our systems before recommending anything — and the support model actually fits how our dealership runs day to day.",
    name: "Marcus Chen",
    role: "Operations Manager · Automotive",
    avatar: "/images/testimonials/marcus-chen.png",
  },
  {
    quote:
      "What changed was accountability. We stopped chasing vendors and started working with one team that owns the full environment.",
    name: "Dr. Sarah Okonkwo",
    role: "Practice Administrator · Medical",
    avatar: "/images/testimonials/sarah-okonkwo.png",
  },
  {
    quote:
      "Document security, backup readiness, and direct access to people who know our matter workflows — not a ticket queue.",
    name: "James Whitfield",
    role: "Managing Partner · Legal",
    avatar: "/images/testimonials/james-whitfield.png",
  },
  {
    quote:
      "Connectivity, onboarding, and site support are handled with the same structure whether we are in the trailer or at head office.",
    name: "Elena Rodriguez",
    role: "Project Director · Construction",
    avatar: "/images/testimonials/elena-rodriguez.png",
  },
] as const;

const STATS = [
  {
    kind: "stat" as const,
    image: "/images/stratum-geometric-03.webp",
    value: "140+",
    label: "Businesses supported",
    sub: "Across the Lower Mainland.",
  },
  {
    kind: "google" as const,
    image: "/images/stratum-geometric-06.webp",
    value: "5.0",
    sub: "Five-star average from verified Google reviews.",
  },
];

type GridCell =
  | { kind: "testimonial"; index: number }
  | { kind: "stat"; index: number };

/** Cycle Testimonial 03 — 3×2 staggered grid: quotes + identity-style stat cards */
const GRID: GridCell[] = [
  { kind: "testimonial", index: 0 },
  { kind: "testimonial", index: 1 },
  { kind: "stat", index: 0 },
  { kind: "stat", index: 1 },
  { kind: "testimonial", index: 2 },
  { kind: "testimonial", index: 3 },
];

function Avatar({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 rounded-full object-cover object-top bg-[#e8e6ec]"
      aria-hidden="true"
    />
  );
}

function TestimonialCard({
  item,
  index,
}: {
  item: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  return (
    <figure
      data-reveal
      data-reveal-delay={`${0.05 * index}`}
      className="testimonials-cycle-card"
    >
      <blockquote className="text-base leading-relaxed text-ink-bright">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <Avatar src={item.avatar} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink-bright">{item.name}</span>
          <span className="text-xs text-ink-faint">{item.role}</span>
        </div>
      </figcaption>
    </figure>
  );
}

function IdentityStatCard({
  item,
  index,
}: {
  item: (typeof STATS)[number];
  index: number;
}) {
  return (
    <div
      data-reveal
      data-reveal-delay={`${0.05 * index}`}
      className="testimonials-cycle-stat"
    >
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />

      <div className="relative flex h-full flex-col justify-between gap-10 p-8 md:p-10">
        <div className="testimonials-stat-value font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none tracking-[-0.03em]">
          {item.value}
        </div>

        <div className="flex flex-col gap-3">
          {item.kind === "google" && (
            <div className="text-lg tracking-[0.35em] text-brand-light" aria-label="Five out of five">
              ★★★★★
            </div>
          )}
          {item.kind === "stat" && item.label && (
            <div className="font-display text-2xl leading-tight text-white">{item.label}</div>
          )}
          {item.sub && (
            <p className="max-w-xs text-sm leading-relaxed text-white/75">{item.sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsShowcase() {
  return (
    <div className="testimonials-cycle-grid">
      {GRID.map((cell, i) => {
        if (cell.kind === "testimonial") {
          const item = TESTIMONIALS[cell.index];
          return <TestimonialCard key={`t-${cell.index}`} item={item} index={i} />;
        }

        const item = STATS[cell.index];
        return <IdentityStatCard key={`s-${cell.index}`} item={item} index={i} />;
      })}
    </div>
  );
}
