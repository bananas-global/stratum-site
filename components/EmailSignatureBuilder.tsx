"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import type { SignatureCta } from "@/lib/signature-cta";

/* ────────────────────────────────────────────────────────────────
   Stratum email signature builder (hidden internal tool)
   Collaborators fill in their details, preview the signature, and
   copy a ready-to-paste rich HTML block to the clipboard.
   ──────────────────────────────────────────────────────────────── */

const LOGO_PATH = "/images/logo-email.png";
// In the browser preview a relative path loads on localhost and in production.
// The copied/exported signature needs an absolute URL so email clients can
// fetch the logo from anywhere.
const LOGO_PREVIEW = LOGO_PATH;
const LOGO_ABSOLUTE = `${SITE.url}${LOGO_PATH}`;

type Fields = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
};

const DEFAULTS: Fields = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: SITE.phoneDisplay,
  mobile: "",
  website: "stratumtech.ca",
};

/** Escape user input before it lands inside the HTML template. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeUrl(url: string) {
  const trimmed = url.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return trimmed;
}

const LOGO_WIDTH = 150; // px — keep the tagline justified to the logo width

/**
 * Letter-spacing (px) to stretch `text` across `targetWidth` at the given
 * font size, so the wordmark and the tagline below it share one right edge.
 * Uses a deterministic glyph-width estimate (no canvas) so server and client
 * render identically — measuring with canvas would cause a hydration mismatch.
 */
function spacingToWidth(text: string, fontSize: number, targetWidth: number) {
  if (!text) return 1;
  const approxGlyph = fontSize * 0.66; // ~Arial uppercase advance width
  const w = text.length * approxGlyph;
  const gaps = Math.max(text.length - 1, 1);
  return Math.max(0.5, (targetWidth - w) / gaps);
}

/** A bracketed, brand-accented call-to-action banner row, or "" if no CTA. */
function ctaBanner(cta: SignatureCta | undefined): string {
  if (!cta?.headline) return "";
  const brand = "#7d34ff";
  const ink = "#14141A";
  const headline = esc(cta.headline);
  const link =
    cta.url && cta.linkText
      ? ` <a href="${esc(cta.url)}" style="color:${brand};font-weight:bold;text-decoration:none;white-space:nowrap;">${esc(cta.linkText)} &rarr;</a>`
      : "";
  return `<div style="margin-top:14px;padding:8px 12px;background:#f4efff;border-left:3px solid ${brand};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:${ink};">${headline}${link}</div>`;
}

/** Build the table-based, inline-styled signature for email clients. */
function buildSignature(f: Fields, logoUrl: string, cta?: SignatureCta): string {
  const name = esc(f.fullName.trim()) || "Your Name";
  const title = esc(f.jobTitle.trim());
  const email = f.email.trim();
  const phone = f.phone.trim();
  const mobile = f.mobile.trim();
  const site = normalizeUrl(f.website) || "stratumtech.ca";
  const tagline = site.toUpperCase();
  const taglineSpacing = spacingToWidth(tagline, 10, LOGO_WIDTH);

  const ink = "#14141A";
  const dim = "#5C5C68";

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:1px 8px 1px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:${ink};white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:1px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${dim};vertical-align:top;">${value}</td>
    </tr>`;

  const contactRows = [
    phone &&
      row("Tel", `<a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}" style="color:${dim};text-decoration:none;">${esc(phone)}</a>`),
    mobile &&
      row("Mob", `<a href="tel:${esc(mobile.replace(/[^\d+]/g, ""))}" style="color:${dim};text-decoration:none;">${esc(mobile)}</a>`),
    email &&
      row("Email", `<a href="mailto:${esc(email)}" style="color:${dim};text-decoration:none;">${esc(email)}</a>`),
  ]
    .filter(Boolean)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#ffffff;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${ink};line-height:1.2;">${name}</div>
      ${title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${dim};padding-top:2px;">${title}</div>` : ``}
      <div style="padding-top:14px;">
        <a href="https://${esc(site)}" style="text-decoration:none;border:0;outline:none;">
          <img src="${logoUrl}" alt="Stratum" width="150" height="22" style="display:block;width:150px;height:auto;border:0;" />
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:${taglineSpacing.toFixed(2)}px;text-transform:uppercase;color:${dim};padding-top:8px;white-space:nowrap;">${esc(tagline)}</div>
        </a>
      </div>
      <div style="border-top:1px solid rgba(20,20,26,0.1);font-size:0;line-height:0;height:0;margin:14px 0;">&nbsp;</div>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows}</table>
      ${ctaBanner(cta)}
    </td>
  </tr>
</table>`;
}

const FIELD =
  "w-full rounded-sm border border-line bg-black/40 px-4 py-3 text-ink-bright placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors";
const LABEL = "flex flex-col gap-2 text-sm text-ink-dim";

/** Tab button class — `active` raises it to the brand-tinted selected state. */
const TAB = (active: boolean) =>
  `rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "bg-brand text-white"
      : "text-ink-dim hover:text-ink-bright"
  }`;

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function EmailSignatureBuilder({ ctas = [] }: { ctas?: SignatureCta[] }) {
  const [f, setF] = useState<Fields>(DEFAULTS);
  const [copied, setCopied] = useState<"" | "rich" | "source">("");
  const [tab, setTab] = useState<"preview" | "html">("preview");
  // Which active CTA to stamp in. Default to the first for stable SSR/hydration;
  // when several are active we rotate to a random one on mount, so staff copying
  // at different times naturally spread different campaigns across their mail.
  const [ctaIndex, setCtaIndex] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (ctas.length > 1) setCtaIndex(Math.floor(Math.random() * ctas.length));
  }, [ctas.length]);

  const cta = ctas[ctaIndex];

  // Preview renders with a relative logo path so it shows in-browser; the
  // copied versions embed the absolute URL for use inside email clients.
  const previewHtml = useMemo(() => buildSignature(f, LOGO_PREVIEW, cta), [f, cta]);
  const html = useMemo(() => buildSignature(f, LOGO_ABSOLUTE, cta), [f, cta]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }));

  const flash = (kind: "rich" | "source") => {
    setCopied(kind);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(""), 2500);
  };

  const copyRich = async () => {
    const ctaLine = cta?.headline
      ? `\n\n${cta.headline}${cta.url ? " " + cta.url : ""}`
      : "";
    const plain = `${f.fullName} — Stratum Technology\n${f.jobTitle}\n${f.phone}${f.mobile ? " / " + f.mobile : ""}\n${f.email}\nhttps://${normalizeUrl(f.website)}${ctaLine}`;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      flash("rich");
    } catch {
      // Fallback for browsers without ClipboardItem support.
      await navigator.clipboard.writeText(html);
      flash("source");
    }
  };

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(html);
      flash("source");
    } catch {
      // Clipboard may be unavailable (no user gesture / insecure context).
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* ── Form ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <label className={LABEL}>
          Full name
          <input
            type="text"
            className={FIELD}
            placeholder="Jane Doe"
            value={f.fullName}
            onChange={set("fullName")}
          />
        </label>
        <label className={LABEL}>
          Job title
          <input
            type="text"
            className={FIELD}
            placeholder="Systems Engineer"
            value={f.jobTitle}
            onChange={set("jobTitle")}
          />
        </label>
        <label className={LABEL}>
          Email
          <input
            type="email"
            className={FIELD}
            placeholder="jane@stratumtech.ca"
            value={f.email}
            onChange={set("email")}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={LABEL}>
            Phone
            <input
              type="tel"
              className={FIELD}
              placeholder="1 (855) 200-0076"
              value={f.phone}
              onChange={set("phone")}
            />
          </label>
          <label className={LABEL}>
            Mobile
            <input
              type="tel"
              className={FIELD}
              placeholder="604 000 0000"
              value={f.mobile}
              onChange={set("mobile")}
            />
          </label>
        </div>
      </div>

      {/* ── Preview + actions ──────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div role="tablist" className="flex w-fit gap-1 rounded-md border border-line p-1">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={TAB(tab === "preview")}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "html"}
            onClick={() => setTab("html")}
            className={TAB(tab === "html")}
          >
            Show HTML
          </button>
        </div>

        {tab === "preview" ? (
          <div className="overflow-x-auto rounded-md border border-line bg-white p-6 sm:p-8">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={copySource}
              aria-label="Copy HTML"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line-strong bg-surface text-ink-dim transition-colors hover:border-brand hover:text-ink-bright"
            >
              {copied === "source" ? <CheckIcon /> : <CopyIcon />}
            </button>
            <pre className="max-h-80 overflow-auto rounded-md border border-line bg-black/40 p-4 pr-14 text-xs leading-relaxed text-ink-dim">
              <code>{html}</code>
            </pre>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={copyRich}>
            {copied === "rich" ? "Copied ✓" : "Copy signature"}
          </button>
        </div>

        <p className="text-sm text-ink-dim">
          Use <strong className="text-ink">Copy signature</strong> then paste directly into
          Gmail&nbsp;→&nbsp;Settings&nbsp;→&nbsp;Signature, Outlook, or Apple Mail. The
          formatting comes with it.
        </p>
      </div>
    </div>
  );
}
