// Browser-only prepared captions. All timing here is estimated sample timing,
// never transcription or alignment against an audio file.
const DURATION = 3.6;
const MAX_WORDS = 36;
const keyFor = text => text.toLowerCase().replace(/^[\p{P}]+|[\p{P}]+$/gu, "") || text.toLowerCase();

/** Build local word timings while keeping unchanged words' usable anchors. */
export function wordsForText(text, previousWords = [], duration = DURATION) {
  const tokens = String(text ?? "").trim().split(/\s+/u).filter(Boolean);
  if (tokens.length > MAX_WORDS) throw new RangeError(`Use at most ${MAX_WORDS} words in a sample caption.`);
  if (!tokens.length) return [];
  const length = Number.isFinite(duration) && duration > 0 ? duration : DURATION;
  const previous = Array.isArray(previousWords) ? previousWords.slice(0, MAX_WORDS).filter(word => typeof word?.text === "string") : [];
  const oldIds = previous.map((word, index) => String(word.id ?? `word-${index + 1}`));
  const used = new Set(oldIds);
  let nextId = 1;
  const freshId = () => { while (used.has(`word-${nextId}`)) nextId++; const id = `word-${nextId++}`; used.add(id); return id; };

  // Longest common subsequence keeps repeated words in transcript order.
  const table = Array.from({ length: previous.length + 1 }, () => Array(tokens.length + 1).fill(0));
  for (let i = previous.length - 1; i >= 0; i--) {
    for (let j = tokens.length - 1; j >= 0; j--) {
      table[i][j] = keyFor(previous[i].text) === keyFor(tokens[j])
        ? 1 + table[i + 1][j + 1] : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const matches = new Map();
  for (let i = 0, j = 0; i < previous.length && j < tokens.length;) {
    if (keyFor(previous[i].text) === keyFor(tokens[j])) { matches.set(j++, i++); }
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  const result = tokens.map((word, index) => ({
    id: matches.has(index) ? oldIds[matches.get(index)] : freshId(),
    text: word, start: 0, end: 0, estimated: true,
  }));
  const anchors = [];
  let lastEnd = 0;
  for (const [index, oldIndex] of matches) {
    const old = previous[oldIndex];
    if (Number.isFinite(old.start) && Number.isFinite(old.end) && old.start >= lastEnd && old.end > old.start && old.end <= length) {
      anchors.push({ index, start: old.start, end: old.end }); lastEnd = old.end;
    }
  }
  const boundaries = [{ index: -1, end: 0 }, ...anchors, { index: tokens.length, start: length }];
  const minimum = Math.min(0.04, length / (tokens.length * 2));
  const roomForInsertions = boundaries.slice(0, -1).every((left, i) => {
    const right = boundaries[i + 1], count = right.index - left.index - 1;
    return count === 0 || right.start - left.end >= count * minimum;
  });
  if (roomForInsertions) {
    for (const anchor of anchors) Object.assign(result[anchor.index], { start: anchor.start, end: anchor.end });
    boundaries.slice(0, -1).forEach((left, i) => {
      const right = boundaries[i + 1], count = right.index - left.index - 1;
      if (!count) return;
      const slot = (right.start - left.end) / count;
      for (let j = 0; j < count; j++) {
        const start = left.end + j * slot;
        Object.assign(result[left.index + j + 1], { start, end: Math.min(length, start + slot * 0.8) });
      }
    });
  } else {
    // A tightly packed edit has no room for new words without moving anchors.
    const slot = length / tokens.length;
    result.forEach((word, index) => { word.start = index * slot; word.end = Math.min(length, word.start + slot * 0.8); });
  }
  return result;
}

function sampleFindPattern(find) {
  const query = String(find ?? "").trim();
  if (!query) return null;
  const literal = query.split(/\s+/u).map(part => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
  const boundary = "[\\p{L}\\p{N}\\p{M}_]";
  return new RegExp(`(?<!${boundary})${literal}(?!${boundary})`, "giu");
}

/** Find-only uses the same whole-word matching as sample replacement. */
export function findSampleMatches(captions, find) {
  const pattern = sampleFindPattern(find);
  if (!pattern) return [];
  return captions.flatMap(caption => {
    const count = [...String(caption.text ?? "").matchAll(pattern)].length;
    return count ? [{ id: caption.id, count }] : [];
  });
}

/** Match the AE panel's whole-word, case-insensitive, literal find/replace. */
export function findReplaceSample(captions, find, replacement) {
  const pattern = sampleFindPattern(find), value = String(replacement ?? "").trim();
  // The shipped AE panel treats an empty replacement as find-only.
  if (!pattern || !value) return captions.slice();
  return captions.map(caption => {
    const text = String(caption.text ?? "").replace(pattern, () => value);
    if (text === caption.text) return caption;
    const duration = Number.isFinite(caption.duration) && caption.duration > 0 ? caption.duration
      : Number.isFinite(caption.end - caption.start) && caption.end > caption.start ? caption.end - caption.start : DURATION;
    return { ...caption, text, words: wordsForText(text, caption.words, duration), timingEstimated: true };
  });
}

const texts = ["Captions made for you", "Edit a word and update animation", "Try another style on this sample"];
export const SAMPLE_CAPTIONS = Object.freeze(texts.map((text, index) => {
  const seed = index === 0 ? text.split(" ").map((word, i) => ({ text: word, start: 0.1 + i * 0.7, end: 0.65 + i * 0.7 })) : [];
  const words = wordsForText(text, seed).map(word => Object.freeze(word));
  return Object.freeze({ id: `sample-${index + 1}`, text, start: index * DURATION, end: (index + 1) * DURATION,
    duration: DURATION, words: Object.freeze(words), timingEstimated: true });
}));
