/**
 * Magic-link auth for the internal tools under /internal.
 *
 * There is no database on this site, so both the emailed link and the session
 * are stateless HMAC-signed tokens rather than rows in a table:
 *
 *   link token     <base64url(email|expiry|nonce)>.<HMAC>   — 15 minutes
 *   session token  <base64url(email|expiry)>.<HMAC>         — 30 days
 *
 * Signed with INTERNAL_AUTH_SECRET, which is separate from the password used
 * anywhere else. Rotating it signs everyone out. The two token kinds are
 * signed over different purpose prefixes, so an emailed link can never be
 * replayed as a session cookie.
 *
 * Known limitation of being stateless: a link cannot be marked single-use, so
 * it stays valid for its full 15-minute window even after it is clicked. That
 * is the trade for not adding a database — see ADR note in CLAUDE.md.
 *
 * Web Crypto only (no `node:crypto`), so these helpers also run in middleware.
 */

export const SESSION_COOKIE = "stratum_internal";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const LINK_MAX_AGE = 60 * 15; // 15 minutes

const encoder = new TextEncoder();

function getSecret() {
  return process.env.INTERNAL_AUTH_SECRET ?? "";
}

/** True when auth is configured. Unconfigured = locked, never open. */
export function isInternalAuthConfigured() {
  return getSecret().length > 0;
}

/**
 * Who may request a sign-in link. Comma-separated, and each entry is either a
 * whole domain (`stratumtech.ca`) or one exact address
 * (`someone@agency.example`) — so an outside collaborator can be let in
 * individually without opening up their entire domain.
 */
export function getAllowlist() {
  const entries = (process.env.INTERNAL_ALLOWED_EMAILS || "stratumtech.ca")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const domains: string[] = [];
  const addresses: string[] = [];
  for (const entry of entries) {
    // "stratumtech.ca" and "@stratumtech.ca" both mean the whole domain;
    // anything with a local part is one specific person.
    if (entry.startsWith("@")) domains.push(entry.slice(1));
    else if (entry.includes("@")) addresses.push(entry);
    else domains.push(entry);
  }
  return { domains, addresses };
}

/** The domain shown as a fixed suffix on the sign-in field. */
export function getPrimaryDomain() {
  return getAllowlist().domains[0] ?? "stratumtech.ca";
}

export function normalizeEmail(input: string) {
  return input.trim().toLowerCase();
}

// Pragmatic local-part rule — no quoted strings or unicode. Enough for the
// corporate mailboxes this gate serves.
const LOCAL_PART_RE = /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?$/;

/**
 * The field takes a bare local part ("john.doe") and appends the primary
 * domain. An outside collaborator on the allowlist types their full address
 * instead, so both shapes have to resolve.
 *
 * Returns null when the input is not a usable address at all — which is a
 * format problem, safe to report. Whether the resulting address is *allowed*
 * is a separate question, deliberately answered without telling the caller.
 */
export function resolveEmail(input: string) {
  const raw = normalizeEmail(input);
  if (!raw) return null;
  if (raw.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : null;
  }
  return LOCAL_PART_RE.test(raw) ? `${raw}@${getPrimaryDomain()}` : null;
}

/**
 * Only internal paths, so a crafted link can't bounce someone off-site.
 * The auth routes themselves are excluded to avoid redirect loops.
 */
export function safeRedirect(path: string | null | undefined) {
  if (!path) return "/internal/email-signature";
  if (!path.startsWith("/") || path.startsWith("//")) return "/internal/email-signature";
  if (path.startsWith("/internal/sign-in") || path.startsWith("/internal/verify")) {
    return "/internal/email-signature";
  }
  return path;
}

export function isAllowedEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const { domains, addresses } = getAllowlist();
  return addresses.includes(email) || domains.includes(email.split("@")[1]);
}

function b64url(input: string) {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

async function hmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time compare over equal-length hex strings. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type Purpose = "link" | "session";

async function sign(purpose: Purpose, payload: string) {
  const encoded = b64url(payload);
  return `${encoded}.${await hmac(`${purpose}:${encoded}`)}`;
}

async function verify(purpose: Purpose, token: string | undefined) {
  if (!getSecret() || !token) return null;
  const [encoded, mac] = token.split(".");
  if (!encoded || !mac) return null;
  if (!safeEqual(mac, await hmac(`${purpose}:${encoded}`))) return null;

  let payload: string;
  try {
    payload = unb64url(encoded);
  } catch {
    return null;
  }
  const [email, expiry] = payload.split("|");
  const expiresAt = Number(expiry);
  if (!email || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  return { email };
}

export async function createLinkToken(email: string) {
  const expiry = Date.now() + LINK_MAX_AGE * 1000;
  const nonce = crypto.randomUUID();
  return sign("link", `${email}|${expiry}|${nonce}`);
}

export function verifyLinkToken(token: string | undefined) {
  return verify("link", token);
}

export async function createSessionToken(email: string) {
  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  return sign("session", `${email}|${expiry}`);
}

export function verifySessionToken(token: string | undefined) {
  return verify("session", token);
}
