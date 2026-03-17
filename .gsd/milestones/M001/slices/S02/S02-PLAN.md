# S02: Static pages + home

**Goal:** Five pages — About, Privacy Policy, Affiliate Disclosure, Contact, and Home — are all browsable with real content, correct layout, and unique SEO metadata.
**Demo:** `pnpm build` exits 0 with 7 pages in `dist/en/` (index + 4 static + category placeholder routes). Each static page file exists under `dist/en/`. Home page HTML contains the category grid and correct OG/canonical meta.

## Must-Haves

- `src/pages/en/about.astro`, `privacy-policy.astro`, `affiliate-disclosure.astro`, `contact.astro` — all created with real content, each extending BaseLayout with unique `title` + `description`
- Page slugs match Footer.astro hardcoded hrefs exactly: `about`, `privacy-policy`, `affiliate-disclosure`, `contact`
- `src/pages/en/index.astro` rewritten: hero section, 4-card category grid, recent articles section using `getCollection('reviews')` (empty-state safe)
- `pnpm build` and `pnpm astro check` both exit 0 after all pages are written

## Verification

```bash
# After T01 — static pages
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'   # zero output
ls dist/en/about/index.html
ls dist/en/privacy-policy/index.html
ls dist/en/affiliate-disclosure/index.html
ls dist/en/contact/index.html
pnpm astro check   # 0 errors, 0 warnings, 0 hints

# After T02 — home page
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'   # zero output
ls dist/en/index.html
grep -i 'kitchen\|outdoor\|home\|beauty' dist/en/index.html   # category grid present
grep 'og:title\|canonical' dist/en/index.html                  # SEO meta present
pnpm astro check   # still 0 errors
```

## Tasks

- [ ] **T01: Write four static pages (About, Privacy Policy, Affiliate Disclosure, Contact)** `est:45m`
  - Why: R003 requires these pages to exist with real content before Amazon Associates application. Footer.astro already hardcodes their hrefs — the files must exist at the matching slugs.
  - Files: `src/pages/en/about.astro`, `src/pages/en/privacy-policy.astro`, `src/pages/en/affiliate-disclosure.astro`, `src/pages/en/contact.astro`
  - Do: Create each file extending BaseLayout with unique `title` + `description` props. Real prose content — not lorem ipsum. About: editorial mission + review methodology. Privacy Policy: data collection, cookies, Amazon Associates relationship, analytics. Affiliate Disclosure: FTC-compliant text + embed the `AffiliateDisclosure` component prominently. Contact: editorial address, review request note, no server-side form. Import paths from `src/pages/en/` are two levels up: `'../../layouts/BaseLayout.astro'`, `'../../components/AffiliateDisclosure.astro'`.
  - Verify: `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` → zero output. `ls dist/en/{about,privacy-policy,affiliate-disclosure,contact}/index.html` → all four exist. `pnpm astro check` → 0 errors.
  - Done when: All four `dist/en/*/index.html` files exist and build + type check are clean.

- [ ] **T02: Rewrite home page with hero, category grid, and recent articles** `est:45m`
  - Why: R004 requires the home page to feel like a real site — hero, category navigation grid, and recent articles list. Currently a 10-line stub.
  - Files: `src/pages/en/index.astro`
  - Do: Rewrite `src/pages/en/index.astro` with three sections: (1) **Hero** — full-width editorial headline + subtext + CTA button linking to `/en/kitchen/`. (2) **Category grid** — 4 cards (Kitchen, Outdoor, Home, Beauty) each linking to `/en/{category}/`, with icon or decorative element and short description. Use direct paths `/en/{category}/` (not `getRelativeLocaleUrl` — static pages don't have Astro.currentLocale populated the same way; simple `/en/` prefix is safe here). (3) **Recent articles** — import `getCollection` from `astro:content`, query `reviews` collection, sort by date descending, render up to 6 `ArticleCard` components. Must handle empty array gracefully — show a "Coming soon" placeholder paragraph when `articles.length === 0`, no crash. Keep BaseLayout props: `title="TSA Monster — Expert Product Reviews"`, `description` ~155 chars. Wrap each section in `<section>` with appropriate `aria-label`. Import paths: `'../../layouts/BaseLayout.astro'`, `'../../components/ArticleCard.astro'`.
  - Verify: `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` → zero output. `grep -i 'kitchen\|outdoor\|home\|beauty' dist/en/index.html` → matches. `grep 'og:title\|canonical' dist/en/index.html` → matches. `pnpm astro check` → 0 errors.
  - Done when: Build is clean, home page HTML contains category links and OG meta, type check passes.

## Files Likely Touched

- `src/pages/en/about.astro` — create
- `src/pages/en/privacy-policy.astro` — create
- `src/pages/en/affiliate-disclosure.astro` — create
- `src/pages/en/contact.astro` — create
- `src/pages/en/index.astro` — rewrite
