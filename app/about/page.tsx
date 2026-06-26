import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, SectionHeader } from "@/components/sections";
import { ArrowLink, Button } from "@/components/ui";
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

const TEAM = [
  {
    name: "Austin Wollf",
    role: "Chief Executive Officer",
    photo: "/images/people/austin.png",
    linkedin: "https://www.linkedin.com/in/austinwollf/",
  },
  {
    name: "Nathan Chernoff",
    role: "Chief Marketing Officer",
    photo: "/images/people/nathan.png",
    linkedin: "https://www.linkedin.com/in/nathanchernoff/",
  },
] as const;

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

  const people = TEAM.map((person) => ({
    "@type": "Person",
    "@id": `https://stratumtech.ca/about#${person.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: person.name,
    jobTitle: person.role,
    image: `https://stratumtech.ca${person.photo}`,
    sameAs: [person.linkedin],
    worksFor: { "@id": "https://stratumtech.ca/#organization" },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          ld,
          ...people,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About Stratum"
        title="An operational technology partner for growing businesses."
        lede="Stratum is a structured, security-aware technology partner for organizations that need reliable systems, clear accountability, and long-term stewardship — without the overhead of an enterprise IT department."
        backgroundVisual={{
          src: "/images/stratum-bg-pattern.png",
          alt: "",
        }}
      >
        <Button href="/contact">Talk With Stratum</Button>
      </PageHero>

      {/* Our story */}
      <section className="bg-[#111112]">
        <div className="section pb-0">
          <div className="container">
            <div data-reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <SectionHeader center eyebrow="Market fit" title="The missing middle" />
              <p className="text-lg font-light leading-relaxed text-ink-dim">
                Growing organizations kept ending up in the same place — too complex for break-fix IT, too small to
                justify deep internal IT teams, and underserved by generic MSP offers. We built Stratum to be the
                structured operational partner that actually fits this gap. Not a vendor selling tools. Not a help desk
                on standby. A partner responsible for the environment over time.
              </p>
            </div>
          </div>
        </div>
        <Image
          src="/images/missing-middle.png"
          alt=""
          width={2752}
          height={1094}
          data-reveal
          className="block h-auto w-full"
        />
      </section>

      <StratumPillars />

      {/* Leadership */}
      <section className="section bg-bg">
        <div className="container flex flex-col gap-12">
          <SectionHeader
            eyebrow="The team"
            title="People behind the partnership."
            lede="Stratum is led by an experienced team that has worked across managed services, cybersecurity, and business systems implementation."
          />
          <div data-reveal className="grid max-w-2xl gap-6 sm:grid-cols-2">
            {TEAM.map((person, i) => (
              <div key={person.name} className="flex flex-col gap-4" data-reveal-delay={`${0.05 * i}`}>
                <div className="relative aspect-square overflow-hidden rounded-md border border-line-soft bg-gradient-to-br from-surface-2 to-black">
                  <Image
                    src={person.photo}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="heading-gradient font-display text-xl">{person.name}</div>
                  <div className="text-sm text-ink-faint">{person.role}</div>
                  <ArrowLink href={person.linkedin} className="mt-1 text-sm">
                    LinkedIn
                  </ArrowLink>
                </div>
              </div>
            ))}
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
