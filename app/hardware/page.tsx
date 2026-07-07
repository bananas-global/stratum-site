import type { Metadata } from "next";
import { PageHero, HowSteps, ScopeGrid, SectionHeader } from "@/components/sections";
import { Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Hardware — Custom, Turnkey IT Equipment",
  description:
    "Stratum specs, supplies, and configures business hardware — secured and ready to work the day it arrives. One partner from purchase to deployment to lifecycle.",
  path: "/hardware",
  ogTitle: "Hardware — Custom, Turnkey IT Equipment | Stratum",
  ogDescription:
    "Custom-built hardware, configured and secured before it ships — a genuinely turnkey solution for growing organizations.",
});

const SUPPLY = [
  { label: "Workstations & laptops", sub: "Standardized, business-grade devices spec'd to the role — not whatever was on sale.", image: "/images/hardware/hw-workstations.webp" },
  { label: "Servers & infrastructure", sub: "On-prem and hybrid compute sized for how your operation actually runs.", image: "/images/hardware/hw-servers.webp" },
  { label: "Networking", sub: "Firewalls, switches, and Wi-Fi built for a secure, segmented network.", image: "/images/hardware/hw-networking.webp" },
  { label: "Backup & storage", sub: "Appliances and storage aligned to your recovery plan, not bought in isolation.", image: "/images/hardware/hw-backup.webp" },
  { label: "Peripherals & accessories", sub: "Monitors, docks, and the rest — kept to one consistent, supportable standard.", image: "/images/hardware/hw-peripherals.webp" },
  { label: "Mobile & field devices", sub: "Tablets and rugged hardware configured for work beyond the office.", image: "/images/hardware/hw-mobile.webp" },
];

// 5S hardware standard — mapped from the brand lens. Label + supporting line.
export default function HardwarePage() {
  const ld = {
    "@type": "Service",
    "@id": "https://stratumtech.ca/hardware#service",
    name: "Hardware & Procurement",
    serviceType: "IT hardware procurement, configuration, and deployment",
    url: "https://stratumtech.ca/hardware",
    description:
      "Custom-spec'd business hardware, configured and secured before deployment — a turnkey solution managed by one accountable technology partner.",
    provider: { "@id": "https://stratumtech.ca/#organization" },
    areaServed: { "@type": "Country", name: "Canada" },
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://stratumtech.ca/#website" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Hardware", path: "/hardware" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Hardware" }]}
        eyebrow="Hardware"
        title="Custom-built hardware, delivered turnkey."
        lede="Most providers leave you to source your own equipment, then support whatever shows up. Stratum specs, supplies, and configures the hardware your business runs on — secured and ready to work the day it arrives. One partner from purchase to deployment to lifecycle."
        backgroundVisual={{
          src: "/images/bg-hero-hardware.webp",
          alt: "",
        }}
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Why hardware is part of the partnership — the turnkey thesis */}
      <section className="section bg-surface">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div data-reveal className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Why we supply hardware"
              title="Turnkey means nothing left for you to figure out."
            />
          </div>
          <div data-reveal className="flex flex-col gap-5">
            <p className="text-lg font-light leading-relaxed text-ink-dim">
              A managed environment is only as dependable as the equipment underneath it. When hardware is bought ad hoc —
              mismatched specs, no warranty tracking, no standard image — every device becomes its own support problem.
            </p>
            <p className="text-lg font-light leading-relaxed text-ink-dim">
              Stratum closes that gap. We recommend the right equipment for how your team actually works, stage and secure
              it before deployment, and stand behind it through its full lifecycle. You approve a solution, not a parts
              list.
            </p>
          </div>
        </div>
      </section>

      {/* What turnkey delivery looks like */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How it works"
            title="What turnkey delivery looks like."
            lede="The same structured operating model as the rest of Stratum — applied to the hardware your business depends on."
          />
          <div data-reveal>
            <HowSteps
              steps={[
                { n: "01", title: "Spec & recommend", body: "We match equipment to your real workload, environment, and budget — not a vendor's margin." },
                { n: "02", title: "Procure & stage", body: "We source, track warranties, and stage devices so nothing arrives as a loose box of parts." },
                { n: "03", title: "Configure & secure", body: "Every device is imaged, hardened, and enrolled in management before it reaches a desk." },
                { n: "04", title: "Deploy & support", body: "We deploy onsite or ship ready-to-go, then support and plan replacements across the lifecycle." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* What Stratum supplies */}
      <section className="section section-light">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="What we supply"
            title="The full environment, from one source."
            lede="Everything your team touches — sourced to a standard, configured to your environment, and supported as part of the whole."
          />
          <div data-reveal>
            <ScopeGrid items={SUPPLY} cols={3} />
          </div>
        </div>
      </section>

      <CTABand
        title="Planning a refresh, a new office, or a fleet rollout?"
        body="Tell us what you're outfitting. We'll spec the right hardware and deliver it ready to work."
      />
    </>
  );
}
