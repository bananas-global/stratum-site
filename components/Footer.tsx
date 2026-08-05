import Link from "next/link";
import { SITE, FOOTER, SOCIAL, KNOWLEDGE_BASE } from "@/lib/site";
import FooterWordmark from "./FooterWordmark";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
};

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink-dim transition-colors hover:text-ink-bright"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactCol() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint">
        Contact
      </h3>
      <ul className="flex flex-col gap-2.5 text-sm text-ink-dim">
        <li>
          <Link
            href={SITE.contactPath}
            className="transition-colors hover:text-ink-bright"
          >
            Send us a message
          </Link>
        </li>
        <li>
          <a href={SITE.phoneHref} className="transition-colors hover:text-ink-bright">
            {SITE.phoneDisplay}
          </a>
        </li>
        <li>HQ in Abbotsford, BC — serving the Lower Mainland</li>
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer-klarheit border-t border-line bg-bg">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-start lg:gap-16 xl:gap-24">
          <div className="max-w-md">
            <h2 className="font-display text-[clamp(1.125rem,1.875vw,1.6875rem)] leading-[1.15] tracking-[-0.02em] text-ink-bright">
              Let&apos;s talk about a more structured environment.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            <FooterCol title="Solutions" links={FOOTER.explore} />
            <FooterCol title="Company" links={FOOTER.company} />
            <FooterContactCol />
          </div>
        </div>

        <FooterWordmark />

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {SITE.legalName}. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink-bright">
              Privacy Policy
            </Link>
            {/* Brand assets for the team, agencies and partners — the page is
                noindexed, so nofollow keeps the link out of search too. */}
            <Link
              href="/brand-center"
              rel="nofollow"
              className="transition-colors hover:text-ink-bright"
            >
              Brand Center
            </Link>
            {/* Staff-facing knowledge base — nofollow so it stays out of search. */}
            <a
              href={KNOWLEDGE_BASE.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="transition-colors hover:text-ink-bright"
            >
              {KNOWLEDGE_BASE.label}
            </a>
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="transition-colors hover:text-ink-bright"
              >
                {SOCIAL_ICONS[s.label] ?? s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
