"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui";
import ServicesShowcase from "./ServicesShowcase";
import SideRays from "./SideRays";

const RAYS = {
  origin: "top-right" as const,
  rayColor1: "#ffffff",
  rayColor2: "#c0b3df",
  speed: 2.5,
  intensity: 2,
  spread: 2,
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 1.6,
  opacity: 1,
};

export default function CinematicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    if (!container || !video || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // Mobile has no video — a static image hero instead (see render below), so
    // there's nothing to scrub. Reduced motion skips the scroll-driven scrub too.
    if (reduce || isMobile) return;

    video.loop = false;
    video.autoplay = false;
    video.pause();

    let current = -1; // sentinel: snap to target on first frame (avoids load animation)
    let raf = 0;

    const loop = () => {
      if (!video.paused) video.pause();
      const top = container.getBoundingClientRect().top + window.scrollY;
      const rel = window.scrollY - top; // px scrolled within the hero container
      const vh = window.innerHeight || 1;

      // Scrub across both the hero text and the ServicesShowcase so the video
      // is still playing (not on its last dark frame) while the showcase is visible.
      const videoRange = vh * 0.5;
      const progress = Math.max(0, Math.min(1, rel / videoRange));

      if (video.duration) {
        // v2 was rendered bottom-up, so play it in reverse: scrolling down winds
        // currentTime from the end toward the start, making the motion read downward.
        // Clamp away from the exact end: seeking to currentTime === duration lands
        // past the last decodable frame and most browsers paint a black frame there.
        const end = video.duration - 0.05;
        const target = (1 - progress) * end;
        current = current < 0 ? target : current + (target - current) * 0.3;
        if (!video.seeking && Math.abs(current - video.currentTime) > 0.015) {
          video.currentTime = current;
        }
      }

      // No darkening overlay — let the video stay visible throughout.
      if (overlay) {
        overlay.style.opacity = "0";
      }

      // Parallax: keep the video pinned to the top of the viewport while it's
      // scrubbing, then — right where the scrub finishes (parallaxStart) — let it
      // drift up at a fraction of scroll speed so it lags behind the page content.
      const parallaxStart = videoRange;
      const PARALLAX = 0.5; // <1 = video moves slower than content (depth)
      const ty =
        rel < parallaxStart ? rel : rel - (rel - parallaxStart) * PARALLAX;
      stage.style.transform = `translate3d(0, ${ty}px, 0)`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={containerRef} className="relative md:h-[200vh] md:overflow-hidden">
      {/* bottom fade — desktop only; sits at the 200vh section's absolute bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] hidden h-[100vh] bg-gradient-to-t from-black to-transparent md:block" />

      {/* Mobile hero — static image, no scroll JS. Replaces a scroll-scrubbed
          video that was unusably heavy on phones; light rays still layer on top. */}
      <div className="absolute inset-0 h-[100svh] overflow-hidden md:hidden">
        <Image src="/images/hero-mobile.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <SideRays {...RAYS} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Desktop video stage — scrubs + parallaxes via JS */}
      <div ref={stageRef} className="absolute left-0 right-0 top-0 hidden h-screen overflow-hidden will-change-transform md:block">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster="/videos/hero-poster-v2.jpg"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/hero_stratum_v2.mp4" type="video/mp4" />
        </video>
        {/* darkening overlay driven by scroll */}
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0 }} />
        {/* vignette for text legibility — left-anchored on desktop */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        {/* Light rays — lives inside the parallax stage so it drifts with the video
            (no seam). Screen-blends over the video; never darkens it. */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <SideRays {...RAYS} />
        </div>
      </div>

      {/* Overlaid content. Mobile: auto height — a 100svh hero, then the services
          showcase in normal flow. Desktop: 200vh with the showcase pinned bottom. */}
      <div className="relative z-10 flex flex-col md:h-[200vh]">
        {/* Hero text — first viewport, vertically centered on every breakpoint */}
        <div className="flex h-[100svh] items-start pt-[26svh] md:h-screen md:items-center md:pt-0">
          <div className="container">
            <div className="flex max-w-xl flex-col gap-5">
              <h1 data-reveal data-reveal-delay="0.05" className="font-display text-[clamp(1.875rem,3.75vw,3.1875rem)] leading-[1.1] tracking-[-0.04em]">
                Structure behind dependable technology
              </h1>
              <p data-reveal data-reveal-delay="0.12" className="max-w-sm text-lg font-light leading-relaxed text-ink-dim">
                Stratum brings structure, security, and long-term stewardship to the systems your business
                depends on every day.
              </p>
              <div data-reveal data-reveal-delay="0.18" className="mt-4">
                <Button href="/contact">Get in touch</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services — normal flow on mobile, pinned to the bottom of the 200vh on desktop */}
        <div className="md:mt-auto">
          <ServicesShowcase />
        </div>
      </div>
    </section>
  );
}
