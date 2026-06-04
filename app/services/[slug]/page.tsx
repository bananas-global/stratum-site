import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import { PageHero, ScopeGrid, FeatureGrid, HowSteps, OutcomeStrip, SectionHeader } from "@/components/sections";
import { Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import { SITE, jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) return {};
  return {
    ...pageMeta({
      title: `${svc.metaTitle} | Stratum`,
      description: svc.metaDescription,
      path: `/services/${svc.slug}`,
      ogTitle: `${svc.metaTitle} | Stratum`,
    }),
    // Phase 2 page — not part of the Phase 1 launch. Hidden from search.
    robots: { index: false, follow: false },
  };
}

function TrustLogos({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
      {items.map((l) => (
        <span key={l} className="font-display text-2xl text-ink-faint">
          {l}
        </span>
      ))}
    </div>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();

  const ld = {
    "@type": "Service",
    "@id": `https://stratumtech.ca/services/${svc.slug}#service`,
    name: svc.name,
    serviceType: svc.serviceType,
    provider: { "@id": "https://stratumtech.ca/#organization" },
    areaServed: { "@type": "Country", name: "Canada" },
    description: svc.ldDescription,
    url: `https://stratumtech.ca/services/${svc.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: svc.name, path: `/services/${svc.slug}` },
          ]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: svc.name }]}
        eyebrow={svc.eyebrow}
        title={svc.h1}
        lede={svc.lede}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact">{svc.heroCta}</Button>
          <a href={SITE.phoneHref} className="link-arrow">
            <span>Talk to a Human: {SITE.phoneDisplay}</span>
          </a>
        </div>
      </PageHero>

      {/* What it is */}
      <section className="section bg-surface">
        <div className="container grid gap-8 md:grid-cols-[0.5fr_1fr] md:gap-16">
          <SectionHeader eyebrow="What it is" title={svc.whatItIs.h2} />
          <p data-reveal className="self-center text-lg font-light leading-relaxed text-ink-dim">
            {svc.whatItIs.body}
          </p>
        </div>
      </section>

      {/* Where it applies */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="Where it applies" title={svc.scope.h2} lede={svc.scope.lede} />
          <div data-reveal>
            <ScopeGrid items={svc.scope.items} cols={3} />
          </div>
        </div>
      </section>

      {/* What Stratum handles */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="What Stratum handles" title={svc.handles.h2} />
          {svc.handles.numbered ? (
            <div data-reveal className="flex flex-col">
              {svc.handles.items.map((it) => (
                <div key={it.n} className="grid gap-4 border-t border-line py-7 md:grid-cols-[auto_1fr_2fr] md:items-baseline md:gap-10">
                  <span className="font-display text-3xl text-brand-light">{it.n}</span>
                  <h3 className="font-display text-2xl text-ink-bright">{it.title}</h3>
                  <p className="text-ink-dim">{it.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div data-reveal>
              <FeatureGrid items={svc.handles.items} cols={svc.handles.cols ?? 3} />
            </div>
          )}
        </div>
      </section>

      {/* Backup readiness (cyber only) */}
      {svc.backup && (
        <section id="backup-readiness" className="section bg-bg">
          <div className="container flex flex-col gap-12">
            <SectionHeader eyebrow="Backup & recovery readiness" title={svc.backup.h2} lede={svc.backup.body} />
            <div data-reveal>
              <ScopeGrid items={svc.backup.items} cols={3} />
            </div>
            <p data-reveal className="rounded-md border border-line-soft bg-surface p-6 text-sm text-ink-dim">
              {svc.backup.note}
            </p>
          </div>
        </section>
      )}

      {/* How we work */}
      <section className={`section ${svc.backup ? "bg-surface" : "bg-bg"}`}>
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="How we work" kicker="Operating model" title={svc.howWeWork.h2} lede={svc.howWeWork.lede} />
          <div data-reveal>
            <HowSteps steps={svc.howWeWork.steps} />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section bg-black">
        <div className="container flex flex-col gap-12">
          <SectionHeader kicker="What you get" title={svc.whatYouGet.h2} lede={svc.whatYouGet.lede} />
          <div data-reveal>
            <FeatureGrid items={svc.whatYouGet.items} cols={2} />
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section-sm bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader eyebrow="Proof" kicker="Credibility signals" title={svc.proof.h2} />
          {svc.proof.outcomes && (
            <div data-reveal>
              <OutcomeStrip items={svc.proof.outcomes} />
            </div>
          )}
          {svc.proof.logos && (
            <div data-reveal>
              <TrustLogos items={svc.proof.logos} />
            </div>
          )}
          <p className="rounded-md border border-dashed border-line bg-black/30 p-6 text-sm text-ink-faint">{svc.proof.note}</p>
        </div>
      </section>

      <CTABand title={svc.cta.h2} body={svc.cta.body} />
    </>
  );
}
