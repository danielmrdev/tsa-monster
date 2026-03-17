---
estimated_steps: 5
estimated_files: 4
---

# T01: Write four static pages (About, Privacy Policy, Affiliate Disclosure, Contact)

**Slice:** S02 — Static pages + home
**Milestone:** M001

## Description

Create the four legally required static pages that Amazon Associates reviewers and visitors expect. These pages are structurally identical — each extends `BaseLayout` with unique `title` + `description` props and renders static HTML content inside `<main>`. No dynamic data, no collection queries.

The page slugs must match what `Footer.astro` already hardcodes: `about`, `privacy-policy`, `affiliate-disclosure`, `contact`. Mismatch = 404 on footer links.

Load the `frontend-design` skill (`~/.gsd/agent/skills/frontend-design/SKILL.md`) before writing content — this is a UI/content task and the skill guides quality and consistency.

## Steps

1. **Create `src/pages/en/about.astro`** — Title: `"About TSA Monster | Expert Product Reviews"`. Description: ~155-char summary of editorial mission. Content: who we are, editorial independence statement, review methodology (hands-on testing, affiliate relationship disclosed), team note. Use `<main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">` outer wrapper. Use `<article class="prose prose-slate max-w-none">` for the content block (Tailwind Typography is installed). Import: `import BaseLayout from '../../layouts/BaseLayout.astro';`.

2. **Create `src/pages/en/privacy-policy.astro`** — Title: `"Privacy Policy | TSA Monster"`. Description: ~155 chars. Content: data collection practices, cookies, Amazon Associates affiliate relationship, analytics, user rights, contact for privacy inquiries. Include a "Last updated" date. Same layout/class pattern as About.

3. **Create `src/pages/en/affiliate-disclosure.astro`** — Title: `"Affiliate Disclosure | TSA Monster"`. Description: ~155 chars. Content: FTC-compliant disclosure explaining Amazon Associates relationship. **Must embed the `AffiliateDisclosure` component prominently near the top** before the prose body. Import: `import AffiliateDisclosure from '../../components/AffiliateDisclosure.astro';`. Then add a full prose section explaining what affiliate links are, how commissions work, and that product recommendations are editorially independent.

4. **Create `src/pages/en/contact.astro`** — Title: `"Contact | TSA Monster"`. Description: ~155 chars. Content: editorial contact email (use a placeholder like `hello@tsa.monster`), note about review requests and press inquiries, response time expectation. No HTML form — static site, no server-side processing. Simple prose layout matching the others.

5. **Verify**: Run `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` → must produce zero output. Run `ls dist/en/about/index.html dist/en/privacy-policy/index.html dist/en/affiliate-disclosure/index.html dist/en/contact/index.html` → all four must exist. Run `pnpm astro check` → `0 errors, 0 warnings, 0 hints`.

## Must-Haves

- [ ] All four files created at the correct paths with correct naming (slugs must match footer hrefs)
- [ ] Each page has a unique `title` and `description` prop passed to BaseLayout
- [ ] `affiliate-disclosure.astro` embeds the `AffiliateDisclosure` component
- [ ] Content is real prose — not placeholders or lorem ipsum
- [ ] `pnpm build` exits 0 with all four pages in dist/
- [ ] `pnpm astro check` exits 0

## Verification

```bash
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'
# Expected: zero output (empty-collection warn about reviews is expected noise — not an error)

ls dist/en/about/index.html
ls dist/en/privacy-policy/index.html
ls dist/en/affiliate-disclosure/index.html
ls dist/en/contact/index.html
# Expected: all four exist

grep -l 'Affiliate Disclosure' dist/en/affiliate-disclosure/index.html
# Expected: the file (confirms AffiliateDisclosure component rendered)

pnpm astro check
# Expected: 0 errors, 0 warnings, 0 hints
```

## Inputs

- `src/layouts/BaseLayout.astro` — props: `title: string`, `description: string`, `ogImage?: string`, `lang?: string`. Import from `'../../layouts/BaseLayout.astro'` (two levels up from `src/pages/en/`).
- `src/components/AffiliateDisclosure.astro` — no props, static disclosure block. Import from `'../../components/AffiliateDisclosure.astro'`. Required on the affiliate-disclosure page.
- `src/components/Footer.astro` — **read-only reference**: Footer hardcodes hrefs `/en/privacy-policy/`, `/en/affiliate-disclosure/`, `/en/about/`, `/en/contact/`. File slugs must match exactly.
- `src/styles/global.css` — **do not modify**. Custom Tailwind tokens available: `text-ink`, `text-ink-muted`, `bg-surface`, `bg-brand-light`, `border-brand`, `text-brand`, `font-display`, `font-sans`. Tailwind Typography (`prose prose-slate`) is installed via `@plugin "@tailwindcss/typography"`.

## Observability Impact

These are static pages with no runtime server component. Observability is entirely build-time and filesystem-based:

- **Build success signal:** `pnpm build` exits 0 and all four `dist/en/{slug}/index.html` files exist.
- **Type-check signal:** `pnpm astro check` reports `0 errors, 0 warnings, 0 hints`.
- **Component render confirmation:** `grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html` returns a match — confirms `AffiliateDisclosure` component was rendered into the page, not silently dropped.
- **Slug integrity:** `grep -r 'href=.*en/' src/components/Footer.astro` shows expected hrefs; matching pages must exist at those paths.
- **Failure state:** If a page is missing from `dist/`, the build still exits 0 (Astro won't error on omitted static pages) — the `ls` checks are the authoritative signal, not exit code alone.
- **No secrets, no credentials** — all pages are public static prose. No redaction needed.

## Expected Output

- `src/pages/en/about.astro` — created, renders About page
- `src/pages/en/privacy-policy.astro` — created, renders Privacy Policy page
- `src/pages/en/affiliate-disclosure.astro` — created, renders Affiliate Disclosure page with embedded `AffiliateDisclosure` component
- `src/pages/en/contact.astro` — created, renders Contact page
- `dist/en/about/index.html` — built output (verified by `ls`)
- `dist/en/privacy-policy/index.html` — built output (verified by `ls`)
- `dist/en/affiliate-disclosure/index.html` — built output (verified by `ls`)
- `dist/en/contact/index.html` — built output (verified by `ls`)
