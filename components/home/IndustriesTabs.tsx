"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BracketLabel, ArrowLink } from "../ui";

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

const CARD_W = 280;
const GAP = 12;
const VIEWPORT_MIN_H = "30rem"; // reserves row height so the section never jumps
const DURATION = 600; // ms — carousel slide duration

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

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
  const [active, setActive] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);

  const last = INDUSTRIES.length - 1;

  // Compute the ideal translate so the target card is centered (clamped to edges)
  const getTargetTranslate = useCallback((index: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return 0;

    const totalW = INDUSTRIES.length * CARD_W + (INDUSTRIES.length - 1) * GAP;
    const viewW = viewport.offsetWidth;
    const maxTranslate = 0;
    const minTranslate = -(totalW - viewW);

    if (index === 0) return maxTranslate;
    if (index === last) return Math.min(minTranslate, 0);

    const cardOffset = index * (CARD_W + GAP);
    const centered = -(cardOffset - (viewW - CARD_W) / 2);
    return Math.max(Math.min(centered, maxTranslate), minTranslate);
  }, [last]);

  const animateTo = useCallback((targetTranslate: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const start = translateRef.current;
    const delta = targetTranslate - start;
    if (Math.abs(delta) < 1) { animatingRef.current = false; return; }

    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION, 1);
      const eased = easeOutCubic(progress);
      const current = start + delta * eased;
      translateRef.current = current;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${current}px)`;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        translateRef.current = targetTranslate;
        animatingRef.current = false;
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, last));
    setActive(clamped);
    animateTo(getTargetTranslate(clamped));
  }, [last, animateTo, getTargetTranslate]);

  // Snap on resize + recompute whether the track overflows its viewport
  useEffect(() => {
    const onResize = () => {
      const target = getTargetTranslate(active);
      translateRef.current = target;
      if (trackRef.current) trackRef.current.style.transform = `translateX(${target}px)`;

      const viewport = viewportRef.current;
      if (viewport) {
        const totalW = INDUSTRIES.length * CARD_W + (INDUSTRIES.length - 1) * GAP;
        setHasOverflow(totalW > viewport.offsetWidth + 1);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [active, getTargetTranslate]);

  // Fades are a pure function of position: more content to a side ⇒ fade that side.
  const showLeftFade = hasOverflow && active > 0;
  const showRightFade = hasOverflow && active < last;

  // Cleanup raf
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <section className="section bg-surface">
      <div className="container">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-[280px_1fr] md:items-stretch md:gap-16">

          {/* Sidebar */}
          <div className="flex h-full flex-col justify-between gap-8" data-reveal>
            <div className="flex flex-col gap-8">
              <BracketLabel>Who we work with</BracketLabel>

              <div className="flex flex-col gap-4">
                <h2 className="font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] tracking-[-0.03em] text-ink-bright">
                  Technology built around how your industry operates.
                </h2>
                <p className="text-sm leading-relaxed text-ink-dim">
                  Managed IT and cybersecurity for industries where complexity is highest and downtime carries real cost.
                </p>
                <ArrowLink href="/industries">See all industries</ArrowLink>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                aria-label="Previous industry"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                disabled={active >= last}
                aria-label="Next industry"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand bg-brand text-white transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div ref={viewportRef} className="relative overflow-hidden" style={{ minHeight: VIEWPORT_MIN_H }} data-reveal>
            {/* Edge fades */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent transition-opacity duration-500"
              style={{ opacity: showLeftFade ? 1 : 0 }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent transition-opacity duration-500"
              style={{ opacity: showRightFade ? 1 : 0 }}
            />

            <div
              ref={trackRef}
              className="flex items-start"
              style={{ gap: GAP, willChange: "transform" }}
            >
              {INDUSTRIES.map((ind, i) => {
                const isActive = i === active;
                const Icon = ICONS[i];
                return (
                  <div
                    key={ind.name}
                    onClick={() => goTo(i)}
                    style={{
                      width: CARD_W,
                      minWidth: CARD_W,
                      transition: "background-color 0.4s ease, opacity 0.4s ease",
                      cursor: isActive ? "default" : "pointer",
                    }}
                    className={[
                      "group relative flex flex-shrink-0 flex-col overflow-hidden rounded-md border border-line-soft/40 p-6",
                      isActive
                        ? "bg-surface-2"
                        : "bg-bg/60 opacity-60 hover:opacity-100 hover:bg-surface-2/70",
                    ].join(" ")}
                  >
                    {/* App-icon slot — glossy amethyst gem when active, subtle chip when collapsed */}
                    <div
                      className="relative flex shrink-0 items-center justify-center overflow-hidden transition-all duration-500"
                      style={{
                        width: isActive ? "4rem" : "2.5rem",
                        height: isActive ? "4rem" : "2.5rem",
                        marginBottom: isActive ? "1.25rem" : "0.75rem",
                        borderRadius: isActive ? "1.15rem" : "0.5rem",
                        background: isActive ? "#08080c" : "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: isActive ? "0 16px 30px -12px rgba(125,52,255,0.55)" : "none",
                      }}
                      aria-hidden="true"
                    >
                      {/* gradient fill — inset 1px so its bright bottom never bleeds onto the top rounded edge */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute"
                          style={{
                            inset: "1px",
                            borderRadius: "calc(1.15rem - 1px)",
                            background: "linear-gradient(to bottom, #08080c 0%, #160f28 40%, #5a2fd6 84%, #8b5cff 100%)",
                          }}
                        />
                      )}
                      {/* bottom glow bloom */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                          style={{ background: "radial-gradient(ellipse at bottom, rgba(180,140,255,0.5), transparent 70%)" }}
                        />
                      )}
                      {/* top gloss highlight — soft, contained */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }}
                        />
                      )}
                      <Icon
                        className="relative transition-all duration-500"
                        style={{
                          width: isActive ? "1.85rem" : "1.25rem",
                          height: isActive ? "1.85rem" : "1.25rem",
                          color: isActive ? "#ffffff" : "var(--color-ink-faint)",
                          filter: isActive ? "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" : "none",
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <div
                        className="font-display leading-[1.15] transition-all duration-500"
                        style={{
                          fontSize: "1.75rem",
                          color: isActive ? "var(--color-ink-bright)" : "var(--color-ink-dim)",
                        }}
                      >
                        {ind.name}
                      </div>

                      {/* Expandable content */}
                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{
                          opacity: isActive ? 1 : 0,
                          maxHeight: isActive ? "20rem" : 0,
                          transitionDelay: isActive ? "0.12s" : "0s",
                        }}
                      >
                        <p className="mt-3 text-sm leading-relaxed text-ink">{ind.desc}</p>
                        <ul className="mt-5 flex flex-col">
                          {ind.points.map((pt, pi) => (
                            <li
                              key={pi}
                              className="flex items-center gap-3 border-t border-line-soft/25 py-2.5 first:border-t-0 first:pt-0"
                            >
                              <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-brand-light/70">
                                {String(pi + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm leading-snug text-ink-dim">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
