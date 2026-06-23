import type { Metadata } from "next";
import { PageHero, SectionHeader } from "@/components/sections";
import MissingMiddleVisual from "@/components/MissingMiddleVisual";
import { Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import StratumPillars from "@/components/StratumPillars";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Stratum — Operational Technology Partner",
  description:
    "About Stratum: a structured, security-aware managed IT partner for growing organizations. Our story, values, operating style, and leadership team.",
  path: "/about",
  ogTitle: "About Stratum — Operational Technology Partner",
  ogDescription: "Our story, values, and operating style as a structured managed IT partner for growing organizations.",
});

export default function AboutPage() {
  const ld = {
    "@type": "AboutPage",
    "@id": "https://stratumtech.ca/about#webpage",
    url: "https://stratumtech.ca/about",
    name: "About Stratum",
    description: "About Stratum — our story, values, operating style, and leadership team.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://stratumtech.ca/#website" },
    publisher: { "@id": "https://stratumtech.ca/#organization" },
    mainEntity: { "@id": "https://stratumtech.ca/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About Stratum"
        title="An operational technology partner for growing businesses."
        lede="Stratum is a structured, security-aware technology partner for organizations that need reliable systems, clear accountability, and long-term stewardship — without the overhead of an enterprise IT department."
        backgroundVisual={{
          src: "/images/bg-hero-about.png",
          alt: "",
        }}
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Our story */}
      <section className="section bg-surface">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div data-reveal className="flex flex-col gap-6">
            <SectionHeader eyebrow="Our story" title="Stratum exists because the middle was missing." />
            <p className="text-lg font-light leading-relaxed text-ink-dim">
              Growing organizations kept ending up in the same place — too complex for break-fix IT, too small to justify
              deep internal IT teams, and underserved by generic MSP offers. We built Stratum to be the structured
              operational partner that actually fits this gap. Not a vendor selling tools. Not a help desk on standby. A
              partner responsible for the environment over time.
            </p>
          </div>
          <MissingMiddleVisual />
        </div>
      </section>

      <StratumPillars />

      {/* Leadership */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="The team"
            title="People behind the partnership."
            lede="Stratum is led by an experienced team that has worked across managed services, cybersecurity, and business systems implementation."
          />
          <div data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line-soft bg-gradient-to-br from-surface-2 to-black">
                  <span className="text-xs uppercase tracking-wider text-ink-faint">Portrait</span>
                </div>
                <div>
                  <div className="heading-gradient font-display text-xl">Leadership Name</div>
                  <div className="text-sm text-ink-faint">Role / Title</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Want to know more before you reach out?"
        body="Take a closer look at our services and the industries we serve."
        ctaLabel="Explore Services"
        ctaHref="/services"
      />
    </>
  );
}
