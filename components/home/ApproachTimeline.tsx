import Image from "next/image";

export type ApproachStep = {
  n: string;
  title: string;
  body: string;
};

const REFINEMENT_STAGES = [
  {
    gem: "/images/gem-structure.png",
    label: "Raw environment",
    sub: "Unstructured systems, unclear ownership",
    alt: "Rough amethyst gem representing an unstructured technology environment.",
  },
  {
    gem: "/images/gem-stability.png",
    label: "Scoped engagement",
    sub: "Sized around how you actually operate",
    alt: "Partially formed amethyst gem representing a scoped engagement.",
  },
  {
    gem: "/images/gem-simplicity.png",
    label: "Running & refined",
    sub: "Support rhythm, fewer surprises",
    alt: "Refined amethyst gem representing ongoing operational clarity.",
  },
  {
    gem: "/images/gem-stewardship.png",
    label: "Polished partnership",
    sub: "Structured, trusted, long-term",
    alt: "Polished amethyst gem representing a fully stewarded partnership.",
  },
];

const STACK_TOP = "5.5rem"; // clears fixed nav
const STACK_STEP = "1.25rem"; // peek of cards beneath

function RefinementCard({ index }: { index: number }) {
  const stage = REFINEMENT_STAGES[index] ?? REFINEMENT_STAGES[0];

  return (
    <div className="mt-6 flex max-w-md items-center gap-4 rounded-md border border-line bg-surface/90 p-4 shadow-[0_1px_3px_rgba(18,18,28,0.04)]">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="text-sm font-semibold text-ink-bright">{stage.label}</div>
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <GemSparkIcon />
          <span>{stage.sub}</span>
        </div>
      </div>

      <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-visible">
        <div className="refinement-gem-float relative h-full w-full">
          <Image
            src={stage.gem}
            alt={stage.alt}
            fill
            sizes="88px"
            className="object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
}

function GemSparkIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`shrink-0 text-brand ${className}`} aria-hidden="true">
      <path d="M6 1.2 7.4 4.6 10.8 6 7.4 7.4 6 10.8 4.6 7.4 1.2 6 4.6 4.6 6 1.2Z" />
    </svg>
  );
}

const APPROACH_IMAGES = [
  {
    src: "/images/approach/analyze.png",
    alt: "Glossy magnifying glass icon representing environment analysis.",
  },
  {
    src: "/images/approach/engage.png",
    alt: "Glossy padlock icon representing a scoped, secure engagement.",
  },
  {
    src: "/images/approach/support.png",
    alt: "Glossy shield icon representing ongoing support and protection.",
  },
  {
    src: "/images/approach/success.png",
    alt: "Glossy medallion icon representing long-term client success.",
  },
];

function ApproachImageSlot({ index }: { index: number }) {
  const image = APPROACH_IMAGES[index] ?? APPROACH_IMAGES[0];

  return (
    <div
      className="approach-image-slot relative h-full min-h-[14rem] self-stretch overflow-hidden rounded-sm bg-white"
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
        <Image
          src={image.src}
          alt={image.alt}
          width={480}
          height={480}
          className="approach-image-slot-img h-full w-full max-h-[18rem] object-contain object-center"
        />
      </div>
    </div>
  );
}

export default function ApproachTimeline({ steps }: { steps: ApproachStep[] }) {
  const last = steps.length - 1;

  return (
    <div className="approach-stack">
      {steps.map((step, i) => {
        const isLast = i === last;

        return (
          <div
            key={step.n}
            className={isLast ? "approach-stack-item is-last" : "approach-stack-item"}
          >
            <article
              className="approach-stack-card panel-card relative grid grid-cols-1 items-stretch gap-8 overflow-hidden rounded-md border p-6 md:grid-cols-2 md:gap-12 md:p-8"
              style={{
                top: `calc(${STACK_TOP} + ${i} * ${STACK_STEP})`,
                zIndex: i + 1,
              }}
            >
              <span
                className="pointer-events-none absolute left-6 top-6 z-10 font-display text-[clamp(3rem,7vw,4.5rem)] leading-none tracking-[-0.04em] text-brand-light/80 md:left-8 md:top-8"
                aria-hidden="true"
              >
                {step.n}
              </span>

              <div className="flex flex-col gap-4 pt-16 md:pt-20">
                <h3 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] leading-tight tracking-[-0.02em] text-ink-bright">
                  {step.title}
                </h3>
                <div className="h-px w-full max-w-[12rem] bg-line" />
                <p className="max-w-lg text-sm leading-relaxed text-ink-dim md:text-base">{step.body}</p>
                <RefinementCard index={i} />
              </div>

              <ApproachImageSlot index={i} />
            </article>
          </div>
        );
      })}
    </div>
  );
}
