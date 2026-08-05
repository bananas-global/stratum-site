"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createLinkToken,
  getAllowlist,
  isAllowedEmail,
  isInternalAuthConfigured,
  resolveEmail,
  safeRedirect,
} from "@/lib/internal-auth";
import { SITE } from "@/lib/site";

export type SignInState = { sent?: boolean; error?: string; devLink?: string };

const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Stratum Website <onboarding@resend.dev>";

/**
 * Origin for the emailed link, taken from the request so preview deployments
 * and local dev mail themselves rather than production.
 */
async function getOrigin() {
  const h = await headers();
  const host = h.get("host");
  if (!host) return SITE.url;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// Per-address throttle, matching the approach in the contact route: in-memory,
// so it resets on cold start and is per-instance. Enough to stop someone
// hammering a colleague's inbox; for hard guarantees add a Vercel WAF rule.
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) return true;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 1000) {
    for (const k of hits.keys()) {
      if (hits.size <= 500) break;
      hits.delete(k);
    }
  }
  return false;
}

export async function requestLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  if (!isInternalAuthConfigured()) {
    return { error: "Sign-in isn't configured for this environment yet." };
  }

  // Honeypot: a hidden field real people never fill. Claim success so bots
  // learn nothing from being filtered — but say so in the server log, or a
  // password manager autofilling it looks identical to "email never arrived".
  if (formData.get("website")) {
    console.warn("[internal-auth] honeypot tripped — no link sent.");
    return { sent: true };
  }

  // Server Actions already reject cross-origin POSTs by comparing Origin and
  // Host, so there is no same-origin check to add here by hand.

  const email = resolveEmail(String(formData.get("email") ?? ""));
  const next = safeRedirect(String(formData.get("next") ?? ""));

  // A malformed entry is a format problem — safe to report, and the user needs
  // to know. Everything past this point returns the same "check your inbox"
  // response whether or not the address is allowed, the rate limit tripped, or
  // the send failed, so this page never confirms who is on the allowlist.
  if (!email) {
    return { error: "Enter the part before the @ — letters, numbers, dots." };
  }
  // Silent to the visitor, explicit in the log — otherwise every rejection is
  // indistinguishable from a mail delivery problem when something goes wrong.
  if (!isAllowedEmail(email)) {
    const { domains, addresses } = getAllowlist();
    console.warn(
      `[internal-auth] ${email} not on allowlist — no link sent. ` +
        `Allowed domains: ${JSON.stringify(domains)}; addresses: ${JSON.stringify(addresses)}`,
    );
    return { sent: true };
  }
  if (rateLimited(email)) {
    console.warn(`[internal-auth] rate limit hit for ${email} — no link sent.`);
    return { sent: true };
  }

  const token = await createLinkToken(email);
  const link = `${await getOrigin()}/internal/verify?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev convenience: print the link to the terminal so the flow is testable
    // without a live Resend key on the machine. Hard-gated to `development` —
    // a production deploy missing its key must fail, never print a working
    // credential into the platform logs.
    if (process.env.NODE_ENV === "development") {
      console.log(`\n[internal-auth] dev sign-in link for ${email}:\n${link}\n`);
      return { sent: true, devLink: link };
    }
    // Loud in the server log (the admin's signal), silent to the visitor.
    console.error("[internal-auth] RESEND_API_KEY is not set — link not sent.");
    return { sent: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: "Your Stratum sign-in link",
      html: `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#111;">
  <p>Here's your link to the Stratum internal tools. It expires in 15 minutes.</p>
  <p style="margin:28px 0;">
    <a href="${link}" style="background:#7d34ff;color:#fff;padding:12px 22px;border-radius:4px;text-decoration:none;display:inline-block;">Open internal tools</a>
  </p>
  <p style="color:#666;font-size:13px;">If you didn't ask for this, you can ignore this email — nothing happens until the link is opened.</p>
</div>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[internal-auth] Resend error ${res.status}: ${detail}`);
  }

  return { sent: true };
}

export async function signOut() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/internal" });
  redirect("/internal/sign-in");
}
