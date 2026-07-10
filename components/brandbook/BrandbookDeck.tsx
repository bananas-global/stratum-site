"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SLIDES } from "./slides";

/* ────────────────────────────────────────────────────────────────
   BrandbookDeck — full-screen presentation shell.

   Renders each 1920×1080 slide on a fixed stage scaled to fit the
   viewport (contain). Navigation: ← → (plus space / page keys /
   Home / End), click left/right edge, or the on-screen controls.
   Esc returns to Brand Center. The current slide is mirrored to the
   URL hash so a slide can be shared.
   ──────────────────────────────────────────────────────────────── */

const STAGE_W = 1920;
const STAGE_H = 1080;

type LenisLike = { stop: () => void; start: () => void };

function pageLenis(): LenisLike | undefined {
  return (window as unknown as { lenis?: LenisLike }).lenis;
}

function slideFromHash(): number {
  const n = parseInt(window.location.hash.slice(1), 10);
  return Number.isFinite(n) && n >= 1 && n <= SLIDES.length ? n - 1 : 0;
}

export default function BrandbookDeck() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    setIndex(Math.min(SLIDES.length - 1, Math.max(0, next)));
  }, []);

  /* Restore slide from the URL hash, then keep the hash in sync. */
  useEffect(() => {
    setIndex(slideFromHash());
  }, []);
  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  /* Fit the 1920×1080 stage to the viewport. */
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  /* Lock page scroll (and Lenis) while presenting. */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pageLenis()?.stop();
    return () => {
      document.body.style.overflow = prev;
      pageLenis()?.start();
    };
  }, []);

  /* Keyboard navigation. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          go(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(index - 1);
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(SLIDES.length - 1);
          break;
        case "Escape":
          router.push("/brand-center");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, router]);

  /* Fade the controls out when the mouse goes idle. */
  useEffect(() => {
    const poke = () => {
      setChromeVisible(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setChromeVisible(false), 3500);
    };
    poke();
    window.addEventListener("mousemove", poke);
    return () => {
      window.removeEventListener("mousemove", poke);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  /* Click to advance (left quarter = back), unless a control was hit. */
  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (e.clientX < window.innerWidth / 4) go(index - 1);
    else go(index + 1);
  };

  const slide = SLIDES[index];

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black"
      onClick={onStageClick}
      role="application"
      aria-label="Stratum brandbook presentation"
    >
      {/* Stage — renders current slide plus hidden neighbours so their images stay warm. */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            flexShrink: 0,
            position: "relative",
            visibility: scale === 0 ? "hidden" : undefined,
          }}
        >
          {SLIDES.map((s, i) =>
            Math.abs(i - index) <= 1 ? (
              <div
                key={s.label}
                style={{
                  position: "absolute",
                  inset: 0,
                  visibility: i === index ? "visible" : "hidden",
                  opacity: i === index ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
                aria-hidden={i !== index}
              >
                {s.content}
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* Progress rail */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
        <div
          className="h-full bg-brand transition-[width] duration-300"
          style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Top chrome */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-4 transition-opacity duration-500"
        style={{ opacity: chromeVisible ? 1 : 0, pointerEvents: chromeVisible ? "auto" : "none" }}
      >
        <span className="bracket-label text-white/40">Brand guidelines</span>
        <Link
          href="/brand-center"
          className="flex items-center gap-3 text-sm text-ink-dim transition-colors hover:text-brand-light"
        >
          Exit
          <span className="text-white/30">Esc</span>
        </Link>
      </div>

      {/* Bottom chrome */}
      <div
        className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-6 transition-opacity duration-500"
        style={{ opacity: chromeVisible ? 1 : 0, pointerEvents: chromeVisible ? "auto" : "none" }}
      >
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-brand-light hover:text-brand-light disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-dim"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12H4M10 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="min-w-[7rem] text-center text-sm text-ink-dim tabular-nums">
          <span className="font-display text-brand-light">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-white/30"> / {SLIDES.length}</span>
          <span className="ml-3 hidden text-white/40 sm:inline">{slide.label}</span>
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:border-brand-light hover:text-brand-light disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-dim"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
