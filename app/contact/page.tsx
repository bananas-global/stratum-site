import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SectionHeader } from "@/components/ui";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import { SITE, jsonLd, orgGraph, websiteGraph } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact Stratum — Get in touch",
  description:
    "Talk to Stratum about managed IT, cybersecurity, or a project. Choose the right path — support, projects, or new business — and we'll get back to you the same business day.",
  path: "/contact",
  ogTitle: "Contact Stratum — Get in touch",
  ogDescription: "Talk to Stratum about managed IT, cybersecurity, or a project.",
});

const PATHS = [
  {
    title: "Existing client support",
    body: "Already a Stratum client and need help? Use the support channel for the fastest response.",
    email: "support@stratumtech.ca",
  },
  {
    title: "Projects & implementations",
    body: "A defined project — migration, implementation, or systems work — for current or new clients.",
    email: "projects@stratumtech.ca",
  },
  {
    title: "New business",
    body: "Considering Stratum as a managed technology partner? Start here for a structured conversation.",
    email: "hello@stratumtech.ca",
  },
];

const ASIDE = [
  { title: "Phone", body: "Prefer to talk? Call directly.", link: { label: SITE.phoneDisplay, href: SITE.phoneHref } },
  { title: "Email", body: "General inquiries:", link: { label: "hello@stratumtech.ca", href: "mailto:hello@stratumtech.ca" } },
  { title: "How we engage", body: "Structured support, continuity, and project work for growing organizations — reach out to start a conversation." },
  { title: "Response expectations", body: "New inquiries: same business day. Existing client support: per your service agreement." },
];

export default function ContactPage() {
  const contactPage = {
    "@type": "ContactPage",
    "@id": "https://stratumtech.ca/contact#webpage",
    url: "https://stratumtech.ca/contact",
    name: "Contact Stratum",
    description: "Get in touch with Stratum — support, projects, or new business.",
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
          breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          contactPage,
          orgGraph,
          websiteGraph,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Get in touch with Stratum."
        lede="Pick the path that fits — support, projects, or new business — and we will respond the same business day."
      />

      {/* Inquiry paths */}
      <section className="section-sm bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader title="Three ways to reach us — choose what fits." />
          <div data-reveal className="grid gap-4 md:grid-cols-3">
            {PATHS.map((p) => (
              <div key={p.title} className="card flex flex-col gap-3">
                <h3 className="font-display text-2xl text-ink-bright">{p.title}</h3>
                <p className="text-sm leading-relaxed text-ink-dim">{p.body}</p>
                <a href={`mailto:${p.email}`} className="link-arrow mt-2 text-sm">
                  <span>{p.email}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + aside */}
      <section className="section bg-bg">
        <div className="container grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div data-reveal className="flex flex-col gap-6">
            <SectionHeader title="Tell us a bit about what you need." lede="We will get back to you the same business day. Plain answers, no pitch deck." />
            <ContactForm />
          </div>
          <aside data-reveal className="flex flex-col gap-4">
            {ASIDE.map((a) => (
              <div key={a.title} className="rounded-md border border-line-soft bg-surface p-6">
                <h3 className="heading-plain text-xs font-semibold uppercase tracking-wider text-ink-faint">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{a.body}</p>
                {a.link && (
                  <a href={a.link.href} className="mt-1 block font-display text-2xl text-ink-bright transition-colors hover:text-brand-light">
                    {a.link.label}
                  </a>
                )}
              </div>
            ))}
          </aside>
        </div>
      </section>

      <CTABand
        title="Prefer the phone?"
        body="Call Stratum directly and talk through what you need."
        ctaLabel={`Call ${SITE.phoneDisplay}`}
        ctaHref={SITE.phoneHref}
      />
    </>
  );
}
