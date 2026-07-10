/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { IconPattern } from "@/components/IconPattern";
import imageSpec from "@/images-look-feel.json";

/* ────────────────────────────────────────────────────────────────
   Brandbook slides — ported from the Claude Design deck
   ("Stratum Brandbook.dc.html", 26 slides, 1920×1080).

   Every slide is authored in absolute pixels against the fixed
   1920×1080 stage that BrandbookDeck scales to the viewport, so
   inline px styles (not responsive Tailwind utilities) are the
   right tool here. Fonts map to the site's next/font variables.
   ──────────────────────────────────────────────────────────────── */

export const BRANDBOOK_VERSION = "Version 1.0 · July 2026";

const SERIF = "var(--font-display)";
const SANS = "var(--font-body)";

export type Slide = {
  label: string;
  notes: string;
  content: ReactNode;
};

/* ── shared building blocks ────────────────────────────────────── */

function slideRoot(overrides: CSSProperties = {}): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background: "#000",
    color: "#e0e0e0",
    fontFamily: SANS,
    padding: "96px 110px 90px",
    display: "flex",
    flexDirection: "column",
    gap: 60,
    overflow: "hidden",
    ...overrides,
  };
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        fontSize: 24,
        letterSpacing: 3,
        textTransform: "uppercase",
        fontWeight: light ? 600 : 400,
        color: light ? "rgba(17,17,17,0.6)" : "rgba(255,255,255,0.28)",
      }}
    >
      <span style={{ color: light ? "rgba(17,17,17,0.28)" : "rgba(255,255,255,0.28)" }}>[</span>
      <span>{children}</span>
      <span style={{ color: light ? "rgba(17,17,17,0.28)" : "rgba(255,255,255,0.28)" }}>]</span>
    </div>
  );
}

function SlideHeader({
  eyebrow,
  title,
  light = false,
  size = 72,
  gap = 28,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  size?: number;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        style={{
          margin: 0,
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          color: light ? "#111111" : "#ffffff",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function SlideFooter({
  num,
  left = "Stratum · Brand guidelines",
  light = false,
  pushDown = false,
}: {
  num: string;
  left?: string;
  light?: boolean;
  pushDown?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 24,
        color: light ? "rgba(17,17,17,0.4)" : "rgba(255,255,255,0.35)",
        marginTop: pushDown ? "auto" : undefined,
      }}
    >
      <span>{left}</span>
      <span>{num}</span>
    </div>
  );
}

function BrandDot({ size = 8 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "#7d34ff",
        flexShrink: 0,
      }}
    />
  );
}

function MetaDot() {
  return <span style={{ width: 4, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.3)" }} />;
}

/* Stratum icon glyph, used across the misuse slide. */
function IconGlyph({
  fillA = "white",
  fillB = "#7D34FF",
  style,
  outline = false,
}: {
  fillA?: string;
  fillB?: string;
  style?: CSSProperties;
  outline?: boolean;
}) {
  return (
    <svg width="116" height="100" viewBox="0 0 58 50" fill="none" style={style}>
      <path
        d="M13.889 37.5L25.694 13.8889L37.5 37.5L43.75 50H57.639L51.389 37.5L32.639 0H18.75L0 37.5H13.889Z"
        fill={outline ? "none" : fillA}
        stroke={outline ? fillA : undefined}
        strokeWidth={outline ? 1.5 : undefined}
      />
      <path
        d="M0.0195312 37.5H29.1675H33.3345L39.5845 50H29.1675H12.5005H6.25053L0.0195312 37.5Z"
        fill={outline ? "none" : fillB}
        stroke={outline ? fillB : undefined}
        strokeWidth={outline ? 1.5 : undefined}
      />
    </svg>
  );
}

/* ── slide 24 helper — render images-look-feel.json like a code viewer ── */

type JsonLine = { indent: number; text: string; kind: "key" | "punct"; accent: boolean };

function jsonLines(value: unknown, indent = 0, out: JsonLine[] = []): JsonLine[] {
  const push = (text: string, kind: JsonLine["kind"] = "key") =>
    out.push({ indent, text, kind, accent: /7d34ff|amethyst/i.test(text) });
  if (Array.isArray(value)) return out; // arrays are inlined by the caller
  if (value !== null && typeof value === "object") {
    push("{", "punct");
    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([k, v], i) => {
      const comma = i < entries.length - 1 ? "," : "";
      if (Array.isArray(v)) {
        out.push({
          indent: indent + 1,
          text: `"${k}": [ ${v.map((s) => JSON.stringify(s)).join(", ")} ]${comma}`,
          kind: "key",
          accent: false,
        });
      } else if (v !== null && typeof v === "object") {
        out.push({ indent: indent + 1, text: `"${k}": {`, kind: "key", accent: false });
        const inner: JsonLine[] = [];
        Object.entries(v as Record<string, unknown>).forEach(([k2, v2], j, arr) => {
          const comma2 = j < arr.length - 1 ? "," : "";
          if (Array.isArray(v2)) {
            inner.push({
              indent: indent + 2,
              text: `"${k2}": [ ${v2.map((s) => JSON.stringify(s)).join(", ")} ]${comma2}`,
              kind: "key",
              accent: false,
            });
          } else if (v2 !== null && typeof v2 === "object") {
            inner.push({ indent: indent + 2, text: `"${k2}": {`, kind: "key", accent: false });
            Object.entries(v2 as Record<string, unknown>).forEach(([k3, v3], m, arr3) => {
              inner.push({
                indent: indent + 3,
                text: `"${k3}": ${JSON.stringify(v3)}${m < arr3.length - 1 ? "," : ""}`,
                kind: "key",
                accent: /7d34ff|amethyst/i.test(JSON.stringify(v3)),
              });
            });
            inner.push({ indent: indent + 2, text: `}${comma2}`, kind: "punct", accent: false });
          } else {
            inner.push({
              indent: indent + 2,
              text: `"${k2}": ${JSON.stringify(v2)}${comma2}`,
              kind: "key",
              accent: /7d34ff|amethyst/i.test(JSON.stringify(v2)),
            });
          }
        });
        out.push(...inner);
        out.push({ indent: indent + 1, text: `}${comma}`, kind: "punct", accent: false });
      } else {
        out.push({
          indent: indent + 1,
          text: `"${k}": ${JSON.stringify(v)}${comma}`,
          kind: "key",
          accent: /7d34ff|amethyst/i.test(JSON.stringify(v)),
        });
      }
    });
    push("}", "punct");
  }
  return out;
}

function JsonSpecViewer() {
  const lines = jsonLines(imageSpec);
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: "24px 32px",
        overflow: "hidden",
        columnCount: 3,
        columnGap: 36,
        columnFill: "balance",
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 10,
        lineHeight: 1.45,
        color: "#e0e0e0",
      }}
    >
      {lines.map((ln, i) => {
        const m = ln.text.match(/^("[^"]+"): (.*)$/);
        return (
          <div key={i} style={{ breakInside: "avoid", paddingLeft: ln.indent * 22 }}>
            {ln.kind === "punct" || !m ? (
              <span style={{ color: "rgba(255,255,255,0.32)" }}>{ln.text}</span>
            ) : (
              <>
                <span style={{ color: "#9aa0aa" }}>{m[1]}</span>
                <span style={{ color: "rgba(255,255,255,0.32)" }}>: </span>
                <span style={{ color: ln.accent ? "#b985ff" : "#e0e0e0" }}>{m[2]}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── swatch helpers for the two palette slides ─────────────────── */

function SwatchColumn({
  title,
  titleColor,
  swatches,
}: {
  title: string;
  titleColor: string;
  swatches: Array<{ bg: string; label: string; text: string; border?: string; shadow?: string }>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span
        style={{
          fontSize: 24,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontWeight: 600,
          color: titleColor,
          paddingBottom: 8,
        }}
      >
        {title}
      </span>
      {swatches.map((s) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            border: s.border ? `1px solid ${s.border}` : undefined,
            borderRadius: 8,
            background: s.bg,
            display: "flex",
            alignItems: "flex-end",
            padding: 22,
            boxShadow: s.shadow,
          }}
        >
          <span style={{ fontSize: 24, color: s.text }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── card helpers ──────────────────────────────────────────────── */

function logoCell(src: string, alt: string, caption: string, opts: { light?: boolean; imgWidth: string }) {
  const { light = false, imgWidth } = opts;
  return (
    <div
      style={{
        background: light ? "#ffffff" : "#000",
        border: `1px solid ${light ? "rgba(17,17,17,0.08)" : "rgba(255,255,255,0.10)"}`,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        padding: 32,
      }}
    >
      <img src={src} alt={alt} style={{ width: imgWidth }} />
      <span style={{ fontSize: 24, color: light ? "rgba(17,17,17,0.5)" : "rgba(255,255,255,0.4)", fontWeight: 300 }}>
        {caption}
      </span>
    </div>
  );
}

function misuseCell(caption: string, glyph: ReactNode, extra?: CSSProperties) {
  return (
    <div
      style={{
        background: "#000",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 32,
        ...extra,
      }}
    >
      {glyph}
      <span style={{ fontSize: 24, color: "#adadad", fontWeight: 300 }}>
        <span style={{ color: "#b985ff" }}>✕</span>&nbsp; {caption}
      </span>
    </div>
  );
}

function voiceCard(title: string, body: string) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "40px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <span style={{ fontFamily: SERIF, fontSize: 32, color: "#ffffff", letterSpacing: "-0.02em" }}>{title}</span>
      <span style={{ fontSize: 25, color: "#adadad", fontWeight: 300, lineHeight: 1.5 }}>{body}</span>
    </div>
  );
}

function exclusionCard(title: string, body: string) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "40px 44px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 28, color: "#ffffff", fontWeight: 500 }}>
        <span style={{ color: "#b985ff" }}>✕</span>&nbsp; {title}
      </span>
      <span style={{ fontSize: 26, color: "#adadad", fontWeight: 300, lineHeight: 1.55 }}>{body}</span>
    </div>
  );
}

function rewriteCard(kind: "not" | "this", quote: string) {
  const isThis = kind === "this";
  return (
    <div
      style={{
        background: "#000",
        border: `1px solid ${isThis ? "rgba(185,133,255,0.4)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
        padding: "34px 44px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <span
        style={{
          fontSize: 24,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontWeight: 600,
          color: isThis ? "#b985ff" : "rgba(255,255,255,0.35)",
        }}
      >
        {isThis ? "This" : "✕  Not this"}
      </span>
      <span style={{ fontSize: 30, fontWeight: 300, lineHeight: 1.5, color: isThis ? "#ffffff" : "#adadad" }}>
        {quote}
      </span>
    </div>
  );
}

function numberedRow(num: string, text: ReactNode, opts: { light?: boolean; last?: boolean } = {}) {
  const { light = false, last = false } = opts;
  const line = light ? "1px solid rgba(20,20,28,0.12)" : "1px solid rgba(255,255,255,0.10)";
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: light ? "20px 0" : "22px 0",
        borderTop: line,
        borderBottom: last ? line : undefined,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontSize: 26,
          color: light ? "#6d28d9" : "#b985ff",
          width: light ? 54 : 60,
          flexShrink: 0,
          textAlign: "center",
        }}
      >
        {num}
      </span>
      <span
        style={{
          fontSize: light ? 26 : 28,
          fontWeight: 300,
          lineHeight: 1.5,
          color: light ? "#2e2e36" : "#e0e0e0",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   The 26 slides
   ════════════════════════════════════════════════════════════════ */

export const SLIDES: Slide[] = [
  /* ── 01 · Cover ─────────────────────────────────────────────── */
  {
    label: "Cover",
    notes:
      "Welcome. This is the concise brand reference for Stratum — for the internal team, agencies, and partners. Everything in here is derived from the production site and brand system.",
    content: (
      <div style={slideRoot({ padding: 0, display: "block" })}>
        <IconPattern style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 90% at 20% 90%, rgba(125,52,255,0.16), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "96px 110px 90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <img src="/brand/stratum-logo-white.svg" alt="Stratum" style={{ height: 55, alignSelf: "flex-start" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <Eyebrow>Brand guidelines</Eyebrow>
            <h1
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: 110,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                maxWidth: 1200,
              }}
            >
              Structure behind dependable technology
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 26, color: "#adadad", fontWeight: 300 }}>
              <span>{BRANDBOOK_VERSION}</span>
              <MetaDot />
              <span>stratumtech.ca</span>
              <MetaDot />
              <span>Lower Mainland, BC</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* ── 02 · Contents ──────────────────────────────────────────── */
  {
    label: "Contents",
    notes: "Six chapters. Use this book as a quick lookup — every rule is stated once, plainly.",
    content: (
      <div style={slideRoot({ background: "#f0eef4", color: "#333", gap: 64 })}>
        <SlideHeader light eyebrow="Contents" title="What this book covers" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 24, rowGap: 24 }}>
          {(
            [
              ["01", "Brand foundation", "Positioning & the 5S lens"],
              ["04", "Typography", "Lora & Manrope"],
              ["02", "Logo", "Variants, space, misuse"],
              ["05", "Voice", "Tone & writing rules"],
              ["03", "Color", "Palette & the accent"],
              ["06", "Imagery & iconography", "Renders, icons, pattern"],
            ] as const
          ).map(([num, title, sub]) => (
            <div
              key={num}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 32,
                padding: "36px 40px",
                background: "#ffffff",
                border: "1px solid rgba(20,20,28,0.06)",
                borderRadius: 8,
                boxShadow: "0 8px 28px rgba(18,18,28,0.05)",
              }}
            >
              <span style={{ fontFamily: SERIF, fontSize: 40, color: "#7c3aed" }}>{num}</span>
              <span style={{ fontSize: 34, color: "#111111" }}>{title}</span>
              <span style={{ marginLeft: "auto", fontSize: 26, color: "#55555f", fontWeight: 300 }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 03 · Who Stratum is ────────────────────────────────────── */
  {
    label: "Who Stratum is",
    notes:
      "The positioning statement is the anchor for all copy. Three service areas, always numbered, always in this order.",
    content: (
      <div style={slideRoot()}>
        <SlideHeader eyebrow="01 · Brand foundation" title="Who Stratum is" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 100, alignItems: "start", flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 400, fontSize: 25, lineHeight: 1.5, letterSpacing: "-0.01em", color: "#e0e0e0" }}>
            Stratum is a managed IT and cybersecurity company serving growing businesses across the Lower Mainland, BC
            since 2007.
            <br />
            <br />
            We handle the everyday technology a business depends on —{" "}
            <span style={{ color: "#b985ff" }}>
              help desk support, device and network management, security and backups, and the business systems that
              keep operations running
            </span>
            .
            <br />
            <br />
            Built for the missing middle: companies too complex for break-fix IT, too small for a full internal team.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "30px 36px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                background: "#0f0f0f",
              }}
            >
              <span style={{ fontSize: 28, color: "#adadad" }}>Break-fix IT</span>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Reactive, ticket by ticket</span>
            </div>
            <div
              style={{
                border: "1px solid rgba(185,133,255,0.5)",
                borderRadius: 8,
                padding: "40px 36px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "#1d1d1d",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <BrandDot />
                <span style={{ fontSize: 30, color: "#ffffff", fontWeight: 500 }}>The structural missing middle</span>
              </div>
              <span style={{ fontSize: 25, color: "#adadad", fontWeight: 300, lineHeight: 1.5 }}>
                Growing, operationally complex businesses — dealerships, clinics, law firms, construction,
                manufacturing. This is who we build for.
              </span>
            </div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "30px 36px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                background: "#0f0f0f",
              }}
            >
              <span style={{ fontSize: 28, color: "#adadad" }}>Internal IT department</span>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Deep team, enterprise scale</span>
            </div>
          </div>
        </div>
        <SlideFooter num="03" pushDown />
      </div>
    ),
  },

  /* ── 04 · Why the mark ──────────────────────────────────────── */
  {
    label: "Why the mark",
    notes:
      "The reasoning behind the identity: modern but not hyper-tech, built on simplicity and stability. The A (not the S) anchors the name; the pyramid signals stability and growth; the accent layer is the foundation Stratum provides.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", gap: 56 })}>
        <SlideHeader eyebrow="01 · Brand foundation" title="Why the mark looks the way it does" />
        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 96, alignItems: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              background: "#000",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "80px 60px",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "90px solid transparent",
                  borderRight: "90px solid transparent",
                  borderBottom: "150px solid #ffffff",
                }}
              />
              <div style={{ width: 180, height: 18, borderRadius: 3, background: "#7d34ff" }} />
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 300, lineHeight: 1.55, color: "#adadad", textAlign: "center", maxWidth: 380 }}>
              A pyramid form, resting on a solid layer.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 300, lineHeight: 1.5, color: "#e0e0e0" }}>
              The identity is meant to feel <span style={{ color: "#b985ff" }}>modern without being hyper-tech</span> —
              quiet, confident, and built on simplicity and stability rather than noise.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {(
                [
                  ["A", "We chose the A, not the obvious S.", "The A is the strong, sounding part of the name."],
                  [
                    "▲",
                    "The pyramid form signals stability and growth.",
                    "A wide, grounded base rising to a point — steady footing that builds upward.",
                  ],
                  [
                    "▬",
                    "The accent layer is the foundation we provide.",
                    "Stands for the layered base Stratum lays down for every client.",
                  ],
                ] as const
              ).map(([glyph, lead, rest]) => (
                <div
                  key={glyph}
                  style={{ display: "flex", gap: 24, borderLeft: "1px solid rgba(255,255,255,0.16)", paddingLeft: 30 }}
                >
                  <span style={{ fontSize: 24, color: "#7d34ff", fontWeight: 600, minWidth: 30, textAlign: "center" }}>
                    {glyph}
                  </span>
                  <p style={{ margin: 0, fontSize: 26, fontWeight: 300, lineHeight: 1.5, color: "#adadad" }}>
                    <span style={{ color: "#ffffff", fontWeight: 500 }}>{lead}</span> {rest}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SlideFooter num="04" />
      </div>
    ),
  },

  /* ── 05 · The logo ──────────────────────────────────────────── */
  {
    label: "The logo",
    notes:
      "Wordmark and icon. The amethyst plane under the A is the base stratum — the one accent in the lockup. Never redraw either mark.",
    content: (
      <div style={slideRoot()}>
        <SlideHeader eyebrow="02 · Logo" title="The logo" />
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, flex: 1 }}>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 44,
              padding: 60,
            }}
          >
            <img src="/brand/stratum-logo-white.svg" alt="Stratum wordmark" style={{ width: "72%" }} />
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Wordmark — the primary mark</span>
          </div>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 44,
              padding: 60,
            }}
          >
            <img src="/brand/stratum-icon-white.svg" alt="Stratum icon" style={{ width: "34%" }} />
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Icon — avatars, favicons, small spaces</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 60, alignItems: "baseline" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 300, lineHeight: 1.55, color: "#adadad", maxWidth: 1100 }}>
            Cut, geometric letterforms built from stacked planes. The single{" "}
            <span style={{ color: "#b985ff" }}>amethyst plane</span> marks the base stratum — the structure everything
            rests on. Use the supplied files only; never redraw, retype, or re-space either mark.
          </p>
        </div>
        <SlideFooter num="05" />
      </div>
    ),
  },

  /* ── 06 · Logo construction ─────────────────────────────────── */
  {
    label: "Logo construction",
    notes:
      "Both marks sit on a quarter-height unit grid — stroke weight, stair-step, and the amethyst base plane each equal one unit. The grid guides placement and scaling; always reproduce from the supplied files.",
    content: (
      <div style={slideRoot({ background: "#f0eef4", color: "#333", gap: 50 })}>
        <SlideHeader light eyebrow="02 · Logo" title="Logo construction" />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "#ffffff",
            border: "1px solid rgba(17,17,17,0.10)",
            borderRadius: 8,
            padding: "48px 56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/brand/book/logo-construction-grid.jpg"
            alt="Stratum wordmark construction grid"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 300, lineHeight: 1.55, color: "#555", maxWidth: 1560 }}>
          Both marks are built on a quarter-height unit grid — the stroke weight, the stair-step, and the amethyst base
          plane each equal one unit{" "}
          <span style={{ fontFamily: SERIF, fontStyle: "italic", color: "#7c3aed" }}>x</span>. The grid is for placement
          and scaling decisions; always reproduce from the supplied files.
        </p>
        <SlideFooter light num="06" />
      </div>
    ),
  },

  /* ── 07 · Logo variants on dark ─────────────────────────────── */
  {
    label: "Logo variants",
    notes:
      "Eight files, four treatments. Accent versions are the default; one-colour versions exist for constrained reproduction — engraving, single-colour print, embroidery.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", gap: 54 })}>
        <SlideHeader eyebrow="02 · Logo" title="Logo variants on dark" />
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gridTemplateRows: "1fr 1fr", gap: 20, flex: 1 }}>
          {logoCell("/brand/stratum-logo-white.svg", "", "White + accent · default on dark", { imgWidth: "72%" })}
          {logoCell("/brand/stratum-icon-white.svg", "", "Icon · white + accent", { imgWidth: "60%" })}
          {logoCell("/brand/stratum-logo-white-mono.svg", "", "White · one-colour on dark", { imgWidth: "72%" })}
          {logoCell("/brand/stratum-icon-white-mono.svg", "", "Icon · white", { imgWidth: "60%" })}
        </div>
        <SlideFooter num="07" left="Accent versions are the default. One-colour versions are for constrained reproduction only." />
      </div>
    ),
  },

  /* ── 08 · Logo variants on light ────────────────────────────── */
  {
    label: "Logo variants on light",
    notes:
      "The light-surface counterparts. Black + accent is the default on light; black one-colour is for constrained reproduction.",
    content: (
      <div style={slideRoot({ background: "#f0eef4", color: "#333", gap: 54 })}>
        <SlideHeader light eyebrow="02 · Logo" title="Logo variants on light" />
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gridTemplateRows: "1fr 1fr", gap: 20, flex: 1 }}>
          {logoCell("/brand/stratum-logo-black.svg", "", "Black + accent · default on light", { light: true, imgWidth: "72%" })}
          {logoCell("/brand/stratum-icon-black.svg", "", "Icon · black + accent", { light: true, imgWidth: "60%" })}
          {logoCell("/brand/stratum-logo-black-mono.svg", "", "Black · one-colour on light", { light: true, imgWidth: "72%" })}
          {logoCell("/brand/stratum-icon-black-mono.svg", "", "Icon · black", { light: true, imgWidth: "60%" })}
        </div>
        <SlideFooter light num="08" left="Accent versions are the default. One-colour versions are for constrained reproduction only." />
      </div>
    ),
  },

  /* ── 09 · Clear space ───────────────────────────────────────── */
  {
    label: "Clear space",
    notes:
      "Clear space X equals the height of the icon's accent plane — half the mark height. Nothing enters that zone. Minimums keep the amethyst plane legible.",
    content: (
      <div style={slideRoot()}>
        <SlideHeader eyebrow="02 · Logo" title="Clear space and minimum size" />
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 100, alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ border: "1px dashed rgba(185,133,255,0.45)", padding: 110, position: "relative", borderRadius: 4 }}>
              <img src="/brand/stratum-logo-white.svg" alt="Stratum wordmark with clear space" style={{ width: 640, display: "block" }} />
              {(
                [
                  { top: 38, left: "50%", transform: "translateX(-50%)" },
                  { bottom: 38, left: "50%", transform: "translateX(-50%)" },
                  { left: 44, top: "50%", transform: "translateY(-50%)" },
                  { right: 44, top: "50%", transform: "translateY(-50%)" },
                ] as CSSProperties[]
              ).map((pos, i) => (
                <span
                  key={i}
                  style={{ position: "absolute", fontSize: 26, color: "#b985ff", fontFamily: SERIF, fontStyle: "italic", ...pos }}
                >
                  x
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 300, lineHeight: 1.55, color: "#adadad" }}>
              Clear space{" "}
              <span style={{ fontFamily: SERIF, fontStyle: "italic", color: "#b985ff" }}>x</span> equals roughly the
              size of the accent layer. Keep it free of text, imagery, and page edges on all four sides.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "26px 0", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <span style={{ fontSize: 28, color: "#ffffff" }}>Wordmark minimum</span>
                <span style={{ fontSize: 28, color: "#adadad", fontWeight: 300 }}>140 px · 35 mm</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "26px 0",
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  borderBottom: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <span style={{ fontSize: 28, color: "#ffffff" }}>Icon minimum</span>
                <span style={{ fontSize: 28, color: "#adadad", fontWeight: 300 }}>24 px · 8 mm</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 300, lineHeight: 1.55, color: "rgba(255,255,255,0.4)" }}>
              Below wordmark minimum, switch to the icon.
            </p>
          </div>
        </div>
        <SlideFooter num="09" />
      </div>
    ),
  },

  /* ── 10 · Logo misuse ───────────────────────────────────────── */
  {
    label: "Logo misuse",
    notes:
      "Six ways to break the mark. If a surface can't reproduce it correctly, use a one-colour variant — never improvise.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", gap: 54 })}>
        <SlideHeader eyebrow="02 · Logo" title="Logo misuse" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1fr 1fr", gap: 20, flex: 1 }}>
          {misuseCell("Don't recolour the mark", <IconGlyph fillA="#7d34ff" fillB="#b985ff" />)}
          {misuseCell(
            "Don't add glow or shadows",
            <IconGlyph style={{ filter: "drop-shadow(0 0 22px rgba(125,52,255,0.9))" }} />,
          )}
          {misuseCell("Don't stretch or condense", <IconGlyph style={{ transform: "scaleX(1.55)" }} />)}
          {misuseCell("Don't rotate or tilt", <IconGlyph style={{ transform: "rotate(-18deg)" }} />)}
          {misuseCell("Don't outline the mark", <IconGlyph outline />)}
          <div
            style={{
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              padding: 32,
              backgroundImage: "url('/images/stratum-geometric-05.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <IconGlyph fillA="#6b6b6b" style={{ opacity: 0.75 }} />
            <span
              style={{
                fontSize: 24,
                color: "#e0e0e0",
                fontWeight: 300,
                background: "rgba(0,0,0,0.55)",
                padding: "8px 18px",
                borderRadius: 4,
                backdropFilter: "blur(6px)",
              }}
            >
              <span style={{ color: "#b985ff" }}>✕</span>&nbsp; Don&apos;t place on busy, low-contrast imagery
            </span>
          </div>
        </div>
        <SlideFooter num="10" left="If a surface can't reproduce the mark correctly, use a one-colour variant." />
      </div>
    ),
  },

  /* ── 11 · Applications ──────────────────────────────────────── */
  {
    label: "Applications",
    notes:
      "Use cases from the brand draft: exterior signage, team badges, and business cards. Physical surfaces run monochrome — black, white, and concrete gray; the amethyst accent stays on screen and in print, used sparingly.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", padding: "78px 110px 64px", gap: 40 })}>
        <SlideHeader eyebrow="02 · Logo" title="Applications" />
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            <img
              src="/brand/book/application-signage.jpg"
              alt="Stratum exterior signage cube on a concrete wall"
              style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              Exterior signage — icon and one-colour black on white
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 24, minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
              <img
                src="/brand/book/application-badge.jpg"
                alt="Stratum team badge and lanyard"
                style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}
              />
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
                Team badges — white on black, icon-pattern wash
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
              <img
                src="/brand/book/application-business-cards.jpg"
                alt="Stratum business cards"
                style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}
              />
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
                Business cards — matte black stock, tone-on-tone pattern
              </span>
            </div>
          </div>
        </div>
        <SlideFooter num="11" left="Physical surfaces run monochrome; the amethyst accent stays on screen and in print." />
      </div>
    ),
  },

  /* ── 12 · Vehicle livery ────────────────────────────────────── */
  {
    label: "Vehicle livery",
    notes:
      "Fleet livery from the brand draft — one-colour white wordmark over black, a faint tone-on-tone icon, and plain-language copy. No accent colour outdoors.",
    content: (
      <div style={slideRoot({ padding: 0, display: "block" })}>
        <img
          src="/brand/book/application-vehicle.jpg"
          alt="Stratum fleet vehicle with black livery"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "96px 110px 90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 26,
          }}
        >
          <Eyebrow>02 · Logo</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 72, lineHeight: 1.1, letterSpacing: "-0.04em", color: "#ffffff" }}>
            Vehicle livery
          </h2>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 300, lineHeight: 1.55, color: "#e0e0e0", maxWidth: 1000 }}>
            One-colour white wordmark over black, a faint tone-on-tone icon, and plain-language copy. No accent colour
            in the field.
          </p>
        </div>
      </div>
    ),
  },

  /* ── 13 · Color palette ─────────────────────────────────────── */
  {
    label: "Color palette",
    notes:
      "Four families: stratified surfaces, a four-step ink scale, one amethyst accent, and low-opacity hairlines. That's the whole palette — there is no blue, no green, no gradient set.",
    content: (
      <div style={slideRoot({ gap: 54 })}>
        <SlideHeader eyebrow="03 · Color" title="Color palette" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, flex: 1 }}>
          <SwatchColumn
            title="Surfaces"
            titleColor="rgba(255,255,255,0.4)"
            swatches={[
              { bg: "#000000", label: "Background · #000000", text: "#e0e0e0", border: "rgba(255,255,255,0.16)" },
              { bg: "#0f0f0f", label: "Surface · #0F0F0F", text: "#e0e0e0", border: "rgba(255,255,255,0.10)" },
              { bg: "#1d1d1d", label: "Raised · #1D1D1D", text: "#e0e0e0", border: "rgba(255,255,255,0.10)" },
            ]}
          />
          <SwatchColumn
            title="Text"
            titleColor="rgba(255,255,255,0.4)"
            swatches={[
              { bg: "#ffffff", label: "Headings · #FFFFFF", text: "#111111" },
              { bg: "#e0e0e0", label: "Body · #E0E0E0", text: "#111111" },
              { bg: "#adadad", label: "Dim · #ADADAD", text: "#111111" },
            ]}
          />
          <SwatchColumn
            title="Accent"
            titleColor="rgba(255,255,255,0.4)"
            swatches={[
              { bg: "#7d34ff", label: "Main · #7D34FF", text: "#ffffff" },
              { bg: "#b985ff", label: "Light · #B985FF", text: "#111111" },
              { bg: "#471ab7", label: "Dark · #471AB7", text: "#ffffff" },
            ]}
          />
          <SwatchColumn
            title="Hairlines"
            titleColor="rgba(255,255,255,0.4)"
            swatches={[
              { bg: "#0f0f0f", label: "Soft · 6% white", text: "#adadad", border: "rgba(255,255,255,0.06)" },
              { bg: "#0f0f0f", label: "Default · 10% white", text: "#adadad", border: "rgba(255,255,255,0.10)" },
              { bg: "#0f0f0f", label: "Strong · 16% white", text: "#adadad", border: "rgba(255,255,255,0.16)" },
            ]}
          />
        </div>
        <SlideFooter num="13" left="Depth comes from hairlines, not shadows. Body text is never pure white." />
      </div>
    ),
  },

  /* ── 14 · Color palette on light ────────────────────────────── */
  {
    label: "Color palette light",
    notes:
      "The light band re-tokens the same palette for lavender-white surfaces: #F0EEF4 canvas, white cards, dark ink, and dark hairlines. The amethyst accent is unchanged — it carries across both themes.",
    content: (
      <div style={slideRoot({ background: "#f0eef4", color: "#2e2e36", gap: 54 })}>
        <SlideHeader light eyebrow="03 · Color" title="Color palette on light" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, flex: 1 }}>
          <SwatchColumn
            title="Surfaces"
            titleColor="rgba(20,20,28,0.45)"
            swatches={[
              { bg: "#f0eef4", label: "Canvas · #F0EEF4", text: "#2e2e36", border: "rgba(20,20,28,0.14)" },
              { bg: "#ffffff", label: "Card · #FFFFFF", text: "#2e2e36", border: "rgba(20,20,28,0.10)", shadow: "0 8px 28px rgba(18,18,28,0.05)" },
              { bg: "#e6e2ee", label: "Sunken · #E6E2EE", text: "#2e2e36", border: "rgba(20,20,28,0.10)" },
            ]}
          />
          <SwatchColumn
            title="Text"
            titleColor="rgba(20,20,28,0.45)"
            swatches={[
              { bg: "#14141a", label: "Headings · #14141A", text: "#f0eef4" },
              { bg: "#2e2e36", label: "Body · #2E2E36", text: "#f0eef4" },
              { bg: "#5c5c68", label: "Dim · #5C5C68", text: "#f0eef4" },
            ]}
          />
          <SwatchColumn
            title="Accent"
            titleColor="rgba(20,20,28,0.45)"
            swatches={[
              { bg: "#7d34ff", label: "Main · #7D34FF", text: "#ffffff" },
              { bg: "#b985ff", label: "Light · #B985FF", text: "#14141a" },
              { bg: "#471ab7", label: "Dark · #471AB7", text: "#ffffff" },
            ]}
          />
          <SwatchColumn
            title="Hairlines"
            titleColor="rgba(20,20,28,0.45)"
            swatches={[
              { bg: "#ffffff", label: "Soft · 6% black", text: "#5c5c68", border: "rgba(20,20,28,0.06)" },
              { bg: "#ffffff", label: "Default · 10% black", text: "#5c5c68", border: "rgba(20,20,28,0.10)" },
              { bg: "#ffffff", label: "Strong · 14% black", text: "#5c5c68", border: "rgba(20,20,28,0.14)" },
            ]}
          />
        </div>
        <SlideFooter light num="14" left="The light band mirrors the dark palette — same amethyst, inverted ink and hairlines." />
      </div>
    ),
  },

  /* ── 15 · Using the accent ──────────────────────────────────── */
  {
    label: "Using the accent",
    notes: "Amethyst is a signal, not a surface. Five sanctioned uses. The one hard rule: never a fill background.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f" })}>
        <SlideHeader eyebrow="03 · Color" title="Using the accent sparingly" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, flex: 1, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              "Hover states and highlights",
              "8 px brand dots on lists, cards, and chips",
              "Active rails, focus rings, and key numerals",
              "One separation light in imagery",
              "The base plane of the logo",
            ].map((item, i, arr) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "30px 0",
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  borderBottom: i === arr.length - 1 ? "1px solid rgba(255,255,255,0.10)" : undefined,
                }}
              >
                <BrandDot />
                <span style={{ fontSize: 29, color: "#e0e0e0", fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: 44,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "#b985ff" }}>Do</span>
              <span style={{ fontSize: 28, color: "#ffffff", fontWeight: 300, lineHeight: 1.5 }}>
                Reach for amethyst sparingly — a single dot, one hover state, a key numeral. It draws too much
                attention.
              </span>
            </div>
            <div style={{ background: "#7d34ff", borderRadius: 8, padding: 44, display: "flex", flexDirection: "column", gap: 24 }}>
              <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                Don&apos;t
              </span>
              <span style={{ fontSize: 28, color: "#ffffff", fontWeight: 300, lineHeight: 1.5 }}>
                Amethyst is never a fill background — for panels, sections, or slides like this one.
              </span>
            </div>
          </div>
        </div>
        <SlideFooter num="15" />
      </div>
    ),
  },

  /* ── 16 · Typefaces ─────────────────────────────────────────── */
  {
    label: "Typefaces",
    notes:
      "Two families. Lora carries presence through size and tight tracking — always weight 400, never bold. Manrope does everything else; ledes run light at 300.",
    content: (
      <div style={slideRoot({ gap: 54 })}>
        <SlideHeader eyebrow="04 · Typography" title="Typefaces" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, flex: 1 }}>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "56px 60px",
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 26, color: "#b985ff", fontWeight: 500 }}>Lora</span>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Display · weight 400 only</span>
            </div>
            <span style={{ fontFamily: SERIF, fontSize: 200, lineHeight: 1, letterSpacing: "-0.04em", color: "#ffffff" }}>Aa</span>
            <span style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1.6, letterSpacing: "-0.01em", color: "#adadad" }}>
              ABCDEFGHIJKLM abcdefghijklm 0123456789
            </span>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.5, marginTop: "auto" }}>
              Headings and key numerals. Tracking −0.04em, leading 1.1. Presence comes from size, never weight.
              <br />
              Fallback: Instrument Serif, Georgia.
            </span>
          </div>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "56px 60px",
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 26, color: "#b985ff", fontWeight: 500 }}>Manrope</span>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Body &amp; UI · 300–700</span>
            </div>
            <span style={{ fontFamily: SANS, fontSize: 200, lineHeight: 1, letterSpacing: "-0.02em", color: "#ffffff", fontWeight: 400 }}>Aa</span>
            <span style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.6, color: "#adadad", fontWeight: 300 }}>
              ABCDEFGHIJKLM abcdefghijklm 0123456789
            </span>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.5, marginTop: "auto" }}>
              Body, UI, labels, and buttons. Ledes run at weight 300; emphasis at 500–600 and by using a brighter
              contrast color.
              <br />
              Fallback: ui-sans-serif.
            </span>
          </div>
        </div>
        <SlideFooter num="16" left="Both families load from Google Fonts — Lora, Manrope, Instrument Serif." />
      </div>
    ),
  },

  /* ── 17 · Type in use ───────────────────────────────────────── */
  {
    label: "Type in use",
    notes:
      "The working scale plus the four standing rules: sentence case everywhere, display headings take no terminal punctuation, serif numerals, never bold the serif.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", padding: "78px 110px 66px", gap: 36 })}>
        <SlideHeader eyebrow="04 · Typography" title="Type in use" />
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 100, flex: 1, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>Display 1 · Lora 400 · 33–60px fluid</span>
              <span style={{ fontFamily: SERIF, fontSize: 60, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#ffffff" }}>
                Built for the missing middle
              </span>
            </div>
            <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>Display 2 · Lora 400 · 27–48px fluid</span>
              <span style={{ fontFamily: SERIF, fontSize: 48, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#ffffff" }}>
                Five commitments behind everything
              </span>
            </div>
            <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>Lede · Manrope 300 · 18–20px</span>
              <span style={{ fontSize: 30, fontWeight: 300, lineHeight: 1.5, color: "#adadad" }}>
                We do not just react to issues. We take responsibility for the environment.
              </span>
            </div>
            <div
              style={{
                padding: "20px 0",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }}>Eyebrow · Manrope 600 · 12px · +2px tracking</span>
              <span style={{ display: "flex", gap: 10, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 400 }}>[</span>
                <span style={{ fontWeight: 400, color: "#FFFFFF47" }}>What we do</span>
                <span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 400 }}>]</span>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)", paddingBottom: 20 }}>
              Standing rules
            </span>
            {[
              "Sentence case everywhere — headlines, buttons, nav.",
              "Display headings take no terminal punctuation.",
              "Numerals and step counters are set in the serif.",
              "Never bold the serif. Uppercase only in eyebrows and tiny chip labels.",
            ].map((rule) => (
              <div key={rule} style={{ display: "flex", gap: 20, padding: "12px 0" }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#7d34ff", flexShrink: 0, marginTop: 14 }} />
                <span style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.5, color: "#e0e0e0" }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
        <SlideFooter num="17" />
      </div>
    ),
  },

  /* ── 18 · Voice and tone ────────────────────────────────────── */
  {
    label: "Voice and tone",
    notes:
      "Stratum reads like a dependable operator who has seen the chaos and refuses to add to it. Four principles, plus the vocabulary to reach for and the words to drop.",
    content: (
      <div style={slideRoot({ gap: 54 })}>
        <SlideHeader eyebrow="05 · Voice" title="Voice and tone" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {voiceCard("Calm", "Short declaratives. No hype, no exclamation marks, no urgency theatre.")}
          {voiceCard("Structured", "Numbered services and steps. Structure made visible in the writing itself.")}
          {voiceCard("Plain-spoken", "Technical topics without dumbing them down — and without jargon.")}
          {voiceCard("Accountable", "“We” speaks to “you.” Warm, senior, and responsible for outcomes.")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flex: 1 }}>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "40px 44px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Reach for
            </span>
            <span style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.65, color: "#e0e0e0" }}>
              structured · dependable · accountable · proactive · plain-language · long-term · stewardship · environment
              · oversight · readiness
            </span>
          </div>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "40px 44px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Avoid
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 300,
                lineHeight: 1.65,
                color: "#adadad",
                textDecoration: "line-through",
                textDecorationColor: "rgba(185,133,255,0.6)",
              }}
            >
              cutting-edge · synergy · world-class · ninja · rockstar · &quot;solutions&quot; as filler · exclamation
              marks · emoji
            </span>
          </div>
        </div>
        <SlideFooter num="18" />
      </div>
    ),
  },

  /* ── 19 · Writing in practice ───────────────────────────────── */
  {
    label: "Writing in practice",
    notes:
      "Side-by-side rewrites plus the three signature devices: the bracket eyebrow, contrast framing, and the Talk-to-a-human CTA.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", padding: "80px 110px 70px", gap: 40 })}>
        <SlideHeader eyebrow="05 · Voice" title="Writing in practice" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {rewriteCard("not", "“Cutting-edge IT solutions to supercharge your business!”")}
          {rewriteCard("this", "“Structured support for the systems your business depends on every day.”")}
          {rewriteCard("not", "“Book a demo today — limited slots available!”")}
          {rewriteCard("this", "“Talk to a human. No pressure, no jargon — a straightforward conversation.”")}
        </div>
        <div style={{ display: "flex", gap: 60, marginTop: "auto", alignItems: "baseline" }}>
          <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
            Signature devices
          </span>
          <p style={{ margin: 0, fontSize: 27, fontWeight: 300, lineHeight: 1.6, color: "#adadad" }}>
            The <span style={{ color: "#e0e0e0" }}>[ bracket eyebrow ]</span> above every section · contrast framing —{" "}
            <span style={{ color: "#e0e0e0" }}>&quot;not X — Y&quot;</span> · numbered steps{" "}
            <span style={{ fontFamily: SERIF, color: "#e0e0e0" }}>01 → 04</span> · the CTA is always{" "}
            <span style={{ color: "#e0e0e0" }}>&quot;Talk to a human.&quot;</span>
          </p>
        </div>
        <SlideFooter num="19" />
      </div>
    ),
  },

  /* ── 20 · Imagery look and feel ─────────────────────────────── */
  {
    label: "Imagery look and feel",
    notes:
      "One image language: precision-machined anodized aluminum, low-key lighting, a single amethyst separation light. Think Apple industrial design, not gaming.",
    content: (
      <div style={slideRoot({ padding: 0, display: "block" })}>
        <img
          src="/images/bg-hero-services.webp"
          alt="Machined anodized aluminum render"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.94) 34%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.15))",
          }}
        />
        <div style={{ position: "absolute", inset: 0, padding: "96px 110px 90px", display: "flex", flexDirection: "column", gap: 54 }}>
          <SlideHeader eyebrow="06 · Imagery" title="Imagery look and feel" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 760 }}>
            {numberedRow("01", "Precision-machined geometric forms in satin anodized aluminum — chamfers, fillets, flawless surfaces.")}
            {numberedRow("02", "Low-key lighting, deep blacks, high contrast. Cool and monochromatic — gunmetal, graphite.")}
            {numberedRow("03", "One amethyst separation light defining the silhouette — subtle, never glowing.")}
            {numberedRow("04", "In layouts, renders sit behind darkening protection gradients so text stays legible.", { last: true })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
            {["Octane-style 3D render", "50mm macro · shallow depth", "Apple industrial design, not gaming"].map((chip) => (
              <span
                key={chip}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.25)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 999,
                  padding: "12px 26px",
                  fontSize: 24,
                  color: "#adadad",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  /* ── 21 · Imagery on light ──────────────────────────────────── */
  {
    label: "Imagery on light",
    notes:
      "The light counterpart to the dark image language. Same precision-machined forms, same single amethyst rim light — white anodized aluminum in place of near-black, on a soft lavender-white ground. Everything else holds: cool, monochromatic, one splash of accent.",
    content: (
      <div style={slideRoot({ background: "#f0eef4", color: "#2e2e36", padding: "78px 110px 64px", gap: 40 })}>
        <SlideHeader light eyebrow="06 · Imagery" title="Imagery on light" gap={22} />
        <div style={{ display: "grid", gridTemplateColumns: "0.95fr 1.35fr", gap: 72, flex: 1, minHeight: 0, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <p style={{ margin: 0, fontSize: 29, fontWeight: 300, lineHeight: 1.5, color: "#2e2e36" }}>
              The light theme mirrors the dark, one for one —{" "}
              <span style={{ color: "#6d28d9" }}>white anodized aluminum in place of black</span>, and the same single
              amethyst rim light defining the silhouette.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {numberedRow("01", "Same machined geometry — satin white and pearl anodized aluminum replaces the near-black.", { light: true })}
              {numberedRow("02", "High-key lighting on a soft lavender-white ground — gentle shadow in place of deep black.", { light: true })}
              {numberedRow("03", "The one amethyst rim light is unchanged — the single splash of accent on every render.", { light: true })}
              {numberedRow("04", "Still cool and monochromatic — pearl white, silver, graphite. Never warm, never colourful.", { light: true, last: true })}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "1fr 1fr",
              gap: 16,
              minHeight: 0,
              alignSelf: "stretch",
            }}
          >
            {(
              [
                ["/images/industries/automotive-dealerships.webp", "White anodized car, front, with amethyst rim light", true],
                ["/images/industries/medical-dental.webp", "White anodized dental chair with amethyst rim light", false],
                ["/images/industries/law-firms.webp", "White anodized office chairs with amethyst rim light", false],
                ["/images/industries/construction-aec.webp", "White anodized crane boom with amethyst rim light", false],
                ["/images/industries/manufacturing.webp", "White anodized robotic arm with amethyst rim light", false],
              ] as const
            ).map(([src, alt, feature]) => (
              <div
                key={src}
                style={{
                  gridColumn: feature ? "1 / 3" : undefined,
                  background: "#ffffff",
                  border: "1px solid rgba(20,20,28,0.06)",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 8px 28px rgba(18,18,28,0.05)",
                }}
              >
                <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
        <SlideFooter light num="21" left="Dark or light — one image language: white or black machined aluminum, a single amethyst rim light." />
      </div>
    ),
  },

  /* ── 22 · Object library ────────────────────────────────────── */
  {
    label: "Object library",
    notes:
      "Three asset families ship with the system: pillar objects on white, dark service renders, and the four-step refinement sequence — the only surviving stone imagery.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", padding: "78px 110px 64px", gap: 32 })}>
        <SlideHeader eyebrow="06 · Imagery" title="The object library" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.25fr", gap: 24, flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Pillar objects · on black
            </span>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: 24,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: 8,
              }}
            >
              <img src="/images/pillars/structure.webp" alt="Structure" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }} />
              <img src="/images/pillars/security.webp" alt="Security" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }} />
              <img src="/images/pillars/stability.webp" alt="Stability" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }} />
              <img src="/images/pillars/simplicity.webp" alt="Simplicity" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.45 }}>
              One per 5S commitment. Plain — no glow, no float.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Service &amp; scene renders · dark
            </span>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", borderRadius: 8, display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
              <img src="/images/managed-it.webp" alt="Managed IT render" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
              <img src="/images/cybersecurity.webp" alt="Cybersecurity render" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
            </div>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.45 }}>
              Full-bleed backdrops and cards for services and industries.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            <span style={{ fontSize: 24, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Refinement sequence · the journey
            </span>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: 8,
              }}
            >
              <img src="/images/refinement/raw-environment.webp" alt="Raw environment" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
              <img src="/images/refinement/scoped-engagement.webp" alt="Scoped engagement" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
              <img src="/images/refinement/running-refined.webp" alt="Running refined" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
              <img src="/images/refinement/polished-partnership.webp" alt="Polished partnership" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "cover", borderRadius: 8 }} />
            </div>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.45 }}>
              Raw → scoped → refined → polished. The only stone imagery; used to narrate the engagement journey.
            </span>
          </div>
        </div>
        <SlideFooter num="22" left="Generate new renders from the spec in images-look-feel.json — never mix in stock photography." />
      </div>
    ),
  },

  /* ── 23 · Imagery exclusions ────────────────────────────────── */
  {
    label: "Imagery exclusions",
    notes:
      "The negative list matters as much as the positive spec. Four hard exclusion groups — anything on this slide fails review.",
    content: (
      <div style={slideRoot({ gap: 54 })}>
        <SlideHeader eyebrow="06 · Imagery" title="Imagery exclusions" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 20, flex: 1 }}>
          {exclusionCard(
            'Nothing "gamer"',
            "RGB lighting, neon rainbows, cyberpunk blue-purple, circuit-board glow, hexagons, HUD overlays, Tron lines.",
          )}
          {exclusionCard(
            "No gems or crystals",
            "The crystal treatment is retired. No gemstones, faceted geometry, mineral formations, diamond or quartz looks.",
          )}
          {exclusionCard(
            "No cheap materials",
            "Plastic, rubber, painted or powder-coated looks, brushed-metal streaks, visible scratches or machining lines.",
          )}
          {exclusionCard(
            "No noise or clutter",
            "Lens flares, particles, chromatic aberration, bloom, busy compositions, stock-photo feel, organic or blobby forms.",
          )}
        </div>
        <SlideFooter num="23" />
      </div>
    ),
  },

  /* ── 24 · Image spec ────────────────────────────────────────── */
  {
    label: "Image spec",
    notes:
      "The exact machine-readable spec every new render is generated from. Ships with the design system as images-look-feel.json — style block up top, hard exclusions in the negative prompt. Point any image tool at this, never at stock.",
    content: (
      <div style={slideRoot({ padding: "70px 110px 60px", gap: 34 })}>
        <SlideHeader eyebrow="06 · Imagery" title="The image generation spec" size={60} gap={22} />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          >
            <BrandDot />
            <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: 22, color: "#e0e0e0" }}>
              images-look-feel.json
            </span>
            <span style={{ marginLeft: "auto", fontSize: 22, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              The canonical prompt for every new render — point any image tool here, never at stock.
            </span>
          </div>
          <JsonSpecViewer />
        </div>
        <SlideFooter num="24" />
      </div>
    ),
  },

  /* ── 25 · Iconography and pattern ───────────────────────────── */
  {
    label: "Iconography and pattern",
    notes:
      "Deliberately icon-light: five hand-tuned glyphs, the 8px brand dot, and typed characters. The IconPattern tiling is the one sanctioned repeating pattern — always near-invisible.",
    content: (
      <div style={slideRoot({ background: "#0f0f0f", gap: 54 })}>
        <SlideHeader eyebrow="06 · Iconography" title="Iconography and pattern" />
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 60, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
              {(
                [
                  <path key="ne" d="M7 17L17 7M9 7h8v8" />,
                  <path key="e" d="M4 12h16M14 6l6 6-6 6" />,
                  <path key="chev" d="M6 9l6 6 6-6" />,
                  <path key="plus" d="M12 5v14M5 12h14" />,
                  <path key="menu" d="M4 7h16M4 12h16M4 17h16" />,
                ] as const
              ).map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "#000",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5">
                    {p}
                  </svg>
                </div>
              ))}
              <div
                style={{
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BrandDot />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 27, fontWeight: 300, lineHeight: 1.6, color: "#adadad" }}>
              Stratum is deliberately icon-light. Five hand-tuned glyphs — the ↗ arrow, → arrow, chevron, plus, and
              menu — plus the <span style={{ color: "#e0e0e0" }}>8&nbsp;px amethyst dot</span>. All single-path,
              currentColor, square-cut, ~1.5&nbsp;px weight.
            </p>
            <p style={{ margin: 0, fontSize: 27, fontWeight: 300, lineHeight: 1.6, color: "#adadad" }}>
              No icon libraries. The <span style={{ color: "#e0e0e0" }}>[ brackets ]</span> and{" "}
              <span style={{ color: "#e0e0e0" }}>›</span> separator are typed characters, not assets. If a new icon is
              needed, draw it to match the arrow.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <IconPattern style={{ position: "absolute", inset: 0 }} />
              <span
                style={{
                  position: "absolute",
                  left: 32,
                  bottom: 28,
                  fontSize: 24,
                  color: "#adadad",
                  background: "rgba(0,0,0,0.55)",
                  padding: "8px 18px",
                  borderRadius: 4,
                  backdropFilter: "blur(6px)",
                }}
              >
                IconPattern — the one sanctioned repeating pattern
              </span>
            </div>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.5 }}>
              Seamless tiling of the icon glyph at very low contrast — near-black on near-black, never amethyst. For
              deck covers, dividers, and social art.
            </span>
            <Link
              href="/pattern-generator"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: 24,
                fontWeight: 400,
                color: "#b985ff",
                textDecoration: "none",
              }}
            >
              Open the pattern generator
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
        <SlideFooter num="25" />
      </div>
    ),
  },

  /* ── 26 · Closing ───────────────────────────────────────────── */
  {
    label: "Closing",
    notes:
      "Questions about using the brand go to the team — talk to a human. Assets and tokens ship with the design system.",
    content: (
      <div style={slideRoot({ padding: 0, display: "block" })}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          <IconPattern color="#7d34ff" showBackground={false} scale={0.12} style={{ position: "absolute", inset: 0 }} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, rgba(0,0,0,0.1), rgba(0,0,0,0.9) 75%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "96px 110px 90px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            textAlign: "center",
          }}
        >
          <img src="/brand/stratum-icon-white.svg" alt="Stratum" style={{ width: 84 }} />
          <h2
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 84,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              maxWidth: 1300,
            }}
          >
            The structure behind dependable technology
          </h2>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 300, lineHeight: 1.6, color: "#adadad", maxWidth: 900 }}>
            Questions about using the brand?
            <br />
            Talk to a human — no pressure, no jargon.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 26, color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
            <span>
              <a href="/contact" style={{ color: "#b985ff" }}>
                stratumtech.ca
              </a>
            </span>
            <MetaDot />
            <span>Lower Mainland, BC</span>
            <MetaDot />
            <span>{BRANDBOOK_VERSION}</span>
          </div>
        </div>
      </div>
    ),
  },
];
