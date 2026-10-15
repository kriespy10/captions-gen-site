import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, PRESETS, frameAt, WORDS, WORD_TIMES, LOOP, gain, pillTextColor } from '../caption-engine.mjs';

test('all 17 presets produce finite, bounded frames through a full four-word loop', () => {
  assert.equal(Object.keys(PRESETS).length, 17);
  assert.equal(WORDS.join(' '), 'Captions made for you');
  const finite = value => typeof value === 'number' ? assert.ok(Number.isFinite(value)) : Object.values(value).forEach(finite);
  for (const preset of Object.values(PRESETS)) {
    const settings = { ...DEFAULTS, ...preset };
    for (let t = 0; t <= LOOP; t += 0.03) {
      const frame = frameAt(settings, t); finite(frame);
      assert.ok(frame.active >= 0 && frame.active < WORDS.length);
      assert.ok(frame.opacity >= 0 && frame.opacity <= 1);
      assert.ok(frame.scale >= 0);
      assert.equal(frame.words.length, WORDS.length);
    }
  }
});

test('word-timed effects and karaoke follow all four spoken starts', () => {
  const s = { ...DEFAULTS, gAnimStyle: 8 };
  WORD_TIMES.forEach((time, i) => {
    const before = frameAt(s, time - 0.001), after = frameAt(s, time + 0.001);
    assert.equal(before.words[i].opacity, 0);
    assert.equal(after.words[i].opacity, 1);
    assert.equal(after.active, i);
  });
  assert.equal(frameAt(s, LOOP).words.filter(word => word.opacity === 1).length, 4);
});

test('each exit reaches its end state independently from entrance duration', () => {
  for (let gAnimOut = 1; gAnimOut <= 5; gAnimOut++) {
    const s = { ...DEFAULTS, gAnimStyle: 0, gAnimOut, gOutDur: 4, gAnimDur: 15 };
    assert.equal(frameAt(s, LOOP - 0.5).opacity, 1);
    const end = frameAt(s, LOOP);
    if (gAnimOut < 5) assert.equal(end.opacity, 0);
    else assert.equal(end.scale, 0);
  }
  assert.equal(gain(DEFAULTS, 0), 0); assert.equal(gain(DEFAULTS, 1), 1);
});

test('pill lettering stays readable on light and dark highlights', () => {
  assert.equal(pillTextColor('#FFFFFF', '#FFFFFF'), '#111111');
  assert.equal(pillTextColor('#000000', '#000000'), '#FFFFFF');
  assert.equal(pillTextColor('#000000', '#FFFFFF'), '#FFFFFF');
});
