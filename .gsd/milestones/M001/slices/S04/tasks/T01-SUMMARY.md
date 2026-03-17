---
id: T01
parent: S04
milestone: M001
provides:
  - dist/ contents transferred to /var/www/sites/tsa-monster/ (25 index.html files)
  - /etc/caddy/sites/ directory created and daniel-owned (via user interactive sudo)
key_files:
  - /var/www/sites/tsa-monster/ (populated on VPS)
key_decisions:
  - rsync run locally (no SSH) — working directory IS the VPS, no remote hop needed
  - /etc/caddy/sites/ mkdir/chown required interactive sudo (use_pty default blocks non-interactive sudo for this command); user ran it manually
patterns_established:
  - none
observability_surfaces:
  - find /var/www/sites/tsa-monster -name "index.html" | wc -l → 25 (drift detection)
  - rsync -avn --delete dist/ /var/www/sites/tsa-monster/ → empty output when in sync
  - stat -c "%U:%G %n" /etc/caddy/sites → daniel:daniel /etc/caddy/sites
duration: 10m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: One-time VPS setup + rsync dist/ to server

**rsync'd 25 pages (3.3MB) to /var/www/sites/tsa-monster/ and created /etc/caddy/sites/ owned by daniel — both T02 prerequisites satisfied.**

## What Happened

The working directory is `/home/daniel/tsa.monster` on the VPS itself — no SSH hop needed. `rsync` ran locally against `/var/www/sites/tsa-monster/` (already daniel-owned, pre-existing).

The `/etc/caddy/sites/` directory required interactive sudo. The agent cannot run non-interactive sudo for `mkdir`/`chown` because `use_pty` is set as a default in sudoers and only `systemctl reload caddy` and `nanoclaw-ctl` have `NOPASSWD` exceptions. The user ran the one-time command manually:

```bash
sudo mkdir -p /etc/caddy/sites && sudo chown daniel:daniel /etc/caddy/sites
```

After that, both prerequisites were confirmed in place.

## Verification

```
# File count
find /var/www/sites/tsa-monster -name "index.html" | wc -l
→ 25 ✓

# Spot-check key files
ls /var/www/sites/tsa-monster/en/index.html
ls /var/www/sites/tsa-monster/sitemap-0.xml
ls /var/www/sites/tsa-monster/en/kitchen/best-coffee-makers/index.html
→ all three present ✓

# Sitemap
test -f /var/www/sites/tsa-monster/sitemap-0.xml && echo "ok"
→ ok ✓

# sites/ dir ownership
stat -c "%U:%G %n" /etc/caddy/sites
→ daniel:daniel /etc/caddy/sites ✓
```

## Diagnostics

- `find /var/www/sites/tsa-monster -name "index.html" | wc -l` → expect 25; fewer = partial transfer, re-run rsync
- `rsync -avn --delete dist/ /var/www/sites/tsa-monster/` → dry-run; empty output = in sync, listed files = drift
- `stat -c "%U:%G %n" /etc/caddy/sites` → expect `daniel:daniel /etc/caddy/sites`; missing = T02 will fail to write conf

## Deviations

- No SSH required — the agent runs directly on the VPS. rsync was a local copy, not a remote transfer.
- The plan described asking the user to run the sudo command via SSH; instead, it was run directly in a terminal on the VPS.

## Known Issues

None.

## Files Created/Modified

- `/var/www/sites/tsa-monster/` — populated with all 25 routes from dist/ (3.3MB, 25 index.html files + assets)
- `/etc/caddy/sites/` — directory created, owned daniel:daniel (enables T02 to write conf without sudo)
