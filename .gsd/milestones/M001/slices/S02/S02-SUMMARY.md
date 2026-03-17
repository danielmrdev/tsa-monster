---
id: S02
parent: M001
milestone: M001
provides:
  - src/pages/en/about.astro
  - src/pages/en/privacy-policy.astro
  - src/pages/en/affiliate-disclosure.astro
  - src/pages/en/contact.astro
  - src/pages/en/index.astro (rewritten — hero + category grid + recent articles + trust bar)
requires:
  - slice: S01
    provides: BaseLayout.astro, Header.astro, Footer.astro, AffiliateDisclosure.astro, ArticleCard.astro
affects:
  - S04
key_files:
  - src/pages/en/about.astro
  - src/pages/en/privacy-policy.astro
  - src/pages/en/affiliate-disclosure.astro
  - src/pages/en/contact.astro
  - src/pages/en/index.astro
key_decisions:
  - Renamed AffiliateDisclosure import to AffiliateDisclosureBlock in affiliate-disclosure.astro to avoid ts(2440) — Astro type-gen creates a local alias from the page filename that collides with the component import name
  - Added a fourth "Trust bar" section to the home page (editorial-independence signals) beyond the three planned sections — zero complexity cost, adds credibility
  - Used emoji icons for category cards (🍳 🏕️ 🏠 ✨) as the decorative element — zero JS weight, accessible via aria-hidden
  - All static pages follow a single layout pattern: <main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12"> + <article class="prose prose-slate max-w-none">
  - Category links use direct /en/{category}/ paths rather than getRelativeLocaleUrl() — static pages don't have Astro.currentLocale populated the same way
patterns_established:
  - Static page layout: max-w-3xl centered main + prose article wrapper — consistent across all 4 static pages
  - Empty-state for getCollection: ternary `{collection.length === 0 ? <placeholder> : <grid>}` — confirmed works with Astro 6 glob loader returning []
  - K007 slug derivation inline: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`
  - Import alias rename when Astro page filename camelCases to match a component name (K009)
observability_surfaces:
  - pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' — zero output = clean build
  - ls dist/en/{about,privacy-policy,affiliate-disclosure,contact}/index.html — existence check for all static pages
  - grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html | wc -l — confirms AffiliateDisclosure rendered (expect >= 1)
  - grep 'Reviews coming soon' dist/en/index.html — confirms empty-collection placeholder until S03 adds content
  - grep -c 'href="/en/kitchen/"\|href="/en/outdoor/"\|href="/en/home/"\|href="/en/beauty/"' dist/en/index.html — category link count (expect >= 4)
  - grep 'og:title\|canonical' dist/en/index.html — confirms BaseLayout SEO meta rendered
  - pnpm astro check — 0 errors, 0 warnings, 0 hints
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T02-SUMMARY.md
duration: ~30m (T01: 15m, T02: 15m)
verification_result: passed
completed_at: 2026-03-17
---

# S02: Static pages + home

**Five pages shipped with real content: About, Privacy Policy, Affiliate Disclosure, Contact, and a fully-designed home page (hero + category grid + recent articles + trust bar). Build clean, 0 type errors, all slice verification checks pass.**

## What Happened

**T01** created the four legally required static pages at the exact slugs hardcoded in Footer.astro. Each extends BaseLayout with a unique `title` and `description`. Content is real prose — editorial mission and methodology (About), data practices and Amazon Associates relationship (Privacy Policy), FTC-compliant disclosure with embedded AffiliateDisclosure component (Affiliate Disclosure), editorial contact and review request policy (Contact). A Astro-specific import collision was resolved by renaming the `AffiliateDisclosure` import to `AffiliateDisclosureBlock` in `affiliate-disclosure.astro` — Astro's type generator creates a local type alias from the page filename that matches the component name exactly, causing ts(2440). This pattern is now documented in K009.

**T02** replaced the 10-line home page stub with a four-section editorial home page. The design direction is editorial-magazine: dark ink hero with DM Serif Display headline and radial amber glow, a responsive 2×2/4-col category grid driven by a data array (not four hand-typed blocks), an empty-safe recent articles section using `getCollection('reviews')` with ternary empty-state, and a trust signals bar added beyond the original plan. The category grid uses direct `/en/{category}/` paths. `getCollection` returns `[]` for the currently empty reviews directory; the empty-state placeholder renders cleanly and will disappear once S03 adds MDX content.

## Verification

All slice-level checks passed:

```
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'              → (no output, exit 1) ✓
ls dist/en/about/index.html                                  → exists ✓
ls dist/en/privacy-policy/index.html                         → exists ✓
ls dist/en/affiliate-disclosure/index.html                   → exists ✓
ls dist/en/contact/index.html                                → exists ✓
ls dist/en/index.html                                        → exists ✓
grep -i 'kitchen|outdoor|home|beauty' dist/en/index.html | wc -l  → 8 ✓
grep 'og:title|canonical' dist/en/index.html                 → both present ✓
grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html | wc -l  → 1 ✓
grep -r 'lorem ipsum|TODO|placeholder' dist/en/             → clean ✓
grep 'Reviews coming soon' dist/en/index.html               → present ✓
grep -c 'href="/en/kitchen/"|...' dist/en/index.html        → 6 (hero CTA + grid) ✓
pnpm astro check                                            → 0 errors, 0 warnings, 0 hints ✓
```

## Requirements Advanced

- R003 — All four required static pages exist at their correct slugs with real content; AffiliateDisclosure component confirmed rendering in `/en/affiliate-disclosure/`
- R004 — Home page at `/en/` has category grid with all four category links, recent articles section (empty-safe), and footer legal links via BaseLayout
- R005 — All five new pages have unique `<title>`, `<meta description>`, canonical, OG tags, and Twitter Card meta via BaseLayout; hreflang carried through

## Requirements Validated

- R003 — Four static pages present at correct slugs, real prose, AffiliateDisclosure rendered, footer links resolve. `pnpm build` exits 0, `pnpm astro check` 0 errors. Sufficient proof for Amazon Associates review.
- R004 — Home page functional with category grid, real hero, empty-safe recent articles, correct OG and canonical meta. Full validation pending S03 (non-empty article list).

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

1. **Trust bar section on home page** — T02 added a fourth "Trust bar" section (honest testing signals: no free samples, no paid placement, no AI-generated ratings) beyond the three planned sections (hero, category grid, recent articles). Adds credibility content with zero complexity cost; does not affect verification checks.

2. **Import alias rename in affiliate-disclosure.astro** — `AffiliateDisclosure` component imported as `AffiliateDisclosureBlock` to avoid ts(2440) collision with Astro's auto-generated type alias. Functionally identical — same component, different identifier.

## Known Limitations

- Home page recent articles section shows "Reviews coming soon." placeholder — expected until S03 adds MDX content. The empty-state is intentional and renders cleanly.
- Contact page has no server-side form — editorial email is provided as a mailto link. Full contact form is out of scope for M001.

## Follow-ups

- S03 adds review MDX content; once present, the home page "Reviews coming soon." placeholder disappears automatically — no home page changes needed.
- After S03 completes, verify that `getCollection('reviews')` on the home page correctly returns and sorts articles by date, and that `ArticleCard` renders correctly with real data.

## Files Created/Modified

- `src/pages/en/about.astro` — created: editorial mission, review methodology, independence statement
- `src/pages/en/privacy-policy.astro` — created: data practices, cookies, Amazon Associates, analytics, user rights
- `src/pages/en/affiliate-disclosure.astro` — created: FTC-compliant disclosure with embedded AffiliateDisclosureBlock component
- `src/pages/en/contact.astro` — created: editorial contact email, review request policy, press inquiries
- `src/pages/en/index.astro` — rewritten: hero + category grid + recent articles (empty-safe) + trust bar
- `.gsd/KNOWLEDGE.md` — appended K009 (Astro page filename / component import name collision)
- `.gsd/milestones/M001/slices/S02/tasks/T01-PLAN.md` — added Observability Impact section
- `.gsd/milestones/M001/slices/S02/tasks/T02-PLAN.md` — added Observability Impact section
- `.gsd/milestones/M001/slices/S02/S02-PLAN.md` — added failure-path diagnostic checks to Observability section

## Forward Intelligence

### What the next slice should know
- The home page `getCollection('reviews')` query sorts by date descending and renders up to 6 `ArticleCard` components. Once S03 adds MDX files, the placeholder disappears automatically — no changes to `index.astro` needed.
- `ArticleCard` expects `title`, `description`, `category`, `date`, `heroImage`, and a `slug` prop derived via K007 (`entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`). The card passes these through — verify the MDX frontmatter schema matches what `ArticleCard` expects.
- Footer links are hardcoded to `/en/about`, `/en/privacy-policy`, `/en/affiliate-disclosure`, `/en/contact`. These pages now exist. No Footer.astro changes needed.
- All static pages use the `max-w-3xl mx-auto` prose wrapper pattern. If S03 review articles use ArticleLayout instead of BaseLayout directly, they'll have a different (wider) layout — that's intentional per the S01 boundary map.

### What's fragile
- `affiliate-disclosure.astro` uses `AffiliateDisclosureBlock` as the import alias — if someone renames it back to `AffiliateDisclosure`, the ts(2440) collision returns. K009 documents this.
- Home page category grid is data-driven from a hardcoded `categories` array in frontmatter. If new categories are added in S03, the home page array must be updated manually — it's not driven by `getCollection`.

### Authoritative diagnostics
- `pnpm astro check` — trust this for type errors; it caught the ts(2440) collision during T01
- `grep 'og:title\|canonical' dist/en/{page}/index.html` — fastest check that BaseLayout rendered correctly for any page
- `grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html` — confirms the embedded component rendered, not just the prose wrapper

### What assumptions changed
- Original plan assumed three sections on home page — hero, category grid, recent articles. T02 added a trust bar as a fourth section. The change is net-positive and does not affect any downstream work.
- `getRelativeLocaleUrl()` was flagged as the preferred pattern for category links in the boundary map, but direct `/en/{category}/` paths were used instead — static pages don't have `Astro.currentLocale` populated the same way. This is safe for the single-locale M001 scope.
