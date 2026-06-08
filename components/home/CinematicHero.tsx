"use client";

import { useEffect, useRef } from "react";
import { BracketLabel, Button } from "../ui";
import ServicesShowcase from "./ServicesShowcase";

export default function CinematicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
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

      // Scrub across both the hero text and the ServicesShowcase so the video
      // is still playing (not on its last dark frame) while the showcase is visible.
      const videoRange = vh * 2.0;
      const progress = Math.max(0, Math.min(1, rel / videoRange));

      if (video.duration) {
        const target = progress * video.duration;
        current += (target - current) * 0.12;
        if (!video.seeking && Math.abs(current - video.currentTime) > 0.015) {
          video.currentTime = current;
        }
      }

      // No darkening overlay — let the video stay visible throughout.
      if (overlay) {
        overlay.style.opacity = "0";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      {/* bottom fade — non-sticky, just sits at the section's absolute bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[100vh] bg-gradient-to-t from-black to-transparent" />
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

      {/* Overlaid content — full 300vh, hero pinned to top, services pinned to bottom */}
      <div className="relative z-10 -mt-[100vh] flex h-[300vh] flex-col">
        {/* Hero text — first viewport */}
        <div className="flex h-screen items-center">
          <div className="container">
            <div className="flex max-w-xl flex-col gap-5">
              <div data-reveal>
                <BracketLabel>IT Services for the Lower Mainland</BracketLabel>
              </div>
              <h1 data-reveal data-reveal-delay="0.05" className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.97] tracking-[-0.04em] text-ink-bright">
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

        {/* Services at the bottom */}
        <div className="mt-auto">
          <ServicesShowcase />
        </div>
      </div>
    </section>
  );
}
