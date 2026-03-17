---
estimated_steps: 11
estimated_files: 10
---

# T03: Write remaining 10 articles (Outdoor ×4, Home ×3, Beauty ×3) and verify full slice

**Slice:** S03 — 15 review articles + images
**Milestone:** M001

## Description

Write the remaining 10 MDX review articles (outdoor ×4, home ×3, beauty ×3) and run the complete slice verification suite. This is the slice acceptance gate — all 25 routes (15 articles + 4 category indexes + 6 existing static pages) must appear in the build output and the sitemap must be populated.

The ProductCard import path is the same for all 10 files as for kitchen:
```
import ProductCard from '../../../components/ProductCard.astro';
```

All frontmatter rules are identical to T02 — see Inputs section for the schema contract. All `affiliateUrl` values are `'#'`.

## Steps

1. **Write `src/content/reviews/outdoor/best-hiking-backpacks.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Hiking Backpacks of 2025: Tested on the Trail"
   description: "We took 7 backpacks on day hikes and overnight trips across varied terrain. These are the ones we'd bring again."
   category: outdoor
   date: 2025-11-20
   heroImage: /images/outdoor-best-hiking-backpacks.jpg
   excerpt: "Seven packs on actual trails, weighted with 25–40 lbs of gear. Three stood out for fit, load transfer, and feature set."
   products:
     - name: "Osprey Atmos AG 65"
       rating: 4.9
       description: "Anti-Gravity suspension system, top-loading with multiple access points, built-in rain cover. Best load transfer we tested."
       affiliateUrl: '#'
     - name: "Gregory Baltoro 65"
       rating: 4.7
       description: "Response A3 suspension with auto-fit hipbelt. Bomber construction, tons of organization, excellent for technical terrain."
       affiliateUrl: '#'
     - name: "REI Co-op Flash 55"
       rating: 4.4
       description: "Lightweight framesheet pack at under 3 lbs. Best for fast-and-light hikers who prioritize weight over features."
       affiliateUrl: '#'
     - name: "Deuter Speed Lite 30"
       rating: 4.2
       description: "30-liter ultralight daypack with aircomfort mesh back. Perfect for day hikes and trail running support."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (volume selection, fit vs. features, weight vs. durability), Comparison Table (Product, Volume, Weight, Suspension, Best For, Rating), 4 ProductCard components, Fitting Your Pack section (torso length, hipbelt, shoulder straps), FAQ (how to pack correctly, rain covers, airline carry-on, breaking in), Final Verdict.

2. **Write `src/content/reviews/outdoor/best-camping-tents.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Camping Tents of 2025: Shelter You Can Trust"
   description: "From car camping to backpacking, we pitched and slept in 8 tents across three seasons. Here are the standouts."
   category: outdoor
   date: 2025-11-05
   heroImage: /images/outdoor-best-camping-tents.jpg
   excerpt: "Eight tents, multiple weather systems, and a simple filter: which ones kept us dry, comfortable, and able to sleep through the night?"
   products:
     - name: "MSR Hubba Hubba NX 2"
       rating: 4.8
       description: "2-person ultralight freestanding tent at 3.7 lbs. Bomber in wind and rain, great ventilation, long-standing reputation."
       affiliateUrl: '#'
     - name: "Big Agnes Copper Spur HV UL2"
       rating: 4.7
       description: "Ultralight (2.8 lbs) with volume-maximizing design and two doors. Premium pick for backpackers who want space."
       affiliateUrl: '#'
     - name: "REI Co-op Passage 2"
       rating: 4.3
       description: "Budget-friendly freestanding 3-season tent. Heavier than premium options but durable and waterproof."
       affiliateUrl: '#'
     - name: "NEMO Dagger Osmo 2P"
       rating: 4.5
       description: "Recycled-material tent with excellent livable volume and color-coded setup. Durable and environmentally considered."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (3-season vs. 4-season, freestanding vs. trekking pole, single vs. double wall), Comparison Table (Product, Weight, Seasons, Setup Time, Price Range, Rating), 4 ProductCard components, Care section (seam sealing, drying, footprint use), FAQ (condensation management, wind stakes, bear country, thunderstorm safety), Final Verdict.

3. **Write `src/content/reviews/outdoor/best-headlamps.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Headlamps of 2025: Light When You Need It Most"
   description: "We ran 6 headlamps through night hikes, camp chores, and reading. These deliver the right light without draining batteries fast."
   category: outdoor
   date: 2025-10-18
   heroImage: /images/outdoor-best-headlamps.jpg
   excerpt: "Six headlamps tested on night hikes and around camp. Brightness matters less than beam pattern, runtime, and not fumbling with controls in the dark."
   products:
     - name: "Black Diamond Spot 400-R"
       rating: 4.8
       description: "400 lumens, USB rechargeable, red night-vision mode, waterproof IPX8. The benchmark headlamp for serious hikers."
       affiliateUrl: '#'
     - name: "Petzl Actik Core"
       rating: 4.6
       description: "450-lumen hybrid (USB or AAA batteries) with wide and spot beams. Reactive lighting mode auto-adjusts to surroundings."
       affiliateUrl: '#'
     - name: "Nitecore NU25"
       rating: 4.3
       description: "360-lumen built-in battery with dual-light output (white + high-CRI). Ultralight at 2.3 oz, great for trail running."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (lumens vs. beam type, battery vs. rechargeable, when you actually need high lumens), Comparison Table (Product, Max Lumens, Battery, IPX Rating, Weight, Best For, Rating), 3 ProductCard components, Battery Life section, FAQ (AAA vs. rechargeable, red light use, cold weather battery drain, waterproofing), Final Verdict.

4. **Write `src/content/reviews/outdoor/best-water-filters.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Water Filters for Hiking of 2025: Safe Hydration on the Trail"
   description: "We filtered water from streams, lakes, and murky sources with 6 backcountry filters. These are the ones we trust with our health."
   category: outdoor
   date: 2025-10-05
   heroImage: /images/outdoor-best-water-filters.jpg
   excerpt: "Six backcountry water filters tested in the field. The best ones are fast, lightweight, and don't leave you questioning the water quality."
   products:
     - name: "Sawyer Squeeze Water Filter"
       rating: 4.8
       description: "0.1-micron hollow fiber filter, removes 99.99999% of bacteria. Lightweight, squeeze-operated, field-cleanable. Lifetime warranty."
       affiliateUrl: '#'
     - name: "Katadyn BeFree 1.0L"
       rating: 4.6
       description: "Hollow fiber filter integrated into a collapsible soft flask. Fast flow rate, easy to use, great for solo hikers."
       affiliateUrl: '#'
     - name: "MSR TrailShot Pocket-Sized Filter"
       rating: 4.4
       description: "In-line filter with squeeze or sip-through capability. Tiny form factor, fast flow, easy one-handed use."
       affiliateUrl: '#'
     - name: "Grayl GeoPress Purifier"
       rating: 4.5
       description: "Press-style purifier removes viruses, bacteria, and protozoa. No need for chemical treatment. 24 oz capacity."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (filter vs. purifier, what backcountry water contains, weight vs. safety tradeoffs), Comparison Table (Product, Method, Filters Viruses, Weight, Flow Rate, Capacity, Rating), 4 ProductCard components, Maintenance section (backflushing, freezing damage, lifespan), FAQ (giardia vs. viruses, chemical backup, shared use, filter lifespan), Final Verdict.

5. **Write `src/content/reviews/home/best-robot-vacuums.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Robot Vacuums of 2025: Hands-Off Cleaning That Actually Works"
   description: "We ran 5 robot vacuums daily for 4 weeks across hardwood, tile, and carpet with pet hair. These are the ones that earn their keep."
   category: home
   date: 2025-11-12
   heroImage: /images/home-best-robot-vacuums.jpg
   excerpt: "Four weeks, five robots, and the same pet-hair-covered floors. Two models cleaned without fuss. Here's everything we learned."
   products:
     - name: "iRobot Roomba j7+"
       rating: 4.7
       description: "Smart Mapping with Pet Owner Official Promise — avoids pet waste and cords. Self-emptying base, Alexa compatible."
       affiliateUrl: '#'
     - name: "Roborock S8 Pro Ultra"
       rating: 4.8
       description: "LiDAR mapping with simultaneous vacuum and mop. Auto-empties and self-cleans mop. The most autonomous option tested."
       affiliateUrl: '#'
     - name: "Eufy RoboVac 11S"
       rating: 4.2
       description: "Budget robot at under $150. No mapping, but quiet and effective on hard floors and low-pile carpet."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (mapping vs. bump-and-go, suction vs. mop combo, pet hair considerations), Comparison Table (Product, Navigation, Suction Pa, Mop, Self-Empty, Best For, Rating), 3 ProductCard components, App Control section, FAQ (virtual walls, multiple floors, carpet boost, maintenance schedule), Final Verdict.

6. **Write `src/content/reviews/home/best-air-purifiers.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Air Purifiers of 2025: Tested for Real Air Quality"
   description: "We measured particulate counts before and after running 6 air purifiers in a 250 sq ft room. These three produced measurable results."
   category: home
   date: 2025-10-30
   heroImage: /images/home-best-air-purifiers.jpg
   excerpt: "Particulate meters don't lie. We measured air quality before and after, and only three purifiers made a meaningful difference."
   products:
     - name: "Winix 5500-2"
       rating: 4.7
       description: "True HEPA + washable AOC carbon filter + PlasmaWave. Covers 360 sq ft, auto mode, sleep mode. Outstanding value."
       affiliateUrl: '#'
     - name: "Coway AP-1512HH Mighty"
       rating: 4.8
       description: "True HEPA with ionizer and real-time air quality indicator. Covers 360 sq ft. The best-selling air purifier for good reason."
       affiliateUrl: '#'
     - name: "Levoit Core 300"
       rating: 4.4
       description: "Compact 3-stage filtration for smaller rooms (up to 219 sq ft). Whisper-quiet sleep mode, stylish design."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (HEPA vs. HEPA-type, CADR ratings, room sizing), Comparison Table (Product, CADR, Coverage, Filter Type, Noise Level, Filter Cost, Rating), 3 ProductCard components, Filter Replacement section, FAQ (HEPA vs. ionizer safety, wildfire smoke, placement, VOCs), Final Verdict.

7. **Write `src/content/reviews/home/best-smart-plugs.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Smart Plugs of 2025: Simple Home Automation That Works"
   description: "Smart plugs are the easiest smart home upgrade. We tested 7 models for reliability, app quality, and voice assistant compatibility."
   category: home
   date: 2025-10-15
   heroImage: /images/home-best-smart-plugs.jpg
   excerpt: "Seven smart plugs across three ecosystems. Some dropped off Wi-Fi constantly. Two just worked, every time, for months."
   products:
     - name: "Kasa Smart Plug EP25"
       rating: 4.8
       description: "Matter-compatible, energy monitoring, dual-band Wi-Fi. Works with Alexa, Google, HomeKit, SmartThings. Rock-solid reliability."
       affiliateUrl: '#'
     - name: "Amazon Smart Plug"
       rating: 4.4
       description: "Simple one-button pairing with Alexa, no hub needed. No energy monitoring, but ultra-reliable within the Amazon ecosystem."
       affiliateUrl: '#'
     - name: "Wemo Mini Smart Plug"
       rating: 4.3
       description: "Compact design doesn't block the second outlet. Works with Alexa, Google, HomeKit. Slightly pricier than Kasa."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (why smart plugs, ecosystems, energy monitoring value), Comparison Table (Product, Protocol, Energy Monitor, Compact, Voice Assistants, Rating), 3 ProductCard components, Ecosystem section (Alexa vs. Google vs. HomeKit), FAQ (do they work without Wi-Fi, can they handle high-wattage appliances, Matter compatibility), Final Verdict.

8. **Write `src/content/reviews/beauty/best-electric-toothbrushes.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Electric Toothbrushes of 2025: Cleaner Teeth, Proven"
   description: "We tested 6 electric toothbrushes over 8 weeks with consistent brushing habits. These three measurably outperformed manual brushing."
   category: beauty
   date: 2025-11-18
   heroImage: /images/beauty-best-electric-toothbrushes.jpg
   excerpt: "Eight weeks of twice-daily brushing with six electric models. The results varied more than expected — and the winner wasn't the most expensive."
   products:
     - name: "Oral-B Pro 1000"
       rating: 4.7
       description: "Round oscillating head with pressure sensor. Dentist-recommended motion, 2-minute timer, compatible with all Oral-B heads."
       affiliateUrl: '#'
     - name: "Philips Sonicare ProtectiveClean 4100"
       rating: 4.6
       description: "31,000 strokes/min sonic technology with pressure sensor and BrushSync replacement reminder. Gentle on sensitive gums."
       affiliateUrl: '#'
     - name: "Quip Electric Toothbrush"
       rating: 4.1
       description: "Slim, travel-friendly sonic toothbrush with built-in timer. Subscription brush head service. Simple and reliable."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (oscillating vs. sonic, pressure sensors, brush head replacement), Comparison Table (Product, Technology, Timer, Pressure Sensor, Battery Life, Rating), 3 ProductCard components, Gum Health section, FAQ (electric vs. manual evidence, kids electric toothbrushes, travel with, sensitive teeth), Final Verdict.

9. **Write `src/content/reviews/beauty/best-face-serums.mdx`**

   Frontmatter:
   ```yaml
   ---
   title: "Best Face Serums of 2025: What the Evidence Actually Shows"
   description: "We reviewed ingredient lists, clinical evidence, and used each serum for 6 weeks. Most serums overpromise. These three deliver."
   category: beauty
   date: 2025-11-01
   heroImage: /images/beauty-best-face-serums.jpg
   excerpt: "Six weeks per serum, ingredient analysis, and clinical evidence review. Skincare marketing is loud — we cut through it."
   products:
     - name: "Paula's Choice 10% Niacinamide Booster"
       rating: 4.8
       description: "10% niacinamide + zinc for pores and uneven tone. Fragrance-free, lightweight, works across skin types. Clinical backing."
       affiliateUrl: '#'
     - name: "The Ordinary Hyaluronic Acid 2% + B5"
       rating: 4.5
       description: "Multi-weight hyaluronic acid with vitamin B5. Budget-priced, effective hydration layer, suitable for all skin types."
       affiliateUrl: '#'
     - name: "SkinCeuticals C E Ferulic"
       rating: 4.9
       description: "Gold standard vitamin C serum. 15% L-ascorbic acid with vitamin E and ferulic acid. Clinically proven antioxidant protection."
       affiliateUrl: '#'
   ---
   ```

   Body: Introduction (what serums actually do, active ingredients that have evidence, layering order), Comparison Table (Product, Key Ingredient, Concentration, Skin Type, Price per oz, Rating), 3 ProductCard components, Ingredients to Know section (niacinamide, vitamin C, retinol, hyaluronic acid), FAQ (serum vs. moisturizer, vitamin C oxidation, layering order, retinol with vitamin C), Final Verdict.

10. **Write `src/content/reviews/beauty/best-hair-dryers.mdx`**

    Frontmatter:
    ```yaml
    ---
    title: "Best Hair Dryers of 2025: Fast Dry, Healthy Hair"
    description: "We dried the same hair type repeatedly with 7 hair dryers to measure dry time, heat consistency, and noise. Two were clearly better."
    category: beauty
    date: 2025-10-25
    heroImage: /images/beauty-best-hair-dryers.jpg
    excerpt: "Seven hair dryers, the same model of hair, measured dry times and temperature consistency. The results challenged some popular assumptions."
    products:
      - name: "Dyson Supersonic"
        rating: 4.8
        description: "Digital motor with intelligent heat control (409 measurements/sec). Fastest dry time tested, ultra-quiet, magnetic attachments."
        affiliateUrl: '#'
      - name: "Shark HyperAir IQ"
        rating: 4.6
        description: "IQ technology combines heat + airflow for 3× faster drying. Lightweight at 1.3 lbs, includes concentrator and diffuser."
        affiliateUrl: '#'
      - name: "Revlon 1875W Salon Hair Dryer"
        rating: 4.3
        description: "1875-watt DC motor, ionic technology, three heat settings. Excellent value — outperformed dryers 3× its price in our tests."
        affiliateUrl: '#'
    ---
    ```

    Body: Introduction (wattage vs. technology, ionic vs. tourmaline vs. ceramic, attachment value), Comparison Table (Product, Motor, Wattage, Dry Time, Noise Level, Weight, Rating), 3 ProductCard components, Hair Health section (heat damage, temperature settings, cool shot use), FAQ (concentrator vs. diffuser, travel converters, ionic claims, how often to replace), Final Verdict.

11. **Run full slice verification suite**:
    ```bash
    # Full build
    pnpm build
    echo "Exit: $?"

    # Zero errors
    pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l   # → 0

    # All 4 category indexes
    ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html

    # Spot-check article routes across all categories
    ls dist/en/kitchen/best-coffee-makers/index.html
    ls dist/en/outdoor/best-hiking-backpacks/index.html
    ls dist/en/home/best-robot-vacuums/index.html
    ls dist/en/beauty/best-hair-dryers/index.html

    # Sitemap populated (expect ≥25 locs: 15 articles + 4 category + home + about + privacy + disclosure + contact + root redirect)
    grep -c "<loc>" dist/sitemap-0.xml

    # TypeScript clean
    pnpm astro check 2>&1 | tail -3
    ```

## Must-Haves

- [ ] All 10 files written with valid frontmatter (schema-compliant, `heroImage` paths reference files from T01, `rating` 1–5, `affiliateUrl: '#'`)
- [ ] `description` ≤160 chars and `excerpt` ≤200 chars on all 10 articles
- [ ] ProductCard import path is exactly `'../../../components/ProductCard.astro'` in all 10 files
- [ ] Each article has: introduction, comparison table, ≥3 ProductCard components, FAQ section, Final Verdict
- [ ] `pnpm build` exits 0 after all 10 files are written
- [ ] All 15 article routes exist in `dist/en/`
- [ ] All 4 category index pages exist in `dist/en/[category]/index.html`
- [ ] `grep -c "<loc>" dist/sitemap-0.xml` returns ≥25
- [ ] `pnpm astro check` reports 0 errors

## Verification

```bash
# Full verification suite (run after all 10 articles written)
pnpm build; echo "Exit: $?"
pnpm build 2>&1 | grep -E '\[ERROR\]' | wc -l
ls dist/en/kitchen/index.html dist/en/outdoor/index.html dist/en/home/index.html dist/en/beauty/index.html
ls dist/en/kitchen/best-coffee-makers/index.html
ls dist/en/outdoor/best-hiking-backpacks/index.html
ls dist/en/home/best-robot-vacuums/index.html
ls dist/en/beauty/best-hair-dryers/index.html
grep -c "<loc>" dist/sitemap-0.xml
pnpm astro check 2>&1 | tail -3
```

## Inputs

- `src/content.config.ts` — schema contract (do not modify)
- `public/images/outdoor-*.jpg`, `public/images/home-*.jpg`, `public/images/beauty-*.jpg` — 10 images from T01; verify these exist before writing frontmatter
- `src/components/ProductCard.astro` — Props: `name` (string), `rating` (number 1–5), `description` (string), `affiliateUrl?` (string)
- `src/layouts/ArticleLayout.astro` — wraps MDX content in prose wrapper; do not add prose classes in MDX
- Kitchen articles from T02 — reference for the correct MDX structure and frontmatter format

## Expected Output

- 10 new MDX files across outdoor, home, and beauty categories
- `dist/en/outdoor/best-hiking-backpacks/index.html` and 3 other outdoor article routes
- `dist/en/home/best-robot-vacuums/index.html` and 2 other home article routes
- `dist/en/beauty/best-electric-toothbrushes/index.html` and 2 other beauty article routes
- `dist/sitemap-0.xml` with ≥25 `<loc>` entries
- `pnpm astro check` at 0 errors (file count increases from 14+ to 14+15+1=30)
