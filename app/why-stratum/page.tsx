import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero, ScopeGrid, FeatureGrid, OutcomeStrip, SectionHeader } from "@/components/sections";
import { Button } from "@/components/ui";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";
import { PHASE_2_ROUTES_ENABLED } from "@/lib/phase";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Why Stratum — Built for the Structural Missing Middle",
    description:
      "Stratum is the structured, security-aware technology partner for businesses too complex for break-fix and too small to justify deep internal IT. See how the 5S lens shapes how we work.",
    path: "/why-stratum",
    ogTitle: "Why Stratum — Built for the Structural Missing Middle",
    ogDescription:
      "The structured, security-aware technology partner for businesses too complex for break-fix and too small to justify deep internal IT.",
  }),
  robots: { index: false, follow: false },
};

const PILLARS = [
  { name: "Structure", body: "We organize technology, process, support, and accountability so clients are not operating in chaos.", gem: "/images/gem-structure.webp" },
  { name: "Security", body: "We protect clients from cyber risk, operational disruption, data loss, and avoidable exposure.", gem: "/images/gem-security.webp" },
  { name: "Stability", body: "We build and maintain dependable systems that reduce downtime, surprises, and reactive firefighting.", gem: "/images/gem-stability.webp" },
  { name: "Simplicity", body: "We make technology easier to understand, easier to use, and easier to make decisions around.", gem: "/images/gem-simplicity.webp" },
  { name: "Stewardship", body: "We act as a long-term technology partner responsible for protecting the client's best interests.", gem: "/images/gem-stewardship.webp" },
];

const TABLE = {
  cols: ["Break-fix IT", "Internal IT team", "Stratum"],
  rows: [
    { label: "Operating model", cells: ["Reactive, hourly", "In-house, fixed cost", "Structured managed partnership"] },
    { label: "Accountability", cells: ["By ticket", "By role", "By environment"] },
    { label: "Security posture", cells: ["Ad-hoc", "Depends on hire", "Layered + reviewed"] },
    { label: "Cost shape", cells: ["Spiky", "High fixed", "Predictable"] },
    { label: "Long-term planning", cells: ["None", "Available, if staffed for it", "Built in"] },
  ],
};

export default function WhyStratum() {
  if (!PHASE_2_ROUTES_ENABLED) notFound();

  const ld = {
    "@type": "WebPage",
    "@id": "https://www.stratumtech.ca/why-stratum#webpage",
    url: "https://www.stratumtech.ca/why-stratum",
    name: "Why Stratum",
    description:
      "Why Stratum exists, who we are built for, and how the 5S lens (Structure, Security, Stability, Simplicity, Stewardship) shapes how we work.",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://www.stratumtech.ca/#website" },
    publisher: { "@id": "https://www.stratumtech.ca/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Why Stratum", path: "/why-stratum" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Why Stratum" }]}
        eyebrow="Why Stratum"
        title="Built for the structural missing middle."
        lede="Most growing businesses are too complex for break-fix IT and too small to justify deep internal IT teams. Stratum is built for exactly that gap — organizations that need real managed technology without enterprise overhead."
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Who Stratum is for */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="Who Stratum is for"
            title={`If the choice between "fix it when it breaks" and "hire a full IT team" feels wrong — that's the gap we fill.`}
            lede="We assess fit based on environment, not seat count. Support demand, devices, servers, backups, network and site complexity, licenses, risk exposure, and account-management needs all matter more than a single number."
          />
          <div data-reveal>
            <ScopeGrid
              cols={4}
              items={[
                { label: "Operationally complex", sub: "Multiple departments, sites, or roles that depend on systems working together." },
                { label: "Growing, not just running", sub: "Adding people, sites, or capabilities and feeling the lack of structure." },
                { label: "Leadership stretched on IT", sub: "Needing a partner who owns the technology call list — not another person to escalate to." },
                { label: "Security-aware", sub: "Already feeling pressure from customers, insurers, or compliance bodies." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* The lens — 5S pillars with gems */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-14">
          <SectionHeader
            eyebrow="The lens"
            title="Every decision filtered through the same five commitments."
            lede="Structure, Security, Stability, Simplicity, and Stewardship is not a marketing tagline. It is the filter for our service model, proposals, sales conversations, and internal decisions."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p) => (
              <div key={p.name} data-reveal className="flex flex-col items-center gap-4 text-center">
                <Image
                  src={p.gem}
                  alt=""
                  aria-hidden
                  width={120}
                  height={120}
                  className="h-24 w-24 object-contain drop-shadow-[0_0_30px_rgba(125,52,255,0.25)]"
                />
                <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">{p.name}</h3>
                <p className="text-sm leading-relaxed text-ink-dim">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Stratum compares */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How Stratum compares"
            title="Stratum is not a break-fix shop — and not an internal IT team."
          />
          <div data-reveal className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-4 text-sm font-medium text-ink-faint" />
                  {TABLE.cols.map((c, i) => (
                    <th
                      key={c}
                      className={`p-4 font-display text-[0.9375rem] leading-[1.3125rem] ${i === 2 ? "text-brand-light" : "text-ink-dim"}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.rows.map((r) => (
                  <tr key={r.label} className="border-b border-line-soft">
                    <td className="p-4 text-sm font-medium text-ink-bright">{r.label}</td>
                    {r.cells.map((cell, i) => (
                      <td key={i} className={`p-4 text-sm ${i === 2 ? "text-ink-bright" : "text-ink-dim"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ink-faint">Comparison rows are directional, not absolute.</p>
        </div>
      </section>

      {/* How we engage */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How we engage as a partner"
            title="Account management and advisory are part of the engagement — not a separate add-on."
            lede="Stratum is built to be a long-term technology partner. That means someone is paying attention to your environment between tickets — looking ahead at lifecycle, risk, budget, and roadmap — and bringing it back to leadership in plain language."
          />
          <div data-reveal>
            <FeatureGrid
              cols={4}
              items={[
                { title: "Roadmap reviews", body: "Scheduled conversations about what is coming up — replacements, upgrades, risk items — so nothing surprises the budget." },
                { title: "Lifecycle planning", body: "Devices, servers, network gear, and licenses tracked against end-of-life and replacement windows." },
                { title: "Risk & gap visibility", body: "Security, compliance, backup, and access gaps surfaced before they become incidents." },
                { title: "Leadership briefings", body: "Plain-language summaries leadership can act on — without translating tickets and tooling." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* How engagements are sized */}
      <section className="section bg-surface">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="How engagements are sized"
            title="We size around the environment — not the user count."
            lede="Pricing by seats is convenient for vendors and inaccurate for clients. Two businesses with the same headcount can have very different operating realities. Stratum sizes around what actually drives the work:"
          />
          <div data-reveal>
            <FeatureGrid
              items={[
                { title: "Support demand", body: "How often the team actually needs help, and what kinds of help." },
                { title: "Devices & endpoints", body: "Workstations, laptops, mobile, printers, peripherals — managed across their lifecycle." },
                { title: "Servers & infrastructure", body: "What runs the business — on-prem, cloud, or both — and how much oversight it needs." },
                { title: "Backups & recovery", body: "Scope of protection and recovery expectations relative to operational risk." },
                { title: "Network & site complexity", body: "Single office, multiple sites, field crews, guest networks, OT segments." },
                { title: "Security & risk exposure", body: "Sensitivity of data, customer expectations, insurance and compliance posture." },
              ]}
            />
          </div>
          <div data-reveal className="grid gap-6 rounded-lg border border-line-soft bg-bg p-8 md:grid-cols-[1.6fr_1fr] md:items-center md:p-10">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">The shape of the engagement comes from your operation.</h3>
              <p className="text-ink-dim">
                We talk through these inputs in the first conversation. The structure of the partnership follows from what
                we find — not from a tier you fit into.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Button href="/contact">Start the conversation</Button>
            </div>
          </div>
        </div>
      </section>

      {/* The numbers */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-10">
          <SectionHeader eyebrow="The numbers" title="Built on a real client base, not a brand new shingle." />
          <div data-reveal>
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

      {/* Positioning statement */}
      <section className="section bg-black">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span data-reveal className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
            Working positioning statement
          </span>
          <h2 data-reveal className="display-2 max-w-4xl text-balance text-ink-bright">
            Stratum brings Structure, Security, Stability, Simplicity, and Stewardship to growing organizations that need
            technology they can trust.
          </h2>
        </div>
      </section>

      <CTABand
        title="If you are in the missing middle — let's talk about what structured looks like for you."
        body="A direct conversation about your environment, your gaps, and what a real technology partner could change."
      />
    </>
  );
}
