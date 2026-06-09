import type { Metadata } from "next";
import { PageHero, FeatureGrid, SectionHeader, CardMedia } from "@/components/sections";
import { Button, ArrowLink } from "@/components/ui";
import ServiceCatalog from "@/components/ServiceCatalog";
import ServiceFilterChips from "@/components/ServiceFilterChips";
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
    visual: {
      src: "/images/managed-it.png",
      alt: "Abstract managed IT service visual with structured dark geometry and purple accent lighting.",
    },
    body: "Ongoing support, maintenance, monitoring, and oversight of the systems your business depends on every day.",
    tags: ["Help desk & support", "Device management", "Network & infrastructure", "Monitoring", "Vendor coordination"],
  },
  {
    name: "Cybersecurity",
    visual: {
      src: "/images/cybersecurity.png",
      alt: "Abstract cybersecurity service visual with layered dark geometry and purple accent lighting.",
    },
    body: "Layered protection, stronger recovery readiness, and clearer control across users, endpoints, backups, and access.",
    tags: ["Endpoint protection", "Identity & access", "Email security", "Backup readiness", "Compliance support"],
  },
  {
    name: "Business Systems",
    visual: {
      src: "/images/business-systems.png",
      alt: "Abstract business systems service visual with structured dark geometry and purple accent lighting.",
    },
    body: "ERP, CRM, automation, and AI enablement aligned with how your business actually operates.",
    tags: ["ERP & CRM", "Microsoft 365", "Automation", "AI enablement", "Projects"],
  },
];

const SIZING_FACTORS = [
  "Support demand",
  "Devices & endpoints",
  "Servers & infrastructure",
  "Backups & recovery",
  "Network & site complexity",
  "Licenses",
  "Risk exposure",
  "Account management",
];

const INDUSTRY_STRIP = [
  { label: "Automotive Dealerships", sub: "Multi-department, multi-vendor" },
  { label: "Medical & Dental", sub: "Uptime, data, compliance" },
  { label: "Law Firms", sub: "Documents, continuity, trust" },
  { label: "Construction & AEC", sub: "Office, site, and field" },
  { label: "Manufacturing", sub: "Multi-site, lifecycle, OT-aware" },
];

type ServicesIndexProps = {
  searchParams?: Promise<{ serviceFilter?: string | string[] }>;
};

export default async function ServicesIndex({ searchParams }: ServicesIndexProps) {
  const params = await searchParams;
  const serviceFilterParam = params?.serviceFilter;
  const serviceFilter = Array.isArray(serviceFilterParam) ? serviceFilterParam[0] : serviceFilterParam;

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
        { "@type": "ListItem", position: 1, name: "Managed IT" },
        { "@type": "ListItem", position: 2, name: "Cybersecurity" },
        { "@type": "ListItem", position: 3, name: "Business Systems" },
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
        backgroundVisual={{
          src: "/images/bg-hero-services.jpg",
          alt: "",
        }}
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Service cards */}
      <section className="section bg-surface">
        <div className="container grid gap-4 md:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.name} data-reveal className="card flex flex-col gap-5 bg-bg">
              <CardMedia visual={c.visual} />
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-3xl text-ink-bright">{c.name}</h2>
                <p className="text-sm leading-relaxed text-ink-dim">{c.body}</p>
                <ServiceFilterChips items={c.tags} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sizing principle — strategic differentiator, placed high for prominence */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1fr] md:items-end md:gap-16">
            <SectionHeader
              eyebrow="How we size engagements"
              title="Sized around your environment — not your user count."
            />
            <p data-reveal className="text-lg font-light leading-relaxed text-ink-dim md:pb-2">
              We don&apos;t price by seats. We size around what actually drives the work — so the shape of the
              engagement comes from your operation, not a headcount.
            </p>
          </div>

          <div
            data-reveal
            className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft sm:grid-cols-3 lg:grid-cols-4"
          >
            {SIZING_FACTORS.map((factor, i) => (
              <div key={factor} className="flex flex-col gap-3 bg-bg p-6">
                <span className="font-body text-[11px] font-semibold tracking-wider text-brand-light/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-ink-bright">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How they work together */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How they work together"
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
            title="Every capability Stratum covers, in one place."
            lede="Filter by category or search below. Each item explains what it delivers for your business — outcomes and accountability, not a list of tools."
          />
          <ServiceCatalog initialQuery={serviceFilter} />
        </div>
      </section>

      {/* Industries strip */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-10">
          <SectionHeader eyebrow="Who we serve" title="Where our services apply." lede="We lead with industries where operational complexity is highest and the cost of unreliable technology is real." />
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
