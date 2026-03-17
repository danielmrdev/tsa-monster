---
estimated_steps: 7
estimated_files: 16
---

# T01: Create category listing page and download hero images

**Slice:** S03 — 15 review articles + images
**Milestone:** M001

## Description

Two pre-requisites for article writing: (1) create the category listing page that closes the dead-nav-link gap, (2) download 15 hero images so `heroImage` frontmatter paths can be verified before content writing begins.

The Header nav in `src/components/Header.astro` already links `/en/kitchen/`, `/en/outdoor/`, `/en/home/`, `/en/beauty/` — but `src/pages/en/[category]/index.astro` doesn't exist. This produces 404s for all four nav links in the built site. Creating it is the most important structural fix in S03.

Images use the naming convention `/images/[category]-[slug].jpg`. They are downloaded from Unsplash (lifestyle/ambient photos — not product shots, per D004). The `heroImage` frontmatter value is the path relative to `public/` — i.e., `/images/kitchen-best-coffee-makers.jpg`.

## Steps

1. **Create `public/images/` directory** — `mkdir -p public/images`

2. **Download 15 hero images** using `curl -L` with Unsplash source URLs. Use the following photo IDs (landscape lifestyle shots, 1200px wide JPEG). Name each file `[category]-[slug].jpg`:

   **Kitchen (5):**
   - `public/images/kitchen-best-coffee-makers.jpg` → `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&fm=jpg`
   - `public/images/kitchen-best-air-fryers.jpg` → `https://images.unsplash.com/photo-1648049321660-7de0d9c53cd0?w=1200&q=80&fm=jpg`
   - `public/images/kitchen-best-chef-knives.jpg` → `https://images.unsplash.com/photo-1593618998160-e34014e67546?w=1200&q=80&fm=jpg`
   - `public/images/kitchen-best-stand-mixers.jpg` → `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&fm=jpg`
   - `public/images/kitchen-best-blenders.jpg` → `https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=80&fm=jpg`

   **Outdoor (4):**
   - `public/images/outdoor-best-hiking-backpacks.jpg` → `https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=1200&q=80&fm=jpg`
   - `public/images/outdoor-best-camping-tents.jpg` → `https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80&fm=jpg`
   - `public/images/outdoor-best-headlamps.jpg` → `https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80&fm=jpg`
   - `public/images/outdoor-best-water-filters.jpg` → `https://images.unsplash.com/photo-1538991383142-36c4edeaffde?w=1200&q=80&fm=jpg`

   **Home (3):**
   - `public/images/home-best-robot-vacuums.jpg` → `https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=80&fm=jpg`
   - `public/images/home-best-air-purifiers.jpg` → `https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80&fm=jpg`
   - `public/images/home-best-smart-plugs.jpg` → `https://images.unsplash.com/photo-1558618047-f4ccc2383a0a?w=1200&q=80&fm=jpg`

   **Beauty (3):**
   - `public/images/beauty-best-electric-toothbrushes.jpg` → `https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=1200&q=80&fm=jpg`
   - `public/images/beauty-best-face-serums.jpg` → `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&fm=jpg`
   - `public/images/beauty-best-hair-dryers.jpg` → `https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200&q=80&fm=jpg`

   If any Unsplash URL returns a non-image or fails, substitute with any other relevant Unsplash lifestyle photo for that category. The key constraint is that the file exists at the named path.

3. **Verify image downloads** — `ls public/images/*.jpg | wc -l` must return 15. Check file sizes are non-trivial: `du -sh public/images/*.jpg | sort -h` — each should be >10KB. If any file is <1KB it likely failed (HTML error page downloaded instead of image).

4. **Create `src/pages/en/[category]/index.astro`** with the following implementation:
   - Import `getCollection` from `astro:content`, `BaseLayout` from `../../../layouts/BaseLayout.astro`, `ArticleCard` from `../../../components/ArticleCard.astro`
   - Export `getStaticPaths()` returning the 4 categories: `kitchen`, `outdoor`, `home`, `beauty`
   - In the component script: receive `category` from `Astro.params`, call `getCollection('reviews')`, filter by `entry.data.category === category`, sort by `entry.data.date` descending
   - Derive slug from `entry.id` using: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id` (K007 — no `entry.slug` in Astro 6)
   - Render with `BaseLayout` (title: `"[Category] Reviews — TSA Monster"`, description: relevant per-category description ≤160 chars)
   - Show a page heading and a responsive grid of `ArticleCard` components. Include an empty-state message if no articles exist yet (the build will still work with 0 articles, matching K008 behavior)
   - Category labels: `kitchen` → `Kitchen`, `outdoor` → `Outdoor`, `home` → `Home`, `beauty` → `Beauty`

5. **Run `pnpm build`** and check exit code. The build at this point still has 0 MDX articles, so the category pages render with empty-state. This is fine — verify:
   - `ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html` — all 4 exist
   - `pnpm build 2>&1 | grep -E '\[ERROR\]'` → 0 lines

6. **Run `pnpm astro check`** — must pass. If K009-style import name collision occurs (page filename `[category]` shouldn't collide, but check), rename imports as needed.

7. **Verify image count**: `ls public/images/*.jpg | wc -l` → 15

## Must-Haves

- [ ] `src/pages/en/[category]/index.astro` exists and builds without error
- [ ] All 4 category index HTML files present in `dist/en/[category]/index.html`
- [ ] Slug derived from `entry.id` (not `entry.slug`) in the listing page
- [ ] 15 JPEG files present in `public/images/`, each >10KB
- [ ] `pnpm build` exits 0 with 0 `[ERROR]` lines after this task
- [ ] Empty-state handled gracefully (no crash when collection has 0 articles — matches K008)

## Verification

```bash
# Build exits 0
pnpm build; echo "Exit: $?"

# Category index pages exist
ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html

# No errors
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0

# 15 images downloaded
ls public/images/*.jpg | wc -l   # → 15

# No tiny (failed) downloads
find public/images -name "*.jpg" -size -10k   # → empty (all images are real)

# TypeScript clean
pnpm astro check 2>&1 | tail -3
```

## Inputs

- `src/content.config.ts` — reviews collection schema (do not modify)
- `src/pages/en/[category]/[slug].astro` — reference for how slug is derived from `entry.id` (use the same pattern)
- `src/components/ArticleCard.astro` — Props: `title`, `excerpt`, `category`, `slug`, `heroImage`, `date`
- `src/layouts/BaseLayout.astro` — Props: `title`, `description`, `ogImage?`, `lang?`
- `src/pages/en/index.astro` — reference implementation of `getCollection` + slug derivation + ArticleCard rendering pattern

## Observability Impact

**Signals this task introduces:**
- `dist/en/kitchen/index.html`, `dist/en/outdoor/index.html`, `dist/en/home/index.html`, `dist/en/beauty/index.html` — built output for all 4 category listing pages; confirms nav dead-links are resolved
- `public/images/*.jpg` — 15 image files; `find public/images -name "*.jpg" -size -10k` detects failed downloads

**Inspection:**
- `grep "Reviews coming soon" dist/en/kitchen/index.html` — confirms empty-state is shown (before articles are written)
- `ls -la public/images/*.jpg` — file sizes; anything <10KB is a failed download (HTML error page)

**Failure visibility:**
- Build `[ERROR]` lines pinpoint any import or type issue in the new page
- Tiny JPEGs (<10KB) = Unsplash returned an error response; re-download with a different photo ID
- If any `dist/en/[category]/index.html` is missing after build, check `getStaticPaths()` returns all 4 category params

## Expected Output

- `src/pages/en/[category]/index.astro` — new file, category listing page
- `public/images/` — directory with 15 `.jpg` files (one per planned article)
- `dist/en/kitchen/index.html`, `dist/en/outdoor/index.html`, `dist/en/home/index.html`, `dist/en/beauty/index.html` — built category listing pages
