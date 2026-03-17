---
id: S03
parent: M001
milestone: M001
provides:
  - Category listing page at src/pages/en/[category]/index.astro (fixes all 4 Header nav dead-links)
  - 15 hero JPEG images in public/images/ as local Unsplash assets
  - 5 kitchen review articles (MDX) with full editorial body and ProductCard CTAs
  - 10 outdoor/home/beauty review articles (MDX) with full editorial body and ProductCard CTAs
  - 25-page static build: 15 articles + 4 category indexes + 6 static pages (incl. root redirect)
  - sitemap-0.xml with 25 <loc> entries
requires:
  - slice: S01
    provides: src/content.config.ts (reviews schema), src/pages/en/[category]/[slug].astro (dynamic route), ArticleLayout.astro, ProductCard.astro, ArticleCard.astro
  - slice: S02
    provides: BaseLayout.astro, Header.astro, Footer.astro, AffiliateDisclosure.astro
affects:
  - S04
key_files:
  - src/pages/en/[category]/index.astro
  - src/content/reviews/kitchen/best-coffee-makers.mdx
  - src/content/reviews/kitchen/best-air-fryers.mdx
  - src/content/reviews/kitchen/best-chef-knives.mdx
  - src/content/reviews/kitchen/best-stand-mixers.mdx
  - src/content/reviews/kitchen/best-blenders.mdx
  - src/content/reviews/outdoor/best-hiking-backpacks.mdx
  - src/content/reviews/outdoor/best-camping-tents.mdx
  - src/content/reviews/outdoor/best-headlamps.mdx
  - src/content/reviews/outdoor/best-water-filters.mdx
  - src/content/reviews/home/best-robot-vacuums.mdx
  - src/content/reviews/home/best-air-purifiers.mdx
  - src/content/reviews/home/best-smart-plugs.mdx
  - src/content/reviews/beauty/best-electric-toothbrushes.mdx
  - src/content/reviews/beauty/best-face-serums.mdx
  - src/content/reviews/beauty/best-hair-dryers.mdx
  - public/images/ (15 JPEG files, 68KB–848KB each)
key_decisions:
  - All affiliateUrl values are '#' placeholder per D006 — no real affiliate links present in any article
  - Two Unsplash photo IDs returned HTML error pages; substituted with alternate photo IDs (kitchen-best-air-fryers, home-best-smart-plugs)
  - sitemap-0.xml is single-line XML — use grep -o not grep -c to count <loc> entries (K010)
patterns_established:
  - Category listing page uses getStaticPaths() with 4 hardcoded params; getCollection('reviews') filtered per category at render time
  - Slug derivation from entry.id: entry.id.split('/').pop()?.replace(/\.mdx?$/, '') — consistent with [slug].astro
  - ProductCard import path from any src/content/reviews/[category]/ file is '../../../components/ProductCard.astro' (3 levels up for all categories)
  - MDX uses JSX prop syntax for components: rating={4.8} affiliateUrl="#" — not YAML-style
  - Article body template: intro (2-3 paragraphs) → markdown comparison table → Top Picks (≥3 ProductCards) → deep-dive section → FAQ (3-4 questions) → Final Verdict
  - find dist/en -name "index.html" returns 24 (not 25) — root redirect dist/index.html is outside dist/en/; find dist -name "index.html" returns 25
observability_surfaces:
  - "pnpm build 2>&1 | grep -E '\\[ERROR\\]' | wc -l → 0 confirms clean build"
  - "grep -o '<loc>' dist/sitemap-0.xml | wc -l → 25 confirms sitemap populated"
  - "find dist/en -name 'index.html' | wc -l → 24 (+ dist/index.html = 25 total)"
  - "find public/images -name '*.jpg' -size -10k → empty confirms all images are real (not HTML error pages)"
  - "grep -c 'Check on Amazon' dist/en/[category]/[slug]/index.html → confirms ProductCard render count"
  - "grep -o 'href=\"/en/[category]/[^\"]*\"' dist/en/[category]/index.html → confirms category listing populated"
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T03-SUMMARY.md
duration: ~85m total (T01: ~15m, T02: ~35m, T03: ~35m)
verification_result: passed
completed_at: 2026-03-17
---

# S03: 15 review articles + images

**All 15 review articles published across 4 categories, 15 local hero images downloaded, category listing page live — 25-page build exits 0 with 25 sitemap entries and 0 TypeScript errors.**

## What Happened

Three tasks in sequence, each building cleanly on the last.

**T01** created the only missing structural piece: `src/pages/en/[category]/index.astro`, which closes all four dead Header nav links (`/en/kitchen/`, `/en/outdoor/`, `/en/home/`, `/en/beauty/`). The page filters `getCollection('reviews')` by category, sorts by date descending, derives slugs via `entry.id` split (K007), and renders an ArticleCard grid. An empty-state ("Reviews coming soon") handles the intermediate build state before articles exist. In parallel, 15 JPEG hero images were downloaded from Unsplash via curl. Two planned Unsplash URLs returned HTML error pages; alternate photo IDs were substituted. All 15 images confirmed real by size check (`find public/images -name "*.jpg" -size -10k` returns empty).

**T02** wrote the 5 kitchen articles (best-coffee-makers, best-air-fryers, best-chef-knives, best-stand-mixers, best-blenders). This validated the full article pipeline: frontmatter schema → MDX parse → ArticleLayout → ProductCard render → category listing population. Build exited 0 in under 6 seconds. ProductCard import path `'../../../components/ProductCard.astro'` confirmed correct for the `src/content/reviews/kitchen/` depth.

**T03** wrote the remaining 10 articles across outdoor (×4), home (×3), and beauty (×3), then ran the full slice acceptance gate. Build produced exactly 25 pages. `grep -o "<loc>" dist/sitemap-0.xml | wc -l` confirmed 25 sitemap entries. `pnpm astro check` confirmed 0 errors, 0 warnings, 0 hints across 19 files.

## Verification

```bash
# Build exits 0, 25 pages
pnpm build 2>&1 | tail -3
# → [build] 25 page(s) built in 4.62s  [build] Complete!

# Zero errors
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0

# All 4 category index routes
ls dist/en/kitchen/index.html dist/en/outdoor/index.html \
   dist/en/home/index.html dist/en/beauty/index.html   # all present

# Spot-check article routes
ls dist/en/kitchen/best-coffee-makers/index.html   # present
ls dist/en/outdoor/best-hiking-backpacks/index.html # present
ls dist/en/beauty/best-hair-dryers/index.html       # present

# Sitemap (single-line XML — use grep -o)
grep -o "<loc>" dist/sitemap-0.xml | wc -l   # → 25

# Total routes
find dist -name "index.html" | wc -l   # → 25

# TypeScript
pnpm astro check 2>&1 | tail -3
# → 0 errors, 0 warnings, 0 hints

# Images all real
find public/images -name "*.jpg" -size -10k   # → empty

# ProductCard renders
grep -c "Check on Amazon" dist/en/kitchen/best-coffee-makers/index.html   # → 4
grep -c "Check on Amazon" dist/en/outdoor/best-hiking-backpacks/index.html # → 4
grep -c "Check on Amazon" dist/en/beauty/best-hair-dryers/index.html       # → 3

# Category listing populated
grep -o 'href="/en/kitchen/[^"]*"' dist/en/kitchen/index.html | sort | uniq
# → /en/kitchen/ + 5 distinct article URLs
```

## Requirements Advanced

- R004 — Category nav links now resolve to real listing pages (previously 404s); home page article grid now populated with 15 real articles

## Requirements Validated

- R002 — 15 MDX articles built and routed across all 4 categories. Each has real content: intro, comparison table, ≥3 ProductCard CTAs, FAQ, Final Verdict. pnpm build 0 errors. No lorem ipsum.
- R005 — All 15 articles have unique title/description via frontmatter → ArticleLayout → BaseLayout. sitemap-0.xml has 25 entries covering every route. Schema.org JSON-LD in ArticleLayout. Hero images include alt text via heroImage frontmatter field.
- R009 — 15 JPEG hero images as local assets in public/images/. All confirmed real by size check. Two substituted Unsplash photo IDs documented.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Two Unsplash photo IDs in the original plan returned HTML error pages (~4KB). Substituted: `kitchen-best-air-fryers.jpg` (plan: `photo-1648049321660`, used: `photo-1585515320310`) and `home-best-smart-plugs.jpg` (plan: `photo-1558618047`, used: `photo-1558002038`).
- `find dist/en -name "index.html" | wc -l` returns 24, not 25 as stated in the slice plan. The 25th file is `dist/index.html` (root redirect) which lives outside `dist/en/`. `find dist -name "index.html" | wc -l` correctly returns 25. This is a documentation inaccuracy in the plan — the actual route count is correct.
- The ArticleCard component renders "Read more" across two lines in minified HTML, so `grep -c "Read more"` returns 10 for 5 cards. Use `grep -o 'href="/en/[category]/[^"]*"'` instead to count distinct article links.

## Known Limitations

- All 15 `affiliateUrl` values are `'#'` — no tracking links. This is intentional per D006 until Amazon Associates approval.
- Hero images are lifestyle/ambient Unsplash photos, not product-specific photos. Adequate for Associates review but not ideal for long-term SEO click-through.
- Article content is agent-generated — factual claims about product specs should be verified before the site is submitted for Associates review. Ratings and product names are plausible but not sourced from verified databases.

## Follow-ups

- S04 (build + deploy) is the only remaining slice. The `dist/` output from this slice is the artifact S04 deploys.
- After Associates approval: replace `affiliateUrl: '#'` with real tracking links across all 15 articles (R011).
- Consider adding product-specific images post-approval (R012 deferred, but lifestyle-only images are a weaker click driver).

## Files Created/Modified

- `src/pages/en/[category]/index.astro` — new; category listing with getStaticPaths() for 4 categories, ArticleCard grid, empty-state
- `public/images/kitchen-best-coffee-makers.jpg` — 116KB hero
- `public/images/kitchen-best-air-fryers.jpg` — 192KB hero (substituted Unsplash URL)
- `public/images/kitchen-best-chef-knives.jpg` — 88KB hero
- `public/images/kitchen-best-stand-mixers.jpg` — 104KB hero
- `public/images/kitchen-best-blenders.jpg` — 160KB hero
- `public/images/outdoor-best-hiking-backpacks.jpg` — 848KB hero
- `public/images/outdoor-best-camping-tents.jpg` — 188KB hero
- `public/images/outdoor-best-headlamps.jpg` — 296KB hero
- `public/images/outdoor-best-water-filters.jpg` — 124KB hero
- `public/images/home-best-robot-vacuums.jpg` — 116KB hero
- `public/images/home-best-air-purifiers.jpg` — 72KB hero
- `public/images/home-best-smart-plugs.jpg` — 68KB hero (substituted Unsplash URL)
- `public/images/beauty-best-electric-toothbrushes.jpg` — 104KB hero
- `public/images/beauty-best-face-serums.jpg` — 108KB hero
- `public/images/beauty-best-hair-dryers.jpg` — 248KB hero
- `src/content/reviews/kitchen/best-coffee-makers.mdx` — 4 products (Breville, Fellow Stagg, Bialetti, Cuisinart)
- `src/content/reviews/kitchen/best-air-fryers.mdx` — 3 products (Ninja, Cosori, DASH)
- `src/content/reviews/kitchen/best-chef-knives.mdx` — 4 products (Victorinox, Wüsthof, MAC, Global)
- `src/content/reviews/kitchen/best-stand-mixers.mdx` — 3 products (KitchenAid, Ankarsrum, Cuisinart SM-50)
- `src/content/reviews/kitchen/best-blenders.mdx` — 4 products (Vitamix, Blendtec, Ninja, NutriBullet)
- `src/content/reviews/outdoor/best-hiking-backpacks.mdx` — 4 products (~6.9KB)
- `src/content/reviews/outdoor/best-camping-tents.mdx` — 4 products (~7.0KB)
- `src/content/reviews/outdoor/best-headlamps.mdx` — 3 products (~6.6KB)
- `src/content/reviews/outdoor/best-water-filters.mdx` — 4 products (~7.6KB)
- `src/content/reviews/home/best-robot-vacuums.mdx` — 3 products (~6.8KB)
- `src/content/reviews/home/best-air-purifiers.mdx` — 3 products (~7.0KB)
- `src/content/reviews/home/best-smart-plugs.mdx` — 3 products (~6.8KB)
- `src/content/reviews/beauty/best-electric-toothbrushes.mdx` — 3 products (~7.3KB)
- `src/content/reviews/beauty/best-face-serums.mdx` — 3 products (~7.8KB)
- `src/content/reviews/beauty/best-hair-dryers.mdx` — 3 products (~7.7KB)

## Forward Intelligence

### What the next slice should know
- `dist/` is fully built and contains all 25 routes. S04 copies this directory to the VPS — no additional build step should be needed unless source files change.
- The `dist/sitemap-0.xml` is single-line XML. Any grep on it must use `grep -o` not `grep -c` (K010).
- `outdoor-best-hiking-backpacks.jpg` is 848KB — the only image that could be a performance concern. All others are under 300KB. Worth noting if Core Web Vitals become a concern post-deploy.
- All 4 category nav links now resolve — the site is structurally complete from a navigation standpoint.

### What's fragile
- Agent-generated article content — product names and ratings are plausible but unverified. Spot-check before submitting Associates application; Amazon may reject sites with obviously incorrect product claims.
- The two substituted Unsplash photos (air fryers, smart plugs) may not be as directly relevant as the original intended photos. Cosmetically acceptable but worth reviewing visually.

### Authoritative diagnostics
- `pnpm build 2>&1 | grep '\[ERROR\]'` — primary failure signal; schema violations produce `[ERROR] Invalid content entry "category/slug.mdx"` with the offending file path
- `grep -o "<loc>" dist/sitemap-0.xml | wc -l` — sitemap count (must use grep -o, not grep -c)
- `find public/images -name "*.jpg" -size -10k` — detects failed Unsplash downloads (HTML error pages are <10KB)

### What assumptions changed
- The slice plan's `find dist/en -name "index.html" | wc -l → 25` is wrong; root redirect lives at `dist/index.html` outside `dist/en/`. Correct command is `find dist -name "index.html" | wc -l → 25`.
