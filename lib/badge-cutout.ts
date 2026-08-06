/* ────────────────────────────────────────────────────────────────
   badge-cutout.ts — background removal for badge photos.

   Front end for lib/badge-cutout.worker.ts, which runs MODNet in the
   browser. Nothing here uploads anything: the photograph is read into
   a canvas, matted locally and turned back into a data URL. The only
   network request the feature makes is the one-time model download,
   and that carries no user data.

   Why the model comes from the Hugging Face CDN rather than /public,
   unlike the Manrope files: the fp16 weights are ~12 MB, and putting
   that in git costs every clone forever, for a tool a handful of
   staff open occasionally. If the external dependency ever becomes a
   problem — an air-gapped network, HF unreachable — self-hosting is
   two lines: drop the ONNX files under public/models/modnet/ and set
   `env.allowLocalModels = true` plus `env.localModelPath` in the
   worker. Nothing else changes.

   Two jobs beyond the matting itself:

   • applyMatte() turns the matte into the photo's alpha channel, with
     the edge treatment that stops a pale fringe surviving onto the
     badge's near-black artwork.
   • measureSubject() reads the matte to find where the sitter's head
     actually is. That is what lets placement stop guessing — see the
     subject-driven branch of autoFitRect in badge-layout.ts.
   ──────────────────────────────────────────────────────────────── */

import type { SubjectMetrics } from "./badge-layout";

export type CutoutStatus =
  | { type: "downloading"; progress?: number }
  | { type: "matting"; device?: string };

type Matte = { data: Uint8ClampedArray; width: number; height: number };

let worker: Worker | null = null;
let nextRequestId = 0;

function getWorker(): Worker {
  // Bundlers recognise this exact shape and emit the worker as its own chunk,
  // so Transformers.js never lands in the page bundle.
  worker ??= new Worker(new URL("./badge-cutout.worker.ts", import.meta.url), {
    type: "module",
  });
  return worker;
}

/** Run the matting model over an image blob. Reports progress while the model
    downloads. Takes a Blob rather than a File so a photo already sitting in
    memory as a data URL can be re-matted without keeping the original File. */
export function matteFromBlob(
  blob: Blob,
  onStatus: (status: CutoutStatus) => void,
): Promise<Matte> {
  const active = getWorker();
  const id = ++nextRequestId;

  return new Promise((resolve, reject) => {
    const done = () => {
      active.removeEventListener("message", onMessage);
      active.removeEventListener("error", onError);
    };

    const onMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.id !== id) return;

      switch (message.type) {
        case "progress":
          onStatus({ type: "downloading", progress: message.progress });
          break;
        case "ready":
          onStatus({ type: "matting", device: message.device });
          break;
        case "matting":
          onStatus({ type: "matting" });
          break;
        case "result":
          done();
          resolve({
            data: new Uint8ClampedArray(message.data),
            width: message.width,
            height: message.height,
          });
          break;
        case "error":
          done();
          reject(new Error(message.message));
          break;
      }
    };

    const onError = () => {
      done();
      reject(new Error("The background remover could not start in this browser."));
    };

    active.addEventListener("message", onMessage);
    active.addEventListener("error", onError);
    blob
      .arrayBuffer()
      .then((buffer) => active.postMessage({ id, buffer, mimeType: blob.type }, [buffer]))
      .catch(() => {
        done();
        reject(new Error("That image could not be read."));
      });
  });
}

/** Free the worker and the loaded model. */
export function disposeCutoutWorker() {
  worker?.terminate();
  worker = null;
}

/* ── Matte → alpha ───────────────────────────────────────────────── */

/** Coverage for one pixel of the matte, whatever shape it came back in:
    RGBA (alpha channel), RGB (luminance) or a single grey channel. */
function coverageAt(data: Uint8ClampedArray, channels: number, pixel: number): number {
  const at = pixel * channels;
  if (channels >= 4) return data[at + 3];
  if (channels >= 3) {
    return Math.round(data[at] * 0.2126 + data[at + 1] * 0.7152 + data[at + 2] * 0.0722);
  }
  return data[at];
}

/** Below this the pixel is background outright — the step that keeps a pale
    halo from surviving onto near-black artwork, where it would be obvious. */
const FLOOR = 0.02;
/** Above this the pixel is fully the sitter. */
const CEILING = 0.98;

/** Paint the matte's coverage into a greyscale canvas at its own resolution. */
function matteToCanvas(matte: Matte): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = matte.width;
  canvas.height = matte.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the cut-out.");

  const pixels = matte.width * matte.height;
  const channels = Math.max(1, Math.round(matte.data.length / pixels));
  const rgba = new Uint8ClampedArray(pixels * 4);

  for (let i = 0; i < pixels; i += 1) {
    const coverage = coverageAt(matte.data, channels, i);
    rgba[i * 4] = coverage;
    rgba[i * 4 + 1] = coverage;
    rgba[i * 4 + 2] = coverage;
    rgba[i * 4 + 3] = 255;
  }

  ctx.putImageData(new ImageData(rgba, matte.width, matte.height), 0, 0);
  return canvas;
}

export type Cutout = { dataUrl: string; subject: SubjectMetrics | null };

/** Composite the matte onto the photo as its alpha channel. Returns a PNG data
    URL — PNG because the whole point is the transparency, which JPEG has none
    of — plus where the sitter turned out to be. */
export function applyMatte(image: HTMLImageElement, matte: Matte): Cutout {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not prepare the cut-out.");

  ctx.drawImage(image, 0, 0);
  const photo = ctx.getImageData(0, 0, width, height);

  // The matte may come back at the model's resolution, so scale it to the
  // photo before using it as alpha.
  const matteCanvas = matteToCanvas(matte);
  const scaled = document.createElement("canvas");
  scaled.width = width;
  scaled.height = height;
  const scaledCtx = scaled.getContext("2d");
  if (!scaledCtx) throw new Error("Could not resize the cut-out.");
  scaledCtx.imageSmoothingEnabled = true;
  scaledCtx.imageSmoothingQuality = "high";
  scaledCtx.drawImage(matteCanvas, 0, 0, width, height);
  const coverage = scaledCtx.getImageData(0, 0, width, height).data;

  for (let i = 0; i < photo.data.length; i += 4) {
    const value = coverage[i] / 255;
    // Hard at both ends, smoothstep between: keeps hair soft without letting a
    // faint wash of the old background through.
    const alpha =
      value <= FLOOR ? 0 : value >= CEILING ? 1 : value * value * (3 - 2 * value);
    photo.data[i + 3] = Math.round(alpha * 255);
  }
  ctx.putImageData(photo, 0, 0);

  return { dataUrl: out.toDataURL("image/png"), subject: measureSubject(matteCanvas) };
}

/* ── Finding the sitter ──────────────────────────────────────────
   All of this is expressed as fractions of the image, so it survives
   any later resize and can be reasoned about in millimetres by
   badge-layout without knowing the photo's pixel size. */

/** Coverage (0-255) above which a pixel counts as the sitter. */
const SOLID = 24;
/** A row narrower than this share of the widest row so far means we have
    passed the head and reached the neck. */
const NECK_RATIO = 0.82;
/** Scan no further down than this share of the sitter's height. */
const HEAD_SEARCH_DEPTH = 0.6;
/** Matte is downscaled to this before scanning — fractions barely move and a
    full-resolution row scan on a phone photo would be millions of iterations. */
const SCAN_MAX = 384;

/** Read the head's position out of the matte, so placement need not guess.
    Returns null when the matte is empty, or when the head could not be
    isolated confidently — the caller then falls back to the blind heuristic. */
export function measureSubject(matteCanvas: HTMLCanvasElement): SubjectMetrics | null {
  const scale = Math.min(1, SCAN_MAX / Math.max(matteCanvas.width, matteCanvas.height));
  const w = Math.max(1, Math.round(matteCanvas.width * scale));
  const h = Math.max(1, Math.round(matteCanvas.height * scale));

  const small = document.createElement("canvas");
  small.width = w;
  small.height = h;
  const ctx = small.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(matteCanvas, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  // Per-row extent of the sitter, plus the overall bounding box.
  const rowLeft = new Int32Array(h).fill(-1);
  const rowRight = new Int32Array(h).fill(-1);
  let top = -1;
  let bottom = -1;
  let left = w;
  let right = -1;

  for (let y = 0; y < h; y += 1) {
    let first = -1;
    let last = -1;
    for (let x = 0; x < w; x += 1) {
      if (data[(y * w + x) * 4] > SOLID) {
        if (first < 0) first = x;
        last = x;
      }
    }
    rowLeft[y] = first;
    rowRight[y] = last;
    if (first < 0) continue;
    if (top < 0) top = y;
    bottom = y;
    if (first < left) left = first;
    if (last > right) right = last;
  }

  if (top < 0 || right < 0) return null;

  // Walk down from the crown. The head widens to the hair/temples and then
  // narrows at the neck; the widest row before that narrowing is the head.
  const limit = Math.min(h - 1, top + Math.round((bottom - top) * HEAD_SEARCH_DEPTH));
  let widest = 0;
  let widestRow = top;
  let foundNeck = false;

  for (let y = top; y <= limit; y += 1) {
    if (rowLeft[y] < 0) continue;
    const width = rowRight[y] - rowLeft[y] + 1;
    if (width > widest) {
      widest = width;
      widestRow = y;
    } else if (widest > 0 && width < widest * NECK_RATIO && y > top + 2) {
      foundNeck = true;
      break;
    }
  }

  // No narrowing means we never left the head — a tight face crop, or a photo
  // that widens straight into the shoulders. Either way the width we measured
  // is not the head, so don't pretend it is.
  if (!foundNeck || widest <= 0) return null;

  return {
    bounds: {
      x: left / w,
      y: top / h,
      w: (right - left + 1) / w,
      h: (bottom - top + 1) / h,
    },
    headTop: top / h,
    headCentreX: (rowLeft[widestRow] + rowRight[widestRow] + 1) / 2 / w,
    headWidth: widest / w,
  };
}
