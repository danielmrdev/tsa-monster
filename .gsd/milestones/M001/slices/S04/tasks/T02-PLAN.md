---
estimated_steps: 6
estimated_files: 2
---

# T02: Write Caddy site block, validate, reload, verify

**Slice:** S04 — Build + deploy
**Milestone:** M001

## Description

With `dist/` transferred and `/etc/caddy/sites/` created and daniel-owned (T01 prerequisite), this task wires Caddy to serve `tsa.monster`:

1. Write `/etc/caddy/sites/tsa.monster.conf` with an HTTP-only site block.
2. Validate the full Caddyfile before reloading.
3. Reload Caddy (NOPASSWD — no password required).
4. Verify via VPS loopback curl.
5. Verify via public HTTPS URL.
6. Handle SSL mode mismatch if Cloudflare returns 526.

**Critical constraint — HTTP-only block:** The site block must use `http://tsa.monster` (not bare `tsa.monster`). Using bare `tsa.monster` triggers Caddy auto-HTTPS, which redirects :80→:443. Cloudflare proxy then sees the redirect and loops. `http://tsa.monster` binds HTTP only — Cloudflare terminates TLS and forwards plain HTTP to the origin.

**Caddy config topology:** The main `/etc/caddy/Caddyfile` contains `import sites/*` at the bottom. Writing to `/etc/caddy/sites/tsa.monster.conf` is sufficient — no edits to the main Caddyfile needed.

**SSL mode risk:** If Cloudflare SSL mode is "Full strict", it requires a valid TLS cert on origin. Plain HTTP origin will produce a 526. Fix: change Cloudflare SSL mode from "Full strict" to "Full" (non-strict) — this accepts any cert (including self-signed or no cert). Do not add TLS to the Caddy block.

## Steps

1. **Write the Caddy site block** to `/etc/caddy/sites/tsa.monster.conf` on the VPS:
   ```caddy
   http://tsa.monster {
       root * /var/www/sites/tsa-monster
       file_server
       encode gzip
   }
   ```
   Use SSH heredoc or echo to write the file:
   ```bash
   ssh daniel@100.89.11.76 'cat > /etc/caddy/sites/tsa.monster.conf << '\''EOF'\''
   http://tsa.monster {
       root * /var/www/sites/tsa-monster
       file_server
       encode gzip
   }
   EOF'
   ```

2. **Verify the file was written correctly:**
   ```bash
   ssh daniel@100.89.11.76 'cat /etc/caddy/sites/tsa.monster.conf'
   ```

3. **Validate the full Caddyfile** (catches syntax errors before they break the live server):
   ```bash
   ssh daniel@100.89.11.76 'caddy validate --config /etc/caddy/Caddyfile 2>&1'
   ```
   Expect output containing "Valid configuration". **Do not proceed to reload if this fails.**

4. **Reload Caddy** (NOPASSWD — no password prompt):
   ```bash
   ssh daniel@100.89.11.76 'sudo -n systemctl reload caddy'
   ```
   Then confirm it's still active:
   ```bash
   ssh daniel@100.89.11.76 'systemctl is-active caddy'
   ```
   Expect: `active`

5. **Test via VPS loopback** (bypasses DNS and Cloudflare — direct Caddy check):
   ```bash
   ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ -H "Host: tsa.monster"'
   ```
   Expect: `200`

   Also verify the EN index page and an article route:
   ```bash
   ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/en/ -H "Host: tsa.monster"'
   # expect: 200
   ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/en/kitchen/best-coffee-makers/ -H "Host: tsa.monster"'
   # expect: 200
   ```

6. **Test via public HTTPS** (Cloudflare → Caddy):
   ```bash
   curl -s -o /dev/null -w '%{http_code}' https://tsa.monster/en/
   # expect: 200

   curl -sI https://tsa.monster/ | grep -i location
   # expect: Location: https://tsa.monster/en/ (root redirect working)
   ```

   **If public test returns 526 (Invalid SSL Certificate):**
   - This means Cloudflare SSL mode is "Full strict" — it requires a valid cert on origin, but Caddy is serving plain HTTP.
   - Fix: in Cloudflare dashboard → tsa.monster → SSL/TLS → change mode from "Full (strict)" to "Full" (non-strict).
   - Re-run the public curl check. It should return 200 within a few seconds of the mode change.
   - Document the actual SSL mode as a note in this task's summary.

   **If public test returns 524 (Connection Timed Out):**
   - Cloudflare can't reach the origin. Check VPS firewall allows port 80 from Cloudflare IPs.
   - Run `ssh daniel@100.89.11.76 'sudo ufw status'` — port 80 should be ALLOW.

7. **Update the daniel-local Caddyfile copy** to stay in sync:
   ```bash
   ssh daniel@100.89.11.76 'cat /etc/caddy/sites/tsa.monster.conf >> ~/caddy-config/sites/tsa.monster.conf 2>/dev/null || (mkdir -p ~/caddy-config/sites && cp /etc/caddy/sites/tsa.monster.conf ~/caddy-config/sites/tsa.monster.conf)'
   ```

## Must-Haves

- [ ] `/etc/caddy/sites/tsa.monster.conf` written with `http://tsa.monster` prefix (HTTP-only — not bare `tsa.monster`)
- [ ] `caddy validate --config /etc/caddy/Caddyfile` passes before reload
- [ ] `systemctl reload caddy` succeeds; `systemctl is-active caddy` → `active`
- [ ] VPS loopback `curl http://127.0.0.1/ -H 'Host: tsa.monster'` returns `200`
- [ ] Public `https://tsa.monster/en/` returns `200`
- [ ] Root redirect `https://tsa.monster/` → `/en/` confirmed via `curl -sI`

## Verification

```bash
# 1. Conf file exists and has correct content
ssh daniel@100.89.11.76 'grep "http://tsa.monster" /etc/caddy/sites/tsa.monster.conf'
# expect: line with http://tsa.monster

# 2. Caddy is active
ssh daniel@100.89.11.76 'systemctl is-active caddy'
# expect: active

# 3. Loopback serves root
ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ -H "Host: tsa.monster"'
# expect: 200

# 4. Loopback serves article
ssh daniel@100.89.11.76 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/en/kitchen/best-coffee-makers/ -H "Host: tsa.monster"'
# expect: 200

# 5. Public HTTPS
curl -s -o /dev/null -w '%{http_code}' https://tsa.monster/en/
# expect: 200

# 6. Root redirect
curl -sI https://tsa.monster/ | grep -i location
# expect: Location header pointing to /en/
```

## Observability Impact

- Signals added/changed: Caddy begins logging requests for tsa.monster in `/var/log/caddy/` (if Caddy logging is configured); `systemctl status caddy` reflects the new site
- How a future agent inspects this: `ssh daniel@100.89.11.76 'journalctl -u caddy -n 100'` for Caddy logs; `ssh daniel@100.89.11.76 'curl -sv http://127.0.0.1/ -H "Host: tsa.monster" 2>&1 | head -30'` for verbose response headers
- Failure state exposed: 526 → Cloudflare SSL mode mismatch (fix: change to Full non-strict); 404 → Caddy is running but `import sites/*` not picking up the conf (check file permissions with `ls -la /etc/caddy/sites/`); 502/503 → Caddy not running (check `systemctl status caddy`)

## Inputs

- T01 must be complete: `/etc/caddy/sites/` exists and is daniel-owned, `/var/www/sites/tsa-monster/` has 25 pages
- VPS Tailscale IP: `100.89.11.76`, user: `daniel`
- Caddy topology: `/etc/caddy/Caddyfile` contains `import sites/*`; site confs go in `/etc/caddy/sites/`
- `sudo -n systemctl reload caddy` is NOPASSWD for daniel — no password required
- Cloudflare is in proxy mode for tsa.monster; DNS points to Cloudflare (not VPS directly)
- Caddy version: v2.11.2, running on ports 80 and 443

## Expected Output

- `/etc/caddy/sites/tsa.monster.conf` — new HTTP-only Caddy site block
- Caddy serving `tsa.monster` static files from `/var/www/sites/tsa-monster/`
- `https://tsa.monster` publicly accessible via Cloudflare proxy
- Root `https://tsa.monster/` redirects to `/en/` (client-side redirect from `dist/index.html`)
- Milestone M001 complete — tsa.monster is live and ready for Amazon Associates application
