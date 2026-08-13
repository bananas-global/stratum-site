/* ────────────────────────────────────────────────────────────────
   badge-pdf.ts — print-ready PDF export for the ID badge generator.

   Built with jsPDF in `unit: "mm"`, so the numbers in badge-layout.ts
   go straight into the document: a badge really is 54×86 mm at trim, on
   a page sized to hold its bleed and its trim marks. One badge per
   page, however many are exported.

   Nothing here is a screenshot — the fixed Figma background and uploaded
   portrait are baked at print resolution, while the copy stays embedded
   Manrope text (selectable and resolution-independent).

   Runs entirely in the browser. No upload, no server round-trip, so
   no photo or personal detail ever leaves the tab — see the privacy
   note in IdBadgeBuilder.

   jsPDF is imported dynamically, so nobody pays for it just to open the
   page. It loads on the first export.
   ──────────────────────────────────────────────────────────────── */

import {
  BADGE,
  BADGE_BACKGROUND_FALLBACK,
  BLEED_BOX,
  TRIM_BOX,
  type BadgePerson,
  cropMarkLines,
  hexToRgb,
  pageOrigin,
  pageSize,
  photoDrawRect,
  resolveTextSlots,
  type Rect,
} from "./badge-layout";
import { ensureBadgeFonts, resolvePdfFont } from "./badge-fonts";
import { iconPatternSvgMarkup } from "@/components/IconPattern";

type JsPdf = import("jspdf").jsPDF;

/* ── Toolkit loading ─────────────────────────────────────────────── */

async function loadToolkit() {
  const [jspdf] = await Promise.all([
    import("jspdf"),
    // Text is sized by measuring Manrope on a canvas; measuring before the
    // face is loaded would size against the fallback and shift every line.
    ensureBadgeFonts(),
  ]);
  return { JsPDF: jspdf.jsPDF };
}

/* ── Photo ───────────────────────────────────────────────────────
   The crop is baked into a canvas the exact size of the photo frame
   at print resolution. photoDrawRect() is the same function the
   preview uses, so what the user framed on screen is what lands on
   paper. */

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the uploaded photo."));
    img.src = dataUrl;
  });
}

let fixedBackgroundPromise: Promise<string> | null = null;
let logoPromise: Promise<HTMLImageElement> | null = null;

/** Bake the canonical pattern to the exact bleed-box aspect ratio. */
function fixedBackgroundDataUrl(): Promise<string> {
  if (fixedBackgroundPromise) return fixedBackgroundPromise;

  const svg = iconPatternSvgMarkup({
    width: BADGE.background.logicalWidth,
    height: BADGE.background.logicalHeight,
    scale: BADGE.background.scale,
    color: BADGE.background.color,
    bgFrom: BADGE.background.bgFrom,
    bgTo: BADGE.background.bgTo,
  });
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );

  fixedBackgroundPromise = loadImage(svgUrl).then((img) => {
    const pxPerMm = BADGE.background.exportDpi / 25.4;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(BLEED_BOX.w * pxPerMm);
    canvas.height = Math.round(BLEED_BOX.h * pxPerMm);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare the badge background.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(svgUrl);

    return canvas.toDataURL("image/jpeg", BADGE.background.quality);
  }).catch((error) => {
    URL.revokeObjectURL(svgUrl);
    throw error;
  });

  return fixedBackgroundPromise;
}

async function drawFixedBackground(doc: JsPdf, origin: { x: number; y: number }) {
  try {
    const background = await fixedBackgroundDataUrl();
    doc.addImage(background, "JPEG", origin.x, origin.y, BLEED_BOX.w, BLEED_BOX.h);
  } catch (error) {
    console.error("[id-badge] fixed background failed to render into the PDF", error);
    const [r, g, b] = hexToRgb(BADGE_BACKGROUND_FALLBACK);
    doc.setFillColor(r, g, b);
    doc.rect(origin.x, origin.y, BLEED_BOX.w, BLEED_BOX.h, "F");
  }
}

function drawPanel(doc: JsPdf, origin: { x: number; y: number }) {
  const { panel } = BADGE;
  const [r, g, b] = hexToRgb(panel.fill);
  doc.setFillColor(r, g, b);
  doc.rect(origin.x, origin.y + panel.y, BLEED_BOX.w, BLEED_BOX.h - panel.y, "F");

  const [sr, sg, sb] = hexToRgb(panel.separator);
  doc.setDrawColor(
    Math.round(sr * panel.separatorOpacity),
    Math.round(sg * panel.separatorOpacity),
    Math.round(sb * panel.separatorOpacity),
  );
  doc.setLineWidth(panel.separatorWidth);
  doc.line(origin.x, origin.y + panel.y, origin.x + BLEED_BOX.w, origin.y + panel.y);
}

async function drawLogo(doc: JsPdf, origin: { x: number; y: number }) {
  logoPromise ??= loadImage(BADGE.logo.pdfSrc);
  const logo = await logoPromise;
  doc.addImage(
    logo,
    "PNG",
    origin.x + BADGE.logo.x,
    origin.y + BADGE.logo.y,
    BADGE.logo.w,
    BADGE.logo.h,
  );
}

type BakedPhoto = { dataUrl: string; format: "PNG" | "JPEG" };

/** Render the placed photo at print resolution. Returns null if there is none.
    The canvas is the clip region — the band bled off both sides — so anything
    the sitter's shoulders do beyond the card edge is simply cropped by the
    canvas bounds, exactly as on screen. */
async function bakePhoto(person: BadgePerson): Promise<BakedPhoto | null> {
  if (!person.photo) return null;

  const { clip, export: cfg } = BADGE.photo;
  const pxPerMm = cfg.dpi / 25.4;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(clip.w * pxPerMm);
  canvas.height = Math.round(clip.h * pxPerMm);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const isJpeg = cfg.format === "jpeg";
  if (isJpeg) {
    // JPEG has no alpha, so a cut-out portrait needs something behind it.
    const [r, g, b] = hexToRgb(BADGE_BACKGROUND_FALLBACK);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const img = await loadImage(person.photo.dataUrl);
  const draw = photoDrawRect(person.photo, person.crop);

  ctx.drawImage(
    img,
    (draw.x - clip.x) * pxPerMm,
    (draw.y - clip.y) * pxPerMm,
    draw.w * pxPerMm,
    draw.h * pxPerMm,
  );

  return isJpeg
    ? { dataUrl: canvas.toDataURL("image/jpeg", cfg.quality), format: "JPEG" }
    : { dataUrl: canvas.toDataURL("image/png"), format: "PNG" };
}

/* ── Badge composition ───────────────────────────────────────────── */

async function drawBadge(
  doc: JsPdf,
  person: BadgePerson,
  origin: { x: number; y: number },
  fontName: string,
) {
  await drawFixedBackground(doc, origin);

  const { clip } = BADGE.photo;
  const baked = await bakePhoto(person);
  if (baked) {
    doc.addImage(
      baked.dataUrl,
      baked.format,
      origin.x + clip.x,
      origin.y + clip.y,
      clip.w,
      clip.h,
    );
  }

  // Cover the lower edge of the portrait with the information panel, then
  // add the subtle separator requested in the Figma revision.
  drawPanel(doc, origin);

  // Real, selectable text in the embedded Manrope — straight from the
  // shared layout resolution, so it lands where the preview put it.
  for (const slot of resolveTextSlots(person)) {
    const [r, g, b] = hexToRgb(slot.color);
    doc.setFont(fontName, slot.weight);
    doc.setFontSize(slot.sizePt);
    // The panel is pure black, so preblending produces the same result as
    // SVG fill-opacity while keeping jsPDF's text fully selectable.
    doc.setTextColor(
      Math.round(r * slot.opacity),
      Math.round(g * slot.opacity),
      Math.round(b * slot.opacity),
    );
    // jsPDF folds charSpace into its alignment width exactly as SVG folds in
    // letter-spacing, so centred tracked text lands in the same place in both.
    doc.setCharSpace(slot.tracking);
    doc.text(slot.text, origin.x + slot.x, origin.y + slot.y, {
      align: slot.align,
      baseline: "alphabetic",
    });
  }
  doc.setCharSpace(0);
  await drawLogo(doc, origin);
}

function drawCropMarks(doc: JsPdf, trim: Rect) {
  const { width, color } = BADGE.cropMarks;
  const [r, g, b] = hexToRgb(color);
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(width);
  for (const line of cropMarkLines(trim)) {
    doc.line(line.x1, line.y1, line.x2, line.y2);
  }
}

/** Keep personal details out of the PDF metadata; the filename is enough. */
function stampMetadata(doc: JsPdf) {
  doc.setProperties({
    title: "Stratum ID badge",
    creator: "Stratum internal badge generator",
  });
}

/* ── Public API ──────────────────────────────────────────────────── */

/** One badge per page, each page the badge's real size plus room for its trim
    marks. Pass a single person for a one-page file — there is no separate
    single-badge path, because one badge is just the shortest batch. */
export async function buildBadgesPdf(people: BadgePerson[]): Promise<Blob> {
  if (people.length === 0) throw new Error("Nothing selected to export.");

  const { JsPDF } = await loadToolkit();
  const page = pageSize();
  const format: [number, number] = [page.w, page.h];
  const doc = new JsPDF({ unit: "mm", format, orientation: "portrait", compress: true });
  stampMetadata(doc);
  const fontName = await resolvePdfFont(doc);

  const origin = pageOrigin();
  for (let i = 0; i < people.length; i += 1) {
    if (i > 0) doc.addPage(format, "portrait");

    await drawBadge(doc, people[i], origin, fontName);
    drawCropMarks(doc, {
      x: origin.x + TRIM_BOX.x,
      y: origin.y + TRIM_BOX.y,
      w: TRIM_BOX.w,
      h: TRIM_BOX.h,
    });
  }

  return doc.output("blob");
}

/** Hand the blob to the browser, then release it — nothing is kept. */
export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
