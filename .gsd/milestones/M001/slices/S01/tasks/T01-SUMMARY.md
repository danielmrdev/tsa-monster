---
id: T01
parent: S01
milestone: M001
provides:
  - Buildable Astro 6 project scaffold with Tailwind v4, i18n, and starter routes
key_files:
  - package.json
  - astro.config.mjs
  - src/styles/global.css
  - src/i18n/config.ts
  - src/pages/index.astro
  - src/pages/en/index.astro
  - .npmrc
  - .gsd/KNOWLEDGE.md
key_decisions:
  - D007: Tailwind v4 via @tailwindcss/vite Vite plugin (not @astrojs/tailwind)
  - D008: pnpm onlyBuiltDependencies for esbuild + sharp
patterns_established:
  - Tailwind v4 CSS-first config via @import "tailwindcss" + @theme {} in global.css
  - i18n config centralized in src/i18n/config.ts with LOCALES, DEFAULT_LOCALE, helpers
  - Root / uses redirect-only page (client-side script, no layout)
  - pnpm onlyBuiltDependencies in package.json for native binary deps
observability_surfaces:
  - "pnpm build 2>&1 | grep -E '\\[ERROR\\]|\\[warn\\]' — zero output means clean build"
  - "dist/_astro/*.css — inspect for Tailwind custom properties (--color-brand, --color-surface)"
  - "pnpm astro check — zero errors/warnings confirms TypeScript clean"
  - "curl -s http://localhost:4321/en/ — verify page serves with bg-surface/text-brand classes"
duration: ~35m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: Scaffold Astro project, wire Tailwind v4, configure i18n

**Astro 6 scaffolded, Tailwind v4 CSS-first config wired and rendering, i18n configured with `prefixDefaultLocale: true`, redirect at `/` and styled shell at `/en/` — `pnpm build` exits 0.**

## What Happened

1. Ran `pnpm create astro@latest` — the CLI created a subdirectory (`apparent-ascension`) instead of scaffolding into `.` because the directory was non-empty (contained `.git` + `.gsd`). Moved scaffold files up to repo root manually.

2. Installed all deps: `pnpm install && pnpm add @astrojs/mdx @astrojs/sitemap tailwindcss @tailwindcss/vite @tailwindcss/typography`. pnpm v10 silently skipped esbuild/sharp build scripts — added `"pnpm": {"onlyBuiltDependencies": ["esbuild", "sharp"]}` to package.json and reinstalled. Both build scripts ran successfully on the second install.

3. Wrote `astro.config.mjs` with `@tailwindcss/vite` in `vite.plugins`, i18n block (`prefixDefaultLocale: true`, `defaultLocale: 'en'`, `locales: ['en']`), `mdx()` and `sitemap()` integrations. No `@astrojs/tailwind` integration.

4. Created `src/styles/global.css` with Tailwind v4 CSS-first config: `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, and `@theme {}` block defining `--color-brand`, `--color-brand-dark`, `--color-surface`, `--font-sans`.

5. Created `src/i18n/config.ts` exporting `LOCALES`, `DEFAULT_LOCALE`, `getSupportedLocales()`, `isSupportedLocale()`.

6. Replaced scaffold `src/pages/index.astro` with redirect-only page (client-side script only, no layout). Created `src/pages/en/index.astro` as minimal styled shell importing `global.css` and using `bg-surface`, `text-brand`, `font-sans` utility classes.

7. Also installed `@astrojs/check` and `typescript` (required by `pnpm astro check` which prompted interactively on first run).

## Verification

```bash
# Build: exit 0
pnpm build
# → 2 pages built, sitemap-index.xml generated, no errors

# Required files
ls dist/en/index.html        # ✓ exists
ls dist/sitemap-index.xml    # ✓ exists

# TypeScript clean
pnpm astro check             # ✓ 0 errors, 0 warnings, 0 hints (5 files)

# No build errors
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'
# → no output (clean)

# Tailwind rendering confirmed via generated CSS
grep 'color-brand\|color-surface' dist/_astro/*.css
# → --color-brand:#2563eb; --color-surface:#f8fafc present in @layer theme

# Dev server page check via curl
curl -s http://localhost:4321/en/ | grep 'text-brand\|bg-surface'
# → body class="bg-surface font-sans...", h1 class="...text-brand"
# → inline CSS includes .bg-surface { } and .text-brand { }
```

## Diagnostics

- `dist/_astro/*.css` — generated Tailwind CSS with `@layer theme` block containing all custom properties from `@theme {}`
- `pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'` — zero output means clean build
- `pnpm astro check` — TypeScript diagnostics across all `.astro` and `.ts` files
- Dev server: `curl -s http://localhost:4321/en/` verifies page content and Tailwind class rendering

## Deviations

- **Scaffold directory**: `pnpm create astro@latest .` created `./apparent-ascension` subdirectory instead of scaffolding in-place. Fixed by moving files up.
- **Import path in `src/pages/en/index.astro`**: Plan showed `'../../../styles/global.css'` (3 levels up) but correct relative path from `src/pages/en/` is `'../../styles/global.css'` (2 levels up). Fixed.
- **`@astrojs/check` + `typescript` install**: Not in the original dep list but required for `pnpm astro check`. Added as devDependencies.
- **pnpm onlyBuiltDependencies**: Not in plan but required to prevent silent esbuild/sharp build script failures with pnpm v10. Added to `package.json`.

## Known Issues

None. Build is clean, TypeScript is clean, Tailwind renders correctly.

## Files Created/Modified

- `package.json` — project config with all deps, pnpm onlyBuiltDependencies for esbuild/sharp
- `.npmrc` — `unsafe-perm=true` for build script execution
- `astro.config.mjs` — full config: static output, site URL, i18n routing, Vite Tailwind plugin, mdx + sitemap integrations
- `src/styles/global.css` — Tailwind v4 CSS-first config with `@theme {}` custom tokens
- `src/i18n/config.ts` — locale constants and helper functions
- `src/pages/index.astro` — redirect-only page (client-side script to detect locale)
- `src/pages/en/index.astro` — minimal styled shell confirming Tailwind rendering
- `.gsd/KNOWLEDGE.md` — created with K001–K004 (scaffold gotchas, pnpm v10, Tailwind v4, Playwright unavailable)
- `.gsd/DECISIONS.md` — appended D007 (Tailwind v4 plugin), D008 (pnpm build scripts)
- `.gsd/milestones/M001/slices/S01/S01-PLAN.md` — added Observability/Diagnostics section
- `.gsd/milestones/M001/slices/S01/tasks/T01-PLAN.md` — added Observability Impact section
