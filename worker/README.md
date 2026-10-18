# Report backend (Cloudflare Worker)

Receives bug reports and feature requests sent from the Captions Gen panel
(Settings > Report a bug / Request a feature) at `https://captionsgen.com/api/report`.

## Deploy (once)

1. `cd worker && npx wrangler login`
2. `npx wrangler kv namespace create REPORTS` and paste the returned id into `wrangler.toml`.
3. `npx wrangler secret put ADMIN_TOKEN` (any long random string; used to read reports).
4. Optional: `npx wrangler secret put NOTIFY_WEBHOOK` (Discord/Slack webhook to be pinged per report).
5. `npx wrangler deploy`. The route in `wrangler.toml` needs captionsgen.com proxied
   by Cloudflare (orange cloud) instead of DNS only.

## Read reports

```
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://captionsgen.com/api/reports
```
