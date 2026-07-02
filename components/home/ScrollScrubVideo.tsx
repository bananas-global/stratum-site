"use client";

import { useEffect, useRef } from "react";

/**
 * Video whose playback position is scrubbed by scroll, like the hero.
 * Progress is measured against the nearest `.approach-card` as it
 * travels through the viewport.
 */
export default function ScrollScrubVideo({
  src,
  className,
  ariaLabel,
  reverse = false,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
  /** Play the scrub backwards so the gem spins the other way. */
  reverse?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.loop = false;
    video.autoplay = false;
    video.pause();

    const track = (video.closest(".approach-card") as HTMLElement) ?? video;
    let current = 0;
    let primed = false;
    let raf = 0;

    const loop = () => {
      if (!video.paused) video.pause();
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / total));

      if (video.duration) {
        const target = (reverse ? 1 - progress : progress) * video.duration;
        // Snap to the right frame the first time duration is known, then ease.
        current = primed ? current + (target - current) * 0.12 : target;
        primed = true;
        if (!video.seeking && Math.abs(current - video.currentTime) > 0.015) {
          video.currentTime = current;
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  return (
    <video
      ref={videoRef}
      className={className}
      aria-label={ariaLabel}
      muted
      playsInline
      preload="auto"
      src={src}
    />
  );
}
