/// <reference lib="webworker" />

/* ────────────────────────────────────────────────────────────────
   badge-cutout.worker.ts — portrait matting for the ID badge.

   Runs MODNet (Apache-2.0, portrait-matting) through Transformers.js,
   off the main thread so the live badge preview stays responsive
   while a photo is being cut out. Inference happens entirely in the
   browser: the photograph never leaves the tab, which is what keeps
   the tool's privacy promise intact (see IdBadgeBuilder).

   WebGPU first, WebAssembly as the fallback. The model is ~12 MB in
   fp16 and is fetched once, then served from the browser's cache.
   That fetch is the one external request this tool makes, and it
   carries no user data — only the model weights come back.

   The revision is pinned so the weights cannot change underneath a
   working cut-out. Bump it deliberately, never implicitly.
   ──────────────────────────────────────────────────────────────── */

import { RawImage, env, pipeline } from "@huggingface/transformers";

type CutoutRequest = { id: number; buffer: ArrayBuffer; mimeType: string };
type ProgressInfo = { status?: string; progress?: number };

// Weights come from the Hugging Face CDN, not from /public — see the note in
// lib/badge-cutout.ts on that trade-off.
env.allowLocalModels = false;

const MODEL_ID = "Xenova/modnet";
const MODEL_REVISION = "fa2fa546052fba4c08921230a26cc69a333fca12";

type Matter = Awaited<ReturnType<typeof pipeline<"background-removal">>>;

let matter: Matter | null = null;

async function loadMatter(id: number): Promise<Matter> {
  if (matter) return matter;

  const progress_callback = (info: ProgressInfo) => {
    self.postMessage({
      type: "progress",
      id,
      progress: typeof info.progress === "number" ? Math.round(info.progress) : undefined,
    });
  };

  const options = {
    dtype: "fp16" as const,
    revision: MODEL_REVISION,
    progress_callback,
  };

  // WebGPU turns a couple of seconds into a couple of hundred milliseconds,
  // but it is absent on older Safari and can fail at init even when the API
  // is present — so treat it as an optimisation, never a requirement.
  if ("gpu" in navigator) {
    try {
      matter = await pipeline("background-removal", MODEL_ID, {
        ...options,
        device: "webgpu",
      });
      self.postMessage({ type: "ready", id, device: "WebGPU" });
      return matter;
    } catch {
      matter = null;
    }
  }

  matter = await pipeline("background-removal", MODEL_ID, { ...options, device: "wasm" });
  self.postMessage({ type: "ready", id, device: "WebAssembly" });
  return matter;
}

self.onmessage = async (event: MessageEvent<CutoutRequest>) => {
  const { id, buffer, mimeType } = event.data;

  try {
    const model = await loadMatter(id);
    self.postMessage({ type: "matting", id });

    const image = await RawImage.fromBlob(new Blob([buffer], { type: mimeType }));
    const output = await model(image);
    const matte = Array.isArray(output) ? output[0] : output;
    const data = new Uint8ClampedArray(matte.data);

    // Transfer rather than copy: a full-resolution matte is megabytes.
    self.postMessage(
      { type: "result", id, data: data.buffer, width: matte.width, height: matte.height },
      [data.buffer],
    );
  } catch (error) {
    self.postMessage({
      type: "error",
      id,
      message: error instanceof Error ? error.message : "Unknown matting failure",
    });
  }
};

export {};
