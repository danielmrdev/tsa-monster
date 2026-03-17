# M001: Launch — tsa.monster

**Gathered:** 2026-03-17
**Status:** Ready for planning

## Project Description

Static Amazon affiliate review site at `tsa.monster`. 15 real review articles across 4 categories (Kitchen, Outdoor, Home, Beauty) plus 4 static legal/info pages. Built with Astro 6 + Tailwind CSS v4 + TypeScript. i18n-first architecture from day one — English at `/en/`, future locales at `/de/`, `/fr/`, etc. Root `/` auto-redirects based on `navigator.language`.

## Why This Milestone

Get approved for Amazon Associates US. The site must be publicly accessible, look professional, have real content, and include all legally required pages (Privacy Policy, Affiliate Disclosure). Without approval, no affiliate commissions.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Navigate to `tsa.monster` and be redirected to `tsa.monster/en/`
- Browse 15 real review articles across 4 categories
- See the full site — home, articles, about, privacy policy, affiliate disclosure, contact — all styled and functional
- Submit the Amazon Associates US application pointing to `tsa.monster`

### Entry point / environment

- Entry point: `https://tsa.monster` (browser)
- Environment: Production — VPS with Caddy, Cloudflare proxy
- Live dependencies involved: Cloudflare DNS, Caddy (already installed on VPS)

## Completion Class

- Contract complete means: `pnpm build` succeeds, all pages render, sitemap generated, no broken links
- Integration complete means: Site accessible at `tsa.monster` via Cloudflare → Caddy → dist/, HTTPS working
- Operational complete means: Caddy serving static files correctly, Cloudflare SSL Full (strict) configured

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- `https://tsa.monster` redirects to `https://tsa.monster/en/` in a browser
- All 15 articles accessible and rendering with real content
- `/en/privacy-policy` and `/en/affiliate-disclosure` accessible
- `pnpm build` completes without errors and `sitemap.xml` is present in `dist/`

## Risks and Unknowns

- Tailwind CSS v4 API differs from v3 — config approach changed significantly — worth verifying during S01
- Astro 6 content collections schema format — minor changes from v4/v5 worth checking in docs before writing config.ts
- Caddy config on VPS — need to know where the Caddyfile lives and how it's structured to add the new block correctly

## Existing Codebase / Prior Art

- Fresh repo — no existing source code
- VPS already has Caddy installed and running (other sites may be configured)

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001 — Astro i18n foundation
- R002 — 15 articles
- R003 — Legal pages
- R004 — Home + navigation
- R005 — SEO
- R006 — Language redirect
- R007 — Cache headers
- R008 — Deploy to VPS
- R009 — Local image assets

## Scope

### In Scope

- Astro 6 project scaffold with Tailwind v4, TypeScript, i18n, content collections
- 15 MDX review articles in English with real content
- 4 static pages: About, Privacy Policy, Affiliate Disclosure, Contact
- Home page with category grid and recent articles
- All SEO meta: title, description, OG, Schema.org, sitemap, canonical, hreflang
- Language redirect script at root
- Unsplash lifestyle images downloaded as local assets
- Deploy to VPS: copy dist/, add Caddy site block to existing config
- Cloudflare DNS + SSL Full (strict)

### Out of Scope / Non-Goals

- Amazon PA API / product widgets
- Real affiliate links (placeholder CTAs only until approval)
- Analytics / tracking
- Additional locales (DE, FR, ES, etc.) — architecture ready, content deferred
- Server-side rendering or dynamic routes

## Technical Constraints

- Output must be 100% static (`output: 'static'` in astro.config.mjs)
- No server-side state, no session cookies
- pnpm as package manager
- Node >= 20 LTS

## Integration Points

- Cloudflare — DNS proxy, SSL termination, caching layer
- Caddy — reverse proxy already installed on VPS, serving existing sites; new site block added
- Unsplash — images downloaded at build time (not runtime API calls)

## Open Questions

- Where is the Caddyfile on the VPS? — Will check during S04 execution. Likely `/etc/caddy/Caddyfile` or a `conf.d/` structure.
