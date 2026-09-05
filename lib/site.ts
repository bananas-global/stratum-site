export const SITE = {
  name: "Stratum",
  legalName: "Stratum Technology",
  domain: "https://www.stratumtech.ca",
  url: "https://www.stratumtech.ca",
  phoneDisplay: "1 (855) 200-0076",
  phoneHref: "tel:+18552000076",
  // No public general-inquiry address: general contact goes through the
  // HubSpot form on /contact so leads land in the CRM. Only the phone number
  // and the form are published.
  contactPath: "/contact",
  servingSince: "2007",
  tagline:
    "Structure, security, stability, simplicity, and stewardship for growing organizations.",
  themeColor: "#0f0f0f",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc: string }[];
};

/**
 * Public navigation. Vulnerability scans is the first launched service detail;
 * the remaining Phase 2 detail pages stay hidden.
 */
export const NAV: NavItem[] = [
  { label: "Services", href: "/services", children: [
    { label: "Vulnerability Scans", href: "/services/vulnerability-scans", desc: "Tenable Nessus scans, reporting, and remediation." },
  ] },
  { label: "Hardware", href: "/hardware" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
];

export const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/stratum-technology",
  },
];

export const FOOTER = {
  explore: [
    { label: "Services", href: "/services" },
    { label: "Hardware", href: "/hardware" },
    { label: "Industries", href: "/industries" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
};

/** Stratum's internal team knowledge base — staff-facing, not a marketing page. */
export const KNOWLEDGE_BASE = {
  label: "Knowledge Base",
  href: "https://stratum-seven-eta.vercel.app/",
};

/** Organization-level JSON-LD shared via @id references across pages. */
export const orgGraph = {
  "@type": "Organization",
  "@id": "https://www.stratumtech.ca/#organization",
  name: "Stratum",
  legalName: "Stratum Technology",
  url: "https://www.stratumtech.ca/",
  logo: {
    "@type": "ImageObject",
    url: "https://www.stratumtech.ca/images/logo-512.png",
    width: 512,
    height: 512,
  },
  description:
    "Technology company for growing organizations — structured service across support, continuity, and business systems.",
  telephone: "+1-855-200-0076",
  sameAs: ["https://www.linkedin.com/company/stratum-technology"],
  areaServed: { "@type": "Country", name: "Canada" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-855-200-0076",
      contactType: "customer service",
      areaServed: "CA",
      availableLanguage: ["English"],
    },
  ],
};

export const websiteGraph = {
  "@type": "WebSite",
  "@id": "https://www.stratumtech.ca/#website",
  url: "https://www.stratumtech.ca/",
  name: "Stratum",
  inLanguage: "en-CA",
  publisher: { "@id": "https://www.stratumtech.ca/#organization" },
};

/** Render a JSON-LD <script> payload. */
export function jsonLd(graph: object[]) {
  return {
    __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
  };
}
