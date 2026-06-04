"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BracketLabel, Button } from "../ui";

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

export default function CinematicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const bar = barRef.current;
    if (!container || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.play().catch(() => {});
      return;
    }

    video.loop = false;
    video.autoplay = false;
    video.pause();

    let current = 0;
    let raf = 0;

    const loop = () => {
      if (!video.paused) video.pause();
      const top = container.getBoundingClientRect().top + window.scrollY;
      const rel = window.scrollY - top; // px scrolled within the hero container
      const vh = window.innerHeight || 1;

      // The clip is short — scrub it to the end within the first fold so it's
      // fully played by the time the pillars (second fold) come into view,
      // then it just holds its last frame behind the darkening overlay.
      const videoRange = vh * 0.9;
      const progress = Math.max(0, Math.min(1, rel / videoRange));

      if (video.duration) {
        const target = progress * video.duration;
        current += (target - current) * 0.12;
        if (!video.seeking && Math.abs(current - video.currentTime) > 0.015) {
          video.currentTime = current;
        }
      }

      // Darken into black as we leave the hero and the pillars arrive.
      if (overlay) {
        const blackness = Math.max(0, Math.min(1, (rel - vh * 0.7) / (vh * 0.6)));
        overlay.style.opacity = String(blackness);
      }

      // timeline progress bar fill
      if (bar) {
        const r = bar.parentElement!.getBoundingClientRect();
        const fill = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - r.top) / r.height));
        bar.style.height = `${fill * 100}%`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[350vh]">
      {/* Sticky scrubbed video */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster="/videos/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/hero_stratum_mp4.mp4" type="video/mp4" />
          <source src="/videos/hero_stratum_webm.webm" type="video/webm" />
        </video>
        {/* darkening overlay driven by scroll */}
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0 }} />
        {/* vignette for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Overlaid content */}
      <div className="relative z-10 -mt-[100vh]">
        {/* Hero text — first viewport */}
        <div className="flex h-screen items-center">
          <div className="container">
            <div className="flex max-w-xl flex-col gap-5">
              <div data-reveal>
                <BracketLabel>IT Services for the Lower Mainland</BracketLabel>
              </div>
              <h1 data-reveal data-reveal-delay="0.05" className="display-1 text-ink-bright">
                The structure behind dependable technology
              </h1>
              <p data-reveal data-reveal-delay="0.12" className="max-w-sm text-lg font-light leading-relaxed text-ink-dim">
                Stratum brings structure, security, and long-term stewardship to the systems your business
                depends on every day.
              </p>
              <div data-reveal data-reveal-delay="0.18" className="mt-4">
                <Button href="/contact">Talk to a human</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Five pillars — gem timeline */}
        <div className="pb-[10vh] pt-[20vh]">
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

            {/* Timeline */}
            <div className="relative mt-24 flex flex-col gap-24">
              {/* center rail */}
              <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/20 md:block">
                <div ref={barRef} className="w-px bg-brand" style={{ height: "0%" }} />
              </div>

              {PILLARS.map((p, i) => {
                const rightText = i % 2 === 0;
                return (
                  <div
                    key={p.name}
                    className="grid items-center gap-8 md:grid-cols-2 md:gap-24"
                    data-reveal
                  >
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
