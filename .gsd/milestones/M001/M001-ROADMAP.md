# M001: Launch — tsa.monster

**Vision:** Build and deploy `tsa.monster` — a real, professional Amazon affiliate review site in English, i18n-ready from day one, with 15 articles and all legally required pages — ready to submit for Amazon Associates US approval.

## Success Criteria

- `https://tsa.monster` is publicly accessible and redirects to `/en/`
- 15 real review articles published across Kitchen, Outdoor, Home, Beauty categories
- Privacy Policy, Affiliate Disclosure, About, and Contact pages present
- Affiliate disclosure visible in footer on every page and at top of every article
- `pnpm build` succeeds with no errors; `sitemap.xml` present in `dist/`
- All pages have unique `<title>`, `<meta description>`, Open Graph tags
- HTTPS working via Cloudflare + Caddy

## Key Risks / Unknowns

- Tailwind CSS v4 config API — changed significantly from v3; verify before writing config
- Caddy config location on VPS — need to inspect before adding site block

## Proof Strategy

- Tailwind v4 config → retire in S01 by building the project and confirming styles render
- Caddy config location → retire in S04 by SSHing and finding the Caddyfile before writing the block

## Verification Classes

- Contract verification: `pnpm build` succeeds, all pages in sitemap, no 404s in build output
- Integration verification: site accessible at `tsa.monster` with HTTPS, redirect from `/` to `/en/` confirmed in browser
- Operational verification: Caddy serving dist/ correctly, Cloudflare SSL Full (strict) confirmed
- UAT / human verification: visual check that home page, a category page, and one article look correct

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 4 slices complete
- `pnpm build` passes with no errors
- All 15 articles and 4 static pages accessible via browser
- `tsa.monster` resolves publicly with HTTPS
- Root `/` redirects to `/en/` in browser
- Affiliate disclosure present in footer and on every article page
- Amazon Associates US application can be submitted

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009
- Partially covers: none
- Leaves for later: R010 (other locales), R011 (real affiliate links)
- Orphan risks: none

## Slices

- [x] **S01: Astro scaffold + i18n foundation** `risk:high` `depends:[]`
  > After this: `pnpm dev` runs, `/en/` and the redirect at `/` work, Tailwind styles render, content collections schema is defined, SEO components exist.

- [ ] **S02: Static pages + home** `risk:low` `depends:[S01]`
  > After this: Home page, About, Privacy Policy, Affiliate Disclosure, and Contact are all browsable with real content and correct layout.

- [ ] **S03: 15 review articles + images** `risk:medium` `depends:[S01]`
  > After this: All 15 articles are accessible with real content, hero images, affiliate disclosure, comparison tables, and "Check on Amazon" CTAs.

- [ ] **S04: Build + deploy** `risk:medium` `depends:[S02,S03]`
  > After this: `tsa.monster` is live at the VPS, Caddy serving dist/, Cloudflare SSL working, site accessible publicly.

## Boundary Map

### S01 → S02

Produces:
- `astro.config.mjs` — i18n config with `prefixDefaultLocale: true`, locales: `['en']`, sitemap integration
- `src/i18n/config.ts` — `LOCALES`, `DEFAULT_LOCALE` constants; `getSupportedLocales()` helper
- `src/layouts/BaseLayout.astro` — accepts `title`, `description`, `ogImage`, `lang` props; renders `<html lang>`, SEO meta, OG tags, hreflang links
- `src/layouts/ArticleLayout.astro` — extends BaseLayout; renders AffiliateDisclosure, Schema.org Article/Product JSON-LD
- `src/components/Header.astro` — logo, category nav links using `getRelativeLocaleUrl()`
- `src/components/Footer.astro` — legal links, affiliate disclosure blurb
- `src/components/AffiliateDisclosure.astro` — FTC/Amazon required disclosure block
- `src/components/ArticleCard.astro` — card for listing pages (title, excerpt, category, image)
- `src/components/ProductCard.astro` — product row with star rating + CTA button
- `src/content/config.ts` — reviews collection schema (Zod): title, description, category, date, heroImage, products[]
- `src/pages/index.astro` — redirect script only (no layout, client-side `navigator.language` → `/en/`)
- `src/pages/en/index.astro` — home page shell (populated in S02)
- `public/robots.txt`, `public/_headers` — cache headers for Cloudflare

Consumes:
- nothing (first slice)

### S01 → S03

Produces:
- `src/content.config.ts` — reviews collection schema (same as above; articles depend on this shape)
- `src/pages/en/[category]/[slug].astro` — dynamic article route, renders MDX via ArticleLayout

Consumes:
- nothing (first slice)

### S02 → S04

Produces:
- `src/pages/en/about.astro`
- `src/pages/en/privacy-policy.astro`
- `src/pages/en/affiliate-disclosure.astro`
- `src/pages/en/contact.astro`
- `src/pages/en/index.astro` — fully populated home page

Consumes from S01:
- `BaseLayout.astro` → all static pages extend it
- `Header.astro`, `Footer.astro` → already wired via BaseLayout
- `ArticleCard.astro` → used on home page to list recent articles

### S03 → S04

Produces:
- `src/content/reviews/kitchen/*.mdx` (5 files)
- `src/content/reviews/outdoor/*.mdx` (4 files)
- `src/content/reviews/home/*.mdx` (3 files)
- `src/content/reviews/beauty/*.mdx` (3 files)
- `public/images/` — downloaded Unsplash hero images (one per article + category covers)

Consumes from S01:
- `src/content/config.ts` → frontmatter schema all articles must satisfy
- `src/pages/en/[category]/[slug].astro` → dynamic route that renders each MDX file
- `ArticleLayout.astro` → layout used by every article
- `ProductCard.astro` → used inside MDX for product rows
