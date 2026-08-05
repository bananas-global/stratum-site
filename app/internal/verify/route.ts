import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isAllowedEmail,
  safeRedirect,
  verifyLinkToken,
} from "@/lib/internal-auth";

/**
 * Landing point for the emailed magic link. Trades a valid link token for a
 * session cookie, then drops the user at the tool they were after.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? undefined;
  const claim = await verifyLinkToken(token);
  // safeRedirect keeps this to internal paths, so a crafted link can't use the
  // verifier as an open redirect. Resolved against the origin so a `next`
  // carrying its own query string survives intact.
  const next = safeRedirect(request.nextUrl.searchParams.get("next"));
  const origin = request.nextUrl.origin;

  // Re-check the allowlist at redemption, not just at send time: if it is
  // tightened later, links already sitting in an inbox stop working.
  if (!claim || !isAllowedEmail(claim.email)) {
    // Keep the destination through the retry so they still land where they
    // were headed after requesting a fresh link.
    const back = new URL("/internal/sign-in", origin);
    back.searchParams.set("expired", "1");
    back.searchParams.set("next", next);
    return NextResponse.redirect(back);
  }

  const response = NextResponse.redirect(new URL(next, origin));
  response.cookies.set(SESSION_COOKIE, await createSessionToken(claim.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/internal",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
