import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SectionHeader } from "@/components/ui";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import FAQ, { faqPageLd, type FAQItem } from "@/components/FAQ";
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

const FAQS: FAQItem[] = [
  {
    q: "How quickly will Stratum respond to my inquiry?",
    a: "New inquiries get a response the same business day. If you're an existing client with a support issue, use support@stratumtech.ca — response times follow your service agreement.",
  },
  {
    q: "Is the initial conversation free?",
    a: "Yes. The first conversation is free and carries no obligation — a straightforward discussion about your current environment and what a more structured setup could look like. No pitch deck, no pressure.",
  },
  {
    q: "Do you only work with businesses near Abbotsford?",
    a: "No. Stratum is based in Abbotsford, BC and serves the Lower Mainland — Chilliwack, Langley, Surrey, and surrounding communities — but much of our work is delivered remotely, so we support organizations across British Columbia and the rest of Canada as well.",
  },
  {
    q: "What should I include in my message?",
    a: "The more context, the better the first conversation: your industry, team size, number of sites, how IT is supported today, any security or compliance concerns, and your timeline. A couple of sentences on what prompted you to reach out is plenty.",
  },
  {
    q: "I'm already a Stratum client — where do I get support?",
    a: "Email support@stratumtech.ca or call the service line. Support requests through the client channel are dispatched to our Client Support team and handled per your service agreement.",
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
    "@id": "https://www.stratumtech.ca/contact#webpage",
    url: "https://www.stratumtech.ca/contact",
    name: "Contact Stratum",
    description: "Get in touch with Stratum — support, projects, or new business.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://www.stratumtech.ca/#website" },
    publisher: { "@id": "https://www.stratumtech.ca/#organization" },
    mainEntity: { "@id": "https://www.stratumtech.ca/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          contactPage,
          faqPageLd(FAQS, "https://www.stratumtech.ca/contact#faq"),
          orgGraph,
          websiteGraph,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Get in touch with Stratum."
        lede="Pick the path that fits — support, projects, or new business — and we will respond the same business day."
        backgroundPattern
      />

      {/* Inquiry paths */}
      <section className="section-sm bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader title="Three ways to reach us — choose what fits." />
          <div data-reveal className="grid gap-4 md:grid-cols-3">
            {PATHS.map((p) => (
              <div key={p.title} className="card flex flex-col gap-3">
                <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">{p.title}</h3>
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
                  <a href={a.link.href} className="mt-1 block font-display text-[1.125rem] leading-[1.5rem] text-ink-bright transition-colors hover:text-brand-light">
                    {a.link.label}
                  </a>
                )}
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* FAQ — engineered for search + LLM extraction (FAQPage schema above) */}
      <section className="section-sm bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader title="Before you reach out — quick answers." />
          <FAQ items={FAQS} />
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
