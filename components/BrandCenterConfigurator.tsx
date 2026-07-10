"use client";

import { useState } from "react";
import Image from "next/image";

type LogoColor = "white" | "black";
type LogoAccent = "amethyst" | "mono";
type LogoKind = "logo" | "icon";

const COLOR_LABEL: Record<LogoColor, string> = { white: "White", black: "Black" };
const ACCENT_LABEL: Record<LogoAccent, string> = { amethyst: "Amethyst accent", mono: "Monochrome" };
const KIND_LABEL: Record<LogoKind, string> = { logo: "Wordmark", icon: "Icon" };

function assetPath(kind: LogoKind, color: LogoColor, accent: LogoAccent, ext: "svg" | "png") {
  return `/brand/stratum-${kind}-${color}${accent === "mono" ? "-mono" : ""}.${ext}`;
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M5.25 0.75H6.75V6.44L8.97 4.22L10.03 5.28L6 9.31L1.97 5.28L3.03 4.22L5.25 6.44V0.75ZM0.75 10.5H11.25V12H0.75V10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Round selector swatch, outlined in amethyst when active. */
function Swatch({
  label,
  selected,
  onClick,
  className = "",
  style,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
        selected
          ? "border-brand ring-1 ring-brand ring-offset-2 ring-offset-surface"
          : "border-line-strong hover:border-ink-faint"
      } ${className}`.trim()}
      style={style}
    >
      {children}
    </button>
  );
}

export default function BrandCenterConfigurator() {
  const [color, setColor] = useState<LogoColor>("white");
  const [accent, setAccent] = useState<LogoAccent>("amethyst");
  const [kind, setKind] = useState<LogoKind>("logo");

  const svg = assetPath(kind, color, accent, "svg");
  const png = assetPath(kind, color, accent, "png");
  const variantName = `${KIND_LABEL[kind]} — ${COLOR_LABEL[color]}, ${ACCENT_LABEL[accent].toLowerCase()}`;

  // The preview surface flips so the selected mark is always visible:
  // white marks sit on the dark grid, black marks on a light one.
  const previewStyle: React.CSSProperties =
    color === "white"
      ? {
          backgroundColor: "#0f0f0f",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }
      : {
          backgroundColor: "#e9e9ee",
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      {/* Preview + downloads */}
      <div className="flex flex-col gap-3">
        <div
          className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-line p-10 transition-colors md:p-16"
          style={previewStyle}
        >
          <Image
            src={svg}
            alt={`Stratum ${variantName}`}
            width={kind === "logo" ? 378 : 58}
            height={50}
            unoptimized
            className={kind === "logo" ? "h-auto w-full max-w-[560px]" : "h-auto w-full max-w-[140px]"}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-faint">{variantName}</p>
          <div className="flex gap-3">
            <a href={svg} download className="btn btn-secondary !gap-2 !px-4 !py-2 text-sm">
              <DownloadIcon />
              <span>SVG</span>
            </a>
            <a href={png} download className="btn btn-secondary !gap-2 !px-4 !py-2 text-sm">
              <DownloadIcon />
              <span>PNG</span>
            </a>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-col gap-7 rounded-xl border border-line bg-surface p-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Colour
          </legend>
          <div className="flex gap-3">
            <Swatch
              label="White"
              selected={color === "white"}
              onClick={() => setColor("white")}
              style={{ backgroundColor: "#ffffff" }}
            />
            <Swatch
              label="Black"
              selected={color === "black"}
              onClick={() => setColor("black")}
              style={{ backgroundColor: "#14141A" }}
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Accent
          </legend>
          <div className="flex gap-3">
            <Swatch
              label="Amethyst accent"
              selected={accent === "amethyst"}
              onClick={() => setAccent("amethyst")}
              style={{ backgroundColor: "#7d34ff" }}
            />
            <Swatch
              label="Monochrome"
              selected={accent === "mono"}
              onClick={() => setAccent("mono")}
              style={{ background: "linear-gradient(135deg, #ffffff 50%, #14141A 50%)" }}
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Type
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {(["logo", "icon"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={`flex h-16 items-center justify-center rounded-md border bg-bg px-3 transition-colors ${
                  kind === k ? "border-brand" : "border-line-strong hover:border-ink-faint"
                }`}
              >
                <Image
                  src={k === "logo" ? "/brand/stratum-logo-white.svg" : "/brand/stratum-icon-white.svg"}
                  alt={KIND_LABEL[k]}
                  width={k === "logo" ? 378 : 58}
                  height={50}
                  unoptimized
                  className={k === "logo" ? "h-auto w-full max-w-[110px]" : "h-7 w-auto"}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <p className="text-sm leading-relaxed text-ink-faint">
          White versions look empty when opened on a white desktop preview — the paths are
          there, just white. Drop them on a dark background.
        </p>
      </div>
    </div>
  );
}
