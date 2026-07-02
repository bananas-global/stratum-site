"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BracketLabel, Button } from "../ui";

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
    <section className="section relative z-10 bg-black pt-[12vh]">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-[0.55fr_1fr]">
          {/* Header */}
          <div data-reveal className="flex flex-col justify-between gap-6 py-6 md:pr-4">
            <div className="flex flex-col gap-5">
              <BracketLabel>What we do</BracketLabel>
              <h2 className="font-display text-[clamp(1.3125rem,2.25vw,1.875rem)] leading-[1.05] tracking-[-0.04em]">
                Structured technology services for complex businesses.
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-lg font-light text-ink-dim">
                Stratum operates as an operational technology partner — not just another IT company.
              </p>
              <Button href="/services" className="w-fit">See all services</Button>
            </div>
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
              {/* links — desktop hover-list (mobile uses the cards below) */}
              <div className="hidden md:flex md:flex-col">
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
                      <span className="font-display text-[1.40625rem] leading-[1.6875rem] text-ink-bright transition-colors group-hover:text-brand-light md:text-[2.25rem] md:leading-none">
                        {s.name}
                      </span>
                    </div>
                    <div
                      className={`ml-auto grid max-w-lg overflow-hidden text-left transition-all duration-500 ${
                        active === i ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="text-sm leading-relaxed text-ink-dim text-right md:text-base">{s.body}</p>
                        <div className="mt-4 flex flex-wrap justify-end gap-x-0 gap-y-2">
                          {s.features.map((f, fi) => (
                            <span key={f} className="flex items-center gap-0">
                              <span className="chip">{f}</span>
                              {fi < s.features.length - 1 && <span className="chip-dot mx-2" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* mobile cards — self-contained (the hover list above is desktop-only) */}
              <div className="flex flex-col gap-3 md:hidden">
                {SERVICES.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    className="flex flex-col gap-3 rounded-sm bg-white p-5 text-black"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-[1.125rem] leading-none">{s.name}</span>
                      <span className="text-xs tabular-nums text-black/40">{s.n}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-black/70">{s.body}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {s.features.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-black/[0.06] px-2.5 py-1 text-[11px] font-medium text-black/55"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
