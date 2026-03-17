# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | i18n URL strategy | `prefixDefaultLocale: true` — all locales prefixed including EN (`/en/`, `/de/`...) | Symmetric URLs make adding new locales predictable. Root `/` does redirect only. Amazon Associates sees clean `/en/` URLs. | Yes — if SEO analysis shows `/en/` prefix hurts ranking vs bare `/` |
| D002 | M001 | arch | Language redirect | Client-side script at `/` using `navigator.language` + `navigator.languages`, fallback to `/en/` | Static site — no server-side redirect possible. Script runs before paint. Adding new locale only requires updating the `LOCALES` array in `src/i18n/config.ts`. | No |
| D003 | M001 | library | i18n implementation | Astro 6 native i18n (no third-party library) | Astro 6 has mature built-in i18n with `prefixDefaultLocale`, fallback, and `getRelativeLocaleUrl()` helpers. No external dependency needed. | No |
| D004 | M001 | arch | Images | Unsplash lifestyle photos downloaded as local assets | Static build must not depend on external CDN at runtime. Unsplash license allows commercial use. Lifestyle/ambient photos (not product-specific) avoid Amazon image copyright issues. | Yes — can replace with real product photos later |
| D005 | M001 | arch | Deploy | `dist/` copied to existing VPS `/var/www/tsa-monster/`, new site block added to existing Caddy config | Caddy already installed and running. No new infrastructure needed. Cloudflare in proxy mode handles SSL. | No |
| D006 | M001 | convention | Affiliate links | Placeholder `#` href CTAs for M001 | Amazon Associates account not yet approved. Real links added post-approval. CTAs must still be present and visually correct. | No — replace after approval |
| D007 | M001/S01 | library | Tailwind CSS | Tailwind v4 via `@tailwindcss/vite` Vite plugin — no `@astrojs/tailwind` wrapper | Tailwind v4 is CSS-first: `@import "tailwindcss"` + `@theme {}` in CSS. No `tailwind.config.js`. `@tailwindcss/vite` is the correct v4 integration; `@astrojs/tailwind` is legacy v3 only. | No |
| D008 | M001/S01 | tooling | pnpm build scripts | `"pnpm": {"onlyBuiltDependencies": ["esbuild", "sharp"]}` in `package.json` | pnpm v10 requires explicit approval for post-install scripts. `esbuild` (Vite's bundler) and `sharp` (Astro image processing) need their build scripts to run. Without this, build fails. | No |
| D009 | M001/S01 | design | Brand color palette | Amber/slate editorial scheme — `--color-brand: #f59e0b`, `--color-ink: #0f172a`, `--color-surface: #f8fafc`, `--font-display: DM Serif Display` | Original placeholder was generic blue (#2563eb). Amber with dark slate is more distinctive, reads editorial/trustworthy, and differentiates the site from generic affiliate template aesthetics. | Yes — post-launch A/B |
