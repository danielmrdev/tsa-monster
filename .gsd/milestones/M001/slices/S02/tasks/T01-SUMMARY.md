---
id: T01
parent: S02
milestone: M001
provides:
  - src/pages/en/about.astro
  - src/pages/en/privacy-policy.astro
  - src/pages/en/affiliate-disclosure.astro
  - src/pages/en/contact.astro
key_files:
  - src/pages/en/about.astro
  - src/pages/en/privacy-policy.astro
  - src/pages/en/affiliate-disclosure.astro
  - src/pages/en/contact.astro
key_decisions:
  - Renamed AffiliateDisclosure import to AffiliateDisclosureBlock to avoid ts(2440) collision with Astro auto-generated type alias derived from the page filename
patterns_established:
  - All static pages use <main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12"> + <article class="prose prose-slate max-w-none"> pattern
  - When a page filename camelCases to match a component import name, rename the import alias
observability_surfaces:
  - pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' — zero output = clean
  - ls dist/en/{about,privacy-policy,affiliate-disclosure,contact}/index.html — all four must exist
  - grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html — confirms AffiliateDisclosure component rendered
  - pnpm astro check — 0 errors, 0 warnings, 0 hints
duration: 15m
verification_result: passed
completed_at: 2025-03-17
blocker_discovered: false
---

# T01: Write four static pages (About, Privacy Policy, Affiliate Disclosure, Contact)

**Created all four static pages with real prose content; build clean, astro check 0 errors.**

## What Happened

Created the four legally required static pages at their exact footer-linked slugs:
- `src/pages/en/about.astro` — editorial mission, review methodology, independence statement
- `src/pages/en/privacy-policy.astro` — data collection, cookies, Amazon Associates, analytics, user rights (with "Last updated" date)
- `src/pages/en/affiliate-disclosure.astro` — FTC-compliant disclosure with embedded `AffiliateDisclosureBlock`, full prose explaining how commissions work
- `src/pages/en/contact.astro` — editorial contact, review request policy, press inquiries, no server form

All pages extend BaseLayout with unique `title` + `description` props and use the `<main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">` + `<article class="prose prose-slate max-w-none">` pattern.

Also added `## Observability / Diagnostics` to S02-PLAN.md and `## Observability Impact` to T01-PLAN.md per pre-flight requirements.

## Verification

```
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'   → (none)
ls dist/en/about/index.html                        → exists
ls dist/en/privacy-policy/index.html               → exists
ls dist/en/affiliate-disclosure/index.html         → exists
ls dist/en/contact/index.html                      → exists
grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html | wc -l  → 1
grep -r 'lorem ipsum|TODO|placeholder' dist/en/   → (clean)
pnpm astro check                                   → 0 errors, 0 warnings, 0 hints
```

## Diagnostics

- Build output at `dist/en/{slug}/index.html` — `ls` is the authoritative existence check
- `pnpm astro check` is the type-check signal — any future component import changes here should be re-checked
- AffiliateDisclosure render confirmation: `grep -i 'As an Amazon Associate' dist/en/affiliate-disclosure/index.html`

## Deviations

Renamed import from `AffiliateDisclosure` to `AffiliateDisclosureBlock` in `affiliate-disclosure.astro`. The page filename `affiliate-disclosure` camelCases to `AffiliateDisclosure`, which Astro's type generator uses as a local type alias — causing `ts(2440)` import conflict. This is an Astro-specific quirk; the component is the same, only the import alias changed.

## Known Issues

None.

## Files Created/Modified

- `src/pages/en/about.astro` — created, About page with editorial mission and methodology
- `src/pages/en/privacy-policy.astro` — created, Privacy Policy with data practices and Amazon Associates disclosure
- `src/pages/en/affiliate-disclosure.astro` — created, FTC-compliant disclosure page with AffiliateDisclosureBlock component embedded
- `src/pages/en/contact.astro` — created, Contact page with editorial email and inquiry guidance
- `.gsd/milestones/M001/slices/S02/S02-PLAN.md` — added Observability/Diagnostics section and diagnostic verification steps
- `.gsd/milestones/M001/slices/S02/tasks/T01-PLAN.md` — added Observability Impact section
- `.gsd/KNOWLEDGE.md` — appended K009 (Astro page filename / component import name collision)
