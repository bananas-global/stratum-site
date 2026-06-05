import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import InsightsGrid from "@/components/InsightsGrid";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Insights & Resources — IT for Business Leaders",
  description:
    "Practical, plain-language insights on managed IT, cybersecurity, and business systems for business leaders for growing organizations.",
  path: "/insights",
  ogTitle: "Insights & Resources — IT for Business Leaders | Stratum",
  ogDescription: "Practical insights on managed IT, cybersecurity, and business systems for business leaders.",
});

export default function InsightsPage() {
  const ld = {
    "@type": "Blog",
    "@id": "https://stratumtech.ca/insights#blog",
    url: "https://stratumtech.ca/insights",
    name: "Insights for business leaders",
    description:
      "Practical, plain-language content on managed IT, cybersecurity, and business systems for business leaders.",
    publisher: { "@id": "https://stratumtech.ca/#organization" },
    inLanguage: "en-CA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow="Insights & Resources"
        title="Insights for business leaders."
        lede="Practical, plain-language content on managed IT, cybersecurity, and business systems — written for the people running the business, not the IT team."
        visual={{
          src: "/bananas/services-structure-bg.webp",
          alt: "Layered graphite infrastructure model with a restrained purple light accent.",
          label: "Plain-language clarity",
          caption: "Ideas and decisions translated from technical complexity into business language.",
        }}
      />

      <section className="section bg-surface">
        <div className="container">
          <InsightsGrid />
        </div>
      </section>

      <CTABand
        title="Have a question that isn't answered here?"
        body="Talk to us directly. No pitch, no jargon — just a straight conversation about your situation."
      />
    </>
  );
}
