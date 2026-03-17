# S02: Static pages + home — Research

**Date:** 2026-03-17

## Summary

S02 is low-risk, well-scoped content authoring. S01 delivered all the infrastructure this slice depends on: `BaseLayout.astro` with full SEO head, `Header.astro` and `Footer.astro` wired into the layout, `ArticleCard.astro` ready for home page use, and `AffiliateDisclosure.astro` for per-page disclosure. The four static pages (About, Privacy Policy, Affiliate Disclosure, Contact) are identical in structure: extend `BaseLayout`, pass `title` + `description` props, render static HTML content inside `<main>`. No dynamic data, no collection queries.

The home page at `src/pages/en/index.astro` is currently a placeholder shell (h1 + one paragraph). It needs to become a real page: hero section, category grid, and recent articles list. The `ArticleCard` component is ready; the home page just needs to call `getCollection('reviews')` and render cards. Until S03 populates the collection, the page builds cleanly with an empty array (K008 confirmed — Astro 6 returns `[]` from `getCollection()` on an empty collection with no build error).

## Recommendation

Build in two tasks: (1) all four static pages in one pass — they share identical structure and can be scaffolded quickly; (2) the home page as a separate task since it has slightly more moving parts (collection query, hero, category grid, conditional empty state). Each task ends with `pnpm build` + `pnpm astro check` verification.

No new libraries needed. No new patterns needed. Everything follows what S01 established.

## Implementation Landscape

### Key Files

- `src/pages/en/index.astro` — **rewrite**. Currently a 10-line stub. Needs: hero section, category grid (4 cards linking to `/en/{category}/`), recent articles section using `getCollection('reviews')` → sort by date → render `ArticleCard` components. Must handle empty collection gracefully (no articles yet during S02, but build must not fail).
- `src/pages/en/about.astro` — **create**. Extends `BaseLayout`. Static content: who we are, editorial mission, review methodology. Title: "About TSA Monster | Expert Product Reviews".
- `src/pages/en/privacy-policy.astro` — **create**. Extends `BaseLayout`. Static content: full privacy policy covering data collection, cookies, Amazon affiliate relationship, analytics. Title: "Privacy Policy | TSA Monster".
- `src/pages/en/affiliate-disclosure.astro` — **create**. Extends `BaseLayout`. Static content: FTC-compliant affiliate disclosure text, explaining Amazon Associates relationship. Must include the `AffiliateDisclosure` component prominently. Title: "Affiliate Disclosure | TSA Monster".
- `src/pages/en/contact.astro` — **create**. Extends `BaseLayout`. Static content: contact info / editorial address, note about review requests. No form (static site — no server-side processing). Title: "Contact | TSA Monster".
- `src/layouts/BaseLayout.astro` — **read-only**. Props: `title`, `description`, `ogImage?`, `lang?`. All static pages extend this directly. Do not modify.
- `src/components/ArticleCard.astro` — **read-only**. Props: `title`, `excerpt`, `category`, `slug`, `heroImage`, `date`. Used on home page. Do not modify.
- `src/components/AffiliateDisclosure.astro` — **read-only**. No props. Used on the affiliate-disclosure page and already wired into `ArticleLayout` for articles.

### Build Order

1. **Four static pages first** — About, Privacy Policy, Affiliate Disclosure, Contact. These are independent of each other and of the home page. Verify with `pnpm build` + `pnpm astro check` after all four are written. Build should go from 2 pages to 6 pages.

2. **Home page rewrite second** — requires understanding the final static page count to set sitemap expectations. The home page uses `getCollection('reviews')` — with an empty collection, it should render the hero + category grid + empty articles section (or a "Coming soon" placeholder). Verify that the section degrades cleanly rather than crashing.

The home page is the only page with a collection dependency. Nothing else in S02 touches collections.

### Verification Approach

After static pages:
```bash
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'   # zero output = clean
# Confirm new pages generated
ls dist/en/about/index.html
ls dist/en/privacy-policy/index.html
ls dist/en/affiliate-disclosure/index.html
ls dist/en/contact/index.html
pnpm astro check   # 0 errors, 0 warnings, 0 hints
```

After home page rewrite:
```bash
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'   # zero output
curl -s http://localhost:4321/en/ | grep -i 'kitchen\|outdoor\|home\|beauty'  # category grid present
curl -s http://localhost:4321/en/ | grep -i 'og:title\|canonical'             # SEO meta present
```

## Constraints

- Static site only — no server-side rendering, no forms with action handlers. Contact page is informational text only.
- `BaseLayout` expects `title` and `description` as required props. Every static page must supply both with unique values per R005.
- Footer already hardcodes `href` values for `/en/privacy-policy/`, `/en/affiliate-disclosure/`, `/en/about/`, `/en/contact/` — these slugs must match exactly.
- Header nav links use `getRelativeLocaleUrl(locale, '/{slug}/')` for kitchen/outdoor/home/beauty — the home page category grid links must also use the same path pattern (`/en/{category}/`) so they resolve correctly.
- `getCollection('reviews')` returns `[]` on empty collection (K008) — home page must not assume non-empty. Sort + slice are safe on empty arrays.

## Common Pitfalls

- **Import path depth from `src/pages/en/`** — `BaseLayout` is two levels up: `'../../layouts/BaseLayout.astro'`. `AffiliateDisclosure` is `'../../components/AffiliateDisclosure.astro'`. S01 notes confirm 2 levels is correct (3 levels was a mistake caught during S01).
- **`getCollection` import source** — must be `import { getCollection } from 'astro:content'`, not from `astro`. The home page already has a pattern to follow in `src/pages/en/[category]/[slug].astro`.
- **Footer link slugs** — Footer.astro hardcodes the four legal page hrefs. Page files must be named to match: `about.astro`, `privacy-policy.astro`, `affiliate-disclosure.astro`, `contact.astro`. Mismatch = 404 on those links.
- **OG image fallback** — BaseLayout falls back to `/og-default.png` when `ogImage` prop is omitted. That file doesn't exist yet. This causes a broken OG image meta tag but is not a build error. Static pages can omit `ogImage` for now; a placeholder or real image can be added in S04 prep.
