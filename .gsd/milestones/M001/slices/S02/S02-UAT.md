# S02: Static pages + home — UAT

**Milestone:** M001
**Written:** 2026-03-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All deliverables are static HTML files produced by `pnpm build`. Content correctness, SEO meta, and structural integrity are fully verifiable via file inspection and grep — no server runtime or browser required. (Note: browser tools are unavailable in this environment per K004.)

## Preconditions

- `pnpm build` has been run and `dist/` is current
- All five target files exist: `dist/en/about/index.html`, `dist/en/privacy-policy/index.html`, `dist/en/affiliate-disclosure/index.html`, `dist/en/contact/index.html`, `dist/en/index.html`
- Reviews collection is empty (S03 not yet run) — home page will show "Reviews coming soon." placeholder

## Smoke Test

```bash
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'  # must produce no output
ls dist/en/about/index.html dist/en/privacy-policy/index.html dist/en/affiliate-disclosure/index.html dist/en/contact/index.html dist/en/index.html  # all five must exist
```

If either command fails, the slice has regressed and nothing else should be tested.

## Test Cases

### 1. About page: exists, real content, unique SEO meta

```bash
# 1. Check the file exists
ls dist/en/about/index.html

# 2. Confirm unique title
grep '<title>' dist/en/about/index.html

# 3. Confirm canonical points to /en/about/
grep 'canonical' dist/en/about/index.html

# 4. Confirm OG title present
grep 'og:title' dist/en/about/index.html

# 5. Confirm real prose (not placeholder)
grep -i 'editorial\|methodology\|independent' dist/en/about/index.html | head -3
```

**Expected:** File exists. `<title>` contains "About" (unique, not "TSA Monster — Expert Product Reviews"). Canonical href ends in `/en/about/`. OG title present. At least one match for editorial/methodology/independent keywords.

---

### 2. Privacy Policy page: exists, real content, Amazon Associates mentioned

```bash
ls dist/en/privacy-policy/index.html
grep '<title>' dist/en/privacy-policy/index.html
grep 'canonical' dist/en/privacy-policy/index.html
grep -i 'amazon associates\|affiliate\|cookies' dist/en/privacy-policy/index.html | head -3
```

**Expected:** File exists. `<title>` contains "Privacy Policy". Canonical ends in `/en/privacy-policy/`. Amazon Associates and affiliate/cookies language present.

---

### 3. Affiliate Disclosure page: FTC-compliant text + AffiliateDisclosure component rendered

```bash
ls dist/en/affiliate-disclosure/index.html
grep '<title>' dist/en/affiliate-disclosure/index.html
grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html | wc -l
grep -i 'FTC\|Federal Trade Commission\|commission' dist/en/affiliate-disclosure/index.html | head -3
```

**Expected:** File exists. `<title>` contains "Affiliate Disclosure". `As an Amazon Associate` appears at least once (confirms AffiliateDisclosure component rendered inside the page). FTC/commission language present.

---

### 4. Contact page: exists, no server form, editorial email present

```bash
ls dist/en/contact/index.html
grep '<title>' dist/en/contact/index.html
grep -i 'mailto:\|@\|editorial\|review request' dist/en/contact/index.html | head -3
grep '<form' dist/en/contact/index.html || echo "no form (expected)"
```

**Expected:** File exists. `<title>` contains "Contact". Editorial contact info (email or mailto link) present. No `<form` element — contact is information-only for M001.

---

### 5. All static pages: slugs match Footer.astro hardcoded links

```bash
# Confirm Footer links exist in footer HTML on each page
grep 'href.*about\|href.*privacy-policy\|href.*affiliate-disclosure\|href.*contact' dist/en/about/index.html | head -4
```

**Expected:** Footer links to `/en/about`, `/en/privacy-policy`, `/en/affiliate-disclosure`, `/en/contact` present in every page (inherited via BaseLayout → Footer.astro). Slugs match exactly.

---

### 6. Home page: hero + category grid + SEO meta

```bash
ls dist/en/index.html

# Category grid links
grep -c 'href="/en/kitchen/"\|href="/en/outdoor/"\|href="/en/home/"\|href="/en/beauty/"' dist/en/index.html

# SEO
grep 'og:title' dist/en/index.html | head -1
grep 'canonical' dist/en/index.html | head -1

# Page title
grep '<title>' dist/en/index.html
```

**Expected:** File exists. Category link count >= 4 (currently 6 — hero CTA plus grid). OG title contains "TSA Monster". Canonical is `https://tsa.monster/en/`. `<title>` is "TSA Monster — Expert Product Reviews".

---

### 7. Home page: empty-collection safe rendering

```bash
grep 'Reviews coming soon' dist/en/index.html
```

**Expected:** Matches — confirms the ternary empty-state renders correctly when no review MDX files exist. This string disappears automatically after S03.

---

### 8. Home page: all four category names in page body

```bash
grep -i 'kitchen\|outdoor\|home\|beauty' dist/en/index.html | wc -l
```

**Expected:** Count >= 4. (Currently 8 — appears in hero subtext, category grid, and trust bar.)

---

### 9. No placeholder content leaked

```bash
grep -r 'lorem ipsum\|TODO\|placeholder' dist/en/ || echo "clean"
```

**Expected:** Outputs "clean" — no placeholder text in any built page.

---

### 10. Type check clean

```bash
pnpm astro check 2>&1 | tail -5
```

**Expected:** `Result (N files): 0 errors, 0 warnings, 0 hints`

---

## Edge Cases

### AffiliateDisclosure component import alias collision

If `affiliate-disclosure.astro` is ever edited and the import is renamed back to `AffiliateDisclosure` (from `AffiliateDisclosureBlock`):

```bash
pnpm astro check 2>&1 | grep 'ts(2440)\|conflicts with local'
```

**Expected:** Must return no output. If it does return output, the ts(2440) collision has been reintroduced — rename the import alias back to `AffiliateDisclosureBlock`.

---

### Home page with real articles (post-S03)

After S03 adds MDX review files:

```bash
pnpm build
grep 'Reviews coming soon' dist/en/index.html || echo "placeholder gone (expected)"
grep 'href="/en/kitchen/' dist/en/index.html | wc -l
```

**Expected:** "Reviews coming soon." no longer appears. Article card links appear in `/en/{category}/{slug}/` format. Category links still >= 4.

---

### Static page accessible from root redirect

Verify that the root redirect at `/` would land a user at `/en/` and footer links from there navigate correctly. Since this is a static site and browser tools are unavailable, verify the redirect source:

```bash
cat dist/index.html | grep -i 'navigator.language\|/en/'
```

**Expected:** Root redirect script present, `/en/` fallback confirmed (validated in S01, carried through S02 unchanged).

---

## Failure Signals

- `pnpm build` emits `[ERROR]` lines — type error or import path wrong; run `pnpm astro check` to isolate
- `ls dist/en/{slug}/index.html` fails — page filename doesn't match expected slug; check `src/pages/en/` filenames
- `grep 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html` returns 0 — AffiliateDisclosure component not rendering; check import alias in `affiliate-disclosure.astro`
- `grep 'og:title' dist/en/index.html` returns nothing — BaseLayout not wrapping correctly; inspect `src/pages/en/index.astro` frontmatter props
- `grep -c 'href="/en/kitchen/...' dist/en/index.html` returns 0 — category grid not rendered; inspect the `categories` array in `index.astro` frontmatter
- `pnpm astro check` reports errors — run with `--verbose` and look for `ts(2440)` (import collision) or `Cannot find module` (import path wrong)

## Requirements Proved By This UAT

- R003 — All four required pages exist at correct slugs (`/en/about/`, `/en/privacy-policy/`, `/en/affiliate-disclosure/`, `/en/contact/`), with real prose and AffiliateDisclosure component rendered. FTC disclosure text confirmed in built HTML.
- R004 — Home page at `/en/` has functional category grid, hero section, recent articles section (empty-safe). Footer legal links present on every page.
- R005 (partial) — All five new pages have unique `<title>`, `<meta description>`, canonical, OG title/description/image, Twitter Card, and hreflang via BaseLayout. Full R005 validation (all 15 articles + unique descriptions) completes in S03.

## Not Proven By This UAT

- R005 full validation — unique SEO metadata across all 15 review articles is not provable until S03 adds MDX content
- R004 non-empty articles list — home page article grid behavior with real data is not testable until S03
- Live runtime accessibility — `pnpm preview` + browser verification is recommended for human sign-off but not executable in CI-only environments (K004)
- Footer links resolve to real pages in a browser — confirmed structurally (slugs match), but click-through verification requires a live server

## Notes for Tester

- The "Reviews coming soon." text on the home page is intentional — S03 adds the MDX content that replaces it
- `grep` exit code 1 (no matches) from `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` is a **pass** — exit 1 means nothing matched, which is what we want
- The category link count of 6 (not 4) on the home page is expected: `/en/kitchen/` appears in both the hero CTA ("Browse Reviews") and the Kitchen card in the category grid
- `pnpm astro check` takes ~2 minutes in this environment — this is normal
- If running human visual review via `pnpm preview`, check `/en/about/`, `/en/privacy-policy/`, `/en/affiliate-disclosure/`, `/en/contact/`, and `/en/` — confirm prose is readable, layout matches the rest of the site, and no obvious broken elements
