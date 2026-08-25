import Link from "next/link";
import { Button } from "@/components/ui";

const QUICK = [
  { label: "Services", sub: "Managed IT, Cybersecurity, Business Systems", href: "/services" },
  { label: "Industries", sub: "The verticals we lead with", href: "/industries" },
  { label: "About", sub: "Who we are and where we operate", href: "/about" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-32">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <div className="container relative flex flex-col items-center gap-6 text-center">
        <span className="font-display text-[6rem] leading-none text-ink-bright">404</span>
        <h1 className="display-2 text-ink-bright">That page isn&apos;t on the map.</h1>
        <p className="max-w-md text-lg font-light text-ink-dim">
          The link you followed may be broken, or the page may have been moved. The rest of Stratum is right where you
          left it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/">Back to home</Button>
          <Button href="/contact">
            Talk With Stratum
          </Button>
        </div>
        <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className="card text-left transition-colors hover:border-brand/40">
              <div className="font-display text-[0.9375rem] leading-[1.3125rem] text-ink-bright">{q.label}</div>
              <div className="mt-1 text-sm text-ink-faint">{q.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
