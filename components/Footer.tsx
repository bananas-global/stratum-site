import Link from "next/link";
import Image from "next/image";
import { SITE, FOOTER } from "@/lib/site";

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-dim transition-colors hover:text-ink-bright">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.8fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Stratum — Home">
              <Image src="/images/logo.svg" alt="Stratum" width={160} height={30} className="h-7 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-dim">{SITE.tagline}</p>
            <div className="flex flex-col gap-1 text-sm text-ink-faint">
              <span>Serving since {SITE.servingSince}</span>
              <a href={SITE.phoneHref} className="text-ink-dim transition-colors hover:text-ink-bright">
                {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="text-ink-dim transition-colors hover:text-ink-bright">
                {SITE.email}
              </a>
            </div>
          </div>

          <FooterCol title="Explore" links={FOOTER.explore} />
          <FooterCol title="Company" links={FOOTER.company} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Stratum Technology. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink-bright">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink-bright">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
