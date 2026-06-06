"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { title: string; category: string; body: string; aliases?: string[] };

const CATEGORIES = ["Managed IT", "Cybersecurity", "Business Systems"] as const;

const ITEMS: Item[] = [
  { title: "Managed IT Support", category: "Managed IT", aliases: ["Help desk & support"], body: "Day-to-day support through a clear ticketing, dispatch, and escalation model — so problems are tracked, prioritized, and resolved through accountable channels instead of workarounds. Fewer recurring issues and less downtime, with one dependable place to turn when staff need help, and ongoing care for the environment beyond the ticket in front of us." },
  { title: "Network & Infrastructure", category: "Managed IT", aliases: ["Network & infrastructure"], body: "Core systems documented and maintained to a standard — networks, servers, firewalls, Wi-Fi, and remote access configured to reduce exposure and surprise outages. An environment that is easier to support and explain, with replacement and growth planned around where the business is headed — not only the issue showing up today." },
  { title: "Proactive Maintenance / Monitoring", category: "Managed IT", aliases: ["Monitoring"], body: "Scheduled maintenance rhythms, monitoring, and alert response with clear ownership — patching and updates that catch risks early and prevent avoidable failures. Less emergency work and more confidence in day-to-day operations, without needing to follow every technical detail, with the environment looked after before you have to ask." },
  { title: "Hardware / Procurement / Shop", category: "Managed IT", aliases: ["Device management"], body: "Standardized device selection, secure configuration before deployment, and lifecycle planning that reduces failures from unsupported or inconsistent equipment. A simpler buying and setup process for your team, with recommendations shaped by what fits the business — not what is easiest to sell." },
  { title: "Executive Advisory / Account Management", category: "Managed IT", aliases: ["Vendor coordination"], body: "Scattered priorities turned into a roadmap, budget, and clear next steps — including security, compliance, and lifecycle gaps surfaced before they become emergencies. Less reactive spending and aging-system surprises, with leadership getting a plain-language view of what matters, and a partner acting in your interest over time — not only when something breaks." },
  { title: "Cybersecurity Services", category: "Cybersecurity", aliases: ["Endpoint protection", "Identity & access", "Email security", "Compliance support"], body: "A defined security framework — MFA, endpoint protection, email security, patching, monitoring, and incident response — instead of a pile of disconnected tools. Less disruption from compromise and data loss, cyber risk translated into priorities you can act on, and protection for your operations, reputation, and long-term resilience." },
  { title: "Backup & Disaster Recovery", category: "Cybersecurity", aliases: ["Backup readiness"], body: "Clear scope for what is backed up, how often, where it lives, and how recovery is tested — protecting against data loss, ransomware, hardware failure, and human error. A business that stays recoverable when something goes wrong, recovery plans leadership can understand, and verification so you are not assuming protection you do not actually have." },
  { title: "Microsoft 365 / Cloud Services", category: "Business Systems", aliases: ["Microsoft 365"], body: "Users, licensing, permissions, email, files, and collaboration organized and secured — identity, sharing, and retention under control, with reliable access to the tools staff depend on every day. Practical guidance so the platforms you already pay for are configured and used the way your business needs." },
  { title: "ERP / CRM / AI / Automation Implementation", category: "Business Systems", aliases: ["ERP & CRM", "Automation", "AI enablement"], body: "Business systems, workflows, and data structured with proper access, controls, and governance from implementation onward. Less dependence on spreadsheets and tribal knowledge, processes staff and leadership can run with confidence, and modernization that builds durable value instead of adding complexity." },
  { title: "Projects / Migrations", category: "Business Systems", aliases: ["Projects"], body: "Major changes delivered with scope, documentation, and secure transitions across systems, servers, cloud, and networks — reducing disruption while the business keeps moving. A clear path through migrations and upgrades, fewer surprises along the way, and ownership from planning through handoff back to steady-state support." },
];

export default function ServiceCatalog({ initialQuery = "" }: { initialQuery?: string }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    setQuery(initialQuery);
    setFilter(null);
    setOpenIdx(0);
  }, [initialQuery]);

  useEffect(() => {
    const applyFilter = (query: string) => {
      setFilter(null);
      setQuery(query);
      setOpenIdx(0);
    };

    const applyFilterFromUrl = () => {
      const query = new URLSearchParams(window.location.search).get("serviceFilter");
      if (query) applyFilter(query);
    };

    function handleServiceCatalogFilter(event: Event) {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (!query) return;

      applyFilter(query);
    }

    applyFilterFromUrl();

    document.addEventListener("service-catalog-filter", handleServiceCatalogFilter);
    window.addEventListener("service-catalog-filter", handleServiceCatalogFilter);
    window.addEventListener("hashchange", applyFilterFromUrl);
    window.addEventListener("popstate", applyFilterFromUrl);
    return () => {
      document.removeEventListener("service-catalog-filter", handleServiceCatalogFilter);
      window.removeEventListener("service-catalog-filter", handleServiceCatalogFilter);
      window.removeEventListener("hashchange", applyFilterFromUrl);
      window.removeEventListener("popstate", applyFilterFromUrl);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((it) => {
      const matchCat = !filter || it.category === filter;
      const searchable = [it.title, it.category, it.body, ...(it.aliases ?? [])].join(" ").toLowerCase();
      const matchQ = !q || searchable.includes(q);
      return matchCat && matchQ;
    });
  }, [filter, query]);

  return (
    <div id="service-catalog" data-reveal className="scroll-mt-32 flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
              filter === null ? "border-brand bg-brand/15 text-ink-bright" : "border-line text-ink-dim hover:text-ink-bright"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
                filter === c ? "border-brand bg-brand/15 text-ink-bright" : "border-line text-ink-dim hover:text-ink-bright"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          aria-label="Search services"
          className="w-full max-w-xs rounded-sm border border-line bg-black/40 px-4 py-2 text-sm text-ink-bright placeholder:text-ink-faint focus:border-brand focus:outline-none sm:w-auto"
        />
      </div>

      {/* Accordion list */}
      <div className="flex flex-col overflow-hidden rounded-md border border-line-soft">
        {filtered.length === 0 && (
          <p role="status" className="bg-surface p-6 text-sm text-ink-faint">
            No services match your search or filter.
          </p>
        )}
        {filtered.map((it, i) => {
          const open = openIdx === i;
          return (
            <div key={it.title} className="border-b border-line-soft bg-surface last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open}
              >
                <span className="flex flex-col gap-1">
                  <span className="font-display text-xl text-ink-bright">{it.title}</span>
                  <span className="text-xs uppercase tracking-wider text-brand-light">{it.category}</span>
                </span>
                <span className={`text-ink-faint transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="min-h-0">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-ink-dim">{it.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
