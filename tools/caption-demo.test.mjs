import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, PRESETS, frameAt, phraseFrameAt, WORDS, WORD_TIMES, LOOP, gain, pillTextColor } from '../caption-engine.mjs';

test('all 18 presets produce finite, bounded frames through a full four-word loop', () => {
  assert.equal(Object.keys(PRESETS).length, 18);
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

test('a new phrase begins its entrance at zero and progresses to a visible settled frame', () => {
  const words = [{ id: 'new', text: 'You', start: 0, end: 0.6 }];
  const pop = { ...DEFAULTS, gAnimStyle: 1, gAnimDur: 1, gPop: 18, gAnimOut: 0 };
  assert.equal(phraseFrameAt(pop, 0, words, 0.7).scale, 0);
  assert.ok(phraseFrameAt(pop, 0.067, words, 0.7).scale > 1, 'the brief overshoot must still be visible');
  assert.equal(phraseFrameAt(pop, 0.1, words, 0.7).scale, 1);
  assert.equal(phraseFrameAt(pop, 0.4, words, 0.7).scale, 1);
  const fade = { ...pop, gAnimStyle: 2 };
  assert.equal(phraseFrameAt(fade, 0, words, 0.7).opacity, 0);
  assert.equal(phraseFrameAt(fade, 0.05, words, 0.7).opacity, 0.5);
  assert.equal(phraseFrameAt(fade, 0.1, words, 0.7).opacity, 1);
});

test('a phrase applies one fade exit at its own end rather than squaring the fade', () => {
  const settings = { ...DEFAULTS, gAnimStyle: 2, gAnimDur: 1, gAnimOut: 1, gOutDur: 2, gOutEaseIn: 0, gOutEaseOut: 0 };
  const words = [{ text: 'Short', start: 0, end: 0.6 }];
  assert.equal(phraseFrameAt(settings, 0.4, words, 0.7).opacity, 1);
  assert.ok(Math.abs(phraseFrameAt(settings, 0.6, words, 0.7).opacity - 0.5) < 1e-12);
  assert.equal(phraseFrameAt(settings, 0.7, words, 0.7).opacity, 0);
  assert.equal(frameAt(settings, 0.7, words).opacity, 1, 'the full-sample API retains its 3.6-second exit clock');
});

test('Smooth exits a short phrase even with no explicit Out animation', () => {
  const settings = { ...DEFAULTS, gAnimStyle: 13, gAnimDur: 1, gPop: 12, gAnimOut: 0 };
  const words = [{ text: 'Short', start: 0, end: 0.6 }];
  const settled = phraseFrameAt(settings, 0.3, words, 0.7);
  assert.equal(settled.opacity, 1); assert.equal(settled.y, 0);
  const leaving = phraseFrameAt(settings, 0.6, words, 0.7);
  assert.ok(leaving.opacity > 0 && leaving.opacity < 1);
  assert.ok(leaving.y > 0 && leaving.y < 22);
  const end = phraseFrameAt(settings, 0.7, words, 0.7);
  assert.equal(end.opacity, 0); assert.equal(end.y, 22);
  assert.equal(frameAt(settings, 0.7, words).opacity, 1);
});

test('phrase word frames use local word starts and remain finite across short lifetimes', () => {
  for (const duration of [0.1, 0.35, 0.7, 1.4, LOOP]) {
    const words = [0, duration / 3, duration * 2 / 3].map((start, i) => ({ id: `word-${i}`, text: `Word${i}`, start, end: start + duration / 4 }));
    const before = JSON.stringify(words);
    words.forEach((word, i) => {
      const frame = phraseFrameAt({ ...DEFAULTS, gAnimStyle: 8 }, word.start, words, duration);
      assert.equal(frame.active, i);
      assert.equal(frame.words[i].opacity, 1);
    });
    for (const preset of Object.values(PRESETS)) {
      for (const time of [0, duration / 4, duration / 2, duration]) {
        const frame = phraseFrameAt({ ...DEFAULTS, ...preset }, time, words, duration);
        assert.equal(frame.words.length, 3);
        for (const value of [frame.opacity, frame.scale, frame.y, frame.blur, frame.clip, frame.tracking, ...frame.words.flatMap(word => Object.values(word))]) assert.ok(Number.isFinite(value));
      }
    }
    assert.equal(JSON.stringify(words), before);
  }
  for (const duration of [undefined, 0, -1, NaN, Infinity]) {
    assert.deepEqual(phraseFrameAt(DEFAULTS, 1, [], duration), frameAt(DEFAULTS, 1, []));
  }
});
