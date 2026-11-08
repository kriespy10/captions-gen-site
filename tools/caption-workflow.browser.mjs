// Run in a fresh browser context at http://127.0.0.1:8877/#custom:
// await (await import('/tools/caption-workflow.browser.mjs')).checkDemo()
// Uses prepared text only and resets both demo projects. Never run on production.
export async function checkDemo() {
  if (!['127.0.0.1', 'localhost'].includes(location.hostname)) throw new Error('Use a local test page.');
  const root = document.querySelector('[data-caption-demo]');
  const $ = selector => root.querySelector(selector);
  const click = selector => { const node = $(selector); if (!node || node.disabled) throw new Error(`Unavailable: ${selector}`); node.click(); };
  const set = (selector, value, event = 'input') => { const node = $(selector); node.value = value; node.dispatchEvent(new Event(event, { bubbles:true })); };
  const checks = [];
  const assert = (condition, name) => { if (!condition) throw new Error(`Failed: ${name}`); checks.push(name); };
  const copies = () => [...root.querySelectorAll('[data-demo-sample-list] .demo-sample-copy')].map(node => node.textContent);
  const manual = text => { click('[data-demo-manual-edit]'); set('[data-demo-edit-text]', text); click('[data-demo-edit-save]'); };
  const tab = name => click(`[data-view="${name}"]`);
  const originalPresets = localStorage.getItem('captionsgen-demo-presets');
  const originalMain = localStorage.getItem('captionsgen-demo-main');
  try {
    assert(root.classList.contains('demo-ready'), 'demo initializes');
    click('[data-demo-reset]');
    assert($('.demo-version').textContent === '1.1.9 demo', 'release label');
    assert(root.querySelectorAll('[aria-label="Built-in caption presets"] .demo-preset-select').length === 18, '18 built-in presets');
    assert($('#demo-tab-captions').hidden, 'Premiere has three tabs');
    click('[data-demo-generate]');
    assert(copies().length === 3, 'generate three Premiere sample captions');
    click('[data-demo-edit]'); set('[data-demo-edit-text]', 'A corrected Premiere caption'); click('[data-demo-edit-save]');
    assert(copies()[0] === 'A corrected Premiere caption' && $('[data-demo-update]').hidden, 'Save caption updates text and animation together');
    manual('Manual Premiere properties text');
    assert(!$('[data-demo-update]').hidden && $('[data-demo-play]').disabled, 'Properties edit requires Update animation');
    assert($('.demo-look-card .demo-caption').textContent.includes('Manual Premiere properties text'), 'pending preview shows new static text');
    click('[data-demo-update]');
    assert($('[data-demo-update]').hidden && !$('[data-demo-play]').disabled, 'Update animation enables playback');
    click('[data-demo-undo]');
    assert(!$('[data-demo-update]').hidden, 'Undo restores pending animation');
    click('[data-demo-undo]');
    assert(copies()[0] === 'A corrected Premiere caption', 'Undo restores previous text');
    click('[data-demo-remove]');
    assert(copies().length === 0 && !$('[data-demo-undo]').disabled, 'Remove keeps Undo available');
    click('[data-demo-undo]');
    assert(copies().length === 3, 'Undo restores removed batch');
    $('#demo-tab-customize').dispatchEvent(new KeyboardEvent('keydown', { key:'ArrowRight', bubbles:true }));
    assert($('#demo-tab-settings').getAttribute('aria-selected') === 'true', 'keyboard skips hidden Premiere Captions tab');
    assert($('[data-demo-language]').options.length === 101, '101 language options');
    set('[data-demo-language-search]', 'maori');
    assert([...$('[data-demo-language]').options].some(option => option.textContent === 'Māori'), 'language search folds accents');
    set('[data-demo-language-search]', '');
    click('[data-demo-add-model]');
    assert($('[data-demo-language]').value === 'sk' && $('[data-demo-model]').value === 'demo-custom', 'example custom model assigned to Slovak');
    set('[data-demo-language]', 'en', 'change');
    assert($('[data-demo-model]').value !== 'demo-custom' && $('[data-demo-model] option[value="demo-custom"]').disabled, 'incompatible example model disabled');
    set('[data-demo-language]', 'yue', 'change');
    assert($('[data-demo-model]').value === 'large-v3-turbo', 'Cantonese selects Turbo');
    $('[data-demo-review]').checked = true; click('[data-demo-generate]');
    assert($('[data-demo-caption-dialog]').open, 'review transcript opens before generation');
    set('[data-demo-edit-text]', 'Reviewed first caption\nReviewed second caption'); click('[data-demo-edit-save]');
    $('[data-demo-review]').checked = false; tab('presets');
    assert(copies().join('|') === 'Reviewed first caption|Reviewed second caption', 'review generates edited prepared captions');
    click('[data-demo-host="after-effects"]');
    assert(!$('#demo-tab-captions').hidden && copies().length === 0, 'After Effects exposes Captions with separate empty project');
    click('[data-demo-generate]'); click('[data-demo-edit]');
    assert($('#demo-tab-captions').getAttribute('aria-selected') === 'true', 'After Effects edit opens Captions tab');
    set('[data-demo-caption-text]', 'Edited After Effects caption'); click('[data-demo-caption-save]');
    assert(copies()[0] === 'Edited After Effects caption' && $('[data-demo-update]').hidden, 'After Effects inline Save updates caption');
    manual('Unrelated manual draft');
    set('[data-demo-find]', 'style'); set('[data-demo-replace]', ''); click('[data-demo-find-replace]');
    assert(/Found 1 whole-word match/.test($('[data-demo-find-status]').textContent) && copies()[2].includes('style'), 'blank replacement finds without changing text');
    set('[data-demo-replace]', 'design');
    assert(/^1 whole-word match in 1 sample caption/.test($('[data-demo-find-status]').textContent), 'editing find inputs recomputes match counts');
    click('[data-demo-find-replace]');
    assert(copies()[2].includes('design'), 'After Effects replaces whole-word matches');
    assert(root.querySelector('[data-demo-sample-list] .demo-sample-row').textContent.includes('Animation needs updating'), 'replacement preserves unmatched manual timing state');
    set('[data-demo-caption-search]', 'design');
    assert(root.querySelectorAll('[data-demo-caption-list] .demo-sample-row').length === 1, 'caption search filters rows');
    set('[data-demo-caption-search]', '');
    const beforeStyle = copies().join('|'); tab('presets'); click('[aria-label="Use Karaoke Pill preset"]');
    assert(!$('[data-demo-apply]').hidden, 'style changes offer Apply style'); click('[data-demo-apply]');
    assert(copies().join('|') === beforeStyle, 'Apply style preserves text');
    click('[data-demo-host="premiere"]');
    assert(copies().join('|') === 'Reviewed first caption|Reviewed second caption', 'switching hosts preserves independent sample project');
    const fixture = { type:'preset', app:'Captions Gen', format:1, name:'Browser QA imported font', settings:{ v:4, fontPS:'ClientGrotesk-Heavy', fontFamily:'Client Grotesk', fontWeight:800, gMaxDur:2.7 } };
    const files = new DataTransfer(); files.items.add(new File([JSON.stringify(fixture)], 'qa.cgpreset', { type:'application/json' }));
    $('[data-import-file]').files = files.files; $('[data-import-file]').dispatchEvent(new Event('change', { bubbles:true }));
    for (let i = 0; i < 40 && !/imported into this browser/.test($('[data-demo-status]').textContent); i++) await new Promise(resolve => setTimeout(resolve, 25));
    assert(/imported into this browser/.test($('[data-demo-status]').textContent), 'current v4 preset imports through UI');
    tab('customize');
    assert($('[data-output="gMaxDur"]').value === '2.7s' && $('#demo-gMaxDur').value === '2.7', 'fractional duration survives import and display');
    tab('presets'); click('[aria-label="Use Plain preset"]');
    click('[data-preset-actions]'); click('[data-demo-save]'); set('#demo-preset-name', 'Browser QA neutral font');
    $('.demo-save-dialog:not(.demo-preset-actions-dialog) form').requestSubmit();
    const saved = JSON.parse(localStorage.getItem('captionsgen-demo-presets')).find(item => item.name === 'Browser QA neutral font');
    assert(saved?.settings.importedFont?.fontPS === fixture.settings.fontPS && saved.settings.fontNotice, 'neutral preset preserves imported font identity and fallback notice');
    const { encodePreset } = await import('../caption-preset-format.mjs');
    assert(encodePreset(saved.name, saved.settings).settings.fontPS === fixture.settings.fontPS, 'saved neutral preset re-exports original font');
    return { passed: checks.length, checks };
  } finally {
    root.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    click('[data-demo-reset]');
    for (const [key, value] of [['captionsgen-demo-presets', originalPresets], ['captionsgen-demo-main', originalMain]]) {
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    }
  }
}
