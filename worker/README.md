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
4. `npx wrangler secret put RESEND_API_KEY` (a Resend API key; each report is then e-mailed to
   business@captionsgen.com. Change the address with the `MAIL_TO` var, the sender with `MAIL_FROM`.)
5. `npx wrangler deploy`

## Usage stats and the funnel page

`usage.js` (same Worker, same KV namespace) takes the plugin's opt-in usage stats:
`POST /api/usage` (random install ID + one funnel step, only after the user allowed stats in the panel),
`DELETE /api/usage/<id>` (sent when the user turns stats off) and `POST /api/ping` (ID-less daily
totals: first engine boot, engine running that day). No IP addresses are stored; every key expires after ~13 months.

Open https://api.captionsgen.com/funnel and paste the admin token once (it stays in that browser)
to see installs, opted-in installs per step, and who placed captions without buying.
The same numbers as JSON: `curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://api.captionsgen.com/api/funnel`.
