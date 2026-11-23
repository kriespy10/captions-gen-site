import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timingSafeEqual } from 'node:crypto';
import worker from './report-worker.js';

// Match the real constant-time primitive supplied by Cloudflare's Web Crypto.
if (!crypto.subtle.timingSafeEqual) Object.defineProperty(crypto.subtle, 'timingSafeEqual', {
  value: (a, b) => timingSafeEqual(Buffer.from(a), Buffer.from(b)), configurable: true,
});

function setup(extra = {}) {
  const store = new Map();
  const env = {
    ADMIN_TOKEN: 'original-signing-key',
    ADMIN_ACCESS_TOKEN: 'replacement-login',
    REPORTS: {
      get: async key => store.get(key) ?? null,
      put: async (key, value) => { store.set(key, value); },
      delete: async key => { store.delete(key); },
      list: async ({ prefix }) => ({
        keys: [...store.keys()].filter(key => key.startsWith(prefix)).map(name => ({ name })),
        list_complete: true,
      }),
    },
    ...extra,
  };
  const call = (path, token = 'replacement-login', method = 'GET', body) => worker.fetch(
    new Request('https://api.captionsgen.com' + path, {
      method,
      headers: token === null ? {} : { authorization: 'Bearer ' + token },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }), env,
  );
  return { env, store, call };
}

const routes = [
  '/api/reports', '/api/funnel', '/api/subscribers', '/api/downloads',
  '/api/measurements', '/api/live-downloads', '/api/lemon-orders', '/api/lemon-orders/import',
];

test('every administrative route rejects the original signing key after login recovery', async () => {
  const { call, env } = setup();
  env.REPORTS = new Proxy({}, { get() { throw new Error('Unauthenticated storage access'); } });
  for (const path of routes) {
    const method = path.endsWith('/import') ? 'POST' : 'GET';
    for (const token of [null, 'original-signing-key', 'replacement-login-more']) {
      assert.equal((await call(path, token, method)).status, 401, path);
    }
  }
});

test('the recovered token reaches all administrative route handlers', async t => {
  const { call, env } = setup();
  const authorizedResults = [];
  t.mock.method(globalThis, 'fetch', async input => {
    assert.match(String(input), /^https:\/\/api.github.com\/repos\/kriespy10\/captions-gen-site\/releases\?/);
    return Response.json([{ assets: [{
      name: 'CaptionsGen-Setup-1.1.14.exe', state: 'uploaded', download_count: 3,
    }] }]);
  });
  for (const path of routes) {
    const method = path.endsWith('/import') ? 'POST' : 'GET';
    const response = await call(path, 'replacement-login', method);
    assert.notEqual(response.status, 401, path);
    authorizedResults.push([path, response.status]);
  }
  assert.deepEqual(authorizedResults, [
    ['/api/reports', 200], ['/api/funnel', 200], ['/api/subscribers', 200],
    ['/api/downloads', 200], ['/api/measurements', 503], ['/api/live-downloads', 503], ['/api/lemon-orders', 200],
    ['/api/lemon-orders/import', 415],
  ]);
  assert.equal(env.ADMIN_TOKEN, 'original-signing-key', 'Request mapping leaves the binding object intact');
});

test('an explicitly empty replacement token rejects both old and empty logins', async () => {
  const { call } = setup({ ADMIN_ACCESS_TOKEN: '' });
  for (const path of routes) {
    const method = path.endsWith('/import') ? 'POST' : 'GET';
    for (const token of ['original-signing-key', '', null]) {
      assert.equal((await call(path, token, method)).status, 401, path);
    }
  }
});

test('subscriber links survive adding and replacing the administrative login token', async () => {
  for (const signingSecret of [undefined, 'dedicated-newsletter-key']) {
    const { call, env, store } = setup({ ADMIN_ACCESS_TOKEN: undefined, SUBSCRIBE_SECRET: signingSecret });
    const email = 'local-fixture@example.com';
    store.set('sub:' + email, JSON.stringify({ email, at: '2026-11-01T12:00:00Z' }));
    const before = await (await call('/api/subscribers', 'original-signing-key')).json();
    const link = new URL(before.subscribers[0].unsubscribeUrl);
    for (const token of ['replacement-login', 'another-replacement']) {
      env.ADMIN_ACCESS_TOKEN = token;
      const after = await (await call('/api/subscribers', token)).json();
      assert.equal(after.subscribers[0].unsubscribeUrl, link.href);
      const response = await call(link.pathname + link.search, null);
      assert.equal(response.status, 200);
      assert.match(await response.text(), /Unsubscribe from Captions Gen emails/);
      assert.equal(store.has('sub:' + email), true, 'A confirmation-page GET preserves the subscription');
    }
  }
});
