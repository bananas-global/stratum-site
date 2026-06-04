import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { PageHero, ScopeGrid, FeatureGrid, HowSteps, SectionHeader } from "@/components/sections";
import { ChipRow, Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import { SITE, jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    ...pageMeta({
      title: `${ind.metaTitle} | Stratum`,
      description: ind.metaDescription,
      path: `/industries/${ind.slug}`,
      ogTitle: `${ind.metaTitle} | Stratum`,
    }),
    // Phase 2 page — not part of the Phase 1 launch. Hidden from search.
    robots: { index: false, follow: false },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const ld = {
    "@type": "ProfessionalService",
    "@id": `https://stratumtech.ca/industries/${ind.slug}#service`,
    name: ind.ldName,
    serviceType: ind.serviceType,
    provider: { "@id": "https://stratumtech.ca/#organization" },
    audience: { "@type": "BusinessAudience", audienceType: ind.audienceType },
    areaServed: [{ "@type": "AdministrativeArea", name: "Canada" }],
    description: ind.ldDescription,
    url: `https://stratumtech.ca/industries/${ind.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: ind.name, path: `/industries/${ind.slug}` },
          ]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.name }]}
        eyebrow={ind.eyebrow}
        title={ind.h1}
        lede={ind.lede}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact">Talk with Stratum</Button>
            <a href={SITE.phoneHref} className="link-arrow">
              <span>Talk to a Human: {SITE.phoneDisplay}</span>
            </a>
          </div>
          <ChipRow items={ind.tags} />
        </div>
      </PageHero>

      {/* What we understand */}
      <section className="section bg-surface">
        <div className="container grid gap-8 md:grid-cols-[0.5fr_1fr] md:gap-16">
          <SectionHeader eyebrow="What we understand" title={ind.understand.h2} />
          <p data-reveal className="self-center text-lg font-light leading-relaxed text-ink-dim">
            {ind.understand.body}
          </p>
        </div>
      </section>

      {/* Where the complexity lives */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="Where the complexity lives" title={ind.complexity.h2} />
          <div data-reveal>
            <ScopeGrid items={ind.complexity.items} cols={3} />
          </div>
        </div>
      </section>

      {/* What Stratum delivers */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="What Stratum delivers" title={ind.delivers.h2} />
          <div data-reveal>
            <FeatureGrid items={ind.delivers.items} cols={3} />
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="How we work" kicker="Operating model" title="Structured partnership from day one." />
          <div data-reveal>
            <HowSteps steps={ind.steps} />
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="section bg-black">
        <div className="container flex flex-col gap-12">
          <SectionHeader kicker="Outcomes" title={ind.outcomes.h2} />
          <div data-reveal>
            <FeatureGrid items={ind.outcomes.items} cols={2} />
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section-sm bg-surface">
        <div className="container">
          <SectionHeader eyebrow="Proof" kicker="Credibility signals" title={ind.proofH2} />
          <p data-reveal className="mt-6 rounded-md border border-dashed border-line bg-black/30 p-6 text-sm text-ink-faint">
            Content gap: add 1–2 short outcome statements from current clients in this segment before launch.
          </p>
        </div>
      </section>

      <CTABand title={ind.cta.h2} body={ind.cta.body} />
    </>
  );
}
