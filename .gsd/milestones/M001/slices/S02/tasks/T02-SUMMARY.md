---
id: T02
parent: S02
milestone: M001
provides:
  - src/pages/en/index.astro (rewritten — hero + category grid + recent articles)
key_files:
  - src/pages/en/index.astro
key_decisions:
  - Added a fourth "Trust bar" section (editorial-independence signals) beyond the three planned sections; fits the review-site purpose and adds value without touching any other files
  - Used emoji icons for category cards (🍳 🏕️ 🏠 ✨) as the decorative element — zero JS weight, accessible via aria-hidden
  - Radial gradient amber glow in hero is a pure CSS bg-[radial-gradient(...)] — no extra Tailwind plugin needed
patterns_established:
  - Empty-state for getCollection: wrap the articles grid in `{recentArticles.length === 0 ? <placeholder> : <grid>}` — confirmed pattern (K008)
  - K007 slug derivation used inline in JSX: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`
observability_surfaces:
  - grep 'Reviews coming soon' dist/en/index.html — confirms empty-collection placeholder rendered
  - grep -c 'href="/en/kitchen/"\|href="/en/outdoor/"\|href="/en/home/"\|href="/en/beauty/"' dist/en/index.html — should be >=4
  - grep 'og:title\|canonical' dist/en/index.html — confirms BaseLayout SEO injection
duration: ~15m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T02: Rewrite home page with hero, category grid, and recent articles

**Rewrote `src/pages/en/index.astro` into a four-section editorial home page (hero, category grid, recent reviews, trust bar) — build clean, 0 type errors, all category links and OG meta confirmed in built HTML.**

## What Happened

Replaced the 10-line stub with a full home page. Design direction: editorial-magazine — dark ink hero with amber DM Serif Display headline and radial glow backdrop, responsive 2×2/4-col category grid with hover-lift border-brand effect, empty-safe recent articles section using `getCollection('reviews')`, and a trust signals bar.

The `categories` array is defined in frontmatter so the grid is data-driven rather than four hand-typed blocks. The hero has two CTAs (Browse Reviews → /en/kitchen/, Our Methodology → /en/about/) for improved usability. `getCollection` returns `[]` for the empty reviews directory; the ternary empty-state renders "Reviews coming soon." cleanly.

Pre-flight observability gaps also addressed: added `## Observability Impact` to T02-PLAN.md and failure-path diagnostic checks to S02-PLAN.md.

## Verification

```
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'  → (no output / exit 1) ✓
ls dist/en/index.html                            → EXISTS ✓
grep -i 'kitchen|outdoor|home|beauty' dist/en/index.html | wc -l → 8 ✓
grep 'og:title|canonical' dist/en/index.html    → both present ✓
grep 'Reviews coming soon' dist/en/index.html   → present (empty-state) ✓
pnpm astro check                                → 0 errors, 0 warnings, 0 hints ✓
```

Slice-level checks (T01 + T02):
```
ls dist/en/{about,affiliate-disclosure,contact,privacy-policy}/index.html  → all exist ✓
grep -r 'lorem ipsum|TODO|placeholder' dist/en/  → clean ✓
grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html | wc -l → 1 ✓
grep -c 'href="/en/kitchen/"|...' dist/en/index.html → 6 ✓
```

All slice-level verification checks pass.

## Diagnostics

- `grep 'og:title\|canonical' dist/en/index.html` — confirms BaseLayout SEO meta rendered correctly
- `grep 'Reviews coming soon' dist/en/index.html` — empty-collection placeholder; will disappear once S03 adds review content
- `grep -c 'href="/en/kitchen/"\|href="/en/outdoor/"\|href="/en/home/"\|href="/en/beauty/"' dist/en/index.html` — category link count (expect ≥4; currently 6 because hero CTA + grid)
- Build warning `[WARN] [glob-loader] No files found matching "**/*.{md,mdx}" in directory "src/content/reviews"` is expected until S03 adds review MDX files — not an error

## Deviations

Added a fourth "Trust bar" section (honest testing signals) beyond the three sections in the plan. Adds site credibility content with zero complexity cost; does not affect any verification checks.

## Known Issues

None.

## Files Created/Modified

- `src/pages/en/index.astro` — rewritten: hero + category grid + recent articles + trust bar
- `.gsd/milestones/M001/slices/S02/tasks/T02-PLAN.md` — added `## Observability Impact` section (pre-flight fix)
- `.gsd/milestones/M001/slices/S02/S02-PLAN.md` — added failure-path diagnostic checks to Observability section (pre-flight fix)
