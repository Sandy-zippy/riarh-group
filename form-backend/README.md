# Riarh Group — contact form backend

The site is static (GitHub Pages), so form submissions route through our own infra
(no third-party form service, no submission cap):

```
website form  ──POST──▶  VPS lead receiver (HTTPS)  ──pulled by──▶  gws poller (Mac)  ──▶  email info@riarhgroup.com + Google Sheet log
```

- **server.js** — Node lead receiver on the ZippyScale VPS (62.72.13.155).
  Runs as systemd `riarh-leads` on 127.0.0.1:8787, fronted by Caddy with
  auto-HTTPS at `https://62-72-13-155.nip.io/riarh-lead`. Buffers leads to
  `/var/lib/riarh/leads.jsonl`; serves `/pending` (header `X-Auth: <secret>`).
- **notifier.py** — gws-CLI poller on the Mac (launchd `com.zippyscale.riarh-notifier`,
  every 2 min). Pulls new leads, emails info@riarhgroup.com (BCC sandy@, Reply-To = lead),
  appends to the "Leads" Google Sheet. Config + secret in `~/.riarh-notifier/`.

Secrets live in the VPS systemd env and `~/.riarh-notifier/secret` — never in this repo.
