# S03: 15 review articles + images

**Goal:** Publish all 15 review articles across kitchen (×5), outdoor (×4), home (×3), and beauty (×3) categories, with hero images, ProductCard CTAs, comparison tables, and affiliate disclosures — plus the missing category listing page that makes the Header nav functional.
**Demo:** `pnpm build` produces 25 pages: 15 article routes + 4 category index routes + 6 existing pages. `dist/en/kitchen/index.html`, `dist/en/outdoor/index.html`, `dist/en/home/index.html`, `dist/en/beauty/index.html` all exist. `dist/en/kitchen/best-coffee-makers/index.html` exists. Sitemap contains 25+ `<loc>` entries.

## Must-Haves

- Category listing page at `src/pages/en/[category]/index.astro` exists and renders article grids for all 4 categories
- 15 hero images downloaded to `public/images/` and referenced by correct paths in frontmatter
- All 15 MDX articles satisfy the `src/content.config.ts` schema exactly (title, description ≤160 chars, category enum, date, heroImage, excerpt ≤200 chars, products array with rating 1–5)
- Each article body includes: introduction, comparison table, ≥3 ProductCard components, FAQ section, Final Verdict
- All `affiliateUrl` values are `'#'` (placeholder per D006)
- `pnpm build` exits 0 with zero `[ERROR]` lines

## Verification

```bash
# Full build — must exit 0
pnpm build 2>&1 | tail -5

# Zero errors — if non-zero, inspect: pnpm build 2>&1 | grep '\[ERROR\]' for file path and error type
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0

# Failure-path check: schema errors surface as [ERROR] Invalid content entry; missing images render as broken <img src="">
# Run this to isolate any schema validation failures before checking route existence:
pnpm build 2>&1 | grep '\[ERROR\]'   # must return empty

# Category index pages exist (nav links not 404)
ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html

# Spot-check article route exists
ls dist/en/kitchen/best-coffee-makers/index.html
ls dist/en/outdoor/best-hiking-backpacks/index.html
ls dist/en/beauty/best-hair-dryers/index.html

# Sitemap has all article + category URLs (expect ≥25 locs)
grep -c "<loc>" dist/sitemap-0.xml

# TypeScript clean
pnpm astro check 2>&1 | tail -3
```

## Observability / Diagnostics

**Runtime signals:**
- `pnpm build 2>&1 | grep -E '\[ERROR\]'` — primary failure surface; zero lines = clean
- `pnpm astro check 2>&1 | tail -3` — TypeScript type errors surfaced here
- `find public/images -name "*.jpg" -size -10k` — detects failed image downloads (HTML error pages land as <1KB files)
- `ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html` — confirms all 4 category routes rendered
- `grep -c "<loc>" dist/sitemap-0.xml` — confirms sitemap populated (expect ≥25 after all articles present)

**Inspection surfaces:**
- `dist/en/[category]/index.html` — render category listing page; grep for article titles to confirm collection filtering works
- `dist/en/kitchen/best-coffee-makers/index.html` — spot-check article build output; grep for ProductCard CTA links
- `pnpm build 2>&1 | grep -E 'warn|error|fail'` — surfaces schema validation warnings and MDX parse errors

**Failure state:**
- MDX frontmatter schema violations produce `[ERROR] Invalid content entry` with the file path — grep `[ERROR]` in build output
- Missing heroImage file path doesn't fail build but produces broken img tags — inspect rendered HTML for empty `src`
- A `<1KB .jpg` file in `public/images/` means curl downloaded an HTML error page — `find public/images -name "*.jpg" -size -10k` catches this

**Redaction:** No secrets in this slice. Affiliate URLs are all `'#'` placeholders.

**Diagnostic failure check:**
```bash
# Detect schema validation errors in build (must return 0)
pnpm build 2>&1 | grep -c '\[ERROR\]'   # → 0

# Detect failed image downloads (must return empty)
find public/images -name "*.jpg" -size -10k

# Inspect category listing page rendered output
grep -o 'href="/en/kitchen/[^"]*"' dist/en/kitchen/index.html | head -10

# Count sitemap <loc> entries — use grep -o, NOT grep -c, because sitemap-0.xml is single-line XML
# grep -c always returns 1 for a single-line file regardless of match count
grep -o "<loc>" dist/sitemap-0.xml | wc -l   # → ≥25

# Confirm all 25 routes built (15 articles + 4 category + 6 static)
find dist/en -name "index.html" | wc -l   # → 25
```

## Integration Closure

- Upstream surfaces consumed: `src/content.config.ts` (schema contract), `src/pages/en/[category]/[slug].astro` (dynamic route), `src/layouts/ArticleLayout.astro` (prose wrapper + disclosure), `src/components/ProductCard.astro` (CTA component), `src/components/ArticleCard.astro` (category listing grid)
- New wiring introduced in this slice: `src/pages/en/[category]/index.astro` — category listing page that closes the nav dead-link gap
- What remains before the milestone is truly usable end-to-end: S04 build + deploy (Caddy + Cloudflare)

## Tasks

- [x] **T01: Create category listing page and download hero images** `est:45m`
  - Why: The category listing page is the only missing structural piece — all 4 Header nav links (`/en/kitchen/`, etc.) currently 404. Hero images must be downloaded before MDX files reference them, so path typos surface before content writing begins.
  - Files: `src/pages/en/[category]/index.astro`, `public/images/` (15 image files)
  - Do: Create the category listing page with `getStaticPaths()` returning 4 category params, filter `getCollection('reviews')` by `entry.data.category`, sort by date descending, render ArticleCard grid via BaseLayout. Download 15 Unsplash images via curl (one per article). Naming convention: `/images/[category]-[slug-prefix].jpg`.
  - Verify: `pnpm build` exits 0; `ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html` — all present; `ls public/images/*.jpg | wc -l` → 15
  - Done when: Category listing page builds without error, 4 `dist/en/[category]/index.html` files exist, 15 images present in `public/images/`

- [x] **T02: Write 5 Kitchen review articles** `est:1h30m`
  - Why: Kitchen is the largest category (5 articles) and the one most visible from the home page hero CTA. Writing these first lets us validate the full article pipeline (frontmatter schema → MDX → ArticleLayout → ProductCard) before writing the remaining 10.
  - Files: `src/content/reviews/kitchen/best-coffee-makers.mdx`, `src/content/reviews/kitchen/best-air-fryers.mdx`, `src/content/reviews/kitchen/best-chef-knives.mdx`, `src/content/reviews/kitchen/best-stand-mixers.mdx`, `src/content/reviews/kitchen/best-blenders.mdx`
  - Do: Write all 5 MDX files. Each must satisfy the schema (valid frontmatter + `heroImage` referencing a file from T01), import `ProductCard` with correct relative path (`'../../../components/ProductCard.astro'` — 3 levels up), include intro, comparison table, ≥3 ProductCard entries, FAQ section, Final Verdict. All `affiliateUrl` values are `'#'`. `rating` values between 1 and 5.
  - Verify: `pnpm build 2>&1 | grep -E '\[ERROR\]'` → 0 lines; `ls dist/en/kitchen/` shows 5 article subdirectories + `index.html`
  - Done when: 5 kitchen article routes appear in build output, `pnpm build` exits 0, no schema validation errors

- [x] **T03: Write remaining 10 articles (Outdoor ×4, Home ×3, Beauty ×3) and verify full slice** `est:2h`
  - Why: Completes the article corpus. Final `pnpm build` here is the slice's acceptance gate — all 25 routes must exist, sitemap must be populated, TypeScript must be clean.
  - Files: `src/content/reviews/outdoor/best-hiking-backpacks.mdx`, `src/content/reviews/outdoor/best-camping-tents.mdx`, `src/content/reviews/outdoor/best-headlamps.mdx`, `src/content/reviews/outdoor/best-water-filters.mdx`, `src/content/reviews/home/best-robot-vacuums.mdx`, `src/content/reviews/home/best-air-purifiers.mdx`, `src/content/reviews/home/best-smart-plugs.mdx`, `src/content/reviews/beauty/best-electric-toothbrushes.mdx`, `src/content/reviews/beauty/best-face-serums.mdx`, `src/content/reviews/beauty/best-hair-dryers.mdx`
  - Do: Write all 10 MDX files using the same pattern as T02. ProductCard import path for outdoor/home/beauty is the same (`'../../../components/ProductCard.astro'`). Verify images from T01 are referenced correctly. Run full slice verification suite on completion.
  - Verify: Full verification suite (see Verification section above) — all commands pass
  - Done when: All 15 articles + 4 category index pages exist in `dist/`, `pnpm build` exits 0 with zero `[ERROR]` lines, sitemap has ≥25 `<loc>` entries, `pnpm astro check` reports 0 errors

## Files Likely Touched

- `src/pages/en/[category]/index.astro` — new file (T01)
- `public/images/` — 15 new JPEG files (T01)
- `src/content/reviews/kitchen/best-coffee-makers.mdx` — new (T02)
- `src/content/reviews/kitchen/best-air-fryers.mdx` — new (T02)
- `src/content/reviews/kitchen/best-chef-knives.mdx` — new (T02)
- `src/content/reviews/kitchen/best-stand-mixers.mdx` — new (T02)
- `src/content/reviews/kitchen/best-blenders.mdx` — new (T02)
- `src/content/reviews/outdoor/best-hiking-backpacks.mdx` — new (T03)
- `src/content/reviews/outdoor/best-camping-tents.mdx` — new (T03)
- `src/content/reviews/outdoor/best-headlamps.mdx` — new (T03)
- `src/content/reviews/outdoor/best-water-filters.mdx` — new (T03)
- `src/content/reviews/home/best-robot-vacuums.mdx` — new (T03)
- `src/content/reviews/home/best-air-purifiers.mdx` — new (T03)
- `src/content/reviews/home/best-smart-plugs.mdx` — new (T03)
- `src/content/reviews/beauty/best-electric-toothbrushes.mdx` — new (T03)
- `src/content/reviews/beauty/best-face-serums.mdx` — new (T03)
- `src/content/reviews/beauty/best-hair-dryers.mdx` — new (T03)
