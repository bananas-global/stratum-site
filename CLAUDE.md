# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **Next.js 15 (App Router) marketing site** for Stratum (stratumtech.ca), an MSP serving the Lower Mainland, BC. It is deployed on **Vercel**. The visual language is dark and cinematic — near-black surfaces (`#000` / `#0f0f0f`), an amethyst brand accent (`#7d34ff`), Instrument Serif / Parastoo display headings, Manrope body, `[ bracket ]` eyebrow labels, and gem/crystal imagery. The homepage features a scroll-scrubbed 3D "stone A" hero video, a five-pillar gem timeline, and a hover-card services showcase.

> History: this started as a hand-authored static HTML wireframe (now in `legacy/`) and a Webflow WIP design reference (`stratumtech.webflow/`). The current site was rebuilt in Next.js, porting the wireframe's copy + SEO into the Webflow visual language. The `legacy/` and `stratumtech.webflow/` folders are kept for reference only and are NOT part of the build.

## Commands

```
pnpm install
pnpm dev      # dev server (http://localhost:3000)
pnpm build    # production build — run this to verify before shipping
pnpm start    # serve the production build
```

⚠️ Do not run `pnpm build` while `pnpm dev` is running — they share `.next` and the production build corrupts the dev chunks (`Cannot find module './vendor-chunks/...'`). Stop dev, `rm -rf .next`, then build.

## Architecture

- **`app/`** — App Router pages. Static-ish marketing routes plus two dynamic routes: `app/services/[slug]` and `app/industries/[slug]` (both use `generateStaticParams` + `generateMetadata`, driven by data files). `app/layout.tsx` wires fonts (next/font for Manrope + Instrument Serif; Parastoo via Google `<link>`), global metadata, the org/website JSON-LD, `<SmoothScroll>`, `<Nav>`, and `<Footer>`.

> **Phase 1 vs Phase 2 scope.** The launch (Phase 1) IA, mirroring the wireframe nav, is: `/`, `/services`, `/industries`, `/insights`, `/about`, `/contact`, `/why-stratum` (linked from the homepage + footer, not the top nav). The per-service detail pages (`/services/[slug]`) and per-industry detail pages (`/industries/[slug]`) are **Phase 2**: fully built but hidden — `robots: { index:false }`, excluded from `sitemap.ts`, and not linked from the nav, footer, homepage, or index pages. To launch them in Phase 2: re-add their links (nav children in `lib/site.ts`, index-page cards), drop the `robots` noindex, and add them back to the sitemap.
- **`components/`** — shared UI. `ui.tsx` (BracketLabel, Button, ArrowLink, SectionHeader, ChipRow, icons), `sections.tsx` (PageHero, ScopeGrid, FeatureGrid, HowSteps, OutcomeStrip, Band), `Nav.tsx`, `Footer.tsx`, `CTABand.tsx`, `SmoothScroll.tsx` (Lenis + GSAP ScrollTrigger reveal engine), plus `home/` (CinematicHero, ServicesShowcase, IndustriesTabs) and interactive bits (ContactForm, ServiceCatalog, InsightsGrid).
- **`lib/`** — `site.ts` (nav/footer/contact constants + org JSON-LD helpers), `seo.ts` (`pageMeta` + `breadcrumb` helpers), `services.ts` and `industries.ts` (page content data for the dynamic routes).
- **`public/`** — images (gems renamed `gem-structure.png` … `gem-stewardship.png`, `logo.svg`), hero video (`videos/hero_stratum_*`), favicon.

### Styling — Tailwind v4 + tokens
- `app/globals.css` holds an `@theme` token block (colors `--color-bg/surface/ink*/brand*/line*`, `--font-display/body`, radii, container widths) and custom classes.
- **Custom component classes (`.btn`, `.card`, `.bracket-label`, `.section`, `.container`, etc.) live in `@layer components`, and base resets in `@layer base`.** This ordering matters: classes outside a layer would override Tailwind utilities (e.g. `hidden` on a `.btn` would silently fail). Keep new component classes inside `@layer components`.
- Use the design tokens as Tailwind utilities: `bg-surface`, `text-ink-dim`, `text-brand-light`, `border-line`, `font-display`, etc. Alternate section backgrounds `bg-bg` / `bg-surface` / `bg-black`.

### Animation
- `SmoothScroll.tsx` sets up Lenis smooth scroll + GSAP. Any element with `data-reveal` fades/slides in on scroll (optional `data-reveal-delay`). The initial hidden state is `[data-reveal]{opacity:0}` in globals.css; GSAP sets inline opacity to reveal. Respects `prefers-reduced-motion`.
- The Lenis instance is exposed at `window.lenis` (used for programmatic scrolling, e.g. in screenshots — `window.scrollTo` is overridden by Lenis).
- `CinematicHero.tsx` scrubs the hero video `currentTime` against scroll progress and fades a black overlay in as the pillar timeline arrives.

### SEO / structured data
- Per-page `metadata` via `pageMeta()` (canonical + OG/Twitter). Each page renders a JSON-LD `<script>` with a `breadcrumb()` node + a page-appropriate type (`Service`, `ProfessionalService`, `CollectionPage`, `ContactPage`, `AboutPage`, `Blog`, `WebPage`). The homepage emits `Organization` + `ProfessionalService` (#localbusiness) + `WebSite`; other pages reference those `@id`s. `app/sitemap.ts` and `app/robots.ts` are generated.

## Content & strategy

Narrative/positioning lives in [content/](content/) — the **5S brand lens (Structure, Security, Stability, Simplicity, Stewardship)**, target industries, and package tiers (Essentials / Business / Secure / Complete). Read [content/Stratum Rebranding/Target Market & Overall Strategy.md](content/Stratum%20Rebranding/Target%20Market%20&%20Overall%20Strategy.md) before rewriting copy. Stay inside the 5S lens and the "structured, security-aware, dependable technology partner" positioning — no generic MSP language.

### Known content gaps (placeholders to fill before launch)
Proof stats and partner/trust logos (all `—` / "To be confirmed"), testimonials, leadership bios + photos, industry/hero photography, the contact form backend (currently a demo stub), insights articles (placeholder cards; needs a CMS or MDX), and an `og-image.png` (referenced but not yet created). `/privacy` and `/terms` are linked in the footer but not yet built.
