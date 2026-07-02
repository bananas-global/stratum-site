"use client";

import { useEffect, useRef } from "react";
import { Button } from "../ui";
import ServicesShowcase from "./ServicesShowcase";
import SideRays from "./SideRays";

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
    // Reduced motion: no scroll-scrub. Just autoplay the video on a loop and
    // skip the parallax/transform. Retry on `canplay` so a not-yet-buffered
    // video still starts (load race).
    if (reduce) {
      video.loop = true;
      const tryPlay = () => video.play().catch(() => {});
      tryPlay();
      video.addEventListener("canplay", tryPlay);
      return () => video.removeEventListener("canplay", tryPlay);
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
    <section ref={containerRef} className="relative overflow-hidden">
      {/* bottom fade — sits at the section's absolute bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[100vh] bg-gradient-to-t from-black to-transparent" />
      {/* Video stage — full hero height, scrubs + parallaxes via JS on every viewport */}
      <div ref={stageRef} className="absolute left-0 right-0 top-0 h-[100svh] overflow-hidden will-change-transform">
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
        {/* vignette for text legibility — vertical scrim on mobile (text is
            centered full-width over the render), left-anchored on desktop */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85 md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent" />
        {/* Light rays — lives inside the parallax stage so it drifts with the video
            (no seam). Screen-blends over the video; never darkens it. */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <SideRays
            origin="top-right"
            rayColor1="#ffffff"
            rayColor2="#c0b3df"
            speed={2.5}
            intensity={2}
            spread={2}
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1}
          />
        </div>
      </div>

      {/* Overlaid content — hero fills the first viewport, services follows in
          normal flow. Not a fixed 200vh: that assumes hero + services sum to
          ~2 viewports, which only holds on desktop (services fits in ~100vh
          there). On mobile the stacked-card services layout is taller, so a
          hardcoded 200vh flex parent would force-shrink the hero to make
          room. The scrub/parallax math above only cares about scroll
          position relative to the section's top, not a fixed total height,
          so auto height is safe on every breakpoint. */}
      <div className="relative z-10 flex flex-col">
        {/* Hero text — first viewport, vertically centered */}
        <div className="flex h-[100svh] items-center">
          <div className="container">
            <div className="flex max-w-xl flex-col gap-5">
              <h1 data-reveal data-reveal-delay="0.05" className="font-display text-[clamp(1.875rem,3.75vw,3.1875rem)] leading-[0.97] tracking-[-0.04em]">
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

        <ServicesShowcase />
      </div>
    </section>
  );
}
