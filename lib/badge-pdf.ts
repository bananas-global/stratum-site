/* ────────────────────────────────────────────────────────────────
   badge-pdf.ts — print-ready PDF export for the ID badge generator.

   Built with jsPDF in `unit: "mm"`, so the numbers in badge-layout.ts
   go straight into the document: the page really is 210×297 mm and a
   badge really is 54×86 mm at trim. Nothing here is a screenshot —
   the artwork goes in as vector via svg2pdf, the copy as embedded
   Helvetica text (selectable, resolution-independent), and only the
   photograph is a raster, baked at BADGE.photo.export.dpi.

   Runs entirely in the browser. No upload, no server round-trip, so
   no photo or personal detail ever leaves the tab — see the privacy
   note in IdBadgeBuilder.

   jsPDF and svg2pdf are imported dynamically: together they are a
   few hundred KB, and nobody should pay for them just to open the
   page. They load on the first export.
   ──────────────────────────────────────────────────────────────── */

import {
  BADGE,
  BADGE_BACKGROUND_FALLBACK,
  artworkMarkup,
  BLEED_BOX,
  TRIM_BOX,
  type BadgePerson,
  computeSheetGeometry,
  cropMarkLines,
  hexToRgb,
  photoDrawRect,
  resolveTextSlots,
  sheetCellOrigin,
  singlePageSize,
  type Rect,
} from "./badge-layout";
import { ensureBadgeFonts, resolvePdfFont } from "./badge-fonts";

type JsPdf = import("jspdf").jsPDF;
type Svg2Pdf = typeof import("svg2pdf.js").svg2pdf;

/* ── Toolkit loading ─────────────────────────────────────────────── */

async function loadToolkit() {
  const [jspdf, svg2pdfMod] = await Promise.all([
    import("jspdf"),
    import("svg2pdf.js"),
    // Text is sized by measuring Manrope on a canvas; measuring before the
    // face is loaded would size against the fallback and shift every line.
    ensureBadgeFonts(),
  ]);
  return { JsPDF: jspdf.jsPDF, svg2pdf: svg2pdfMod.svg2pdf };
}

/* ── Background artwork ──────────────────────────────────────────
   svg2pdf wants a live SVGSVGElement, and it reads geometry off the
   node, so the node has to be laid out — a detached element or one
   inside `display:none` measures as zero. We park a host off-screen
   for the duration of the export and tear it down afterwards. */

function createSvgHost(): HTMLDivElement {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none";
  document.body.appendChild(host);
  return host;
}

/** Counter behind the per-instance id scoping (see artworkMarkup). */
let artworkSeq = 0;

/** Parse the artwork fresh for one badge; `null` if it is not usable SVG. */
function artworkElement(): SVGSVGElement | null {
  artworkSeq += 1;
  const markup = artworkMarkup(`pdf${artworkSeq}`);
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  const root = parsed.documentElement;

  if (!root || root.nodeName.toLowerCase() !== "svg" || parsed.querySelector("parsererror")) {
    console.error("[id-badge] the badge artwork is not valid SVG — using a flat fill.");
    return null;
  }
  return root as unknown as SVGSVGElement;
}

async function drawBackground(
  doc: JsPdf,
  svg2pdf: Svg2Pdf,
  host: HTMLDivElement,
  origin: { x: number; y: number },
) {
  const node = artworkElement();

  if (node) {
    host.appendChild(node);
    try {
      await svg2pdf(node, doc, {
        x: origin.x,
        y: origin.y,
        width: BLEED_BOX.w,
        height: BLEED_BOX.h,
      });
      return;
    } catch (error) {
      // A background that won't convert must not take the export down with it.
      console.error("[id-badge] background SVG failed to render into the PDF", error);
    } finally {
      node.remove();
    }
  }

  const [r, g, b] = hexToRgb(BADGE_BACKGROUND_FALLBACK);
  doc.setFillColor(r, g, b);
  doc.rect(origin.x, origin.y, BLEED_BOX.w, BLEED_BOX.h, "F");
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
  const natural = { w: person.photo.naturalWidth, h: person.photo.naturalHeight };
  const draw = photoDrawRect(natural, person.crop);

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
  svg2pdf: Svg2Pdf,
  host: HTMLDivElement,
  person: BadgePerson,
  origin: { x: number; y: number },
  fontName: string,
) {
  await drawBackground(doc, svg2pdf, host, origin);

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

  // Real, selectable text in the embedded Manrope — straight from the
  // shared layout resolution, so it lands where the preview put it.
  for (const slot of resolveTextSlots(person)) {
    const [r, g, b] = hexToRgb(slot.color);
    doc.setFont(fontName, slot.weight);
    doc.setFontSize(slot.sizePt);
    doc.setTextColor(r, g, b);
    // jsPDF folds charSpace into its alignment width exactly as SVG folds in
    // letter-spacing, so centred tracked text lands in the same place in both.
    doc.setCharSpace(slot.tracking);
    doc.text(slot.text, origin.x + slot.x, origin.y + slot.y, {
      align: slot.align,
      baseline: "alphabetic",
    });
  }
  doc.setCharSpace(0);
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

/** One badge, on a page just big enough to hold its bleed plus trim marks. */
export async function buildSingleBadgePdf(person: BadgePerson): Promise<Blob> {
  const { JsPDF, svg2pdf } = await loadToolkit();
  const page = singlePageSize();
  const doc = new JsPDF({
    unit: "mm",
    format: [page.w, page.h],
    orientation: "portrait",
    compress: true,
  });
  stampMetadata(doc);
  const fontName = await resolvePdfFont(doc);

  const host = createSvgHost();
  try {
    const origin = { x: BADGE.single.markMargin, y: BADGE.single.markMargin };
    await drawBadge(doc, svg2pdf, host, person, origin, fontName);
    drawCropMarks(doc, {
      x: origin.x + TRIM_BOX.x,
      y: origin.y + TRIM_BOX.y,
      w: TRIM_BOX.w,
      h: TRIM_BOX.h,
    });
  } finally {
    host.remove();
  }

  return doc.output("blob");
}

/** Several badges imposed on A4 portrait, paginating as needed. */
export async function buildBadgeSheetPdf(people: BadgePerson[]): Promise<Blob> {
  if (people.length === 0) throw new Error("Nothing selected to export.");

  const { JsPDF, svg2pdf } = await loadToolkit();
  const geom = computeSheetGeometry();
  const doc = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  stampMetadata(doc);
  const fontName = await resolvePdfFont(doc);

  const host = createSvgHost();
  try {
    for (let i = 0; i < people.length; i += 1) {
      const indexOnPage = i % geom.perPage;
      if (i > 0 && indexOnPage === 0) doc.addPage("a4", "portrait");

      const origin = sheetCellOrigin(geom, indexOnPage);
      await drawBadge(doc, svg2pdf, host, people[i], origin, fontName);
      drawCropMarks(doc, {
        x: origin.x + TRIM_BOX.x,
        y: origin.y + TRIM_BOX.y,
        w: TRIM_BOX.w,
        h: TRIM_BOX.h,
      });
    }
  } finally {
    host.remove();
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
