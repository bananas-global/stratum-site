"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLink } from "../ui";

const INDUSTRIES = [
  {
    tab: "Automotive Dealerships",
    title: "IT Support for Automotive Dealerships",
    desc: "Dealerships run on uptime. Sales floors, service bays, finance offices, and back-office systems all depend on reliable technology running together. We keep every part of the operation connected, supported, and secure.",
    points: [
      "Multi-department complexity — sales, service, parts, finance, and management all need reliable systems",
      "Vendor and DMS coordination handled so your team can focus on customers",
      "Network stability across showrooms, service lanes, and Wi-Fi for staff and guests",
      "Proactive maintenance that prevents downtime during high-traffic hours",
      "Security controls that protect customer data and financial records",
    ],
    tags: ["Managed IT", "Network & Infrastructure", "Cybersecurity", "Vendor Coordination", "Proactive Maintenance"],
  },
  {
    tab: "Medical & Dental Clinics",
    title: "IT Support for Medical & Dental Clinics",
    desc: "Clinics cannot afford downtime or security gaps. Patient data, booking systems, and compliance requirements demand a technology partner who takes responsibility seriously and acts before problems happen.",
    points: [
      "Uptime reliability for booking, billing, and clinical systems patients depend on daily",
      "Data security and access controls that protect sensitive patient records",
      "Backup and recovery readiness so the clinic stays operational if something goes wrong",
      "Plain-language guidance on compliance and cyber-insurance requirements",
      "Dependable support with clear accountability — no runaround when something breaks",
    ],
    tags: ["Managed IT", "Cybersecurity", "Backup & Recovery", "Compliance Readiness", "Microsoft 365"],
  },
  {
    tab: "Law Firms & Legal Services",
    title: "IT Support for Law Firms & Legal Services",
    desc: "Law firms operate on trust, document access, and continuity. A single incident — lost files, a compromised account, or hours of downtime — can have serious professional consequences. We protect the environment that protects your clients.",
    points: [
      "Document access and file security built around how legal teams actually work",
      "Strong email security and access controls to protect sensitive client communications",
      "Backup readiness so matter files and records are never truly at risk",
      "Clear accountability and direct communication — the same standards you hold yourself to",
      "Technology stewardship aligned with the long-term needs of the firm",
    ],
    tags: ["Managed IT", "Cybersecurity", "Email Security", "Backup & Recovery", "Microsoft 365"],
  },
  {
    tab: "Construction & AEC",
    title: "IT Support for Construction & AEC Firms",
    desc: "Construction businesses run across offices, job sites, and field crews simultaneously. Technology has to work everywhere — and it has to keep up as teams scale, projects shift, and subcontractors come and go.",
    points: [
      "Office and field support that covers mobile devices, site connectivity, and back-office systems",
      "Fast, structured onboarding and offboarding for crews and subcontractors",
      "Project data security and access managed cleanly across roles and locations",
      "Vendor and software coordination for estimating, project management, and accounting tools",
      "Site complexity managed proactively — not reactively when a deadline is at risk",
    ],
    tags: ["Managed IT", "Network & Infrastructure", "Business Systems", "Mobile & Field Support", "Vendor Coordination"],
  },
  {
    tab: "Manufacturing & Industrial",
    title: "IT Support for Manufacturing & Industrial Operations",
    desc: "Manufacturing environments involve high device counts, multiple sites, operational systems, and uptime pressure across the floor and back office. Structure and stability are not optional — they are built into every engagement.",
    points: [
      "Structured support across workstations, servers, and operational systems at every site",
      "Network segmentation and infrastructure stability that keeps production running",
      "Security controls and monitoring that account for operational technology environments",
      "Standards-based device lifecycle management and replacement planning",
      "Long-term stewardship aligned with how the operation is growing and changing",
    ],
    tags: ["Managed IT", "Network & Infrastructure", "Cybersecurity", "Multi-Site Support", "Lifecycle Planning"],
  },
];

export default function IndustriesTabs() {
  const [active, setActive] = useState(0);
  const cur = INDUSTRIES[active];

  return (
    <div data-reveal className="grid gap-6 md:grid-cols-[0.8fr_1.4fr] md:gap-10">
      {/* Tab list */}
      <div className="flex flex-col">
        {INDUSTRIES.map((ind, i) => (
          <button
            key={ind.tab}
            type="button"
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`border-b border-line py-4 text-left font-display text-2xl transition-colors md:text-3xl ${
              active === i ? "text-ink-bright" : "text-ink-faint hover:text-ink-dim"
            }`}
          >
            {ind.tab}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="rounded-lg border border-line-soft bg-surface p-6 md:p-8">
        <div className="relative mb-6 aspect-[16/7] overflow-hidden rounded-md border border-line-soft bg-gradient-to-br from-surface-2 to-black">
          <Image
            src="/bananas/industries-structure-bg.webp"
            alt=""
            fill
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-cover object-center opacity-80"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-brand/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ink-dim backdrop-blur">
            {cur.tab}
          </div>
        </div>
        <h3 className="font-display text-3xl text-ink-bright">{cur.title}</h3>
        <p className="mt-3 text-ink-dim">{cur.desc}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {cur.points.map((p) => (
            <li key={p} className="flex gap-3 text-sm text-ink-dim">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {cur.tags.map((t) => (
            <span key={t} className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-ink-dim">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <ArrowLink href="/industries">See all industries</ArrowLink>
        </div>
      </div>
    </div>
  );
}
