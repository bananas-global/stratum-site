"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BracketLabel, Button } from "../ui";

const INDUSTRIES = [
  {
    name: "Automotive Dealerships",
    href: "/industries",
    desc: "Sales, service, and back-office systems — connected, supported, and secure.",
    points: [
      "Multi-department support",
      "DMS & vendor coordination",
      "Showroom network stability",
      "Customer & financial data security",
    ],
  },
  {
    name: "Medical & Dental Clinics",
    href: "/industries",
    desc: "Protected patient data and clinical systems that stay running.",
    points: [
      "Booking, billing & clinical systems",
      "Patient record access controls",
      "Backup & recovery readiness",
      "Compliance guidance",
    ],
  },
  {
    name: "Law Firms & Legal Services",
    href: "/industries",
    desc: "We protect the environment that protects your clients.",
    points: [
      "Document security for legal workflows",
      "Secure client communications",
      "Matter file backup readiness",
      "Direct accountability",
    ],
  },
  {
    name: "Construction & AEC",
    href: "/industries",
    desc: "Technology that works everywhere your teams do.",
    points: [
      "Office & field connectivity",
      "Crew & subcontractor onboarding",
      "Project data security",
      "Proactive site support",
    ],
  },
  {
    name: "Manufacturing & Industrial",
    href: "/industries",
    desc: "Uptime across the floor and the back office.",
    points: [
      "Workstations, servers & OT",
      "Production network stability",
      "OT environment security",
      "Growth-aligned lifecycle planning",
    ],
  },
];

const GAP = 12; // px gap between cards — kept in sync with the flex `gap`
const AUTO_INTERVAL = 4000; // ms between auto-advances
const RESUME_DELAY = 2800; // ms of idle before autoplay resumes after an interaction
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type IconProps = { className?: string; style?: React.CSSProperties };

// Geist-style line icons (minimal, 1.5 stroke), one per industry — index-matched to INDUSTRIES.
const CarIcon = ({ className , style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
    <path d="M3 11h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <path d="M6.5 14h.01M17.5 14h.01" />
  </svg>
);
const MedicalIcon = ({ className , style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d="M3 12h4l2 5 4-10 2 5h6" />
  </svg>
);
const LawIcon = ({ className , style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d="M12 3v18M7 21h10M5 7h14M9 7L6 13h6zM15 7l-3 6h6z" />
    <path d="M3 13a3 3 0 0 0 6 0M15 13a3 3 0 0 0 6 0" />
  </svg>
);
const ConstructionIcon = ({ className , style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d="M4 21V9l8-5 8 5v12" />
    <path d="M9 21v-6h6v6M4 13h16" />
  </svg>
);
const ManufacturingIcon = ({ className , style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    <path d="M3 21V9l5 4V9l5 4V9l5 4V8h3v13z" />
    <path d="M3 21h18" />
  </svg>
);

const ICONS = [CarIcon, MedicalIcon, LawIcon, ConstructionIcon, ManufacturingIcon];

export default function IndustriesTabs() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [canScroll, setCanScroll] = useState(true);
  const [dragging, setDragging] = useState(false);

  // Mouse drag-to-scroll state (touch uses native scrolling, so we only handle mouse)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  // Motion engine refs (autoplay glide + pause/resume)
  const rafRef = useRef(0);
  const animatingRef = useRef(false);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(0);
  const reduceRef = useRef(false);

  // Recompute edge state (which fades / arrows to show) from the live scroll position
  const updateEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 1);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  // Cancel any in-flight glide and hand control back to native scroll-snap
  const stopAnim = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    animatingRef.current = false;
    if (viewportRef.current) viewportRef.current.style.scrollSnapType = "";
  }, []);

  // Buttery eased glide to an absolute scrollLeft. Snap is disabled mid-flight so
  // mandatory snapping can't fight the per-frame writes, then restored to settle.
  const glideTo = useCallback((target: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const start = el.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 1) return;
    cancelAnimationFrame(rafRef.current);
    if (reduceRef.current) {
      el.scrollLeft = target;
      return;
    }
    const duration = Math.min(1100, Math.max(550, Math.abs(delta) * 1.3));
    el.style.scrollSnapType = "none";
    animatingRef.current = true;
    const startTime = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      el.scrollLeft = start + delta * easeInOutCubic(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        animatingRef.current = false;
        el.style.scrollSnapType = "";
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  // Pause autoplay now; schedule it to resume after the viewer goes idle
  const pauseNow = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  }, []);
  const resumeSoon = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

  // Autoplay: advance one card every tick, looping home at the end.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = mq.matches;
    const onMq = (e: MediaQueryListEvent) => {
      reduceRef.current = e.matches;
    };
    mq.addEventListener?.("change", onMq);
    if (reduceRef.current) return () => mq.removeEventListener?.("change", onMq);

    const tick = () => {
      if (pausedRef.current || animatingRef.current || document.hidden) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const step = card.offsetWidth + GAP;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;
      const current = Math.round(el.scrollLeft / step);
      let target = (current + 1) * step;
      if (target > max) {
        // Last card can't left-align (it's clamped). Show the tail first, then loop home.
        target = el.scrollLeft >= max - 1 ? 0 : max;
      }
      glideTo(Math.max(0, Math.min(target, max)));
    };

    const id = window.setInterval(tick, AUTO_INTERVAL);
    return () => {
      window.clearInterval(id);
      mq.removeEventListener?.("change", onMq);
    };
  }, [glideTo]);

  // Pause on hover / wheel / keyboard focus; resume after idle. Cleanup raf + timers.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pauseNow();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") resumeSoon();
    };
    const onWheel = () => {
      pauseNow();
      resumeSoon();
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("focusin", pauseNow);
    el.addEventListener("focusout", resumeSoon);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("focusin", pauseNow);
      el.removeEventListener("focusout", resumeSoon);
      cancelAnimationFrame(rafRef.current);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, [pauseNow, resumeSoon]);

  // Optional arrow controls — glide by one card width
  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    pauseNow();
    resumeSoon();
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + GAP : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    glideTo(Math.max(0, Math.min(el.scrollLeft + dir * step, max)));
  }, [glideTo, pauseNow, resumeSoon]);

  // Any pointer contact pauses autoplay and takes over; mouse also drags-to-scroll.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopAnim();
    pauseNow();
    if (e.pointerType !== "mouse") return;
    const el = viewportRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    setDragging(true);
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = viewportRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (drag.current.active && el) {
      drag.current.active = false;
      setDragging(false);
      el.style.scrollSnapType = ""; // restore mandatory snap → settles to nearest card
      el.releasePointerCapture?.(e.pointerId);
    }
    resumeSoon();
  };

  const showLeftFade = canScroll && !atStart;
  const showRightFade = canScroll && !atEnd;

  return (
    <section className="section section-light">
      <div className="container">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[280px_1fr] md:items-stretch md:gap-16">

          {/* Sidebar */}
          <div className="flex h-full flex-col justify-between gap-8" data-reveal>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <BracketLabel>Who we work with</BracketLabel>
                <h2 className="font-display text-[clamp(1.3125rem,2.1vw,1.875rem)] leading-[1.1] tracking-[-0.03em]">
                  Technology built around how your industry operates.
                </h2>
                <p className="text-sm leading-relaxed text-ink-dim">
                  Managed IT and cybersecurity for industries where complexity is highest and downtime carries real cost.
                </p>
              </div>
              <Button href="/industries" className="w-fit">See all industries</Button>
            </div>

            {/* Arrows are optional — swipe / drag / scroll works without them. Hidden when nothing overflows. */}
            <div className="hidden gap-2 md:flex" style={{ visibility: canScroll ? "visible" : "hidden" }}>
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                aria-label="Previous industries"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                aria-label="Next industries"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black bg-black text-white transition-colors hover:bg-[#1b1b1b] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Carousel — native horizontal scroll-snap, all cards open.
              min-w-0 lets the 1fr grid column shrink so overflow-x-auto can scroll. */}
          <div className="relative min-w-0" data-reveal>
            {/* Edge fades hint there's more to scroll */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent transition-opacity duration-300"
              style={{ opacity: showLeftFade ? 1 : 0 }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent transition-opacity duration-300"
              style={{ opacity: showRightFade ? 1 : 0 }}
            />

            <div
              ref={viewportRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="no-scrollbar flex snap-x snap-mandatory items-stretch overflow-x-auto pb-2"
              style={{
                gap: GAP,
                overscrollBehaviorX: "contain",
                cursor: dragging ? "grabbing" : "grab",
                userSelect: dragging ? "none" : "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {INDUSTRIES.map((ind, i) => {
                const Icon = ICONS[i];
                return (
                  <div
                    key={ind.name}
                    data-card
                    className="panel-card group relative flex w-[80vw] max-w-[320px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-md border p-6 sm:w-[300px] sm:max-w-none"
                  >
                    {/* App-icon slot — glossy amethyst gem */}
                    <div
                      className="relative flex shrink-0 items-center justify-center overflow-hidden"
                      style={{
                        width: "4rem",
                        height: "4rem",
                        marginBottom: "1.25rem",
                        borderRadius: "1.15rem",
                        background: "#f7f4fc",
                        border: "1px solid rgba(125, 52, 255, 0.2)",
                        boxShadow: "0 10px 28px -10px rgba(125, 52, 255, 0.28)",
                      }}
                      aria-hidden="true"
                    >
                      {/* gradient fill — inset 1px so its bright bottom never bleeds onto the top rounded edge */}
                      <div
                        className="pointer-events-none absolute"
                        style={{
                          inset: "1px",
                          borderRadius: "calc(1.15rem - 1px)",
                          background: "linear-gradient(165deg, #ffffff 0%, #ede5ff 48%, #c9a8ff 100%)",
                        }}
                      />
                      {/* bottom glow bloom */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                        style={{ background: "radial-gradient(ellipse at bottom, rgba(125, 52, 255, 0.18), transparent 72%)" }}
                      />
                      {/* top gloss highlight — soft, contained */}
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }}
                      />
                      <Icon
                        className="relative"
                        style={{
                          width: "1.85rem",
                          height: "1.85rem",
                          color: "var(--color-brand)",
                          filter: "drop-shadow(0 1px 2px rgba(125, 52, 255, 0.2))",
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <div
                        className="font-display leading-[1.15]"
                        style={{ fontSize: "1.3125rem", color: "var(--color-ink-bright)" }}
                      >
                        {ind.name}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-ink">{ind.desc}</p>
                      <ul className="mt-5 flex flex-col border-t border-line-soft/40 divide-y divide-line-soft/40">
                        {ind.points.map((pt, pi) => (
                          <li
                            key={pi}
                            className="flex items-center gap-3 py-2.5 first:pt-3"
                          >
                            <span className="shrink-0 font-body text-[11px] font-medium tabular-nums text-brand-light/70">
                              {String(pi + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm leading-snug text-ink-dim">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.52434 9.16707H16.6673V10.8337H6.52434L10.9943 15.3037L9.81582 16.4822L3.33398 10.0004L9.81582 3.51855L10.9943 4.69706L6.52434 9.16707Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13.477 9.16707L9.00698 4.69706L10.1855 3.51855L16.6673 10.0004L10.1855 16.4822L9.00698 15.3037L13.477 10.8337H3.33398V9.16707H13.477Z" fill="currentColor" />
    </svg>
  );
}
