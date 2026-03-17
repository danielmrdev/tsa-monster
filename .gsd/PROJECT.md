# tsa.monster

## What This Is

Static Amazon affiliate review site in English, targeting the US market first. The primary goal is getting approved as an Amazon Associate (US). Once approved, it serves as an active site generating organic traffic and real commissions. The architecture is i18n-ready from day one — English lives at `/en/`, future languages at `/de/`, `/fr/`, etc. — so adding a new locale is a matter of content, not code.

## Core Value

A real, professional-looking review site that passes Amazon's manual Associates approval review: 10+ pages of original content, legal pages present, clean design, affiliate disclosure everywhere it needs to be.

## Current State

Fresh repository. No source code yet. GSD planning complete, ready for execution.

## Architecture / Key Patterns

- **Framework:** Astro 6 (static output — `output: 'static'`)
- **Styles:** Tailwind CSS v4
- **Language:** TypeScript
- **Content:** MDX via Astro Content Collections
- **i18n:** Astro native i18n with `prefixDefaultLocale: true` — all URLs prefixed (`/en/`, `/de/`, ...)
- **Language redirect:** Client-side script at `/` reads `navigator.language`, redirects to matching locale, fallback to `/en/`
- **Images:** Unsplash lifestyle/ambient photos, downloaded as local assets (not hotlinked)
- **Deploy:** VPS with existing Caddy — new site block added to existing config, `dist/` copied to `/var/www/tsa-monster/`
- **CDN/DNS:** Cloudflare in proxy mode, SSL Full (strict)
- **Package manager:** pnpm

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: Launch — Build and deploy tsa.monster, ready for Amazon Associates US application
