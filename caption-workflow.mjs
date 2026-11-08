import { SAMPLE_CAPTIONS, wordsForText, findReplaceSample, findSampleMatches } from './caption-sample.mjs?v=demo-1.1.9-20261108';
import { SPOKEN_LANGUAGES } from './caption-preset-format.mjs?v=demo-1.1.9-20261108';

// Prepared browser samples only. No media files, Adobe connections or requests.
export function initSampleWorkflow(root, { getSettings, getPresetName, getView, setView, onHostChange, onPreviewChange }) {
  const $ = selector => root.querySelector(selector);
  const clone = value => structuredClone(value);
  const fresh = () => ({ batch: null, selected: 0, history: [], placedPreview: false, matches: [] });
  const projects = { premiere: fresh(), 'after-effects': fresh() };
  const status = $('[data-demo-status]'), batchBox = $('[data-demo-batch]');
  const model = $('[data-demo-model]'), language = $('[data-demo-language]');
  const languageSearch = $('[data-demo-language-search]'), placement = $('[data-demo-placement]');
  const premierePlacements = [...placement.options].map(option => ({ value: option.value, text: option.textContent }));
  const editor = $('[data-demo-caption-text]'), search = $('[data-demo-caption-search]');
  const find = $('[data-demo-find]'), replacement = $('[data-demo-replace]');
  const findStatus = $('[data-demo-find-status]');
  const dialog = $('[data-demo-caption-dialog]'), editText = $('[data-demo-edit-text]');
  const editError = $('[data-demo-edit-error]'), editSave = $('[data-demo-edit-save]');
  const meta = document.createElement('p'); meta.className = 'demo-hint';
  batchBox.insertBefore(meta, $('[data-demo-sample-list]'));
  let host = 'premiere', dialogMode = 'edit', selectedLanguage = '', customLanguage = '';
  let lastBuiltin = model.value;
  const state = () => projects[host];
  const selected = () => state().batch?.captions[state().selected];
  const say = message => { status.textContent = message; };
  const nameForHost = () => host === 'premiere' ? 'Premiere Pro' : 'After Effects';
  const signature = settings => JSON.stringify(Object.entries(settings).sort(([a], [b]) => a.localeCompare(b)));
  const remember = () => {
    state().history.push({ batch: clone(state().batch), selected: state().selected });
    if (state().history.length > 20) state().history.shift();
  };
  const clock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${(seconds % 60).toFixed(1).padStart(4, '0')}`;
  const searchKey = text => text.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

  function languageOptions() {
    const query = searchKey(languageSearch.value.trim());
    const list = SPOKEN_LANGUAGES.filter(item => !query || searchKey(`${item.name} ${item.code}`).includes(query));
    const active = SPOKEN_LANGUAGES.find(item => item.code === selectedLanguage);
    // Keep an existing choice stable while filtering its list.
    if (active && !list.some(item => item.code === active.code)) list.unshift(active);
    language.replaceChildren(...list.map(item => {
      const option = document.createElement('option'); option.value = item.code; option.textContent = item.name; return option;
    }));
    language.value = selectedLanguage;
  }

  function modelNote() {
    const lang = SPOKEN_LANGUAGES.find(item => item.code === selectedLanguage);
    for (const option of model.options) {
      option.disabled = option.value === 'demo-custom'
        ? selectedLanguage !== customLanguage
        : !!lang?.requiredModel && option.value !== lang.requiredModel;
    }
    if (model.value === 'demo-custom' && selectedLanguage !== customLanguage) model.value = lastBuiltin;
    if (lang?.requiredModel === 'large-v3-turbo') {
      model.value = [...model.options].find(option => /turbo/i.test(option.textContent))?.value || lastBuiltin;
      $('[data-demo-model-note]').textContent = 'Cantonese requires Turbo or a compatible custom model in the plugin. The example custom model is for Slovak, so this demo uses Turbo. The prepared text stays unchanged.';
      return;
    }
    $('[data-demo-model-note]').textContent = model.value === 'demo-custom'
      ? 'Example custom model selected. In the installed panel, add a compatible model folder and assign its spoken language. Nothing is downloaded here.'
      : 'Model and language choices are interactive examples. Generating here uses prepared text, not speech recognition.';
  }

  function selectCaption(index) {
    state().selected = index; state().placedPreview = true;
    editor.value = selected()?.text || '';
    render(); onPreviewChange();
  }

  function rows(container, captionEditor = false) {
    const batch = state().batch;
    container.replaceChildren();
    if (!batch) {
      const p = document.createElement('p'); p.className = 'demo-hint';
      p.textContent = state().history.length ? 'Sample captions removed. Undo restores the last change.' : 'Generate the prepared sample to try caption editing.';
      container.append(p); return;
    }
    const query = captionEditor ? search.value.trim().toLocaleLowerCase() : '';
    let previews = [];
    if (captionEditor && find.value.trim() && replacement.value.trim()) {
      try { previews = findReplaceSample(batch.captions, find.value, replacement.value); } catch { /* Validation is shown when applying. */ }
    }
    batch.captions.forEach((row, i) => {
      if (query && !row.text.toLocaleLowerCase().includes(query)) return;
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'demo-sample-row'; button.setAttribute('aria-pressed', String(i === state().selected));
      button.classList.toggle('is-match', state().matches.includes(row.id));
      const time = document.createElement('span'); time.className = 'demo-sample-time';
      time.textContent = `${clock(row.start)}–${clock(row.end)}`;
      const text = document.createElement('span'); text.className = 'demo-sample-copy'; text.textContent = row.text;
      button.append(time, text);
      if (row.timingPending) { const flag = document.createElement('span'); flag.className = 'demo-caption-after'; flag.textContent = 'Animation needs updating'; button.append(flag); }
      if (previews[i] && previews[i].text !== row.text) {
        const after = document.createElement('span'); after.className = 'demo-caption-after'; after.textContent = `Replace with: ${previews[i].text}`; button.append(after);
      }
      button.addEventListener('click', () => selectCaption(i)); container.append(button);
    });
    if (!container.children.length) { const p = document.createElement('p'); p.className = 'demo-hint'; p.textContent = 'No sample captions match your search.'; container.append(p); }
  }

  function findPreview() {
    const batch = state().batch, replace = $('[data-demo-find-replace]');
    const replacing = !!replacement.value.trim();
    replace.textContent = replacing ? 'Replace all' : 'Find matches';
    if (!batch || !find.value.trim()) {
      state().matches = []; replace.disabled = true;
      findStatus.textContent = batch ? 'Enter a word or phrase to preview matches.' : 'Generate sample captions to find or replace words.';
      return;
    }
    try {
      const matches = findSampleMatches(batch.captions, find.value);
      const count = matches.reduce((sum, item) => sum + item.count, 0);
      state().matches = matches.map(item => item.id);
      const changed = replacing ? findReplaceSample(batch.captions, find.value, replacement.value)
        .filter((row, i) => row.text !== batch.captions[i].text).length : 0;
      replace.disabled = replacing ? !changed : !count;
      if (changed) replace.textContent = `Replace all (${changed})`;
      findStatus.textContent = `${count} whole-word match${count === 1 ? '' : 'es'} in ${matches.length} sample caption${matches.length === 1 ? '' : 's'}.${replacing && count && !changed ? ' The spelling already matches.' : ''}`;
    } catch (error) { replace.disabled = true; state().matches = []; findStatus.textContent = error.message; }
  }

  function render() {
    const current = state(), row = selected(), batch = current.batch;
    const ae = host === 'after-effects';
    root.querySelectorAll('[data-demo-host]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoHost === host)));
    root.querySelectorAll('[data-demo-for-host]').forEach(element => { element.hidden = element.dataset.demoForHost !== host; });
    if (getView() !== 'captions') $('#demo-view-captions').hidden = true;
    $('[data-demo-host-context]').textContent = ae
      ? 'After Effects sample: caption layers in a composition. Use Captions to search and edit words.'
      : 'Premiere Pro sample: editable Motion Graphics clips. Use Edit caption, or try a Properties text edit.';
    batchBox.hidden = getView() === 'settings' || (!batch && !current.history.length);
    $('[data-demo-batch-title]').textContent = `${nameForHost()} sample${batch ? ` · ${batch.captions.length} captions` : ''}`;
    meta.textContent = batch ? `${batch.preset} · ${batch.placement} · Estimated sample timing` : '';
    $('[data-demo-apply]').hidden = !batch || signature(batch.settings) === signature(getSettings());
    $('[data-demo-update]').hidden = !row?.timingPending;
    $('[data-demo-edit]').disabled = !row;
    $('[data-demo-edit]').textContent = ae ? 'Open Captions' : 'Edit caption';
    $('[data-demo-manual-edit]').disabled = !row;
    $('[data-demo-manual-edit]').textContent = ae ? 'Try a Source Text edit' : 'Try a Properties edit';
    $('[data-demo-remove]').disabled = !batch;
    $('[data-demo-undo]').disabled = !current.history.length;
    editor.disabled = !row; $('[data-demo-caption-save]').disabled = !row;
    if (document.activeElement !== editor) editor.value = row?.text || '';
    [search, find, replacement, $('[data-demo-find-replace]')].forEach(control => { control.disabled = !batch; });
    findPreview(); rows($('[data-demo-sample-list]')); rows($('[data-demo-caption-list]'), true);
  }

  function changed(message) { render(); onPreviewChange(); if (message) say(message); }

  function setHost(next) {
    if (!Object.hasOwn(projects, next)) return;
    host = next;
    placement.replaceChildren(...(host === 'after-effects'
      ? [{ value: 'above', text: 'Above selected layers' }, { value: 'top', text: 'Top of the composition' }]
      : premierePlacements).map(item => {
        const option = document.createElement('option'); option.value = item.value; option.textContent = item.text; return option;
      }));
    search.value = ''; find.value = ''; replacement.value = ''; findStatus.textContent = '';
    editor.value = selected()?.text || '';
    onHostChange(host); changed(`${nameForHost()} demo selected. Sample projects are separate for each app.`);
  }

  function generate(captions = clone(SAMPLE_CAPTIONS)) {
    remember();
    state().batch = { captions, settings: clone(getSettings()), preset: getPresetName(), placement: placement.selectedOptions[0].textContent };
    state().selected = 0; state().placedPreview = true; state().matches = [];
    editor.value = captions[0].text;
    changed(`Generated ${captions.length} prepared sample captions for ${nameForHost()}. Timing is estimated; no media was transcribed.`);
  }

  function openEditor(mode = 'edit') {
    if (mode !== 'review' && !selected()) return;
    dialogMode = mode; editError.hidden = true;
    const title = mode === 'review' ? 'Check the sample transcript' : mode === 'manual' ? (host === 'premiere' ? 'Properties text-edit example' : 'Source Text edit example') : 'Edit caption';
    dialog.querySelector('h3').textContent = title;
    dialog.querySelector('label').textContent = mode === 'review' ? 'One sample caption per line (up to three)' : 'Caption text';
    dialog.querySelector('p:not([data-demo-edit-error])').textContent = mode === 'manual'
      ? 'This represents changing native text outside the panel. Save the text, then use Update animation on the sample.'
      : 'Saving updates the sample text and animation together. All timing here is estimated.';
    editSave.textContent = mode === 'review' ? 'Generate sample' : mode === 'manual' ? 'Save text' : 'Save caption';
    editText.value = mode === 'review' ? SAMPLE_CAPTIONS.map(row => row.text).join('\n') : selected().text;
    dialog.showModal(); editText.focus();
  }

  function saveText(text, manual = false) {
    const row = selected(); if (!row) return;
    const clean = text.trim().replace(/\s+/gu, ' '), words = wordsForText(clean, row.words, row.duration);
    if (!words.length) throw new Error('Enter at least one word for this sample caption.');
    if (clean === row.text) { say('Caption text is unchanged.'); return; }
    remember(); row.text = clean; row.timingPending = manual;
    if (!manual) { row.words = words; row.timingEstimated = true; }
    state().placedPreview = true; editor.value = clean;
    changed(manual ? 'Sample text changed. Use Update animation to refresh its highlight.' : 'Caption saved with updated sample animation. New word timing is estimated.');
  }

  root.querySelectorAll('[data-demo-host]').forEach(button => button.addEventListener('click', () => setHost(button.dataset.demoHost)));
  root.querySelectorAll('[data-demo-generate]').forEach(button => button.addEventListener('click', () => $('[data-demo-review]').checked ? openEditor('review') : generate()));
  $('[data-demo-edit]').addEventListener('click', () => {
    if (host === 'after-effects') { setView('captions', true); state().placedPreview = true; render(); onPreviewChange(); editor.focus(); }
    else openEditor();
  });
  $('[data-demo-manual-edit]').addEventListener('click', () => openEditor('manual'));
  $('[data-demo-edit-close]').addEventListener('click', () => dialog.close());
  editSave.addEventListener('click', () => {
    try {
      if (dialogMode === 'review') {
        const lines = editText.value.split(/\n/u).map(line => line.trim()).filter(Boolean);
        if (!lines.length || lines.length > 3) throw new Error('Enter one to three sample caption lines.');
        const captions = lines.map((text, i) => {
          const source = clone(SAMPLE_CAPTIONS[i]); return { ...source, text, words: wordsForText(text, source.words, source.duration), timingEstimated: true };
        });
        generate(captions);
      } else saveText(editText.value, dialogMode === 'manual');
      dialog.close();
    } catch (error) { editError.textContent = error.message; editError.hidden = false; }
  });
  editText.addEventListener('keydown', event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); editSave.click(); } });
  $('[data-demo-caption-save]').addEventListener('click', () => {
    try { saveText(editor.value); } catch (error) { say(error.message); }
  });
  $('[data-demo-update]').addEventListener('click', () => {
    const row = selected(); if (!row?.timingPending) return;
    remember(); row.words = wordsForText(row.text, row.words, row.duration); row.timingPending = false;
    state().placedPreview = true; changed('Sample animation updated. Check new-word timing in the installed panel against your original audio.');
  });
  $('[data-demo-apply]').addEventListener('click', () => {
    if (!state().batch) return; remember(); state().batch.settings = clone(getSettings()); state().batch.preset = getPresetName(); state().placedPreview = true;
    changed('Style applied to the generated sample batch. Caption text is preserved.');
  });
  $('[data-demo-remove]').addEventListener('click', () => {
    if (!state().batch) return; remember(); state().batch = null; state().placedPreview = false; state().matches = [];
    changed('Sample batch removed. Undo restores it.');
  });
  $('[data-demo-undo]').addEventListener('click', () => {
    const prior = state().history.pop(); if (!prior) return;
    state().batch = prior.batch; state().selected = prior.selected; state().placedPreview = !!prior.batch; state().matches = [];
    editor.value = selected()?.text || ''; changed('Last sample change undone.');
  });
  search.addEventListener('input', () => rows($('[data-demo-caption-list]'), true));
  [find, replacement].forEach(input => input.addEventListener('input', () => { findPreview(); rows($('[data-demo-caption-list]'), true); }));
  $('[data-demo-find-replace]').addEventListener('click', () => {
    if (!state().batch) return;
    try {
      if (!find.value.trim()) { findStatus.textContent = 'Enter a whole word or phrase to find.'; return; }
      const matches = findSampleMatches(state().batch.captions, find.value), count = matches.reduce((sum, item) => sum + item.count, 0);
      state().matches = matches.map(item => item.id);
      if (!replacement.value.trim()) {
        const index = state().batch.captions.findIndex(row => state().matches.includes(row.id));
        if (index >= 0) { state().selected = index; editor.value = selected().text; state().placedPreview = true; }
        render(); onPreviewChange(); findStatus.textContent = `Found ${count} whole-word match${count === 1 ? '' : 'es'}. Text is unchanged.`; return;
      }
      const next = findReplaceSample(state().batch.captions, find.value, replacement.value);
      const altered = next.filter((row, i) => row.text !== state().batch.captions[i].text).length;
      if (altered) {
        remember(); state().batch.captions = next.map((row, i) => row.text === state().batch.captions[i].text ? row : { ...row, timingPending: false });
        state().placedPreview = true; editor.value = selected().text;
      }
      render(); onPreviewChange(); findStatus.textContent = `Replaced ${count} match${count === 1 ? '' : 'es'} across ${altered} sample caption${altered === 1 ? '' : 's'}. Timing is estimated.`;
    } catch (error) { findStatus.textContent = error.message; }
  });
  languageSearch.addEventListener('input', languageOptions);
  language.addEventListener('change', () => {
    selectedLanguage = language.value;
    if (customLanguage && selectedLanguage === customLanguage) model.value = 'demo-custom';
    else if (model.value === 'demo-custom') model.value = lastBuiltin;
    modelNote();
  });
  model.addEventListener('change', () => { if (model.value !== 'demo-custom') lastBuiltin = model.value; modelNote(); });
  $('[data-demo-add-model]').addEventListener('click', () => {
    if (![...model.options].some(option => option.value === 'demo-custom')) {
      const option = document.createElement('option'); option.value = 'demo-custom'; option.textContent = 'Example custom model'; model.append(option);
    }
    customLanguage = SPOKEN_LANGUAGES.find(item => /slovak/i.test(item.name))?.code || 'en';
    selectedLanguage = customLanguage; languageSearch.value = ''; languageOptions(); model.value = 'demo-custom'; modelNote();
    say('Example model assigned to Slovak in this browser demo. Real custom models are added in the installed panel.');
  });
  languageOptions(); modelNote();

  return {
    get host() { return host; },
    preview(view) {
      const row = selected();
      return row && (state().placedPreview || view === 'captions')
        ? { words: row.words, settings: state().batch.settings, text: row.text, pending: !!row.timingPending } : null;
    },
    refresh: render,
    initialize() { setHost('premiere'); },
    designChanged() { state().placedPreview = false; render(); },
    reset() {
      projects.premiere = fresh(); projects['after-effects'] = fresh();
      languageSearch.value = ''; selectedLanguage = ''; customLanguage = ''; languageOptions();
      [...model.options].filter(option => option.value === 'demo-custom').forEach(option => option.remove());
      model.value = [...model.options].find(option => /turbo/i.test(option.textContent))?.value || model.options[0].value; lastBuiltin = model.value;
      modelNote(); setHost('premiere');
    },
  };
}
