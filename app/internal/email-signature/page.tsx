import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SectionHeader } from "@/components/ui";
import EmailSignatureBuilder from "@/components/EmailSignatureBuilder";
import { getSignatureCtas } from "@/lib/signature-cta";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/internal-auth";
import { signOut } from "../sign-in/actions";

// Internal tool — not part of the public IA. Kept out of search, the nav, the
// footer, and the sitemap, and behind the /internal magic-link gate
// (see middleware.ts + lib/internal-auth.ts).
export const metadata: Metadata = {
  title: "Email Signature Builder | Stratum (internal)",
  description: "Internal tool — generate a Stratum email signature.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default async function EmailSignaturePage() {
  const ctas = getSignatureCtas();
  // Middleware already guaranteed a valid session; this is only to name it.
  const session = await verifySessionToken(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );

  return (
    <section className="section bg-surface pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          title="Build your signature."
          lede="Everything updates live. The logo and brand colours are baked in — you only add your own details."
        />
        <div data-reveal>
          <EmailSignatureBuilder ctas={ctas} />
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
