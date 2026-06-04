# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this repo is

A **plain static HTML marketing site** for Stratum (stratumtech.ca), an MSP serving the Lower Mainland, BC. There is no build step, no package manager, no test suite, and no framework. Pages are hand-authored HTML, all sharing a single `design-system.css` stylesheet. URLs map directly to files (`/services/managed-it` → `services/managed-it.html`).

## Commands

There is no toolchain. To preview locally, serve the repo root over HTTP so root-relative paths (`/design-system.css`, `/services/...`) resolve:

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

Don't open files via `file://` — internal links and the `/design-system.css` import will break.

## Architecture

### Page model
- Every page is a standalone, self-contained `.html` file. There is no template engine — the **navbar, footer, and CTA band markup are duplicated verbatim** across every page. When updating shared chrome, you must change it in every page (use grep + Edit).
- New pages should be created by copying [_template.html](_template.html) and replacing the `<!-- TEMPLATE: ... -->` markers. The template documents the expected `<head>`, JSON-LD shape, and common `<main>` section patterns.
- Page-specific CSS goes in an inline `<style>` block in the page's `<head>`. Shared component classes live in [design-system.css](design-system.css) — do not duplicate them per-page.

### Routing
Clean URLs are expected (no `.html` extension in links). The footer and navbar link to paths like `/services/managed-it`, `/industries/automotive-dealerships`, `/insights`, `/about`, `/contact`, etc. The host/CDN must rewrite extensionless paths to the matching `.html` file. Directory index pages live at `services/index.html`, `industries/index.html`, `insights/index.html`.

### Design system
[design-system.css](design-system.css) is the single source of truth for visual language. Key conventions:
- **Tokens** are CSS custom properties on `:root` (`--color-bg`, `--color-text`, `--color-accent`, `--font`, `--font-serif`, `--radius`, `--max-w`, `--section-py`). Use these instead of literal values.
- **Headings** use `Instrument Serif` (`--font-serif`); body and UI use `Manrope` (`--font`). The font links are duplicated in every page's `<head>`.
- **Shared component classes** already implemented: `.navbar`, `.nav-dropdown*`, `.footer`, `.cta-band`, `.container`, `.section-header`, `.page-hero`, `.scope-grid` (+ `--2col`/`--4col`), `.services-grid` / `.service-card`, `.how-steps` / `.step-card`, `.testimonials-grid` / `.testimonial-card`, `.feature-grid`, `.bullet-list`, `.tag-cloud` / `.tag`, `.breadcrumb`, `.outcome-strip`, `.cta-inline`, `.lens-table` (5S table), `.contact-form`, `.team-grid`, plus wireframe helpers `.wf-label` / `.wf-placeholder` / `.wf-note`. Check [design-system.css](design-system.css) before inventing a new class — the named section comments (`/* ─── ... ─── */`) make it easy to scan.

### SEO / structured data
Each page carries its own:
- Canonical link, `og:*` and `twitter:*` meta, `geo.region`/`geo.placename`, `theme-color` (`#2C2B28`).
- A JSON-LD `@graph` with a `BreadcrumbList` plus a page-appropriate type — `Service` for service pages, `ProfessionalService` for industry pages, `CollectionPage` for index pages, `Organization`/`ProfessionalService`/`WebSite` on the homepage.
- The homepage defines `@id`s (`#organization`, `#localbusiness`, `#website`) that other pages reference via `isPartOf` / `publisher` / `provider` — keep those IDs stable when editing schemas.

### Navbar dropdown JS
The only JS on the site is a small dropdown handler at the bottom of each page (`services-nav-trigger` / `services-nav-item`). It toggles an `.open` class and the `aria-expanded` attribute. There is currently no equivalent script for the Industries dropdown, even though the markup is present — be aware when touching navigation.

## Content & strategy

The narrative and positioning are not in the HTML — they live in [content/](content/):
- [content/Stratum Rebranding/Target Market & Overall Strategy.md](content/Stratum%20Rebranding/Target%20Market%20&%20Overall%20Strategy.md) — the **brand lens (Structure, Security, Stability, Simplicity, Stewardship)**, target industries, positioning statement, and Stratum's internal package tiers (Essentials / Business / Secure / Complete). Read this before rewriting copy.
- [content/Products and Services/](content/Products%20and%20Services/) — source copy for service pages.
- [content/Sitemap.rtf](content/Sitemap.rtf) — intended information architecture.

When writing or editing customer-facing copy, stay inside the 5S lens and the "structured, security-aware, dependable technology partner" positioning. Do not introduce generic MSP language.
