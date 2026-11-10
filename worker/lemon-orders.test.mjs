import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timingSafeEqual } from 'node:crypto';
import { lemonOrders, normalizeLemonOrders, createLemonOrderSnapshot, LEMON_ORDERS_KEY, MAX_ORDER_SNAPSHOT_BYTES } from './lemon-orders.mjs';
import worker from './report-worker.js';

// Cloudflare's documented Web Crypto extension; use Node's real constant-time
// primitive for the same fixed-size hash comparison in these local tests.
if (!crypto.subtle.timingSafeEqual) Object.defineProperty(crypto.subtle, 'timingSafeEqual', {
  value: (a, b) => timingSafeEqual(Buffer.from(a), Buffer.from(b)), configurable: true,
});
const NOW = new Date('2026-11-10T18:00:00.000Z');
const AUTH = { authorization: 'Bearer test-admin', 'content-type': 'application/json' };
function snapshot(changes = {}) {
  return { schema: 1, exportAsOf: '2026-11-10T17:00:00.000Z', sourceSha256: 'a'.repeat(64),
    productIds: [1317759, 1317758], coverage: { from: '2026-10-01', through: '2026-11-10', complete: true },
    daily: [{ date: '2026-11-10', orders: 2 }, { date: '2026-10-31', orders: 4 }, { date: '2026-11-01', orders: 1 }], ...changes };
}
function setup() {
  const kv = new Map([['sub:synthetic-preserved', 'subscriber-bytes'], ['u:synthetic-preserved', 'usage-bytes'],
    ['c:2026-11-10:install', '4'], ['report:synthetic-preserved', 'report-bytes']]);
  const before = new Map(kv), writes = [];
  const env = { ADMIN_TOKEN: 'test-admin', REPORTS: {
    get: async key => kv.get(key) ?? null,
    put: async (key, value) => { writes.push({ key, value }); kv.set(key, value); },
  }, METRICS: { prepare() { throw new Error('D1 must not be accessed'); }, batch() { throw new Error('D1 must not be accessed'); } } };
  const call = async (method, path = '/api/lemon-orders', body, headers = AUTH) => {
    const request = new Request('https://api.captionsgen.com' + path, { method, headers,
      ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }) });
    return lemonOrders(request, env, new URL(request.url), NOW);
  };
  const importSnapshot = value => call('POST', '/api/lemon-orders/import', value);
  const read = async () => (await call('GET')).json();
  return { kv, before, writes, env, call, importSnapshot, read };
}

test('both historical-order routes require the existing admin token before reading body or KV', async () => {
  const { env } = setup(); let touched = 0;
  env.REPORTS.get = async () => { touched++; throw new Error('private KV read'); };
  for (const path of ['/api/lemon-orders', '/api/lemon-orders/import']) for (const token of ['', 'Bearer wrong', 'Bearer test-admin-more']) {
    const request = new Request('https://api.captionsgen.com' + path, { method: path.endsWith('/import') ? 'POST' : 'GET', headers: { authorization: token } });
    assert.equal((await worker.fetch(request, env)).status, 401);
  }
  assert.equal(touched, 0);
});

test('missing import remains unavailable rather than implying zero historical orders', async () => {
  const { read } = setup();
  const data = await read();
  assert.equal(data.ok, true); assert.equal(data.available, false); assert.equal(data.totalOrders, null);
  assert.equal(data.coverage, null); assert.deepEqual(data.daily, []); assert.deepEqual(data.monthly, []);
});

test('one authenticated snapshot atomically stores only aggregates and derives exact UTC history', async () => {
  const { importSnapshot, read, writes, kv, before } = setup();
  const response = await importSnapshot(snapshot()); assert.equal(response.status, 200);
  const imported = await response.json();
  assert.equal(imported.duplicate, false); assert.equal(imported.totalOrders, 7);
  assert.equal(imported.importedAt, NOW.toISOString()); assert.equal(imported.snapshotAt, snapshot().exportAsOf);
  assert.equal(imported.source, 'Lemon Squeezy orders'); assert.equal(imported.coverage.timezone, 'UTC');
  assert.equal(imported.coverage.completeThrough, '2026-11-09');
  assert.deepEqual(imported.daily.map(row => row.date), ['2026-10-31', '2026-11-01', '2026-11-10']);
  assert.deepEqual(imported.monthly, [{ month: '2026-10', orders: 4 }, { month: '2026-11', orders: 3 }]);
  assert.deepEqual(await read(), Object.fromEntries(Object.entries(imported).filter(([key]) => key !== 'duplicate')));
  assert.equal(writes.length, 1); assert.equal(writes[0].key, LEMON_ORDERS_KEY);
  assert.deepEqual(Object.keys(JSON.parse(writes[0].value)).sort(), ['data', 'importedAt', 'schema', 'snapshotHash']);
  for (const [key, value] of before) assert.equal(kv.get(key), value);
  assert.equal(kv.size, before.size + 1);
});

test('reordered identical snapshots are no-op imports with stable metadata and no added totals', async () => {
  const { importSnapshot, writes, kv } = setup();
  await importSnapshot(snapshot()); const first = kv.get(LEMON_ORDERS_KEY);
  const response = await importSnapshot(snapshot({ daily: [...snapshot().daily].reverse(), productIds: [1317758, 1317759] }));
  assert.equal(response.status, 200); const result = await response.json();
  assert.equal(result.duplicate, true); assert.equal(result.totalOrders, 7);
  assert.equal(writes.length, 1); assert.equal(kv.get(LEMON_ORDERS_KEY), first);
});

test('the offline administrative builder produces the exact envelope used by authenticated import', async () => {
  const { importSnapshot, kv } = setup();
  const envelope = await createLemonOrderSnapshot(snapshot(), NOW);
  await importSnapshot(snapshot());
  assert.equal(JSON.stringify(envelope), kv.get(LEMON_ORDERS_KEY));
  assert.deepEqual(envelope.data, normalizeLemonOrders(snapshot(), NOW));
  assert.equal(envelope.importedAt, NOW.toISOString());
  assert.equal(envelope.data.daily.reduce((total, row) => total + row.orders, 0), 7);
});

test('a CSV source hash cannot be reused with conflicting dates, scope or counts', async () => {
  const { importSnapshot, writes, kv } = setup();
  await importSnapshot(snapshot()); const first = kv.get(LEMON_ORDERS_KEY);
  for (const changes of [{ daily: [{ date: '2026-11-10', orders: 8 }] },
    { coverage: { ...snapshot().coverage, from: '2026-10-02' } }, { exportAsOf: '2026-11-10T17:01:00.000Z' }]) {
    assert.equal((await importSnapshot(snapshot(changes))).status, 409);
    assert.equal(kv.get(LEMON_ORDERS_KEY), first);
  }
  assert.equal(writes.length, 1);
});

test('a newer export replaces the whole snapshot instead of appending or mixing observations', async () => {
  const { importSnapshot, read, writes } = setup(); await importSnapshot(snapshot());
  assert.equal((await importSnapshot(snapshot({ sourceSha256: 'b'.repeat(64), exportAsOf: '2026-11-10T17:30:00.000Z', daily: [{ date: '2026-11-01', orders: 3 }] }))).status, 200);
  const result = await read(); assert.equal(result.totalOrders, 3);
  assert.deepEqual(result.monthly, [{ month: '2026-11', orders: 3 }]);
  assert.equal(result.daily.length, 1); assert.equal(writes.length, 2);
});

test('older exports and failed writes preserve the previous whole snapshot', async () => {
  const { importSnapshot, env, kv, read } = setup(); await importSnapshot(snapshot());
  const previous = kv.get(LEMON_ORDERS_KEY);
  assert.equal((await importSnapshot(snapshot({ sourceSha256: 'b'.repeat(64), exportAsOf: '2026-11-10T16:00:00.000Z' }))).status, 409);
  env.REPORTS.put = async () => { throw new Error('KV unavailable'); };
  assert.equal((await importSnapshot(snapshot({ sourceSha256: 'b'.repeat(64) }))).status, 503);
  assert.equal(kv.get(LEMON_ORDERS_KEY), previous); assert.equal((await read()).totalOrders, 7);
});

test('extra fields, customer identifiers and unverified status/money breakdowns are rejected before any write', async () => {
  const { importSnapshot, writes } = setup();
  for (const input of [snapshot({ email: 'synthetic@example.invalid' }), snapshot({ orders: [{ identifier: 'raw-id' }] }),
    snapshot({ totals: { paid: 1 } }), snapshot({ daily: [{ date: '2026-11-10', orders: 1, refundedOrders: 1 }] }),
    snapshot({ coverage: { ...snapshot().coverage, timezone: 'guessed' } }), snapshot({ sourceSha256: 'contains-private-data' }),
    snapshot({ productIds: [1317759] }), snapshot({ productIds: [1317759, 1317759] }), snapshot({ productIds: ['1317758', '1317759'] })]) {
    assert.equal((await importSnapshot(input)).status, 400);
  }
  assert.equal(writes.length, 0);
});

test('malformed dates, duplicate days, future cutoffs and unsafe totals cannot become history', async () => {
  const { importSnapshot, writes } = setup();
  for (const input of [snapshot({ daily: [{ date: '2026-02-30', orders: 1 }] }),
    snapshot({ daily: [{ date: '2026-11-01', orders: 1 }, { date: '2026-11-01', orders: 2 }] }),
    snapshot({ daily: [{ date: '2026-09-30', orders: 1 }] }), snapshot({ daily: [{ date: '2026-11-11', orders: 1 }] }),
    snapshot({ daily: [{ date: '2026-11-01', orders: -1 }] }), snapshot({ daily: [{ date: '2026-11-01', orders: 1.5 }] }),
    snapshot({ daily: [{ date: '2026-11-01', orders: Number.MAX_SAFE_INTEGER }, { date: '2026-11-02', orders: 1 }] }),
    snapshot({ exportAsOf: '2026-11-11T00:00:00.000Z', coverage: { ...snapshot().coverage, through: '2026-11-11' } }),
    snapshot({ exportAsOf: '2026-11-10T17:00:00+00:00' }), snapshot({ coverage: { ...snapshot().coverage, complete: false } }),
    snapshot({ coverage: { ...snapshot().coverage, from: '2000-01-01' } })]) assert.equal((await importSnapshot(input)).status, 400);
  assert.equal(writes.length, 0);
});

test('the snapshot cutoff day is partial and a known empty export differs from no import', async () => {
  const { importSnapshot, read } = setup();
  const input = snapshot({ coverage: { from: '2026-11-10', through: '2026-11-10', complete: true }, daily: [] });
  assert.equal((await importSnapshot(input)).status, 200);
  const data = await read(); assert.equal(data.available, true); assert.equal(data.totalOrders, 0);
  assert.equal(data.coverage.completeThrough, null); assert.deepEqual(data.monthly, []);
});

test('the native export-complete UTC timestamp is canonicalized without inventing an export timezone', async () => {
  const { importSnapshot, read } = setup();
  assert.equal((await importSnapshot(snapshot({ exportAsOf: '2026-11-10T17:00:00Z' }))).status, 200);
  assert.equal((await read()).snapshotAt, '2026-11-10T17:00:00.000Z');
});

test('streaming size limits apply to actual bytes even without an honest content-length', async () => {
  const { env, writes } = setup();
  const stream = new ReadableStream({ start(controller) {
    controller.enqueue(new Uint8Array(MAX_ORDER_SNAPSHOT_BYTES)); controller.enqueue(new Uint8Array(1)); controller.close();
  } });
  const request = new Request('https://api.captionsgen.com/api/lemon-orders/import', { method: 'POST', headers: AUTH, body: stream, duplex: 'half' });
  assert.equal((await lemonOrders(request, env, new URL(request.url), NOW)).status, 413);
  assert.equal(writes.length, 0);
});

test('method, JSON, storage and corrupt-snapshot failures are explicit and do not expose stored content', async () => {
  const { call, env, kv } = setup();
  assert.equal((await call('POST', '/api/lemon-orders')).status, 405);
  assert.equal((await call('GET', '/api/lemon-orders/import')).status, 405);
  assert.equal((await call('POST', '/api/lemon-orders/import', '{}', { authorization: AUTH.authorization })).status, 415);
  assert.equal((await call('POST', '/api/lemon-orders/import', '{')).status, 400);
  kv.set(LEMON_ORDERS_KEY, JSON.stringify({ email: 'do-not-echo@example.invalid' }));
  const damaged = await call('GET'); assert.equal(damaged.status, 503); assert.doesNotMatch(await damaged.text(), /do-not-echo/);
  env.REPORTS.get = async () => { throw new Error('private-error'); };
  const unavailable = await call('GET'); assert.equal(unavailable.status, 503); assert.doesNotMatch(await unavailable.text(), /private-error/);
  assert.throws(() => normalizeLemonOrders(null, NOW));
});
