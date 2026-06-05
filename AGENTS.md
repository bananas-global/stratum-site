# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this repo is

The current implementation is a **Next.js marketing site** for Stratum (stratumtech.ca), an MSP serving the Lower Mainland, BC. The historical static HTML export and Webflow files are not the active source of truth.

### Phase scope
- Phase 1 public routes are: `/`, `/services`, `/industries`, `/about`, `/insights`, and `/contact`.
- `/industries` intentionally replaces the originally planned local page for Phase 1.
- Phase 2 routes are already in source but must stay hidden until explicitly resumed: `/services/[slug]`, `/industries/[slug]`, and `/why-stratum`.
- Phase 2 route exposure is controlled in `lib/phase.ts`. Keep `PHASE_2_ROUTES_ENABLED` false during Phase 1, keep Phase 2 routes out of nav/footer/homepage links, and keep them out of `app/sitemap.ts`.
- To resume Phase 2, flip `PHASE_2_ROUTES_ENABLED`, then re-add the intended internal links and sitemap entries deliberately.

## Commands

Use the Next.js dev server:

```
pnpm dev
# then open http://localhost:3000/
```

## Architecture

### Page model
- Public pages live under `app/*/page.tsx`; shared chrome lives in `components/Nav.tsx`, `components/Footer.tsx`, and `components/CTABand.tsx`.
- Shared site constants live in `lib/site.ts`; SEO helpers live in `lib/seo.ts`; Phase 1/Phase 2 route gating lives in `lib/phase.ts`.
- Service and industry detail content lives in `lib/services.ts` and `lib/industries.ts`. Keep that content intact while Phase 2 is hidden.

### Routing
- Phase 1 clean URLs are `/`, `/services`, `/industries`, `/about`, `/insights`, and `/contact`.
- Do not add links to `/services/[slug]`, `/industries/[slug]`, or `/why-stratum` during Phase 1.
- Direct Phase 2 routes should return `notFound()` while `PHASE_2_ROUTES_ENABLED` is false.

### Design system
- Global styles and utility classes live in `app/globals.css`.
- Shared layout/section primitives live in `components/sections.tsx` and `components/ui.tsx`.
- Reuse existing components before adding new one-off layout patterns.

### SEO / structured data
- Use `pageMeta()` and `breadcrumb()` from `lib/seo.ts` for page metadata and JSON-LD.
- Homepage organization/site graph IDs in `lib/site.ts` are shared references; keep them stable.
- Keep hidden Phase 2 routes out of `app/sitemap.ts`, disallowed in `app/robots.ts`, and marked `noindex` while disabled.

## Content & strategy

The narrative and positioning are not in the HTML — they live in [content/](content/):
- [content/Stratum Rebranding/Target Market & Overall Strategy.md](content/Stratum%20Rebranding/Target%20Market%20&%20Overall%20Strategy.md) — the **brand lens (Structure, Security, Stability, Simplicity, Stewardship)**, target industries, positioning statement, and Stratum's internal package tiers (Essentials / Business / Secure / Complete). Read this before rewriting copy.
- [content/Products and Services/](content/Products%20and%20Services/) — source copy for service pages.
- [content/Sitemap.rtf](content/Sitemap.rtf) — intended information architecture.

When writing or editing customer-facing copy, stay inside the 5S lens and the "structured, security-aware, dependable technology partner" positioning. Do not introduce generic MSP language.
