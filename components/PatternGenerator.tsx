"use client";

import { useCallback, useRef, useState } from "react";
import { IconPattern } from "@/components/IconPattern";
import { ArrowNE } from "@/components/ui";

/* ────────────────────────────────────────────────────────────────
   Pattern generator (hidden internal tool)
   Compose a seamless Stratum-icon background at any size and download
   it as a PNG for decks, docs and social art. Everything is baked into
   a single self-contained <svg>, which we rasterise on the client.
   ──────────────────────────────────────────────────────────────── */

const PRESETS: Array<{ label: string; w: number; h: number }> = [
  { label: "1920 × 1080", w: 1920, h: 1080 },
  { label: "1280 × 720", w: 1280, h: 720 },
  { label: "1080 × 1080", w: 1080, h: 1080 },
  { label: "1080 × 1920", w: 1080, h: 1920 },
];

const DEFAULTS = {
  width: 1920,
  height: 1080,
  scale: 0.445,
  color: "#000000",
  bgFrom: "#1B1B1B",
  bgTo: "#0A0A0A",
};

function clampSize(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.min(6000, Math.max(1, Math.round(n)));
}

export default function PatternGenerator() {
  const [width, setWidth] = useState(DEFAULTS.width);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [scale, setScale] = useState(DEFAULTS.scale);
  const [color, setColor] = useState(DEFAULTS.color);
  const [bgFrom, setBgFrom] = useState(DEFAULTS.bgFrom);
  const [bgTo, setBgTo] = useState(DEFAULTS.bgTo);
  const [busy, setBusy] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const download = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    setBusy(true);

    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clone.setAttribute("width", String(width));
    clone.setAttribute("height", String(height));
    clone.removeAttribute("style");

    const data = new XMLSerializer().serializeToString(clone);
    const svgUrl = URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        setBusy(false);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((blob) => {
        if (blob) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `stratum-pattern-${width}x${height}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(a.href);
        }
        setBusy(false);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      setBusy(false);
    };
    img.src = svgUrl;
  }, [width, height]);

  const reset = () => {
    setWidth(DEFAULTS.width);
    setHeight(DEFAULTS.height);
    setScale(DEFAULTS.scale);
    setColor(DEFAULTS.color);
    setBgFrom(DEFAULTS.bgFrom);
    setBgTo(DEFAULTS.bgTo);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      {/* Preview */}
      <div className="flex flex-col gap-3">
        <div
          className="overflow-hidden rounded-xl border border-line"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <IconPattern
            ref={svgRef}
            width={width}
            height={height}
            scale={scale}
            color={color}
            bgFrom={bgFrom}
            bgTo={bgTo}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <p className="text-sm text-ink-faint">
          Live preview · exports at {width} × {height}px
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-7 rounded-xl border border-line bg-surface p-6">
        {/* Size */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Size (px)
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-dim">Width</span>
              <input
                type="number"
                min={1}
                max={6000}
                value={width}
                onChange={(e) => setWidth(clampSize(e.target.valueAsNumber))}
                className="rounded-md border border-line-strong bg-bg px-3 py-2 text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-ink-dim">Height</span>
              <input
                type="number"
                min={1}
                max={6000}
                value={height}
                onChange={(e) => setHeight(clampSize(e.target.valueAsNumber))}
                className="rounded-md border border-line-strong bg-bg px-3 py-2 text-ink outline-none focus:border-brand"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = p.w === width && p.h === height;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setWidth(p.w);
                    setHeight(p.h);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "border-brand text-brand-light"
                      : "border-line-strong text-ink-dim hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Scale */}
        <label className="flex flex-col gap-2">
          <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Scale
            <span className="tabular-nums text-ink-dim">{scale.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(e.target.valueAsNumber)}
            className="accent-brand"
          />
        </label>

        {/* Colours */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Colours
          </legend>
          <ColorRow label="Icon" value={color} onChange={setColor} />
          <ColorRow label="Background — top-right" value={bgFrom} onChange={setBgFrom} />
          <ColorRow label="Background — bottom-left" value={bgTo} onChange={setBgTo} />
        </fieldset>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="btn btn-primary justify-center disabled:opacity-60"
          >
            <span>{busy ? "Rendering…" : "Download PNG"}</span>
            <ArrowNE />
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-sm text-ink-faint underline-offset-4 hover:text-ink hover:underline"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-ink-dim">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-24 rounded-md border border-line-strong bg-bg px-2 py-1.5 text-sm uppercase tabular-nums text-ink outline-none focus:border-brand"
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-9 w-9 cursor-pointer rounded-md border border-line-strong bg-transparent"
        />
      </div>
    </div>
  );
}
