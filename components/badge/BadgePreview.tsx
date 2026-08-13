"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ensureBadgeFonts } from "@/lib/badge-fonts";
import { IconPattern } from "@/components/IconPattern";
import {
  BADGE,
  BLEED_BOX,
  clearTextMeasureCache,
  SAFE_BOX,
  TRIM_BOX,
  clampCrop,
  photoDrawRect,
  resolveTextSlots,
  type BadgePerson,
  type PhotoCrop,
} from "@/lib/badge-layout";

/* ────────────────────────────────────────────────────────────────
   BadgePreview — the badge, drawn as one SVG whose user units are
   millimetres (viewBox "0 0 60 92" for a 54×86 card with 3 mm
   bleed). Every coordinate comes from lib/badge-layout, which is
   also what lib/badge-pdf feeds to jsPDF — so this is a true
   preview of the print output, not an approximation of it.

   Pass `onCropChange` to make the photo area draggable: the user
   repositions the crop on the real badge instead of in a separate
   dialog, which is why there is no second cropping surface.
   ──────────────────────────────────────────────────────────────── */

type Props = {
  person: BadgePerson;
  /** Trim/safe guides — preview only, never drawn into the PDF. */
  showGuides?: boolean;
  /** Omit to render a static (non-interactive) badge. */
  onCropChange?: (crop: PhotoCrop) => void;
  className?: string;
};

/** How far one arrow-key press nudges the photo, in millimetres. */
const NUDGE = 0.5;

/** Re-render once Manrope is really loaded.
    Text sizes come from a canvas measurement, and canvas silently measures
    the fallback face until the web font arrives — so the first paint can size
    a long name against the wrong metrics. Waiting, dropping the cached widths
    and re-rendering is what keeps the preview honest. Starts `false` on every
    render path so the server and client markup agree. */
function useBadgeFontsLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    ensureBadgeFonts().then(() => {
      if (!alive) return;
      clearTextMeasureCache();
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return loaded;
}

export default function BadgePreview({
  person,
  showGuides = false,
  onCropChange,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const clipId = `badge-photo-${uid}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{
    startX: number;
    startY: number;
    startCrop: PhotoCrop;
    mmPerPx: number;
  } | null>(null);

  const { band, clip, guide, emptyFill } = BADGE.photo;
  // Sizes text against real Manrope metrics rather than the fallback face.
  useBadgeFontsLoaded();
  const slots = resolveTextSlots(person);
  const photo = person.photo;
  const draw = photo ? photoDrawRect(photo, person.crop) : null;
  const interactive = Boolean(onCropChange && photo);

  const applyCrop = (next: PhotoCrop) => {
    if (!onCropChange || !photo) return;
    onCropChange(clampCrop(photo, next));
  };

  const onPointerDown = (event: React.PointerEvent<SVGRectElement>) => {
    if (!interactive || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    if (box.width === 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      startCrop: person.crop,
      // Rendered pixels → millimetres, so a drag moves the photo by the
      // distance the pointer actually travelled on the card.
      mmPerPx: BLEED_BOX.w / box.width,
    };
  };

  const onPointerMove = (event: React.PointerEvent<SVGRectElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = (event.clientX - d.startX) * d.mmPerPx;
    const dy = (event.clientY - d.startY) * d.mmPerPx;
    // Offsets are plain millimetres, so the photo tracks the pointer 1:1.
    applyCrop({
      zoom: d.startCrop.zoom,
      offsetX: d.startCrop.offsetX + dx,
      offsetY: d.startCrop.offsetY + dy,
    });
  };

  const endDrag = (event: React.PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<SVGRectElement>) => {
    if (!interactive) return;
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-NUDGE, 0],
      ArrowRight: [NUDGE, 0],
      ArrowUp: [0, -NUDGE],
      ArrowDown: [0, NUDGE],
    };
    const move = step[event.key];
    if (!move) return;
    event.preventDefault();
    applyCrop({
      zoom: person.crop.zoom,
      offsetX: person.crop.offsetX + move[0],
      offsetY: person.crop.offsetY + move[1],
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${BLEED_BOX.w} ${BLEED_BOX.h}`}
      className={`block h-auto w-full ${className}`.trim()}
      role="img"
      aria-label={`Badge preview for ${person.fullName.trim() || "an unnamed collaborator"}`}
    >
      <defs>
        {/* The band, bled off left and right — the only thing that crops the
            photo. Never the head capsule: that would cut the shoulders. */}
        <clipPath id={clipId}>
          <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} />
        </clipPath>
      </defs>

      {/* Full-bleed canonical pattern. A 600×920 logical canvas maps exactly
          onto the 60×92 mm bleed box, preserving the generator's geometry. */}
      <rect width={BLEED_BOX.w} height={BLEED_BOX.h} fill="#0C0C0C" />
      <g transform={`scale(${BLEED_BOX.w / BADGE.background.logicalWidth})`}>
        <IconPattern
          width={BADGE.background.logicalWidth}
          height={BADGE.background.logicalHeight}
          scale={BADGE.background.scale}
          color={BADGE.background.color}
          bgFrom={BADGE.background.bgFrom}
          bgTo={BADGE.background.bgTo}
        />
      </g>

      {draw && photo ? (
        <g clipPath={`url(#${clipId})`}>
          <image
            href={photo.dataUrl}
            x={draw.x}
            y={draw.y}
            width={draw.w}
            height={draw.h}
            // We already sized the rect from the image's own aspect ratio, and
            // the PDF bake does the same maths — let neither renderer re-fit.
            preserveAspectRatio="none"
          />
        </g>
      ) : (
        // Nothing uploaded: mark where the head belongs, nothing more. A grey
        // placeholder box would print if it ever leaked into an export.
        <rect
          x={guide.x}
          y={guide.y}
          width={guide.w}
          height={guide.h}
          rx={guide.w / 2}
          ry={guide.w / 2}
          fill={emptyFill}
        />
      )}

      {/* The information panel covers the lower background and creates a
          precise edge for the portrait to meet. */}
      <rect
        x={0}
        y={BADGE.panel.y}
        width={BLEED_BOX.w}
        height={BLEED_BOX.h - BADGE.panel.y}
        fill={BADGE.panel.fill}
      />
      <line
        x1={0}
        y1={BADGE.panel.y}
        x2={BLEED_BOX.w}
        y2={BADGE.panel.y}
        stroke={BADGE.panel.separator}
        strokeOpacity={BADGE.panel.separatorOpacity}
        strokeWidth={BADGE.panel.separatorWidth}
      />

      {slots.map((slot) => (
        <text
          key={slot.key}
          x={slot.x}
          y={slot.y}
          fontFamily={BADGE.font.css}
          fontSize={slot.sizeMm}
          fontWeight={slot.weight === "bold" ? 700 : 400}
          fill={slot.color}
          fillOpacity={slot.opacity}
          letterSpacing={slot.tracking || undefined}
          textAnchor={
            slot.align === "center" ? "middle" : slot.align === "right" ? "end" : "start"
          }
          style={{ whiteSpace: "pre" }}
        >
          {slot.text}
        </text>
      ))}

      <image
        href={BADGE.logo.previewSrc}
        x={BADGE.logo.x}
        y={BADGE.logo.y}
        width={BADGE.logo.w}
        height={BADGE.logo.h}
        preserveAspectRatio="xMidYMid meet"
      />

      {showGuides && (
        <g fill="none" pointerEvents="none">
          <rect
            x={TRIM_BOX.x}
            y={TRIM_BOX.y}
            width={TRIM_BOX.w}
            height={TRIM_BOX.h}
            stroke="#7D34FF"
            strokeWidth={0.2}
            strokeDasharray="1.2 1"
          />
          <rect
            x={SAFE_BOX.x}
            y={SAFE_BOX.y}
            width={SAFE_BOX.w}
            height={SAFE_BOX.h}
            stroke="#FFFFFF"
            strokeOpacity={0.35}
            strokeWidth={0.15}
            strokeDasharray="0.8 0.8"
          />
          {/* Photo band, straight from Arte.svg. */}
          <rect
            x={band.x}
            y={band.y}
            width={band.w}
            height={band.h}
            stroke="#FFFFFF"
            strokeOpacity={0.5}
            strokeWidth={0.15}
          />
          {/* Head target. Line up the sitter's head with this; the body is
              meant to carry on past it. */}
          <rect
            x={guide.x}
            y={guide.y}
            width={guide.w}
            height={guide.h}
            rx={guide.w / 2}
            ry={guide.w / 2}
            stroke="#71FF92"
            strokeOpacity={0.55}
            strokeWidth={0.3}
          />
        </g>
      )}

      {/* Drag surface sits last so it takes the pointer, and only exists
          once there is a photo to move. */}
      {interactive && (
        <rect
          x={clip.x}
          y={clip.y}
          width={clip.w}
          height={clip.h}
          fill="transparent"
          tabIndex={0}
          role="application"
          aria-label="Position the photo — drag to line the head up with the guide, or use the arrow keys"
          className="cursor-move outline-none focus-visible:stroke-brand"
          strokeWidth={0.4}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          style={{ touchAction: "none" }}
        />
      )}
    </svg>
  );
}
