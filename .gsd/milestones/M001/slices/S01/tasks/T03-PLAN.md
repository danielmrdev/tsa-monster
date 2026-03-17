---
estimated_steps: 6
estimated_files: 3
---

# T03: Add dynamic article route, public files, final build verification

**Slice:** S01 — Astro scaffold + i18n foundation
**Milestone:** M001

## Description

Completes the slice by adding the dynamic `[category]/[slug]` route (the contract S03 articles depend on), writing `robots.txt` and `_headers` (R007), and doing final build verification that confirms the entire scaffold is correct.

With zero articles in S01, `getStaticPaths()` returns an empty array — `pnpm build` must NOT error on this. The route itself must be syntactically and type-correct so S03 can drop MDX files in and have them render immediately.

**Key constraints (non-obvious):**
- In Astro 6 glob loader, `entry.slug` does not exist. Derive slug from `entry.id`: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`
- `render()` is imported from `astro:content` alongside `getCollection()`
- The dynamic route file path must be `src/pages/en/[category]/[slug].astro` — the double bracket dirs are literal folder names in the filesystem
- `public/_headers` uses Cloudflare Pages `_headers` syntax — plain text, path pattern per line followed by indented header
- `robots.txt` sitemap URL must reference `sitemap-index.xml` (what `@astrojs/sitemap` generates by default)

## Steps

1. Create `src/pages/en/[category]/` directory and write `src/pages/en/[category]/[slug].astro`:
   ```astro
   ---
   import { getCollection, render } from 'astro:content';
   import ArticleLayout from '../../../layouts/ArticleLayout.astro';

   export async function getStaticPaths() {
     const entries = await getCollection('reviews');
     return entries.map(entry => ({
       params: {
         category: entry.data.category,
         slug: entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id,
       },
       props: { entry },
     }));
   }

   const { entry } = Astro.props;
   const { Content } = await render(entry);
   ---
   <ArticleLayout
     title={entry.data.title}
     description={entry.data.description}
     date={entry.data.date}
     heroImage={entry.data.heroImage}
   >
     <Content />
   </ArticleLayout>
   ```

2. Write `public/robots.txt`:
   ```
   User-agent: *
   Allow: /

   Sitemap: https://tsa.monster/sitemap-index.xml
   ```

3. Write `public/_headers` with Cloudflare cache directives:
   ```
   /_astro/*
     Cache-Control: public, max-age=31536000, immutable

   /images/*
     Cache-Control: public, max-age=31536000, immutable

   /*.html
     Cache-Control: public, max-age=3600, s-maxage=86400

   /
     Cache-Control: public, max-age=3600, s-maxage=86400
   ```

4. Run `pnpm build` — must exit 0. Confirm zero routes generated for `[category]/[slug]` is not an error.

5. Verify output structure:
   ```bash
   pnpm build && \
     ls dist/en/index.html && \
     (ls dist/sitemap-index.xml 2>/dev/null || ls dist/sitemap-0.xml) && \
     ls dist/robots.txt && \
     echo "BUILD OK"
   ```

6. Run `pnpm astro check` — must report zero type errors. Then start `pnpm dev` and verify in browser: `http://localhost:4321/` redirects to `/en/`, `/en/` shows styled page with Header and Footer visible.

## Must-Haves

- [ ] `src/pages/en/[category]/[slug].astro` exists and uses Astro 6 `render()` API
- [ ] Slug derived from `entry.id` not `entry.slug` (which doesn't exist)
- [ ] `pnpm build` exits 0 with empty content collection (zero dynamic routes is not an error)
- [ ] `dist/en/index.html` exists after build
- [ ] `dist/sitemap-index.xml` or `dist/sitemap-0.xml` exists after build
- [ ] `dist/robots.txt` exists after build (copied from `public/`)
- [ ] `pnpm astro check` reports zero errors
- [ ] `public/_headers` contains cache headers for `/_astro/*` (immutable) and `/*.html` (short TTL)

## Verification

```bash
pnpm build && \
  ls dist/en/index.html && \
  (ls dist/sitemap-index.xml 2>/dev/null || ls dist/sitemap-0.xml) && \
  ls dist/robots.txt && \
  pnpm astro check && \
  echo "SLICE S01 VERIFIED"
```

Expected output ends with `SLICE S01 VERIFIED`.

Browser check: start `pnpm dev`, open `http://localhost:4321/` — must redirect to `http://localhost:4321/en/`. Page at `/en/` must show Header with logo and category nav, content area, Footer with legal links.

## Inputs

- `src/layouts/ArticleLayout.astro` from T02
- `src/content/config.ts` from T02 — `reviews` collection schema
- `astro.config.mjs` from T01 — `site` URL set (required for sitemap)
- `pnpm build` already passing from T02

## Expected Output

- `src/pages/en/[category]/[slug].astro` — dynamic article route (contract for S03)
- `public/robots.txt` — allow all + sitemap reference
- `public/_headers` — Cloudflare cache directives (R007)
- `dist/en/index.html` — built home page
- `dist/sitemap-index.xml` (or `dist/sitemap-0.xml`) — sitemap
- `pnpm build` exits 0, `pnpm astro check` clean
- Browser redirect from `/` to `/en/` confirmed
