---
estimated_steps: 6
estimated_files: 5
---

# T02: Write 5 Kitchen review articles

**Slice:** S03 — 15 review articles + images
**Milestone:** M001

## Description

Write all 5 kitchen category MDX review articles. Kitchen is the largest category and the one foregrounded by the home page hero CTA ("Browse Reviews" → `/en/kitchen/`). Getting these right first validates the full article pipeline before writing the remaining 10 articles.

Each article must: satisfy the `src/content.config.ts` schema exactly, import ProductCard with the correct relative path, and include a complete editorial body (intro, comparison table, ≥3 ProductCard components, FAQ, Final Verdict). All affiliate URLs are `'#'` per D006.

**Critical constraint — ProductCard import path from `src/content/reviews/kitchen/`:**
```
import ProductCard from '../../../components/ProductCard.astro';
```
Three levels up: `kitchen/` → `reviews/` → `content/` → `src/`, then into `components/`. Same path for all 5 kitchen files.

**Frontmatter schema contract** (from `src/content.config.ts`):
```yaml
title: string
description: string          # ≤160 chars
category: kitchen            # enum — must match exactly
date: YYYY-MM-DD
heroImage: /images/[filename].jpg   # must exist in public/images/ (T01 created these)
excerpt: string              # ≤200 chars
products:
  - name: string
    rating: number           # 1.0–5.0, half-step OK (e.g. 4.5)
    description: string
    affiliateUrl: '#'        # always '#' per D006
```

## Steps

1. **Write `src/content/reviews/kitchen/best-coffee-makers.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Coffee Makers of 2025: Tested and Ranked"
   description: "We tested 12 coffee makers across drip, pour-over, and espresso styles. Here are the ones worth your money."
   category: kitchen
   date: 2025-11-15
   heroImage: /images/kitchen-best-coffee-makers.jpg
   excerpt: "After testing 12 machines across drip, pour-over, and espresso styles, we found clear winners in every price range."
   products:
     - name: "Breville Precision Brewer"
       rating: 4.8
       description: "SCAA-certified drip brewer with thermal carafe and optional gold-tone filter. Consistently hits 200°F."
       affiliateUrl: '#'
     - name: "Fellow Stagg EKG Electric Kettle"
       rating: 4.6
       description: "Variable temperature pour-over kettle with 60-min hold and elegant gooseneck. The pour-over companion."
       affiliateUrl: '#'
     - name: "Moka Pot by Bialetti"
       rating: 4.3
       description: "Classic stovetop espresso maker. Produces rich, concentrated coffee in under 5 minutes."
       affiliateUrl: '#'
     - name: "Cuisinart DCC-3200P1"
       rating: 4.0
       description: "14-cup programmable drip machine with adjustable keep-warm and strength selector. Great for families."
       affiliateUrl: '#'
   ---
   ```

   Body structure:
   - **Introduction** (2–3 paragraphs): What makes a great coffee maker, testing methodology, categories covered
   - **Comparison Table**: columns — Product, Type, Price Range, Best For, Rating
   - **Top Picks** section with 4 ProductCard components (one per product in frontmatter)
   - **How We Tested**: water temperature, brew time, extraction consistency, ease of cleaning
   - **FAQ** (3–4 questions): drip vs. pour-over, how often to descale, grind size matters, etc.
   - **Final Verdict**: 2 paragraphs summarizing overall recommendation

2. **Write `src/content/reviews/kitchen/best-air-fryers.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Air Fryers of 2025: Real-World Testing Results"
   description: "Six months of cooking fries, chicken, and vegetables across 8 air fryers. These three are worth the counter space."
   category: kitchen
   date: 2025-11-08
   heroImage: /images/kitchen-best-air-fryers.jpg
   excerpt: "After cooking hundreds of batches across 8 models, three air fryers stood out for consistent results, easy cleanup, and smart design."
   products:
     - name: "Ninja AF101 Air Fryer"
       rating: 4.7
       description: "4-quart basket with ceramic-coated nonstick interior. Crisps evenly, dishwasher-safe basket, compact footprint."
       affiliateUrl: '#'
     - name: "Cosori Pro Gen 2 Air Fryer"
       rating: 4.5
       description: "5.8-quart with 12 presets, shake reminder, and wide square basket. Best capacity-to-footprint ratio we tested."
       affiliateUrl: '#'
     - name: "DASH Compact Air Fryer"
       rating: 4.1
       description: "2-quart entry model for solo cooking. Inexpensive, easy to use, ideal for students or small apartments."
       affiliateUrl: '#'
   ---
   ```

   Body structure:
   - Introduction: Why air fryers replaced oven use for many households, what we tested for
   - Comparison Table: columns — Product, Capacity, Wattage, Best For, Dishwasher Safe, Rating
   - Top Picks: 3 ProductCard components
   - What to Look For: basket vs. oven style, capacity, wattage, presets
   - FAQ: air fryer vs. convection oven, healthy cooking claims, best foods for air frying, cleaning tips
   - Final Verdict

3. **Write `src/content/reviews/kitchen/best-chef-knives.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Chef's Knives of 2025: Every Price Point Tested"
   description: "We sliced, diced, and rocked our way through onions, carrots, and whole chickens with 9 chef's knives. Here's what we found."
   category: kitchen
   date: 2025-10-22
   heroImage: /images/kitchen-best-chef-knives.jpg
   excerpt: "Nine chef's knives, hundreds of cuts, and one clear lesson: you don't need to spend $200 to get a knife that performs beautifully."
   products:
     - name: "Victorinox Fibrox Pro 8-Inch"
       rating: 4.8
       description: "The gold standard budget chef's knife. Swiss-made, razor-sharp out of the box, slip-resistant handle, NSF-certified."
       affiliateUrl: '#'
     - name: "Wüsthof Classic 8-Inch"
       rating: 4.7
       description: "German forged full-tang blade with triple-riveted handle. Heavy, balanced, holds an edge exceptionally well."
       affiliateUrl: '#'
     - name: "MAC Mighty MTH-80"
       rating: 4.6
       description: "Japanese-style thin blade with dimples to prevent sticking. Lighter than German knives, extremely sharp."
       affiliateUrl: '#'
     - name: "Global G-2 Chef's Knife"
       rating: 4.3
       description: "All-stainless Japanese design, hollow handle filled with sand for balance. Distinctive look, holds edge well."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (steel types, blade geometry, what we tested), Comparison Table (Product, Steel, Weight, Edge Angle, Best For, Rating), 4 ProductCard components, Knife Care section (honing, sharpening, storage), FAQ, Final Verdict.

4. **Write `src/content/reviews/kitchen/best-stand-mixers.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Stand Mixers of 2025: Baked-In Results"
   description: "We made dozens of batches of bread, cookie dough, and meringue across five stand mixers. KitchenAid still leads, but has real competition now."
   category: kitchen
   date: 2025-10-10
   heroImage: /images/kitchen-best-stand-mixers.jpg
   excerpt: "Dozens of dough batches and meringues later, we know which stand mixers handle heavy loads without overheating — and which ones to skip."
   products:
     - name: "KitchenAid Artisan Series 5-Quart"
       rating: 4.9
       description: "The benchmark stand mixer. 325-watt motor, 10 speeds, tilt-head design, vast attachment ecosystem. Virtually indestructible."
       affiliateUrl: '#'
     - name: "Cuisinart SM-50 Stand Mixer"
       rating: 4.4
       description: "500-watt motor in a 5.5-quart bowl. More powerful than KitchenAid at a lower price. Fewer attachments available."
       affiliateUrl: '#'
     - name: "Ankarsrum Original Stand Mixer"
       rating: 4.6
       description: "Swedish design with unique bowl-rotation mechanism. Exceptional for bread. Large 7-quart capacity."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (who needs a stand mixer, motor power, bowl size), Comparison Table (Product, Motor, Bowl Size, Attachments, Best For, Rating), 3 ProductCard components, Attachment Ecosystem section, FAQ (bowl-lift vs. tilt-head, cleaning, dough hook vs. spiral hook), Final Verdict.

5. **Write `src/content/reviews/kitchen/best-blenders.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Blenders of 2025: Smoothies, Soups, and Beyond"
   description: "From personal blenders to countertop powerhouses, we tested 7 blenders on ice, frozen fruit, nuts, and hot liquids. Here's what survived."
   category: kitchen
   date: 2025-09-28
   heroImage: /images/kitchen-best-blenders.jpg
   excerpt: "Seven blenders, 40+ test batches, and one rule: motor wattage alone doesn't predict blending quality. Here's what actually matters."
   products:
     - name: "Vitamix E310 Explorian"
       rating: 4.9
       description: "Professional-grade 2.0 HP motor that pulverizes anything. Self-cleaning cycle, variable speed, 10-year warranty."
       affiliateUrl: '#'
     - name: "Ninja BL770 Mega Kitchen System"
       rating: 4.5
       description: "Full-size and single-serve cups in one. 1500-watt motor crushes ice easily. Dishwasher-safe cups."
       affiliateUrl: '#'
     - name: "NutriBullet Pro 900"
       rating: 4.3
       description: "900-watt personal blender with bullet cup design. Best for daily smoothies, compact and easy to clean."
       affiliateUrl: '#'
     - name: "Blendtec Classic 575"
       rating: 4.7
       description: "1560-watt commercial-grade blender with flat blade (no center hub) and 6-year warranty. Quieter than Vitamix."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (counter blender vs. personal blender, what we put in them), Comparison Table (Product, Motor, Container Size, Self-Clean, Best For, Rating), 4 ProductCard components, Noise and Heat section, FAQ (frozen vs. fresh fruit, cleaning blades, hot liquids safety), Final Verdict.

6. **Run build and verify**:
   ```bash
   pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0
   ls dist/en/kitchen/
   # Should show: best-coffee-makers/  best-air-fryers/  best-chef-knives/  best-stand-mixers/  best-blenders/  index.html
   ```

## Must-Haves

- [ ] All 5 files have valid frontmatter matching the schema (`category: kitchen`, `heroImage` referencing a file created in T01, `rating` 1–5, `affiliateUrl: '#'`)
- [ ] `description` ≤160 chars and `excerpt` ≤200 chars on every article
- [ ] ProductCard import path is exactly `'../../../components/ProductCard.astro'` in all 5 files
- [ ] Each article has: introduction, comparison table, ≥3 ProductCard components, FAQ section, Final Verdict
- [ ] `pnpm build` exits 0 after all 5 files are written
- [ ] `ls dist/en/kitchen/` shows 5 article subdirectories + `index.html`

## Verification

```bash
# Build clean
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0

# All 5 kitchen articles built
ls dist/en/kitchen/best-coffee-makers/index.html
ls dist/en/kitchen/best-air-fryers/index.html
ls dist/en/kitchen/best-chef-knives/index.html
ls dist/en/kitchen/best-stand-mixers/index.html
ls dist/en/kitchen/best-blenders/index.html

# Category index shows articles
grep -c "Read more" dist/en/kitchen/index.html   # → 5
```

## Inputs

- `src/content.config.ts` — schema contract (do not modify)
- `public/images/kitchen-*.jpg` — 5 images created in T01; verify these exist before writing frontmatter
- `src/components/ProductCard.astro` — Props: `name` (string), `rating` (number 1–5), `description` (string), `affiliateUrl?` (string)
- `src/layouts/ArticleLayout.astro` — wraps MDX content in `prose prose-slate max-w-none`; articles do not need to add prose classes

## Expected Output

- `src/content/reviews/kitchen/best-coffee-makers.mdx` — complete article with 4 products
- `src/content/reviews/kitchen/best-air-fryers.mdx` — complete article with 3 products
- `src/content/reviews/kitchen/best-chef-knives.mdx` — complete article with 4 products
- `src/content/reviews/kitchen/best-stand-mixers.mdx` — complete article with 3 products
- `src/content/reviews/kitchen/best-blenders.mdx` — complete article with 4 products
- `dist/en/kitchen/` — 5 article subdirectories + category `index.html` updated with article cards
