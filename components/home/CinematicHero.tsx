"use client";

import { useEffect, useRef } from "react";
import { Button } from "../ui";
import ServicesShowcase from "./ServicesShowcase";

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
    if (reduce) {
      video.play().catch(() => {});
      return;
    }

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
    <section ref={containerRef} className="relative h-[200vh] overflow-hidden">
      {/* bottom fade — non-sticky, just sits at the section's absolute bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[100vh] bg-gradient-to-t from-black to-transparent" />
      {/* Scrubbed video — pinned then parallax-drifted via JS transform */}
      <div ref={stageRef} className="absolute left-0 right-0 top-0 h-screen overflow-hidden will-change-transform">
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
        {/* vignette for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Overlaid content — full 300vh, hero pinned to top, services pinned to bottom */}
      <div className="relative z-10 flex h-[200vh] flex-col">
        {/* Hero text — first viewport */}
        <div className="flex h-screen items-center">
          <div className="container">
            <div className="flex max-w-xl flex-col gap-5">
              <h1 data-reveal data-reveal-delay="0.05" className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.97] tracking-[-0.04em]">
                The{" "}
                <span className="bg-gradient-to-br from-brand-light via-brand to-brand-dark bg-clip-text text-transparent">
                  structure
                </span>{" "}
                behind dependable technology
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

        {/* Services at the bottom */}
        <div className="mt-auto">
          <ServicesShowcase />
        </div>
      </div>
    </section>
  );
}
