import { Button } from "./ui";

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
    <section className="section-sm border-t border-line bg-bg">
      <div className="container">
        <div
          data-reveal
          className="grid items-center gap-8 rounded-lg border border-line-soft bg-surface px-8 py-12 md:grid-cols-[1.6fr_1fr] md:px-12 md:py-14"
        >
          <h2 className="display-3 text-balance text-ink-bright">{title}</h2>
          <div className="flex flex-col items-start gap-6 md:items-end md:text-right">
            <p className="text-ink-dim md:max-w-xs">{body}</p>
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
