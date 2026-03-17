---
estimated_steps: 3
estimated_files: 1
---

# T01: One-time VPS setup + rsync dist/ to server

**Slice:** S04 — Build + deploy
**Milestone:** M001

## Description

Two prerequisites must be in place before T02 can write the Caddy site block and reload:

1. `/etc/caddy/sites/` must exist and be owned by `daniel` — this requires one interactive `sudo` command that the user runs manually (the agent has `NOPASSWD` only for `systemctl reload caddy`, not for `mkdir` or `chown`).
2. `dist/` (25 pages, ~3.4MB) must be transferred to `/var/www/sites/tsa-monster/` on the VPS.

The VPS is accessible via Tailscale at `daniel@100.89.11.76`. `rsync` is available on both ends. `/var/www/sites/tsa-monster/` already exists and is daniel-owned. SSH host key for the Tailscale IP may not be in `known_hosts` yet — use `-o StrictHostKeyChecking=accept-new` on the first connection.

## Steps

1. **Ask the user to run the one-time setup command.** Present the exact command to run in an interactive SSH session:
   ```bash
   ssh daniel@100.89.11.76 'sudo mkdir -p /etc/caddy/sites && sudo chown daniel:daniel /etc/caddy/sites'
   ```
   Wait for the user to confirm they've run it before proceeding. (This requires their sudo password — the agent cannot run it non-interactively.)

2. **Verify the sites directory exists and is daniel-owned:**
   ```bash
   ssh -o StrictHostKeyChecking=accept-new daniel@100.89.11.76 'ls -la /etc/caddy/ | grep sites'
   ```
   Expect output like: `drwxr-xr-x 2 daniel daniel 4096 ... sites`

3. **rsync dist/ to the VPS** (trailing slash on source copies contents, not the directory itself):
   ```bash
   rsync -av --delete -e 'ssh -o StrictHostKeyChecking=accept-new' \
     dist/ daniel@100.89.11.76:/var/www/sites/tsa-monster/
   ```

4. **Verify file count on VPS:**
   ```bash
   ssh daniel@100.89.11.76 'find /var/www/sites/tsa-monster -name "index.html" | wc -l'
   ```
   Expect: `25`

5. **Spot-check key files:**
   ```bash
   ssh daniel@100.89.11.76 'ls /var/www/sites/tsa-monster/en/index.html \
     /var/www/sites/tsa-monster/sitemap-0.xml \
     /var/www/sites/tsa-monster/en/kitchen/best-coffee-makers/index.html'
   ```
   All three paths should print without error.

## Must-Haves

- [ ] `/etc/caddy/sites/` exists on VPS and is owned by `daniel:daniel`
- [ ] `dist/` contents transferred — exactly 25 `index.html` files at `/var/www/sites/tsa-monster/`
- [ ] `sitemap-0.xml` present at `/var/www/sites/tsa-monster/sitemap-0.xml`

## Verification

```bash
# Confirm sites dir is daniel-owned
ssh daniel@100.89.11.76 'stat -c "%U:%G %n" /etc/caddy/sites'
# expect: daniel:daniel /etc/caddy/sites

# Confirm file count
ssh daniel@100.89.11.76 'find /var/www/sites/tsa-monster -name "index.html" | wc -l'
# expect: 25

# Confirm sitemap transferred
ssh daniel@100.89.11.76 'test -f /var/www/sites/tsa-monster/sitemap-0.xml && echo "ok"'
# expect: ok
```

## Inputs

- `dist/` (local, `/home/daniel/tsa.monster/dist/`) — the 25-page static build produced by S01–S03. Already confirmed clean via `pnpm build` (25 pages, 0 errors, sitemap-0.xml present).
- VPS Tailscale IP: `100.89.11.76`, user: `daniel`
- VPS deploy target: `/var/www/sites/tsa-monster/` (already exists, daniel-owned)
- Constraint: `/etc/caddy/sites/` does not exist yet — requires one-time user-interactive sudo to create

## Observability Impact

- **New inspectable state:** `/etc/caddy/sites/` directory exists on VPS — `stat -c "%U:%G %n" /etc/caddy/sites` returns `daniel:daniel /etc/caddy/sites`; absence means T01 is incomplete and T02 will fail on file-write
- **File presence signal:** `find /var/www/sites/tsa-monster -name "index.html" | wc -l` returns 25 after transfer; fewer means rsync was partial (check rsync exit code and network connectivity to Tailscale IP)
- **Drift detection:** `rsync -avn --delete dist/ daniel@100.89.11.76:/var/www/sites/tsa-monster/` dry-run produces empty output when in sync; any listed files indicate a stale or partial transfer
- **Failure path:** If rsync times out or Tailscale is not connected, SSH will hang — verify `tailscale status` locally before retrying

## Expected Output

- `/etc/caddy/sites/` exists on VPS, owned by `daniel:daniel` (enables T02 to write site conf without sudo)
- `/var/www/sites/tsa-monster/` populated with all 25 routes from `dist/`
- T02 can proceed: both prerequisites are in place
