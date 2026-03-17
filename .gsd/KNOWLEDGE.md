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

## K005 — Astro 6 content config file is `src/content.config.ts`, NOT `src/content/config.ts`

**Discovered:** M001/S01/T02  
**Context:** Astro 6 removed the legacy `src/content/config.ts` location. Placing content config there causes `[LegacyContentConfigError]` and build failure.  
**Fix:** Place content collection definitions at `src/content.config.ts` (in `src/`, not inside `src/content/`). The file must use `loader: glob(...)` from `astro/loaders` and `z` from `astro/zod`.  
**Rule:** Any new Astro 6 project that needs content collections must use `src/content.config.ts`. Never use `src/content/config.ts`.

## K006 — Schema.org JSON-LD `<script>` in Astro requires `is:inline` when using `set:html`

**Discovered:** M001/S01/T02  
**Context:** `<script type="application/ld+json" set:html={...}>` generates hint `astro(4000)` — Astro warns that the script will be treated as inline due to the `type` attribute, and suggests adding `is:inline` explicitly.  
**Fix:** Write `<script is:inline type="application/ld+json" set:html={JSON.stringify(data)} />` to silence the hint cleanly.  
**Rule:** All JSON-LD or other typed script tags in Astro components must include `is:inline`.

## K004 — Playwright browser tools unavailable in this environment

**Discovered:** M001/S01/T01  
**Context:** `browser_navigate` fails with `libnspr4.so: cannot open shared object file` — the Playwright Chromium shell lacks its system library dependencies.  
**Workaround:** Use `curl -s http://localhost:4321/en/` for page content verification. Check generated `dist/_astro/*.css` for Tailwind utility class presence. Use `pnpm build` + `ls dist/` for output verification.  
**Rule:** Never rely on browser_* tools for verification in this environment. All UI verification must be done via curl or file inspection.

## K007 — Astro 6 dynamic routes with glob loader: use entry.id for slug, not entry.slug

**Discovered:** M001/S01/T03  
**Context:** `entry.slug` does not exist in Astro 6 content collection entries created with the `glob()` loader. Referencing it causes a TypeScript error.  
**Fix:** Derive the slug from `entry.id`: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`. This strips the file extension and extracts the filename. Works for both `.md` and `.mdx`.  
**Rule:** In any Astro 6 `getStaticPaths()` using `getCollection()` + glob loader, always use `entry.id` for slug derivation. Never reference `entry.slug`.

## K008 — Empty content collection with getStaticPaths() is not a build error in Astro 6

**Discovered:** M001/S01/T03  
**Context:** With zero MDX/MD files, `getStaticPaths()` returns `[]` — Astro logs "The collection 'reviews' does not exist or is empty" at build time but still exits 0. This is expected behavior during scaffold phases.  
**Rule:** Do not treat the empty-collection log message as a build failure. It disappears when content is added in S03.

