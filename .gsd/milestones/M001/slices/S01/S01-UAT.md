# S01: Astro scaffold + i18n foundation — UAT

**Milestone:** M001
**Written:** 2026-03-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S01 is a pure scaffold slice — no user-facing content, no runtime server in production. All deliverables are verified by build output inspection and dev server curl responses. Browser tools are unavailable in this environment (K004). Machine-verifiable contract.

## Preconditions

- Node 22+ and pnpm v10+ installed
- Working directory: `/home/daniel/tsa.monster`
- `pnpm install` already run (all deps in `node_modules/`)
- No other process running on port 4321

## Smoke Test

```bash
pnpm build && ls dist/en/index.html && ls dist/sitemap-index.xml && echo "SMOKE OK"
```
Expected: exits 0, prints paths, prints `SMOKE OK`.

## Test Cases

### 1. Build exits 0 with no errors or warnings

```bash
pnpm build 2>&1
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]' || echo "Build clean"
```

1. Run `pnpm build` — observe output.
2. Run the grep pipeline.
3. **Expected:** Build output shows `2 page(s) built`, `sitemap-index.xml created at dist`. Grep pipeline prints `Build clean` (no `[ERROR]` or `[warn]` lines).

### 2. Required dist/ files present

```bash
ls dist/en/index.html
ls dist/sitemap-index.xml
ls dist/robots.txt
ls dist/_headers
```

1. Run each `ls` command after a successful build.
2. **Expected:** All four files exist. Exit code 0 for each.

### 3. TypeScript diagnostics clean

```bash
pnpm astro check
```

1. Run `pnpm astro check`.
2. **Expected:** Output ends with `Result (14 files): 0 errors, 0 warnings, 0 hints`. Non-zero file count confirms all layouts and components are being type-checked.

### 4. Tailwind v4 CSS compiled with custom tokens

```bash
grep 'color-brand\|color-surface\|color-ink\|font-display' dist/_astro/*.css | head -5
```

1. Run after `pnpm build`.
2. **Expected:** At least one line showing `--color-brand:#f59e0b` (amber), `--color-surface:#f8fafc`, `--color-ink:#0f172a`, and `--font-display` in the `@layer theme` block.

### 5. `/en/` page has correct SEO meta in built output

```bash
grep -E 'og:title|og:description|canonical|hreflang|application/ld\+json' dist/en/index.html
```

1. Run after `pnpm build`.
2. **Expected:** Lines present for `og:title`, `og:description`, `canonical` link, `hreflang` link(s), and `application/ld+json` script tag. Each is distinct — no duplicate meta names.

### 6. Dev server: `/en/` returns styled page with correct structure

```bash
# Start dev server (background), then:
curl -s http://localhost:4321/en/ | grep -E 'Header|Footer|TSA|text-brand|bg-surface|Kitchen|Outdoor'
```

1. Start `pnpm dev` in background.
2. Run curl command once server is ready.
3. **Expected:** Output contains Header markup with logo (TSA Monster), category nav links (Kitchen, Outdoor, Home, Beauty), Footer markup. Tailwind utility classes (`text-brand`, `bg-surface`, or rendered CSS) present in the response.

### 7. Dev server: `/` serves redirect script

```bash
curl -s http://localhost:4321/ | grep -E 'window.location|navigator.language|/en/'
```

1. With dev server running, curl the root path.
2. **Expected:** Response contains `navigator.language` and `window.location.replace` (or equivalent) redirecting to `/en/`. No layout — redirect-only page.

### 8. Dynamic route file is present and syntactically valid

```bash
ls src/pages/en/'[category]'/'[slug]'.astro
pnpm astro check  # Already covered in TC3, but confirms this file passes type check
```

1. Confirm file exists at the expected path.
2. Confirm `pnpm astro check` passes with it included.
3. **Expected:** File exists. TypeScript check passes (14 files includes this one).

### 9. Dynamic route with zero articles does not error

```bash
pnpm build 2>&1 | grep -i 'category\|slug\|ERROR'
```

1. Run `pnpm build` (with no MDX articles in `src/content/reviews/`).
2. **Expected:** No `[ERROR]` lines mentioning `category`, `slug`, or dynamic route generation. The "collection does not exist or is empty" message is NOT an error — it's a normal info message.

### 10. Content schema is importable and correct

```bash
grep -E 'reviews|category|heroImage|affiliateUrl' src/content.config.ts
```

1. Inspect `src/content.config.ts` source.
2. **Expected:** Lines confirm: `reviews` collection name, `category` enum field (kitchen|outdoor|home|beauty), `heroImage` string field, `affiliateUrl` optional string field within products array. This is the contract S03 MDX articles must satisfy.

## Edge Cases

### Empty category directories don't break build

```bash
ls src/content/reviews/kitchen/.gitkeep
ls src/content/reviews/outdoor/.gitkeep
ls src/content/reviews/home/.gitkeep
ls src/content/reviews/beauty/.gitkeep
pnpm build  # must exit 0 even with no .md/.mdx files
```

1. Confirm `.gitkeep` files exist in all four category dirs.
2. Run `pnpm build`.
3. **Expected:** Build exits 0 despite empty dirs. The `[WARN] [glob-loader] No files found` is expected and benign.

### `robots.txt` contains correct sitemap reference

```bash
cat public/robots.txt
```

1. Read the file.
2. **Expected:** Contains `User-agent: *`, `Allow: /`, and `Sitemap: https://tsa.monster/sitemap-index.xml` (matching the sitemap filename `@astrojs/sitemap` generates).

### `_headers` cache directives use correct syntax

```bash
cat public/_headers
```

1. Read the file.
2. **Expected:** Contains path pattern `/_astro/*` followed by `Cache-Control: public, max-age=31536000, immutable`, and `/*.html` followed by `Cache-Control: public, max-age=3600, s-maxage=86400`. Cloudflare Pages path-pattern syntax (no wildcards in header values).

## Failure Signals

- `pnpm build` exits non-zero — build is broken. Check `[ERROR]` lines for file + line reference.
- `pnpm astro check` reports errors — TypeScript type mismatch in a layout or component. Common cause: content schema field name mismatch.
- `dist/en/index.html` missing after build — `/en/` route not generating. Check `src/pages/en/index.astro` exists and imports BaseLayout correctly.
- `dist/sitemap-index.xml` missing — `@astrojs/sitemap` not firing. Check `astro.config.mjs` has `sitemap()` in `integrations` and `site` URL is set.
- `dist/_astro/*.css` absent or empty — Tailwind v4 not compiling. Check `@tailwindcss/vite` is in `vite.plugins` in `astro.config.mjs` and `global.css` has `@import "tailwindcss"`.
- `pnpm astro check` output shows fewer than 14 files — a layout or component is not being reached by the type checker, suggesting an import error.
- `[LegacyContentConfigError]` in build output — content config is at the wrong path. Must be `src/content.config.ts`, not `src/content/config.ts`.

## Requirements Proved By This UAT

- R001 — Astro 6 static output confirmed (2 pages built, static mode logged). i18n with `prefixDefaultLocale: true` confirmed (all pages under `/en/`). Build exits 0.
- R006 — Root `/` redirect script confirmed via curl (TC7). `navigator.language` check present. LOCALES-driven.
- R007 — `public/_headers` confirmed syntactically correct (edge case TC). Cache directives present for `/_astro/*` and `/*.html`.
- R005 (infrastructure) — BaseLayout generates canonical, OG, hreflang (TC5). Sitemap generated (TC2). Schema.org JSON-LD in ArticleLayout.

## Not Proven By This UAT

- **R005 full** — all 15 articles and 4 static pages having unique `<title>` and `<meta description>` — proven in S02/S03.
- **R001 browser redirect** — visual browser confirmation of `/` → `/en/` redirect is not possible (K004: Playwright unavailable). Curl confirms the redirect script is served; actual redirect execution in a real browser is not verified here.
- **R007 CDN behavior** — `_headers` is confirmed syntactically correct and present in `public/`. Whether Cloudflare reads it when served via Caddy (as opposed to Cloudflare Pages) is untested until S04.
- **Dynamic route with real articles** — TC8/TC9 confirm the route file exists and the empty-collection case doesn't error. Routes actually generating correct HTML for real articles is proven in S03.
- **Visual design** — amber/slate editorial palette compiles to CSS (TC4). Rendered appearance in a browser is not verified in this environment.

## Notes for Tester

- The `[WARN] [glob-loader] No files found matching "**/*.{md,mdx}"` and "The collection 'reviews' does not exist or is empty" messages appear in every `pnpm build` until S03 adds articles. These are expected — not failures.
- `pnpm astro check` may re-optimize Vite deps on first run after a cold start — this adds a few seconds but is normal.
- If running TC6/TC7 (dev server), start `pnpm dev` in a separate terminal or background it. The dev server must be running on port 4321 before the curl commands execute. Kill it with `Ctrl+C` when done.
- The content schema in `src/content.config.ts` is the exact contract S03 MDX frontmatter must satisfy. Any field added or renamed there must be updated in both the schema and all existing articles simultaneously, or `pnpm astro check` will fail.
