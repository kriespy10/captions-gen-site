// Browser adaptation of src/service.mjs buildPreviewHtml / animTickJs /
// exitTickJs. Four fixed words use the plugin's 0.7-second mock word spacing.
export { DEFAULTS, PRESETS } from './caption-presets.mjs?v=panel-20261021';
export const WORDS = ['Captions', 'made', 'for', 'you'];
export const WORD_TIMES = [0.1, 0.8, 1.5, 2.2];
export const LOOP = 3.6;
const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const num = (s, key, fallback) => s[key] == null || s[key] === '' || !Number.isFinite(+s[key]) ? fallback : +s[key];

export function gain(s, x, exit = false) {
  const p = clamp(x);
  const a = 1 + num(s, exit ? 'gOutEaseIn' : 'gEaseIn', 0) / 50;
  const b = 1 + num(s, exit ? 'gOutEaseOut' : 'gEaseOut', 60) / 50;
  const pa = p ** a;
  const den = pa + (1 - p) ** b;
  return den > 0 ? pa / den : 1;
}

export function frameAt(s, seconds) {
  const t = clamp(seconds, 0, LOOP);
  const dur = Math.max(0.05, num(s, 'gAnimDur', 2) / 10);
  const p = clamp(t / dur), ease = 1 - (1 - p) ** 3;
  const strength = Math.max(0, num(s, 'gPop', 12)), k = strength / 12;
  const frame = { opacity: 1, scale: 1, y: 0, blur: 0, clip: 0, tracking: 0,
    active: WORD_TIMES.reduce((active, start, i) => t >= start ? i : active, 0),
    words: WORDS.map(() => ({ opacity: 1, y: 0, scale: 1 })) };
  switch (+s.gAnimStyle) {
    case 1: {
      const peak = 1 + strength / 100;
      frame.scale = p < 0.67 ? (p / 0.67) * peak : peak - ((p - 0.67) / 0.33) * (peak - 1);
      break;
    }
    case 2: frame.opacity = p; break;
    case 3: frame.opacity = p; frame.blur = (1 - p) * 8 * k; break;
    case 4: frame.opacity = gain(s, p); frame.y = (1 - frame.opacity) * 26 * k; break;
    case 5: frame.opacity = gain(s, p); frame.y = -(1 - frame.opacity) * 26 * k; break;
    case 6: frame.clip = (1 - p) * 100; break;
    case 7: frame.clip = (1 - Math.floor(p * 20) / 20) * 100; break;
    case 8: frame.words.forEach((word, i) => { word.opacity = t >= WORD_TIMES[i] ? 1 : 0; }); break;
    case 9: frame.opacity = ease; frame.scale = 0.92 + 0.08 * ease; break;
    case 10: frame.opacity = ease; frame.tracking = (1 - ease) * 8 * k; break;
    case 11: {
      const p2 = clamp(t / (dur * 3));
      const bp = Math.max(0, p2 - 0.12);
      frame.scale = Math.max(0, Math.min(1, p2 * 8) + strength / 100 * Math.sin(bp * Math.PI * 6) * Math.exp(-bp * 3.5));
      break;
    }
    case 12: frame.words.forEach((word, i) => {
      const pf = clamp((t - WORD_TIMES[i]) / Math.max(0.15, dur * 2));
      word.opacity = 1 - (1 - pf) ** 4;
      const pm = clamp((t - WORD_TIMES[i]) / Math.max(0.1, num(s, 'gSlideTime', 4) / 10));
      word.y = (1 - gain(s, pm)) * strength * 2 * 0.55;
    }); break;
    case 13: {
      const window = Math.max(0.2, dur * 2);
      const enter = gain(s, t / window), exit = gain(s, (LOOP - t) / window);
      frame.opacity = Math.min(enter, exit); frame.y = ((1 - enter) * 22 + (1 - exit) * 22) * k;
      break;
    }
    case 14: frame.words.forEach((word, i) => {
      const pw = clamp((t - (WORD_TIMES[i] - 0.12)) / Math.max(0.15, dur * 2));
      word.opacity = 1 - (1 - pw) ** 3;
    }); break;
  }
  if (s.karaoke && +s.gHlPop > 0) {
    const elapsed = t - WORD_TIMES[frame.active];
    frame.words[frame.active].scale = 1 + (elapsed >= 0 ? +s.gHlPop / 100 * Math.sin(elapsed * 18) * Math.exp(-elapsed * 5) : 0);
  }
  const out = +s.gAnimOut;
  const q = gain(s, (LOOP - t) / Math.max(0.1, num(s, 'gOutDur', 2) / 10), true);
  if (out && q < 0.999) {
    const outK = Math.max(0, num(s, 'gOutPop', 12)) / 12;
    if (out <= 4) frame.opacity = Math.min(frame.opacity, q);
    if (out === 2) frame.blur = (1 - q) * 8 * outK;
    if (out === 3) frame.y = -(1 - q) * 26 * outK;
    if (out === 4) frame.y = (1 - q) * 26 * outK;
    if (out === 5) frame.scale *= q;
  }
  return frame;
}

export function hexAlpha(hex, percent) {
  return hex + Math.round(clamp(percent / 100) * 255).toString(16).padStart(2, '0');
}

// Like the plugin's marketing chip preview, light pills need dark lettering.
export function pillTextColor(background, text) {
  const luminance = color => [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bg = luminance(background), fg = luminance(text);
  if ((Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05) >= 4.5) return text;
  return bg > 0.179 ? '#111111' : '#FFFFFF';
}
