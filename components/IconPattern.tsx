"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ────────────────────────────────────────────────────────────────
   IconPattern — seamless tiling of the Stratum icon (p2 wallpaper).

   The seed glyph is a convex pentagon that tessellates the plane.
   A "pair" = the seed + a copy rotated 180° about the midpoint of its
   right slant; that pair is a centrally-symmetric hexagon (parallelogon)
   which tiles by pure translation. We stamp the pair at every lattice
   point  i·u + j·v  to fill the viewport with zero seams.

   Renders one self-contained <svg> (gradient background baked in), so
   it can be dropped in as a section background *or* serialised straight
   to PNG (see /pattern-generator).
   ──────────────────────────────────────────────────────────────── */

// Seed centreline path (from public/pattern/stratum-pattern-seed.svg).
const SEED =
  "M236.609 12L239.927 18.6338L394.927 328.634L403.609 346H58.166L54.8486 339.366" +
  "L16.0986 261.866L13.416 256.5L16.0986 251.134L132.349 18.6338L135.666 12H236.609Z" +
  "M132.359 244.5H239.915L186.137 136.943L132.359 244.5Z";

// 180° rotation about the right-slant midpoint (320.109, 179).
const ROT180 = "matrix(-1 0 0 -1 640.218 358)";

// Translation lattice (in seed units): band step + row step.
const U = [491.136, 89.5] as const;
const V = [77.5, -334] as const;

const SEED_STROKE = 24; // matches the seed's own stroke-width, in seed units

/** Map the 0–1 `scale` prop to a seed-unit → pixel multiplier. */
export function scaleToK(scale: number): number {
  const s = Math.min(1, Math.max(0, scale));
  return 0.1 + s * 0.6; // ~0.1 (dense) … 0.7 (large); 0.5 → 0.4
}

/** Lattice points whose stamped pairs cover the w×h rectangle. */
function tilePositions(w: number, h: number, k: number): Array<[number, number]> {
  const Ux = k * U[0];
  const Uy = k * U[1];
  const Vx = k * V[0];
  const Vy = k * V[1];
  const det = Ux * Vy - Vx * Uy;

  // Invert the lattice at each corner to find the (i, j) span.
  let iMin = Infinity;
  let iMax = -Infinity;
  let jMin = Infinity;
  let jMax = -Infinity;
  const corners: Array<[number, number]> = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  for (const [x, y] of corners) {
    const i = (Vy * x - Vx * y) / det;
    const j = (-Uy * x + Ux * y) / det;
    if (i < iMin) iMin = i;
    if (i > iMax) iMax = i;
    if (j < jMin) jMin = j;
    if (j > jMax) jMax = j;
  }

  const M = 2; // overscan so a pair straddling the edge is never clipped short
  const out: Array<[number, number]> = [];
  for (let j = Math.floor(jMin) - M; j <= Math.ceil(jMax) + M; j++) {
    for (let i = Math.floor(iMin) - M; i <= Math.ceil(iMax) + M; i++) {
      out.push([i * Ux + j * Vx, i * Uy + j * Vy]);
    }
  }
  return out;
}

export type IconPatternProps = {
  /** Logical pixel size. Omit both to fill the parent element responsively. */
  width?: number;
  height?: number;
  /** Motif size, 0 (dense) → 1 (large). Default 0.5. */
  scale?: number;
  /** Glyph line colour. Default black. */
  color?: string;
  /** Gradient background: `from` sits top-right, `to` bottom-left. */
  bgFrom?: string;
  bgTo?: string;
  /** Draw the gradient background. Set false to overlay glyphs on a transparent fill. */
  showBackground?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const IconPattern = forwardRef<SVGSVGElement, IconPatternProps>(function IconPattern(
  {
    width,
    height,
    scale = 0.5,
    color = "#000000",
    bgFrom = "#1B1B1B",
    bgTo = "#0A0A0A",
    showBackground = true,
    className,
    style,
  },
  ref,
) {
  const fixed = typeof width === "number" && typeof height === "number";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    if (fixed) return;
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setMeasured({ w: Math.ceil(r.width), h: Math.ceil(r.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixed]);

  const uid = useId().replace(/[:]/g, "");
  const k = scaleToK(scale);

  const w = fixed ? (width as number) : measured.w;
  const h = fixed ? (height as number) : measured.h;

  const tiles = useMemo(() => (w > 0 && h > 0 ? tilePositions(w, h, k) : []), [w, h, k]);

  const svg = (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={fixed ? width : "100%"}
      height={fixed ? height : "100%"}
      viewBox={`0 0 ${w || 1} ${h || 1}`}
      preserveAspectRatio="xMidYMid slice"
      className={fixed ? className : undefined}
      style={fixed ? { display: "block", ...style } : { display: "block" }}
      role="presentation"
      aria-hidden
    >
      <defs>
        {showBackground && (
          <linearGradient
            id={`${uid}-bg`}
            gradientUnits="userSpaceOnUse"
            x1={w}
            y1={0}
            x2={0}
            y2={h}
          >
            <stop offset="0" stopColor={bgFrom} />
            <stop offset="1" stopColor={bgTo} />
          </linearGradient>
        )}
        <g
          id={`${uid}-pair`}
          fill="none"
          stroke={color}
          strokeWidth={SEED_STROKE}
          strokeLinejoin="miter"
          strokeMiterlimit={10}
        >
          <path d={SEED} />
          <path d={SEED} transform={ROT180} />
        </g>
      </defs>
      {showBackground && <rect x={0} y={0} width={w} height={h} fill={`url(#${uid}-bg)`} />}
      {tiles.map(([tx, ty], idx) => (
        <use
          key={idx}
          href={`#${uid}-pair`}
          xlinkHref={`#${uid}-pair`}
          transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k})`}
        />
      ))}
    </svg>
  );

  if (fixed) return svg;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      {svg}
    </div>
  );
});
