import { Button } from "./ui";
import { IconPattern } from "./IconPattern";

export default function CTABand({
  title,
  body,
  ctaLabel = "Talk With Stratum",
  ctaHref = "/contact",
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="cta-band section-sm relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <IconPattern color="#000000" scale={0.34} />
      </div>
      <div className="cta-band-bg" aria-hidden="true" />

      <div className="container relative z-10">
        <div
          data-reveal
          className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
        >
          <h2 className="display-2 text-balance text-ink-bright">{title}</h2>
          <p className="max-w-lg text-base leading-relaxed text-ink-dim">{body}</p>
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
}
