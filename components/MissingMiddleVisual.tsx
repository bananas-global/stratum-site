"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed "missing middle" visual: two circles (break-fix IT and a
 * full internal team) converge as the section crosses the viewport, and the
 * intersection lights up in the brand accent. Same rAF + viewport-math scrub
 * pattern as CinematicHero; once fully converged the lens breathes gently.
 */

// Circle geometry in the 640x400 viewBox: [start cx, end cx].
const SMALL = { r: 78, cy: 186, from: 128, to: 268 };
const BIG = { r: 118, cy: 186, from: 512, to: 392 };

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function MissingMiddleVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<SVGCircleElement>(null);
  const bigRef = useRef<SVGCircleElement>(null);
  const clipRef = useRef<SVGCircleElement>(null);
  const lensRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const render = (progress: number, breathe: number) => {
      const e = easeInOut(progress);
      const drift = progress >= 0.999 ? Math.sin(breathe) * 3 : 0;
      const sx = SMALL.from + (SMALL.to - SMALL.from) * e + drift;
      const bx = BIG.from + (BIG.to - BIG.from) * e - drift;

      smallRef.current?.setAttribute("cx", String(sx));
      clipRef.current?.setAttribute("cx", String(sx));
      bigRef.current?.setAttribute("cx", String(bx));
      lensRef.current?.setAttribute("cx", String(bx));

      lensRef.current?.setAttribute("opacity", String(clamp01((e - 0.62) / 0.3)));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(1, 0);
      return;
    }

    let current = 0;
    let breathe = 0;
    let raf = 0;

    const loop = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Converge as the visual travels from 85% to 40% of the viewport height.
      const target = clamp01((vh * 0.85 - rect.top) / (vh * 0.45));
      current += (target - current) * 0.1;
      if (current > 0.999) {
        current = Math.max(current, target === 1 ? 1 : current);
        breathe += 0.025;
      }
      render(current, breathe);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={containerRef} data-reveal>
      <svg
        viewBox="0 0 640 372"
        className="block h-auto w-full"
        role="img"
        aria-label="Two circles converging; their intersection — the missing middle — highlighted in purple."
      >
        <circle ref={smallRef} cx={SMALL.from} cy={SMALL.cy} r={SMALL.r} fill="#d9d9d9" />
        <circle ref={bigRef} cx={BIG.from} cy={BIG.cy} r={BIG.r} fill="#d9d9d9" />
        <clipPath id="missing-middle-clip">
          <circle ref={clipRef} cx={SMALL.from} cy={SMALL.cy} r={SMALL.r} />
        </clipPath>
        <circle
          ref={lensRef}
          cx={BIG.from}
          cy={BIG.cy}
          r={BIG.r}
          fill="var(--color-brand)"
          clipPath="url(#missing-middle-clip)"
          opacity="0"
        />
      </svg>
    </div>
  );
}
