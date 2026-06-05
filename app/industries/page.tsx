import type { Metadata } from "next";
import { PageHero, FeatureGrid, SectionHeader, CardMedia } from "@/components/sections";
import { Button, ArrowLink } from "@/components/ui";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Industries We Serve — Managed IT for Growing Organizations",
  description:
    "Stratum leads with industries where operational complexity is highest — automotive dealerships, medical & dental clinics, law firms, construction & AEC, and manufacturing operations.",
  path: "/industries",
  ogTitle: "Industries We Serve | Stratum",
  ogDescription: "Industries where Stratum leads — automotive, medical, legal, construction, manufacturing.",
});

const CARD_COPY: Record<string, { blurb: string; tags: string[] }> = {
  "automotive-dealerships": {
    blurb: "Sales floors, service bays, finance offices, and back-office systems all depend on reliable technology running together. Multi-department complexity, vendor sprawl, and uptime pressure.",
    tags: ["Managed IT", "Network & Wi-Fi", "DMS & Vendor Coordination", "Cybersecurity"],
  },
  "medical-dental": {
    blurb: "Patient data, booking systems, and compliance requirements demand a technology partner who takes responsibility seriously and acts before problems happen.",
    tags: ["Managed IT", "Cybersecurity", "Backup & Recovery", "Compliance Readiness"],
  },
  "law-firms": {
    blurb: "Trust, document access, and continuity are non-negotiable. A single incident — lost files, a compromised account, or hours of downtime — has real professional consequences.",
    tags: ["Managed IT", "Email Security", "Document Security", "Microsoft 365"],
  },
  "construction-aec": {
    blurb: "Office, job site, and field crews run simultaneously. Technology has to work everywhere — and keep up as teams scale, projects shift, and subcontractors come and go.",
    tags: ["Managed IT", "Mobile & Field Support", "Business Systems", "Vendor Coordination"],
  },
  manufacturing: {
    blurb: "High device counts, multiple sites, operational systems, and uptime pressure across the floor and the back office. Structure and stability aren't optional.",
    tags: ["Managed IT", "Network & Infrastructure", "Cybersecurity", "Multi-Site Support"],
  },
};

const ORDER = ["automotive-dealerships", "medical-dental", "law-firms", "construction-aec", "manufacturing"];
const NAMES: Record<string, string> = {
  "automotive-dealerships": "Automotive Dealerships",
  "medical-dental": "Medical & Dental Clinics",
  "law-firms": "Law Firms & Legal Services",
  "construction-aec": "Construction & AEC Firms",
  manufacturing: "Manufacturing & Industrial",
};

const INDUSTRY_VISUALS: Record<string, { src: string; alt: string; label: string }> = {
  "automotive-dealerships": {
    src: "/images/industries/automotive-dealerships.png",
    alt: "Dark automotive dealership showroom and service bay with managed network infrastructure.",
    label: "Dealership uptime",
  },
  "medical-dental": {
    src: "/images/industries/medical-dental.png",
    alt: "Dark modern dental clinic with secure workstation, imaging display, and network cabinet.",
    label: "Patient trust",
  },
  "law-firms": {
    src: "/images/industries/law-firms.png",
    alt: "Refined law office workspace with secure document storage and server room beyond glass.",
    label: "Continuity",
  },
  "construction-aec": {
    src: "/images/industries/construction-aec.png",
    alt: "Construction and AEC operations desk with plans, rugged tablet, laptop, and site view.",
    label: "Office, site, field",
  },
  manufacturing: {
    src: "/images/industries/manufacturing.png",
    alt: "Modern manufacturing control room overlooking a production floor and network cabinet.",
    label: "Operational stability",
  },
};

export default function IndustriesIndex() {
  const ld = {
    "@type": "CollectionPage",
    "@id": "https://stratumtech.ca/industries#webpage",
    url: "https://stratumtech.ca/industries",
    name: "Industries We Serve",
    description: "The industries Stratum leads with — chosen for operational complexity and the real cost of unreliable IT.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://stratumtech.ca/#website" },
    publisher: { "@id": "https://stratumtech.ca/#organization" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ORDER.map((slug, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: NAMES[slug],
        url: `https://stratumtech.ca/industries/${slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        eyebrow="Industries"
        title="Industries where Stratum leads."
        lede="We focus on industries where operational complexity is highest and the cost of unreliable IT is real. The services are the same — Managed IT, Cybersecurity, and Business Systems — but the way they apply changes by vertical."
        visual={{
          src: "/bananas/industries-structure-bg.webp",
          alt: "Precision graphite platform with drafting marks and a purple light channel.",
          label: "Industry structure",
          caption: "The same service model changes shape around each operating environment.",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact">Talk With Stratum</Button>
          <ArrowLink href="/services">Or see our services</ArrowLink>
        </div>
      </PageHero>

      {/* Primary industries */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Primary industries"
            title="Where we lead with credibility."
            lede="Five verticals where we already operate, where our 5S lens fits naturally, and where the operational complexity matches what Stratum is built for."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {ORDER.map((slug) => {
              const c = CARD_COPY[slug];
              const visual = INDUSTRY_VISUALS[slug];
              return (
                <div key={slug} data-reveal className="card flex flex-col gap-5">
                  {visual && <CardMedia visual={visual} />}
                  <div className="flex flex-col gap-4">
                    <h2 className="font-display text-3xl text-ink-bright">{NAMES[slug]}</h2>
                    <p className="text-sm leading-relaxed text-ink-dim">{c.blurb}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-ink-dim">
                          {t}
                        </span>
                      ))}
                    </div>
                    <ArrowLink href={`/industries/${slug}`}>Explore {NAMES[slug]}</ArrowLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-industry value */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Cross-industry value"
            kicker="Common ground"
            title="What every industry we serve has in common."
            lede="Different verticals, same shape of problem: operational complexity, uptime pressure, risk exposure, and limited internal IT depth. Stratum is built for exactly that pattern."
          />
          <div data-reveal>
            <FeatureGrid
              cols={4}
              items={[
                { title: "Downtime hurts operations", body: "Support must be responsive during business hours — across every site and shift." },
                { title: "Environment complexity", body: "Users, devices, vendors, printers, servers, backups, networks, and sites — all at once." },
                { title: "Decision-making gap", body: "Leaders need clear answers without technical confusion." },
                { title: "Risk exposure", body: "Security, backup, and continuity gaps create avoidable business risk." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Next-wave industries */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Next-wave industries"
            kicker="Where we extend naturally"
            title="Other verticals we already serve well."
            lede="Industries where Stratum's structure and stewardship apply — and where dedicated pages will follow."
          />
          <div data-reveal>
            <FeatureGrid
              cols={4}
              items={[
                { title: "Accounting & Bookkeeping", body: "Uptime, sensitive data, security, and seasonal continuity pressure." },
                { title: "Transportation & Logistics", body: "Dispatch, warehouse, office, mobile, and multi-role operations." },
                { title: "Nonprofits & Associations", body: "Where stewardship, simplicity, and dependable support matter." },
                { title: "Real Estate & Property", body: "Multi-site, communication-heavy, vendor-heavy operating environments." },
              ]}
            />
          </div>
        </div>
      </section>

      <CTABand
        title="Don't see your industry? Reach out anyway."
        body="The pattern Stratum is built for shows up in more industries than the ones listed here. A short conversation tells us — and you — if there's a fit."
      />
    </>
  );
}
