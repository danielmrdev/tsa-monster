---
estimated_steps: 7
estimated_files: 12
---

# T02: Define content schema, write all layouts and components

**Slice:** S01 — Astro scaffold + i18n foundation
**Milestone:** M001

## Description

Establishes the boundary contracts that S02 (static pages) and S03 (articles) depend on. Writes the content collection schema, all shared layouts, and all five components. Every file in this task must be buildable with `pnpm build` and type-clean with `pnpm astro check` before the task is done.

**Key constraints (non-obvious):**
- Content collections in Astro 6 use `loader: glob(...)` from `astro/loaders` — NOT `type: 'content'`.
- `z` must be imported from `astro/zod`, not from `zod` directly.
- `entry.slug` does not exist in Astro 6 glob loader — use `entry.id.split('/').pop()?.replace(/\.mdx?$/, '')`.
- `getRelativeLocaleUrl()` comes from `astro:i18n` (virtual module — no npm install needed).
- `BaseLayout.astro` must import `../styles/global.css` so Tailwind styles are included on every page.
- Canonical URL pattern: `new URL(Astro.url.pathname, Astro.site).href` — requires `site` set in astro.config.
- `ArticleLayout.astro` extends BaseLayout, so it does NOT import global.css again.
- The `frontend-design` skill is relevant — load `~/.gsd/agent/skills/frontend-design/SKILL.md` before writing component markup.

## Steps

1. Create `src/content/config.ts` with the reviews collection schema:
   ```ts
   import { defineCollection } from 'astro:content';
   import { glob } from 'astro/loaders';
   import { z } from 'astro/zod';

   const reviews = defineCollection({
     loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
     schema: z.object({
       title: z.string(),
       description: z.string(),
       category: z.enum(['kitchen', 'outdoor', 'home', 'beauty']),
       date: z.coerce.date(),
       heroImage: z.string(),
       excerpt: z.string(),
       products: z.array(z.object({
         name: z.string(),
         rating: z.number().min(1).max(5),
         description: z.string(),
         affiliateUrl: z.string().optional(),
       })),
     }),
   });

   export const collections = { reviews };
   ```

2. Create placeholder `.gitkeep` files in each content category directory:
   ```
   src/content/reviews/kitchen/.gitkeep
   src/content/reviews/outdoor/.gitkeep
   src/content/reviews/home/.gitkeep
   src/content/reviews/beauty/.gitkeep
   ```

3. Write `src/layouts/BaseLayout.astro`. Props interface: `title: string`, `description: string`, `ogImage?: string`, `lang?: string`. Renders:
   - `<html lang={lang ?? 'en'}>`
   - `<head>` with charset, viewport, `<title>`, `<meta name="description">`, canonical link, OG tags (title, description, image, type, url), hreflang link for `/en/`, `<link rel="sitemap">` pointing to `/sitemap-index.xml`
   - Imports `../styles/global.css`
   - `<slot name="head" />` for page-specific head additions
   - `<Header />` and `<Footer />` wrapping `<slot />`

4. Write `src/layouts/ArticleLayout.astro`. Props: same as BaseLayout plus `date?: Date`, `heroImage?: string`. Renders:
   - Calls BaseLayout with all SEO props
   - Renders `<AffiliateDisclosure />` above article content
   - Renders hero image if provided
   - Includes Schema.org Article JSON-LD:
     ```json
     { "@context": "https://schema.org", "@type": "Article", "headline": "...", "datePublished": "...", "image": "...", "publisher": { "@type": "Organization", "name": "TSA Monster", "url": "https://tsa.monster" } }
     ```
   - `<slot />` for MDX content inside a `<div class="prose prose-slate max-w-none">` wrapper

5. Write `src/components/Header.astro`. No props. Renders:
   - Logo text "TSA Monster" linked to `getRelativeLocaleUrl(Astro.currentLocale ?? 'en', '/')`
   - Nav links for each category: Kitchen, Outdoor, Home, Beauty — each using `getRelativeLocaleUrl()` to generate `/en/kitchen/`, etc.
   - Mobile-friendly layout using Tailwind (flex, gap, responsive)

6. Write `src/components/Footer.astro`. No props. Renders:
   - Legal nav links: Privacy Policy (`/en/privacy-policy/`), Affiliate Disclosure (`/en/affiliate-disclosure/`), About (`/en/about/`), Contact (`/en/contact/`)
   - Affiliate disclosure blurb: "TSA Monster is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com."
   - Copyright line

7. Write `src/components/AffiliateDisclosure.astro`. No props. Renders a visually distinct disclosure box with text: "**Disclosure:** As an Amazon Associate, TSA Monster earns from qualifying purchases. This means we may earn a commission if you click through and make a purchase, at no additional cost to you."

8. Write `src/components/ArticleCard.astro`. Props: `title: string`, `excerpt: string`, `category: string`, `slug: string`, `heroImage: string`, `date: Date`. Renders a card with hero image, date, category badge, title, excerpt, and "Read more" link to `/en/{category}/{slug}/`.

9. Write `src/components/ProductCard.astro`. Props: `name: string`, `rating: number`, `description: string`, `affiliateUrl?: string`. Renders a product row: name, star rating display (filled/empty stars based on `rating` rounded to nearest 0.5), description, and "Check on Amazon" CTA button (`href={affiliateUrl ?? '#'}`).

10. Update `src/pages/en/index.astro` to import and use `BaseLayout` instead of the inline HTML from T01:
    ```astro
    ---
    import BaseLayout from '../../layouts/BaseLayout.astro';
    ---
    <BaseLayout title="TSA Monster — Best Travel Gear Reviews" description="Expert reviews of kitchen gadgets, outdoor gear, home products, and beauty tools.">
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold text-brand">TSA Monster</h1>
        <p class="mt-4 text-lg text-slate-600">Expert reviews of the best products across kitchen, outdoor, home, and beauty.</p>
      </main>
    </BaseLayout>
    ```

11. Run `pnpm build` — must exit 0. Run `pnpm astro check` — must report zero errors.

## Must-Haves

- [ ] `src/content/config.ts` uses `loader: glob()` from `astro/loaders` and `z` from `astro/zod`
- [ ] `collections` export contains `reviews` key
- [ ] `BaseLayout.astro` renders `<html lang>`, full SEO head, canonical URL, OG tags, hreflang
- [ ] `BaseLayout.astro` imports `../styles/global.css`
- [ ] `ArticleLayout.astro` renders `<AffiliateDisclosure />` and Schema.org JSON-LD
- [ ] `ArticleLayout.astro` wraps slot in `prose` class for typography
- [ ] `Header.astro` uses `getRelativeLocaleUrl()` from `astro:i18n` for all links
- [ ] `ProductCard.astro` CTA href falls back to `'#'` when `affiliateUrl` is undefined
- [ ] `src/pages/en/index.astro` imports and uses BaseLayout (not inline HTML)
- [ ] `pnpm build` exits 0 with no errors
- [ ] `pnpm astro check` reports zero errors

## Verification

```bash
pnpm build
# Must exit 0

pnpm astro check
# Must report 0 errors
```

## Inputs

- `astro.config.mjs` from T01 — i18n config, site URL, integrations
- `src/styles/global.css` from T01 — Tailwind tokens (`text-brand`, `bg-surface`, etc.)
- `src/i18n/config.ts` from T01 — `LOCALES`, `DEFAULT_LOCALE`
- `pnpm build` already passing from T01

## Expected Output

- `src/content/config.ts` — reviews collection schema (contract for S03)
- `src/content/reviews/{kitchen,outdoor,home,beauty}/.gitkeep` — empty dirs tracked by git
- `src/layouts/BaseLayout.astro` — shared page shell (contract for S02)
- `src/layouts/ArticleLayout.astro` — article page shell (contract for S03)
- `src/components/Header.astro` — site header
- `src/components/Footer.astro` — site footer with legal links
- `src/components/AffiliateDisclosure.astro` — FTC disclosure block
- `src/components/ArticleCard.astro` — card for listing pages (used by S02 home page)
- `src/components/ProductCard.astro` — product row (used by S03 articles)
- `src/pages/en/index.astro` — updated to use BaseLayout
- `pnpm build` exits 0, `pnpm astro check` clean
