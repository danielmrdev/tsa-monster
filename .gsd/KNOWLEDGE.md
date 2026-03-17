# Knowledge Register

<!-- Append-only. Add entries when you discover a non-obvious rule, recurring gotcha, or useful pattern.
     Never remove entries. To supersede, add a new entry that references the old one.
     Read this file at the start of every unit. -->

## K001 — `pnpm create astro@latest .` fails when directory is non-empty

**Discovered:** M001/S01/T01  
**Context:** Running `pnpm create astro@latest . -- --template minimal --git false` in a non-empty directory (even with `--yes`) causes the CLI to pick a random subdirectory name instead of using `.`.  
**Fix:** Scaffold into the non-empty target and then `mv` the generated files up: `mv scaffold-dir/* scaffold-dir/.* . 2>/dev/null; rmdir scaffold-dir`. Or scaffold into a temp dir and move manually.  
**Rule:** Never assume `create astro@latest .` respects `.` when the directory contains any files (even `.git`).

## K002 — pnpm v10 requires explicit approval for build scripts

**Discovered:** M001/S01/T01  
**Context:** `pnpm add` emits "Ignored build scripts: esbuild@x.x.x, sharp@x.x.x" warnings. Without build scripts running, `esbuild` lacks its platform binary and Vite fails to start.  
**Fix:** Add `"pnpm": {"onlyBuiltDependencies": ["esbuild", "sharp"]}` to `package.json` and re-run `pnpm install`. The named packages' post-install scripts will then run.  
**Rule:** For any new Astro project with pnpm, always include the `onlyBuiltDependencies` field to prevent silent esbuild/sharp failures.

## K003 — Tailwind v4 plugin is `@tailwindcss/vite`, not `@astrojs/tailwind`

**Discovered:** M001/S01/T01  
**Context:** Astro docs and `astro add tailwind` install the legacy `@astrojs/tailwind` adapter, which wraps Tailwind v3. Tailwind v4 uses a Vite plugin directly.  
**Integration pattern:**
```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  // NOTE: do NOT put tailwindcss() in integrations: []
});
```
**CSS pattern:**
```css
/* src/styles/global.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@theme {
  --color-brand: #2563eb;
}
```
**Rule:** No `tailwind.config.js`. No `content` array. No `@tailwind base/components/utilities` directives. All config is CSS-first.

## K004 — Playwright browser tools unavailable in this environment

**Discovered:** M001/S01/T01  
**Context:** `browser_navigate` fails with `libnspr4.so: cannot open shared object file` — the Playwright Chromium shell lacks its system library dependencies.  
**Workaround:** Use `curl -s http://localhost:4321/en/` for page content verification. Check generated `dist/_astro/*.css` for Tailwind utility class presence. Use `pnpm build` + `ls dist/` for output verification.  
**Rule:** Never rely on browser_* tools for verification in this environment. All UI verification must be done via curl or file inspection.
