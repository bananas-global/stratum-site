import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import PatternGenerator from "@/components/PatternGenerator";

// Hidden internal tool — not part of the public IA. Kept out of search,
// the nav, the footer, and the sitemap. Reachable only by direct link.
export const metadata: Metadata = {
  title: "Pattern Generator | Stratum (internal)",
  description: "Internal tool — generate Stratum-icon background images for decks and docs.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function PatternGeneratorPage() {
  return (
    <section className="section bg-bg pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          eyebrow="Internal tool"
          title="Pattern generator."
          lede="Compose a seamless background from the Stratum icon, then download it as a PNG for presentations, documents and social art."
        />
        <div data-reveal>
          <PatternGenerator />
        </div>
      </div>
    </section>
  );
}
