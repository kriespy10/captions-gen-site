import { DEFAULTS, PRESETS, WORDS, LOOP, frameAt, hexAlpha, pillTextColor } from './caption-engine.mjs?v=panel-20261021';
import { PRESET_META } from './caption-presets.mjs?v=panel-20261021';

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
  if (key === 'gTracking') return String(n * 10);
  if (key === 'gShadowDir') return `${n}°`;
  if (['gStroke', 'gShadowDist', 'gShadowBlur'].includes(key)) return key === 'gStroke' && n === 0 ? 'None' : `${n}px`;
  if (['gShadow', 'gBoxOpacity'].includes(key)) return n === 0 ? 'None' : `${n}%`;
  if (['gPosY', 'gEaseIn', 'gEaseOut', 'gOutEaseIn', 'gOutEaseOut'].includes(key)) return `${n}%`;
  return ['gPop', 'gOutPop'].includes(key) && n === 0 ? 'None' : String(n);
}


const FONTS = { impact: 'Impact, Anton, sans-serif', 'montserrat-black': 'Montserrat, sans-serif', 'montserrat-xbold': 'Montserrat, sans-serif',
  'montserrat-bold': 'Montserrat, sans-serif', 'montserrat-medium': 'Montserrat, sans-serif', anton: 'Anton, Impact, sans-serif', bangers: 'Bangers, Impact, sans-serif',
  luckiest: '"Luckiest Guy", Impact, sans-serif', inter: 'Inter, sans-serif', dmserif: '"DM Serif Display", Georgia, serif',
  sans: '"Instrument Sans", sans-serif', serif: 'Georgia, serif', mono: '"Courier New", monospace' };
// The free fonts the plugin installs come in one weight each.
const WEIGHTS = { 'montserrat-black': '900', 'montserrat-xbold': '800', 'montserrat-bold': '700', 'montserrat-medium': '500', inter: '600' };
const fontWeight = font => WEIGHTS[font] || (['impact', 'anton', 'bangers', 'luckiest', 'dmserif'].includes(font) ? '400' : '700');
const BASE = { ...DEFAULTS, textColor: '#FFFFFF', hlColor: '#FFEB3B', strokeColor: '#000000', shadowColor: '#000000', boxColor: '#000000', font: 'impact', textCase: 'upper', gBoxBounce: false };

function fillCaption(caption) {
  caption.replaceChildren(...WORDS.map(text => {
    const word = document.createElement('span'); word.className = 'demo-word'; word.textContent = text; return word;
  }));
}
function paintCaption(caption, s, seconds) {
  const frame = frameAt(s, seconds), stage = caption.closest('.demo-stage');
  const scale = stage.clientWidth / 640 || 1;
  caption.style.fontFamily = FONTS[s.font]; caption.style.fontWeight = fontWeight(s.font);
  caption.style.fontSize = `${46 * s.gFontSize / 52}px`; caption.style.color = s.textColor;
  caption.style.webkitTextStroke = `${s.gStroke * 0.36}px ${s.strokeColor}`;
  const angle = (s.gShadowDir - 45) * Math.PI / 180, distance = s.gShadowDist * 0.6;
  caption.style.textShadow = s.gShadow > 0 ? `${Math.cos(angle) * distance}px ${Math.sin(angle) * distance}px ${s.gShadowBlur * 0.8}px ${hexAlpha(s.shadowColor, s.gShadow)}` : 'none';
  const background = hexAlpha(s.boxColor, s.gBoxOpacity);
  caption.style.backgroundColor = s.gBoxBounce ? 'transparent' : background;
  caption.style.setProperty('--demo-bounce-bg', background); caption.classList.toggle('has-box-bounce', s.gBoxBounce);
  caption.style.setProperty('--demo-box-scale', frame.words[frame.active].scale);
  caption.style.padding = s.gBoxOpacity > 0 ? '12px 24px' : '0';
  caption.style.opacity = String(frame.opacity); caption.style.filter = `blur(${frame.blur * 2}px)`;
  caption.style.clipPath = frame.clip > 0 ? `inset(0 ${frame.clip}% 0 0)` : 'none';
  caption.style.letterSpacing = `${1 + s.gTracking * 0.4 + frame.tracking * 2}px`;
  [...caption.children].forEach((node, i) => {
    const active = s.karaoke && frame.active === i, pill = active && s.hlMode === 'pill';
    node.textContent = s.textCase === 'upper' ? WORDS[i].toUpperCase() : s.textCase === 'lower' ? WORDS[i].toLowerCase() : WORDS[i];
    node.style.color = active ? pill ? pillTextColor(s.hlColor, s.textColor) : s.hlColor : s.textColor;
    node.style.backgroundColor = pill ? s.hlColor : 'transparent';
    node.style.padding = pill ? '6px 16px' : '0'; node.style.fontSize = `${active ? 1 + s.gHlScale / 100 : 1}em`;
    node.style.borderRadius = s.gPillRadius >= 56 ? '999px' : `${s.gPillRadius * 0.5}px`;
    node.style.opacity = String(frame.words[i].opacity);
    node.style.transform = `translateY(${frame.words[i].y * 2}px) scale(${frame.words[i].scale})`;
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
  const stage = root.querySelector('.demo-stage'), status = root.querySelector('[data-demo-status]');
  const toggle = root.querySelector('[data-demo-play]'), reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...root.querySelectorAll('[role="tab"]')], grid = root.querySelector('.demo-preset-grid');
  const dialog = root.querySelector('.demo-save-dialog'), nameInput = root.querySelector('#demo-preset-name');
  const error = root.querySelector('.demo-save-error'), saved = new Map(), tileCaptions = new Map();
  const base = BASE;
  let settings = { ...base }, baseline = { ...base }, activePreset = 'Plain', selected = 'Plain';
  let view = 'captions', filter = 'All', previewName = '', tileTime = 1, tilePlaying = false;
  let playing = false, inView = false, time = 1, raf = 0, previous = null;
  fillCaption(caption);
  function normalize(raw) {
    const result = { ...base };
    for (const key of Object.keys(base)) {
      const value = raw && raw[key], control = form.querySelector(`[data-setting="${key}"]`);
      if (typeof base[key] === 'boolean' && typeof value === 'boolean') result[key] = value;
      else if (typeof base[key] === 'number' && Number.isFinite(value)) result[key] = control ? Math.max(+control.min, Math.min(+control.max, value)) : value;
      else if (/Color$/.test(key) && /^#[0-9a-f]{6}$/i.test(value)) result[key] = value;
      else if (control?.tagName === 'SELECT' && [...control.options].some(option => option.value === value)) result[key] = value;
    }
    return result;
  }
  try {
    const entries = JSON.parse(localStorage.getItem('captionsgen-demo-presets') || '[]');
    if (Array.isArray(entries)) entries.slice(0, 30).forEach(entry => {
      if (typeof entry?.name === 'string' && entry.name.length > 0 && entry.name.length <= 40 && !Object.hasOwn(PRESETS, entry.name)) saved.set(entry.name, normalize(entry.settings));
    });
  } catch { /* The built-in presets work when browser storage is blocked. */ }
  function persist() {
    localStorage.setItem('captionsgen-demo-presets', JSON.stringify([...saved].map(([name, settings]) => ({ name, settings }))));
  }
  function stateFor(name) {
    // Creator looks bring their own font and case, like the plugin; the
    // classics keep the font you picked.
    const preset = PRESETS[name] || {};
    return saved.has(name) ? { ...saved.get(name) } : { ...base, ...preset, font: preset.font || settings.font, textCase: preset.textCase || 'upper' };
  }
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
    form.querySelector('[data-design-name]').textContent = selected === 'custom' ? 'Custom' : selected;
    form.querySelector('#demo-font').style.fontFamily = FONTS[settings.font]; form.querySelector('#demo-font').style.fontWeight = fontWeight(settings.font);
    form.querySelectorAll('[data-color-name]').forEach(label => { label.textContent = settings[label.dataset.colorName].toUpperCase(); });
    updateGroups(); playLabel();
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

  function draw() { paintCaption(caption, settings, time); }
  function tick(now) {
    raf = 0;
    const dt = previous === null ? 0 : Math.min((now - previous) / 1000, 0.1); previous = now;
    if (view === 'captions' && playing) {
      time += dt;
      if (time >= LOOP) { time = 1; playing = false; playLabel(); }
      draw();
    } else if (view === 'presets' && tilePlaying) {
      tileTime += dt;
      if (tileTime >= LOOP) { tileTime = 1; tilePlaying = false; }
      const tile = tileCaptions.get(previewName);
      if (tile) paintCaption(tile, stateFor(previewName), tileTime);
    }
    schedule();
  }
  function schedule() {
    const active = inView && !document.hidden && (view === 'captions' ? playing : tilePlaying);
    if (active && !raf) raf = requestAnimationFrame(tick);
    else if (!active) { cancelAnimationFrame(raf); raf = 0; previous = null; }
  }
  function replay() { time = 0; playing = true; previous = null; playLabel(); draw(); schedule(); }
  function setView(next, focus = false) {
    view = next; previous = null;
    tabs.forEach(tab => {
      const active = tab.id === `demo-tab-${next}`;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      root.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden = !active;
      if (active && focus) tab.focus();
    });
    if (next === 'presets') renderGallery(); else draw();
    schedule();
  }
  function load(name, animate = false) {
    settings = stateFor(name); baseline = { ...settings }; activePreset = name; selected = name;
    time = 1; playing = false; controls(); setView('captions');
    if (animate) {
      root.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      if (!reducedMotion.matches) replay();
    }
    status.textContent = `${name} preset applied.`;
  }
  function selectTile(name) {
    previewName = name; tileTime = 0; tilePlaying = !reducedMotion.matches;
    grid.querySelectorAll('[data-preset-name]').forEach(tile => {
      const active = tile.dataset.presetName === name;
      tile.classList.toggle('is-selected', active); tile.querySelector('.demo-preset-select').setAttribute('aria-pressed', String(active));
      tile.querySelector('.demo-preset-use').hidden = !active;
    });
    root.querySelector('[data-preset-description]').textContent = PRESET_META[name]?.desc || 'Your saved caption design.';
    const tile = tileCaptions.get(name); if (tile) paintCaption(tile, stateFor(name), tilePlaying ? 0 : 1);
    previous = null; schedule();
  }
  function renderGallery() {
    grid.replaceChildren(); tileCaptions.clear();
    root.querySelectorAll('[data-preset-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.presetFilter === filter)));
    const names = [...Object.keys(PRESETS), ...saved.keys()].filter(name => filter === 'All' || (filter === 'Mine' ? saved.has(name) : PRESET_META[name]?.cat === filter));
    root.querySelector('.demo-preset-empty').hidden = names.length > 0;
    for (const name of names) {
      const tile = document.createElement('div'); tile.className = 'demo-preset-tile'; tile.dataset.presetName = name;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'demo-preset-select';
      button.setAttribute('aria-label', `Preview ${name} preset`); button.setAttribute('aria-pressed', 'false');
      const preview = document.createElement('span'); preview.className = 'demo-stage demo-tile-stage'; preview.setAttribute('aria-hidden', 'true');
      preview.innerHTML = '<span class="demo-scene"><span class="demo-caption-anchor"><span class="demo-caption"></span></span></span>';
      const text = document.createElement('span'); text.className = 'demo-preset-name'; text.textContent = name;
      button.append(preview, text); button.addEventListener('click', () => selectTile(name));
      const use = document.createElement('button'); use.type = 'button'; use.className = 'demo-preset-use'; use.textContent = 'Use'; use.hidden = true;
      use.setAttribute('aria-label', `Use ${name} preset`); use.addEventListener('click', () => load(name, true));
      tile.append(button, use); grid.append(tile);
      const cap = preview.querySelector('.demo-caption'); fillCaption(cap); tileCaptions.set(name, cap); paintCaption(cap, stateFor(name), 1);
      if (saved.has(name)) {
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'demo-preset-delete'; remove.textContent = '×'; remove.setAttribute('aria-label', `Delete ${name} preset`);
        remove.addEventListener('click', () => {
          const previousValue = saved.get(name); saved.delete(name);
          try { persist(); } catch { saved.set(name, previousValue); status.textContent = 'Browser storage is unavailable. The design was not deleted.'; return; }
          if (previewName === name) { previewName = ''; tilePlaying = false; }
          renderGallery(); status.textContent = `${name} preset deleted from this browser.`;
        }); tile.append(remove);
      }
    }
    if (previewName && names.includes(previewName)) {
      const tile = [...grid.children].find(item => item.dataset.presetName === previewName);
      tile.classList.add('is-selected'); tile.querySelector('.demo-preset-select').setAttribute('aria-pressed', 'true'); tile.querySelector('.demo-preset-use').hidden = false;
    }
  }
  for (const name of ['All', 'Trend', 'Clean', 'Motion', 'Mine']) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.presetFilter = name; button.textContent = name; button.setAttribute('aria-pressed', String(name === filter));
    button.addEventListener('click', () => { filter = name; renderGallery(); }); root.querySelector('.demo-categories').append(button);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setView(i === 0 ? 'captions' : 'presets'));
    tab.addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault(); setView(event.key === 'Home' ? 'captions' : event.key === 'End' ? 'presets' : i === 0 ? 'presets' : 'captions', true);
      }
    });
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    const control = event.target; if (!control.matches('[data-setting]')) return;
    settings[control.dataset.setting] = control.type === 'checkbox' ? control.checked : control.type === 'range' ? +control.value : control.value;
    selected = 'custom'; controls(); draw(); status.textContent = 'Custom design. Preview updated.';
    if (GROUP_KEYS.animation.includes(control.dataset.setting) && !reducedMotion.matches) replay();
  });
  form.querySelectorAll('.color-btn').forEach(field => {
    const input = field.querySelector('input');
    field.addEventListener('click', event => {
      if (event.target === input) return;
      if (typeof input.showPicker === 'function') input.showPicker(); else input.click();
    });
  });
  form.querySelectorAll('.demo-group').forEach(group => {
    const button = group.querySelector('.dg-head'), body = group.querySelector('.dg-body');
    const head = group.querySelector('.demo-group-head');
    head.addEventListener('click', event => { if (event.target === head) button.click(); });
    group.classList.toggle('is-open', button.getAttribute('aria-expanded') === 'true');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(expanded)); body.hidden = !expanded; group.classList.toggle('is-open', expanded);
    });
    group.querySelector('[data-reset-group]').addEventListener('click', () => {
      GROUP_KEYS[group.dataset.group].forEach(key => { settings[key] = baseline[key]; });
      selected = Object.keys(base).every(key => settings[key] === baseline[key]) ? activePreset : 'custom';
      controls(); draw(); status.textContent = `${group.querySelector('.dg-title').textContent} settings reset.`;
    });
  });
  root.querySelector('[data-demo-reset]').addEventListener('click', () => { settings = { ...base }; load('Plain'); });
  toggle.addEventListener('click', () => { if (playing) { playing = false; playLabel(); schedule(); } else replay(); });
  root.querySelectorAll('[data-demo-save]').forEach(button => button.addEventListener('click', () => { nameInput.value = ''; error.hidden = true; dialog.showModal(); nameInput.focus(); }));
  root.querySelector('[data-save-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); const name = nameInput.value.trim();
    if (!name || Object.hasOwn(PRESETS, name)) { error.textContent = 'Choose a name different from a built-in preset.'; error.hidden = false; return; }
    if (saved.size >= 30 && !saved.has(name)) { error.textContent = 'You can save up to 30 designs in this browser.'; error.hidden = false; return; }
    const old = saved.get(name); saved.set(name, { ...settings });
    try { persist(); } catch { if (old) saved.set(name, old); else saved.delete(name); error.textContent = 'Browser storage is unavailable. The design could not be saved.'; error.hidden = false; return; }
    activePreset = name; selected = name; baseline = { ...settings }; controls(); dialog.close();
    if (view === 'presets') renderGallery(); status.textContent = `${name} saved in this browser.`;
  });
  new ResizeObserver(() => { if (view === 'captions') draw(); else tileCaptions.forEach((cap, name) => paintCaption(cap, stateFor(name), 1)); }).observe(root);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: 0.05 }).observe(root);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => { if (event.matches) { playing = false; tilePlaying = false; time = 1; draw(); playLabel(); schedule(); } });
  load('Plain'); root.classList.add('demo-ready');
  document.fonts.ready.then(() => { draw(); if (view === 'presets') renderGallery(); });
}
