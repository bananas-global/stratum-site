import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import InternalSignInForm from "@/components/InternalSignInForm";
import {
  getAllowlist,
  getPrimaryDomain,
  isInternalAuthConfigured,
  safeRedirect,
} from "@/lib/internal-auth";

export const metadata: Metadata = {
  title: "Sign in | Stratum (internal)",
  description: "Internal tools — Stratum team only.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

/**
 * Names the allowed domains only. Individually-approved addresses are left
 * out entirely — this page is unauthenticated, so listing them would publish
 * someone's personal email to anyone who loads the URL.
 */
function AllowlistNote() {
  const { domains } = getAllowlist();
  if (!domains.length) return null;

  const list = domains.map((d) => `@${d}`).join(", ");
  return (
    <p className="text-sm text-ink-faint">Access is limited to {list} emails.</p>
  );
}

// Deliberate exception to the "no searchParams in pages" rule: everything under
// /internal is gated and rendered per request anyway, so there is no static
// prerender to protect here.
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; next?: string }>;
}) {
  const { expired, next } = await searchParams;
  const configured = isInternalAuthConfigured();

  return (
    <section className="section bg-surface pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          eyebrow="Internal"
          title="Stratum team tools."
          lede="Enter your work email and we'll send you a sign-in link. No password to remember or share."
        />
        {/* Deliberately no data-reveal: this page is one form, so it must never
            depend on the scroll-reveal engine to become visible. */}
        <div>
          {configured ? (
            <InternalSignInForm
              expired={Boolean(expired)}
              next={safeRedirect(next)}
              domain={getPrimaryDomain()}
            />
          ) : (
            <p className="max-w-md text-sm text-ink-dim">
              Internal tools are locked because sign-in hasn&apos;t been
              configured for this environment. Set{" "}
              <code>INTERNAL_AUTH_SECRET</code> and redeploy.
            </p>
          )}
        </div>
        {configured && <AllowlistNote />}
      </div>
    </section>
  );
}
