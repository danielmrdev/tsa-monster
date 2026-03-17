---
id: S01
parent: M001
milestone: M001
provides:
  - Buildable Astro 6 project scaffold with Tailwind v4, i18n, content schema, layouts, components, and public files
  - src/content.config.ts — reviews collection schema (contract for S03 MDX articles)
  - src/layouts/BaseLayout.astro — full SEO head, canonical, OG, hreflang, Google Fonts, header/footer slot
  - src/layouts/ArticleLayout.astro — extends BaseLayout, AffiliateDisclosure above slot, Schema.org JSON-LD
  - src/components/{Header,Footer,AffiliateDisclosure,ArticleCard,ProductCard}.astro — all shared components
  - src/pages/index.astro — client-side redirect (navigator.language → /en/)
  - src/pages/en/index.astro — styled shell using BaseLayout
  - src/pages/en/[category]/[slug].astro — dynamic article route (contract for S03)
  - public/robots.txt, public/_headers — crawlers + Cloudflare cache directives
requires: []
affects:
  - S02
  - S03
key_files:
  - package.json
  - astro.config.mjs
  - src/styles/global.css
  - src/i18n/config.ts
  - src/content.config.ts
  - src/layouts/BaseLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/components/AffiliateDisclosure.astro
  - src/components/ArticleCard.astro
  - src/components/ProductCard.astro
  - src/pages/index.astro
  - src/pages/en/index.astro
  - src/pages/en/[category]/[slug].astro
  - public/robots.txt
  - public/_headers
key_decisions:
  - D007: Tailwind v4 via @tailwindcss/vite Vite plugin (no @astrojs/tailwind wrapper)
  - D008: pnpm onlyBuiltDependencies for esbuild + sharp (pnpm v10 requirement)
  - D009: Amber/slate editorial color palette (#f59e0b brand, #0f172a ink, #f8fafc surface)
  - Content config at src/content.config.ts (Astro 6 root-level — NOT src/content/config.ts)
  - JSON-LD script tags use is:inline to suppress Astro hint 4000
  - Slug derived from entry.id (not entry.slug — doesn't exist in Astro 6 glob loader)
patterns_established:
  - Tailwind v4 CSS-first: @import "tailwindcss" + @plugin + @theme {} in global.css — no tailwind.config.js
  - glob() loader from astro/loaders + z from astro/zod for Astro 6 content collections
  - BaseLayout imports global.css once; ArticleLayout extends BaseLayout (no double import)
  - getRelativeLocaleUrl() from astro:i18n in Header for all nav links
  - Dynamic route getStaticPaths() uses entry.id for slug derivation, entry.data.category for category param
  - render() imported from astro:content alongside getCollection()
  - pnpm onlyBuiltDependencies in package.json for native binary deps
  - ProductCard affiliateUrl falls back to '#' when undefined
  - Schema.org JSON-LD via <script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)}>
observability_surfaces:
  - "pnpm build 2>&1 | grep -E '\\[ERROR\\]|\\[warn\\]' — zero output means clean build"
  - "pnpm astro check — 14 files, 0 errors, 0 warnings, 0 hints"
  - "dist/_astro/BaseLayout.*.css — Tailwind custom properties (--color-brand, --color-surface) confirmed present"
  - "dist/en/index.html — inspect for og:title, canonical, application/ld+json meta"
  - "curl -s http://localhost:4321/en/ — verifies Header, Footer, nav markup in dev"
  - "[glob-loader] No files found matching — expected warning with empty collection; disappears in S03"
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
duration: ~80m (T01: 35m, T02: 30m, T03: 15m)
verification_result: passed
completed_at: 2026-03-17
---

# S01: Astro scaffold + i18n foundation

**Astro 6 project with Tailwind v4, i18n routing, content schema, all shared layouts and components, and dynamic article route — `pnpm build` exits 0, `pnpm astro check` 0 errors, 14 files checked, sitemap generated.**

## What Happened

Three tasks executed sequentially, each verified before the next began.

**T01 — Scaffold + Tailwind v4 + i18n:** The Astro scaffold CLI created a subdirectory (`apparent-ascension`) instead of scaffolding in-place because the directory contained `.git`. Files were moved up manually. pnpm v10 required explicit approval for esbuild/sharp build scripts — `onlyBuiltDependencies` added to `package.json`. Tailwind v4 wired via `@tailwindcss/vite` in `vite.plugins` (not the legacy `@astrojs/tailwind` integration). `src/styles/global.css` uses CSS-first config: `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, `@theme {}` block with custom color tokens and editorial fonts (DM Sans + DM Serif Display). i18n configured with `prefixDefaultLocale: true`, `defaultLocale: 'en'`. Root `/` serves redirect-only page with client-side `navigator.language` detection.

**T02 — Schema + layouts + components:** First build attempt with `src/content/config.ts` failed with `[LegacyContentConfigError]` — Astro 6 requires content config at `src/content.config.ts` (root-level, not inside `src/content/`). File moved; K005 added to KNOWLEDGE.md. All five components implemented: Header (dark ink with amber logo, category nav via `getRelativeLocaleUrl()`), Footer (legal links, affiliate blurb), AffiliateDisclosure (amber left-border FTC box), ArticleCard (card with hover animation, category badge, date, excerpt), ProductCard (half-star rating, "Check on Amazon" CTA defaulting to `'#'`). ArticleLayout renders AffiliateDisclosure above the prose slot, includes Schema.org Article JSON-LD via `<script is:inline type="application/ld+json">`. Color palette updated to amber/slate editorial scheme (`--color-brand: #f59e0b`).

**T03 — Dynamic route + public files + final verification:** `src/pages/en/[category]/[slug].astro` implemented with Astro 6 `render()` API and slug derived from `entry.id` (K007). With zero MDX articles, `getStaticPaths()` returns `[]` — build logs "The collection 'reviews' does not exist or is empty" but exits 0 (K008). Full slice verification ran: `pnpm build && ls dist/en/index.html && ls dist/sitemap-index.xml && ls dist/robots.txt && pnpm astro check && echo "SLICE S01 VERIFIED"` — passed.

## Verification

```
pnpm build → exit 0
  2 pages built: /en/index.html, /index.html
  sitemap-index.xml created at dist/
  No [ERROR] lines in output

ls dist/en/index.html     → exists ✓
ls dist/sitemap-index.xml → exists ✓
ls dist/robots.txt        → exists ✓

pnpm astro check → Result (14 files): 0 errors, 0 warnings, 0 hints ✓

pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' → "Build clean" (no matches) ✓

dist/_astro/BaseLayout.*.css → --color-brand:#f59e0b, --color-surface:#f8fafc, 
  --color-ink:#0f172a, --font-sans, --font-display — all custom properties present ✓

pnpm build 2>&1 | grep -i 'category|slug' → no dynamic route errors ✓
```

## Requirements Advanced

- R001 — Astro static site with i18n routing: fully implemented. `prefixDefaultLocale: true`, all pages under `/en/`, redirect at `/`.
- R005 — SEO technical foundation: BaseLayout delivers canonical URLs, OG tags, Twitter Card, hreflang for en + x-default, sitemap link. ArticleLayout adds Schema.org Article JSON-LD. `@astrojs/sitemap` generates `sitemap-index.xml`.
- R006 — Language auto-redirect: client-side script at `/` using `navigator.language` + `navigator.languages`. LOCALES array driven — adding a locale in config automatically extends the redirect logic.
- R007 — Cache headers: `public/_headers` with immutable `/_astro/*` (31536000s) and short-TTL `/*.html` (3600s client / 86400s CDN).

## Requirements Validated

- R001 — `pnpm build` exits 0. `/en/index.html` present. i18n routing confirmed in build output. Redirect script at `/` reads `navigator.language`. Contract: validated by build verification.
- R006 — Redirect script confirmed in `src/pages/index.astro` source and via dev server curl. LOCALES array in `src/i18n/config.ts` drives the redirect — isSupportedLocale check before redirect. Validated.
- R007 — `public/_headers` present and in correct Cloudflare Pages syntax. Confirmed in `dist/_headers`. Validated.
- R005 (partial) — BaseLayout canonical, OG, hreflang, sitemap confirmed in `dist/en/index.html`. Full validation (all 15 articles + static pages) completes in S02/S03.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- **Scaffold directory**: `pnpm create astro@latest .` created `./apparent-ascension` instead of scaffolding in-place. Fixed by moving files up manually. Documented as K001.
- **Content config path**: Plan said `src/content/config.ts`; Astro 6 requires `src/content.config.ts`. Build failed on first attempt with `[LegacyContentConfigError]`. Fixed and documented as K005.
- **Color palette**: Updated from placeholder blue (`#2563eb`) to amber/slate editorial scheme (`#f59e0b`) in T02. More distinctive than generic blue; aligns with editorial review site aesthetic. All component tokens updated consistently.
- **`@astrojs/check` + `typescript` install**: Not in original dep list. Required for `pnpm astro check` (which prompted interactively without it). Added as devDependencies.
- **Import path correction**: Plan showed `'../../../styles/global.css'` (3 levels) from `src/pages/en/`; correct is `'../../styles/global.css'` (2 levels). Fixed before first build attempt.

## Known Limitations

- Browser tools (`browser_*`) are unavailable in this environment (`libnspr4.so` missing). Runtime browser verification done via `curl` — confirms HTML structure but not visual rendering. Redirect behavior verified by reading source and curl output rather than live browser observation.
- Empty content collection emits a `[WARN] [glob-loader]` line in `pnpm build` and "The collection 'reviews' does not exist or is empty" at route generation. Both are expected and will disappear when S03 populates `src/content/reviews/`.
- `dist/_headers` is the correct location for Cloudflare Pages. When deploying via Caddy (S04), these directives won't be read automatically — the S04 deployer should check whether Caddy needs equivalent cache headers configured separately.

## Follow-ups

- S04 deployer: check if `_headers` cache directives need mirroring in Caddy config, or if Cloudflare reads them from the Cloudflare Pages edge (not via Caddy). The file is correct for Cloudflare Pages; behavior via Caddy pass-through is untested.
- After S03 adds articles, verify that `[category]/[slug]` routes generate correctly by running `pnpm build` and checking `dist/en/kitchen/`, `dist/en/outdoor/`, etc.

## Files Created/Modified

- `package.json` — project config, all deps, pnpm onlyBuiltDependencies (esbuild, sharp)
- `.npmrc` — `unsafe-perm=true` for build script execution
- `astro.config.mjs` — static output, site URL, i18n routing, Vite Tailwind plugin, mdx + sitemap integrations
- `src/styles/global.css` — Tailwind v4 CSS-first config, amber/slate editorial palette, DM Sans + DM Serif Display
- `src/i18n/config.ts` — LOCALES, DEFAULT_LOCALE, getSupportedLocales(), isSupportedLocale()
- `src/content.config.ts` — reviews collection schema with glob loader (Astro 6 root-level)
- `src/content/reviews/{kitchen,outdoor,home,beauty}/.gitkeep` — empty category dirs tracked by git
- `src/layouts/BaseLayout.astro` — shared page shell with full SEO head
- `src/layouts/ArticleLayout.astro` — article shell extending BaseLayout with JSON-LD and prose wrapper
- `src/components/Header.astro` — dark header with amber logo and i18n nav links
- `src/components/Footer.astro` — legal nav, affiliate blurb, copyright
- `src/components/AffiliateDisclosure.astro` — FTC/Amazon disclosure box
- `src/components/ArticleCard.astro` — listing card with image, badge, date, excerpt, CTA
- `src/components/ProductCard.astro` — product row with half-star rating and Amazon CTA
- `src/pages/index.astro` — redirect-only page (client-side locale detection)
- `src/pages/en/index.astro` — styled shell using BaseLayout
- `src/pages/en/[category]/[slug].astro` — dynamic article route using Astro 6 render() API
- `public/robots.txt` — allow-all + sitemap-index.xml reference
- `public/_headers` — Cloudflare Pages cache directives
- `.gsd/KNOWLEDGE.md` — K001–K008 documented
- `.gsd/DECISIONS.md` — D007, D008 appended

## Forward Intelligence

### What the next slice should know

- **Content config location is `src/content.config.ts`** — not `src/content/config.ts`. This trips up every Astro 6 newcomer and is not well-documented. K005.
- **`entry.slug` does not exist in Astro 6** glob loader. Use `entry.id.split('/').pop()?.replace(/\.mdx?$/, '')`. K007.
- **The reviews schema in `src/content.config.ts`** defines the frontmatter contract S03 must satisfy. Key fields: `title` (string), `description` (string, max 160), `category` (enum: kitchen|outdoor|home|beauty), `date` (date), `heroImage` (string — path relative to public/images/), `excerpt` (string, max 200), `products` (array of `{name, rating (1–5), description, affiliateUrl?}`).
- **ArticleLayout** wraps content in `prose prose-slate max-w-none` — MDX articles don't need to add prose classes themselves.
- **ProductCard** expects `name`, `rating` (number 1–5), `description`, `affiliateUrl?`. The CTA falls back to `href="#"` when `affiliateUrl` is undefined.
- **S02 static pages** extend BaseLayout directly — they don't need ArticleLayout.
- **Header nav** links are hardcoded to kitchen/outdoor/home/beauty category slugs. If S03 adds a fifth category or renames one, Header.astro must be updated.

### What's fragile

- **Hero image field in schema** — currently accepts any string path. S03 must ensure images exist at `public/images/[path]` before build, otherwise the `<img>` will 404 at runtime but build won't error.
- **Star rating in ProductCard** — uses `Math.round(rating * 2) / 2` for half-star precision. Renders 0–10 spans. Works for rating 1–5 with 0.5 steps. Breaks silently if `rating` is outside 0–5 range — schema validation catches this at build time.
- **Empty collection warning** — will be present in every `pnpm build` until S03 adds articles. Normal, not a failure signal.

### Authoritative diagnostics

- `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` — most reliable build cleanliness signal. Zero output means clean.
- `pnpm astro check` — TypeScript diagnostics. File count goes up as content is added (14 → 14+N).
- `dist/_astro/BaseLayout.*.css` — single source of truth for Tailwind compilation. Grep for `--color-brand` to confirm theme tokens compiled.
- `dist/en/index.html` — inspect for `og:title`, `canonical`, `hreflang`, `application/ld+json` after S02 populates the home page.

### What assumptions changed

- **Content config path** — plan assumed `src/content/config.ts`; Astro 6 actually requires `src/content.config.ts`. The old path causes a `[LegacyContentConfigError]` build failure with no fallback.
- **Tailwind palette** — plan used placeholder blue `#2563eb`; actual implementation chose amber `#f59e0b` for a more distinctive editorial aesthetic. All component class references are consistent with the amber palette.
- **pnpm v10 build scripts** — plan didn't anticipate the need for `onlyBuiltDependencies`. Without it, esbuild silently lacks its platform binary and Vite fails to start.
