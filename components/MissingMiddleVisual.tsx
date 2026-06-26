"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Missing middle" visual: a stack of machined anodized strata with a gap in
 * the centre. As the section scrolls into view the missing middle plate slides
 * in and seats, its top edge catching the amethyst accent — the brand metaphor
 * (Stratum = layers) made literal. Plays once on entry; reduced-motion users get
 * the settled end frame as a still.
 */
export default function MissingMiddleVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    // Play once the moment the visual is comfortably in view, then disconnect.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          video.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        data-reveal
        src="/videos/missing-middle-end.jpg"
        alt="A stack of machined layers with the previously missing middle layer seated in, its edge lit in the brand accent."
        className="block h-auto w-full"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      data-reveal
      className="block h-auto w-full"
      muted
      playsInline
      preload="metadata"
      poster="/videos/missing-middle-poster.jpg"
      aria-label="A stack of machined layers; the missing middle layer slides in and seats, its edge lighting in the brand accent."
    >
      <source src="/videos/missing-middle.webm" type="video/webm" />
      <source src="/videos/missing-middle.mp4" type="video/mp4" />
    </video>
  );
}
