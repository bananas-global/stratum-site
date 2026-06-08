import Image from "next/image";
import { BracketLabel } from "./ui";

const PILLARS = [
  {
    name: "Structure",
    body: "We organize technology, process, support, and accountability so clients are not operating in chaos.",
    gem: "/images/gem-structure.png",
  },
  {
    name: "Security",
    body: "We protect clients from cyber risk, operational disruption, data loss, and avoidable exposure.",
    gem: "/images/gem-security.png",
  },
  {
    name: "Stability",
    body: "We build and maintain dependable systems that reduce downtime, surprises, and reactive firefighting.",
    gem: "/images/gem-stability.png",
  },
  {
    name: "Simplicity",
    body: "We make technology easier to understand, easier to use, and easier to make decisions around.",
    gem: "/images/gem-simplicity.png",
  },
  {
    name: "Stewardship",
    body: "We act as a long-term technology partner responsible for protecting the client's best interests.",
    gem: "/images/gem-stewardship.png",
  },
];

export default function StratumPillars({ className }: { className?: string }) {
  return (
    <section className={`section bg-bg ${className ?? ""}`}>
      <div className="container-prose">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <div data-reveal>
            <BracketLabel>Stratum Pillars</BracketLabel>
          </div>
          <h2 data-reveal className="display-2 text-ink-bright">
            Five commitments behind everything we do.
          </h2>
          <p data-reveal className="text-lg font-light text-ink-dim">
            Every service, every engagement, every decision is filtered through the same lens.
          </p>
        </div>

        <div className="relative mt-24 flex flex-col gap-24">
          <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/20 md:block" />

          {PILLARS.map((p, i) => {
            const rightText = i % 2 === 0;
            return (
              <div key={p.name} className="grid items-center gap-8 md:grid-cols-2 md:gap-24" data-reveal>
                {rightText ? (
                  <>
                    <div className="flex flex-col gap-2 md:items-end md:text-right">
                      <h3 className="font-display text-4xl font-medium text-ink-bright md:text-5xl">{p.name}</h3>
                      <p className="text-sm text-ink-dim md:max-w-xs">{p.body}</p>
                    </div>
                    <div className="flex justify-start">
                      <GemImg src={p.gem} alt={p.name} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="order-2 flex justify-end md:order-1">
                      <GemImg src={p.gem} alt={p.name} />
                    </div>
                    <div className="order-1 flex flex-col gap-2 md:order-2">
                      <h3 className="font-display text-4xl font-medium text-ink-bright md:text-5xl">{p.name}</h3>
                      <p className="text-sm text-ink-dim md:max-w-xs">{p.body}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GemImg({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={200}
      height={200}
      className="h-[150px] w-[150px] select-none object-contain drop-shadow-[0_0_40px_rgba(125,52,255,0.25)] md:h-[180px] md:w-[180px]"
      style={{ animation: "gemFloat 7s ease-in-out infinite" }}
      title={alt}
    />
  );
}
