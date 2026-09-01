import { Button } from "../ui";
import HeroPatternBackground from "./HeroPatternBackground";
import ServicesShowcase from "./ServicesShowcase";

export default function CinematicHero() {
  return (
    <>
      <section className="section-light relative h-[680px] overflow-hidden md:h-[760px] xl:h-[820px]">
        <HeroPatternBackground />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-white/60 to-transparent" />

        <div className="pointer-events-none relative z-10 flex h-full items-start pt-44 md:items-center md:pt-0">
          <div className="container">
            <div className="pointer-events-auto flex max-w-xl flex-col gap-5">
              <h1
                className="font-display text-[clamp(1.875rem,3.75vw,3.1875rem)] leading-[1.1] tracking-[-0.04em]"
              >
                Structure behind dependable technology
              </h1>
              <p
                className="max-w-sm text-lg font-light leading-relaxed text-ink-dim"
              >
                Stratum brings structure, security, and long-term stewardship to the systems your business
                depends on every day.
              </p>
              <div className="mt-4">
                <Button href="/contact">
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesShowcase />
    </>
  );
}
