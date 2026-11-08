import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_CAPTIONS, wordsForText, findReplaceSample, findSampleMatches } from '../caption-sample.mjs';
import { DEFAULTS, frameAt, LOOP } from '../caption-engine.mjs';

function validTiming(words, duration = 3.6) {
  let end = 0;
  const ids = new Set();
  for (const word of words) {
    assert.ok(Number.isFinite(word.start) && Number.isFinite(word.end));
    assert.ok(word.start >= end && word.end > word.start && word.end <= duration);
    assert.equal(word.estimated, true, 'sample timing must never imply audio alignment');
    assert.ok(!ids.has(word.id)); ids.add(word.id); end = word.end;
  }
}

test('prepared captions provide three contiguous local sample timelines', () => {
  assert.equal(SAMPLE_CAPTIONS.length, 3);
  assert.equal(SAMPLE_CAPTIONS[0].text, 'Captions made for you');
  SAMPLE_CAPTIONS.forEach((caption, i) => {
    assert.equal(caption.duration, 3.6);
    assert.equal(caption.start, i * 3.6);
    assert.equal(caption.end, (i + 1) * 3.6);
    assert.equal(caption.timingEstimated, true);
    assert.equal(caption.words.map(word => word.text).join(' '), caption.text);
    validTiming(caption.words);
  });
});

test('inserting a word retains the unchanged timing anchors and stable word IDs', () => {
  const old = SAMPLE_CAPTIONS[0].words;
  const snapshot = JSON.stringify(old);
  const edited = wordsForText('Captions made just for you', old);
  validTiming(edited);
  for (const [before, after] of [[0, 0], [1, 1], [2, 3], [3, 4]]) {
    assert.equal(edited[after].id, old[before].id);
    assert.equal(edited[after].start, old[before].start);
    assert.equal(edited[after].end, old[before].end);
  }
  assert.ok(edited[2].start >= old[1].end && edited[2].end <= old[2].start);
  assert.equal(JSON.stringify(old), snapshot, 'editing must not mutate previous or prepared words');
});

test('case/punctuation edits and repeated-word deletion keep appropriate anchors', () => {
  const old = wordsForText('Go go now');
  const edited = wordsForText('GO! now', old);
  validTiming(edited);
  assert.equal(edited[0].id, old[0].id);
  assert.equal(edited[0].start, old[0].start);
  assert.equal(edited[1].id, old[2].id);
  assert.equal(edited[1].start, old[2].start);
});

test('dense and invalid old timings are redistributed within bounds', () => {
  const old = [{ id: 'one', text: 'one', start: 0, end: 1.8 }, { id: 'two', text: 'two', start: 1.8, end: 3.6 }];
  const edited = wordsForText('one inserted two', old);
  validTiming(edited);
  assert.equal(edited[0].id, 'one'); assert.equal(edited[2].id, 'two');
  const invalid = wordsForText('one two', [{ text: 'one', start: NaN, end: Infinity }, { text: 'two', start: -2, end: 99 }], 2);
  validTiming(invalid, 2);
  assert.deepEqual(wordsForText(' \n\t '), []);
  assert.throws(() => wordsForText(Array(37).fill('word').join(' ')), RangeError);
});

test('find/replace matches whole Unicode words, ignores case and treats replacement literally', () => {
  const captions = [{ ...SAMPLE_CAPTIONS[0], text: 'Café CAFÉ caféine' }, { ...SAMPLE_CAPTIONS[1], text: 'No matching words' }];
  const before = JSON.stringify(captions);
  const updated = findReplaceSample(captions, 'café', '$&');
  assert.equal(updated[0].text, '$& $& caféine');
  assert.equal(updated[1], captions[1]);
  assert.equal(JSON.stringify(captions), before);
  validTiming(updated[0].words);
  assert.equal(findReplaceSample(captions, 'café', '')[0], captions[0], 'blank replacement matches the AE find-only behavior');
  assert.equal(findReplaceSample(captions, '', 'x')[0], captions[0]);
});

test('find/replace accepts literal multiword phrases separated by whitespace', () => {
  const captions = [{ ...SAMPLE_CAPTIONS[0], text: 'Try [a+b]   now; a+b is literal.' }];
  const updated = findReplaceSample(captions, '[a+b] now', 'a sample');
  assert.equal(updated[0].text, 'Try a sample; a+b is literal.');
  validTiming(updated[0].words);
});

test('find-only returns caption IDs and counts without changing the prepared text', () => {
  const captions = [{ id: 'one', text: 'Cat cat, cats scatter.' }, { id: 'two', text: 'A CAT!' }, { id: 'three', text: 'A category.' }];
  const before = JSON.stringify(captions);
  assert.deepEqual(findSampleMatches(captions, 'cat'), [{ id: 'one', count: 2 }, { id: 'two', count: 1 }]);
  assert.deepEqual(findSampleMatches(captions, ''), []);
  assert.deepEqual(findSampleMatches(captions, 'absent'), []);
  assert.equal(JSON.stringify(captions), before);
  const updated = findReplaceSample(captions, 'cat', 'dog');
  assert.equal(updated[0].text, 'dog dog, cats scatter.');
  assert.equal(updated[1].text, 'A dog!');
  assert.equal(updated[2], captions[2]);
});

test('word-timed animations and karaoke follow arbitrary caption word counts', () => {
  for (const count of [1, 2, 5, 12, 36]) {
    const words = wordsForText(Array.from({ length: count }, (_, i) => `word${i}`).join(' '));
    for (let anim = 0; anim <= 14; anim++) {
      for (let out = 0; out <= 5; out++) {
        const settings = { ...DEFAULTS, gAnimStyle: anim, gAnimOut: out, gHlPop: 18, gBoxBounce: true };
        for (const time of [0, 0.05, 0.2, 0.8, 1.7, 2.5, 3.5, 3.6]) {
          const frame = frameAt(settings, time, words);
          assert.equal(frame.words.length, count);
          assert.ok(frame.active >= 0 && frame.active < count);
          for (const value of [frame.opacity, frame.scale, frame.y, frame.blur, frame.clip, frame.tracking, ...frame.words.flatMap(word => Object.values(word))]) assert.ok(Number.isFinite(value));
        }
      }
    }
    words.forEach((word, i) => {
      const frame = frameAt({ ...DEFAULTS, gAnimStyle: 8 }, word.start + 0.0001, words);
      assert.equal(frame.active, i);
      assert.equal(frame.words[i].opacity, 1);
    });
  }
  assert.equal(frameAt({ ...DEFAULTS, gHlPop: 10 }, 1, []).active, -1);
  assert.deepEqual(frameAt(DEFAULTS, NaN, []).words, []);
});

test('Float, Bounce and Typewriter match known points in the released 1.1.9 preview formulas', () => {
  const floating = frameAt({ ...DEFAULTS, gAnimStyle: 9, gPop: 12, gAnimDur: 2 }, 0.1);
  assert.ok(Math.abs(floating.y - 0.7666666666666666) < 1e-10);
  assert.ok(Math.abs(floating.scale - 0.99) < 1e-10);
  assert.ok(Math.abs(frameAt({ ...DEFAULTS, gAnimStyle: 11, gAnimDur: 2 }, 0.06).scale - 0.4) < 1e-10);
  assert.ok(Math.abs(frameAt({ ...DEFAULTS, gAnimStyle: 11, gAnimDur: 2 }, 0.12).scale - 0.8) < 1e-10);
  const typed = frameAt({ ...DEFAULTS, gAnimStyle: 7, gAnimDur: 10 }, 0.1);
  assert.ok(Math.abs(typed.clip - 93.33333333333333) < 1e-10);
});

test('Scale Down exit strength changes the curve and zero strength disables shrink', () => {
  const settings = { ...DEFAULTS, gAnimStyle: 0, gAnimOut: 5, gOutDur: 4 };
  const normal = frameAt({ ...settings, gOutPop: 12 }, LOOP - 0.2).scale;
  assert.ok(normal > 0 && normal < 1);
  assert.ok(Math.abs(frameAt({ ...settings, gOutPop: 24 }, LOOP - 0.2).scale - normal ** 2) < 1e-10);
  assert.equal(frameAt({ ...settings, gOutPop: 0 }, LOOP).scale, 1);
  assert.equal(frameAt({ ...settings, gOutPop: 24 }, LOOP).scale, 0);
});
