---
estimated_steps: 8
estimated_files: 8
---

# T01: Scaffold Astro project, wire Tailwind v4, configure i18n

**Slice:** S01 — Astro scaffold + i18n foundation
**Milestone:** M001

## Description

Creates the entire buildable Astro 6 project from nothing: scaffold, dependency installation, Tailwind v4 Vite plugin wiring, i18n config, and the two starter page routes (`/` redirect and `/en/` shell). This is the highest-risk task — Tailwind v4 has a materially different config API from v3 and must be verified rendering in browser before layouts are written on top of it.

**Key constraints (non-obvious):**
- Do NOT use `astro add tailwind` — it installs the legacy `@astrojs/tailwind` wrapper for Tailwind 3. Install `@tailwindcss/vite` directly.
- Tailwind v4 has no `tailwind.config.js` and no `content` array. Config is CSS-first: `@import "tailwindcss"` in a CSS file, custom tokens in `@theme {}` block.
- `@tailwindcss/typography` plugin syntax in v4: `@plugin "@tailwindcss/typography"` in the CSS file (not `plugins: [require(...)]` in JS config).
- Do NOT set `redirectToDefaultLocale` in astro.config — the `/` redirect is a client-side script.
- The scaffold command must use `--git false` to avoid re-initializing git in the existing repo.

## Steps

1. Run scaffold: `pnpm create astro@latest . -- --template minimal --typescript strict --no-install --git false` — accept all prompts with defaults. If the command is interactive, use `--yes` or `--no-git`. Then `pnpm install`.

2. Install additional deps: `pnpm add @astrojs/mdx @astrojs/sitemap tailwindcss @tailwindcss/vite @tailwindcss/typography`

3. Write `astro.config.mjs`:
   ```js
   import { defineConfig } from 'astro/config';
   import tailwindcss from '@tailwindcss/vite';
   import mdx from '@astrojs/mdx';
   import sitemap from '@astrojs/sitemap';

   export default defineConfig({
     output: 'static',
     site: 'https://tsa.monster',
     i18n: {
       defaultLocale: 'en',
       locales: ['en'],
       routing: {
         prefixDefaultLocale: true,
       },
     },
     integrations: [mdx(), sitemap()],
     vite: {
       plugins: [tailwindcss()],
     },
   });
   ```

4. Create `src/styles/global.css`:
   ```css
   @import "tailwindcss";
   @plugin "@tailwindcss/typography";

   @theme {
     --color-brand: #2563eb;
     --color-brand-dark: #1d4ed8;
     --color-surface: #f8fafc;
     --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
   }
   ```

5. Create `src/i18n/config.ts`:
   ```ts
   export const LOCALES = ['en'] as const;
   export type Locale = (typeof LOCALES)[number];
   export const DEFAULT_LOCALE: Locale = 'en';

   export function getSupportedLocales(): readonly string[] {
     return LOCALES;
   }

   export function isSupportedLocale(locale: string): locale is Locale {
     return (LOCALES as readonly string[]).includes(locale);
   }
   ```

6. Replace `src/pages/index.astro` with the client-side redirect script:
   ```astro
   ---
   // No layout — redirect only
   ---
   <script>
   import { LOCALES, DEFAULT_LOCALE } from '../i18n/config';

   function getBestLocale(): string {
     const candidates = [...(navigator.languages ?? [navigator.language])];
     for (const lang of candidates) {
       const short = lang.split('-')[0].toLowerCase();
       if ((LOCALES as readonly string[]).includes(short)) return short;
     }
     return DEFAULT_LOCALE;
   }

   const locale = getBestLocale();
   window.location.replace(`/${locale}/`);
   </script>
   ```

7. Create `src/pages/en/index.astro` as a minimal styled shell (layout added in T02 — for now inline to confirm Tailwind renders):
   ```astro
   ---
   import '../../../styles/global.css';
   ---
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <title>TSA Monster — Home</title>
     </head>
     <body class="bg-surface font-sans text-slate-900">
       <main class="max-w-4xl mx-auto p-8">
         <h1 class="text-4xl font-bold text-brand">TSA Monster</h1>
         <p class="mt-4 text-lg text-slate-600">Best travel gear reviews.</p>
       </main>
     </body>
   </html>
   ```
   (This will be replaced with the BaseLayout import in T02 once BaseLayout exists.)

8. Run `pnpm dev`, open `http://localhost:4321/en/` in browser — confirm page loads with styled heading (blue `text-brand` color, custom font-sans). Check `http://localhost:4321/` redirects to `/en/`. Stop dev server. Run `pnpm build` — must exit 0.

## Must-Haves

- [ ] `pnpm build` exits 0 after scaffold + deps install
- [ ] `src/styles/global.css` uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- [ ] `astro.config.mjs` uses `@tailwindcss/vite` in `vite.plugins` — no `@astrojs/tailwind` integration
- [ ] i18n block in config has `prefixDefaultLocale: true`, `defaultLocale: 'en'`, `locales: ['en']`
- [ ] `redirectToDefaultLocale` is NOT set in astro.config
- [ ] `src/pages/index.astro` contains only a redirect script, no layout
- [ ] `src/pages/en/index.astro` exists and renders with Tailwind utility classes visible
- [ ] `src/i18n/config.ts` exports `LOCALES`, `DEFAULT_LOCALE`, `getSupportedLocales()`, `isSupportedLocale()`

## Observability Impact

- **Build output**: `pnpm build` stdout/stderr is the primary signal — structured `[ERROR]` lines point to exact files. Exit code is machine-checkable.
- **Generated CSS**: `dist/_astro/*.css` contains Tailwind-generated utility classes. Presence of custom properties (`--color-brand`, `--color-surface`) in the CSS confirms `@theme {}` block was processed.
- **Dev server logs**: `pnpm dev` prints Vite HMR events and Astro integration status; any `[tailwindcss]` lines confirm plugin loaded.
- **TypeScript signals**: `pnpm astro check` reports errors with file + line number. Any `error TS` in output is a failure requiring fix.
- **Failure state inspection**: If build fails mid-task, `cat .astro/types.d.ts` shows generated type surfaces; `node_modules/.cache/` holds Vite's transform cache (delete to force re-transform on suspected stale state).

## Verification

```bash
pnpm build
# Must exit 0

ls dist/en/index.html
# Must exist
```

Browser check: `http://localhost:4321/en/` — heading is visibly styled (blue color confirms Tailwind rendering). `http://localhost:4321/` — redirects to `/en/` (Network tab shows 302/client redirect).

## Inputs

- Empty git repo at `/home/daniel/tsa.monster`
- No prior task output needed

## Expected Output

- `package.json` — Astro 6 + all deps installed
- `astro.config.mjs` — full config: static output, site URL, i18n, Vite Tailwind plugin, mdx + sitemap integrations
- `src/styles/global.css` — Tailwind v4 CSS-first config with `@theme {}` tokens
- `src/i18n/config.ts` — locale constants and helpers
- `src/pages/index.astro` — redirect-only page
- `src/pages/en/index.astro` — styled shell confirming Tailwind renders
- `pnpm build` exits 0
