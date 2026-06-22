import Image from "next/image";
import ScrollScrubVideo from "./ScrollScrubVideo";

export type ApproachStep = {
  n: string;
  title: string;
  body: string;
};

const STACK_TOP = "5.5rem"; // clears fixed nav
const STACK_STEP = "1.25rem"; // peek of cards beneath

const APPROACH_IMAGES: { src: string; alt: string; video?: string; reverse?: boolean }[] = [
  {
    src: "/images/refinement/raw-environment.png",
    alt: "Raw amethyst-bearing stone representing the analysis stage.",
    video: "/videos/approach-analyze.mp4",
    reverse: true, // source spins counter-clockwise; reverse the scrub so it spins clockwise like the others
  },
  {
    src: "/images/refinement/scoped-engagement.png",
    alt: "Split stone with exposed amethyst crystals representing a scoped engagement.",
    video: "/videos/approach-engage.mp4",
  },
  {
    src: "/images/refinement/running-refined.png",
    alt: "Faceted amethyst gem representing ongoing support.",
    video: "/videos/approach-support.mp4",
  },
  {
    src: "/images/refinement/polished-partnership.png",
    alt: "Polished oval amethyst gem representing long-term client success.",
    video: "/videos/approach-success.mp4",
  },
];

function ApproachImageSlot({ index }: { index: number }) {
  const image = APPROACH_IMAGES[index] ?? APPROACH_IMAGES[0];

  return (
    <div
      className="approach-image-slot relative h-full min-h-[18rem] self-stretch overflow-hidden rounded-sm bg-white md:min-h-[20rem]"
    >
      <div className="absolute inset-0 flex translate-x-4 items-center justify-center p-4 md:translate-x-10 md:p-6">
        {image.video ? (
          <ScrollScrubVideo
            src={image.video}
            ariaLabel={image.alt}
            reverse={image.reverse}
            className="approach-image-slot-img refinement-gem-float h-full w-full max-h-[22rem] object-contain object-center"
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            width={480}
            height={480}
            className="approach-image-slot-img refinement-gem-float h-full w-full max-h-[22rem] object-contain object-center"
          />
        )}
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
              </div>

              <ApproachImageSlot index={i} />
            </article>
          </div>
        );
      })}
    </div>
  );
}
