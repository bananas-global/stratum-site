import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/internal-auth";

// Everything under /internal is staff-only. The sign-in screen and the link
// verifier are the two doors that have to stay open.
export const config = {
  matcher: ["/internal", "/internal/((?!sign-in|verify).*)"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  // Carry the requested path through sign-in so the link lands on the tool
  // they actually asked for, not always the signature builder.
  const url = request.nextUrl.clone();
  url.pathname = "/internal/sign-in";
  url.search = "";
  url.searchParams.set(
    "next",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(url);
}
