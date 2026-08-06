/* ────────────────────────────────────────────────────────────────
   badge-fonts.ts — Manrope for the ID badge, in both renderers.

   The badge is set in Manrope, Stratum's body face. The important
   property here is that the preview and the PDF use *the same two
   font files* — public/fonts/Manrope-{Regular,Bold}.ttf. The preview
   gets them through an @font-face in globals.css; the PDF gets them
   embedded into the document by jsPDF. So the export cannot silently
   substitute a different face, and text measured on screen measures
   the same on paper.

   Deliberately NOT next/font: that pipeline resolves at build time
   into a hashed family name and ships woff2, which jsPDF cannot
   embed. Self-hosting one TTF pair is what lets a single file serve
   both paths. (The rest of the site still uses next/font — this only
   covers the badge.)

   Text stays real, selectable text in the PDF. Outlining the glyphs
   would also guarantee fidelity, but embedding does that already
   while keeping the copy searchable and re-usable, so there is no
   reason to throw the text away. The vectorised fallback would only
   be needed if jsPDF could not embed the face — and it can, which
   the export verifies (see resolvePdfFont).

   Both files are the latin + latin-ext subset: 368 code points,
   which covers Western plus Central/Eastern European names. A
   character outside that range has no glyph — see the note in
   README-ish comments on BADGE_FONT.coverage below.
   ──────────────────────────────────────────────────────────────── */

type JsPdf = import("jspdf").jsPDF;

export const BADGE_FONT = {
  /** Family declared by the @font-face pair in app/globals.css.
      Deliberately not plain "Manrope" so it can never be confused
      with, or merged into, the next/font faces used site-wide. */
  cssFamily: "Manrope Badge",
  /** Name the face is registered under inside the PDF. */
  pdfName: "Manrope",
  /** Used if embedding ever fails, so an export still comes out. */
  fallbackPdfName: "helvetica",
  faces: [
    {
      style: "normal" as const,
      weight: 400,
      url: "/fonts/Manrope-Regular.ttf",
      vfsName: "Manrope-Regular.ttf",
    },
    {
      style: "bold" as const,
      weight: 700,
      url: "/fonts/Manrope-Bold.ttf",
      vfsName: "Manrope-Bold.ttf",
    },
  ],
};

/* ── Browser side ────────────────────────────────────────────────
   Canvas text measurement only sees a web font once it is actually
   loaded — before that it silently measures the fallback, which
   would make the shrink-to-fit maths wrong. Everything that measures
   waits on this first. */

let loading: Promise<void> | null = null;

/** Load both weights into the document. Idempotent, shared by all callers. */
export function ensureBadgeFonts(): Promise<void> {
  if (loading) return loading;
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();

  loading = Promise.all(
    BADGE_FONT.faces.map((face) =>
      document.fonts.load(`${face.weight} 100px "${BADGE_FONT.cssFamily}"`),
    ),
  )
    .then(() => undefined)
    // A failed load is not fatal: the preview falls back to a system sans and
    // the PDF still embeds from the fetched file.
    .catch(() => undefined);

  return loading;
}

/** Whether the document already has both weights ready to measure. */
export function badgeFontsReady(): boolean {
  if (typeof document === "undefined" || !document.fonts) return false;
  return BADGE_FONT.faces.every((face) =>
    document.fonts.check(`${face.weight} 100px "${BADGE_FONT.cssFamily}"`),
  );
}

/* ── PDF side ────────────────────────────────────────────────────── */

/** base64 of each .ttf, cached so a multi-page export fetches once. */
const encoded = new Map<string, string>();

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // Chunked: spreading a 56 KB array into fromCharCode at once blows the stack.
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

async function fontBase64(url: string): Promise<string> {
  const hit = encoded.get(url);
  if (hit) return hit;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  const b64 = toBase64(await response.arrayBuffer());
  encoded.set(url, b64);
  return b64;
}

/** Embed Manrope into `doc` and return the font name to draw with.
    Falls back to Helvetica — and says so — rather than failing the export. */
export async function resolvePdfFont(doc: JsPdf): Promise<string> {
  try {
    for (const face of BADGE_FONT.faces) {
      doc.addFileToVFS(face.vfsName, await fontBase64(face.url));
      doc.addFont(face.vfsName, BADGE_FONT.pdfName, face.style);
    }

    // Confirm jsPDF really took the face, instead of trusting addFont.
    doc.setFont(BADGE_FONT.pdfName, "bold");
    const active = doc.getFont();
    if (active.fontName?.toLowerCase() !== BADGE_FONT.pdfName.toLowerCase()) {
      throw new Error(`jsPDF resolved "${active.fontName}" instead of Manrope`);
    }

    return BADGE_FONT.pdfName;
  } catch (error) {
    console.error("[id-badge] could not embed Manrope; falling back to Helvetica", error);
    return BADGE_FONT.fallbackPdfName;
  }
}
