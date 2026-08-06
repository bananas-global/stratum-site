"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BadgePreview from "@/components/badge/BadgePreview";
import {
  BADGE,
  DEFAULT_CROP,
  MAX_ZOOM,
  MIN_ZOOM,
  clampCrop,
  isPersonPrintable,
  personSlug,
  photoFitWarnings,
  type BadgePerson,
  type PhotoCrop,
} from "@/lib/badge-layout";
import { buildBadgesPdf, downloadPdf } from "@/lib/badge-pdf";
import {
  applyMatte,
  disposeCutoutWorker,
  matteFromBlob,
  type CutoutStatus,
} from "@/lib/badge-cutout";

/* ────────────────────────────────────────────────────────────────
   IdBadgeBuilder — internal ID badge generator.

   Everything the tool knows lives in this component's state: the
   roster, the uploaded photos (as in-memory data URLs), the crops
   and the export selection. There is no persistence layer of any
   kind — no fetch, no localStorage/sessionStorage, no IndexedDB, no
   cookie — so a reload starts from a clean slate. PDFs are built in
   the browser (see lib/badge-pdf), which is also why no photo ever
   reaches a server to be logged.
   ──────────────────────────────────────────────────────────────── */

const FIELD =
  "w-full rounded-sm border border-line bg-black/40 px-4 py-3 text-ink-bright placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors";
const LABEL = "flex flex-col gap-2 text-sm text-ink-dim";
const GHOST_BTN =
  "rounded-sm border border-line px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-brand hover:text-ink-bright disabled:cursor-not-allowed disabled:opacity-40";

/** Refuse anything big enough to make canvas work sluggish. */
const MAX_PHOTO_BYTES = 12 * 1024 * 1024;

/** Sample record so the tool is immediately legible on first load. */
function seedPerson(): BadgePerson {
  return {
    // A fixed id keeps the server and client markup identical on first paint.
    id: "seed-1",
    fullName: "Floyd Miles",
    jobTitle: "CEO",
    email: "floyd.miles@stratumtech.ca",
    phone: "(219) 555-0114",
    photo: null,
    crop: DEFAULT_CROP,
  };
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyPerson(): BadgePerson {
  return {
    id: newId(),
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    photo: null,
    crop: DEFAULT_CROP,
  };
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function IdBadgeBuilder() {
  const [people, setPeople] = useState<BadgePerson[]>(() => [seedPerson()]);
  const [activeId, setActiveId] = useState("seed-1");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["seed-1"]));
  const [showGuides, setShowGuides] = useState(true);
  const [busy, setBusy] = useState<"" | "single" | "batch">("");
  const [cutout, setCutout] = useState<CutoutStatus | null>(null);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement | null>(null);

  const active = people.find((p) => p.id === activeId) ?? people[0];

  const printable = useMemo(
    () => people.filter((p) => selected.has(p.id) && isPersonPrintable(p)),
    [people, selected],
  );

  /* ── Roster editing ───────────────────────────────────────────── */

  const patch = useCallback((id: string, changes: Partial<BadgePerson>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }, []);

  const setField = (key: "fullName" | "jobTitle" | "email" | "phone") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (active) patch(active.id, { [key]: event.target.value });
    };

  const addPerson = () => {
    const person = emptyPerson();
    setPeople((prev) => [...prev, person]);
    setSelected((prev) => new Set(prev).add(person.id));
    setActiveId(person.id);
    setError("");
  };

  const duplicatePerson = (id: string) => {
    setPeople((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      // The photo is shared by value (a data URL string), so the copy keeps the
      // same picture and crop without re-reading the file.
      const copy: BadgePerson = { ...source, id: newId() };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      setSelected((sel) => new Set(sel).add(copy.id));
      setActiveId(copy.id);
      return next;
    });
  };

  const removePerson = (id: string) => {
    setPeople((prev) => {
      const next = prev.filter((p) => p.id !== id);
      const list = next.length > 0 ? next : [emptyPerson()];
      if (id === activeId) setActiveId(list[0].id);
      return list;
    });
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = people.length > 0 && people.every((p) => selected.has(p.id));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(people.map((p) => p.id)));

  /* ── Photo handling ───────────────────────────────────────────── */

  const onPhotoPicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear the input so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file || !active) return;

    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Use a JPEG, PNG or WebP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("That photo is over 12 MB. Please use a smaller file.");
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      const size = await naturalSize(dataUrl);
      patch(active.id, {
        photo: { dataUrl, naturalWidth: size.w, naturalHeight: size.h },
        crop: DEFAULT_CROP,
      });
      setError("");
    } catch {
      setError("That image couldn't be read. Try exporting it again or use another file.");
    }
  };

  const setCrop = (crop: PhotoCrop) => {
    if (active) patch(active.id, { crop });
  };

  const setZoom = (zoom: number) => {
    if (!active?.photo) return;
    setCrop(clampCrop(active.photo, { ...active.crop, zoom }));
  };

  /* ── Background removal ───────────────────────────────────────
     Matting runs in a worker (see lib/badge-cutout). Resetting the crop
     afterwards is the point of the whole exercise: with the background gone
     the head's position is measured rather than guessed, so the automatic
     placement drops it straight onto the guide. */

  const removePhotoBackground = async () => {
    const photo = active?.photo;
    if (!photo || !active) return;

    setCutout({ type: "downloading" });
    setError("");
    try {
      // Re-derive the bytes from the data URL we already hold, so there is no
      // need to keep the original File around just for this.
      const blob = await fetch(photo.dataUrl).then((r) => r.blob());
      const matte = await matteFromBlob(blob, setCutout);
      const image = await loadImage(photo.dataUrl);
      const { dataUrl, subject } = applyMatte(image, matte);

      patch(active.id, {
        photo: {
          ...photo,
          dataUrl,
          originalDataUrl: photo.originalDataUrl ?? photo.dataUrl,
          subject: subject ?? undefined,
        },
        crop: DEFAULT_CROP,
      });
      if (!subject) {
        setError(
          "Background removed, but the head couldn't be located automatically — line it up with the green guide.",
        );
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `Background removal failed: ${cause.message}`
          : "Background removal failed.",
      );
    } finally {
      setCutout(null);
    }
  };

  const restoreOriginal = () => {
    const photo = active?.photo;
    if (!photo?.originalDataUrl || !active) return;
    patch(active.id, {
      photo: {
        dataUrl: photo.originalDataUrl,
        naturalWidth: photo.naturalWidth,
        naturalHeight: photo.naturalHeight,
      },
      crop: DEFAULT_CROP,
    });
    setError("");
  };

  // The loaded model holds tens of megabytes; let it go with the page.
  useEffect(() => disposeCutoutWorker, []);

  const cutoutLabel =
    cutout?.type === "downloading"
      ? `Loading remover${typeof cutout.progress === "number" ? ` ${cutout.progress}%` : "…"}`
      : cutout?.type === "matting"
        ? "Removing background…"
        : null;

  /* Framing hints for the active badge. Advisory only — the sitter is allowed
     to run off the card, so nothing here blocks an export. */
  const fitWarnings = active?.photo ? photoFitWarnings(active.photo, active.crop) : [];

  /* ── Export ───────────────────────────────────────────────────── */

  const exportSingle = async (person: BadgePerson) => {
    if (!isPersonPrintable(person)) {
      setError("Add a name before exporting this badge.");
      return;
    }
    setBusy("single");
    setError("");
    try {
      const blob = await buildBadgesPdf([person]);
      downloadPdf(blob, `stratum-badge-${personSlug(person)}.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The PDF couldn't be generated.");
    } finally {
      setBusy("");
    }
  };

  const exportSheet = async () => {
    if (printable.length === 0) {
      setError("Select at least one badge that has a name on it.");
      return;
    }
    setBusy("batch");
    setError("");
    try {
      const blob = await buildBadgesPdf(printable);
      downloadPdf(blob, "stratum-badges.pdf");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The PDF couldn't be generated.");
    } finally {
      setBusy("");
    }
  };

  /* Nothing is saved anywhere, so a stray reload really does lose the
     roster — worth one confirm dialog once there is work to lose. */
  const hasWork = people.some((p) => p.photo || p.jobTitle || p.email || p.phone) || people.length > 1;
  useEffect(() => {
    if (!hasWork) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasWork]);

  if (!active) return null;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Privacy note ─────────────────────────────────────────── */}
      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
        <LockIcon />
        <span>
          Nothing here is saved. Names, photos and crops stay in this browser tab only, are
          never uploaded, and are gone the moment you reload or close the page. PDFs and
          background removal both run locally on your machine — the only thing fetched from
          the internet is the remover itself, the first time you use it.
        </span>
      </p>

      {/* ── Editor + live preview ────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div className="flex flex-col gap-5">
          <label className={LABEL}>
            Full name
            <input
              type="text"
              className={FIELD}
              placeholder="Floyd Miles"
              value={active.fullName}
              onChange={setField("fullName")}
            />
          </label>
          <label className={LABEL}>
            Job title
            <input
              type="text"
              className={FIELD}
              placeholder="CEO"
              value={active.jobTitle}
              onChange={setField("jobTitle")}
            />
          </label>
          <label className={LABEL}>
            Email
            <input
              type="email"
              className={FIELD}
              placeholder="floyd.miles@stratumtech.ca"
              value={active.email}
              onChange={setField("email")}
            />
          </label>
          <label className={LABEL}>
            Phone
            <input
              type="tel"
              className={FIELD}
              placeholder="(219) 555-0114"
              value={active.phone}
              onChange={setField("phone")}
            />
          </label>

          {/* Photo */}
          <div className="flex flex-col gap-3 rounded-sm border border-line bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-ink-dim">Photo</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={GHOST_BTN}
                  onClick={() => fileInput.current?.click()}
                >
                  {active.photo ? "Replace" : "Upload"}
                </button>
                <button
                  type="button"
                  className={GHOST_BTN}
                  disabled={!active.photo}
                  onClick={() => patch(active.id, { photo: null, crop: DEFAULT_CROP })}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Background removal. Only offered once there is a photo, and
                swapped for an undo once a cut-out exists. */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={GHOST_BTN}
                disabled={!active.photo || cutout !== null}
                onClick={removePhotoBackground}
              >
                {cutoutLabel ?? (active.photo?.subject ? "Redo cut-out" : "Remove background")}
              </button>
              {active.photo?.originalDataUrl && (
                <button
                  type="button"
                  className={GHOST_BTN}
                  disabled={cutout !== null}
                  onClick={restoreOriginal}
                >
                  Undo
                </button>
              )}
              {active.photo?.originalDataUrl && !cutout && (
                <span className="text-xs text-ink-faint">
                  {active.photo.subject
                    ? "Background removed, head placed automatically."
                    : "Background removed."}
                </span>
              )}
            </div>
            {cutout?.type === "downloading" && (
              <p className="text-xs text-ink-faint">
                First use downloads the remover (~12 MB). It&rsquo;s cached afterwards.
              </p>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoPicked}
            />
            <label className="flex items-center gap-3 text-xs text-ink-faint">
              Size
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={active.crop.zoom}
                disabled={!active.photo}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-1 flex-1 accent-brand disabled:opacity-40"
              />
              <span className="w-10 text-right tabular-nums">
                {active.crop.zoom.toFixed(2)}×
              </span>
            </label>
            <div className="flex items-center justify-between gap-3 text-xs text-ink-faint">
              <span>
                {active.photo
                  ? "Drag the photo to line the head up with the green guide. Scaling keeps the head centred; the shoulders are meant to run past it."
                  : "Upload a portrait — ideally a background-removed PNG — then line the head up with the green guide."}
              </span>
              <button
                type="button"
                className={GHOST_BTN}
                disabled={!active.photo}
                onClick={() => setCrop(DEFAULT_CROP)}
              >
                Reset
              </button>
            </div>
            {fitWarnings.length > 0 && (
              <p className="text-xs text-brand-light">
                Check the framing: {fitWarnings.join("; ")}.
              </p>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-line bg-black/40 p-4">
            <BadgePreview person={active} showGuides={showGuides} onCropChange={setCrop} />
          </div>
          <label className="flex items-center gap-2 text-xs text-ink-faint">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(e) => setShowGuides(e.target.checked)}
              className="accent-brand"
            />
            Show trim and safe-area guides
          </label>
          <p className="text-xs text-ink-faint">
            {BADGE.trim.w} × {BADGE.trim.h} mm at trim, {BADGE.bleed} mm bleed. Guides are
            preview-only — they are never printed.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy !== ""}
            onClick={() => exportSingle(active)}
          >
            {busy === "single" ? "Generating…" : "Export this badge (PDF)"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-brand-light">
          {error}
        </p>
      )}

      {/* ── Roster ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 border-t border-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-ink-bright">Collaborators</h3>
            <p className="text-xs text-ink-faint">
              {people.length} on the roster · {printable.length} selected · one badge per
              page at {BADGE.trim.w}×{BADGE.trim.h} mm
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={GHOST_BTN} onClick={toggleAll}>
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <button type="button" className={GHOST_BTN} onClick={addPerson}>
              + Add collaborator
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy !== "" || printable.length === 0}
              onClick={exportSheet}
            >
              {busy === "batch" ? "Generating…" : `Export selected (${printable.length})`}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {people.map((person) => {
            const isActive = person.id === activeId;
            return (
              <div
                key={person.id}
                className={`flex flex-col gap-3 rounded-sm border bg-black/40 p-4 transition-colors ${
                  isActive ? "border-brand" : "border-line hover:border-line-strong"
                }`}
              >
                <label className="flex items-center gap-2 text-xs text-ink-dim">
                  <input
                    type="checkbox"
                    checked={selected.has(person.id)}
                    onChange={() => toggleSelected(person.id)}
                    className="accent-brand"
                  />
                  Include in export
                </label>

                <button
                  type="button"
                  onClick={() => setActiveId(person.id)}
                  // Capped so a roster row stays scannable however many
                  // columns the grid collapses to.
                  className="mx-auto w-full max-w-[10rem] cursor-pointer"
                  aria-label={`Edit ${person.fullName.trim() || "unnamed collaborator"}`}
                >
                  <BadgePreview person={person} />
                </button>

                <div className="flex flex-col gap-0.5">
                  <span className="truncate text-sm text-ink-bright">
                    {person.fullName.trim() || "Unnamed"}
                  </span>
                  <span className="truncate text-xs text-ink-faint">
                    {person.jobTitle.trim() || "No job title"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={GHOST_BTN}
                    onClick={() => setActiveId(person.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={GHOST_BTN}
                    onClick={() => duplicatePerson(person.id)}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className={GHOST_BTN}
                    onClick={() => removePerson(person.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── File helpers ────────────────────────────────────────────────
   FileReader keeps the bytes in the page; nothing is sent anywhere. */

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = dataUrl;
  });
}

function naturalSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("decode failed"));
    img.src = dataUrl;
  });
}
