"use client";

import { useEffect, useRef } from "react";

/**
 * Video whose playback position is scrubbed by scroll, like the hero.
 * Progress is measured against the nearest `.approach-card` as it
 * travels through the viewport.
 */
export default function ScrollScrubVideo({
  src,
  poster,
  className,
  reverse = false,
}: {
  src: string;
  poster: string;
  className?: string;
  /** Play the scrub backwards so the gem spins the other way. */
  reverse?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animate = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    if (!animate.matches) return;

    video.loop = false;
    video.autoplay = false;
    video.pause();

    const track = (video.closest(".approach-card") as HTMLElement) ?? video;
    let current = 0;
    let primed = false;
    let raf = 0;
    let loaded = false;
    let visible = false;

    const update = () => {
      raf = 0;
      if (!visible || !loaded || !video.duration) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / total));
      const target = (reverse ? 1 - progress : progress) * video.duration;
      current = primed ? current + (target - current) * 0.35 : target;
      primed = true;
      if (!video.seeking && Math.abs(current - video.currentTime) > 0.03) {
        video.currentTime = current;
      }
    };

    const requestUpdate = () => {
      if (!raf && visible) raf = requestAnimationFrame(update);
    };

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loaded) return;
        loaded = true;
        video.src = src;
        video.load();
        loadObserver.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) requestUpdate();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "120px 0px" },
    );

    const onLoadedMetadata = () => requestUpdate();
    loadObserver.observe(track);
    visibilityObserver.observe(track);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      loadObserver.disconnect();
      visibilityObserver.disconnect();
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [reverse, src]);

  return (
    <video
      ref={videoRef}
      className={className}
      aria-hidden="true"
      tabIndex={-1}
      muted
      playsInline
      preload="none"
      poster={poster}
    />
  );
}
