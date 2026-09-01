import type { Metadata } from "next";
import CTABand from "@/components/CTABand";
import { PageHero } from "@/components/sections";
import { jsonLd } from "@/lib/site";
import { breadcrumb, pageMeta } from "@/lib/seo";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/lib/terms";

export const metadata: Metadata = pageMeta({
  title: "Terms & Conditions — Stratum",
  description:
    "The terms and conditions that apply to customers and clients using Stratum services and licences.",
  path: "/terms",
});

export default function TermsPage() {
  const ld = {
    "@type": "WebPage",
    "@id": "https://www.stratumtech.ca/terms#webpage",
    url: "https://www.stratumtech.ca/terms",
    name: "Terms & Conditions — Stratum",
    description:
      "The terms and conditions that apply to customers and clients using Stratum services and licences.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://www.stratumtech.ca/#website" },
    publisher: { "@id": "https://www.stratumtech.ca/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Terms & Conditions", path: "/terms" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
        eyebrow="Legal"
        title="Terms & Conditions"
        lede={TERMS_INTRO}
      />

      <section className="section bg-surface">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <nav aria-label="On this page" className="flex flex-col gap-3">
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint">
                On this page
              </span>
              <ol className="flex flex-col gap-2.5">
                {TERMS_SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-3 text-sm text-ink-dim transition-colors hover:text-ink-bright"
                    >
                      <span className="font-display text-brand-light">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="legal-prose flex max-w-2xl flex-col gap-14">
            {TERMS_SECTIONS.map((section, sectionIndex) => (
              <article key={section.id} id={section.id} className="scroll-mt-28" data-reveal>
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="font-display text-[0.9375rem] leading-[1.3125rem] text-brand-light">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright md:text-[1.40625rem] md:leading-[1.6875rem]">
                    {section.title}
                  </h2>
                </div>

                <ol className="flex flex-col gap-6">
                  {section.clauses.map((clause, clauseIndex) => (
                    <li
                      key={`${section.id}-${clauseIndex}`}
                      className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 text-base font-light leading-relaxed text-ink-dim"
                    >
                      <span className="font-display text-sm text-brand-light">
                        {sectionIndex + 1}.{clauseIndex + 1}
                      </span>
                      <div>
                        <p>
                          {clause.heading ? (
                            <strong className="font-medium text-ink-bright">{clause.heading} </strong>
                          ) : null}
                          {clause.text}
                        </p>

                        {clause.items.length > 0 ? (
                          <ol className="mt-4 flex list-[lower-alpha] flex-col gap-3 pl-6 marker:text-brand-light">
                            {clause.items.map((item, itemIndex) => (
                              <li key={`${section.id}-${clauseIndex}-${itemIndex}`} className="pl-2">
                                <p>{item.text}</p>

                                {item.items.length > 0 ? (
                                  <ol className="mt-3 flex list-[lower-roman] flex-col gap-3 pl-6 marker:text-brand-light">
                                    {item.items.map((nestedItem, nestedIndex) => (
                                      <li
                                        key={`${section.id}-${clauseIndex}-${itemIndex}-${nestedIndex}`}
                                        className="pl-2"
                                      >
                                        {nestedItem}
                                      </li>
                                    ))}
                                  </ol>
                                ) : null}
                              </li>
                            ))}
                          </ol>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Questions about these terms?"
        body="Talk with our team about how these terms apply to your services with Stratum."
        ctaLabel="Contact Stratum"
        ctaHref="/contact"
      />
    </>
  );
}
