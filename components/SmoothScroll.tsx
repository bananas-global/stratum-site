"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth scroll (created once, persists across client navigations) plus a
 * per-route scroll-reveal engine. Reveals use IntersectionObserver + a CSS class
 * so content can NEVER get stuck invisible:
 *   - the hidden state only applies while `html.reveal-ready` is set (JS on);
 *   - anything already in view reveals immediately;
 *   - a failsafe reveals everything after a few seconds no matter what.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // ── Lenis: create once ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Reveals: re-run on every route change ──
  useEffect(() => {
    // Start each page at the top.
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const reveal = (el: HTMLElement) => {
      const delay = parseFloat(el.dataset.revealDelay || "0");
      el.style.transitionDelay = delay ? `${delay}s` : "";
      // Inline styles beat any stylesheet rule, regardless of cascade layers.
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach(reveal);
      return;
    }

    // Observe every element. The observer fires for whatever is already in
    // view (revealing it immediately) and for the rest as they scroll in —
    // no manual position math, no rAF timing to get wrong.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));

    // Failsafe: never leave content stuck hidden.
    const failsafe = window.setTimeout(() => els.forEach(reveal), 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
