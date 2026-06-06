"use client";

import type { MouseEvent } from "react";

export default function ServiceFilterChips({ items }: { items: string[] }) {
  function applyServiceFilter(event: MouseEvent<HTMLAnchorElement>, item: string) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set("serviceFilter", item);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}#service-catalog`);
    document.dispatchEvent(new CustomEvent("service-catalog-filter", { detail: { query: item } }));
    window.dispatchEvent(new CustomEvent("service-catalog-filter", { detail: { query: item } }));
    document.getElementById("service-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-2">
          <a
            href={`/services?serviceFilter=${encodeURIComponent(item)}#service-catalog`}
            onClick={(event) => applyServiceFilter(event, item)}
            className="chip service-filter-chip transition-colors hover:text-ink-bright focus:outline-none focus-visible:text-ink-bright"
          >
            {item}
          </a>
          {i < items.length - 1 && <span className="chip-dot" />}
        </span>
      ))}
    </div>
  );
}
