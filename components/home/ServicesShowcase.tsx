"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BracketLabel, ArrowLink } from "../ui";

const SERVICES = [
  {
    n: "01",
    name: "Managed IT",
    href: "/services",
    body: "Ongoing support, maintenance, monitoring, and oversight of the systems your business depends on every day.",
    features: ["Help desk & support", "Device management", "Network & infrastructure", "Monitoring", "Vendor coordination"],
  },
  {
    n: "02",
    name: "Cybersecurity",
    href: "/services",
    body: "Layered protection, stronger recovery readiness, and clearer control across users, endpoints, backups, and access.",
    features: ["Endpoint protection", "Identity & access", "Email security", "Backup readiness", "Compliance support"],
  },
  {
    n: "03",
    name: "Business Systems",
    href: "/services",
    body: "ERP, CRM, automation, and AI enablement that aligns your systems with how the business actually operates.",
    features: ["ERP & CRM", "Microsoft 365", "Automation", "AI enablement", "Projects"],
  },
];

export default function ServicesShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="section bg-black">
      <div className="container-medium">
        <div className="grid gap-10 md:grid-cols-[0.55fr_1fr]">
          {/* Header */}
          <div data-reveal className="flex flex-col justify-between gap-6 py-6 md:pr-4">
            <div className="flex flex-col gap-5">
              <BracketLabel>What we do</BracketLabel>
              <h2 className="display-2 text-ink-bright">
                Structured technology services for complex businesses.
              </h2>
            </div>
            <p className="text-lg font-light text-ink-dim">
              Stratum operates as an operational technology partner — not just another IT company.
            </p>
          </div>

          {/* Interactive block */}
          <div data-reveal className="relative overflow-hidden rounded-md bg-surface p-6 md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-35">
              <Image
                src="/bananas/services-structure-bg.webp"
                alt=""
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-black/20" />
            </div>
            <div className="relative">
              {/* links */}
              <div className="flex flex-col">
                {SERVICES.map((s, i) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group border-b border-white/15 py-6 text-right transition-colors hover:text-brand-light"
                  >
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-base text-ink-dim transition-colors group-hover:text-brand-light">{s.n}</span>
                      <span className="font-display text-3xl text-ink-bright transition-colors group-hover:text-brand-light md:text-5xl">
                        {s.name}
                      </span>
                    </div>
                    <div
                      className={`ml-auto grid max-w-2xl overflow-hidden text-left transition-all duration-500 ${
                        active === i ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="text-sm leading-relaxed text-ink-dim md:text-base">{s.body}</p>
                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                          {s.features.map((f) => (
                            <span key={f} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-wide text-ink-faint backdrop-blur">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* mobile cards (always shown stacked) */}
              <div className="mt-6 flex flex-col gap-3 md:hidden">
                {SERVICES.map((s) => (
                  <div key={s.name} className="rounded-sm bg-white p-5 text-black">
                    <p className="text-sm text-black/80">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hairline my-10" />

        <div data-reveal className="grid gap-6 md:grid-cols-[0.5fr_1fr] md:items-center">
          <div />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-ink-dim md:max-w-sm">
              Each service area is built around business outcomes, not tool lists.
            </p>
            <ArrowLink href="/services">See all services</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
