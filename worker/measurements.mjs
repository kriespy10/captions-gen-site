// Separate aggregate distribution counts from explicitly opted-in session history.
// Never store IPs, cookies, email, hardware IDs, filenames or project contents here.
export const INSTALLER_URL = 'https://github.com/kriespy10/captions-gen-site/releases/download/v1.1.9/CaptionsGen-Setup-1.1.9.exe';
const DAY = 86400000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const DAILY = `INSERT INTO measurement_daily(date,download_requests,download_browsers,expires_at) VALUES(?,?,?,?)
  ON CONFLICT(date) DO UPDATE SET download_requests=download_requests+excluded.download_requests,download_browsers=download_browsers+excluded.download_browsers`;
const MONTHLY = `INSERT INTO measurement_monthly(month,download_requests,download_browsers,expires_at) VALUES(?,?,?,?)
  ON CONFLICT(month) DO UPDATE SET download_requests=download_requests+excluded.download_requests,download_browsers=download_browsers+excluded.download_browsers`;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' },
});
const statement = (db, sql, ...values) => db.prepare(sql).bind(...values);
const metadata = (db, name, at) => statement(db, 'INSERT OR IGNORE INTO measurement_meta(name,started_at) VALUES(?,?)', name, at);
const enabled = (value) => value === 'true';
const cookieSuffix = '; Path=/api/; Max-Age=3024000; Secure; HttpOnly; SameSite=Lax';
const cookie = (request, name) => (request.headers.get('cookie') || '').split(';').map(value => value.trim())
  .find(value => value.startsWith(name + '='))?.slice(name.length + 1) || '';

export async function usageRevocationHash(id) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('captions-gen-usage-revocation:' + id.toLowerCase()));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
}

// D1 queries outside a read-replica session use the primary. These checks must
// not be switched to an unconstrained replica or KV's eventually consistent data.
export async function usageRevoked(env, id, now = new Date()) {
  if (!env.METRICS) return false;
  const hash = await usageRevocationHash(id);
  const result = await statement(env.METRICS,
    'SELECT subject_hash FROM usage_revocations WHERE subject_hash=? AND expires_at>?', hash, Math.floor(now.getTime()/1000)).run();
  return result.results.length > 0;
}

export async function beginUsageWrite(env, id, now = new Date()) {
  if (!env.METRICS) return { token:null, revoked:false };
  const hash=await usageRevocationHash(id), token=crypto.randomUUID(), seconds=Math.floor(now.getTime()/1000);
  const results=await env.METRICS.batch([
    statement(env.METRICS, `INSERT INTO usage_write_leases(lease_id,subject_hash,expires_at)
      SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM usage_revocations WHERE subject_hash=? AND expires_at>?)`,
      token,hash,seconds+900,hash,seconds),
    statement(env.METRICS,'SELECT EXISTS(SELECT 1 FROM usage_revocations WHERE subject_hash=? AND expires_at>?) AS revoked',hash,seconds),
  ]);
  return { token:results[0].meta.changes ? token : null, revoked:!!results[1].results[0].revoked };
}

export async function endUsageWrite(env, lease) {
  if (env.METRICS && lease?.token)
    await statement(env.METRICS,'DELETE FROM usage_write_leases WHERE lease_id=?',lease.token).run();
}

export async function revokedUsageIds(env, ids, now = new Date()) {
  if (!env.METRICS || !ids.length) return new Set();
  const result = await statement(env.METRICS, 'SELECT subject_hash FROM usage_revocations WHERE expires_at>?', Math.floor(now.getTime()/1000)).run();
  const hashes = new Set(result.results.map(row => row.subject_hash));
  const revoked = new Set();
  await Promise.all(ids.map(async id => { if (hashes.has(await usageRevocationHash(id))) revoked.add(id); }));
  return revoked;
}

export function downloadMarkers(request, now = new Date()) {
  const date = now.toISOString().slice(0, 10), month = date.slice(0, 7);
  const saved = cookie(request, 'cg_download_counts');
  const match = /^(\d{4}-\d{2}-\d{2})\.(\d{4}-\d{2})$/.exec(saved);
  return { date, month, dayNew: !match || match[1] !== date, monthNew: !match || match[2] !== month,
    optedOut: cookie(request, 'cg_download_counting') === 'off', value: date + '.' + month };
}

async function prune(db, now) {
  const seconds = Math.floor(now.getTime() / 1000);
  await db.batch(['installation_receipts','measured_sessions','measurement_daily','measurement_monthly','usage_revocations','usage_write_leases'].map(table =>
    statement(db, `DELETE FROM ${table} WHERE expires_at <= ?`, seconds)));
}

async function download(request, env, now) {
  const headers = new Headers({ location: INSTALLER_URL, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' });
  // HEAD requests and speculative browser fetches do not represent a download action.
  const purpose = [request.headers.get('purpose'), request.headers.get('sec-purpose')].join(' ');
  if (request.method === 'HEAD' || /prefetch|prerender/i.test(purpose)) return new Response(null, { status: 302, headers });
  const marker = downloadMarkers(request, now);
  const browserCounts = enabled(env.DOWNLOAD_BROWSER_COUNTS) && !marker.optedOut;
  try {
    if (!env.METRICS) throw new Error('unconfigured');
    const db = env.METRICS;
    const expiry = (date) => Math.floor((Date.parse(date + 'T00:00:00Z') + 400 * DAY) / 1000);
    const writes = [
      statement(db, DAILY, marker.date, 1, Number(browserCounts && marker.dayNew), expiry(marker.date)),
      statement(db, MONTHLY, marker.month, 1, Number(browserCounts && marker.monthNew), expiry(marker.month + '-01')),
      metadata(db, 'downloadsSince', now.toISOString()),
    ];
    if (browserCounts) writes.push(metadata(db, 'browserDownloadsSince', now.toISOString()));
    await db.batch(writes);
    if (browserCounts) headers.append('set-cookie', 'cg_download_counts=' + marker.value + cookieSuffix);
    await prune(db, now);
  } catch {
    // A counter outage must never prevent the free installer download.
  }
  if (marker.optedOut) headers.append('set-cookie', 'cg_download_counts=; Path=/api/; Max-Age=0; Secure; HttpOnly; SameSite=Lax');
  return new Response(null, { status: 302, headers });
}

async function countingPreference(request) {
  if (request.method === 'POST') {
    const text = await request.text();
    if (text.length > 200) return json({ ok: false, error: 'invalid choice' }, 400);
    const choice = new URLSearchParams(text).get('choice');
    if (!['on', 'off'].includes(choice)) return json({ ok: false, error: 'invalid choice' }, 400);
    const headers = new Headers({ location: 'https://captionsgen.com/privacy.html#download-counts', 'cache-control': 'no-store' });
    headers.append('set-cookie', 'cg_download_counting=' + choice + cookieSuffix);
    if (choice === 'off') headers.append('set-cookie', 'cg_download_counts=; Path=/api/; Max-Age=0; Secure; HttpOnly; SameSite=Lax');
    return new Response(null, { status: 303, headers });
  }
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405);
  const off = cookie(request, 'cg_download_counting') === 'off';
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Download counting preference</title><main><h1>Download counting</h1><p>Browser estimates are currently ' + (off ? 'off' : 'allowed when enabled on this site') + '.</p><p>This choice is separate from Google Analytics and plugin usage statistics. Request totals contain no browser identifier.</p><form method="post"><button name="choice" value="off">Turn browser estimates off</button> <button name="choice" value="on">Allow browser estimates</button></form><p><a href="https://captionsgen.com/privacy.html#download-counts">Privacy details</a></p></main></html>', {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'content-security-policy': "default-src 'none'; form-action 'self'; base-uri 'none'", 'referrer-policy': 'no-referrer' },
  });
}

async function payload(request) {
  const text = await request.text();
  if (text.length > 2000) return null;
  try { const data = JSON.parse(text); return data && typeof data === 'object' && !Array.isArray(data) ? data : null; }
  catch { return null; }
}

function timestamp(value, now) {
  if (typeof value !== 'string' || !UTC.test(value)) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed) || parsed > now.getTime() + 5 * 60000 || parsed < now.getTime() - 90 * DAY) return null;
  const canonical = new Date(parsed).toISOString();
  if (canonical.slice(0,19) !== value.slice(0,19)) return null;
  return canonical;
}

async function registerInstall(request, env, now) {
  const body = await payload(request);
  const occurredAt = timestamp(body?.occurredAt, now);
  if (!body || typeof body.receiptId !== 'string' || !UUID.test(body.receiptId) || !occurredAt) return json({ ok: false, error: 'invalid install receipt' }, 400);
  if (!env.METRICS) return json({ ok: false, error: 'measurements unavailable' }, 503);
  try {
    const result = await statement(env.METRICS,
      'INSERT OR IGNORE INTO installation_receipts(receipt_id,occurred_at,received_at,expires_at) VALUES(?,?,?,?)',
      body.receiptId.toLowerCase(), occurredAt, now.toISOString(), Math.floor(now.getTime()/1000) + 90 * 86400).run();
    await prune(env.METRICS, now);
    return json({ ok: true, duplicate: result.meta.changes === 0 });
  } catch { return json({ ok: false, error: 'measurements unavailable' }, 503); }
}

async function registerSession(request, env, now) {
  const body = await payload(request);
  const startedAt = timestamp(body?.startedAt, now);
  if (!body || typeof body.id !== 'string' || typeof body.sessionId !== 'string' || !UUID.test(body.id) || !UUID.test(body.sessionId) || !startedAt)
    return json({ ok: false, error: 'invalid session' }, 400);
  try {
    const id = body.id.toLowerCase();
    if (!await env.REPORTS.get('u:' + id)) return json({ ok: false, error: 'usage consent required' }, 403);
    if (!env.METRICS) return json({ ok: false, error: 'measurements unavailable' }, 503);
    const hash = await usageRevocationHash(id);
    const seconds = Math.floor(now.getTime()/1000);
    const results = await env.METRICS.batch([
      statement(env.METRICS, `INSERT OR IGNORE INTO measured_sessions(session_id,subject_id,started_at,date,month,expires_at)
        SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM usage_revocations WHERE subject_hash=? AND expires_at>?)`,
        body.sessionId.toLowerCase(), id, startedAt, startedAt.slice(0,10), startedAt.slice(0,7), Math.floor(Date.parse(startedAt)/1000) + 400 * 86400, hash, seconds),
      statement(env.METRICS, `INSERT OR IGNORE INTO measurement_meta(name,started_at)
        SELECT 'sessionsSince',? WHERE NOT EXISTS(SELECT 1 FROM usage_revocations WHERE subject_hash=? AND expires_at>?)`,
        now.toISOString(), hash, seconds),
      statement(env.METRICS, 'SELECT EXISTS(SELECT 1 FROM usage_revocations WHERE subject_hash=? AND expires_at>?) AS revoked',hash,seconds),
    ]);
    if (results[2].results[0].revoked) return json({ ok:false,error:'usage consent was revoked' },403);
    await prune(env.METRICS, now);
    return json({ ok: true, duplicate: results[0].meta.changes === 0 });
  } catch { return json({ ok: false, error: 'measurements unavailable' }, 503); }
}

async function summary(request, env, now) {
  if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== 'Bearer ' + env.ADMIN_TOKEN)
    return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.METRICS) return json({ ok: false, error: 'measurements unavailable' }, 503);
  try {
    const db = env.METRICS;
    await prune(db, now);
    const [meta, daily, monthly, sessionsDaily, sessionsMonthly] = await db.batch([
      db.prepare('SELECT name,started_at FROM measurement_meta'),
      db.prepare('SELECT * FROM measurement_daily ORDER BY date'),
      db.prepare('SELECT * FROM measurement_monthly ORDER BY month'),
      db.prepare('SELECT date,COUNT(*) AS session_count,COUNT(DISTINCT subject_id) AS active_devices FROM measured_sessions GROUP BY date ORDER BY date'),
      db.prepare('SELECT month,COUNT(*) AS session_count,COUNT(DISTINCT subject_id) AS active_devices FROM measured_sessions GROUP BY month ORDER BY month'),
    ]);
    const starts = Object.fromEntries(meta.results.map(row => [row.name,row.started_at]));
    const browserEnabled = enabled(env.DOWNLOAD_BROWSER_COUNTS);
    const combine = (rows, sessions, key) => {
      const values = new Map();
      for (const row of rows.results) values.set(row[key], { [key]:row[key], downloadRequests:row.download_requests, uniqueDownloadBrowsers:null, uniqueInstalls:row.installs, sessionCount:0, activeDevices:0 });
      for (const row of sessions.results) {
        const value = values.get(row[key]) || { [key]:row[key], downloadRequests:0, uniqueDownloadBrowsers:null, uniqueInstalls:0 };
        values.set(row[key], { ...value, sessionCount:row.session_count, activeDevices:row.active_devices });
      }
      for (const row of rows.results) {
        if (browserEnabled && starts.browserDownloadsSince && row[key] >= starts.browserDownloadsSince.slice(0,key === 'date' ? 10 : 7))
          values.get(row[key]).uniqueDownloadBrowsers = row.download_browsers;
      }
      return [...values.values()].sort((a,b) => a[key].localeCompare(b[key]));
    };
    return json({ ok:true, asOf:now.toISOString(), coverage:{
      downloadsSince:starts.downloadsSince || null, browserDownloadsSince:starts.browserDownloadsSince || null,
      installsSince:starts.installsSince || null, sessionsSince:starts.sessionsSince || null,
      browserCountingEnabled:browserEnabled, clientUpdateRequired:!enabled(env.MEASUREMENT_CLIENT_RELEASED),
    }, daily:combine(daily,sessionsDaily,'date'), monthly:combine(monthly,sessionsMonthly,'month') });
  } catch { return json({ ok:false, error:'measurements unavailable' },503); }
}

export async function measurements(request, env, url, now = new Date()) {
  if (url.pathname === '/api/download/windows' && ['GET','HEAD'].includes(request.method)) return download(request,env,now);
  if (url.pathname === '/api/download-counting') return countingPreference(request);
  if (url.pathname === '/api/install-registration' && request.method === 'POST') return registerInstall(request,env,now);
  if (url.pathname === '/api/session' && request.method === 'POST') return registerSession(request,env,now);
  if (url.pathname === '/api/measurements' && request.method === 'GET') return summary(request,env,now);
  const deletion = /^\/api\/usage\/([0-9a-f-]{36})$/.exec(url.pathname);
  if (deletion && request.method === 'DELETE' && env.METRICS) {
    try {
      const hash = await usageRevocationHash(deletion[1]);
      // One atomic transaction: a session insert either precedes this and is
      // deleted, or follows this and its INSERT...SELECT revocation gate fails.
      const results=await env.METRICS.batch([
        statement(env.METRICS, `INSERT INTO usage_revocations(subject_hash,revoked_at,expires_at) VALUES(?,?,?)
          ON CONFLICT(subject_hash) DO UPDATE SET expires_at=MAX(expires_at,excluded.expires_at)`,
          hash,now.toISOString(),Math.floor(now.getTime()/1000)+90*86400),
        statement(env.METRICS,'DELETE FROM measured_sessions WHERE subject_id = ?',deletion[1]),
        statement(env.METRICS,'SELECT COUNT(*) AS writers FROM usage_write_leases WHERE subject_hash=? AND expires_at>?',
          hash,Math.floor(now.getTime()/1000)),
      ]);
      await env.REPORTS.delete('u:'+deletion[1]);
      if (results[2].results[0].writers)
        return json({ok:false,error:'Usage deletion is waiting for an in-flight event. Retry deletion.'},503);
      return json({ok:true});
    }
    catch { return json({ ok:false,error:'Could not remove session history. Retry deletion.' },503); }
  }
  return null;
}
