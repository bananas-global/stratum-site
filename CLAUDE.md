# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **Next.js 15 (App Router) marketing site** for Stratum (stratumtech.ca), an MSP serving the Lower Mainland, BC. It is deployed on **Vercel**. The visual language is dark and cinematic — a futuristic, minimalist 3D-render aesthetic in the spirit of premium industrial product design (Apple-grade, CNC-machined hardware). Near-black surfaces (`#000` / `#0f0f0f`), smooth anodized-aluminum / gunmetal materials with crisp edge highlights, geometric forms with softly rounded edges (chamfers, fillets, radii), and an amethyst brand accent (`#7d34ff`) used sparingly as a single edge or separation light — never a glow. Lora / Instrument Serif display headings, Manrope body, and `[ bracket ]` eyebrow labels. The homepage features a scroll-scrubbed 3D "A" hero video, a five-pillar timeline (the "Our approach" section), and a hover-card services showcase.

> **Art direction — generated/AI imagery follows [`images-look-feel.json`](images-look-feel.json)** (the canonical spec): low-key anodized-aluminum 3D product renders, deep blacks, a single subtle amethyst edge light. **Hard exclusions: no crystals, gems, faceted/mineral/rock forms**, and no gamer / RGB / neon / cyberpunk / glowing-edge looks. The gem motif is reserved exclusively for the "Our approach" five-pillar timeline (its `gem-*.webp` pillar renders) — do not extend it to heroes, product, or any other imagery.

> History: this started as a hand-authored static HTML wireframe and a Webflow WIP design reference, then was rebuilt in Next.js (wireframe copy + SEO in the Webflow visual language). Those reference folders have since been removed from the repo.

## Commands

```
pnpm install
pnpm dev      # dev server — port is derived per-checkout by scripts/port.mjs; read the URL from the console
pnpm build    # production build — run this to verify before shipping
pnpm start    # serve the production build
pnpm lint     # ESLint (flat config, eslint-config-next)
```

- `pnpm dev` and `pnpm build` both run `scripts/notion-sync.mjs` first (see **Insights pipeline**). Without `NOTION_TOKEN` it warns and exits 0, keeping any previously synced content.
- ⚠️ Do not run `pnpm build` while `pnpm dev` is running — they share `.next` and the production build corrupts the dev chunks (`Cannot find module './vendor-chunks/...'`). Stop dev, `rm -rf .next`, then build.
- CI (`.github/workflows/ci.yml`) runs install → lint → `tsc --noEmit` → build on every push/PR.

## Architecture

- **`app/`** — App Router pages: `/`, `/services`, `/hardware`, `/industries`, `/insights`, `/about`, `/contact`, `/privacy`, `/why-stratum`, plus dynamic `app/services/[slug]`, `app/industries/[slug]`, `app/insights/[slug]` (all `generateStaticParams` + `generateMetadata`, driven by data files / synced content). `app/email-signature` is an internal signature-builder tool (noindexed, not linked). `app/api/contact/route.ts` relays contact-form submissions through Resend (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — see `.env.example`). `app/layout.tsx` wires fonts (next/font for Manrope, Instrument Serif, and Lora), global metadata, the org/website JSON-LD, a skip-to-content link, `<SmoothScroll>`, `<Nav>`, and `<Footer>`. Every route prerenders statically — don't read `searchParams` in a page (that flips it to per-request rendering); handle URL params client-side (see `ServiceCatalog`).

> **Phase 1 vs Phase 2 scope — source of truth is [`lib/phase.ts`](lib/phase.ts).** Phase 1 (launch) routes are listed in `PHASE_1_SITEMAP_PATHS`. Phase 2 routes (`/services/[slug]`, `/industries/[slug]`, `/why-stratum`) are fully built but hidden: per-page `robots: { index:false }` metadata, excluded from `sitemap.ts`, and not linked from nav/footer/index pages. (Deliberately NOT robots.txt-disallowed — that would hide the noindex meta from crawlers.) To launch Phase 2: flip `PHASE_2_ROUTES_ENABLED`, re-add links (nav children in `lib/site.ts`, index-page cards), drop the per-page noindex, and add the routes to the sitemap.
- **`components/`** — shared UI. `ui.tsx` (BracketLabel, Button, ArrowLink, icons), `sections.tsx` (PageHero, FeatureGrid, CardMedia, …), `Nav.tsx`, `Footer.tsx`, `CTABand.tsx`, `SmoothScroll.tsx` (Lenis + GSAP ScrollTrigger reveal engine), `home/` (CinematicHero, ApproachTimeline, ServicesShowcase, IndustriesTabs, TestimonialsShowcase, …), and interactive bits (ContactForm, ServiceCatalog, ServiceFilterChips, EmailSignatureBuilder, PostBody).
- **`lib/`** — `site.ts` (nav/footer/contact constants + org JSON-LD), `seo.ts` (`pageMeta` + `breadcrumb`), `phase.ts` (Phase-1/2 route scoping), `services.ts` / `industries.ts` (content data for the dynamic routes), `insights.ts` (read side of the Notion pipeline), `signature-cta.ts`.
- **`public/`** — images (heroes and renders are quality-tuned WebP — keep new heavy images in WebP, not multi-MB PNG), hero video (`videos/hero_stratum_v2.mp4` + poster), `og-image.png`, `images/logo-512.png` (JSON-LD logo), favicon.
- **`next.config.ts`** — AVIF-first image formats (falls back to WebP) and baseline security headers (nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy). Deliberately no CSP: the layout ships inline scripts (JSON-LD + the reveal fallback), so a CSP needs nonces/hashes — add one deliberately, not as a header one-liner.

### Insights pipeline (Notion → static)
`scripts/notion-sync.mjs` runs before dev/build: it pulls published posts from the "Stratum News" Notion database into `content/insights/*.json` and downloads every image to `public/insights/` (both committed — since July 2026 the baked content is checked in so the repo is self-contained without `NOTION_TOKEN`; the sync refreshes it each build, so commit the diff when posts change), keeping the static build immune to Notion's expiring signed URLs. It also syncs the email-signature CTA line. Pages read the baked content via `lib/insights.ts`, which returns empty when content is absent so builds never require secrets.

### Styling — Tailwind v4 + tokens
- `app/globals.css` holds an `@theme` token block (colors `--color-bg/surface/ink*/brand*/line*`, `--font-display/body`, radii, container widths) and custom classes.
- **Custom component classes (`.btn`, `.card`, `.bracket-label`, `.section`, `.container`, etc.) live in `@layer components`, and base resets in `@layer base`.** This ordering matters: classes outside a layer would override Tailwind utilities (e.g. `hidden` on a `.btn` would silently fail). Keep new component classes inside `@layer components`.
- Use the design tokens as Tailwind utilities: `bg-surface`, `text-ink-dim`, `text-brand-light`, `border-line`, `font-display`, etc. Alternate section backgrounds `bg-bg` / `bg-surface` / `bg-black`.

### Animation
- `SmoothScroll.tsx` sets up Lenis smooth scroll + GSAP. Any element with `data-reveal` fades/slides in on scroll (optional `data-reveal-delay`). The initial hidden state is `[data-reveal]{opacity:0}` in globals.css; GSAP sets inline opacity to reveal. Respects `prefers-reduced-motion`.
- The Lenis instance is exposed at `window.lenis` (used for programmatic scrolling, e.g. in screenshots — `window.scrollTo` is overridden by Lenis).
- `CinematicHero.tsx` runs its own rAF loop (no GSAP): it scrubs the hero video `currentTime` **in reverse** against scroll (the v2 render was rendered bottom-up), then parallaxes the pinned video stage once the scrub finishes. There is no darkening overlay anymore — the video stays visible; a WebGL light-rays layer (`SideRays.tsx`, built on `ogl`) screen-blends over it inside the same stage. `ServicesShowcase` renders inside the hero section so the scrub range spans both. Respects `prefers-reduced-motion` (plain looping autoplay).

### SEO / structured data
- Per-page `metadata` via `pageMeta()` (canonical + OG/Twitter). Each page renders a JSON-LD `<script>` with a `breadcrumb()` node + a page-appropriate type (`Service`, `ProfessionalService`, `CollectionPage`, `ContactPage`, `AboutPage`, `Blog`, `WebPage`). The homepage emits `Organization` + `ProfessionalService` (#localbusiness) + `WebSite`; other pages reference those `@id`s. `app/sitemap.ts` and `app/robots.ts` are generated (Phase-1 pages + synced insight posts; no hardcoded lastModified dates).

## Content & strategy

Narrative/positioning lives in [content/](content/) — the **5S brand lens (Structure, Security, Stability, Simplicity, Stewardship)**, target industries, and package tiers (Essentials / Business / Secure / Complete). Read [content/Stratum Rebranding/Target Market & Overall Strategy.md](content/Stratum%20Rebranding/Target%20Market%20&%20Overall%20Strategy.md) before rewriting copy. Stay inside the 5S lens and the "structured, security-aware, dependable technology partner" positioning — no generic MSP language.

### Known content gaps (placeholders to fill before launch)
Proof stats on `/why-stratum` and in `lib/services.ts` (`—` / "To be confirmed" — intentionally left until real numbers exist), the Cove partner logo in the homepage marquee (TODO in `app/page.tsx`), and `/terms` (not built; the footer currently links only Privacy). The contact form needs `RESEND_API_KEY` configured in Vercel (install the Resend Marketplace integration) and, for production sending, the `stratumtech.ca` domain verified in Resend.
