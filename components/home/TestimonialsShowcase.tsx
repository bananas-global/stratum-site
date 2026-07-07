import Image from "next/image";

// Real testimonials carried over from the previous Stratum Systems site.
const TESTIMONIALS = [
  {
    quote:
      "Stratum has been a great IT company for our small business. Their attention to detail, service and response time has been great. The staff are very knowledgeable and they take the time to look into our problems as they come up.",
    name: "Van Arbour Design",
    role: "Google review",
  },
  {
    quote:
      "Love being able to rely on this team for all of our server and tech related needs or issues at Crown Door. We always receive punctual service with issues being resolved in a timely manner by a very professional team.",
    name: "Crown Door",
    role: "Google review",
  },
  {
    quote:
      "We've used Stratum for years and have always been pleased with their quick responses and professional service.",
    name: "Nadine H.",
    role: "Google review",
  },
  {
    quote:
      "Their staff are very knowledgeable and friendly and make sure whatever issues we have are taken care of promptly. I very much recommended them for any small to medium sized business.",
    name: "Chris W.",
    role: "Google review",
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

/** Initials in the same 40px circle the photo avatars used — these are real
 *  clients, so no stock/generated faces. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-xs font-semibold tracking-wide text-brand-light"
    >
      {initials}
    </span>
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
        <Avatar name={item.name} />
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
        <div className="testimonials-stat-value font-display text-[clamp(1.875rem,3vw,2.625rem)] leading-none tracking-[-0.03em]">
          {item.value}
        </div>

        <div className="flex flex-col gap-3">
          {item.kind === "google" && (
            <div className="text-lg tracking-[0.35em] text-brand-light" aria-label="Five out of five">
              ★★★★★
            </div>
          )}
          {item.kind === "stat" && item.label && (
            <div className="font-display text-[1.125rem] leading-tight text-white">{item.label}</div>
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
