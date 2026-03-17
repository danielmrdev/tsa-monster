---
estimated_steps: 5
estimated_files: 1
---

# T02: Rewrite home page with hero, category grid, and recent articles

**Slice:** S02 — Static pages + home
**Milestone:** M001

## Description

Rewrite `src/pages/en/index.astro` from its current 10-line stub into a real home page with three sections: an editorial hero, a category grid (4 cards), and a recent articles list using `getCollection('reviews')`. The articles section must handle an empty collection gracefully — S03 hasn't run yet, so the collection will be empty during this task's build verification.

Load the `frontend-design` skill (`~/.gsd/agent/skills/frontend-design/SKILL.md`) before implementing — this is the primary user-facing page and visual quality matters.

## Steps

1. **Rewrite `src/pages/en/index.astro`** frontmatter: import `BaseLayout` from `'../../layouts/BaseLayout.astro'` and `ArticleCard` from `'../../components/ArticleCard.astro'`. Import `getCollection` from `'astro:content'`. Fetch reviews: `const allReviews = await getCollection('reviews');`. Sort by date descending and take up to 6: `const recentArticles = allReviews.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, 6);`. Derive slug from `entry.id` using the K007 pattern: `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`.

2. **Hero section** — Full-width section with amber accent. Headline using `font-display` class (DM Serif Display). Subheadline in `text-ink-muted`. CTA button linking to `/en/kitchen/`. Suggested markup pattern:
   ```astro
   <section aria-label="Hero" class="bg-ink text-white py-20 px-4">
     <div class="max-w-4xl mx-auto text-center">
       <h1 class="font-display text-5xl sm:text-6xl font-bold text-brand leading-tight mb-6">
         Find the best products, <br/>without the guesswork.
       </h1>
       <p class="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
         Independent reviews across kitchen, outdoor, home, and beauty — with real hands-on testing.
       </p>
       <a href="/en/kitchen/" class="inline-block bg-brand text-ink font-semibold px-8 py-3 rounded-lg hover:bg-brand-dark transition-colors">
         Browse Reviews
       </a>
     </div>
   </section>
   ```

3. **Category grid section** — Four cards in a 2×2 or 1×4 responsive grid, each linking to `/en/{category}/`. Use `/en/kitchen/`, `/en/outdoor/`, `/en/home/`, `/en/beauty/` as hrefs (direct paths — safe for the en locale). Each card: category name, short one-line description, and a `→` arrow. Grid uses Tailwind: `grid grid-cols-2 sm:grid-cols-4 gap-4`. Cards use amber hover accent.

4. **Recent articles section** — Heading "Recent Reviews". If `recentArticles.length === 0`, render a `<p class="text-ink-muted">Reviews coming soon. Check back shortly.</p>` placeholder. Otherwise render `recentArticles.map((entry) => <ArticleCard ... />)` in a `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`. Pass ArticleCard props: `title={entry.data.title}`, `excerpt={entry.data.excerpt}`, `category={entry.data.category}`, `slug={derivedSlug}`, `heroImage={entry.data.heroImage}`, `date={entry.data.date}`.

5. **Verify**:
   ```bash
   pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'
   # Expected: zero output
   
   ls dist/en/index.html
   # Expected: exists
   
   grep -i 'kitchen\|outdoor\|home\|beauty' dist/en/index.html
   # Expected: matches (category grid links present)
   
   grep 'og:title\|canonical' dist/en/index.html
   # Expected: matches (BaseLayout SEO meta present)
   
   pnpm astro check
   # Expected: 0 errors, 0 warnings, 0 hints
   ```

## Must-Haves

- [ ] Hero section with headline, subtext, and CTA button
- [ ] Category grid with all four categories (kitchen, outdoor, home, beauty) linking to correct `/en/{category}/` paths
- [ ] Recent articles section using `getCollection('reviews')` from `'astro:content'`
- [ ] Empty collection handled gracefully — no crash, shows placeholder text
- [ ] `pnpm build` exits 0
- [ ] `pnpm astro check` exits 0
- [ ] Home page HTML contains category link text and og:title meta

## Verification

```bash
pnpm build 2>&1 | grep -E '\[ERROR\]|\[warn\]'
# Expected: zero output

ls dist/en/index.html
# Expected: exists

grep -i 'kitchen\|outdoor\|home\|beauty' dist/en/index.html
# Expected: at least 4 matches

grep 'og:title\|canonical' dist/en/index.html
# Expected: matches (injected by BaseLayout)

pnpm astro check
# Expected: 0 errors, 0 warnings, 0 hints
```

## Inputs

- `src/pages/en/index.astro` — current stub to overwrite (BaseLayout wrapper, h1 + p only)
- `src/layouts/BaseLayout.astro` — import from `'../../layouts/BaseLayout.astro'`. Props: `title`, `description` (both required).
- `src/components/ArticleCard.astro` — import from `'../../components/ArticleCard.astro'`. Props: `title`, `excerpt`, `category`, `slug`, `heroImage`, `date`. All required.
- `src/content.config.ts` — **read-only reference**: reviews collection fields available via `entry.data`: `title` (string), `description` (string), `category` (enum: kitchen|outdoor|home|beauty), `date` (Date), `heroImage` (string), `excerpt` (string), `products` (array).
- **K007**: Slug derivation — `entry.id.split('/').pop()?.replace(/\.mdx?$/, '') ?? entry.id`. Do NOT use `entry.slug` — it doesn't exist in Astro 6 glob loader.
- **K008**: `getCollection('reviews')` returns `[]` on empty collection — not a build error. The empty-state check in the articles section is mandatory.
- `src/styles/global.css` — **do not modify**. Available custom tokens: `text-ink`, `text-ink-muted`, `bg-ink`, `bg-surface`, `bg-brand-light`, `border-brand`, `text-brand`, `text-brand-dark`, `bg-brand`, `bg-brand-dark`, `font-display`.

## Expected Output

- `src/pages/en/index.astro` — rewritten with hero + category grid + recent articles sections
- `dist/en/index.html` — built output containing category grid links and og:title meta
