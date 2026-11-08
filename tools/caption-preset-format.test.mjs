import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodePreset, encodePreset, SPOKEN_LANGUAGES } from '../caption-preset-format.mjs';

const file = (settings = {}, name = 'My captions') => ({
  type: 'preset', format: 1, app: 'Captions Gen', name, settings: { v: 4, ...settings },
});
const installedFonts = [
  ['montserrat-black', 'Montserrat-Black', 'Montserrat Black', 'Montserrat', 900],
  ['montserrat-xbold', 'Montserrat-ExtraBold', 'Montserrat ExtraBold', 'Montserrat', 800],
  ['montserrat-bold', 'Montserrat-Bold', 'Montserrat Bold', 'Montserrat', 700],
  ['montserrat-medium', 'Montserrat-Medium', 'Montserrat Medium', 'Montserrat', 500],
  ['anton', 'Anton-Regular', 'Anton Regular', 'Anton', 400],
  ['bangers', 'Bangers-Regular', 'Bangers Regular', 'Bangers', 400],
  ['luckiest', 'LuckiestGuy-Regular', 'Luckiest Guy Regular', 'Luckiest Guy', 400],
  ['inter', 'Inter-SemiBold', 'Inter SemiBold', 'Inter', 600],
  ['dmserif', 'DMSerifDisplay-Regular', 'DM Serif Display Regular', 'DM Serif Display', 400],
  ['sans', 'ArialMT', 'Arial', 'Arial', 400],
  ['serif', 'Georgia', 'Georgia', 'Georgia', 400],
  ['mono', 'CourierNewPSMT', 'Courier New', 'Courier New', 400],
];

test('nine bundled fonts and Arial/Georgia/Courier retain original identities through a browser round trip', () => {
  for (const [key, fontPS, fontFamily, fontFam, fontWeight] of installedFonts) {
    const original = file({ fontPS, fontFamily, fontFam, fontWeight, fontItalic: false,
      gCase: 'sentence', gAnimDur: 3, gMaxDur: 2.7, gTracking: 8, gBoxBounce: true });
    const decoded = decodePreset(original);
    assert.equal(decoded.settings.font, key, fontPS);
    assert.equal(decoded.notice, '', fontPS);
    assert.equal(decoded.settings.importedFont.previewFont, key);
    assert.deepEqual(encodePreset(decoded.name, decoded.settings), original, fontPS);
  }
});

test('unbundled preferred fonts use explicit browser substitutes and keep their original metadata', () => {
  for (const [fontPS, family, preview] of [['TheBoldFont', 'The Bold Font', 'montserrat-black'], ['KomikaAxis', 'Komika Axis', 'bangers']]) {
    const original = file({ fontPS, fontFamily: family, fontFam: family, fontWeight: 400, fontItalic: false });
    const decoded = decodePreset(original);
    assert.equal(decoded.settings.font, preview);
    assert.match(decoded.notice, /browser.*preview.*original font metadata/i);
    assert.deepEqual(encodePreset(decoded.name, decoded.settings), original);
  }
});

test('font aliases resolve family/style names without requiring exact spaces, punctuation or case', () => {
  const cases = [
    [{ fontPS: 'MONTSERRAT-EXTRABOLD' }, 'montserrat-xbold'],
    [{ fontFamily: 'Montserrat Extra Bold' }, 'montserrat-xbold'],
    [{ fontFam: 'Montserrat', fontWeight: 900 }, 'montserrat-black'],
    [{ fontFam: 'Montserrat', fontWeight: 700 }, 'montserrat-bold'],
    [{ fontFamily: 'Inter Semi Bold' }, 'inter'],
    [{ fontFamily: 'Luckiest Guy Regular' }, 'luckiest'],
    [{ fontPS: 'Georgia-Bold' }, 'serif'],
    [{ fontPS: 'CourierNewPS-ItalicMT', fontItalic: true }, 'mono'],
  ];
  for (const [metadata, preview] of cases) {
    const original = file(metadata);
    const decoded = decodePreset(original);
    assert.equal(decoded.settings.font, preview);
    assert.deepEqual(encodePreset(decoded.name, decoded.settings), original);
  }
});

test('unknown fonts retain exact bounded metadata and disclose an Impact preview substitute', () => {
  const original = file({ fontPS: 'ClientSans-ProItalic', fontFamily: 'Client Sans Pro Italic',
    fontFam: 'Client Sans', fontWeight: 550, fontItalic: true, gCase: 'lower', textColor: '#fefefe' });
  const decoded = decodePreset(original);
  assert.equal(decoded.settings.font, 'impact');
  assert.match(decoded.notice, /Impact.*original font metadata.*unless you choose another font/i);
  assert.equal(decoded.settings.importedFont.fontPS, 'ClientSans-ProItalic');
  assert.deepEqual(encodePreset(decoded.name, decoded.settings), original);
  // Missing metadata is kept missing; a preview does not invent installed names.
  const partial = file({ fontPS: 'AnotherUninstalledFont' });
  assert.deepEqual(encodePreset('My captions', decodePreset(partial).settings), partial);
});

test('choosing another browser font replaces imported metadata with its actual installed identity', () => {
  const decoded = decodePreset(file({ fontPS: 'ClientUnknown', fontFamily: 'Client Unknown', fontWeight: 550, fontItalic: true }));
  decoded.settings.font = 'inter';
  const exported = encodePreset('Changed font', decoded.settings);
  assert.deepEqual(Object.fromEntries(Object.entries(exported.settings).filter(([key]) => key.startsWith('font'))), {
    fontPS: 'Inter-SemiBold', fontFamily: 'Inter SemiBold', fontFam: 'Inter', fontWeight: 600, fontItalic: false,
  });
  assert.ok(!Object.hasOwn(exported.settings, 'importedFont'));
  assert.equal(exported.settings.v, 4);
});

test('v4 slider units and fractional maximum duration survive export without migration or rounding', () => {
  const input = { font: 'anton', textCase: 'upper', gFontSize: 58, gTracking: 6,
    gAnimDur: 3, gSlideTime: 4, gOutDur: 7, gMaxDur: 1.25, gShadowDir: 0,
    gAnimStyle: '12', gAnimOut: '5', gStripPunct: false, karaoke: true, gBoxBounce: false };
  const snapshot = structuredClone(input);
  const encoded = encodePreset('Time values', input);
  assert.equal(encoded.settings.gMaxDur, 1.25);
  assert.equal(encoded.settings.gAnimDur, 3);
  assert.equal(encoded.settings.gTracking, 6);
  assert.equal(encoded.settings.gFontSize, 58);
  assert.equal(encoded.settings.gCase, 'upper');
  assert.equal(encoded.settings.gShadowDir, 0);
  assert.ok(!Object.hasOwn(encoded.settings, 'textCase'));
  assert.deepEqual(input, snapshot, 'encoding does not mutate editor state');
  assert.equal(decodePreset(encoded).settings.gMaxDur, 1.25);
});

test('decoder validates file identity, version, finite fields and known setting shapes', () => {
  for (const bad of [null, [], {}, { ...file(), type: 'project' }, { ...file(), app: 'Other app' },
    { ...file(), format: 2 }, { ...file(), format: '1' }, { ...file(), settings: [] },
    file({ v: 3 }), file({ v: '4' }), file({ gMaxDur: Infinity }), file({ gTracking: NaN }),
    file({ gFontSize: {} }), file({ gBoxBounce: 'true' }), file({ gCase: 'surprise' }),
    file({ textColor: 'red' }), file({ gAnimStyle: '15' }), file({ gAnimOut: '9' })]) {
    assert.throws(() => decodePreset(bad));
  }
  assert.throws(() => encodePreset('', {}), /name/);
  assert.throws(() => encodePreset('Not settings', []), /settings/);
});

test('bounded names and font strings are copied without unknown objects or prototype keys', () => {
  const input = JSON.parse(JSON.stringify(file({ fontPS: 'X'.repeat(100), gMaxDur: 1.5,
    unknown: { project: 'not a setting' }, importedFont: { previewFont: 'anton', fontPS: 'Spoofed' } }, 'N'.repeat(100))));
  Object.defineProperty(input.settings, '__proto__', { value: { polluted: true }, enumerable: true });
  const decoded = decodePreset(input);
  assert.equal(decoded.name.length, 40);
  assert.equal(decoded.settings.importedFont.fontPS.length, 80);
  assert.equal(decoded.settings.importedFont.previewFont, 'impact');
  assert.equal(decoded.settings.unknown, undefined);
  assert.equal(decoded.settings.polluted, undefined);
  assert.equal({}.polluted, undefined);
  assert.equal(input.name.length, 100, 'decoding does not mutate input');
});

test('public spoken-language options include the exact count, codes and Cantonese model dependency', () => {
  assert.equal(SPOKEN_LANGUAGES.length, 101);
  assert.equal(new Set(SPOKEN_LANGUAGES.map(language => language.code)).size, 101);
  assert.deepEqual(SPOKEN_LANGUAGES[0], { code: '', name: 'Auto-detect' });
  assert.deepEqual(SPOKEN_LANGUAGES.find(language => language.code === 'yue'), { code: 'yue', name: 'Cantonese', requiredModel: 'large-v3-turbo' });
  assert.equal(SPOKEN_LANGUAGES.find(language => language.code === 'jw').name, 'Javanese');
  assert.equal(SPOKEN_LANGUAGES.find(language => language.code === 'mi').name, 'Māori');
  assert.equal(SPOKEN_LANGUAGES.find(language => language.code === 'tl').name, 'Tagalog');
  assert.ok(Object.isFrozen(SPOKEN_LANGUAGES));
  assert.ok(SPOKEN_LANGUAGES.every(Object.isFrozen));
});
