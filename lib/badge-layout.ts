/* ────────────────────────────────────────────────────────────────
   badge-layout.ts — single source of truth for the internal ID
   badge generator (/internal/id-badge).

   Everything geometric lives here, in millimetres, so the on-screen
   preview and the print PDF read the same numbers and can never
   drift apart. The preview renders an <svg viewBox="0 0 W H"> whose
   user units *are* millimetres; the PDF is built with jsPDF in
   `unit: "mm"`. Same coordinates, two renderers.

   ▸ To swap the badge artwork: replace the string in
     badge-artwork.ts (paste the whole <svg> document). The contract
     it has to meet is documented in that file.
   ▸ To move the photo or the text: edit BADGE.photo (band / clip /
     head guide) and BADGE.text. Nothing else needs touching.
   ▸ To change the trim size, bleed, sheet or crop marks: edit
     BADGE.trim / BADGE.bleed / BADGE.sheet / BADGE.cropMarks. The
     per-page count is derived from those, never hardcoded.

   Origin note: every coordinate in this file is measured from the
   top-left of the *bleed box*, not the trim box. So the trim edge
   sits at (bleed, bleed) and artwork that must bleed off the card
   runs to the full BLEED_BOX size.
   ──────────────────────────────────────────────────────────────── */

import { BADGE_ARTWORK_SVG } from "./badge-artwork";
import { BADGE_FONT } from "./badge-fonts";

export const MM_PER_PT = 25.4 / 72;
export const ptToMm = (pt: number) => pt * MM_PER_PT;
export const mmToPt = (mm: number) => mm / MM_PER_PT;

export type Rect = { x: number; y: number; w: number; h: number };

/* ── Data shapes ─────────────────────────────────────────────────
   These live in React state only — see IdBadgeBuilder. Nothing here
   is ever written to storage, a cookie, or the network. */

export type BadgeFieldKey = "fullName" | "jobTitle" | "email" | "phone";

/** An uploaded photo, held as an in-memory data URL for the tab's lifetime. */
export type BadgePhoto = {
  dataUrl: string;
  naturalWidth: number;
  naturalHeight: number;
};

/** Zoom is a multiplier on cover-fit; offsets are fractions of the frame. */
export type PhotoCrop = { zoom: number; offsetX: number; offsetY: number };

export const DEFAULT_CROP: PhotoCrop = { zoom: 1, offsetX: 0, offsetY: 0 };

export type BadgePerson = {
  id: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  photo: BadgePhoto | null;
  crop: PhotoCrop;
};

/* ── Text slots ──────────────────────────────────────────────────
   `field: null` means fixed badge lettering (the wordmark); anything
   else pulls from the person record and is skipped when empty. */

export type TextSlot = {
  key: string;
  field: BadgeFieldKey | null;
  text?: string;
  /** Anchor point in mm. `align` decides what x means. */
  x: number;
  /** Text baseline in mm (matches SVG `y` and jsPDF's alphabetic baseline). */
  y: number;
  sizePt: number;
  weight: "normal" | "bold";
  color: string;
  align: "left" | "center" | "right";
  /** Shrink-to-fit budget in mm. */
  maxWidth: number;
  /** Letter spacing in mm. */
  tracking?: number;
  uppercase?: boolean;
};

/** Used if the artwork ever fails to parse, so export still works. */
export const BADGE_BACKGROUND_FALLBACK = "#0C0C0C";

/* ── The badge ───────────────────────────────────────────────────── */

export const BADGE = {
  /** Final cut size, portrait. */
  trim: { w: 54, h: 86 },
  /** Bleed on all four sides. */
  bleed: 3,
  /** Keep-clear inset from the trim edge; advisory, drawn as a preview guide. */
  safe: 4,

  /** Manrope, Stratum's body face — the same two .ttf files drive the
      preview (@font-face) and the PDF (embedded by jsPDF), so the export
      cannot substitute a different face. See lib/badge-fonts.ts. */
  font: {
    pdf: BADGE_FONT.pdfName,
    css: `"${BADGE_FONT.cssFamily}", ui-sans-serif, sans-serif`,
  },

  /* The photo is NOT cover-fitted into a small frame. The artwork asks for a
     cut-out portrait standing in a band, so there are two separate rects:

       band  — the designed photo region, straight off Arte.svg. Its base at
               y 46.6 is the same line where the artwork's pattern gives way
               to flat black.
       clip  — what actually crops the photo. The band, widened to the bleed
               on both sides, so broad shoulders run off the card properly
               instead of stopping on the trim line where a drifting
               guillotine would expose a sliver of background. Shoulders are
               never cropped by anything else.
       head  — a placement target, not a crop. The sitter's head goes inside
               this capsule; the body carries on past it. Masking to the
               capsule is exactly what must NOT happen. */
  photo: {
    /** Designed photo band, from Arte.svg (trim width × the upper band). */
    band: { x: 3, y: 12.6, w: 54, h: 34 } as Rect,
    /** The real crop: the band bled off left and right. */
    clip: { x: 0, y: 12.6, w: 60, h: 34 } as Rect,
    /** Head target from Arte.svg. radius = w/2, i.e. a true capsule. */
    head: { x: 12.35, y: 20.55, w: 11.1, h: 15.05 } as Rect,

    /** Opening placement for a fresh upload, before the user nudges it.
        A head-and-shoulders portrait is assumed: the head fills roughly this
        much of the frame height and sits this far down from the top, centred.
        Only a starting guess — the head guide is there to correct it against,
        and these two numbers are the ones to retune if uploads consistently
        land off. */
    autoFit: { headHeightFraction: 0.42, headCentreFraction: 0.3 },

    /** Faint capsule drawn where the photo will go, while there is none. */
    emptyFill: "#17171B",

    /** Baked at this resolution for the PDF. 400 dpi across the 60 mm clip is
        ~945 px — well above the 300 dpi print floor. PNG, not JPEG: a
        background-removed portrait has to keep its alpha so the artwork shows
        through around the sitter. */
    export: { dpi: 400, format: "png" as "png" | "jpeg", quality: 0.92 },
  },

  /* Left-aligned on one common margin, matching the reference art. All four
     slots sit on the flat black below the divider (y 46.6) and clear the
     STRATUM wordmark that starts at y 81.75. Note there is no "STRATUM"
     slot: the wordmark and the "A" mark belong to the artwork.

     Sizes were solved from the reference rather than eyeballed: the set
     width of each line in the reference was measured, then the point size
     that reproduces it *in Manrope* derived from that. Re-solve them if the
     face ever changes — Manrope runs ~2% narrower than a generic sans, which
     is enough to shift a 19 pt name by half a millimetre. `maxWidth` runs from
     the margin to the safe-area edge (53 − 9), so longer names shrink to
     fit instead of running into the trim. */
  text: [
    {
      key: "fullName",
      field: "fullName",
      x: 9,
      y: 55.5,
      sizePt: 19.1,
      weight: "bold",
      color: "#FFFFFF",
      align: "left",
      maxWidth: 44,
    },
    {
      key: "jobTitle",
      field: "jobTitle",
      x: 9,
      y: 60.5,
      sizePt: 8.7,
      weight: "normal",
      color: "#FFFFFF",
      align: "left",
      maxWidth: 44,
    },
    {
      key: "email",
      field: "email",
      x: 9,
      y: 68.5,
      sizePt: 6.8,
      weight: "normal",
      color: "#FFFFFF",
      align: "left",
      maxWidth: 44,
    },
    {
      key: "phone",
      field: "phone",
      x: 9,
      y: 72,
      sizePt: 6.8,
      weight: "normal",
      color: "#FFFFFF",
      align: "left",
      maxWidth: 44,
    },
  ] satisfies TextSlot[] as TextSlot[],

  /** Trim marks sit in the gutter, offset so they never touch the artwork. */
  cropMarks: { length: 3, offset: 1.2, width: 0.15, color: "#000000" },

  /** A4 portrait imposition. `perPage` is derived in computeSheetGeometry(). */
  sheet: {
    page: { w: 210, h: 297 },
    /** Extra space *between* bleed boxes, on top of the 2×bleed they already
        contribute. Gives the crop marks somewhere to live. */
    gutter: 4,
    /** Smallest acceptable page margin; the grid is centred within it. */
    minMargin: 5,
  },

  /** Single-badge export: page = bleed box + room for the marks. */
  single: { markMargin: 6 },
};

/* ── Derived geometry ────────────────────────────────────────────── */

export const BLEED_BOX = {
  w: BADGE.trim.w + BADGE.bleed * 2,
  h: BADGE.trim.h + BADGE.bleed * 2,
};

/** The cut line, in bleed-box coordinates. */
export const TRIM_BOX: Rect = {
  x: BADGE.bleed,
  y: BADGE.bleed,
  w: BADGE.trim.w,
  h: BADGE.trim.h,
};

/** The keep-clear box, in bleed-box coordinates. */
export const SAFE_BOX: Rect = {
  x: BADGE.bleed + BADGE.safe,
  y: BADGE.bleed + BADGE.safe,
  w: BADGE.trim.w - BADGE.safe * 2,
  h: BADGE.trim.h - BADGE.safe * 2,
};

/* ── Artwork normalisation ───────────────────────────────────────
   The delivered file declares its own pixel size (1200×1840) and
   carries Figma's generated ids. Two things have to be fixed up
   before it can be used, and both are pure string work so the
   preview and the PDF get byte-identical markup:

   1. width/height are forced to the bleed box in mm, leaving the
      viewBox alone. That is what lets the same file drop into an
      SVG whose user units are millimetres, whatever scale the
      designer exported at.
   2. ids are suffixed per instance. A badge sheet puts nine copies
      of this artwork in one document, and duplicate ids would make
      every clip-path reference resolve to whichever copy the
      browser happened to parse first. */

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The artwork markup, sized to the bleed box with ids scoped to `uid`. */
export function artworkMarkup(uid: string): string {
  let svg = BADGE_ARTWORK_SVG;

  // Force the outer dimensions; keep the viewBox so the art still scales.
  svg = svg.replace(/^<svg\b[^>]*>/, (openTag) =>
    openTag
      .replace(/\swidth="[^"]*"/, "")
      .replace(/\sheight="[^"]*"/, "")
      .replace(/^<svg/, `<svg width="${BLEED_BOX.w}" height="${BLEED_BOX.h}"`),
  );

  for (const id of new Set(svg.match(/id="([^"]+)"/g)?.map((m) => m.slice(4, -1)) ?? [])) {
    const escaped = escapeForRegex(id);
    svg = svg
      .replace(new RegExp(`id="${escaped}"`, "g"), `id="${id}-${uid}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, "g"), `url(#${id}-${uid})`)
      .replace(new RegExp(`href="#${escaped}"`, "g"), `href="#${id}-${uid}"`);
  }

  return svg;
}

export type SheetGeometry = {
  cols: number;
  rows: number;
  perPage: number;
  marginX: number;
  marginY: number;
  gutter: number;
  page: { w: number; h: number };
};

/** How many bleed boxes fit on the sheet, and where the grid starts.
    Derived from the trim/bleed/gutter above — change those and the
    imposition follows, including the per-page count. */
export function computeSheetGeometry(): SheetGeometry {
  const { page, gutter, minMargin } = BADGE.sheet;
  const fit = (available: number, cell: number) =>
    Math.max(1, Math.floor((available - 2 * minMargin + gutter) / (cell + gutter)));

  const cols = fit(page.w, BLEED_BOX.w);
  const rows = fit(page.h, BLEED_BOX.h);
  const gridW = cols * BLEED_BOX.w + (cols - 1) * gutter;
  const gridH = rows * BLEED_BOX.h + (rows - 1) * gutter;

  return {
    cols,
    rows,
    perPage: cols * rows,
    marginX: (page.w - gridW) / 2,
    marginY: (page.h - gridH) / 2,
    gutter,
    page,
  };
}

/** Top-left of the bleed box for the nth slot on a page (row-major). */
export function sheetCellOrigin(geom: SheetGeometry, indexOnPage: number) {
  const col = indexOnPage % geom.cols;
  const row = Math.floor(indexOnPage / geom.cols);
  return {
    x: geom.marginX + col * (BLEED_BOX.w + geom.gutter),
    y: geom.marginY + row * (BLEED_BOX.h + geom.gutter),
  };
}

export function singlePageSize() {
  const m = BADGE.single.markMargin;
  return { w: BLEED_BOX.w + m * 2, h: BLEED_BOX.h + m * 2 };
}

export type Line = { x1: number; y1: number; x2: number; y2: number };

/** The eight L-shaped trim marks around a trim rect, in page coordinates.
    Drawn outside the trim so they land in the bleed/gutter and get cut away. */
export function cropMarkLines(trim: Rect): Line[] {
  const { length: len, offset: off } = BADGE.cropMarks;
  const left = trim.x;
  const right = trim.x + trim.w;
  const top = trim.y;
  const bottom = trim.y + trim.h;

  return [
    // Horizontal arms, reaching outward from each corner.
    { x1: left - off - len, y1: top, x2: left - off, y2: top },
    { x1: right + off, y1: top, x2: right + off + len, y2: top },
    { x1: left - off - len, y1: bottom, x2: left - off, y2: bottom },
    { x1: right + off, y1: bottom, x2: right + off + len, y2: bottom },
    // Vertical arms.
    { x1: left, y1: top - off - len, x2: left, y2: top - off },
    { x1: right, y1: top - off - len, x2: right, y2: top - off },
    { x1: left, y1: bottom + off, x2: left, y2: bottom + off + len },
    { x1: right, y1: bottom + off, x2: right, y2: bottom + off + len },
  ];
}

/* ── Photo placement ────────────────────────────────────────────
   One implementation, used by the preview (as an <image> inside a
   clipPath) and by the PDF (as the source rect for the canvas bake).
   Identical inputs in, identical rect out — that is what keeps the
   framing from shifting between screen and print.

   The photo is placed, not cover-fitted: it keeps its aspect ratio,
   is free to be smaller or larger than the clip, and is only ever
   cropped by BADGE.photo.clip. Zoom scales about the centre of the
   head capsule, so sizing the head does not walk it off the guide. */

export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 3;

/** Centre of the head guide — the anchor everything scales around. */
function headCentre() {
  const { head } = BADGE.photo;
  return { x: head.x + head.w / 2, y: head.y + head.h / 2 };
}

/** Opening placement for zoom 1 / no offset: the head heuristic from
    BADGE.photo.autoFit, mapped onto the head guide. */
function autoFitRect(natural: { w: number; h: number }): Rect {
  const { head, autoFit } = BADGE.photo;
  const centre = headCentre();
  // If the head is `headHeightFraction` of the photo, the whole photo has to
  // be this tall for that head to fill the guide.
  const h = head.h / autoFit.headHeightFraction;
  const w = h * (natural.w / natural.h);
  return {
    x: centre.x - w / 2,
    y: centre.y - h * autoFit.headCentreFraction,
    w,
    h,
  };
}

/** The drawn rect before clamping. */
function rawDrawRect(natural: { w: number; h: number }, crop: PhotoCrop): Rect {
  const base = autoFitRect(natural);
  const a = headCentre();
  const z = crop.zoom;
  return {
    x: a.x - (a.x - base.x) * z + crop.offsetX,
    y: a.y - (a.y - base.y) * z + crop.offsetY,
    w: base.w * z,
    h: base.h * z,
  };
}

/** How much of the photo must stay over the clip region, in mm, so it can
    never be dragged completely out of sight. Deliberately loose: the point
    of this placement model is that the sitter may hang off any edge. */
const MIN_ON_BAND = 8;

export function clampCrop(
  natural: { w: number; h: number },
  crop: PhotoCrop,
): PhotoCrop {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, crop.zoom));
  const r = rawDrawRect(natural, { ...crop, zoom });
  const clip = BADGE.photo.clip;
  const overlap = (span: number) => Math.min(MIN_ON_BAND, span);

  let { offsetX, offsetY } = crop;

  const ox = overlap(r.w);
  const maxX = clip.x + clip.w - ox;
  const minX = clip.x + ox - r.w;
  if (r.x > maxX) offsetX -= r.x - maxX;
  if (r.x < minX) offsetX += minX - r.x;

  const oy = overlap(r.h);
  const maxY = clip.y + clip.h - oy;
  const minY = clip.y + oy - r.h;
  if (r.y > maxY) offsetY -= r.y - maxY;
  if (r.y < minY) offsetY += minY - r.y;

  return { zoom, offsetX, offsetY };
}

/** Where the whole image lands, in mm. BADGE.photo.clip crops it. */
export function photoDrawRect(
  natural: { w: number; h: number },
  crop: PhotoCrop,
): Rect {
  return rawDrawRect(natural, clampCrop(natural, crop));
}

/** Mechanical framing problems, phrased as what is actually measured.

    These check the photo's *rectangle* against the band and the head guide.
    They deliberately do not claim anything about the head itself: without
    face detection there is no way to know where the head sits inside the
    uploaded pixels, so whether the head fills the capsule is something only
    the on-screen green guide can tell you. Advisory — nothing is blocked. */
export function photoFitWarnings(
  natural: { w: number; h: number },
  crop: PhotoCrop,
): string[] {
  const r = photoDrawRect(natural, crop);
  const clip = BADGE.photo.clip;
  const { head } = BADGE.photo;
  const out: string[] = [];

  // The photo ends inside the band, so whatever is at its base — usually the
  // shoulders — gets a hard horizontal cut instead of running off the edge.
  if (r.y + r.h < clip.y + clip.h - 0.5) {
    out.push("the photo ends inside the band, so the shoulders will be cut short");
  }
  if (r.y > head.y) {
    out.push("the photo starts below the top of the head guide");
  }
  if (r.x > head.x || r.x + r.w < head.x + head.w) {
    out.push("the photo doesn't cover the head guide");
  }

  return out;
}

/* ── Text fitting ────────────────────────────────────────────────
   Both renderers ask for the same resolved size, so a name that has
   to shrink shrinks by the same amount on screen and on paper.
   Widths come from a canvas measurement of the CSS font, which is
   now literally the same Manrope file jsPDF embeds — so the two
   agree, rather than merely being close.

   Callers MUST have awaited ensureBadgeFonts() first: canvas
   silently measures the fallback face until the web font is in. */

const MIN_SIZE_PT = 4;

let measureCtx: CanvasRenderingContext2D | null | undefined;
const emCache = new Map<string, number>();

/** Advance width of `text` in em units (i.e. at font-size 1). */
function emWidth(text: string, weight: string): number {
  const cacheKey = `${weight}|${text}`;
  const hit = emCache.get(cacheKey);
  if (hit !== undefined) return hit;

  if (measureCtx === undefined) {
    measureCtx =
      typeof document === "undefined"
        ? null
        : document.createElement("canvas").getContext("2d");
  }

  let em: number;
  if (measureCtx) {
    // Measure at 100px and normalise, so one measurement serves every size.
    measureCtx.font = `${weight} 100px ${BADGE.font.css}`;
    em = measureCtx.measureText(text).width / 100;
  } else {
    // No DOM (SSR): rough average, only used before hydration.
    em = text.length * (weight === "bold" ? 0.56 : 0.52);
  }

  emCache.set(cacheKey, em);
  return em;
}

/** Drop cached widths — call once the web font lands, or every measurement
    taken against the fallback face would stay wrong for the session. */
export function clearTextMeasureCache() {
  emCache.clear();
}

export type ResolvedText = {
  key: string;
  text: string;
  x: number;
  y: number;
  sizePt: number;
  /** Same size in mm, for the SVG preview. */
  sizeMm: number;
  weight: "normal" | "bold";
  color: string;
  align: "left" | "center" | "right";
  tracking: number;
};

/** Turn a person into positioned, size-fitted text. Empty fields drop out. */
export function resolveTextSlots(person: BadgePerson): ResolvedText[] {
  const out: ResolvedText[] = [];

  for (const slot of BADGE.text) {
    const raw = slot.field ? person[slot.field] : (slot.text ?? "");
    const value = raw.trim();
    if (!value) continue;

    const text = slot.uppercase ? value.toLocaleUpperCase() : value;
    const tracking = slot.tracking ?? 0;
    const em = emWidth(text, slot.weight);
    const trackingWidth = tracking * Math.max(0, text.length - 1);

    let sizePt = slot.sizePt;
    if (em * ptToMm(sizePt) + trackingWidth > slot.maxWidth) {
      const glyphBudget = slot.maxWidth - trackingWidth;
      sizePt = glyphBudget > 0 ? Math.max(MIN_SIZE_PT, mmToPt(glyphBudget / em)) : MIN_SIZE_PT;
    }

    out.push({
      key: slot.key,
      text,
      x: slot.x,
      y: slot.y,
      sizePt,
      sizeMm: ptToMm(sizePt),
      weight: slot.weight,
      color: slot.color,
      align: slot.align,
      tracking,
    });
  }

  return out;
}

/** Hex to 0-255 triplet, for jsPDF's numeric colour setters. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = Number.parseInt(h, 16);
  return Number.isNaN(n) ? [0, 0, 0] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** True once a person has enough filled in to be worth exporting. */
export function isPersonPrintable(person: BadgePerson): boolean {
  return person.fullName.trim().length > 0;
}

/** Filename-safe slug from a name, for single-badge downloads. */
export function personSlug(person: BadgePerson): string {
  const base = person.fullName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return base || "badge";
}
