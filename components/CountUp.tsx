"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Scroll-triggered number count-up.
 * Mirrors the reference "FlowbaseCountup" config: power3.inOut easing, 2s duration,
 * 0.35s delay, fired once via IntersectionObserver. Parses a leading number
 * (optional decimals / thousands separators) plus a trailing suffix like "+" or "%".
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\d[\d,]*\.?\d*)(.*)$/);
    if (!match) {
      el.textContent = value;
      return;
    }

    const numStr = match[1].replace(/,/g, "");
    const target = parseFloat(numStr);
    const suffix = match[2] || "";
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const useCommas = match[1].includes(",");

    const render = (n: number) => {
      const fixed = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
      const out = useCommas
        ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : fixed;
      el.textContent = out + suffix;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      render(target);
      return;
    }

    render(0);

    const counter = { v: 0 };
    let tween: gsap.core.Tween | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(el);
          tween = gsap.to(counter, {
            v: target,
            duration: 2,
            delay: 0.35,
            ease: "power3.inOut",
            onUpdate: () => render(counter.v),
          });
        });
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [value]);

  // SSR / no-JS fallback shows the final value; client resets to 0 then animates in.
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
