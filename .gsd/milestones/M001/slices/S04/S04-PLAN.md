# S04: Build + deploy

**Goal:** Transfer the built `dist/` to the VPS, add a Caddy site block for `tsa.monster`, reload Caddy, and verify the site is accessible.
**Demo:** `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ -H 'Host: tsa.monster'` returns `200` on the VPS, confirming Caddy is serving the static site. Public HTTPS via Cloudflare also verified post-reload.

## Must-Haves

- `dist/` contents transferred to `/var/www/sites/tsa-monster/` on the VPS with exactly 25 `index.html` files
- Caddy site block at `/etc/caddy/sites/tsa.monster.conf` using `http://tsa.monster` prefix (HTTP-only, no auto-HTTPS)
- `caddy validate` passes before `systemctl reload caddy`
- `curl http://127.0.0.1/ -H 'Host: tsa.monster'` returns `200` on the VPS loopback
- Public `https://tsa.monster/en/` accessible (Cloudflare proxy → Caddy → dist/)
- Root redirect `https://tsa.monster/` → `/en/` confirmed

## Proof Level

- This slice proves: operational + final-assembly
- Real runtime required: yes (VPS SSH, Caddy reload, live HTTP check)
- Human/UAT required: yes (one interactive sudo command in T01; visual check of live site)

## Verification

```bash
# On VPS via SSH — loopback check (immediate, no DNS dependency)
ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ -H "Host: tsa.monster"'
# expect: 200

# File count on VPS
ssh daniel@100.89.11.76 'find /var/www/sites/tsa-monster -name "index.html" | wc -l'
# expect: 25

# Key files present
ssh daniel@100.89.11.76 'ls /var/www/sites/tsa-monster/en/index.html /var/www/sites/tsa-monster/sitemap-0.xml /var/www/sites/tsa-monster/en/kitchen/best-coffee-makers/index.html'
# expect: all three paths print without error

# Caddy config validated
ssh daniel@100.89.11.76 'caddy validate --config /etc/caddy/Caddyfile 2>&1'
# expect: "Valid configuration"

# Public HTTPS (after Cloudflare propagation — may take a few minutes)
curl -s -o /dev/null -w '%{http_code}' https://tsa.monster/en/
# expect: 200

# Root redirect
curl -sI https://tsa.monster/ | grep -i location
# expect: Location: https://tsa.monster/en/ (or /en/)

# --- Failure / diagnostic checks ---

# Caddy service status (authoritative — exits non-zero if caddy is failed/inactive)
ssh daniel@100.89.11.76 'systemctl is-active caddy'
# expect: active (non-zero exit = caddy is not running)

# Last 20 Caddy log lines (run if loopback curl returns non-200 or caddy is not active)
ssh daniel@100.89.11.76 'journalctl -u caddy -n 20 --no-pager'

# sites/ dir ownership (verify T01 prerequisite before T02 writes the conf)
ssh daniel@100.89.11.76 'stat -c "%U:%G %n" /etc/caddy/sites'
# expect: daniel:daniel /etc/caddy/sites

# Rsync dry-run diff (re-run to detect drift between local dist/ and VPS)
rsync -avn --delete -e 'ssh' dist/ daniel@100.89.11.76:/var/www/sites/tsa-monster/
# expect: empty output (no deletes, no new files) after successful T01 transfer
```

## Observability / Diagnostics

- Runtime signals: Caddy access log at `/var/log/caddy/` (if enabled); `systemctl status caddy` shows active/failed; `caddy validate` exit code is authoritative pre-reload
- Inspection surfaces:
  - `ssh daniel@100.89.11.76 'systemctl status caddy'` — confirm caddy is running after reload
  - `ssh daniel@100.89.11.76 'journalctl -u caddy -n 50'` — tail caddy logs if 200 not returned
  - `ssh daniel@100.89.11.76 'ls -la /etc/caddy/sites/'` — confirm conf file exists and is readable
  - `curl -sI https://tsa.monster/` — HTTP headers reveal Cloudflare cache status (`cf-cache-status`) and origin response code
- Failure visibility: if Cloudflare returns 526 (Invalid SSL Certificate), Cloudflare SSL mode is Full strict but Caddy serves plain HTTP — fix: change Cloudflare SSL mode to "Full" (non-strict) in dashboard
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `dist/` (25 pages built by S01–S03); `/etc/caddy/Caddyfile` with `import sites/*` (pre-existing, not modified)
- New wiring introduced: `/etc/caddy/sites/tsa.monster.conf` → picked up by `import sites/*` on caddy reload; `/var/www/sites/tsa-monster/` populated with `dist/` contents
- What remains before the milestone is truly usable end-to-end: nothing — this is the final slice

## Tasks

- [ ] **T01: One-time VPS setup + rsync dist/ to server** `est:20m`
  - Why: The agent cannot write to `/etc/caddy/sites/` without a one-time root mkdir/chown. Once the directory exists and is daniel-owned, T02 can write the conf file unattended. The dist/ transfer is also a prerequisite for T02's Caddy verification.
  - Files: local `dist/` → VPS `/var/www/sites/tsa-monster/`
  - Do: (1) Ask the user to run the one-time interactive sudo commands on the VPS via SSH. (2) rsync `dist/` to the VPS. (3) Confirm 25 index.html files are present on the VPS.
  - Verify: `ssh daniel@100.89.11.76 'find /var/www/sites/tsa-monster -name "index.html" | wc -l'` → 25
  - Done when: VPS has 25 `index.html` files at `/var/www/sites/tsa-monster/` AND `/etc/caddy/sites/` exists and is daniel-owned
- [ ] **T02: Write Caddy site block, validate, reload, verify** `est:15m`
  - Why: Caddy needs a site block for `tsa.monster` before the domain resolves. The block must use `http://tsa.monster` prefix to prevent auto-HTTPS conflicts with Cloudflare proxy. Depends on T01 (sites/ dir must exist and be writable).
  - Files: VPS `/etc/caddy/sites/tsa.monster.conf` (new), VPS `~/caddy-config/Caddyfile` (sync copy)
  - Do: (1) Write the Caddy site block. (2) Run `caddy validate`. (3) Run `sudo -n systemctl reload caddy`. (4) Verify loopback with curl. (5) Verify public URL. (6) Handle SSL mode mismatch if 526 appears.
  - Verify: `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/ -H 'Host: tsa.monster'` returns `200` on VPS; `https://tsa.monster/en/` returns `200` publicly
  - Done when: VPS loopback returns 200 AND public HTTPS returns 200 AND root redirect confirmed

## Files Likely Touched

- local `dist/` — source artifact (read-only)
- VPS `/var/www/sites/tsa-monster/` — populated with dist/ contents
- VPS `/etc/caddy/sites/tsa.monster.conf` — new Caddy site block
- VPS `~/caddy-config/Caddyfile` — sync copy (updated to reflect sites/ pattern)
