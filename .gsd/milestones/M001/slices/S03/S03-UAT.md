# S03: 15 review articles + images — UAT

**Milestone:** M001
**Written:** 2026-03-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S03 produces only static files (MDX articles + images). All correctness is verifiable from `pnpm build` output, built HTML, and sitemap — no live server or human visual design review is required for acceptance. The browser-tools environment constraint (K004) makes curl + file inspection the appropriate verification path.

## Preconditions

- `pnpm build` has completed successfully (exit 0)
- `dist/` directory exists and is populated
- All 15 `.jpg` files are present in `public/images/`

## Smoke Test

```bash
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0
find dist -name "index.html" | wc -l              # → 25
```

If either fails, the slice is broken and none of the detailed tests below are meaningful.

## Test Cases

### 1. All 4 category listing pages exist and are populated

```bash
ls dist/en/kitchen/index.html dist/en/outdoor/index.html \
   dist/en/home/index.html dist/en/beauty/index.html
```
**Expected:** All 4 files present, no "No such file" errors.

```bash
grep -o 'href="/en/kitchen/[^"]*"' dist/en/kitchen/index.html | grep -v 'href="/en/kitchen/"' | wc -l
```
**Expected:** 5 (one link per kitchen article).

```bash
grep -o 'href="/en/outdoor/[^"]*"' dist/en/outdoor/index.html | grep -v 'href="/en/outdoor/"' | wc -l
```
**Expected:** 4 (one link per outdoor article).

```bash
grep -o 'href="/en/home/[^"]*"' dist/en/home/index.html | grep -v 'href="/en/home/"' | wc -l
```
**Expected:** 3 (one link per home article).

```bash
grep -o 'href="/en/beauty/[^"]*"' dist/en/beauty/index.html | grep -v 'href="/en/beauty/"' | wc -l
```
**Expected:** 3 (one link per beauty article).

---

### 2. All 15 article routes exist in dist/

```bash
# Kitchen (5)
ls dist/en/kitchen/best-coffee-makers/index.html \
   dist/en/kitchen/best-air-fryers/index.html \
   dist/en/kitchen/best-chef-knives/index.html \
   dist/en/kitchen/best-stand-mixers/index.html \
   dist/en/kitchen/best-blenders/index.html

# Outdoor (4)
ls dist/en/outdoor/best-hiking-backpacks/index.html \
   dist/en/outdoor/best-camping-tents/index.html \
   dist/en/outdoor/best-headlamps/index.html \
   dist/en/outdoor/best-water-filters/index.html

# Home (3)
ls dist/en/home/best-robot-vacuums/index.html \
   dist/en/home/best-air-purifiers/index.html \
   dist/en/home/best-smart-plugs/index.html

# Beauty (3)
ls dist/en/beauty/best-electric-toothbrushes/index.html \
   dist/en/beauty/best-face-serums/index.html \
   dist/en/beauty/best-hair-dryers/index.html
```
**Expected:** All 15 files present, no "No such file" errors.

---

### 3. ProductCard CTAs render in article HTML

```bash
grep -c "Check on Amazon" dist/en/kitchen/best-coffee-makers/index.html
grep -c "Check on Amazon" dist/en/kitchen/best-blenders/index.html
grep -c "Check on Amazon" dist/en/outdoor/best-hiking-backpacks/index.html
grep -c "Check on Amazon" dist/en/home/best-robot-vacuums/index.html
grep -c "Check on Amazon" dist/en/beauty/best-hair-dryers/index.html
```
**Expected:** Each returns ≥3 (one per ProductCard in each article).

---

### 4. Hero images present and valid

```bash
ls public/images/*.jpg | wc -l
```
**Expected:** 15

```bash
find public/images -name "*.jpg" -size -10k
```
**Expected:** Empty output (any file <10KB is a failed download — HTML error page).

---

### 5. Sitemap contains all routes

```bash
grep -o "<loc>" dist/sitemap-0.xml | wc -l
```
**Expected:** 25

Spot-check that article URLs are present:
```bash
grep "en/kitchen/best-coffee-makers" dist/sitemap-0.xml | wc -c
grep "en/outdoor/best-hiking-backpacks" dist/sitemap-0.xml | wc -c
grep "en/beauty/best-hair-dryers" dist/sitemap-0.xml | wc -c
```
**Expected:** Each returns >0 (URL string present in sitemap).

---

### 6. Affiliate disclosure appears on article pages

```bash
grep -i "affiliate" dist/en/kitchen/best-coffee-makers/index.html | wc -l
grep -i "affiliate" dist/en/outdoor/best-camping-tents/index.html | wc -l
```
**Expected:** ≥1 for each (AffiliateDisclosure component rendered by ArticleLayout).

---

### 7. All affiliate CTAs use placeholder href

```bash
grep 'affiliateUrl="#"' src/content/reviews/kitchen/best-coffee-makers.mdx
grep -l 'affiliateUrl="#"' src/content/reviews/**/*.mdx | wc -l
```
**Expected:** Second command returns 15 (all articles use placeholder).

No real Amazon tracking links should be present:
```bash
grep -r "amazon.com/dp/" src/content/reviews/ | wc -l
```
**Expected:** 0

---

### 8. TypeScript is clean

```bash
pnpm astro check 2>&1 | tail -3
```
**Expected:** `0 errors, 0 warnings, 0 hints`

---

### 9. Meta tags present in article pages

```bash
grep -o '<title>[^<]*</title>' dist/en/kitchen/best-coffee-makers/index.html
grep -o '<meta name="description" content="[^"]*"' dist/en/kitchen/best-coffee-makers/index.html
```
**Expected:** `<title>` is non-empty and specific to the article (not generic). `<meta name="description">` is present with content ≤160 chars.

---

### 10. Category listing page handles real article data correctly

```bash
grep -o 'href="/en/kitchen/[^"]*"' dist/en/kitchen/index.html
```
**Expected:** Contains exactly 6 hrefs — `/en/kitchen/` (self-link, if any) + 5 distinct article paths. No orphaned `/en/kitchen/#` placeholder links.

## Edge Cases

### Failed Unsplash image download detection

```bash
find public/images -name "*.jpg" -size -10k
```
**Expected:** Empty. If any file appears, it was a failed download (HTML error page). Replace by re-downloading from a valid Unsplash URL.

---

### Empty category graceful fallback

If any article files were removed:
```bash
rm -f src/content/reviews/beauty/*.mdx
pnpm build 2>&1 | grep '\[ERROR\]' | wc -l
grep "Reviews coming soon" dist/en/beauty/index.html
```
**Expected:** Build still exits 0 (no [ERROR] lines). "Reviews coming soon" text appears in beauty category page (empty-state). Restore the files after testing.

---

### sitemap grep -c trap

```bash
grep -c "<loc>" dist/sitemap-0.xml   # → 1 (WRONG — always 1 for single-line XML)
grep -o "<loc>" dist/sitemap-0.xml | wc -l   # → 25 (CORRECT)
```
**Note:** `grep -c` counts matching lines, not occurrences. sitemap-0.xml is single-line — always use `grep -o ... | wc -l`.

## Failure Signals

- `pnpm build 2>&1 | grep '\[ERROR\]'` returns any output → schema validation failure; the error message includes the offending MDX file path
- `find dist/en/[category]/[slug] -name "index.html"` returns empty → article route not built; check frontmatter category field matches the directory name
- `grep -c "Check on Amazon" dist/en/[category]/[slug]/index.html` returns 0 → ProductCard import path wrong or MDX component syntax error; check `../../../components/ProductCard.astro` path
- `find public/images -name "*.jpg" -size -10k` returns any file → failed Unsplash download; re-run curl with a valid photo URL
- `grep -o "<loc>" dist/sitemap-0.xml | wc -l` returns <25 → some routes missing from sitemap; check @astrojs/sitemap configuration in astro.config.mjs

## Requirements Proved By This UAT

- R002 — 15 MDX articles built and routed with real content, comparison tables, ProductCard CTAs, FAQ sections, and Final Verdicts across all 4 categories
- R005 — Unique title/description per article, sitemap with 25 entries, Schema.org JSON-LD via ArticleLayout, hero image alt text
- R009 — 15 local JPEG hero images confirmed present and valid (not hotlinked, not HTML error pages)

## Not Proven By This UAT

- Live HTTPS access at `tsa.monster` — requires S04 (deploy)
- Visual rendering quality of article pages — browser-tools unavailable in this environment (K004); human spot-check recommended via `pnpm dev` locally
- Real affiliate link click-through — all CTAs use `#` placeholder per D006
- ProductCard star rating visual rendering — confirmed via grep/HTML inspection only, not visual screenshot

## Notes for Tester

- `outdoor-best-hiking-backpacks.jpg` is 848KB — notably larger than other images. Worth visually checking it loads acceptably in `pnpm dev` before deploy.
- Two hero images use substitute Unsplash photo IDs (kitchen-best-air-fryers, home-best-smart-plugs). Check they're visually appropriate for their category.
- Article content is agent-generated. Product names (Breville, Victorinox, Vitamix, etc.) are real brands but spec claims (ratings, features) should be spot-checked before Associates application submission.
- The `find dist/en -name "index.html" | wc -l` diagnostic returns 24, not 25 — this is expected and correct. The root redirect (`dist/index.html`) lives outside `dist/en/`. Total is confirmed at 25 by `find dist -name "index.html" | wc -l`.
