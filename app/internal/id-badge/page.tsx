import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SectionHeader } from "@/components/ui";
import IdBadgeBuilder from "@/components/IdBadgeBuilder";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/internal-auth";
import { signOut } from "../sign-in/actions";

// Internal tool — protected purely by living under /internal, which
// middleware.ts gates behind the magic-link session (see lib/internal-auth.ts).
// Kept out of search, the nav, the footer and the sitemap.
export const metadata: Metadata = {
  title: "ID Badge Generator | Stratum (internal)",
  description: "Internal tool — generate print-ready Stratum ID badges.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default async function IdBadgePage() {
  // Middleware already guaranteed a valid session; this is only to name it.
  const session = await verifySessionToken(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );

  return (
    <section className="section bg-surface pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          title="Build ID badges."
          lede="Add the team, frame each photo, and export print-ready PDFs — one badge per page at its real size, with bleed and trim marks."
        />
        <div data-reveal>
          <IdBadgeBuilder />
        </div>
        <form action={signOut} className="flex items-center gap-3 text-sm">
          {session && <span className="text-ink-faint">Signed in as {session.email}</span>}
          <button
            type="submit"
            className="text-ink-faint underline-offset-4 transition-colors hover:text-ink-bright hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
