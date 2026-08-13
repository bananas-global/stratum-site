import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { SectionHeader, ArrowNE } from "@/components/ui";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/internal-auth";
import { KNOWLEDGE_BASE } from "@/lib/site";
import { signOut } from "./sign-in/actions";

// Index for the staff-only section. Also the landing spot when someone
// bookmarks /internal itself — without this the gate would sign them in and
// then hand them a 404.
export const metadata: Metadata = {
  title: "Team tools | Stratum (internal)",
  description: "Internal tools — Stratum team only.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const TOOLS = [
  {
    href: "/internal/email-signature",
    title: "Email signature builder",
    description:
      "Generate your Stratum email signature — logo and brand colours baked in.",
  },
  {
    href: "/internal/id-badge",
    title: "ID badge generator",
    description:
      "Build staff ID badges and export them print-ready — single cards or an A4 sheet.",
  },
  {
    href: "/brand-center/brandbook",
    title: "Brand Book",
    description:
      "Review Stratum's positioning, logo, colour, typography, voice and imagery guidelines.",
  },
  {
    href: "/pattern-generator",
    title: "Pattern Generator",
    description:
      "Create and export seamless Stratum pattern backgrounds for presentations and documents.",
  },
  {
    href: KNOWLEDGE_BASE.href,
    title: KNOWLEDGE_BASE.label,
    description:
      "Open the team's internal reference library, documentation and operating knowledge.",
    external: true,
  },
];

export default async function InternalIndexPage() {
  const session = await verifySessionToken(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );

  return (
    <section className="section bg-surface pt-40 md:pt-48">
      <div className="container flex flex-col gap-10">
        <SectionHeader
          eyebrow="Internal"
          title="Team tools."
          lede="Staff-only utilities. Anything added here is behind the same sign-in."
        />
        <div className="grid gap-4 sm:grid-cols-2" data-reveal>
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              target={"external" in tool && tool.external ? "_blank" : undefined}
              rel={"external" in tool && tool.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-2 rounded-sm border border-line bg-black/40 p-6 transition-colors hover:border-brand"
            >
              <span className="flex items-center gap-2 text-ink-bright">
                {tool.title}
                <ArrowNE />
              </span>
              <span className="text-sm text-ink-dim">{tool.description}</span>
            </Link>
          ))}
        </div>
        <form action={signOut} className="flex items-center gap-3 text-sm">
          {session && (
            <span className="text-ink-faint">Signed in as {session.email}</span>
          )}
          <button
            type="submit"
            className="text-ink-faint underline-offset-4 transition-colors hover:text-ink-bright hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
