import type { Metadata } from "next";

const BASE = "https://stratumtech.ca";

/** Build standard page Metadata with canonical + OpenGraph/Twitter. */
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const url = path === "/" ? "/" : path;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url,
      type: "website",
    },
    twitter: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
    },
  };
}

/** BreadcrumbList JSON-LD node. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE}${it.path === "/" ? "/" : it.path}`,
    })),
  };
}
