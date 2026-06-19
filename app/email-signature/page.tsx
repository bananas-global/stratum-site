import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import EmailSignatureBuilder from "@/components/EmailSignatureBuilder";

// Hidden internal tool — not part of the public IA. Kept out of search,
// the nav, the footer, and the sitemap. Reachable only by direct link.
export const metadata: Metadata = {
  title: "Email Signature Builder | Stratum (internal)",
  description: "Internal tool — generate a Stratum email signature.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function EmailSignaturePage() {
  return (
    <section className="section bg-surface pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          title="Build your signature."
          lede="Everything updates live. The logo and brand colours are baked in — you only add your own details."
        />
        <div data-reveal>
          <EmailSignatureBuilder />
        </div>
      </div>
    </section>
  );
}
