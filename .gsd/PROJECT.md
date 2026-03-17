# tsa.monster

## What This Is

Static Amazon affiliate review site in English, targeting the US market first. The primary goal is getting approved as an Amazon Associate (US). Once approved, it serves as an active site generating organic traffic and real commissions. The architecture is i18n-ready from day one — English lives at `/en/`, future languages at `/de/`, `/fr/`, etc. — so adding a new locale is a matter of content, not code.

## Core Value

A real, professional-looking review site that passes Amazon's manual Associates approval review: 10+ pages of original content, legal pages present, clean design, affiliate disclosure everywhere it needs to be.

## Current State

**S03 complete.** All 15 review articles built and routed across Kitchen (×5), Outdoor (×4), Home (×3), and Beauty (×3). Category listing page live at `src/pages/en/[category]/index.astro` — all 4 Header nav links now resolve. 15 JPEG hero images downloaded as local assets. `pnpm build` exits 0 with 25 pages in `dist/`. sitemap-0.xml has 25 `<loc>` entries. TypeScript clean (19 files, 0 errors, 0 warnings, 0 hints). R002, R005, R009 validated. Site is structurally complete — only deploy (S04) remains.

## Architecture / Key Patterns

- **Framework:** Astro 6 (static output — `output: 'static'`)
- **Styles:** Tailwind v4 via `@tailwindcss/vite` Vite plugin — CSS-first config in `src/styles/global.css` (`@import "tailwindcss"` + `@theme {}`). No `tailwind.config.js`.
- **Language:** TypeScript
- **Content:** MDX via Astro Content Collections — schema at `src/content.config.ts` (root-level, Astro 6 requirement)
- **i18n:** Astro native i18n with `prefixDefaultLocale: true` — all URLs prefixed (`/en/`, ...)
- **Language redirect:** Client-side script at `/` reads `navigator.language` + `navigator.languages`, redirects to matching locale, fallback to `/en/`
- **Images:** Unsplash lifestyle/ambient photos, downloaded as local assets (not hotlinked)
- **Deploy:** VPS with existing Caddy — new site block added to existing config, `dist/` copied to `/var/www/tsa-monster/`
- **CDN/DNS:** Cloudflare in proxy mode, SSL Full (strict)
- **Package manager:** pnpm (v10 — requires `onlyBuiltDependencies` for esbuild/sharp)
- **Brand palette:** Amber/slate editorial — `#f59e0b` brand, `#0f172a` ink, `#f8fafc` surface, DM Sans + DM Serif Display fonts

## Key Files

- `astro.config.mjs` — site config, i18n, integrations, Vite Tailwind plugin
- `src/styles/global.css` — Tailwind v4 CSS-first config + brand tokens
- `src/i18n/config.ts` — LOCALES, DEFAULT_LOCALE, helpers
- `src/content.config.ts` — reviews collection schema (contract for all MDX articles)
- `src/layouts/BaseLayout.astro` — shared page shell (SEO head, canonical, OG, hreflang)
- `src/layouts/ArticleLayout.astro` — article shell (extends BaseLayout, adds AffiliateDisclosure + JSON-LD)
- `src/pages/index.astro` — redirect only
- `src/pages/en/[category]/[slug].astro` — dynamic article route

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] S01: Astro scaffold + i18n foundation — **complete**
- [x] S02: Static pages + home (About, Privacy Policy, Affiliate Disclosure, Contact, Home content) — **complete**
- [x] S03: 15 review articles + images — **complete**
- [ ] S04: Build + deploy (VPS, Caddy, Cloudflare)
- [ ] M001: Launch — Build and deploy tsa.monster, ready for Amazon Associates US application
