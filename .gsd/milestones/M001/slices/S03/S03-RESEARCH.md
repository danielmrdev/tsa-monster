# S03: 15 review articles + images — Research

**Date:** 2026-03-17

## Summary

S03 is content-and-routing work built on a fully working scaffold. The schema contract, layouts, and dynamic route are all in place from S01. The work breaks into three parts: (1) create a category listing page (`[category]/index.astro`) that the Header nav already links to but which does not exist yet, (2) download hero images to `public/images/`, (3) write 15 MDX review articles across kitchen (×5), outdoor (×4), home (×3), beauty (×3).

The missing category index page is the most important gap discovered. The Header nav links `/en/kitchen/`, `/en/outdoor/`, `/en/home/`, `/en/beauty/` but `src/pages/en/[category]/index.astro` does not exist. Without it, all four nav links produce 404s in the built site. This must be created as part of S03.

The MDX articles are straightforward: each file must satisfy the schema in `src/content.config.ts`, import `ProductCard` from the component library, and be placed at the correct path so the dynamic route in `[category]/[slug].astro` picks them up. The `prose prose-slate max-w-none` prose wrapper is applied by ArticleLayout — articles don't need to add it themselves.

## Recommendation

Build in this order: (1) category listing page first — it's the structural gap, (2) download all images before writing MDX so `heroImage` paths can be validated, (3) write MDX articles in batches by category. Verify with `pnpm build` after all files are in place; check `dist/en/kitchen/`, `dist/en/outdoor/`, etc. exist.

## Implementation Landscape

### Key Files

- `src/content.config.ts` — frontmatter schema all articles must satisfy. Do not modify.
- `src/pages/en/[category]/[slug].astro` — dynamic route; already implemented; picks up any MDX in `src/content/reviews/`. Do not modify.
- `src/pages/en/[category]/index.astro` — **does not exist**. Must be created. Renders a listing of all articles in that category. Uses `getCollection('reviews')`, filters by `entry.data.category`, renders with BaseLayout + ArticleCard.
- `src/layouts/ArticleLayout.astro` — wraps all article content in `prose prose-slate max-w-none`. Articles should not add prose classes.
- `src/components/ProductCard.astro` — expects `name`, `rating` (number 1–5), `description`, `affiliateUrl?`. Import and use inside MDX.
- `src/content/reviews/kitchen/` — 5 MDX files here (directories already exist with `.gitkeep`)
- `src/content/reviews/outdoor/` — 4 MDX files
- `src/content/reviews/home/` — 3 MDX files
- `src/content/reviews/beauty/` — 3 MDX files
- `public/images/` — does not exist yet; create and download hero images here

### MDX Frontmatter Contract

Every article must match this schema exactly (from `src/content.config.ts`):

```yaml
---
title: string                    # Article title
description: string              # ≤160 chars, used as <meta description>
category: kitchen|outdoor|home|beauty
date: YYYY-MM-DD                 # coerced to Date
heroImage: /images/filename.jpg  # path relative to public/; file must exist
excerpt: string                  # ≤200 chars, shown on ArticleCard
products:
  - name: string
    rating: 1.0–5.0             # half-star precision OK (e.g. 4.5)
    description: string
    affiliateUrl: '#'           # placeholder per D006
---
```

### MDX Body Pattern

```mdx
import ProductCard from '../../../components/ProductCard.astro';

## Introduction
...prose...

## Comparison Table
| Product | Rating | Best For |
|---------|--------|----------|
| ...     | ...    | ...      |

## Top Picks

<ProductCard
  name="Product Name"
  rating={4.5}
  description="One sentence why this product stands out."
  affiliateUrl="#"
/>

## FAQs
...

## Final Verdict
...
```

### Slug Derivation

The dynamic route derives slug from `entry.id` using `entry.id.split('/').pop()?.replace(/\.mdx?$/, '')`. So a file at `src/content/reviews/kitchen/best-coffee-makers.mdx` gets slug `best-coffee-makers` and URL `/en/kitchen/best-coffee-makers/`. The category comes from `entry.data.category` (frontmatter), not the directory name — though they should match.

### Image Path Convention

`heroImage` is a raw string passed to `<img src>`. It must be a path rooted at `public/`. Convention: `/images/[category]-[slug-prefix].jpg`. Images live at `public/images/filename.jpg` and are referenced as `/images/filename.jpg` in frontmatter.

Download via: `curl -L "https://images.unsplash.com/photo-XXXXX?w=1200&q=80&fm=jpg" -o public/images/filename.jpg`

Unsplash license allows commercial use without attribution. Use lifestyle/ambient photos, not product shots (D004).

### Category Listing Page

`src/pages/en/[category]/index.astro` needs to:
1. Export `getStaticPaths()` returning the 4 categories as params
2. Filter `getCollection('reviews')` by `entry.data.category === category`
3. Sort by date descending
4. Render with BaseLayout + a grid of ArticleCard components
5. Derive slug from `entry.id` same as the home page: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`

### 15 Articles — Topic List

**Kitchen (5)**
1. `best-coffee-makers` — Best Coffee Makers
2. `best-air-fryers` — Best Air Fryers
3. `best-chef-knives` — Best Chef's Knives
4. `best-stand-mixers` — Best Stand Mixers
5. `best-blenders` — Best Blenders

**Outdoor (4)**
1. `best-hiking-backpacks` — Best Hiking Backpacks
2. `best-camping-tents` — Best Camping Tents
3. `best-headlamps` — Best Headlamps
4. `best-water-filters` — Best Water Filters for Hiking

**Home (3)**
1. `best-robot-vacuums` — Best Robot Vacuums
2. `best-air-purifiers` — Best Air Purifiers
3. `best-smart-plugs` — Best Smart Plugs

**Beauty (3)**
1. `best-electric-toothbrushes` — Best Electric Toothbrushes
2. `best-face-serums` — Best Face Serums
3. `best-hair-dryers` — Best Hair Dryers

### Build Order

1. **Create `public/images/`** and download 15 hero images (one per article). Images must be in place before MDX references them — build won't fail on missing images (no Astro Image optimization used), but they'll 404 at runtime.
2. **Create `src/pages/en/[category]/index.astro`** — category listing page. This is the only missing structural piece; it unblocks nav testing.
3. **Write MDX articles** — all 15, in batches by category. Each file goes in the pre-existing category directory.
4. **Run `pnpm build`** — verify all 15 article routes + 4 category routes appear in build output, no errors.
5. **Run `pnpm astro check`** — TypeScript clean. File count will increase from 14 to ~16+ (new Astro page + MDX files).

### Verification Approach

```bash
# Full build — should show 15 article routes + 4 category routes + existing 6 pages = 25 pages
pnpm build 2>&1 | grep -E '^\s+[├└]'

# No errors
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'

# Category dirs exist in dist
ls dist/en/kitchen/ dist/en/outdoor/ dist/en/home/ dist/en/beauty/

# Spot check article file exists
ls dist/en/kitchen/best-coffee-makers/index.html

# Category index pages exist (nav links not 404)
ls dist/en/kitchen/index.html

# TypeScript clean
pnpm astro check

# Sitemap has all article URLs
grep -c "<loc>" dist/sitemap-0.xml
```

## Constraints

- `heroImage` must be a string path (no Astro `<Image>` component) — the schema and ArticleLayout use raw `<img src>`. Images must live in `public/`, not `src/assets/`.
- Category enum is `kitchen|outdoor|home|beauty` — no other values accepted by schema without modifying `src/content.config.ts`.
- `rating` must be between 1 and 5 — schema enforces `z.number().min(1).max(5)`. Half-star values (4.5, etc.) are fine.
- `description` is used as `<meta description>` — keep under 160 chars per R005.
- `excerpt` is shown on ArticleCard — keep under 200 chars.
- All `affiliateUrl` values must be `'#'` per D006 (Amazon Associates not yet approved).
- MDX files must be `.mdx` extension (not `.md`) since `ProductCard` is an Astro component used via JSX syntax inside the articles.

## Common Pitfalls

- **Category param comes from `entry.data.category` (frontmatter), not the directory name** — the dynamic route uses `entry.data.category` for the `category` param. If frontmatter says `category: kitchen` but the file is in `src/content/reviews/outdoor/`, the URL will be `/en/kitchen/[slug]`. Keep frontmatter and directory in sync.
- **Importing ProductCard in MDX requires correct relative path** — from `src/content/reviews/kitchen/article.mdx`, the import is `import ProductCard from '../../../components/ProductCard.astro'` (3 levels up to `src/`, then into `components/`). Verify depth for each category level.
- **No `entry.slug` in Astro 6** — K007. Use `entry.id.split('/').pop()?.replace(/\.mdx?$/, '')` everywhere slug is derived from collection entries.
- **Missing category listing page = 4 dead nav links** — Header already points to `/en/kitchen/` etc. These 404 until `[category]/index.astro` is created.
- **Images not found ≠ build error** — Astro won't fail the build if `heroImage` paths don't resolve to files (since it's a plain `<img src>`, not an optimized `<Image>`). The 404 only appears at runtime. Download all images before writing frontmatter to catch path typos early.
