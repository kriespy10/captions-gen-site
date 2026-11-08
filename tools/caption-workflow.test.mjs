import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initSampleWorkflow } from '../caption-workflow.mjs';

// Small DOM boundary for exercising the real controller through its UI hooks.
// Native Adobe, network and browser layout APIs are deliberately absent.
function fixture(t) {
  const previousDocument = globalThis.document;
  const document = { activeElement: null, createElement: tag => new Element(tag) };
  class Element {
    constructor(tag = 'button') {
      this.tagName = tag.toUpperCase(); this.children = []; this.listeners = new Map();
      this.attributes = new Map(); this.dataset = {}; this.value = ''; this.textContent = '';
      this.hidden = false; this.disabled = false; this.checked = false;
      this.classList = { toggle() {} };
    }
    get options() { return this.children; }
    get selectedOptions() { return this.options.filter(option => option.value === this.value); }
    append(...children) { children.forEach(child => { child.parentElement = this; this.children.push(child); }); }
    replaceChildren(...children) {
      this.children = []; this.append(...children);
      if (this.tagName === 'SELECT') this.value = children[0]?.value || '';
    }
    insertBefore(child, before) { child.parentElement = this; this.children.splice(Math.max(0, this.children.indexOf(before)), 0, child); }
    remove() { this.parentElement.children = this.parentElement.children.filter(child => child !== this); }
    setAttribute(name, value) { this.attributes.set(name, value); }
    addEventListener(type, callback) { this.listeners.set(type, [...(this.listeners.get(type) || []), callback]); }
    fire(type) { this.listeners.get(type)?.forEach(callback => callback({ target: this, preventDefault() {} })); }
    click() { if (!this.disabled) this.fire('click'); }
    focus() { document.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; }
  }
  globalThis.document = document;
  t.after(() => { if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument; });
  const hooks = new Map();
  const get = name => {
    if (!hooks.has(name)) hooks.set(name, new Element());
    return hooks.get(name);
  };
  for (const name of ['model', 'language', 'placement']) hooks.set(name, new Element('select'));
  const option = (value, label) => { const element = new Element('option'); element.value = value; element.textContent = label; return element; };
  get('model').replaceChildren(option('large-v3-turbo', 'Turbo · best'), option('small', 'Small · balanced'), option('base', 'Base · fastest'));
  get('placement').replaceChildren(option('auto', 'Above the selected clip'), option('1', 'V2'));
  get('batch').append(get('sample-list'));
  const dialogParts = new Map(['h3', 'label', 'p:not([data-demo-edit-error])'].map(selector => [selector, new Element()]));
  get('caption-dialog').querySelector = selector => dialogParts.get(selector);
  const hostButtons = ['premiere', 'after-effects'].map(host => { const element = new Element(); element.dataset.demoHost = host; return element; });
  const root = {
    querySelector(selector) {
      if (selector === '#demo-view-captions') return get('caption-view');
      const match = selector.match(/^\[data-demo-([a-z-]+)\]$/u);
      if (!match) throw new Error(`Unexpected selector: ${selector}`);
      return get(match[1]);
    },
    querySelectorAll(selector) {
      if (selector === '[data-demo-host]') return hostButtons;
      if (selector === '[data-demo-for-host]') return [];
      if (selector === '[data-demo-generate]') return [get('generate')];
      throw new Error(`Unexpected selector list: ${selector}`);
    },
  };
  let view = 'presets', settings = { font: 'impact', karaoke: true };
  const workflow = initSampleWorkflow(root, {
    getSettings: () => settings, getPresetName: () => 'Test preset', getView: () => view,
    setView: next => { view = next; },
    onHostChange(host) { if (host === 'premiere' && view === 'captions') view = 'presets'; },
    onPreviewChange() {},
  });
  workflow.initialize();
  return {
    workflow, get,
    host(name) { hostButtons.find(button => button.dataset.demoHost === name).click(); },
    input(name, value, type = 'input') { get(name).value = value; get(name).fire(type); },
    generate() { get('generate').click(); },
    select(index) { get('sample-list').children[index].click(); },
    save(text, manual = false) { get(manual ? 'manual-edit' : 'edit').click(); get('edit-text').value = text; get('edit-save').click(); },
    settings(next) { settings = { ...settings, ...next }; workflow.designChanged(); },
    preview() { return workflow.preview(view); },
  };
}

test('manual text edits keep applied timing until Update animation; normal Save updates it immediately', t => {
  const f = fixture(t); f.generate();
  const original = structuredClone(f.preview());
  f.save('Captions made just for you', true);
  assert.equal(f.preview().pending, true);
  assert.equal(f.preview().text, 'Captions made just for you');
  assert.deepEqual(f.preview().words, original.words, 'manual text must not silently retime the applied animation');
  assert.equal(f.get('update').hidden, false);
  f.get('update').click();
  assert.equal(f.preview().pending, false);
  assert.equal(f.preview().words.map(word => word.text).join(' '), 'Captions made just for you');
  assert.equal(f.get('update').hidden, true);
  f.get('undo').click();
  assert.equal(f.preview().pending, true);
  assert.deepEqual(f.preview().words, original.words);
  f.save('Captions made just for you');
  assert.equal(f.preview().pending, true, 'saving unchanged text must not resolve a prior external edit');
  f.get('undo').click();
  assert.equal(f.preview().text, original.text, 'unchanged Save must not add a history entry');
  f.save('Captions made especially for you');
  assert.equal(f.preview().pending, false);
  assert.equal(f.preview().words.map(word => word.text).join(' '), f.preview().text);
  assert.equal(f.get('update').hidden, true);
});

test('AE replacement updates changed captions and preserves unrelated pending manual edits', t => {
  const f = fixture(t); f.host('after-effects'); f.generate(); f.select(1);
  const appliedWords = structuredClone(f.preview().words);
  // Use the shared manual edit dialog, without the AE Open Captions shortcut.
  f.save('Different sample words', true);
  f.input('find', 'Captions'); f.input('replace', 'Subtitles'); f.get('find-replace').click();
  assert.equal(f.preview().text, 'Different sample words');
  assert.equal(f.preview().pending, true);
  assert.deepEqual(f.preview().words, appliedWords);
  f.select(0);
  assert.equal(f.preview().text, 'Subtitles made for you');
  assert.equal(f.preview().pending, false);
  assert.equal(f.preview().words.map(word => word.text).join(' '), f.preview().text);
  f.select(1);
  f.input('find', 'Different'); f.input('replace', 'Changed'); f.get('find-replace').click();
  assert.equal(f.preview().text, 'Changed sample words');
  assert.equal(f.preview().pending, false, 'a replacement that changes the pending caption must update its timing');
  assert.equal(f.preview().words.map(word => word.text).join(' '), f.preview().text);
});

test('find previews replace stale results and reject empty or unchanged replacement actions', t => {
  const f = fixture(t); f.host('after-effects'); f.generate();
  f.input('find', 'Captions'); f.input('replace', 'Subtitles');
  assert.match(f.get('find-status').textContent, /^1 whole-word match in 1 sample caption/u);
  assert.equal(f.get('find-replace').textContent, 'Replace all (1)');
  f.get('find-replace').click();
  assert.match(f.get('find-status').textContent, /^Replaced 1 match/u);
  f.input('find', 'absent');
  assert.match(f.get('find-status').textContent, /^0 whole-word matches/u);
  assert.equal(f.get('find-replace').disabled, true);
  f.input('find', 'Subtitles');
  assert.equal(f.get('find-replace').disabled, true);
  assert.match(f.get('find-status').textContent, /spelling already matches/u);
  f.input('replace', '');
  assert.equal(f.get('find-replace').textContent, 'Find matches');
  assert.equal(f.get('find-replace').disabled, false);
  f.input('find', '');
  assert.equal(f.get('find-replace').disabled, true);
  assert.match(f.get('find-status').textContent, /Enter a word or phrase/u);
});

test('language search folds accents and custom models remain compatible after language changes', t => {
  const f = fixture(t);
  f.input('language-search', 'FRÉNCH');
  assert.ok(f.get('language').options.some(option => option.value === 'fr'));
  assert.ok(!f.get('language').options.some(option => option.value === 'de'));
  f.get('add-model').click();
  const custom = f.get('model').options.find(option => option.value === 'demo-custom');
  assert.equal(f.get('language').value, 'sk');
  assert.equal(f.get('model').value, 'demo-custom');
  assert.equal(custom.disabled, false);
  f.input('language', 'en', 'change');
  assert.equal(custom.disabled, true);
  assert.notEqual(f.get('model').value, 'demo-custom');
  f.input('model', 'demo-custom', 'change');
  assert.notEqual(f.get('model').value, 'demo-custom', 'controller must reject a forced incompatible selection too');
  f.input('language', 'sk', 'change');
  assert.equal(custom.disabled, false);
  assert.equal(f.get('model').value, 'demo-custom');
  f.input('language', 'yue', 'change');
  assert.equal(f.get('model').value, 'large-v3-turbo');
  assert.equal(custom.disabled, true);
  assert.ok(f.get('model').options.filter(option => ['base', 'small'].includes(option.value)).every(option => option.disabled));
  assert.match(f.get('model-note').textContent, /Turbo or a compatible custom model/u);
  f.input('language', '', 'change');
  assert.equal(custom.disabled, true, 'this explicitly Slovak example is unavailable outside its assigned language');
  assert.ok(f.get('model').options.filter(option => ['base', 'small'].includes(option.value)).every(option => !option.disabled));
});

test('host batches and undo history remain separate, including Apply style snapshots', t => {
  const f = fixture(t); f.generate(); f.save('My Premiere caption');
  f.host('after-effects');
  assert.equal(f.preview(), null);
  f.generate();
  f.settings({ font: 'inter' });
  assert.equal(f.get('apply').hidden, false);
  f.get('apply').click();
  assert.equal(f.preview().settings.font, 'inter');
  f.get('undo').click();
  assert.equal(f.preview().settings.font, 'impact');
  f.host('premiere');
  assert.equal(f.preview().text, 'My Premiere caption');
  f.get('undo').click();
  assert.equal(f.preview().text, 'Captions made for you');
  f.host('after-effects');
  assert.equal(f.preview().text, 'Captions made for you');
});
