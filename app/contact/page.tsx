import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SectionHeader } from "@/components/ui";
import CTABand from "@/components/CTABand";
import HubSpotForm from "@/components/HubSpotForm";
// Our own form, replaced by the HubSpot embed so leads land in the CRM. Left in
// the repo (components/ContactForm.tsx + app/api/contact/route.ts are untouched)
// so swapping the two lines below reverts to Resend-emailed submissions.
// import ContactForm from "@/components/ContactForm";
import FAQ, { faqPageLd, type FAQItem } from "@/components/FAQ";
import { SITE, jsonLd, orgGraph, websiteGraph } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact Stratum — Get in touch",
  description:
    "Talk to Stratum about managed IT, cybersecurity, or a project — support, projects, or new business. Send a message or call, and the right person will follow up.",
  path: "/contact",
  ogTitle: "Contact Stratum — Get in touch",
  ogDescription: "Talk to Stratum about managed IT, cybersecurity, or a project.",
});

const FAQS: FAQItem[] = [
  {
    q: "How quickly will Stratum respond to my inquiry?",
    a: "New inquiries go straight to the team and are answered promptly — usually faster than you'd expect. If you're an existing client with a support issue, use service@stratumtech.ca — response times follow your service agreement.",
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
    a: "Email service@stratumtech.ca or call the service line. Support requests through the client channel are dispatched to our Client Support team and handled per your service agreement.",
  },
];

const ASIDE = [
  { title: "Phone", body: "Prefer to talk? Call directly.", link: { label: SITE.phoneDisplay, href: SITE.phoneHref } },
  { title: "How we engage", body: "Structured support, continuity, and project work for growing organizations — reach out to start a conversation." },
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
        lede="Support, projects, or new business — tell us what you need and the right person will get back to you."
        backgroundPattern
      />

      {/* Form + aside */}
      <section className="section section-light">
        <div className="container grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div data-reveal className="flex flex-col gap-6">
            <SectionHeader title="Tell us a bit about what you need." lede="The more context you share, the better the first conversation. Plain answers, no pitch deck." />
            <HubSpotForm />
            {/* <ContactForm /> */}
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
          <SectionHeader title="Frequently asked questions" />
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
