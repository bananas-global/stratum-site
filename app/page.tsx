import type { Metadata } from "next";
import Image from "next/image";
import CinematicHero from "@/components/home/CinematicHero";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import IndustriesTabs from "@/components/home/IndustriesTabs";
import CTABand from "@/components/CTABand";
import { SectionHeader, HowSteps, OutcomeStrip } from "@/components/sections";
import { Button, BracketLabel } from "@/components/ui";
import { jsonLd, orgGraph, websiteGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stratum | Managed IT & Cybersecurity for Growing Businesses",
  description:
    "Stratum is a technology company for growing organizations — structured service across support, continuity, and the systems that move your business forward.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Stratum | Managed IT & Cybersecurity for Growing Businesses",
    description:
      "Technology built for what's next — structured service across support, continuity, and business systems.",
    url: "/",
  },
};

const localBusiness = {
  "@type": "ProfessionalService",
  "@id": "https://stratumtech.ca/#localbusiness",
  name: "Stratum",
  url: "https://stratumtech.ca/",
  telephone: "+1-855-200-0076",
  priceRange: "$$",
  image: "https://stratumtech.ca/og-image.png",
  description: "Structured technology services for growing organizations.",
  address: { "@type": "PostalAddress", addressCountry: "CA" },
  areaServed: { "@type": "Country", name: "Canada" },
  knowsAbout: [
    "Managed IT Services",
    "Cybersecurity",
    "Business Systems",
    "ERP",
    "CRM",
    "Backup and Disaster Recovery",
    "Microsoft 365",
    "Network and Infrastructure",
    "Proactive Maintenance",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Stratum Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Managed IT", description: "Ongoing support, maintenance, monitoring, and oversight of the systems your business depends on every day." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cybersecurity", description: "Layered protection, recovery readiness, and clearer control across users, endpoints, backups, and access." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Systems", description: "ERP, CRM, automation, and AI enablement aligned with how your business actually operates." } },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([orgGraph, localBusiness, websiteGraph])} />

      <CinematicHero />

      <ServicesShowcase />

      {/* Missing middle positioning */}
      <section className="section relative overflow-hidden bg-bg">
        <div className="pointer-events-none absolute inset-0 opacity-65">
          <Image
            src="/bananas/missing-middle-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.18),rgba(0,0,0,0.88)_72%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/50 to-bg" />
        </div>
        <div className="container">
          <div data-reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <BracketLabel>Who Stratum is for</BracketLabel>
            <h2 className="display-2 text-ink-bright">Built for the structural missing middle.</h2>
            <p className="max-w-2xl text-lg font-light text-ink-dim">
              Most businesses are too complex for break-fix IT and too small to justify deep internal IT teams. Stratum
              is built for exactly that gap — organizations that need real managed technology without enterprise
              overhead.
            </p>
            <Button href="/why-stratum" variant="ghost">Why Stratum</Button>
          </div>
          <div data-reveal className="mt-16">
            <OutcomeStrip
              items={[
                { value: "—", label: "Clients served", sub: "To be confirmed" },
                { value: "—", label: "Years in operation", sub: "To be confirmed" },
                { value: "—", label: "Uptime / response SLA", sub: "To be confirmed" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Who we work with"
            title="Technology built around how your industry operates."
            lede="Managed IT and cybersecurity for the industries where operational complexity is highest and the cost of unreliable technology is real — automotive dealerships, medical and dental clinics, law firms, construction and AEC firms, and manufacturing operations."
          />
          <IndustriesTabs />
        </div>
      </section>

      {/* How we work */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Our approach"
            title="Structured partnership from day one."
            lede="We do not just react to issues. We work to make the environment easier to support and easier to trust over time."
          />
          <div data-reveal>
            <HowSteps
              steps={[
                { n: "01", title: "Analyze", body: "We start by reviewing your current systems, support history, documentation gaps, and operating complexity before recommending anything." },
                { n: "02", title: "Engage", body: "We size the engagement around actual usage, endpoints, servers, backups, and risk — not just user count. The package fits your environment, not the other way around." },
                { n: "03", title: "Support", body: "Client Support is one of our Service Department Teams tailored to servicing the ongoing needs and maintenance of your business." },
                { n: "04", title: "Success", body: "Client Success is our business continuity and projects team — keeping your business oriented to the future and solving your most complex technological needs." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader eyebrow="What clients say" title="Real outcomes from real businesses." />
          <div data-reveal className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <figure key={i} className="card flex flex-col justify-between gap-8">
                <blockquote className="font-display text-2xl leading-snug text-ink">
                  “A structured, security-aware partner that takes responsibility for the whole environment.”
                </blockquote>
                <figcaption className="flex flex-col">
                  <span className="font-medium text-ink-bright">Client Name</span>
                  <span className="text-sm text-ink-faint">Title · Industry</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="If your IT feels reactive, inconsistent, or difficult to trust — let's talk."
        body="No pressure, no jargon. A straightforward conversation about what a more structured environment could look like for your business."
      />
    </>
  );
}
