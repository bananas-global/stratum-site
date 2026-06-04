"use client";

import { useState } from "react";
import { ArrowLink } from "./ui";

type Post = { tag: string; date: string; title: string; excerpt: string; href: string; featured?: boolean };

const POSTS: Post[] = [
  {
    tag: "Managed IT",
    date: "May 2026",
    href: "/insights/what-is-managed-it",
    title: 'What Does "Managed IT" Actually Mean for a Growing Business?',
    excerpt:
      "Most businesses use the term without a clear definition. Here's how to think about it — and what it should look like in practice for an organization that is too complex for break-fix and too small to justify a full internal IT team.",
    featured: true,
  },
  {
    tag: "Cybersecurity",
    date: "May 2026",
    href: "/insights/cyber-insurance-questionnaires",
    title: "Why Cyber Insurance Questionnaires Are Getting Harder to Answer",
    excerpt:
      "Insurers are asking more detailed security questions — and the answers affect your premiums, coverage, and credibility. Here's what they're looking for.",
  },
  {
    tag: "Business Systems",
    date: "April 2026",
    href: "/insights/erp-timing",
    title: "When Is the Right Time to Implement an ERP?",
    excerpt:
      'The answer is rarely "when you\'re big enough." Here\'s how to recognize the operational signals that actually indicate readiness — before the pain becomes unavoidable.',
  },
  {
    tag: "Cybersecurity",
    date: "April 2026",
    href: "/insights/backup-vs-recovery",
    title: "Backup and Recovery Are Not the Same Thing",
    excerpt:
      "Most businesses have backups. Fewer can actually recover. The difference matters most at the worst possible moment — here's how to close the gap.",
  },
  {
    tag: "Industries",
    date: "March 2026",
    href: "/insights/it-for-dealerships",
    title: "IT in an Automotive Dealership Is Not Like IT Anywhere Else",
    excerpt:
      "DMS systems, OEM portals, service lane uptime, showroom Wi-Fi, finance office security — dealership IT has its own complexity. Here's how to think about it.",
  },
  {
    tag: "Industries",
    date: "March 2026",
    href: "/insights/missing-middle",
    title: "The Structural Missing Middle: Why So Many Businesses Get IT Wrong",
    excerpt:
      "Too complex for break-fix. Too small for a full internal team. Most growing businesses are stuck in the gap — and most IT providers don't actually serve it.",
  },
];

const FILTERS = ["All", "Managed IT", "Cybersecurity", "Business Systems", "Industries"];

function Card({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <a
      href={post.href}
      data-reveal
      className={`card group flex flex-col gap-4 hover:-translate-y-1 ${featured ? "md:col-span-2 md:flex-row md:gap-8" : ""}`}
    >
      {featured && (
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-md border border-line-soft bg-gradient-to-br from-surface-2 to-black md:w-1/2">
          <span className="text-xs uppercase tracking-wider text-ink-faint">Featured insight — image</span>
        </div>
      )}
      <div className={`flex flex-col gap-3 ${featured ? "md:w-1/2 md:justify-center" : ""}`}>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
          <span className="text-brand-light">{post.tag}</span>
          <span className="text-ink-faint">{post.date}</span>
        </div>
        <h3 className={`font-display text-ink-bright ${featured ? "text-3xl" : "text-2xl"}`}>{post.title}</h3>
        <p className="text-sm leading-relaxed text-ink-dim">{post.excerpt}</p>
        <span className="link-arrow mt-1 text-sm text-ink-bright">
          <span>Read more</span>
        </span>
      </div>
    </a>
  );
}

export default function InsightsGrid() {
  const [filter, setFilter] = useState("All");
  const visible = POSTS.filter((p) => filter === "All" || p.tag === filter);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink-faint">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
              filter === f ? "border-brand bg-brand/15 text-ink-bright" : "border-line text-ink-dim hover:text-ink-bright"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((p) => (
          <Card key={p.href} post={p} featured={p.featured && filter === "All"} />
        ))}
      </div>

      <p className="rounded-md border border-dashed border-line bg-black/30 p-6 text-sm text-ink-faint">
        Article content is placeholder. Wire up a CMS or MDX before launch.
      </p>
    </div>
  );
}
