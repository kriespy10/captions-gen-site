const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const key = 'captionsgen.analytics-consent.v1';
const id = 'G-PR571RC95P';
const lifetime = 180 * 24 * 60 * 60 * 1000;

function browser({ choice, expires = Date.now() + lifetime - 1000, host = 'captionsgen.com', blockedStorage = false, href, referrer = 'https://www.google.com/search?q=private-search' } = {}) {
  const storage = new Map(choice ? [[key, JSON.stringify({ choice, expires })]] : []);
  const scripts = [];
  const cookiesRemoved = [];
  const listeners = {};
  const windowListeners = {};
  const status = { textContent: '' };
  let reloaded = false;
  const button = { focus() {} };
  const document = {
    readyState: 'complete',
    referrer,
    head: { appendChild(el) { scripts.push(el); } },
    body: { appendChild(el) { document.banner = el; } },
    createElement(tag) { return { tag, hidden: false, setAttribute() {}, querySelector() { return button; } }; },
    getElementById() { return status; },
    addEventListener(name, fn) { listeners[name] = fn; },
    get cookie() { return '_ga=abc; _ga_PR571RC95P=def; other=keep'; },
    set cookie(value) { cookiesRemoved.push(value); }
  };
  const window = {
    location: {
      hostname: host, pathname: '/blog/example.html',
      href: href || 'https://' + host + '/blog/example.html?utm_source=newsletter&email=private%40example.com#secret',
      reload() { reloaded = true; }
    },
    localStorage: {
      getItem(name) { if (blockedStorage) throw Error('blocked'); return storage.get(name) || null; },
      setItem(name, value) { if (blockedStorage) throw Error('blocked'); storage.set(name, value); }
    },
    addEventListener(name, fn) { windowListeners[name] = fn; }
  };
  vm.runInNewContext(source, { window, document, URL, URLSearchParams, Date });
  const click = (attrs, href, options = {}) => {
    const target = {
      closest() { return this; },
      hasAttribute(name) { return Object.hasOwn(attrs, name); },
      getAttribute(name) { return attrs[name]; },
      href,
      focus() {}
    };
    let prevented = false;
    const event = { type: 'click', button: 0, ...options, target, preventDefault() { prevented = true; } };
    listeners[event.type](event);
    return { target, prevented };
  };
  return {
    window, document, scripts, storage, cookiesRemoved,
    choose(value) { click({ 'data-analytics-choice': value }); },
    link(href, options) { return click({}, href, options); },
    preferences() { click({ 'data-analytics-preferences': '' }); },
    storageChanged(value) {
      if (value) storage.set(key, JSON.stringify(value)); else storage.delete(key);
      windowListeners.storage({ key });
    },
    commands() { return JSON.parse(JSON.stringify((window.dataLayer || []).map(args => Array.from(args)))); },
    reloaded() { return reloaded; }
  };
}

test('no Google script or events before consent, or with a remembered decline', () => {
  for (const choice of [undefined, 'denied']) {
    const page = browser({ choice });
    page.link('https://captionsgen.lemonsqueezy.com/checkout/buy/dbc6cfa2-cee0-40c4-b73f-38efe70b2b63');
    assert.equal(page.scripts.length, 0);
    assert.equal(page.commands().length, 0);
    assert.equal(page.document.banner.hidden, choice === 'denied');
  }
});

test('opt-in loads the correct tag once, keeps advertising off, and strips private URL fields', () => {
  const page = browser();
  page.choose('granted');
  page.choose('granted');
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=' + id);
  assert.equal(page.scripts[0].async, true);
  const commands = page.commands();
  assert.deepEqual(commands[0].slice(0, 2), ['consent', 'default']);
  assert.equal(commands[0][2].analytics_storage, 'denied');
  assert.equal(commands[1][2].analytics_storage, 'granted');
  for (const field of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(commands[1][2][field], 'denied');
  const config = commands.find(args => args[0] === 'config');
  assert.equal(config[1], id);
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].page_location, 'https://captionsgen.com/blog/example.html?utm_source=newsletter');
  assert.equal(config[2].page_referrer, 'https://www.google.com/search');
  assert.equal(config[2].cookie_expires, lifetime / 1000);
});

test('consented initialization preserves GA4 Admin cross-domain settings without a client override', () => {
  const page = browser();
  assert.equal(page.commands().length, 0);
  page.choose('granted');
  const commands = page.commands();
  assert.equal(commands.filter(args => args[0] === 'set' && args[1] === 'linker').length, 0);
  const consentDefault = commands.findIndex(args => args[0] === 'consent' && args[1] === 'default');
  const consentUpdate = commands.findIndex(args => args[0] === 'consent' && args[1] === 'update');
  const initialized = commands.findIndex(args => args[0] === 'js');
  const configured = commands.findIndex(args => args[0] === 'config');
  assert.ok(consentDefault >= 0 && consentUpdate > consentDefault && initialized > consentUpdate && configured > initialized);
  assert.equal(commands[configured][2].linker, undefined);
});

test('AI campaign attribution and incoming linker data are retained without inventing a checkout campaign', () => {
  const href = 'https://captionsgen.com/blog/example.html?utm_source=chatgpt.com&utm_medium=ai-assistant&_gl=1*test-linker&email=private%40example.com#private';
  const page = browser({ choice: 'granted', href, referrer: 'https://chatgpt.com/?private=query' });
  const config = page.commands().find(args => args[0] === 'config')[2];
  assert.equal(config.page_location, 'https://captionsgen.com/blog/example.html?utm_source=chatgpt.com&utm_medium=ai-assistant&_gl=1*test-linker');
  assert.equal(config.page_referrer, 'https://chatgpt.com/');
  const checkout = 'https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece?checkout[email]=private%40example.com&_gl=private-checkout-linker';
  const click = page.link(checkout);
  assert.equal(click.target.href, checkout, 'our listener leaves native links and Google linker decoration alone');
  assert.equal(click.prevented, false, 'native navigation and linker click propagation are preserved');
  const event = page.commands().find(args => args[0] === 'event');
  assert.equal(event[1], 'trial_click');
  assert.equal(event[2].transport_type, 'beacon');
  assert.equal(JSON.stringify(event).includes('private'), false);
  assert.equal(JSON.stringify(event).includes('_gl'), false);
  assert.equal(event[2].campaign_source, undefined);
  assert.equal(event[2].campaign_medium, undefined);
});

test('remembered consent starts analytics; expired or invalid choices ask again', () => {
  assert.equal(browser({ choice: 'granted' }).scripts.length, 1);
  for (const settings of [{ choice: 'granted', expires: Date.now() - 1000 }, { choice: 'invalid' }]) {
    const page = browser(settings);
    assert.equal(page.scripts.length, 0);
    assert.equal(page.document.banner.hidden, false);
  }
});

test('only known trial and buy links produce their distinct click events, never purchase', () => {
  const page = browser({ choice: 'granted' });
  page.link('https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece');
  page.link('https://captionsgen.lemonsqueezy.com/checkout/buy/dbc6cfa2-cee0-40c4-b73f-38efe70b2b63?checkout[email]=private@example.com');
  page.link('https://elsewhere.example/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece');
  page.link('https://captionsgen.lemonsqueezy.com.evil.example/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece');
  page.link('http://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece');
  page.link('https://captionsgen.lemonsqueezy.com/checkout/buy/unknown');
  assert.doesNotThrow(() => page.link('http://['));
  const events = page.commands().filter(args => args[0] === 'event');
  assert.deepEqual(events.map(args => args[1]), ['trial_click', 'checkout_click']);
  assert.equal(JSON.stringify(events).includes('private@'), false);
});

test('a middle-clicked checkout is measured once while unrelated auxiliary clicks are ignored', () => {
  const page = browser({ choice: 'granted' });
  const checkout = 'https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece';
  page.link(checkout, { type: 'click', button: 1 });
  const click = page.link(checkout, { type: 'auxclick', button: 1 });
  page.link(checkout, { type: 'auxclick', button: 2 });
  page.link('https://elsewhere.example/', { type: 'auxclick', button: 1 });
  assert.equal(click.prevented, false);
  assert.equal(click.target.href, checkout);
  assert.deepEqual(page.commands().filter(args => args[0] === 'event').map(args => args[1]), ['trial_click']);
  for (const choice of [undefined, 'denied']) {
    const off = browser({ choice });
    off.link(checkout, { type: 'auxclick', button: 1 });
    assert.equal(off.commands().length, 0);
    assert.equal(off.scripts.length, 0);
  }
});

test('keyboard activation and modified primary clicks each send one event without taking over navigation', () => {
  const checkout = 'https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece';
  for (const options of [{ detail: 0, button: 0 }, { detail: 1, button: 0, ctrlKey: true }, { detail: 1, button: 0, metaKey: true }]) {
    const page = browser({ choice: 'granted' });
    const click = page.link(checkout, options);
    assert.equal(click.prevented, false);
    assert.equal(click.target.href, checkout);
    assert.deepEqual(page.commands().filter(args => args[0] === 'event').map(args => args[1]), ['trial_click']);
  }
});

test('revoking consent disables collection, removes only analytics cookies, and unloads the tag', () => {
  const page = browser({ choice: 'granted' });
  page.preferences();
  assert.equal(page.document.banner.hidden, false);
  page.choose('denied');
  const commandCount = page.commands().length;
  page.link('https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece');
  assert.equal(page.commands().length, commandCount);
  assert.equal(page.window['ga-disable-' + id], true);
  assert.equal(page.reloaded(), true);
  assert.equal(JSON.parse(page.storage.get(key)).choice, 'denied');
  assert.ok(page.cookiesRemoved.some(value => value.startsWith('_ga=')));
  assert.ok(page.cookiesRemoved.some(value => value.startsWith('_ga_PR571RC95P=')));
  assert.ok(page.cookiesRemoved.every(value => !value.startsWith('other=')));
});

test('consent revocation in another tab stops an already running tag', () => {
  const page = browser({ choice: 'granted' });
  page.storageChanged({ choice: 'denied', expires: Date.now() + lifetime - 1000 });
  assert.equal(page.reloaded(), true);
  assert.equal(page.window['ga-disable-' + id], true);
});

test('blocked storage still allows a page-level choice; preview hosts never collect', () => {
  const page = browser({ blockedStorage: true });
  assert.equal(page.scripts.length, 0);
  page.choose('granted');
  assert.equal(page.scripts.length, 1);
  const preview = browser({ host: 'localhost' });
  preview.choose('granted');
  assert.equal(preview.scripts.length, 0);
});

test('every published HTML page includes the shared tag once and a preferences control', () => {
  const files = ['index.html', 'privacy.html', 'product.html', 'after-effects.html', ...['blog', 'news'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.html')).map(file => dir + '/' + file))];
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal((html.match(/<script defer src="\/analytics.js"><\/script>/g) || []).length, 1, file);
    assert.ok(html.includes('href="/analytics.css"'), file);
    assert.ok(html.includes('data-analytics-preferences'), file);
    assert.ok(html.includes('/privacy.html') || file === 'privacy.html', file);
  }
});

test('direct installer clicks respect consent and exact asset identity without altering navigation', () => {
  const installer = 'https://github.com/kriespy10/captions-gen-site/releases/download/v1.1.9/CaptionsGen-Setup-1.1.9.exe';
  for (const choice of [undefined, 'denied', 'granted']) {
    const page = browser({ choice });
    const click = page.link(installer + '?email=private@example.com');
    assert.equal(click.prevented, false);
    const events = page.commands().filter(args => args[0] === 'event');
    assert.equal(events.length, choice === 'granted' ? 1 : 0);
    if (choice === 'granted') {
      assert.equal(events[0][1], 'download_click');
      assert.equal(events[0][2].file_name, 'CaptionsGen-Setup-1.1.9.exe');
      assert.equal(JSON.stringify(events).includes('private'), false);
    }
  }
  const page = browser({ choice: 'granted' });
  for (const url of [installer.replace('github.com', 'github.com.evil.example'), installer.replace('https:', 'http:'), installer.replace('Setup', 'Update'), installer.replace('/v1.1.9/', '/v1.1.8/')]) page.link(url);
  assert.equal(page.commands().filter(args => args[0] === 'event').length, 0);
  page.link(installer, { type: 'auxclick', button: 1 });
  assert.equal(page.commands().filter(args => args[0] === 'event').length, 1);
});
