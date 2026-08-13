"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ────────────────────────────────────────────────────────────────
   IconPattern — seamless tiling of the canonical Stratum icon.

   The icon path is the production artwork: it keeps the diagonal break
   in the lower bar and leaves the triangular counter open. The original
   p2 lattice is preserved: a rotated pair is repeated along vectors U/V.

   Renders one self-contained <svg> (gradient background baked in), so
   it can be dropped in as a section background *or* serialised straight
   to PNG (see /pattern-generator).
   ──────────────────────────────────────────────────────────────── */

// Canonical artwork supplied by Stratum (viewBox 0 0 543 472).
export const ICON_PATH =
  "M242.06 131.111L130.843 354H274.771H314.024L372.904 472H274.771H117.759H58.8795" +
  "L0 354L176.639 0H307.482L484.12 354L543 472H412.157L353.277 354L242.06 131.111Z";

export const DEFAULT_PATTERN_LAYOUT = {
  iconScale: 0.808,
  rotationX: 358.5,
  rotationY: 189.4,
  uX: 598,
  uY: 109.2,
  vX: 99.7,
  vY: -415.5,
} as const;

/** Map the 0–1 `scale` prop to a seed-unit → pixel multiplier. */
export function scaleToK(scale: number): number {
  const s = Math.min(1, Math.max(0, scale));
  return 0.1 + s * 0.6; // ~0.1 (dense) … 0.7 (large); 0.5 → 0.4
}

/** Lattice points whose stamped pairs cover the w×h rectangle. */
export function tilePositions(
  w: number,
  h: number,
  k: number,
  layout: PatternLayout,
): Array<[number, number]> {
  const Ux = k * layout.uX;
  const Uy = k * layout.uY;
  const Vx = k * layout.vX;
  const Vy = k * layout.vY;
  const det = Ux * Vy - Vx * Uy;

  if (Math.abs(det) < 0.0001) return [];

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

  const margin = 3;
  const out: Array<[number, number]> = [];
  for (let j = Math.floor(jMin) - margin; j <= Math.ceil(jMax) + margin; j++) {
    for (let i = Math.floor(iMin) - margin; i <= Math.ceil(iMax) + margin; i++) {
      out.push([i * Ux + j * Vx, i * Uy + j * Vy]);
    }
  }

  return out;
}

type PatternSvgMarkupOptions = {
  width: number;
  height: number;
  scale?: number;
  color?: string;
  bgFrom?: string;
  bgTo?: string;
  showBackground?: boolean;
  layout?: Partial<PatternLayout>;
};

const escapeSvgAttribute = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

/** Standalone counterpart to IconPattern, used when a consumer needs pixels
    rather than React output (the print-ready badge PDF, for example). */
export function iconPatternSvgMarkup({
  width,
  height,
  scale = 0.5,
  color = "#000000",
  bgFrom = "#1B1B1B",
  bgTo = "#0A0A0A",
  showBackground = true,
  layout: layoutOverrides,
}: PatternSvgMarkupOptions): string {
  const k = scaleToK(scale);
  const layout: PatternLayout = { ...DEFAULT_PATTERN_LAYOUT, ...layoutOverrides };
  const tiles = tilePositions(width, height, k, layout);
  const pairId = "stratum-pattern-pair";
  const gradientId = "stratum-pattern-bg";
  const background = showBackground
    ? `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${width}" y1="0" x2="0" y2="${height}"><stop offset="0" stop-color="${escapeSvgAttribute(bgFrom)}"/><stop offset="1" stop-color="${escapeSvgAttribute(bgTo)}"/></linearGradient>`
    : "";
  const rect = showBackground
    ? `<rect width="${width}" height="${height}" fill="url(#${gradientId})"/>`
    : "";
  const uses = tiles
    .map(
      ([x, y]) =>
        `<use href="#${pairId}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${k})"/>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${background}<g id="${pairId}" fill="${escapeSvgAttribute(color)}"><path d="${ICON_PATH}" transform="scale(${layout.iconScale})"/><path d="${ICON_PATH}" transform="matrix(${-layout.iconScale} 0 0 ${-layout.iconScale} ${(layout.rotationX * 2).toFixed(3)} ${(layout.rotationY * 2).toFixed(3)})"/></g></defs>${rect}${uses}</svg>`;
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
  /** Fine-grained tiling geometry. Values are ratios of the icon or row dimensions. */
  layout?: Partial<PatternLayout>;
  className?: string;
  style?: CSSProperties;
};

export type PatternLayout = {
  iconScale: number;
  rotationX: number;
  rotationY: number;
  uX: number;
  uY: number;
  vX: number;
  vY: number;
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
    layout: layoutOverrides,
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
  const layout = useMemo<PatternLayout>(
    () => ({ ...DEFAULT_PATTERN_LAYOUT, ...layoutOverrides }),
    [layoutOverrides],
  );

  const w = fixed ? (width as number) : measured.w;
  const h = fixed ? (height as number) : measured.h;

  const tiles = useMemo(
    () => (w > 0 && h > 0 ? tilePositions(w, h, k, layout) : []),
    [w, h, k, layout],
  );

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
        <g id={`${uid}-pair`} fill={color}>
          <path d={ICON_PATH} transform={`scale(${layout.iconScale})`} />
          <path
            d={ICON_PATH}
            transform={`matrix(${-layout.iconScale} 0 0 ${-layout.iconScale} ${(
              layout.rotationX * 2
            ).toFixed(3)} ${(layout.rotationY * 2).toFixed(3)})`}
          />
        </g>
      </defs>
      {showBackground && <rect x={0} y={0} width={w} height={h} fill={`url(#${uid}-bg)`} />}
      {tiles.map(([x, y], idx) => (
        <use
          key={idx}
          href={`#${uid}-pair`}
          xlinkHref={`#${uid}-pair`}
          transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${k})`}
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
