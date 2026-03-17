---
id: T02
parent: S01
milestone: M001
provides:
  - Content collection schema for reviews (contract for S03)
  - BaseLayout.astro and ArticleLayout.astro (contract for S02/S03)
  - All five shared components (Header, Footer, AffiliateDisclosure, ArticleCard, ProductCard)
  - Updated index.astro using BaseLayout
key_files:
  - src/content.config.ts
  - src/layouts/BaseLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/components/AffiliateDisclosure.astro
  - src/components/ArticleCard.astro
  - src/components/ProductCard.astro
  - src/pages/en/index.astro
  - src/styles/global.css
key_decisions:
  - Content config lives at src/content.config.ts (not src/content/config.ts) per Astro 6 requirement
  - JSON-LD script uses is:inline to suppress Astro hint 4000
  - Amber/slate editorial color palette chosen for brand aesthetic (replaces placeholder blue)
  - Half-star rating computed client-side via Math.round(rating * 2) / 2 pattern
patterns_established:
  - glob() loader from astro/loaders + z from astro/zod pattern for Astro 6 content collections
  - BaseLayout imports global.css once; ArticleLayout extends BaseLayout (no double import)
  - getRelativeLocaleUrl() from astro:i18n used in Header for all nav links
  - ProductCard affiliateUrl falls back to '#' when undefined
  - Schema.org JSON-LD in ArticleLayout via <script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)}>
observability_surfaces:
  - pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' — zero output means clean build
  - pnpm astro check — TypeScript + Astro diagnostics; must report 0 errors, 0 warnings, 0 hints
  - dist/en/index.html — inspect for correct Layout wrapper, SEO meta, OG tags, canonical URL
  - dist/_astro/*.css — inspect for Tailwind custom properties (--color-brand, --color-surface-dark)
  - curl -s http://localhost:4321/en/ | grep 'TSA Monster' — verifies BaseLayout renders in dev
duration: 30m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T02: Define content schema, write all layouts and components

**Content schema, all layouts, and all five shared components written and verified — `pnpm build` exits 0, `pnpm astro check` reports zero errors/warnings/hints.**

## What Happened

Implemented all files specified in the T02 plan:

1. **Content schema** — created `src/content.config.ts` (Astro 6 root-level location, NOT `src/content/config.ts`) with `reviews` collection using `loader: glob()` from `astro/loaders` and `z` from `astro/zod`. The schema covers all required fields: title, description, category enum, date, heroImage, excerpt, and products array with rating, affiliateUrl.

2. **Category directories** — created `.gitkeep` files in `src/content/reviews/{kitchen,outdoor,home,beauty}/`. The glob loader emits an expected `[WARN]` about no matching files; this is benign.

3. **BaseLayout.astro** — full SEO head (canonical, OG, Twitter Card, hreflang for en + x-default, sitemap link), Google Fonts preconnect for DM Sans + DM Serif Display, `<slot name="head" />` for page-specific additions. Imports `../styles/global.css` once.

4. **ArticleLayout.astro** — extends BaseLayout; renders AffiliateDisclosure above slot; Schema.org Article JSON-LD via `<script is:inline type="application/ld+json">` (required to suppress Astro hint 4000); wraps slot in `prose prose-slate max-w-none` div.

5. **Header.astro** — dark ink header with amber logo, category nav using `getRelativeLocaleUrl()` from `astro:i18n`.

6. **Footer.astro** — legal nav links, Amazon affiliate disclosure blurb, copyright line.

7. **AffiliateDisclosure.astro** — visually distinct amber left-bordered box with FTC/Amazon required disclosure text.

8. **ArticleCard.astro** — card with hover scale image, category badge, date, title, excerpt, "Read more" CTA.

9. **ProductCard.astro** — star rating display (full/half/empty via Math.round(rating * 2) / 2), "Check on Amazon" CTA defaulting to `'#'` when `affiliateUrl` undefined.

10. **index.astro** — replaced inline HTML with BaseLayout import per plan.

11. **global.css** — updated color palette to amber/slate editorial scheme (brand: #f59e0b) with DM Sans + DM Serif Display fonts. This is a deviation from the original placeholder blue — the new scheme is more distinctive per the frontend-design skill.

## Verification

```
pnpm build → exit 0 (2 pages built: /en/index.html, /index.html; sitemap-index.xml created)
pnpm astro check → Result (13 files): 0 errors, 0 warnings, 0 hints
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' → "Build clean"
ls dist/en/index.html dist/sitemap-index.xml → both present
```

## Diagnostics

- **Build errors**: `pnpm build` prints `[ERROR]` lines to stderr with file + line refs. `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` should output nothing on a clean build.
- **TypeScript errors**: `pnpm astro check` emits `error TS` lines; non-zero exit signals failure. After this task, 13 files checked with 0 errors.
- **Layout rendering**: `grep 'og:title\|canonical\|application/ld+json' dist/en/index.html` confirms SEO meta presence.
- **Tailwind**: `grep 'text-brand\|bg-surface' dist/_astro/*.css` confirms custom properties compiled.
- **Content schema**: `pnpm astro check` catches schema type mismatches before articles are added.

## Deviations

- **Content config path**: Plan said `src/content/config.ts` but Astro 6 requires `src/content.config.ts`. First build attempt failed with `[LegacyContentConfigError]`. File was moved to correct location. (K005 added to KNOWLEDGE.md)
- **Color palette**: Updated `global.css` from placeholder blue (`#2563eb`) to amber/slate editorial palette (`#f59e0b`) per frontend-design skill aesthetic guidance. All class references in new components use the updated tokens.

## Known Issues

None.

## Files Created/Modified

- `src/content.config.ts` — reviews collection schema with glob loader (Astro 6 root-level location)
- `src/content/reviews/kitchen/.gitkeep` — empty dir tracked by git
- `src/content/reviews/outdoor/.gitkeep` — empty dir tracked by git
- `src/content/reviews/home/.gitkeep` — empty dir tracked by git
- `src/content/reviews/beauty/.gitkeep` — empty dir tracked by git
- `src/layouts/BaseLayout.astro` — shared page shell with full SEO head, imports global.css
- `src/layouts/ArticleLayout.astro` — article shell extending BaseLayout with JSON-LD and prose wrapper
- `src/components/Header.astro` — dark header with amber logo and i18n nav links
- `src/components/Footer.astro` — legal nav, affiliate blurb, copyright
- `src/components/AffiliateDisclosure.astro` — FTC disclosure box
- `src/components/ArticleCard.astro` — listing card with image, badge, date, excerpt, CTA
- `src/components/ProductCard.astro` — product row with half-star rating and Amazon CTA
- `src/pages/en/index.astro` — updated to import and use BaseLayout
- `src/styles/global.css` — updated to amber/slate editorial palette with editorial fonts
