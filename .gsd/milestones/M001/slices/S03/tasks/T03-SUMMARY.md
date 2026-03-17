---
id: T03
parent: S03
milestone: M001
provides:
  - 10 complete MDX review articles across outdoor (×4), home (×3), and beauty (×3) categories
  - Full slice acceptance gate passed — 25 routes in dist/, sitemap with 25 <loc> entries, 0 TypeScript errors
key_files:
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
key_decisions:
  - All affiliateUrl values are '#' placeholder per D006; no real affiliate links
patterns_established:
  - ProductCard import path from src/content/reviews/[category]/ is '../../../components/ProductCard.astro' (same for all categories)
  - Sitemap sitemap-0.xml is single-line XML; use grep -o "<loc>" | wc -l, NOT grep -c "<loc>", to count entries
observability_surfaces:
  - pnpm build 2>&1 | grep -E '\[ERROR\]' — zero lines confirms all 10 articles pass schema validation
  - grep -o "<loc>" dist/sitemap-0.xml | wc -l — confirms sitemap entry count (returns 25)
  - find dist/en -name "index.html" | wc -l — confirms 25 routes built
  - pnpm astro check 2>&1 | tail -3 — 0 errors, 0 warnings, 0 hints
duration: ~35m
verification_result: passed
completed_at: 2025-03-17
blocker_discovered: false
---

# T03: Write remaining 10 articles (Outdoor ×4, Home ×3, Beauty ×3) and verify full slice

**Wrote all 10 remaining review articles; full slice verification passes — 25 routes built, sitemap has 25 entries, 0 TypeScript errors.**

## What Happened

All 10 MDX files written following the same pattern as T02 kitchen articles: valid frontmatter with schema-compliant fields, `ProductCard` import at `'../../../components/ProductCard.astro'`, introduction, comparison table, ≥3 ProductCard components, section-level content (fitting/care/battery/filter/app/gum health/ingredients/heat), FAQ (4+ questions), Final Verdict.

Each article references the correct heroImage path from T01 (`/images/[category]-[slug].jpg`). All images were confirmed present before writing frontmatter. All `affiliateUrl` values are `'#'` per D006.

- **Outdoor (4):** best-hiking-backpacks (4 products), best-camping-tents (4 products), best-headlamps (3 products), best-water-filters (4 products)
- **Home (3):** best-robot-vacuums (3 products), best-air-purifiers (3 products), best-smart-plugs (3 products)
- **Beauty (3):** best-electric-toothbrushes (3 products), best-face-serums (3 products), best-hair-dryers (3 products)

Build produced exactly 25 pages in 4.72s.

## Verification

```
pnpm build — exit 0, 25 pages built in 4.72s, zero [ERROR] lines
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l → 0
ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html — all 4 present
ls dist/en/kitchen/best-coffee-makers/index.html — present
ls dist/en/outdoor/best-hiking-backpacks/index.html — present
ls dist/en/home/best-robot-vacuums/index.html — present
ls dist/en/beauty/best-hair-dryers/index.html — present
grep -o "<loc>" dist/sitemap-0.xml | wc -l → 25
pnpm astro check 2>&1 | tail -3 → 0 errors, 0 warnings, 0 hints
```

All slice must-haves satisfied.

## Diagnostics

- `pnpm build 2>&1 | grep '\[ERROR\]'` — schema validation failures surface here as `[ERROR] Invalid content entry "category/slug.mdx"`, file path in error identifies which article is malformed
- `grep -o "<loc>" dist/sitemap-0.xml | wc -l` — sitemap entry count; sitemap-0.xml is single-line XML so `grep -c` always returns 1 regardless of matches — use `grep -o` + `wc -l` instead
- `find dist/en -name "index.html" | wc -l` — total route count (expect 25 after slice complete)
- `find public/images -name "*.jpg" -size -10k` — detects failed image downloads (HTML error pages <1KB); returns empty (all images valid)

## Deviations

None. All 10 articles written to spec as planned.

## Known Issues

None.

## Files Created/Modified

- `src/content/reviews/outdoor/best-hiking-backpacks.mdx` — new, 4 products, ~6.9KB
- `src/content/reviews/outdoor/best-camping-tents.mdx` — new, 4 products, ~7.0KB
- `src/content/reviews/outdoor/best-headlamps.mdx` — new, 3 products, ~6.6KB
- `src/content/reviews/outdoor/best-water-filters.mdx` — new, 4 products, ~7.6KB
- `src/content/reviews/home/best-robot-vacuums.mdx` — new, 3 products, ~6.8KB
- `src/content/reviews/home/best-air-purifiers.mdx` — new, 3 products, ~7.0KB
- `src/content/reviews/home/best-smart-plugs.mdx` — new, 3 products, ~6.8KB
- `src/content/reviews/beauty/best-electric-toothbrushes.mdx` — new, 3 products, ~7.3KB
- `src/content/reviews/beauty/best-face-serums.mdx` — new, 3 products, ~7.8KB
- `src/content/reviews/beauty/best-hair-dryers.mdx` — new, 3 products, ~7.7KB
- `.gsd/milestones/M001/slices/S03/S03-PLAN.md` — T03 marked [x], diagnostic failure check updated with sitemap grep-o workaround and find dist/en count
