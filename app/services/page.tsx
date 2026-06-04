import type { Metadata } from "next";
import { PageHero, FeatureGrid, SectionHeader } from "@/components/sections";
import { Button, ChipRow, ArrowLink } from "@/components/ui";
import ServiceCatalog from "@/components/ServiceCatalog";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Services — Managed IT, Cybersecurity & Business Systems",
  description:
    "Stratum's three service categories — Managed IT, Cybersecurity, and Business Systems — for growing organizations. One structured partner across the whole environment.",
  path: "/services",
  ogTitle: "Services — Managed IT, Cybersecurity & Business Systems | Stratum",
  ogDescription: "Stratum's three service categories for growing organizations.",
});

const CARDS = [
  {
    name: "Managed IT",
    href: "/services/managed-it",
    body: "Ongoing support, maintenance, monitoring, and oversight of the systems your business depends on every day.",
    tags: ["Help desk & support", "Device management", "Network & infrastructure", "Monitoring", "Vendor coordination"],
  },
  {
    name: "Cybersecurity",
    href: "/services/cybersecurity",
    body: "Layered protection, stronger recovery readiness, and clearer control across users, endpoints, backups, and access.",
    tags: ["Endpoint protection", "Identity & access", "Email security", "Backup readiness", "Compliance support"],
  },
  {
    name: "Business Systems",
    href: "/services/business-systems",
    body: "ERP, CRM, automation, and AI enablement aligned with how your business actually operates.",
    tags: ["ERP & CRM", "Microsoft 365", "Automation", "AI enablement", "Projects"],
  },
];

const INDUSTRY_STRIP = [
  { label: "Automotive Dealerships", sub: "Multi-department, multi-vendor", href: "/industries/automotive-dealerships" },
  { label: "Medical & Dental", sub: "Uptime, data, compliance", href: "/industries/medical-dental" },
  { label: "Law Firms", sub: "Documents, continuity, trust", href: "/industries/law-firms" },
  { label: "Construction & AEC", sub: "Office, site, and field", href: "/industries/construction-aec" },
  { label: "Manufacturing", sub: "Multi-site, lifecycle, OT-aware", href: "/industries/manufacturing" },
];

export default function ServicesIndex() {
  const ld = {
    "@type": "CollectionPage",
    "@id": "https://stratumtech.ca/services#webpage",
    url: "https://stratumtech.ca/services",
    name: "Stratum Services",
    description: "Stratum's three service categories — Managed IT, Cybersecurity, and Business Systems.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://stratumtech.ca/#website" },
    publisher: { "@id": "https://stratumtech.ca/#organization" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Managed IT", url: "https://stratumtech.ca/services/managed-it" },
        { "@type": "ListItem", position: 2, name: "Cybersecurity", url: "https://stratumtech.ca/services/cybersecurity" },
        { "@type": "ListItem", position: 3, name: "Business Systems", url: "https://stratumtech.ca/services/business-systems" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Services overview"
        title="Three service categories. One structured partner."
        lede="Stratum operates as a single technology partner across the entire environment. Each service category is built around business outcomes — not tool lists — and works in coordination with the others."
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Service cards */}
      <section className="section bg-surface">
        <div className="container grid gap-4 md:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.name} data-reveal className="card flex flex-col gap-4">
              <h2 className="font-display text-3xl text-ink-bright">{c.name}</h2>
              <p className="text-sm leading-relaxed text-ink-dim">{c.body}</p>
              <div className="mt-2">
                <ChipRow items={c.tags} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How they work together */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How they work together"
            kicker="One partner, one environment"
            title="Coordinated services, not stacked vendors."
            lede="Each category solves something different — but they share the same operating model, the same accountability, and the same point of contact. That is what makes Stratum easier to work with than the typical mix of MSPs, security vendors, and implementation shops."
          />
          <div data-reveal>
            <FeatureGrid
              items={[
                { title: "Same operating model", body: "Tickets, dispatch, escalation, and follow-up are handled the same way across every category." },
                { title: "Same accountability", body: "One partner responsible for the environment — no finger-pointing when something breaks." },
                { title: "Same long-term view", body: "Roadmap, lifecycle planning, and account management connect the categories instead of fragmenting them." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Service catalog */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Service catalog"
            kicker="Browse by category"
            title="Every capability Stratum covers, in one place."
            lede="Filter by category or search below. Each item explains what it delivers for your business — outcomes and accountability, not a list of tools."
          />
          <ServiceCatalog />
        </div>
      </section>

      {/* Sizing principle */}
      <section className="section bg-bg">
        <div className="container grid gap-8 md:grid-cols-[0.5fr_1fr] md:gap-16">
          <SectionHeader eyebrow="How we size engagements" kicker="Sizing principle" title="Sized around your environment — not your user count." />
          <p data-reveal className="self-center text-lg font-light leading-relaxed text-ink-dim">
            We don&apos;t price by seats. We size around what actually drives the work: support demand, devices, servers,
            backups, network and site complexity, licenses, risk exposure, and account-management needs. The shape of the
            engagement comes from your operation.
          </p>
        </div>
      </section>

      {/* Industries strip */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader eyebrow="Who we serve" kicker="Industries" title="Where our services apply." lede="We lead with industries where operational complexity is highest and the cost of unreliable technology is real." />
          <div data-reveal className="grid gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
            {INDUSTRY_STRIP.map((it) => (
              <div key={it.label} className="flex flex-col gap-1 bg-surface p-6">
                <span className="font-medium text-ink-bright">{it.label}</span>
                <span className="text-sm text-ink-faint">{it.sub}</span>
              </div>
            ))}
          </div>
          <ArrowLink href="/industries">See the full Industries overview</ArrowLink>
        </div>
      </section>

      <CTABand
        title="Not sure which category fits where you are today?"
        body="Start with a conversation. We will help you map what you have to what you need."
      />
    </>
  );
}
