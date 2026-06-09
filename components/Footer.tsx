import Link from "next/link";
import { SITE, FOOTER } from "@/lib/site";
import FooterWordmark from "./FooterWordmark";

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
          <a
            href={`mailto:${SITE.email}`}
            className="transition-colors hover:text-ink-bright"
          >
            {SITE.email}
          </a>
        </li>
        <li>
          <a href={SITE.phoneHref} className="transition-colors hover:text-ink-bright">
            {SITE.phoneDisplay}
          </a>
        </li>
        <li>Lower Mainland, BC</li>
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
            <h2 className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.15] tracking-[-0.02em] text-ink-bright">
              Let&apos;s talk about a more structured environment.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            <FooterCol title="Services" links={FOOTER.explore} />
            <FooterCol title="Company" links={FOOTER.company} />
            <FooterContactCol />
          </div>
        </div>

        <FooterWordmark />

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {SITE.legalName}. All rights reserved.</span>
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
