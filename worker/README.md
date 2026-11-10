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
to see the new-user growth chart and daily/monthly active users. Download counts and email CSV export stay below; anonymous boot signals and the old sales funnel are in **Detailed plugin stats**.
The same numbers as JSON: `curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://api.captionsgen.com/api/funnel`.

## Direct installer download counts

The funnel page also shows **Installer downloads**, read from the public GitHub release assets
in `kriespy10/captions-gen-site`. Only uploaded `CaptionsGen-Setup-X.Y.Z.exe` assets on published,
non-prerelease releases are included. Updates and other attachments are excluded. Counts can be
up to five minutes old; GitHub failures show unavailable rather than an invented zero.

These are download requests, including repeat downloads, not unique people, completed transfers
or installations. Earlier Lemon Squeezy downloads are not included. Downloads do not require
newsletter signup, cookies or Google Analytics consent. This endpoint stores no visitor data
and needs no GitHub token. It uses the existing dashboard admin authorization:

```
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://api.captionsgen.com/api/downloads
```

GitHub's [release API](https://docs.github.com/en/rest/releases/releases) supplies each asset's
`download_count`. Preserve published installer assets when adding releases so their counts remain available.

## Email sign-ups

`subscribe.js` stores sign-ups from the panel's "Get updates by email" sheet (`POST /api/subscribe`):
the address, when and where it signed up, the plugin version and the sign-up wording it agreed to.
No IP address is kept. The funnel page shows the count and a **Download CSV** button; every row has its
own unsubscribe link (`/api/unsubscribe?e=…&t=…`, an HMAC of the address keyed with `ADMIN_TOKEN`, or with
`SUBSCRIBE_SECRET` if set). Put that link in every email you send. Opening it shows an Unsubscribe button,
so mail scanners that open links can't unsubscribe anyone. Changing `ADMIN_TOKEN` breaks the old links,
so set `SUBSCRIBE_SECRET` first if you ever rotate it.

Tests: `node --test worker/worker.test.mjs`.

## Audience growth and activity history

The main dashboard chart uses retained opted-in device records, never anonymous boot pings.
**New users** bins each record's `firstSeen` once by UTC date and compares the last 7 or 30 days
with the immediately preceding period. These are measured devices that allowed stats, not
verified people or all users. Normal reinstalls retain the saved ID; clearing app data, using
a different Windows account, or opting out and back in can create a new ID. Opting out deletes
that ID's record and its history.

Qualified `panel_open`, `transcribe` and `captions_placed` events now record a set of UTC
`activityDays` on the same `u:` record, deduplicating multiple events that day. The first
qualified event stores `meta:activity-history-since` as an ISO timestamp. Its first partial day
cannot establish full-period coverage. Known first qualified-event dates can supply positive
observations, but no other historical activity is invented. Days before collection appear as
gaps in the activity chart, and previous-period comparisons say **Building activity history**
until a complete prior window exists.

Until a full current window is covered, active-user totals include the existing `lastSeen`
proxy and explicitly say **Estimated from last activity**. Once covered, the totals use only
qualified daily activity. Daily active users count each saved ID once today; monthly active
users count each ID once over the last 30 UTC dates, including partial today. A zero prior
baseline shows **First recorded activity**, without an infinite or invented percentage.
The chart includes a daily-data table for text and keyboard access.

Run `node --test worker/growth-chart.test.mjs worker/worker.test.mjs` for date-boundary,
coverage, activity deduplication, privacy, rendering and existing backend checks.
