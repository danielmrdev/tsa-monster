---
id: T03
parent: S01
milestone: M001
provides:
  - Dynamic article route src/pages/en/[category]/[slug].astro — contract for S03 MDX articles
  - public/robots.txt — allow all crawlers + sitemap reference
  - public/_headers — Cloudflare Pages cache directives (R007)
key_files:
  - src/pages/en/[category]/[slug].astro
  - public/robots.txt
  - public/_headers
key_decisions:
  - Slug derived from entry.id (not entry.slug which doesn't exist in Astro 6 glob loader) using entry.id.split('/').pop()?.replace(/\.mdx?$/, '')
  - render() imported from astro:content alongside getCollection() — Astro 6 API
  - Zero articles in S01 produces zero dynamic routes — pnpm build exits 0 (expected, not an error)
patterns_established:
  - Dynamic route getStaticPaths() in Astro 6 with glob loader uses entry.id for slug derivation, entry.data.category for category param
  - public/_headers uses Cloudflare Pages syntax — path pattern per line followed by indented header directives
observability_surfaces:
  - pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' — zero output confirms clean build
  - pnpm build 2>&1 | grep -i 'category|slug' — confirms no dynamic route generation errors
  - ls dist/sitemap-index.xml — confirms @astrojs/sitemap ran
  - ls dist/robots.txt — confirms public/ files copied to dist/
  - pnpm astro check — 14 files, 0 errors, 0 warnings, 0 hints
duration: ~15m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T03: Add dynamic article route, public files, final build verification

**Dynamic article route written with Astro 6 render() API, robots.txt and _headers added to public/, full slice verification passes — `SLICE S01 VERIFIED`.**

## What Happened

Three files created:

1. `src/pages/en/[category]/[slug].astro` — `getStaticPaths()` calls `getCollection('reviews')`, maps entries to `{category: entry.data.category, slug: entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id}`. With zero MDX articles in S01, returns an empty array — build succeeds without error. `render(entry)` provides `Content` component rendered inside `ArticleLayout`.

2. `public/robots.txt` — `User-agent: *`, `Allow: /`, sitemap pointing to `https://tsa.monster/sitemap-index.xml` (the file `@astrojs/sitemap` generates).

3. `public/_headers` — Cloudflare Pages cache directives: `/_astro/*` and `/images/*` immutable (31536000s), `/*.html` and `/` short-lived (3600s client / 86400s CDN).

Pre-flight observability gaps were also addressed: added `## Observability Impact` section to T03-PLAN.md and dynamic-route failure-path checks to S01-PLAN.md's Verification section.

## Verification

Full slice verification command:
```
pnpm build && ls dist/en/index.html && (ls dist/sitemap-index.xml 2>/dev/null || ls dist/sitemap-0.xml) && ls dist/robots.txt && pnpm astro check && echo "SLICE S01 VERIFIED"
```
Output ended with `SLICE S01 VERIFIED`.

Individual checks:
- `dist/en/index.html` — present ✓
- `dist/sitemap-index.xml` — present ✓
- `dist/robots.txt` — present ✓
- `pnpm astro check` — 14 files, 0 errors, 0 warnings, 0 hints ✓
- `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` — zero output (build clean) ✓
- `dist/_astro/BaseLayout.DSB2-8PK.css` confirmed to contain Tailwind custom properties ✓
- `/en/` dev server response: Header with logo + category nav (Kitchen, Outdoor, Home, Beauty), main content area, Footer with legal links and affiliate disclosure ✓
- `/` serves client-side redirect script (`window.location.replace('/en/')`) ✓

## Diagnostics

- **Build errors**: `pnpm build 2>&1 | grep -A3 '\[ERROR\]'` — common causes for dynamic route failure: wrong import path for ArticleLayout, missing `render` import, schema field mismatch.
- **Empty collection warning**: `[WARN] [glob-loader] No files found matching "**/*.{md,mdx}"` is expected in S01. Disappears when S03 adds MDX articles.
- **_headers not in dist/**: Cloudflare reads `_headers` from project root at deploy time; presence in `public/` is correct.
- **Slug derivation**: If a future article doesn't render at its expected URL, check `entry.id` format in `pnpm astro check` output — the `.mdx?$` strip handles both `.md` and `.mdx` extensions.

## Deviations

None — implemented exactly per plan.

## Known Issues

- Playwright browser tool (`libnspr4.so` missing) can't launch in this environment. Browser verification done via curl: `/en/` HTML response confirmed Header, nav, Footer markup. `/` client-side redirect confirmed by reading `src/pages/index.astro` source.

## Files Created/Modified

- `src/pages/en/[category]/[slug].astro` — dynamic article route using Astro 6 render() API
- `public/robots.txt` — allow-all + sitemap-index.xml reference
- `public/_headers` — Cloudflare Pages cache directives for /_astro/* (immutable) and /*.html (short TTL)
- `.gsd/milestones/M001/slices/S01/tasks/T03-PLAN.md` — added ## Observability Impact section (pre-flight fix)
- `.gsd/milestones/M001/slices/S01/S01-PLAN.md` — added dynamic-route failure-path checks to Verification section (pre-flight fix)
