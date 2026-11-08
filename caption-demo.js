import { DEFAULTS, PRESETS, GROUPING_DEFAULTS, FIRST_PRESET, PANEL_VERSION, WORDS, WORD_TIMES, LOOP, frameAt, phraseFrameAt, hexAlpha, previewLetterSpacing } from './caption-engine.mjs?v=demo-1.1.9-20261108';
import { PRESET_META } from './caption-presets.mjs?v=demo-1.1.9-20261108';
import { groupWords, autoCharsPerLine } from './caption-grouping.mjs?v=demo-1.1.9-20261108';
import { decodePreset, encodePreset } from './caption-preset-format.mjs?v=demo-1.1.9-20261108';
import { initSampleWorkflow } from './caption-workflow.mjs?v=demo-1.1.9-20261108';

const PREVIEW_WORDS = WORDS.map((text, i) => ({ id: `preview-${i}`, text, start: WORD_TIMES[i], end: WORD_TIMES[i] + .55 }));

const GROUP_KEYS = {
  text: ['font', 'gFontSize', 'gPosY', 'gTracking', 'textColor'],
  highlight: ['karaoke', 'hlMode', 'hlColor', 'gHlScale', 'gPillRadius', 'gHlPop'],
  stroke: ['gStroke', 'strokeColor'],
  shadow: ['gShadow', 'gShadowDist', 'gShadowBlur', 'gShadowDir', 'shadowColor'],
  background: ['boxColor', 'gBoxOpacity', 'gBoxBounce'],
  animation: ['gAnimStyle', 'gAnimOut', 'gAnimDur', 'gPop', 'gSlideTime', 'gEaseIn', 'gEaseOut', 'gOutDur', 'gOutPop', 'gOutEaseIn', 'gOutEaseOut'],
};
const IN_STRENGTH = { 1: 'Overshoot', 3: 'Blur amount', 4: 'Distance', 5: 'Distance', 9: 'Lift', 10: 'Spread', 11: 'Amplitude', 12: 'Rise height', 13: 'Distance' };
const OUT_STRENGTH = { 2: 'Blur amount', 3: 'Distance', 4: 'Distance', 5: 'Shrink' };

function settingLabel(key, value) {
  const n = Math.round(+value);
  if (key === 'gFontSize') return `${Math.round(n / 1000 * 1080)}px`;
  if (['gAnimDur', 'gOutDur', 'gSlideTime'].includes(key)) return `${(n / 10).toFixed(1)}s`;
  if (key === 'gHlScale') return `${100 + n}%`;
  if (key === 'gPillRadius') return n === 0 ? 'Square' : n >= 56 ? 'Round' : `${n}px`;
  if (key === 'gHlPop') return n === 0 ? 'Off' : `${n}%`;
  if (key === 'gTracking') return `${n}px`;
  if (key === 'gMaxChars') return n ? String(n) : 'No limit';
  if (key === 'gMaxDur') return +value ? `${(+value).toFixed(1)}s` : 'No limit';
  if (key === 'gShadowDir') return `${n}°`;
  if (['gStroke', 'gShadowDist', 'gShadowBlur'].includes(key)) return key === 'gStroke' && n === 0 ? 'None' : `${n}px`;
  if (['gShadow', 'gBoxOpacity'].includes(key)) return n === 0 ? 'None' : `${n}%`;
  if (['gPosY', 'gEaseIn', 'gEaseOut', 'gOutEaseIn', 'gOutEaseOut'].includes(key)) return `${n}%`;
  return ['gPop', 'gOutPop'].includes(key) && n === 0 ? 'None' : String(n);
}


const FONTS = { impact: 'Impact, Anton, sans-serif', 'montserrat-black': 'Montserrat, sans-serif', 'montserrat-xbold': 'Montserrat, sans-serif',
  'montserrat-bold': 'Montserrat, sans-serif', 'montserrat-medium': 'Montserrat, sans-serif', anton: 'Anton, Impact, sans-serif', bangers: 'Bangers, Impact, sans-serif',
  luckiest: '"Luckiest Guy", Impact, sans-serif', inter: 'Inter, sans-serif', dmserif: '"DM Serif Display", Georgia, serif',
  sans: 'Arial, sans-serif', serif: 'Georgia, serif', mono: '"Courier New", monospace' };
// The free fonts the plugin installs come in one weight each.
const WEIGHTS = { 'montserrat-black': '900', 'montserrat-xbold': '800', 'montserrat-bold': '700', 'montserrat-medium': '500', inter: '600' };
const fontWeight = font => WEIGHTS[font] || '400';
const BASE = { ...DEFAULTS, ...GROUPING_DEFAULTS, textColor: '#FFFFFF', hlColor: '#FFEB3B', strokeColor: '#000000', shadowColor: '#000000', boxColor: '#000000', font: 'impact', gBoxBounce: false };

function fillCaption(caption, words = PREVIEW_WORDS) {
  caption.replaceChildren(...words.flatMap((item, index) => {
    const br = document.createElement('br'); br.hidden = true;
    const word = document.createElement('span'); word.className = 'demo-word'; word.textContent = item.text; word.dataset.wordId = item.id ?? String(index); return [br, word];
  }));
}
function paintCaption(caption, s, seconds, words = PREVIEW_WORDS, settled = false) {
  const wordsKey = JSON.stringify(words);
  if (caption.wordsKey !== wordsKey) { fillCaption(caption, words); caption.wordsKey = wordsKey; }
  if (!words.length) return;
  const stage = caption.closest('.demo-stage');
  const groupingKey = JSON.stringify([wordsKey, s.textCase, s.gStripPunct, s.gMinWords, s.gMaxWords, s.gMaxChars, s.gMaxDur, s.gMaxLines, s.karaoke, s.gFontSize, s.gTracking]);
  if (caption.groupingKey !== groupingKey) {
    caption.groupingKey = groupingKey;
    caption.phrases = groupWords(words, {
      layout: { maxCharsPerLine: autoCharsPerLine(1080, 1920, s.gFontSize / 10, s.gTracking) || 16, maxLines: s.gMaxLines, maxWordsPerPhrase: Math.min(s.gMaxWords, s.karaoke ? 8 : 36), minWordsPerPhrase: s.gMinWords, maxCharsPerPhrase: s.gMaxChars, maxDurationSec: s.gMaxDur, maxGapSec: .8, stripPunctuation: s.gStripPunct, textCase: s.textCase },
      timing: { holdSec: .12, minPhraseSec: .9 },
    });
  }
  const phrase = settled ? caption.phrases[0] : caption.phrases.findLast(p => p.start <= seconds) || caption.phrases[0];
  const nextPhrase = caption.phrases[caption.phrases.indexOf(phrase) + 1], phraseEnd = nextPhrase?.start ?? LOOP;
  const duration = Math.max(.01, phraseEnd - phrase.start);
  const displaySeconds = settled ? phrase.start + Math.min(duration / 2, Math.max(.1, s.gAnimDur / 10)) : seconds;
  const wordFrame = frameAt(s, displaySeconds, words);
  const frame = phraseFrameAt(s, Math.max(0, displaySeconds - phrase.start), phrase.words.map(word => ({ ...word, start: word.start - phrase.start, end: word.end - phrase.start })), duration);
  const visibleWords = new Map(phrase.words.map((word, i) => [String(word.id), { ...word, lineStart: i > 0 && phrase.lines.some(line => line[0] === i) }]));
  const scale = stage.clientWidth / 640 || 1;
  caption.style.fontFamily = FONTS[s.font]; caption.style.fontWeight = fontWeight(s.font);
  const imported = s.importedFont?.previewFont === s.font && !s.fontNotice ? s.importedFont : null;
  if (imported && Number.isFinite(imported.fontWeight)) caption.style.fontWeight = String(imported.fontWeight);
  caption.style.fontStyle = imported && (imported.fontItalic ?? /italic|oblique/i.test(imported.fontPS || '')) ? 'italic' : 'normal';
  caption.style.fontSize = `${46 * s.gFontSize / 52}px`; caption.style.color = s.textColor;
  caption.style.webkitTextStroke = `${s.gStroke * 0.36}px ${s.strokeColor}`;
  const angle = (s.gShadowDir - 45) * Math.PI / 180, distance = s.gShadowDist * 0.6;
  caption.style.textShadow = s.gShadow > 0 ? `${Math.cos(angle) * distance}px ${Math.sin(angle) * distance}px ${s.gShadowBlur * 0.8}px ${hexAlpha(s.shadowColor, s.gShadow)}` : 'none';
  const background = hexAlpha(s.boxColor, s.gBoxOpacity);
  caption.style.backgroundColor = s.gBoxBounce ? 'transparent' : background;
  caption.style.setProperty('--demo-bounce-bg', background); caption.classList.toggle('has-box-bounce', s.gBoxBounce);
  caption.style.setProperty('--demo-box-scale', wordFrame.words[wordFrame.active]?.scale ?? 1);
  caption.style.padding = s.gBoxOpacity > 0 ? '12px 24px' : '0';
  caption.style.opacity = String(frame.opacity); caption.style.filter = `blur(${frame.blur * 2}px)`;
  caption.style.clipPath = frame.clip > 0 ? `inset(0 ${frame.clip}% 0 0)` : 'none';
  caption.style.letterSpacing = `${previewLetterSpacing(s, frame)}px`;
  [...caption.querySelectorAll('.demo-word')].forEach((node, i) => {
    const id = String(words[i].id);
    node.hidden = !visibleWords.has(id); node.previousElementSibling.hidden = !visibleWords.get(id)?.lineStart;
    const active = s.karaoke && wordFrame.active === i, pill = active && s.hlMode === 'pill';
    node.textContent = visibleWords.get(id)?.text || words[i].text;
    node.style.color = active && !pill ? s.hlColor : s.textColor;
    node.style.backgroundColor = pill ? s.hlColor : 'transparent';
    node.style.padding = pill ? '6px 16px' : '0'; node.style.fontSize = `${active ? 1 + s.gHlScale / 100 : 1}em`;
    node.style.borderRadius = s.gPillRadius >= 56 ? '999px' : `${s.gPillRadius * 0.5}px`;
    node.style.opacity = String(wordFrame.words[i].opacity);
    node.style.transform = `translateY(${wordFrame.words[i].y * 2}px) scale(${wordFrame.words[i].scale})`;
  });
  // The plugin crops a wide 320x120 preview into a fixed-height strip.
  const visibleHeight = Math.min(240, stage.clientHeight / scale), height = caption.offsetHeight;
  const fit = Math.min(1, Math.max(20, visibleHeight - 16) / Math.max(1, height), 560 / Math.max(1, caption.scrollWidth));
  const room = Math.max(0, (visibleHeight - height * fit) / 2 - 8);
  const offset = Math.max(-room, Math.min(room, (s.gPosY - DEFAULTS.gPosY) * 1.2));
  caption.parentElement.style.top = `${120 + offset}px`;
  caption.style.transform = `translateY(${frame.y * 2}px) scale(${frame.scale * fit})`;
  stage.querySelector('.demo-scene').style.transform = `translate(-50%, -50%) scale(${scale})`;
}

const root = document.querySelector('[data-caption-demo]');
if (root) initDemo(root);
function initDemo(root) {
  const form = root.querySelector('.demo-controls'), caption = root.querySelector('.demo-caption');
  const status = root.querySelector('[data-demo-status]'), toggle = root.querySelector('[data-demo-play]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const grid = root.querySelector('[aria-label="Built-in caption presets"]'), userGrid = root.querySelector('.demo-user-preset-grid');
  const dialog = root.querySelector('.demo-save-dialog:not(.demo-preset-actions-dialog)'), actions = root.querySelector('.demo-preset-actions-dialog');
  const nameInput = root.querySelector('#demo-preset-name'), error = root.querySelector('.demo-save-error');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)'), saved = new Map(), tileCaptions = new Map();
  const base = BASE;
  let settings = { ...base }, baseline = { ...base }, activePreset = FIRST_PRESET;
  let view = 'presets', filter = 'All', mainPreset = '', renameFrom = '', saveSettings = null;
  let playing = false, inView = false, time = 1, raf = 0, previous = null, workflow;
  root.querySelector('.demo-version').textContent = `${PANEL_VERSION} demo`;
  const fontNotice = document.createElement('p'); fontNotice.className = 'demo-hint'; fontNotice.hidden = true;
  form.querySelector('#demo-font').parentElement.append(fontNotice);
  fillCaption(caption);
  function normalize(raw) {
    const result = { ...base };
    for (const key of Object.keys(base)) {
      const value = key === 'textCase' ? raw?.gCase ?? raw?.textCase : raw?.[key];
      const control = form.querySelector(`[data-setting="${key}"]`);
      if (typeof base[key] === 'boolean' && typeof value === 'boolean') result[key] = value;
      else if (typeof base[key] === 'number' && Number.isFinite(value)) result[key] = control ? Math.max(+control.min, Math.min(+control.max, key === 'gMaxDur' ? value : Math.round(value))) : value;
      else if (/Color$/.test(key) && /^#[0-9a-f]{6}$/i.test(value)) result[key] = value;
      else if (control?.tagName === 'SELECT' && [...control.options].some(option => option.value === value)) result[key] = value;
    }
    if (raw?.importedFont && typeof raw.importedFont === 'object' && raw.importedFont.previewFont === result.font) {
      const imported = { previewFont: result.font };
      ['fontPS', 'fontFamily', 'fontFam'].forEach(key => { if (typeof raw.importedFont[key] === 'string') imported[key] = raw.importedFont[key].slice(0, 80); });
      if (Number.isFinite(raw.importedFont.fontWeight)) imported.fontWeight = raw.importedFont.fontWeight;
      if (typeof raw.importedFont.fontItalic === 'boolean') imported.fontItalic = raw.importedFont.fontItalic;
      result.importedFont = imported;
    }
    if (typeof raw?.fontNotice === 'string') result.fontNotice = raw.fontNotice.slice(0, 300);
    return result;
  }
  try {
    const entries = JSON.parse(localStorage.getItem('captionsgen-demo-presets') || '[]');
    if (Array.isArray(entries)) entries.slice(0, 30).forEach(entry => {
      if (typeof entry?.name === 'string' && entry.name.trim() && entry.name.length <= 40 && !Object.hasOwn(PRESETS, entry.name)) {
        const value = { ...entry.settings };
        if (value.v !== 4 && Number.isFinite(value.gTracking)) value.gTracking = Math.max(0, Math.min(16, Math.round(value.gTracking * 10)));
        saved.set(entry.name, normalize(value));
      }
    });
    mainPreset = localStorage.getItem('captionsgen-demo-main') || '';
    if (!Object.hasOwn(PRESETS, mainPreset) && !saved.has(mainPreset)) mainPreset = '';
  } catch { /* Built-ins remain usable when storage is blocked. */ }
  function persist() {
    localStorage.setItem('captionsgen-demo-presets', JSON.stringify([...saved].map(([name, settings]) => ({ name, settings:{...settings, v:4} }))));
  }
  function stateFor(name) {
    const preset = PRESETS[name] || {};
    if (saved.has(name)) return { ...saved.get(name) };
    const next = { ...base, ...preset, font: preset.font || settings.font };
    if (!preset.font && settings.importedFont?.previewFont === next.font) {
      next.importedFont = { ...settings.importedFont };
      if (settings.fontNotice) next.fontNotice = settings.fontNotice;
    }
    return next;
  }
  function edited() { return Object.keys(base).some(key => settings[key] !== baseline[key]) || JSON.stringify(settings.importedFont) !== JSON.stringify(baseline.importedFont); }
  function playLabel() {
    toggle.textContent = playing ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', playing ? 'Pause caption preview' : 'Play caption preview');
  }
  function controls() {
    form.querySelectorAll('[data-setting]').forEach(control => {
      const key = control.dataset.setting;
      if (control.type === 'checkbox') control.checked = !!settings[key]; else control.value = String(settings[key]);
      const output = form.querySelector(`[data-output="${key}"]`);
      if (output) output.value = settingLabel(key, settings[key]);
    });
    form.querySelector('[data-highlight-fields]').disabled = !settings.karaoke;
    form.querySelector('[data-pill-field]').hidden = settings.hlMode !== 'pill';
    form.querySelector('[data-design-name]').textContent = activePreset;
    form.querySelector('[data-design-edited]').hidden = !edited();
    form.querySelector('[data-design-star]').hidden = activePreset !== mainPreset;
    form.querySelector('#demo-font').style.fontFamily = FONTS[settings.font];
    form.querySelector('#demo-font').style.fontWeight = fontWeight(settings.font);
    fontNotice.hidden = !settings.fontNotice; fontNotice.textContent = settings.fontNotice || '';
    form.querySelectorAll('[data-color-name]').forEach(label => { label.textContent = settings[label.dataset.colorName].toUpperCase(); });
    form.querySelectorAll('[data-text-case]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.textCase === settings.textCase)));
    form.querySelector('[data-line-value]').textContent = settings.gMaxLines;
    const min = Math.min(settings.gMinWords, settings.gMaxWords), max = Math.min(settings.gMaxWords, settings.karaoke ? 8 : 36);
    form.querySelector('[data-grouping-summary]').textContent = `${{none:'As spoken',upper:'ABC',lower:'abc',sentence:'Abc'}[settings.textCase]} · ${Math.min(min, max) < max ? `${Math.min(min, max)}–` : ''}${max} word${max === 1 ? '' : 's'} · ${settings.gMaxLines} line${settings.gMaxLines === 1 ? '' : 's'}`;
    updateGroups(); playLabel(); workflow?.refresh();
  }
  function updateGroups() {
    const value = key => settingLabel(key, settings[key]);
    const parts = values => values.filter(Boolean).join(' · ');
    const option = key => form.querySelector(`[data-setting="${key}"]`).selectedOptions[0].textContent;
    const color = key => settings[key] !== base[key] || (PRESETS[activePreset] || baseline)[key] ? settings[key] : '';
    const summaries = {
      text: parts([settings.font === 'impact' ? '' : option('font'), value('gFontSize'), settings.gPosY === DEFAULTS.gPosY ? '' : `Top ${value('gPosY')}`, settings.gTracking === 0 ? '' : `Spacing ${value('gTracking')}`, color('textColor')]),
      highlight: settings.karaoke ? parts([settings.hlMode === 'pill' ? 'Pill' : 'Color swap', color('hlColor'), settings.gHlScale ? value('gHlScale') : '', settings.hlMode === 'pill' && settings.gPillRadius !== DEFAULTS.gPillRadius ? `Corners ${value('gPillRadius')}` : '', settings.gHlPop ? `Bounce ${value('gHlPop')}` : '']) : 'Off',
      stroke: parts([value('gStroke'), color('strokeColor')]),
      shadow: parts([value('gShadow'), settings.gShadow && settings.gShadowDist !== DEFAULTS.gShadowDist ? value('gShadowDist') : '', settings.gShadow && settings.gShadowBlur !== DEFAULTS.gShadowBlur ? `Blur ${value('gShadowBlur')}` : '', settings.gShadow && settings.gShadowDir !== DEFAULTS.gShadowDir ? value('gShadowDir') : '', color('shadowColor')]),
      background: settings.gBoxOpacity ? parts([color('boxColor'), value('gBoxOpacity')]) : 'None',
      animation: parts([option('gAnimStyle'), +settings.gAnimStyle ? value('gAnimDur') : '', +settings.gAnimStyle && settings.gPop !== DEFAULTS.gPop ? value('gPop') : '', +settings.gAnimOut ? `Out: ${option('gAnimOut')}` : '']),
    };
    Object.entries(GROUP_KEYS).forEach(([group, keys]) => {
      form.querySelector(`[data-summary="${group}"]`).textContent = summaries[group];
      form.querySelector(`[data-reset-group="${group}"]`).hidden = keys.every(key => settings[key] === baseline[key]);
    });
    const show = (id, visible) => { form.querySelector(`#demo-${id}`).hidden = !visible; };
    const anim = +settings.gAnimStyle, out = +settings.gAnimOut;
    show('durField', anim !== 0); show('popField', !!IN_STRENGTH[anim]); show('slideTimeField', anim === 12);
    show('easeInField', [4, 5, 12, 13].includes(anim)); show('easeOutField', [4, 5, 12, 13].includes(anim));
    show('outDurField', out !== 0); show('outPopField', !!OUT_STRENGTH[out]); show('outEaseInField', out !== 0); show('outEaseOutField', out !== 0);
    form.querySelector('#demo-gPopLabel').textContent = IN_STRENGTH[anim] || 'Strength';
    form.querySelector('#demo-gOutPopLabel').textContent = OUT_STRENGTH[out] || 'Strength';
  }
  function draw() {
    if (view === 'settings') return;
    const sample = workflow?.preview(view);
    const previewSettings = sample?.settings || settings;
    const previewWords = sample?.pending ? [{ id:'pending-text', text:sample.text, start:0, end:LOOP }] : sample?.words || PREVIEW_WORDS;
    paintCaption(caption, sample?.pending ? { ...previewSettings, karaoke:false, gAnimStyle:'0', gAnimOut:'0', gBoxBounce:false, textCase:'none', gStripPunct:false } : previewSettings, sample?.pending ? 1 : time, previewWords, !playing && time === 1);
    toggle.disabled = !!sample?.pending;
    root.querySelector('.demo-live').textContent = sample ? sample.pending ? 'Update animation' : 'Sample caption' : 'Design preview';
    root.querySelector('.demo-look-card .demo-stage').setAttribute('aria-label', `Animated caption preview: ${sample?.text || WORDS.join(' ')}`);
  }
  function tick(now) {
    raf = 0;
    time += previous === null ? 0 : Math.min((now - previous) / 1000, .1); previous = now;
    if (time >= LOOP) { time = 1; playing = false; playLabel(); }
    draw(); schedule();
  }
  function schedule() {
    if (inView && !document.hidden && view !== 'settings' && playing) { if (!raf) raf = requestAnimationFrame(tick); }
    else { cancelAnimationFrame(raf); raf = 0; previous = null; }
  }
  function replay() { time = 0; playing = true; previous = null; playLabel(); draw(); schedule(); }
  function setView(next, focus = false) {
    if (next === 'captions' && workflow?.host !== 'after-effects') next = 'presets';
    view = next; previous = null;
    tabs.forEach(tab => {
      const active = tab.dataset.view === next;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      root.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden = !active;
      if (active && focus) tab.focus();
    });
    root.querySelector('[data-demo-look]').hidden = next === 'settings';
    root.querySelector('[data-customize-link]').hidden = next !== 'presets';
    if (next === 'presets') renderGallery();
    workflow?.refresh(); draw(); schedule();
  }
  function load(name, animate = false) {
    settings = stateFor(name); baseline = { ...settings }; activePreset = name;
    workflow?.designChanged();
    time = 1; playing = false; controls(); draw();
    if (view === 'presets') renderGallery();
    if (animate && !reducedMotion.matches) replay();
    status.textContent = `${name} preset applied.`;
  }
  function uniqueName(name) {
    const original = String(name).trim().slice(0, 34) || 'My caption style'; let next = original, n = 2;
    while (Object.hasOwn(PRESETS, next) || saved.has(next)) next = `${original} ${n++}`;
    return next;
  }
  function savePreset(name, value) {
    if (saved.size >= 30 && !saved.has(name)) { status.textContent = 'You can save up to 30 designs in this browser.'; return false; }
    const old = saved.get(name); saved.set(name, { ...value });
    try { persist(); } catch { if (old) saved.set(name, old); else saved.delete(name); status.textContent = 'Browser storage is unavailable. The design could not be saved.'; return false; }
    return true;
  }
  function openSave(value = settings, rename = '') {
    actions.close(); renameFrom = rename; saveSettings = { ...value };
    nameInput.value = rename; error.hidden = true; dialog.showModal(); nameInput.focus();
  }
  function tileMenu(name) {
    const menu = document.createElement('dialog'); menu.className = 'demo-save-dialog'; menu.setAttribute('aria-label', `${name} preset actions`);
    const head = document.createElement('div'); head.className = 'demo-dialog-head';
    const title = document.createElement('h3'); title.textContent = name;
    const close = document.createElement('button'); close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', 'Close preset actions'); close.addEventListener('click', () => menu.close());
    head.append(title, close); menu.append(head);
    const action = (label, fn) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'demo-menu-action'; button.textContent = label; button.addEventListener('click', () => { menu.close(); fn(); }); menu.append(button); };
    action(mainPreset === name ? 'Stop opening on this preset' : '★ Make main preset', () => {
      const next = mainPreset === name ? '' : name;
      try { localStorage.setItem('captionsgen-demo-main', next); } catch { status.textContent = 'Browser storage is unavailable. The main preset was not changed.'; return; }
      mainPreset = next; controls(); renderGallery(); status.textContent = next ? `This demo now opens on ${name}.` : 'Main preset cleared.';
    });
    action('Duplicate', () => { const next = uniqueName(`${name} copy`); if (savePreset(next, stateFor(name))) load(next); });
    if (saved.has(name)) {
      action('Rename…', () => openSave(saved.get(name), name));
      action('Export…', () => {
        try {
          const value = encodePreset(name, saved.get(name));
          const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type:'application/json' }));
          const link = document.createElement('a'); link.href = url; link.download = `${name.replace(/[^a-z0-9 _-]/gi, '_')}.cgpreset`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
          status.textContent = `${name} exported. Import the file in Captions Gen.`;
        } catch (error) { status.textContent = error.message; }
      });
      action('Delete…', () => {
        const old = saved.get(name); saved.delete(name);
        try { persist(); } catch { saved.set(name, old); status.textContent = 'Browser storage is unavailable. The design was not deleted.'; return; }
        if (mainPreset === name) { mainPreset = ''; try { localStorage.removeItem('captionsgen-demo-main'); } catch {} }
        if (activePreset === name) load(FIRST_PRESET); else { controls(); renderGallery(); }
        status.textContent = `${name} deleted from this browser.`;
      });
    }
    menu.addEventListener('close', () => menu.remove()); root.append(menu); menu.showModal();
  }
  function renderGallery() {
    grid.replaceChildren(); userGrid.replaceChildren(); tileCaptions.clear();
    root.querySelectorAll('[data-preset-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.presetFilter === filter)));
    root.querySelector('.demo-preset-empty').hidden = saved.size > 0;
    root.querySelector('[data-preset-description]').textContent = PRESET_META[activePreset]?.desc || 'Your saved caption design.';
    const names = [...saved.keys(), ...Object.keys(PRESETS).filter(name => filter === 'All' || PRESET_META[name]?.cat === filter)];
    for (const name of names) {
      const tile = document.createElement('div'); tile.className = 'demo-preset-tile'; tile.dataset.presetName = name; tile.classList.toggle('is-selected', activePreset === name);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'demo-preset-select';
      button.setAttribute('aria-label', `Use ${name} preset`); button.setAttribute('aria-pressed', String(activePreset === name));
      const preview = document.createElement('span'); preview.className = 'demo-stage demo-tile-stage'; preview.setAttribute('aria-hidden', 'true');
      preview.innerHTML = '<span class="demo-scene"><span class="demo-caption-anchor"><span class="demo-caption"></span></span></span>';
      const text = document.createElement('span'); text.className = 'demo-preset-name'; text.textContent = name;
      button.append(preview, text); button.addEventListener('click', () => load(name, true)); tile.append(button);
      const more = document.createElement('button'); more.type = 'button'; more.className = 'demo-tile-more'; more.textContent = '⋯'; more.setAttribute('aria-label', `${name} preset actions`); more.addEventListener('click', () => tileMenu(name)); tile.append(more);
      if (name === mainPreset) { const star = document.createElement('span'); star.className = 'demo-tile-star'; star.textContent = '★'; star.setAttribute('aria-label', 'Main preset'); tile.append(star); }
      (saved.has(name) ? userGrid : grid).append(tile);
      const cap = preview.querySelector('.demo-caption'); fillCaption(cap); tileCaptions.set(name, cap); paintCaption(cap, stateFor(name), 1, PREVIEW_WORDS, true);
    }
  }
  for (const name of ['All', 'Trend', 'Clean', 'Motion']) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.presetFilter = name; button.textContent = name;
    button.addEventListener('click', () => { filter = name; renderGallery(); }); root.querySelector('.demo-categories').append(button);
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setView(tab.dataset.view));
    tab.addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        const visible = tabs.filter(item => !item.hidden), i = visible.indexOf(tab);
        event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + visible.length) % visible.length;
        setView(visible[next].dataset.view, true);
      }
    });
  });
  root.querySelector('[data-customize-link]').addEventListener('click', () => setView('customize', true));
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    const control = event.target; if (!control.matches('[data-setting]')) return;
    settings[control.dataset.setting] = control.type === 'checkbox' ? control.checked : control.type === 'range' ? +control.value : control.value;
    if (control.dataset.setting === 'font') { delete settings.importedFont; delete settings.fontNotice; }
    workflow?.designChanged();
    controls(); draw(); status.textContent = `${activePreset} · edited. Preview updated.`;
    if (GROUP_KEYS.animation.includes(control.dataset.setting) && !reducedMotion.matches) replay();
  });
  form.querySelectorAll('[data-text-case]').forEach(button => button.addEventListener('click', () => { const input = form.querySelector('#demo-textCase'); input.value = button.dataset.textCase; input.dispatchEvent(new Event('input', {bubbles:true})); }));
  form.querySelectorAll('[data-line-step]').forEach(button => button.addEventListener('click', () => { const input = form.querySelector('#demo-gMaxLines'); input.value = Math.min(3, Math.max(1, settings.gMaxLines + +button.dataset.lineStep)); input.dispatchEvent(new Event('input', {bubbles:true})); }));
  form.querySelectorAll('.color-btn').forEach(field => {
    const input = field.querySelector('input'); field.addEventListener('click', event => { if (event.target !== input) { if (typeof input.showPicker === 'function') input.showPicker(); else input.click(); } });
  });
  form.querySelectorAll('.demo-group').forEach(group => {
    const button = group.querySelector('.dg-head'), body = group.querySelector('.dg-body');
    group.classList.toggle('is-open', button.getAttribute('aria-expanded') === 'true');
    button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); body.hidden = !open; group.classList.toggle('is-open', open); });
    group.querySelector('[data-reset-group]').addEventListener('click', () => {
      GROUP_KEYS[group.dataset.group].forEach(key => { settings[key] = baseline[key]; });
      if (group.dataset.group === 'text') { delete settings.importedFont; delete settings.fontNotice; if (baseline.importedFont) settings.importedFont = structuredClone(baseline.importedFont); if (baseline.fontNotice) settings.fontNotice = baseline.fontNotice; }
      workflow?.designChanged(); controls(); draw(); status.textContent = `${group.querySelector('.dg-title').textContent} settings reset.`;
    });
  });
  root.querySelector('[data-demo-reset]').addEventListener('click', () => { workflow?.reset(); settings = { ...base }; load(mainPreset || FIRST_PRESET); setView('presets'); status.textContent = 'Sample projects reset. Your saved presets are kept.'; });
  toggle.addEventListener('click', () => { if (playing) { playing = false; playLabel(); schedule(); } else replay(); });
  const presetActionButton = root.querySelector('[data-preset-actions]');
  presetActionButton.addEventListener('click', () => {
    actions.querySelector('[data-actions-title]').textContent = activePreset;
    actions.querySelector('[data-preset-update]').hidden = !edited() || !saved.has(activePreset);
    actions.querySelector('[data-preset-revert]').hidden = !edited();
    actions.querySelector('[data-demo-save]').textContent = saved.has(activePreset) ? 'Save as new preset…' : 'Save as preset…';
    presetActionButton.setAttribute('aria-expanded', 'true'); actions.showModal();
  });
  actions.addEventListener('close', () => presetActionButton.setAttribute('aria-expanded', 'false'));
  actions.querySelector('[data-actions-close]').addEventListener('click', () => actions.close());
  actions.querySelector('[data-preset-update]').addEventListener('click', () => { if (saved.has(activePreset) && savePreset(activePreset, settings)) { baseline = { ...settings }; controls(); if (view === 'presets') renderGallery(); status.textContent = `${activePreset} updated in this browser.`; } actions.close(); });
  actions.querySelector('[data-preset-revert]').addEventListener('click', () => { settings = { ...baseline }; workflow?.designChanged(); controls(); draw(); actions.close(); status.textContent = 'Preset changes reverted.'; });
  root.querySelectorAll('[data-demo-save]').forEach(button => button.addEventListener('click', () => openSave()));
  root.querySelector('[data-save-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); const name = nameInput.value.trim();
    if (!name || Object.hasOwn(PRESETS, name) || (saved.has(name) && name !== renameFrom)) { error.textContent = 'Choose a name different from an existing preset.'; error.hidden = false; return; }
    if (renameFrom) {
      const old = saved.get(renameFrom); saved.delete(renameFrom);
      if (!savePreset(name, saveSettings)) { saved.set(renameFrom, old); error.textContent = status.textContent; error.hidden = false; return; }
      if (mainPreset === renameFrom) { mainPreset = name; try { localStorage.setItem('captionsgen-demo-main', name); } catch {} }
    } else if (!savePreset(name, saveSettings)) { error.textContent = status.textContent; error.hidden = false; return; }
    dialog.close(); load(name); status.textContent = `${name} saved in this browser.`;
  });
  const fileInput = root.querySelector('[data-import-file]');
  root.querySelector('[data-demo-import]').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0]; if (!file) return;
    try {
      if (file.size > 100000) throw new Error('Choose a preset file smaller than 100 KB.');
      const value = JSON.parse(await file.text());
      const decoded = decodePreset(value), imported = normalize({ ...decoded.settings, fontNotice: decoded.notice });
      const name = uniqueName(decoded.name || file.name.replace(/\.[^.]+$/, ''));
      if (savePreset(name, imported)) { load(name); status.textContent = `${name} imported into this browser.${decoded.notice ? ` ${decoded.notice}` : ''}`; }
    } catch (e) { status.textContent = e.message || 'The preset could not be imported.'; }
    fileInput.value = '';
  });
  new ResizeObserver(() => { draw(); if (view === 'presets') tileCaptions.forEach((cap, name) => paintCaption(cap, stateFor(name), 1, PREVIEW_WORDS, true)); }).observe(root);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: .05 }).observe(root);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => { if (event.matches) { playing = false; time = 1; draw(); playLabel(); schedule(); } });
  workflow = initSampleWorkflow(root, {
    getSettings: () => settings, getPresetName: () => activePreset, getView: () => view, setView,
    onHostChange(host) { if (host === 'premiere' && view === 'captions') setView('presets'); },
    onPreviewChange() { time = 1; playing = false; previous = null; playLabel(); draw(); schedule(); },
  });
  workflow.initialize();
  load(mainPreset || FIRST_PRESET); setView('presets'); root.classList.add('demo-ready');
  document.fonts.ready.then(() => { draw(); if (view === 'presets') renderGallery(); });
}
