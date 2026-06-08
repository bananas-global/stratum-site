import type { Metadata } from "next";
import Image from "next/image";
import CinematicHero from "@/components/home/CinematicHero";
import IndustriesTabs from "@/components/home/IndustriesTabs";
import CTABand from "@/components/CTABand";
import CountUp from "@/components/CountUp";
import { SectionHeader, HowSteps } from "@/components/sections";
import { Button, BracketLabel, ArrowLink } from "@/components/ui";
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

      {/* Trusted foundations — partner / platform logos */}
      <section className="section-sm bg-black">
        <div className="container flex flex-col items-center gap-12 text-center">
          <div data-reveal className="flex max-w-2xl flex-col items-center gap-4">
            <BracketLabel>Trusted foundations</BracketLabel>
            <p className="text-ink-dim md:text-lg">
              Stratum builds and supports client environments using proven platforms across security, backup, systems,
              and day-to-day operations.
            </p>
          </div>
          {/* Animated marquee — TODO: add Cove (public/logos/cove.svg) to the list when supplied */}
          <div
            data-reveal
            className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          >
            <div className="flex w-max animate-marquee items-center gap-x-20 pr-20 group-hover:[animation-play-state:paused]">
              {/* per-logo height (px) tuned for optical balance — not raw bounding box.
                  List rendered twice in order (A…E, A…E) so the -50% loop is seamless. */}
              {(() => {
                const logos = [
                  { name: "Microsoft", src: "/logos/microsoft.svg", h: 26 },
                  { name: "SentinelOne", src: "/logos/sentinelone.svg", h: 22 },
                  { name: "N-able", src: "/logos/n-able.svg", h: 19 },
                  { name: "KnowBe4", src: "/logos/knowbe4.svg", h: 22 },
                  { name: "IT Glue", src: "/logos/it-glue.svg", h: 34 },
                ];
                return logos.concat(logos);
              })()
                .map((logo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${logo.name}-${i}`}
                    src={logo.src}
                    alt={logo.name}
                    aria-hidden={i % 2 === 1}
                    style={{ height: logo.h }}
                    className="w-auto shrink-0 object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Stratum is — identity + proof */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          {/* Eyebrow + rule */}
          <div data-reveal className="flex flex-col gap-6">
            <BracketLabel>Who Stratum is</BracketLabel>
            <div className="h-px w-full bg-line" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16">
            {/* Left — identity card */}
            <div data-reveal className="relative min-h-[26rem] overflow-hidden rounded-lg border border-line-soft lg:min-h-full">
              <Image
                src="/images/stratum-geometric-05.webp"
                alt="Dark structural surface representing Stratum's technology foundation."
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
              <div className="relative flex h-full flex-col justify-between gap-10 p-8 md:p-10">
                <div className="max-w-[9ch] text-balance font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-ink-bright">
                  Built for the missing middle
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-lg tracking-[0.35em] text-brand-light" aria-label="Five out of five">
                    ★★★★★
                  </div>
                  <div className="font-display text-2xl text-ink-bright">In operation since 2007</div>
                  <p className="max-w-xs text-sm leading-relaxed text-ink-dim">
                    Managed IT and cybersecurity for the Lower Mainland, BC — built on structure, not break-fix.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — statement + proof stats */}
            <div className="flex flex-col gap-10">
              <h2
                data-reveal
                className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.2] tracking-[-0.02em] text-ink-bright"
              >
                A structured, security-aware technology partner — built for the businesses too complex for break-fix IT
                and too small for a full internal team.
              </h2>

              <div data-reveal className="flex flex-col">
                {[
                  { value: "19+", label: "Years in operation", sub: "Serving the Lower Mainland since 2007." },
                  { value: "140+", label: "Businesses supported", sub: "Across automotive, medical, legal, construction, and manufacturing." },
                  { value: "99.9%", label: "Uptime delivered", sub: "Across managed and monitored environments." },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-start gap-6 border-t border-line-soft/40 py-6 first:border-t-0 first:pt-0"
                  >
                    <CountUp
                      value={stat.value}
                      className="min-w-[5.5rem] font-display text-[clamp(2rem,3vw,2.75rem)] leading-none text-ink-bright"
                    />
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="font-body text-[1rem] font-bold uppercase leading-tight tracking-[0.02em] text-ink-bright/40">
                        {stat.label}
                      </div>
                      <p className="text-sm leading-relaxed text-ink-dim">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div data-reveal>
                <ArrowLink href="/about">How Stratum Works</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustriesTabs />

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
