import { NextResponse } from "next/server";

/**
 * Contact form handler — sends the submission as an email through Resend.
 *
 * Uses Resend's REST API directly (no SDK dependency). Setup lives in Vercel:
 * install the Resend native integration from the Vercel Marketplace (it
 * injects RESEND_API_KEY), then verify the sending domain in Resend to move
 * CONTACT_FROM_EMAIL off the onboarding address.
 *
 *   RESEND_API_KEY      — injected by the Vercel Resend integration
 *   CONTACT_TO_EMAIL    — where submissions land
 *   CONTACT_FROM_EMAIL  — must be on a Resend-verified domain in production;
 *                         the default only delivers to the Resend account owner
 */
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "bruce.santos@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Stratum Website <onboarding@resend.dev>";

const MAX_LENGTHS: Record<string, number> = {
  firstName: 100,
  lastName: 100,
  email: 200,
  phone: 50,
  company: 200,
  interest: 100,
  message: 5000,
};

type Payload = Record<string, string>;

function sanitize(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;
  const out: Payload = {};
  for (const [key, max] of Object.entries(MAX_LENGTHS)) {
    const value = (body as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string" || value.length > max) return null;
    out[key] = value.trim();
  }
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "website" field. Pretend
  // success so bots don't learn they were filtered.
  if ((body as Record<string, unknown>)?.website) {
    return NextResponse.json({ ok: true });
  }

  const data = sanitize(body);
  if (!data || !data.firstName || !data.lastName || !data.email) {
    return NextResponse.json(
      { error: "Please fill in the required fields." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — submission dropped.");
    return NextResponse.json(
      { error: "The contact form is not available right now." },
      { status: 503 },
    );
  }

  const name = `${data.firstName} ${data.lastName}`;
  const rows = [
    ["Name", name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Company", data.company || "—"],
    ["Looking for", data.interest || "—"],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;">${label}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: data.email,
      subject: `Website inquiry — ${name}${data.company ? ` (${data.company})` : ""}`,
      html: `<table style="font:14px/1.5 sans-serif;border-collapse:collapse;">${rows}</table>
<p style="font:14px/1.6 sans-serif;white-space:pre-wrap;">${escapeHtml(data.message || "(no message)")}</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[contact] Resend error ${res.status}: ${detail}`);
    return NextResponse.json(
      { error: "Something went wrong sending your message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
