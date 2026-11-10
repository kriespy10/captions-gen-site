# Report backend (Cloudflare Worker)

## Imported Lemon Squeezy order history

`lemon-orders.mjs` adds separate authenticated `GET /api/lemon-orders` and
`POST /api/lemon-orders/import` routes using the existing `ADMIN_TOKEN`. The private
export normalizer deduplicates order identifiers and verifies the Live/all-time
export and UI-attested scope of the two known products. Only aggregate daily counts enter
the Worker; orders are not downloads, installs, opted-in users or conversion cohorts.

The import accepts exactly `{schema:1,exportAsOf,sourceSha256,productIds,coverage,daily}`.
`exportAsOf` is a UTC ISO timestamp ending in Z, attested from the export operation
and canonicalized by the server;
`productIds` is exactly `[1317758,1317759]`; `coverage` is `{from,through,complete:true}`
with inclusive UTC dates and `through` equal to the export date; `daily` contains
unique `{date,orders}` rows with nonnegative integer counts. Extra/PII/status/money
fields, unsafe totals, invalid dates and over-256-KiB bodies are rejected. History
is limited to 3,660 calendar days per snapshot. The CSV's `date_utc` defines dates;
no absent paid/refund/test-mode columns are inferred.

One awaited write replaces `REPORTS["lemon:orders:snapshot:v1"]` with the complete
validated snapshot and its server import timestamp/canonical SHA-256. Identical
canonical imports are no-ops; conflicting data for the same source-export SHA or
an older cutoff returns 409. Other KV keys and all D1 measurements are untouched.
Back up this key before replacement. This is a manually refreshed historical
snapshot, without Lemon API keys, webhooks or automatic synchronization. KV can
serve the previous whole snapshot during propagation; verify the returned hash
after propagation and serialize administrative imports.

An administrative tool using existing Cloudflare authority can call exported
`normalizeLemonOrders(payload, now)` and `await createLemonOrderSnapshot(payload, now)`
offline to build the exact same stored envelope without reading an admin token.
After verifying source SHA, scope and total against the private normalization
review, write only the dedicated key and verify exact readback after propagation.

The read response supplies `available`, source/snapshot/import timestamps,
coverage, `totalOrders`, sorted daily rows and derived monthly sums. The current
export day is partial: `completeThrough` is its previous UTC day, or null if the
range starts today. Missing dates inside complete coverage are zeros; dates
outside coverage are unknown. Missing import returns `available:false` and a
null total; storage/corrupt-data errors return 503. No existing metric is backfilled.
Local checks: `node --test worker/lemon-orders.test.mjs`.

## Distribution counts and opted-in sessions

`measurements.mjs` uses the separate EU D1 database **captions-gen-metrics** (`METRICS`).
The existing `REPORTS` KV binding, reports, subscriber records and routes are retained.
Apply schema changes with the pinned Wrangler version and `d1 migrations apply METRICS --remote`.
No production fixtures are needed. Tests use the actual migration and SQL against local SQLite:
`node --test worker/measurements.test.mjs` (Node 22.18 or newer with `node:sqlite`).

- `GET /api/download/windows` redirects to the released 1.1.11 full Windows Setup. It counts
  download **requests**, including repeats, without storing IPs, email, query strings or a browser ID.
  HEAD and speculative prefetch/prerender requests are excluded. Counter/database failure never
  blocks the redirect. A redirect request does not prove a completed transfer or installation.
- With `DOWNLOAD_BROWSER_COUNTS="true"`, a first-party, Secure, HttpOnly, SameSite=Lax cookie,
  `cg_download_counts=YYYY-MM-DD.YYYY-MM`, marks whether that browser already downloaded on the
  current UTC day and calendar month. It contains only those dates and lasts 35 days. Daily and
  calendar-month browser estimates are incremented independently; monthly uniques are never a sum
  of daily uniques. Cleared/blocked cookies, different browsers and concurrent first requests can
  inflate estimates. These are approximate browsers, not unique people or computers.
- `GET /api/download-counting` shows the current browser-count preference. Its POST form accepts
  only `choice=on` or `choice=off`, sets the separate `cg_download_counting` preference for 35 days,
  and returns to the fixed website privacy section. Off clears the date marker and stops browser
  estimates while preserving aggregate request counts. This is separate from Google Analytics and
  the plugin's usage-statistics consent. Browser estimates are enabled after publication of
  the reviewed privacy text and opt-out control.
- `POST /api/install-registration` accepts only a one-off random `receiptId` UUID and `occurredAt`
  UTC timestamp for a successful first-install registration. A receipt insert plus SQL trigger
  increments daily/monthly registration totals atomically once, including retries. It is never
  joined to a usage ID. Reinstalls are deduplicated by the client's retained local receipt; deleting
  app data or another Windows account can register again. This measures observed registrations,
  not every installer execution or unique people.
- `POST /api/session` accepts `{id,sessionId,startedAt,v,os}` from the new client only after explicit
  usage opt-in. An existing `u:<id>` record is required. D1 stores only session UUID, opted-in ID,
  UTC start/date/month and expiry; version and OS are not stored here. Session retries deduplicate
  atomically. A month counts each opted-in ID once, separately from session totals and DAU.
- Existing `DELETE /api/usage/<id>` atomically records a SHA-256 hash of the random opted-in ID
  and deletes its D1 sessions, then removes the KV usage record. The hash suppresses delayed
  posts for 90 days and is not used for counts or identification. Session inserts check it in
  the same SQL transaction; legacy KV writes check it both before and after writing and remove
  a late write. Transient hashed write-coordination records stop deletion being acknowledged
  while an earlier KV write is still in flight; they are removed when that request finishes,
  with a fifteen-minute expiry for interrupted requests. Audience summaries exclude revoked records even if KV temporarily returns a
  stale copy. D1/KV cleanup failure returns 503 so the client retries deletion rather than claim
  success. Turning off usage does not link or remove independent one-off installation receipts.
- `GET /api/measurements` requires the existing admin bearer token. It returns `coverage` timestamps,
  observed `daily` and `monthly` rows, independent request/browser/registration/session/active-ID
  metrics, and no receipt IDs or opted-in IDs. Unavailable data returns 503, never fabricated zeros.

Receipts expire after 90 days. Events older than 90 days or over five minutes in the future are
rejected. Daily/session history and aggregate month rows expire no later than 400 days after the
relevant period begins; the oldest month can therefore disappear before its last daily rows.
Expired records are pruned on measurement requests. Historical downloads, anonymous boot pings
and old daily activity events are not backfilled into these metrics.

The regular 1.1.10 release enabled `MEASUREMENT_CLIENT_RELEASED="true"`; keep that flag enabled
for 1.1.11. The false value shows install/session metrics as
awaiting a plugin update; deploying the backend alone does not make older plugins send new events. Successful event
responses are `{ok:true,duplicate:boolean}`; invalid bodies return 400, missing session consent
403, and unavailable storage 503. No new public client secret or hardware fingerprint is used.

Receives bug reports and feature requests sent from the Captions Gen panel
(Settings > Report a bug / Request a feature) at `https://api.captionsgen.com/api/report`.
Deployed 2026-10-18 as the Worker `captions-gen-reports` with a KV namespace `REPORTS`.
It lives on its own subdomain, so the main site on GitHub Pages is untouched.

## Read reports

```
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://api.captionsgen.com/api/reports
```

New reports can take up to a minute to show in that list (KV is eventually consistent).

Bug-report emails include the exact engine-log excerpt retained with the report, up to 20,000
characters. The email does not apply a second, shorter cutoff, so diagnostic JSON near the
beginning or middle of the retained excerpt remains intact. This is a recent stored excerpt,
not the complete service log. The existing 40,000-character request limit, 20,000-character
storage limit, sender-side redaction and report rate limits remain unchanged. Feature requests
do not include an engine log. Tests inject the Resend transport and use synthetic diagnostics;
they send no real email and use no customer report data.

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
to see separate download, installation-registration and opt-in session measurements. Daily and calendar-month browser estimates and opted-in active users have separate totals. Old boot signals, GitHub asset totals and the earlier funnel are under **Legacy measurements**. Email CSV export remains available below.
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

## Dashboard coverage and legacy history

The primary chart offers **Download requests**, **Install registrations** and **Sessions (opt-in)**,
with 7- or 30-day comparisons. Each measurement starts at its own coverage timestamp. Dates before
coverage and an incomplete first collection day remain chart gaps. Prior-period percentages stay
unavailable until a complete comparison period exists. Missing APIs show unavailable, not zero.
The daily table exposes the same observations, including positive but incomplete offline history.

Calendar-month browser estimates and active users come directly from monthly aggregates; they
are never calculated by adding daily unique counts. Today's and this month's totals are partial.
The unreleased-client flag suppresses install/session totals until the matching plugin ships.

**Legacy measurements** preserves the earlier `c:DATE:install` first-engine-start signals and
the opted-in usage funnel. Those signals can be sent before the old usage prompt is answered,
but choosing No beforehand prevents them. They are approximate and incomplete; the 24 signals
on 9 November UTC are not evidence of 24 completed installer runs or 24 opted-in users.

Legacy active-user estimates use retained opted-in IDs and qualified activity dates, falling
back to last activity where historical coverage is incomplete. They cover an opted-in sample,
not total audience MAU. No historical checkouts, asset requests or boot signals are backfilled
into the new measurements.

Run `node --test worker/growth-chart.test.mjs worker/worker.test.mjs worker/measurements.test.mjs worker/dashboard-browser.test.mjs`.
Also execute `assertDashboardRenders()` against HTML generated from the actual Wrangler bundle;
source-only checks cannot catch missing runtime helpers in serialized client functions.
