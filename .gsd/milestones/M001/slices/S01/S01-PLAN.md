# S01: Astro scaffold + i18n foundation

**Goal:** Astro 6 project scaffolded from scratch with Tailwind v4 rendering, i18n routing, content collections schema, all shared layouts and components, and the two page routes needed for S02/S03 to proceed. `pnpm build` succeeds with no errors.

**Demo:** `pnpm dev` runs. Navigating to `/` in a browser redirects to `/en/`. `/en/` returns a styled shell page (Tailwind utility classes visibly applied). `pnpm build && ls dist/en/index.html dist/sitemap-index.xml` (or `dist/sitemap-0.xml`) exits 0.

## Must-Haves

- `pnpm build` exits 0 with no TypeScript or Astro errors
- `/` redirects to `/en/` (client-side script, reads `navigator.language`)
- `/en/` returns a 200 with styled shell content (Tailwind rendering confirmed)
- `dist/en/index.html` present after build
- `dist/sitemap-index.xml` or `dist/sitemap-0.xml` present after build
- `src/content/config.ts` defines the reviews collection schema that S03 articles must satisfy
- All shared layouts and components present and buildable (S02 and S03 can import them)
- `public/robots.txt` and `public/_headers` present
- No use of deprecated Astro 4/5 API (`type: 'content'`, `entry.slug`, `astro add tailwind`)

## Proof Level

- This slice proves: contract
- Real runtime required: yes (Tailwind rendering requires `pnpm dev` browser check)
- Human/UAT required: no (build output and redirect behavior are machine-verifiable)

## Observability / Diagnostics

- **Build errors**: `pnpm build` prints structured errors to stderr — check for `[ERROR]` lines with file + line references.
- **Tailwind rendering**: Inspect generated `dist/en/index.html` for `class="..."` attributes; computed styles in DevTools confirm custom properties resolve. Check `dist/_astro/*.css` for the presence of `.text-brand`, `.bg-surface`, etc.
- **i18n routing failures**: Astro logs `[warn] i18n` lines when locale config mismatches page routes. Look for warnings in `pnpm build` or `pnpm dev` output.
- **TypeScript errors**: `pnpm astro check` emits `error TS` lines; non-zero exit code signals failure.
- **Dev server failure state**: If `pnpm dev` fails to start, check port 4321 already in use (`ss -tlnp | grep 4321`); inspect `node_modules/.astro/` cache for stale build artifacts.
- **Failure-path check**: `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` — zero output is clean; any output indicates configuration or type issues that must be resolved before marking done.
- **Redaction**: No secrets or credentials in any source file — all config is public (site URL, locale list, CSS tokens).

## Verification

```bash
# Build must succeed
pnpm build

# Required output files
ls dist/en/index.html
ls dist/sitemap-index.xml 2>/dev/null || ls dist/sitemap-0.xml

# TypeScript clean
pnpm astro check

# Diagnostic: confirm no build errors or warnings
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' || echo "Build clean"

# Inspect generated CSS for Tailwind custom properties
grep -l 'text-brand\|bg-surface' dist/_astro/*.css 2>/dev/null || echo "Check dist/_astro/ manually"

# Dynamic route failure-state check: empty collection must NOT error
pnpm build 2>&1 | grep -i 'category\|slug' || echo "No dynamic route errors"

# Confirm dynamic route file is present and robots/headers in public
ls src/pages/en/'[category]'/'[slug]'.astro && ls public/robots.txt && ls public/_headers && echo "Public files OK"
```

Browser check (run during T03): open `http://localhost:4321`, confirm `/` redirects to `/en/` and styled content visible.

## Integration Closure

- Upstream surfaces consumed: none (first slice)
- New wiring introduced: `astro.config.mjs` (i18n, integrations, Vite plugin); `src/content/config.ts` (reviews schema); `src/layouts/BaseLayout.astro` + `ArticleLayout.astro`; all shared components; `src/pages/index.astro` (redirect); `src/pages/en/index.astro` (shell); `src/pages/en/[category]/[slug].astro` (dynamic route)
- What remains: S02 populates static pages + home content; S03 fills `src/content/reviews/` with MDX articles

## Tasks

- [x] **T01: Scaffold Astro project, wire Tailwind v4, configure i18n** `est:45m`
  - Why: Establishes the buildable foundation everything else depends on. Tailwind v4 config is the highest-risk item — must be verified rendering before layouts are written on top of it.
  - Files: `package.json`, `astro.config.mjs`, `src/styles/global.css`, `src/env.d.ts`, `tsconfig.json`, `src/pages/index.astro`, `src/pages/en/index.astro`, `src/i18n/config.ts`
  - Do: Run `pnpm create astro@latest . -- --template minimal --typescript strict --no-install --git false`, then `pnpm install`. Install deps: `pnpm add @astrojs/mdx @astrojs/sitemap tailwindcss @tailwindcss/vite @tailwindcss/typography`. Configure `astro.config.mjs` (see research for exact shape — Vite plugin, i18n block, integrations). Create `src/styles/global.css` with `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, and `@theme {}` block with site color tokens. Create `src/i18n/config.ts` with `LOCALES`, `DEFAULT_LOCALE`, `getSupportedLocales()`, `isSupportedLocale()`. Replace scaffold `src/pages/index.astro` with the client-side redirect script. Create `src/pages/en/index.astro` as a minimal shell page that imports `global.css` and uses at least one Tailwind utility class.
  - Verify: `pnpm dev` starts without error; open `http://localhost:4321/en/` and confirm page loads with visible Tailwind styling; `http://localhost:4321/` triggers redirect to `/en/` (check Network tab). Then `pnpm build` exits 0.
  - Done when: `pnpm build` exits 0 AND redirect + Tailwind rendering confirmed in browser.

- [x] **T02: Define content schema, write all layouts and components** `est:60m`
  - Why: Establishes the boundary contracts that S02 (static pages) and S03 (articles) depend on. These files must be buildable before any content is added.
  - Files: `src/content/config.ts`, `src/content/reviews/kitchen/.gitkeep`, `src/content/reviews/outdoor/.gitkeep`, `src/content/reviews/home/.gitkeep`, `src/content/reviews/beauty/.gitkeep`, `src/layouts/BaseLayout.astro`, `src/layouts/ArticleLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/AffiliateDisclosure.astro`, `src/components/ArticleCard.astro`, `src/components/ProductCard.astro`
  - Do: Create `src/content/config.ts` using `loader: glob(...)` from `astro/loaders` and `z` from `astro/zod` (NOT from `zod` directly) — see research for full schema shape. Create empty `.gitkeep` files in each category dir. Write `BaseLayout.astro`: props `title`, `description`, `ogImage?`, `lang?`; renders `<html lang>`, full `<head>` with SEO meta, OG tags, canonical URL (`new URL(Astro.url.pathname, Astro.site)`), hreflang for `/en/`; imports `../styles/global.css`; slot for Header + content + Footer. Write `ArticleLayout.astro`: extends BaseLayout, renders `<AffiliateDisclosure />` above the `<slot />`, includes Schema.org Article JSON-LD `<script type="application/ld+json">`. Write `Header.astro` with logo text and category nav links using `getRelativeLocaleUrl()` from `astro:i18n`. Write `Footer.astro` with legal page links and affiliate disclosure blurb. Write `AffiliateDisclosure.astro` with FTC/Amazon required disclosure text. Write `ArticleCard.astro` (props: `title`, `excerpt`, `category`, `slug`, `heroImage`, `date`). Write `ProductCard.astro` (props: `name`, `rating`, `description`, `affiliateUrl?`) with star display and "Check on Amazon" CTA (`href={affiliateUrl ?? '#'}`).
  - Verify: `pnpm build` exits 0 with no TypeScript errors. `pnpm astro check` clean.
  - Done when: `pnpm build` exits 0 and `pnpm astro check` reports zero errors.

- [x] **T03: Add dynamic article route, public files, final build verification** `est:30m`
  - Why: Completes the slice. The dynamic route is the contract S03 depends on; public files are required by R007. Final build check confirms the full slice is valid.
  - Files: `src/pages/en/[category]/[slug].astro`, `public/robots.txt`, `public/_headers`
  - Do: Write `src/pages/en/[category]/[slug].astro` — `getStaticPaths()` calls `getCollection('reviews')`, maps each entry to `{params: {category: entry.data.category, slug: entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id}, props: {entry}}`; component calls `const { Content } = await render(entry)` and renders via `<ArticleLayout>`. With zero articles in S01 this generates zero routes — that's expected and `pnpm build` must not error on it. Write `public/robots.txt`: `User-agent: *\nAllow: /\nSitemap: https://tsa.monster/sitemap-index.xml`. Write `public/_headers` with Cloudflare cache directives: `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`, `Cache-Control: public, max-age=3600, s-maxage=86400` for `/*.html`.
  - Verify: `pnpm build && ls dist/en/index.html && (ls dist/sitemap-index.xml 2>/dev/null || ls dist/sitemap-0.xml) && echo "BUILD OK"`. Run `pnpm astro check` — zero errors. Start `pnpm dev`, open browser to `http://localhost:4321/`, confirm redirect to `/en/` and styled content visible.
  - Done when: `pnpm build` exits 0, `dist/en/index.html` exists, sitemap file exists, `pnpm astro check` clean, browser redirect confirmed.

## Files Likely Touched

- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/env.d.ts`
- `src/styles/global.css`
- `src/i18n/config.ts`
- `src/content/config.ts`
- `src/content/reviews/{kitchen,outdoor,home,beauty}/.gitkeep`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/AffiliateDisclosure.astro`
- `src/components/ArticleCard.astro`
- `src/components/ProductCard.astro`
- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/pages/en/[category]/[slug].astro`
- `public/robots.txt`
- `public/_headers`
