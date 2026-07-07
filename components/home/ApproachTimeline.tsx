import Image from "next/image";
import ScrollScrubVideo from "./ScrollScrubVideo";

export type ApproachStep = {
  n: string;
  title: string;
  body: string;
};

const APPROACH_IMAGES: { src: string; alt: string; video?: string; reverse?: boolean }[] = [
  {
    src: "/images/refinement/raw-environment.webp",
    alt: "Raw amethyst-bearing stone representing the analysis stage.",
    video: "/videos/approach-analyze.mp4",
    reverse: true, // source spins counter-clockwise; reverse the scrub so it spins clockwise like the others
  },
  {
    src: "/images/refinement/scoped-engagement.webp",
    alt: "Split stone with exposed amethyst crystals representing a scoped engagement.",
    video: "/videos/approach-engage.mp4",
  },
  {
    src: "/images/refinement/running-refined.webp",
    alt: "Faceted amethyst gem representing ongoing support.",
    video: "/videos/approach-support.mp4",
  },
  {
    src: "/images/refinement/polished-partnership.webp",
    alt: "Polished oval amethyst gem representing long-term client success.",
    video: "/videos/approach-success.mp4",
  },
];

function ApproachImageSlot({ index }: { index: number }) {
  const image = APPROACH_IMAGES[index] ?? APPROACH_IMAGES[0];

  return (
    <div className="relative mt-auto h-44 overflow-hidden rounded-sm bg-white md:h-52">
      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-4">
        {image.video ? (
          <ScrollScrubVideo
            src={image.video}
            ariaLabel={image.alt}
            reverse={image.reverse}
            className="approach-image-slot-img h-full w-full object-contain object-center"
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            width={480}
            height={480}
            className="approach-image-slot-img h-full w-full object-contain object-center"
          />
        )}
      </div>
    </div>
  );
}

export default function ApproachTimeline({ steps }: { steps: ApproachStep[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {steps.map((step, i) => (
        <article
          key={step.n}
          className="approach-card panel-card flex flex-col gap-5 rounded-md border p-6 md:p-7"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span
                className="font-display text-[clamp(1.375rem,1.9vw,1.625rem)] leading-tight tracking-[-0.02em] text-brand-light"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="font-display text-[clamp(1.375rem,1.9vw,1.625rem)] leading-tight tracking-[-0.02em] text-ink-bright">
                {step.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-dim md:text-base">{step.body}</p>
          </div>

          <ApproachImageSlot index={i} />
        </article>
      ))}
    </div>
  );
}
