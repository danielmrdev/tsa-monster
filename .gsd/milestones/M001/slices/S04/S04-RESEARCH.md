# S04: Build + deploy — Research

**Date:** 2026-03-17

## Summary

S04 is a targeted deployment slice. The `dist/` output is already built and valid (25 pages, 4.48s build, 0 errors — confirmed via fresh `pnpm build` run). What remains is: transfer `dist/` to the VPS, add a Caddy site block for `tsa.monster`, and reload Caddy. The risk is purely operational — SSH access, file permissions, and Caddy config topology — all of which are now fully mapped.

The VPS is a Hetzner cx33 running Ubuntu 24.04, accessible via Tailscale at `100.89.11.76` as `daniel@`. The Caddyfile (`/etc/caddy/Caddyfile`) uses `import sites/*` which resolves to `/etc/caddy/sites/` — a directory that does **not** exist yet and is root-owned (not writable without password sudo). The solution is to add a one-time step: create `/etc/caddy/sites/` and chown it to `daniel` so the executor can write site conf files there without further password sudo. `daniel` has `NOPASSWD` for `systemctl reload caddy`, so after that one-time setup, all future site additions are fully automated.

Deploy target for static files: `/var/www/sites/tsa-monster/` — already created, daniel-owned. `rsync` is available on the VPS. Transfer size is ~3.4MB.

## Recommendation

Two-task split:

**T01 — One-time VPS setup + file transfer**: The user runs one interactive sudo command to create and chown `/etc/caddy/sites/`. Then the agent rsyncs `dist/` to `/var/www/sites/tsa-monster/` via Tailscale SSH.

**T02 — Caddy site block + reload + verify**: Agent writes `/etc/caddy/sites/tsa.monster.conf` (daniel-owned after T01 setup), runs `sudo -n systemctl reload caddy`, and verifies via curl through Tailscale that the site responds.

The Cloudflare DNS/SSL layer is already in proxy mode (tsa.monster → Cloudflare → VPS:80). Caddy should serve HTTP on port 80 for tsa.monster — matching the existing "sitios generados" section intent in the Caddyfile comment. Use `http://tsa.monster` prefix in the Caddy site block to suppress auto-HTTPS (which would cause a redirect loop with Cloudflare proxy).

## Implementation Landscape

### Key Files and State

**On local machine (`/home/daniel/tsa.monster`):**
- `dist/` — 3.4MB, 25 pages (15 articles + 4 category indexes + 4 static pages + root redirect). Built clean at 2026-03-17. This is the deploy artifact.
- `astro.config.mjs` — `output: 'static'`, `site: 'https://tsa.monster'` — already correct for production.

**On VPS (`daniel@100.89.11.76` via Tailscale):**
- `/etc/caddy/Caddyfile` — root-owned, 488 bytes. Contains `import sites/*` at bottom. **Do not edit directly.**
- `/etc/caddy/sites/` — **does not exist yet**. Must be created (root mkdir) and chowned to daniel. One-time setup step.
- `/var/www/sites/tsa-monster/` — **already created**, daniel:daniel owned. This is where dist/ goes.
- `sudo -n systemctl reload caddy` — works NOPASSWD for daniel. Caddy v2.11.2 running, active.
- `rsync` at `/usr/bin/rsync` v3.2.7 — available.
- `~/caddy-config/Caddyfile` — daniel's local copy of the Caddyfile (source of truth for manual changes). Keep in sync.

### Caddy Site Block Pattern

Existing admin sites use DNS-01 TLS (serve HTTPS directly). For `tsa.monster` behind Cloudflare proxy, use HTTP-only pattern to avoid auto-HTTPS redirect loops:

```caddy
http://tsa.monster {
    root * /var/www/sites/tsa-monster
    file_server
    encode gzip
}
```

This block goes in `/etc/caddy/sites/tsa.monster.conf`. The `import sites/*` in the main Caddyfile will pick it up after caddy reload.

The `_headers` file in dist/ contains Cloudflare cache directives — these are passed through by Cloudflare, not interpreted by Caddy.

### Verification Approach

After deploy:

```bash
# Via Tailscale SSH — test Caddy is serving
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ -H 'Host: tsa.monster'
# expect: 200

# Verify key pages exist on disk
ls /var/www/sites/tsa-monster/en/index.html
ls /var/www/sites/tsa-monster/en/kitchen/best-coffee-makers/index.html
ls /var/www/sites/tsa-monster/sitemap-0.xml

# Verify page count
find /var/www/sites/tsa-monster -name "index.html" | wc -l
# expect: 25

# Verify Caddy config is valid before reload
caddy validate --config /etc/caddy/Caddyfile
# expect: Valid configuration

# After Cloudflare propagation: public check (may take minutes)
curl -s -o /dev/null -w '%{http_code}' https://tsa.monster/en/
# expect: 200
curl -sI https://tsa.monster/ | grep -i location
# expect: Location: https://tsa.monster/en/ (root redirect working)
```

### Build Order

1. **T01**: User runs one-time sudo setup → agent rsyncs dist/ → confirms file count on VPS
2. **T02**: Agent writes Caddy conf → validates → reloads → verifies via curl on VPS loopback
3. Slice complete once `curl http://127.0.0.1/ -H 'Host: tsa.monster'` returns 200 on VPS

T02 depends on T01 (needs `/etc/caddy/sites/` to exist). No parallelism possible.

## Constraints

- `daniel` user cannot write to `/etc/caddy/` without password sudo (root-owned, 755). The one-time `sudo mkdir /etc/caddy/sites && sudo chown daniel:daniel /etc/caddy/sites` requires the user to run it in an interactive SSH session.
- `daniel` has `NOPASSWD` only for `systemctl reload caddy` and `nanoclaw-ctl`. All other sudo requires password.
- VPS Tailscale IP: `100.89.11.76`. Public IP: `157.180.120.160`. SSH as `daniel@100.89.11.76`.
- `tsa.monster` DNS resolves to Cloudflare IPs (54.149.79.189, 34.216.117.25) — public HTTPS tests only work after Cloudflare propagation and after the Caddy site block is active.
- Caddy is running on ports 80 AND 443. The `http://tsa.monster` block explicitly binds HTTP only — this is intentional to avoid Caddy trying to auto-provision a cert and conflicting with Cloudflare's termination.

## Common Pitfalls

- **`import sites/*` glob with non-existent dir** — Caddy silently ignores the glob if `/etc/caddy/sites/` doesn't exist. Caddy runs fine but tsa.monster gets no handler. Always verify the sites dir exists before reloading.
- **Auto-HTTPS redirect loop** — If the site block is `tsa.monster { ... }` (without `http://` prefix), Caddy enables auto-HTTPS and redirects :80→:443. Cloudflare then sees a redirect and loops. Use `http://tsa.monster` to bind HTTP only.
- **rsync trailing slash matters** — `rsync -av dist/ daniel@100.89.11.76:/var/www/sites/tsa-monster/` (with trailing slash on source) copies dist/ *contents* to target. Without trailing slash it creates a `dist/` subdirectory inside the target.
- **Caddy validate before reload** — `caddy validate --config /etc/caddy/Caddyfile` before `systemctl reload caddy`. A syntax error in the new site conf will fail silently on `reload` — the old config stays active but you won't know the new block didn't load.
- **SSH host key for Tailscale IP** — First connection to `100.89.11.76` may prompt for host key confirmation. Use `-o StrictHostKeyChecking=accept-new` on the first rsync/ssh call.

## Open Risks

- **Cloudflare SSL mode** — D005 says "SSL Full (strict)" but the Caddyfile comment says "HTTP — Cloudflare proxy termina el TLS". Full strict requires a valid cert on origin (not plain HTTP). If Cloudflare is actually in Full strict mode, plain HTTP on origin will fail. The `http://tsa.monster` Caddy block will need to become `tsa.monster { tls ... }` with a Cloudflare-origin cert, or the SSL mode needs to be changed to "Full" (non-strict). This should be verified during T02 by testing via public URL after deploy. If 526 (Invalid SSL Certificate) appears, switch Cloudflare SSL mode to "Full" (non-strict) — the simplest fix without changing Caddy config.
- **Caddy conf file not picked up** — `import sites/*` is a glob; if `caddy validate` passes but the conf isn't loaded, check that `/etc/caddy/sites/tsa.monster.conf` exists with correct permissions (readable by caddy, which runs as `caddy` user — world-readable is fine).
