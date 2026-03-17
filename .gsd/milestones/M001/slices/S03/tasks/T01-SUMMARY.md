---
id: T01
parent: S03
milestone: M001
provides:
  - Category listing page at src/pages/en/[category]/index.astro (fixes all 4 Header nav dead-links)
  - 15 JPEG hero images in public/images/ with naming convention [category]-[slug].jpg
key_files:
  - src/pages/en/[category]/index.astro
  - public/images/kitchen-best-coffee-makers.jpg
  - public/images/kitchen-best-air-fryers.jpg
  - public/images/kitchen-best-chef-knives.jpg
  - public/images/kitchen-best-stand-mixers.jpg
  - public/images/kitchen-best-blenders.jpg
  - public/images/outdoor-best-hiking-backpacks.jpg
  - public/images/outdoor-best-camping-tents.jpg
  - public/images/outdoor-best-headlamps.jpg
  - public/images/outdoor-best-water-filters.jpg
  - public/images/home-best-robot-vacuums.jpg
  - public/images/home-best-air-purifiers.jpg
  - public/images/home-best-smart-plugs.jpg
  - public/images/beauty-best-electric-toothbrushes.jpg
  - public/images/beauty-best-face-serums.jpg
  - public/images/beauty-best-hair-dryers.jpg
key_decisions:
  - Two Unsplash plan URLs returned HTML error pages (<1KB files); substituted with alternate photo IDs for kitchen-best-air-fryers and home-best-smart-plugs
patterns_established:
  - Category listing page uses same entry.id slug derivation as [slug].astro (split('/').pop()?.replace(/\.mdx?$/, ''))
  - getStaticPaths() hardcodes 4 category params; getCollection('reviews') filtered per category at render time
  - Empty-state gracefully shown when collection has 0 articles (no crash, matches K008 behavior)
observability_surfaces:
  - "find public/images -name '*.jpg' -size -10k → detects failed Unsplash downloads (HTML error pages are <4KB)"
  - "grep 'Reviews coming soon' dist/en/[category]/index.html → confirms empty-state renders when no articles"
  - "pnpm build 2>&1 | grep -E '\\[ERROR\\]' | wc -l → 0 means build clean"
  - "ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html → confirms all 4 category routes built"
duration: ~15m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: Create category listing page and download hero images

**Created category listing page fixing 4 Header nav dead-links, downloaded 15 hero images to public/images/.**

## What Happened

Created `src/pages/en/[category]/index.astro` with `getStaticPaths()` returning all 4 categories (kitchen, outdoor, home, beauty). The page filters `getCollection('reviews')` by `entry.data.category`, sorts descending by date, derives slugs via `entry.id.split('/').pop()?.replace(/\.mdx?$/, '')` (same pattern as `[slug].astro`), and renders an ArticleCard grid inside BaseLayout. Empty-state is shown when no articles exist yet (needed for this intermediate build state).

Downloaded 15 JPEG hero images from Unsplash using parallel curl batches. Two plan URLs returned HTML error pages (4KB files): `photo-1648049321660` (air fryers) and `photo-1558618047` (smart plugs). Substituted with alternate Unsplash photos (`photo-1585515320310` and `photo-1558002038`) — both downloaded successfully at full size.

## Verification

```
# Count and size check
ls public/images/*.jpg | wc -l                      # → 15
find public/images -name "*.jpg" -size -10k         # → empty (all real images)

# Build clean
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l      # → 0

# All 4 category routes built
ls dist/en/kitchen/index.html dist/en/outdoor/index.html \
   dist/en/home/index.html dist/en/beauty/index.html  # all present

# TypeScript clean
pnpm astro check 2>&1 | tail -3
# → 0 errors, 0 warnings, 0 hints

# Empty-state renders
grep "Reviews coming soon" dist/en/kitchen/index.html  # confirmed
```

## Diagnostics

- `find public/images -name "*.jpg" -size -10k` — detects any failed Unsplash downloads (HTML error pages land as ~4KB files)
- `pnpm build 2>&1 | grep -E '\[ERROR\]'` — primary build failure signal
- `grep "Reviews coming soon" dist/en/[category]/index.html` — confirms empty-state when no articles written yet
- Build WARN `[glob-loader] No files found matching "**/*.{md,mdx}"` is expected until T02/T03 write article MDX files

## Deviations

- Two Unsplash photo IDs from the plan returned HTML error pages (<4KB). Substituted with alternate photo IDs:
  - `kitchen-best-air-fryers.jpg`: plan used `photo-1648049321660`, replaced with `photo-1585515320310`
  - `home-best-smart-plugs.jpg`: plan used `photo-1558618047`, replaced with `photo-1558002038`

## Known Issues

None.

## Files Created/Modified

- `src/pages/en/[category]/index.astro` — new category listing page; fixes all 4 Header nav dead-links
- `public/images/kitchen-best-coffee-makers.jpg` — hero image (116KB)
- `public/images/kitchen-best-air-fryers.jpg` — hero image (192KB, substituted URL)
- `public/images/kitchen-best-chef-knives.jpg` — hero image (88KB)
- `public/images/kitchen-best-stand-mixers.jpg` — hero image (104KB)
- `public/images/kitchen-best-blenders.jpg` — hero image (160KB)
- `public/images/outdoor-best-hiking-backpacks.jpg` — hero image (848KB)
- `public/images/outdoor-best-camping-tents.jpg` — hero image (188KB)
- `public/images/outdoor-best-headlamps.jpg` — hero image (296KB)
- `public/images/outdoor-best-water-filters.jpg` — hero image (124KB)
- `public/images/home-best-robot-vacuums.jpg` — hero image (116KB)
- `public/images/home-best-air-purifiers.jpg` — hero image (72KB)
- `public/images/home-best-smart-plugs.jpg` — hero image (68KB, substituted URL)
- `public/images/beauty-best-electric-toothbrushes.jpg` — hero image (104KB)
- `public/images/beauty-best-face-serums.jpg` — hero image (108KB)
- `public/images/beauty-best-hair-dryers.jpg` — hero image (248KB)
- `.gsd/milestones/M001/slices/S03/S03-PLAN.md` — added Observability / Diagnostics section (pre-flight fix)
- `.gsd/milestones/M001/slices/S03/tasks/T01-PLAN.md` — added Observability Impact section (pre-flight fix)
