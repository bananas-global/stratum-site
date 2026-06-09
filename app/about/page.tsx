import type { Metadata } from "next";
import { PageHero, FeatureGrid, HowSteps, SectionHeader, EditorialPanel } from "@/components/sections";
import { Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import StratumPillars from "@/components/StratumPillars";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Stratum — Operational Technology Partner",
  description:
    "About Stratum: a structured, security-aware managed IT partner for growing organizations. Our story, values, operating style, and leadership team.",
  path: "/about",
  ogTitle: "About Stratum — Operational Technology Partner",
  ogDescription: "Our story, values, and operating style as a structured managed IT partner for growing organizations.",
});

export default function AboutPage() {
  const ld = {
    "@type": "AboutPage",
    "@id": "https://stratumtech.ca/about#webpage",
    url: "https://stratumtech.ca/about",
    name: "About Stratum",
    description: "About Stratum — our story, values, operating style, and leadership team.",
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
          breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About Stratum"
        title="An operational technology partner for growing businesses."
        lede="Stratum is a structured, security-aware technology partner for organizations that need reliable systems, clear accountability, and long-term stewardship — without the overhead of an enterprise IT department."
        visual={{
          src: "/bananas/stratum-object-01.png",
          alt: "Segmented graphite Stratum object with purple light lines.",
          label: "Stewardship",
          caption: "A long-term partner responsible for the shape and health of the environment.",
          contain: true,
        }}
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Our story */}
      <section className="section bg-surface">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div data-reveal className="flex flex-col gap-6">
            <SectionHeader eyebrow="Our story" title="Stratum exists because the middle was missing." />
            <p className="text-lg font-light leading-relaxed text-ink-dim">
              Growing organizations kept ending up in the same place — too complex for break-fix IT, too small to justify
              deep internal IT teams, and underserved by generic MSP offers. We built Stratum to be the structured
              operational partner that actually fits this gap. Not a vendor selling tools. Not a help desk on standby. A
              partner responsible for the environment over time.
            </p>
          </div>
          <EditorialPanel
            visual={{
              src: "/bananas/missing-middle-bg.webp",
              alt: "Dark cinematic structural surface with subtle purple depth.",
              label: "The missing middle",
              caption: "A service model shaped for businesses between break-fix IT and a full internal team.",
            }}
          />
        </div>
      </section>

      {/* Values */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="What we operate by"
            title="Structure, Security, Stability, Simplicity, Stewardship."
            lede="The 5S lens is the filter for our service model, our proposals, our internal decisions, and how we show up for clients every day."
          />
          <div data-reveal>
            <FeatureGrid
              cols={4}
              items={[
                { title: "Plain language", body: "We translate technical issues into business decisions — without dumbing them down." },
                { title: "Direct communication", body: "Status updates, expectations, and tradeoffs are stated clearly, not hidden in tickets." },
                { title: "Long-term thinking", body: "We act as if we will be supporting your environment three and five years from now — because we plan to." },
                { title: "Calm under pressure", body: "Outages, incidents, and emergencies are handled with structure — not panic." },
              ]}
            />
          </div>
        </div>
      </section>

      <StratumPillars />

      {/* Operating style */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Operating style"
            title="Structured partnership from day one."
            lede="Whether you start with a single service or a full engagement, the operating model is the same."
          />
          <div data-reveal>
            <HowSteps
              steps={[
                { n: "01", title: "Understand", body: "Review systems, documentation, and operating complexity before recommending anything." },
                { n: "02", title: "Define scope", body: "Size the engagement around real usage, environment, and risk — not just user count." },
                { n: "03", title: "Deliver", body: "Clear accountability, structured process, proactive oversight, plain-language updates." },
                { n: "04", title: "Stay", body: "Lifecycle planning, roadmap reviews, and account management that look ahead." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="The team"
            title="People behind the partnership."
            lede="Stratum is led by an experienced team that has worked across managed services, cybersecurity, and business systems implementation."
          />
          <div data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line-soft bg-gradient-to-br from-surface-2 to-black">
                  <span className="text-xs uppercase tracking-wider text-ink-faint">Portrait</span>
                </div>
                <div>
                  <div className="heading-gradient font-display text-xl">Leadership Name</div>
                  <div className="text-sm text-ink-faint">Role / Title</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we show up */}
      <section className="section bg-black">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Accountable partnership"
            title="Structured service — remote and onsite when it matters."
            lede="Stratum is built for organizations that need a real technology partner, not a ticket queue in another time zone. We combine structured remote delivery with onsite work when the situation calls for it."
          />
          <div data-reveal>
            <FeatureGrid
              cols={4}
              items={[
                { title: "Structured delivery", body: "Clear ownership, documented environments, and an operating model your team can rely on — not ad hoc fixes." },
                { title: "Your working day", body: "Support aligned to when your business runs, with direct communication and plain-language updates." },
                { title: "Onsite when it matters", body: "Scheduled and emergency onsite work for what genuinely needs hands on the equipment." },
                { title: "Built for real operations", body: "Vendor coordination, insurance baselines, and compliance shaped around how businesses actually operate." },
              ]}
            />
          </div>
          <div data-reveal className="grid gap-6 rounded-lg border border-line-soft bg-surface p-8 md:grid-cols-[1.6fr_1fr] md:items-center md:p-10">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-2xl text-ink-bright">Want to see if we are a fit?</h3>
              <p className="text-ink-dim">
                Tell us about your environment and what you are trying to move forward. We will be direct about scope and
                next steps.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Button href="/contact">Talk With Stratum</Button>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        title="Want to know more before you reach out?"
        body="Take a closer look at our services and the industries we serve."
        ctaLabel="Explore Services"
        ctaHref="/services"
      />
    </>
  );
}
