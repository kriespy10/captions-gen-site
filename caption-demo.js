import { DEFAULTS, PRESETS, WORDS, LOOP, frameAt, hexAlpha, pillTextColor } from './caption-engine.mjs';

const root = document.querySelector('[data-caption-demo]');
if (root) initDemo(root);

function initDemo(root) {
  const form = root.querySelector('.demo-controls');
  const caption = root.querySelector('.demo-caption');
  const anchor = root.querySelector('.demo-caption-anchor');
  const scene = root.querySelector('.demo-scene');
  const stage = root.querySelector('.demo-stage');
  const preset = root.querySelector('#demo-preset');
  const badge = root.querySelector('[data-demo-style]');
  const status = root.querySelector('[data-demo-status]');
  const toggle = root.querySelector('[data-demo-play]');
  const scrub = root.querySelector('#demo-time');
  const clock = root.querySelector('[data-demo-clock]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  caption.replaceChildren();
  const words = WORDS.map(text => {
    const node = document.createElement('span'); node.className = 'demo-word'; node.textContent = text;
    caption.append(node); return node;
  });
  const base = { ...DEFAULTS, textColor: '#FFFFFF', hlColor: '#FFEB3B', strokeColor: '#000000',
    shadowColor: '#000000', boxColor: '#000000', font: 'impact', textCase: 'upper' };
  let settings = {}, selected = 'Beast', time = reducedMotion.matches ? 1 : 0.4;
  let playing = !reducedMotion.matches, inView = false, raf = 0, previous = null;
  let wasPlaying = false;
  Object.keys(PRESETS).forEach(name => {
    const option = document.createElement('option'); option.value = name; option.textContent = name; preset.append(option);
  });
  function playLabel() {
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause caption preview' : 'Play caption preview');
  }
  function controls() {
    form.querySelectorAll('[data-setting]').forEach(control => {
      const key = control.dataset.setting;
      if (control.type === 'checkbox') control.checked = !!settings[key];
      else control.value = String(settings[key]);
      const output = root.querySelector(`[data-output="${key}"]`);
      if (output) {
        const value = +settings[key];
        output.value = key === 'gFontSize' ? `${(value / 10).toFixed(1)}%` : key === 'gPosY' || key === 'gShadow' || key === 'gBoxOpacity' ? `${value}%`
          : key === 'gHlScale' ? `${100 + value}%` : key === 'gAnimDur' || key === 'gOutDur' ? `${(value / 10).toFixed(1)}s` : String(value);
      }
    });
    root.querySelector('[data-highlight-fields]').disabled = !settings.karaoke;
    root.querySelector('[data-pill-field]').hidden = settings.hlMode !== 'pill';
    const chosen = preset.querySelector('option[value="custom"]');
    if (selected === 'custom' && !chosen) {
      const option = document.createElement('option'); option.value = 'custom'; option.textContent = 'Custom'; preset.append(option);
    }
    preset.value = selected;
    badge.textContent = selected === 'custom' ? 'Custom design' : selected;
    playLabel();
  }
  function applyStyle() {
    const size = 46 * settings.gFontSize / 52;
    caption.style.fontFamily = { impact: 'Impact, Anton, sans-serif', sans: '"Instrument Sans", sans-serif', serif: 'Georgia, serif', mono: '"Courier New", monospace' }[settings.font];
    caption.style.fontWeight = settings.font === 'impact' ? '400' : '700';
    caption.style.fontSize = `${size}px`;
    caption.style.color = settings.textColor;
    caption.style.webkitTextStroke = `${settings.gStroke * 0.36}px ${settings.strokeColor}`;
    caption.style.textShadow = settings.gShadow > 0 ? `0 ${settings.gShadowDist * 0.6}px ${settings.gShadowBlur * 0.8}px ${hexAlpha(settings.shadowColor, settings.gShadow)}` : 'none';
    caption.style.backgroundColor = hexAlpha(settings.boxColor, settings.gBoxOpacity);
    caption.style.padding = settings.gBoxOpacity > 0 ? '12px 24px' : '0';
    words.forEach((node, i) => { node.textContent = settings.textCase === 'upper' ? WORDS[i].toUpperCase() : settings.textCase === 'lower' ? WORDS[i].toLowerCase() : WORDS[i]; });
  }
  function draw() {
    const frame = frameAt(settings, time);
    caption.style.opacity = String(frame.opacity);
    caption.style.filter = `blur(${frame.blur * 2}px)`;
    caption.style.clipPath = `inset(0 ${frame.clip}% 0 0)`;
    caption.style.letterSpacing = `${1 + settings.gTracking * 0.4 + frame.tracking * 2}px`;
    words.forEach((node, i) => {
      const highlighted = settings.karaoke && i === frame.active;
      const pill = highlighted && settings.hlMode === 'pill';
      node.style.color = highlighted ? pill ? pillTextColor(settings.hlColor, settings.textColor) : settings.hlColor : settings.textColor;
      node.style.backgroundColor = pill ? settings.hlColor : 'transparent';
      node.style.fontSize = `${highlighted ? 1 + settings.gHlScale / 100 : 1}em`;
      node.style.padding = pill ? '6px 16px' : '0';
      node.style.borderRadius = settings.gPillRadius >= 56 ? '999px' : `${settings.gPillRadius * 0.5}px`;
      node.style.opacity = String(frame.words[i].opacity);
      node.style.transform = `translateY(${frame.words[i].y * 2}px) scale(${frame.words[i].scale})`;
    });
    // Keep the fixed sample readable when size / highlight changes wrap a line.
    // Layout stays in a 640x360 scene, independent of the website's viewport.
    const height = caption.offsetHeight;
    const fit = Math.min(1, 304 / Math.max(1, height), 560 / Math.max(1, caption.scrollWidth));
    const half = height * fit / 2;
    anchor.style.top = `${Math.max(18 + half, Math.min(342 - half, settings.gPosY / 100 * 360))}px`;
    caption.style.transform = `translateY(${frame.y * 2}px) scale(${frame.scale * fit})`;
    scrub.value = String(time);
    clock.textContent = `${time.toFixed(1)} / ${LOOP.toFixed(1)}s`;
  }
  function tick(now) {
    raf = 0;
    if (previous !== null) time = (time + Math.min((now - previous) / 1000, 0.1)) % LOOP;
    previous = now; draw(); schedule();
  }
  function schedule() {
    const active = playing && inView && !document.hidden;
    if (active && !raf) raf = requestAnimationFrame(tick);
    else if (!active) { cancelAnimationFrame(raf); raf = 0; previous = null; }
  }
  function load(name) {
    selected = name; settings = { ...base, ...PRESETS[name] };
    controls(); applyStyle(); time = playing ? 0.4 : 1; draw();
    status.textContent = `${name} preset loaded.`;
  }
  form.addEventListener('submit', event => event.preventDefault());
  preset.addEventListener('change', () => { if (preset.value !== 'custom') load(preset.value); });
  form.addEventListener('input', event => {
    const control = event.target;
    if (!control.matches('[data-setting]')) return;
    settings[control.dataset.setting] = control.type === 'checkbox' ? control.checked : control.type === 'range' ? +control.value : control.value;
    selected = 'custom'; controls(); applyStyle(); draw();
    status.textContent = 'Custom design. Preview updated.';
  });
  root.querySelector('[data-demo-reset]').addEventListener('click', () => load('Beast'));
  toggle.addEventListener('click', () => { playing = !playing; previous = null; playLabel(); schedule(); });
  root.querySelector('[data-demo-replay]').addEventListener('click', () => { time = 0; previous = null; playing = true; playLabel(); draw(); schedule(); });
  scrub.addEventListener('input', () => { time = +scrub.value; previous = null; draw(); });
  scrub.addEventListener('pointerdown', () => { wasPlaying = playing; playing = false; schedule(); });
  function endScrub() { if (wasPlaying) { playing = true; wasPlaying = false; schedule(); } }
  scrub.addEventListener('pointerup', endScrub); scrub.addEventListener('pointercancel', endScrub);
  scrub.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { playing = false; playLabel(); schedule(); }
  });
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  function chooseTab(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      root.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseTab(tab));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next !== null) { event.preventDefault(); chooseTab(tabs[next], true); }
    });
  });
  new ResizeObserver(entries => { scene.style.transform = `scale(${entries[0].contentRect.width / 640})`; }).observe(stage);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: 0.1 }).observe(stage);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => { if (event.matches) { playing = false; time = 1; draw(); playLabel(); schedule(); } });
  load('Beast');
  root.classList.add('demo-ready');
}
