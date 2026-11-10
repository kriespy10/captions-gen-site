// Historical order snapshots, kept separate from downloads/installations/usage.
// The private exporter deduplicates order identifiers; only daily counts enter KV.
export const LEMON_ORDERS_KEY = 'lemon:orders:snapshot:v1';
export const MAX_ORDER_SNAPSHOT_BYTES = 256 * 1024;
const PRODUCTS = Object.freeze([1317758, 1317759]);
const MAX_DAYS = 3660;
const DAY = 86400000;
const SOURCE = 'Lemon Squeezy orders';
const encoder = new TextEncoder();
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store', ...headers },
});
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
function keys(value, expected) {
  return object(value) && Object.keys(value).sort().join(',') === [...expected].sort().join(',');
}
function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value;
}
function instant(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}
function utcInstant(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);
}
const invalid = () => { throw new TypeError('Invalid aggregate order snapshot.'); };

export function normalizeLemonOrders(input, now = new Date()) {
  if (!keys(input, ['schema', 'exportAsOf', 'sourceSha256', 'productIds', 'coverage', 'daily']) || input.schema !== 1 ||
      !utcInstant(input.exportAsOf) || Date.parse(input.exportAsOf) > now.getTime() + 5 * 60000 ||
      typeof input.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(input.sourceSha256) ||
      !Array.isArray(input.productIds) || input.productIds.length !== PRODUCTS.length ||
      [...input.productIds].sort((a, b) => a - b).some((id, index) => id !== PRODUCTS[index]) ||
      !keys(input.coverage, ['from', 'through', 'complete']) || input.coverage.complete !== true ||
      !date(input.coverage.from) || !date(input.coverage.through) || input.coverage.from > input.coverage.through ||
      input.coverage.through !== input.exportAsOf.slice(0, 10) ||
      (Date.parse(input.coverage.through) - Date.parse(input.coverage.from)) / DAY >= MAX_DAYS ||
      !Array.isArray(input.daily) || input.daily.length > MAX_DAYS) invalid();
  const seen = new Set();
  let total = 0;
  const daily = input.daily.map(row => {
    if (!keys(row, ['date', 'orders']) || !date(row.date) || row.date < input.coverage.from || row.date > input.coverage.through ||
        seen.has(row.date) || !Number.isSafeInteger(row.orders) || row.orders < 0) invalid();
    seen.add(row.date); total += row.orders;
    if (!Number.isSafeInteger(total)) invalid();
    return { date: row.date, orders: row.orders };
  }).sort((a, b) => a.date.localeCompare(b.date));
  return { schema: 1, exportAsOf: new Date(input.exportAsOf).toISOString(), sourceSha256: input.sourceSha256.toLowerCase(),
    productIds: [...PRODUCTS], coverage: { from: input.coverage.from, through: input.coverage.through, complete: true }, daily };
}

async function sha(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
// Shared by the authenticated handler and the existing-authority administrative
// import tool. The caller supplies the actual import time; no credentials needed.
export async function createLemonOrderSnapshot(input, now = new Date()) {
  const data = normalizeLemonOrders(input, now);
  return { schema: 1, data, importedAt: now.toISOString(), snapshotHash: await sha(JSON.stringify(data)) };
}
async function authorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const [provided, expected] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(request.headers.get('authorization') || '')),
    crypto.subtle.digest('SHA-256', encoder.encode('Bearer ' + env.ADMIN_TOKEN)),
  ]);
  return crypto.subtle.timingSafeEqual(provided, expected);
}
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_ORDER_SNAPSHOT_BYTES) throw new RangeError('too large');
  const reader = request.body?.getReader();
  if (!reader) invalid();
  let length = 0, text = '';
  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_ORDER_SNAPSHOT_BYTES) { await reader.cancel(); throw new RangeError('too large'); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally { reader.releaseLock(); }
}
async function load(env, now) {
  const raw = await env.REPORTS.get(LEMON_ORDERS_KEY);
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'string' || encoder.encode(raw).length > MAX_ORDER_SNAPSHOT_BYTES + 4096) invalid();
  const saved = JSON.parse(raw);
  if (!keys(saved, ['schema', 'data', 'importedAt', 'snapshotHash']) || saved.schema !== 1 || !instant(saved.importedAt) ||
      typeof saved.snapshotHash !== 'string' || !/^[a-f0-9]{64}$/.test(saved.snapshotHash)) invalid();
  const data = normalizeLemonOrders(saved.data, now);
  if (await sha(JSON.stringify(data)) !== saved.snapshotHash) invalid();
  return { schema: 1, data, importedAt: saved.importedAt, snapshotHash: saved.snapshotHash };
}
function view(saved) {
  if (!saved) return { ok: true, schema: 1, source: SOURCE, available: false, snapshotAt: null, exportAsOf: null,
    importedAt: null, sourceSha256: null, snapshotHash: null, productIds: [...PRODUCTS], coverage: null, totalOrders: null, daily: [], monthly: [] };
  const data = saved.data;
  const monthly = new Map();
  let totalOrders = 0;
  for (const row of data.daily) {
    totalOrders += row.orders;
    const month = row.date.slice(0, 7);
    monthly.set(month, (monthly.get(month) || 0) + row.orders);
  }
  const previousDay = new Date(Date.parse(data.coverage.through + 'T00:00:00Z') - DAY).toISOString().slice(0, 10);
  return { ok: true, schema: 1, source: SOURCE, available: true, snapshotAt: data.exportAsOf,
    exportAsOf: data.exportAsOf, importedAt: saved.importedAt, sourceSha256: data.sourceSha256, snapshotHash: saved.snapshotHash,
    productIds: [...PRODUCTS], coverage: { ...data.coverage, completeThrough: previousDay >= data.coverage.from ? previousDay : null, timezone: 'UTC' },
    totalOrders, daily: data.daily, monthly: [...monthly].map(([month, orders]) => ({ month, orders })) };
}

export async function lemonOrders(request, env, url, now = new Date()) {
  const importing = url.pathname === '/api/lemon-orders/import';
  if (!importing && url.pathname !== '/api/lemon-orders') return null;
  try {
    if (!await authorized(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  } catch { return json({ ok: false, error: 'Order history is unavailable.' }, 503); }
  if (request.method !== (importing ? 'POST' : 'GET')) return json({ ok: false, error: 'method not allowed' }, 405, { allow: importing ? 'POST' : 'GET' });
  if (!env.REPORTS?.get || !env.REPORTS?.put) return json({ ok: false, error: 'Order history is unavailable.' }, 503);
  if (!importing) {
    try { return json(view(await load(env, now))); }
    catch { return json({ ok: false, error: 'Order history is unavailable.' }, 503); }
  }
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json'))
    return json({ ok: false, error: 'JSON is required.' }, 415);
  let data;
  try { data = normalizeLemonOrders(await readBody(request), now); }
  catch (error) { return json({ ok: false, error: error instanceof RangeError ? 'Snapshot is too large.' : 'Invalid aggregate order snapshot.' }, error instanceof RangeError ? 413 : 400); }
  try {
    const saved = await createLemonOrderSnapshot(data, now);
    const { snapshotHash } = saved;
    const previous = await load(env, now);
    if (previous?.snapshotHash === snapshotHash) return json({ ...view(previous), duplicate: true });
    if (previous?.data.sourceSha256 === data.sourceSha256)
      return json({ ok: false, error: 'Source export conflicts with the existing snapshot.' }, 409);
    if (previous && data.exportAsOf < previous.data.exportAsOf)
      return json({ ok: false, error: 'An older snapshot cannot replace newer order history.' }, 409);
    await env.REPORTS.put(LEMON_ORDERS_KEY, JSON.stringify(saved));
    return json({ ...view(saved), duplicate: false });
  } catch { return json({ ok: false, error: 'Order history import is unavailable.' }, 503); }
}
