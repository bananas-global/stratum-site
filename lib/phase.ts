/**
 * Phase 1 launch scope guard.
 *
 * Keep Phase 2 pages in source so work can resume later, but do not expose or
 * index them during Phase 1. To resume Phase 2, flip this flag and re-add the
 * intended links/sitemap entries in the page and chrome files that reference it.
 */
export const PHASE_2_ROUTES_ENABLED = false;

export const PHASE_1_SITEMAP_PATHS = [
  "",
  "/services",
  "/hardware",
  "/industries",
  "/about",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
];

export const PHASE_2_ROUTE_GROUPS = {
  serviceDetailPages: ["/services/managed-it", "/services/cybersecurity", "/services/business-systems"],
  industryDetailPages: [
    "/industries/automotive-dealerships",
    "/industries/medical-dental",
    "/industries/law-firms",
    "/industries/construction-aec",
    "/industries/manufacturing",
  ],
  whyStratum: ["/why-stratum"],
};
