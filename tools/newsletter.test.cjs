const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'newsletter.js'), 'utf8');

function browser(responses = []) {
  const calls = [];
  const attrs = {};
  const status = { textContent: '', setAttribute(k, v) { attrs[k] = v; } };
  const email = { value: ' Editor@Example.com ', disabled: false };
  const button = { textContent: 'Get email updates', disabled: true };
  let submit;
  let valid = true;
  const form = {
    querySelector(selector) { return selector === '[name="email"]' ? email : button; },
    reportValidity() { return valid; },
    setAttribute(k, v) { attrs[k] = v; },
    removeAttribute(k) { delete attrs[k]; },
    addEventListener(name, fn) { assert.equal(name, 'submit'); submit = fn; }
  };
  vm.runInNewContext(source, {
    document: { readyState: 'complete', getElementById(id) { return id === 'newsletter-form' ? form : status; } },
    async fetch(url, options) {
      calls.push({ url, options });
      const response = responses.shift();
      if (response instanceof Error) throw response;
      if (typeof response === 'function') return response();
      return { status: 200, ok: true, json: async () => ({ ok: true, token: 'private-token' }), ...response };
    }
  });
  return {
    calls, email, button, status, attrs,
    setValid(value) { valid = value; },
    submit() {
      let prevented = false;
      const result = submit({ preventDefault() { prevented = true; } });
      assert.equal(prevented, true);
      return result;
    }
  };
}

test('newsletter only sends after an explicit valid submission and records its wording', async () => {
  const page = browser();
  assert.equal(page.calls.length, 0);
  assert.equal(page.button.disabled, false);
  page.setValid(false);
  await page.submit();
  assert.equal(page.calls.length, 0);
  page.setValid(true);
  await page.submit();
  assert.equal(page.calls.length, 1);
  const call = page.calls[0];
  assert.equal(call.url, 'https://api.captionsgen.com/api/subscribe');
  assert.equal(call.options.method, 'POST');
  assert.equal(call.options.credentials, 'omit');
  assert.deepEqual(JSON.parse(call.options.body), {
    email: 'Editor@Example.com', source: 'website', v: '1.1.11', consent: 'website-2026-11'
  });
  assert.equal(page.attrs['data-state'], 'success');
  assert.equal(page.attrs['aria-busy'], undefined);
  assert.equal(page.email.value, '');
  assert.equal(page.email.disabled, true);
  assert.equal(page.button.disabled, true);
  assert.doesNotMatch(page.status.textContent, /private-token/);
  await page.submit();
  assert.equal(page.calls.length, 1);
});

test('newsletter shows rate limit or server/network errors and allows a retry', async () => {
  for (const failure of [
    { status: 429, ok: false },
    { status: 500, ok: false, json: async () => ({ ok: false }) },
    { json: async () => { throw new Error('not JSON'); } },
    new Error('offline')
  ]) {
    const page = browser([failure]);
    await page.submit();
    assert.equal(page.attrs['data-state'], 'error');
    assert.match(page.status.textContent, failure.status === 429 ? /wait a minute/ : /couldn’t save/);
    assert.equal(page.button.disabled, false);
    assert.equal(page.button.textContent, 'Get email updates');
    assert.equal(page.email.disabled, false);
    assert.equal(page.email.value, ' Editor@Example.com ');
    assert.equal(page.attrs['aria-busy'], undefined);
    await page.submit();
    assert.equal(page.attrs['data-state'], 'success');
  }
});

test('newsletter ignores duplicate submits while its request is pending', async () => {
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  const page = browser([() => pending]);
  const first = page.submit();
  assert.equal(page.button.disabled, true);
  assert.equal(page.attrs['aria-busy'], 'true');
  await page.submit();
  assert.equal(page.calls.length, 1);
  resolve({ status: 200, ok: true, json: async () => ({ ok: true }) });
  await first;
  assert.equal(page.attrs['data-state'], 'success');
});
