// Public Captions Gen 1.1.9 .cgpreset transport. Slider values remain v4 values.
// Font identities were checked against the frozen Windows installer's TTF name
// tables. A browser substitute never replaces an imported font on re-export.
const FONT_FIELDS = ['fontPS', 'fontFamily', 'fontFam', 'fontWeight', 'fontItalic'];
const FONTS = {
  impact: { fontPS: 'Impact', fontFamily: 'Impact', fontFam: 'Impact', fontWeight: 400 },
  'montserrat-black': { fontPS: 'Montserrat-Black', fontFamily: 'Montserrat Black', fontFam: 'Montserrat', fontWeight: 900 },
  'montserrat-xbold': { fontPS: 'Montserrat-ExtraBold', fontFamily: 'Montserrat ExtraBold', fontFam: 'Montserrat', fontWeight: 800 },
  'montserrat-bold': { fontPS: 'Montserrat-Bold', fontFamily: 'Montserrat Bold', fontFam: 'Montserrat', fontWeight: 700 },
  'montserrat-medium': { fontPS: 'Montserrat-Medium', fontFamily: 'Montserrat Medium', fontFam: 'Montserrat', fontWeight: 500 },
  anton: { fontPS: 'Anton-Regular', fontFamily: 'Anton Regular', fontFam: 'Anton', fontWeight: 400 },
  bangers: { fontPS: 'Bangers-Regular', fontFamily: 'Bangers Regular', fontFam: 'Bangers', fontWeight: 400 },
  luckiest: { fontPS: 'LuckiestGuy-Regular', fontFamily: 'Luckiest Guy Regular', fontFam: 'Luckiest Guy', fontWeight: 400 },
  inter: { fontPS: 'Inter-SemiBold', fontFamily: 'Inter SemiBold', fontFam: 'Inter', fontWeight: 600 },
  dmserif: { fontPS: 'DMSerifDisplay-Regular', fontFamily: 'DM Serif Display Regular', fontFam: 'DM Serif Display', fontWeight: 400 },
  sans: { fontPS: 'ArialMT', fontFamily: 'Arial', fontFam: 'Arial', fontWeight: 400 },
  serif: { fontPS: 'Georgia', fontFamily: 'Georgia', fontFam: 'Georgia', fontWeight: 400 },
  mono: { fontPS: 'CourierNewPSMT', fontFamily: 'Courier New', fontFam: 'Courier New', fontWeight: 400 },
};
const NUMBER_KEYS = new Set(['gFontSize', 'gPosY', 'gTracking', 'gStroke', 'gShadow', 'gShadowDist',
  'gShadowBlur', 'gShadowDir', 'gHlScale', 'gHlPop', 'gPillRadius', 'gBoxOpacity', 'gPop',
  'gAnimDur', 'gSlideTime', 'gEaseIn', 'gEaseOut', 'gOutDur', 'gOutPop', 'gOutEaseIn',
  'gOutEaseOut', 'gMinWords', 'gMaxWords', 'gMaxChars', 'gMaxDur', 'gMaxLines', 'fontWeight']);
const BOOLEAN_KEYS = new Set(['karaoke', 'gBoxBounce', 'gStripPunct', 'fontItalic']);
const STRING_KEYS = new Set(['gAnimStyle', 'gAnimOut', 'hlMode', 'gCase', 'textCase',
  'textColor', 'hlColor', 'strokeColor', 'shadowColor', 'boxColor', 'fontPS', 'fontFamily', 'fontFam', 'font']);
const COLOR_KEYS = new Set(['textColor', 'hlColor', 'strokeColor', 'shadowColor', 'boxColor']);
const CASES = new Set(['none', 'upper', 'lower', 'sentence']);
const has = (o, key) => Object.hasOwn(o, key);
const plainObject = o => o !== null && typeof o === 'object' && !Array.isArray(o)
  && (Object.getPrototypeOf(o) === Object.prototype || Object.getPrototypeOf(o) === null);
const text = (s, max = 80) => s.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max);
const fontKey = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]/g, '');
const aliases = new Map();
for (const [key, metadata] of Object.entries(FONTS)) {
  // Generic family names shared by several weights need weight resolution below.
  for (const name of [metadata.fontPS, metadata.fontFamily, ...(key.startsWith('montserrat-') ? [] : [metadata.fontFam])]) {
    aliases.set(fontKey(name), key);
  }
}
for (const name of ['ImpactMT', 'Impact Regular']) aliases.set(fontKey(name), 'impact');
for (const name of ['Arial Regular', 'Arial Bold', 'Arial-BoldMT', 'Arial-ItalicMT', 'Arial-BoldItalicMT']) aliases.set(fontKey(name), 'sans');
for (const name of ['Georgia Regular', 'Georgia-Bold', 'Georgia-Italic', 'Georgia-BoldItalic']) aliases.set(fontKey(name), 'serif');
for (const name of ['Courier New Regular', 'CourierNewPS-BoldMT', 'CourierNewPS-ItalicMT', 'CourierNewPS-BoldItalicMT']) aliases.set(fontKey(name), 'mono');

function settingsCopy(input) {
  if (!plainObject(input)) throw new Error('Preset settings must be an object.');
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (NUMBER_KEYS.has(key)) {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Invalid numeric setting: ${key}.`);
      output[key] = value;
    } else if (BOOLEAN_KEYS.has(key)) {
      if (typeof value !== 'boolean') throw new Error(`Invalid switch setting: ${key}.`);
      output[key] = value;
    } else if (STRING_KEYS.has(key)) {
      if ((key === 'gAnimStyle' || key === 'gAnimOut') && Number.isInteger(value)) output[key] = String(value);
      else if (typeof value === 'string') output[key] = text(value);
      else throw new Error(`Invalid text setting: ${key}.`);
    }
  }
  for (const key of COLOR_KEYS) {
    if (has(output, key) && !/^#[0-9a-f]{6}$/i.test(output[key])) throw new Error(`Invalid color setting: ${key}.`);
  }
  for (const key of ['gCase', 'textCase']) {
    if (has(output, key) && !CASES.has(output[key])) throw new Error(`Invalid text case: ${key}.`);
  }
  if (has(output, 'hlMode') && !['color', 'pill'].includes(output.hlMode)) throw new Error('Invalid highlight style.');
  for (const [key, max] of [['gAnimStyle', 14], ['gAnimOut', 5]]) {
    if (has(output, key) && (!/^\d{1,2}$/.test(output[key]) || +output[key] > max)) throw new Error(`Invalid animation: ${key}.`);
  }
  return output;
}

function metadataFrom(input) {
  const output = {};
  for (const key of FONT_FIELDS) {
    if (!has(input, key)) continue;
    const value = input[key];
    if (key === 'fontWeight') {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Invalid font weight.');
      output[key] = value;
    } else if (key === 'fontItalic') {
      if (typeof value !== 'boolean') throw new Error('Invalid font style.');
      output[key] = value;
    } else {
      if (typeof value !== 'string') throw new Error('Invalid font name.');
      output[key] = text(value);
    }
  }
  return output;
}

function previewFont(metadata, suggested) {
  const names = [metadata.fontPS, metadata.fontFamily, metadata.fontFam].filter(Boolean);
  for (const name of names) {
    const normalized = fontKey(name);
    if (normalized.startsWith('theboldfont')) return { key: 'montserrat-black', substituted: true };
    if (normalized.startsWith('komikaaxis')) return { key: 'bangers', substituted: true };
    if (aliases.has(normalized)) return { key: aliases.get(normalized), substituted: false };
  }
  if (names.some(name => fontKey(name).startsWith('montserrat'))) {
    const joined = names.join(' ').toLowerCase();
    const weight = metadata.fontWeight || (/black|heavy/.test(joined) ? 900 : /extra.?bold|ultra.?bold/.test(joined) ? 800 : /bold/.test(joined) ? 700 : 500);
    const key = weight >= 850 ? 'montserrat-black' : weight >= 750 ? 'montserrat-xbold' : weight >= 600 ? 'montserrat-bold' : 'montserrat-medium';
    return { key, substituted: true };
  }
  if (!names.length && has(FONTS, suggested)) return { key: suggested, substituted: false };
  return { key: 'impact', substituted: names.length > 0 || !!suggested };
}

function presetName(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value !== 'string') throw new Error('Preset name must be text.');
  return text(value, 40).trim() || fallback;
}

export function decodePreset(value) {
  if (!plainObject(value) || value.type !== 'preset' || value.app !== 'Captions Gen' || value.format !== 1) {
    throw new Error('Choose a Captions Gen preset file with format 1.');
  }
  if (!plainObject(value.settings) || value.settings.v !== 4) {
    throw new Error('Use a v4 preset. Import older presets into the current Captions Gen panel and export them again.');
  }
  const settings = settingsCopy(value.settings);
  const metadata = metadataFrom(settings);
  const preview = previewFont(metadata, settings.font);
  settings.font = preview.key;
  settings.v = 4;
  settings.importedFont = { ...metadata, previewFont: preview.key };
  const notice = preview.substituted
    ? `This browser uses ${FONTS[preview.key].fontFamily} to preview the imported font. Its original font metadata is retained when exported unless you choose another font.`
    : metadata.fontItalic
      ? 'The browser preview may approximate the imported font style. Its original font metadata is retained when exported unless you choose another font.'
      : '';
  return { name: presetName(value.name, 'Preset'), settings, notice };
}

export function encodePreset(name, input) {
  const safeName = presetName(name);
  if (!safeName) throw new Error('Give the preset a name first.');
  const settings = settingsCopy(input);
  const key = has(FONTS, settings.font) ? settings.font : 'impact';
  let metadata;
  if (plainObject(input.importedFont) && input.importedFont.previewFont === key && settings.font === key) {
    metadata = metadataFrom(input.importedFont);
  } else {
    metadata = { ...FONTS[key], fontItalic: false };
  }
  for (const field of FONT_FIELDS) delete settings[field];
  Object.assign(settings, metadata);
  if (has(settings, 'textCase')) settings.gCase = settings.textCase;
  delete settings.textCase;
  delete settings.font;
  settings.v = 4;
  return { type: 'preset', format: 1, app: 'Captions Gen', name: safeName, settings };
}

// Identical public 1.1.9 Premiere/AE sLang options, including model dependency.
export const SPOKEN_LANGUAGES = Object.freeze([
  {
    "code": "",
    "name": "Auto-detect"
  },
  {
    "code": "af",
    "name": "Afrikaans"
  },
  {
    "code": "sq",
    "name": "Albanian"
  },
  {
    "code": "am",
    "name": "Amharic"
  },
  {
    "code": "ar",
    "name": "Arabic"
  },
  {
    "code": "hy",
    "name": "Armenian"
  },
  {
    "code": "as",
    "name": "Assamese"
  },
  {
    "code": "az",
    "name": "Azerbaijani"
  },
  {
    "code": "ba",
    "name": "Bashkir"
  },
  {
    "code": "eu",
    "name": "Basque"
  },
  {
    "code": "be",
    "name": "Belarusian"
  },
  {
    "code": "bn",
    "name": "Bengali"
  },
  {
    "code": "bs",
    "name": "Bosnian"
  },
  {
    "code": "br",
    "name": "Breton"
  },
  {
    "code": "bg",
    "name": "Bulgarian"
  },
  {
    "code": "my",
    "name": "Burmese"
  },
  {
    "code": "yue",
    "name": "Cantonese",
    "requiredModel": "large-v3-turbo"
  },
  {
    "code": "ca",
    "name": "Catalan"
  },
  {
    "code": "zh",
    "name": "Chinese"
  },
  {
    "code": "hr",
    "name": "Croatian"
  },
  {
    "code": "cs",
    "name": "Czech"
  },
  {
    "code": "da",
    "name": "Danish"
  },
  {
    "code": "nl",
    "name": "Dutch"
  },
  {
    "code": "en",
    "name": "English"
  },
  {
    "code": "et",
    "name": "Estonian"
  },
  {
    "code": "fo",
    "name": "Faroese"
  },
  {
    "code": "fi",
    "name": "Finnish"
  },
  {
    "code": "fr",
    "name": "French"
  },
  {
    "code": "gl",
    "name": "Galician"
  },
  {
    "code": "ka",
    "name": "Georgian"
  },
  {
    "code": "de",
    "name": "German"
  },
  {
    "code": "el",
    "name": "Greek"
  },
  {
    "code": "gu",
    "name": "Gujarati"
  },
  {
    "code": "ht",
    "name": "Haitian Creole"
  },
  {
    "code": "ha",
    "name": "Hausa"
  },
  {
    "code": "haw",
    "name": "Hawaiian"
  },
  {
    "code": "he",
    "name": "Hebrew"
  },
  {
    "code": "hi",
    "name": "Hindi"
  },
  {
    "code": "hu",
    "name": "Hungarian"
  },
  {
    "code": "is",
    "name": "Icelandic"
  },
  {
    "code": "id",
    "name": "Indonesian"
  },
  {
    "code": "it",
    "name": "Italian"
  },
  {
    "code": "ja",
    "name": "Japanese"
  },
  {
    "code": "jw",
    "name": "Javanese"
  },
  {
    "code": "kn",
    "name": "Kannada"
  },
  {
    "code": "kk",
    "name": "Kazakh"
  },
  {
    "code": "km",
    "name": "Khmer"
  },
  {
    "code": "ko",
    "name": "Korean"
  },
  {
    "code": "lo",
    "name": "Lao"
  },
  {
    "code": "la",
    "name": "Latin"
  },
  {
    "code": "lv",
    "name": "Latvian"
  },
  {
    "code": "ln",
    "name": "Lingala"
  },
  {
    "code": "lt",
    "name": "Lithuanian"
  },
  {
    "code": "lb",
    "name": "Luxembourgish"
  },
  {
    "code": "mk",
    "name": "Macedonian"
  },
  {
    "code": "mg",
    "name": "Malagasy"
  },
  {
    "code": "ms",
    "name": "Malay"
  },
  {
    "code": "ml",
    "name": "Malayalam"
  },
  {
    "code": "mt",
    "name": "Maltese"
  },
  {
    "code": "mi",
    "name": "Māori"
  },
  {
    "code": "mr",
    "name": "Marathi"
  },
  {
    "code": "mn",
    "name": "Mongolian"
  },
  {
    "code": "ne",
    "name": "Nepali"
  },
  {
    "code": "no",
    "name": "Norwegian"
  },
  {
    "code": "nn",
    "name": "Norwegian Nynorsk"
  },
  {
    "code": "oc",
    "name": "Occitan"
  },
  {
    "code": "ps",
    "name": "Pashto"
  },
  {
    "code": "fa",
    "name": "Persian"
  },
  {
    "code": "pl",
    "name": "Polish"
  },
  {
    "code": "pt",
    "name": "Portuguese"
  },
  {
    "code": "pa",
    "name": "Punjabi"
  },
  {
    "code": "ro",
    "name": "Romanian"
  },
  {
    "code": "ru",
    "name": "Russian"
  },
  {
    "code": "sa",
    "name": "Sanskrit"
  },
  {
    "code": "sr",
    "name": "Serbian"
  },
  {
    "code": "sn",
    "name": "Shona"
  },
  {
    "code": "sd",
    "name": "Sindhi"
  },
  {
    "code": "si",
    "name": "Sinhala"
  },
  {
    "code": "sk",
    "name": "Slovak"
  },
  {
    "code": "sl",
    "name": "Slovenian"
  },
  {
    "code": "so",
    "name": "Somali"
  },
  {
    "code": "es",
    "name": "Spanish"
  },
  {
    "code": "su",
    "name": "Sundanese"
  },
  {
    "code": "sw",
    "name": "Swahili"
  },
  {
    "code": "sv",
    "name": "Swedish"
  },
  {
    "code": "tl",
    "name": "Tagalog"
  },
  {
    "code": "tg",
    "name": "Tajik"
  },
  {
    "code": "ta",
    "name": "Tamil"
  },
  {
    "code": "tt",
    "name": "Tatar"
  },
  {
    "code": "te",
    "name": "Telugu"
  },
  {
    "code": "th",
    "name": "Thai"
  },
  {
    "code": "bo",
    "name": "Tibetan"
  },
  {
    "code": "tr",
    "name": "Turkish"
  },
  {
    "code": "tk",
    "name": "Turkmen"
  },
  {
    "code": "uk",
    "name": "Ukrainian"
  },
  {
    "code": "ur",
    "name": "Urdu"
  },
  {
    "code": "uz",
    "name": "Uzbek"
  },
  {
    "code": "vi",
    "name": "Vietnamese"
  },
  {
    "code": "cy",
    "name": "Welsh"
  },
  {
    "code": "yi",
    "name": "Yiddish"
  },
  {
    "code": "yo",
    "name": "Yoruba"
  }
].map(language => Object.freeze(language)));
