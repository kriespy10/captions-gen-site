# Report backend (Cloudflare Worker)

Receives bug reports and feature requests sent from the Captions Gen panel
(Settings > Report a bug / Request a feature) at `https://api.captionsgen.com/api/report`.
Deployed 2026-10-18 as the Worker `captions-gen-reports` with a KV namespace `REPORTS`.
It lives on its own subdomain, so the main site on GitHub Pages is untouched.

## Read reports

```
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://api.captionsgen.com/api/reports
```

New reports can take up to a minute to show in that list (KV is eventually consistent).

## Redeploy / set up again

1. `cd worker && npx wrangler login`
2. `npx wrangler kv namespace create REPORTS` and paste the id into `wrangler.toml` (only if the namespace is gone).
3. `npx wrangler secret put ADMIN_TOKEN` (any long random string).
4. Optional: `npx wrangler secret put NOTIFY_WEBHOOK` (Discord/Slack webhook pinged per report).
5. `npx wrangler deploy`
