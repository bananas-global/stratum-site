/**
 * FAQ — accessible accordion (native <details>) + FAQPage JSON-LD helper.
 * Written for LLM/answer-engine extraction: each answer is self-contained,
 * names the brand and the service area, and avoids unverified numbers.
 */

export type FAQItem = { q: string; a: string };

export function faqPageLd(items: FAQItem[], id: string) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export default function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div
      data-reveal
      className="flex flex-col divide-y divide-line-soft overflow-hidden rounded-md border border-line-soft bg-surface"
    >
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left font-display text-[1.125rem] leading-[1.5rem] text-ink-bright transition-colors hover:text-brand-light [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-3xl px-6 pb-6 text-sm leading-relaxed text-ink-dim">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
