"use client";

import { useEffect, useRef } from "react";

type Factor = { label: string; value: number };

/**
 * "How we size engagements" grid — each factor shows a quantity bar whose
 * fill scrubs with scroll: empty as the grid enters the viewport, at its
 * target value once the grid settles in view. Reversible on scroll-up.
 */
export default function SizingFactorsGrid({ factors }: { factors: Factor[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const fills = Array.from(grid.querySelectorAll<HTMLElement>("[data-fill]"));

    const setProgress = (p: number) => {
      fills.forEach((fill) => {
        const target = parseFloat(fill.dataset.fill || "0");
        fill.style.width = `${target * p * 100}%`;
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    const onScroll = () => {
      const rect = grid.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the grid top enters the viewport bottom, 1 once it reaches ~45% up.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.55)));
      // easeOutCubic for a settled, non-linear feel
      setProgress(1 - Math.pow(1 - p, 3));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      data-reveal
      className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-3 lg:grid-cols-4"
    >
      {factors.map((f) => (
        <div key={f.label} className="flex flex-col gap-4 bg-bg p-6">
          <div
            className="relative h-3 w-full overflow-hidden rounded-[2px] border border-brand/35"
            style={{
              background:
                "repeating-linear-gradient(135deg, rgba(125,52,255,0.32) 0 2px, rgba(125,52,255,0.06) 2px 7px)",
            }}
            role="img"
            aria-label={`${f.label} — relative weight ${Math.round(f.value * 100)}%`}
          >
            <span
              data-fill={f.value}
              className="absolute inset-y-0 left-0 block"
              style={{
                width: 0,
                background:
                  "linear-gradient(90deg, #ffffff 0%, var(--color-brand-light) 55%, var(--color-brand) 100%)",
                willChange: "width",
              }}
            />
          </div>
          <span className="font-medium text-ink-bright">{f.label}</span>
        </div>
      ))}
    </div>
  );
}
