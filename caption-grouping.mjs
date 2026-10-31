// Groups word-timed transcript into caption phrases and breaks them into lines.
// Phrase = { words, start, end, lines }  — lines are arrays of word indices.

function breakLines(words, maxCharsPerLine) {
  const lines = [];
  let line = [];
  let len = 0;
  words.forEach((w, i) => {
    const addition = (line.length ? 1 : 0) + w.text.length;
    if (line.length && len + addition > maxCharsPerLine) {
      lines.push(line);
      line = [i];
      len = w.text.length;
    } else {
      line.push(i);
      len += addition;
    }
  });
  if (line.length) lines.push(line);
  return lines;
}

// Characters that fit on one caption line for a given sequence and text size.
// Premiere resizes the MOGRT comp's canvas to the sequence frame but does NOT
// scale its content: the template's 90 px font at Text Size 100 stays 90 px
// whatever the frame is. The panel's "text size %" is Text Size × 5.2 / 100
// (5.2% ≈ 90 px on a 1920-tall vertical frame, where this was first measured:
// 36 chars overflowed both edges of 1440 px). Treating it as a % of frame
// height instead over-counted a 1920×1080 line by ~2x — 33 chars ran off both
// sides. Average advance ≈ 0.65 em covers wide bold sans fonts (Impact ≈ 0.48
// simply wraps a little early); 0.9 = safe width.
// Letter spacing (px between letters on the timeline) widens every character.
export function autoCharsPerLine(frameWidth, frameHeight, textSizePct, letterSpacingPx = 0) {
  const w = Number(frameWidth), h = Number(frameHeight), pct = Number(textSizePct);
  if (!(w > 0) || !(h > 0) || !(pct > 0)) return 0;
  const usable = w * 0.9;
  const fontPx = 90 * (pct / 5.2);
  const charW = fontPx * 0.65 + Math.max(0, Number(letterSpacingPx) || 0);
  return Math.max(8, Math.min(60, Math.floor(usable / charW)));
}

// Phrase text with real line breaks from `lines` (arrays of word indices).
export function phraseText(words, lines) {
  if (!lines || !lines.length) return words.map((w) => w.text).join(" ");
  return lines.map((line) => line.map((i) => words[i].text).join(" ")).join("\n");
}

const MIN_WORD_SEC = 0.06; // sub-frame word timings get a readable minimum

function enforceMinDurations(words) {
  return words.map((w, i) => {
    if (w.end - w.start >= MIN_WORD_SEC) return w;
    const cap = i + 1 < words.length ? words[i + 1].start : w.start + MIN_WORD_SEC;
    return { ...w, end: Math.max(w.start + MIN_WORD_SEC, Math.min(cap, w.start + MIN_WORD_SEC)) };
  });
}

// Strip display punctuation but keep intra-word apostrophes and hyphens.
const PUNCT_RE = /[.,!?;:…"“”„«»()[\]]/g;

export function groupWords(rawWords, style) {
  const words = enforceMinDurations(rawWords);
  const { maxCharsPerLine, maxLines, maxWordsPerPhrase, maxGapSec } = style.layout;
  const minWordsPerPhrase = Math.min(style.layout.minWordsPerPhrase || 1, maxWordsPerPhrase);
  const stripPunctuation = !!style.layout.stripPunctuation;
  const { holdSec, minPhraseSec } = style.timing;
  const charBudget = style.layout.maxCharsPerPhrase || maxCharsPerLine * maxLines;

  // 1. Sentence-first segmentation: punctuation or a long gap ends a segment.
  const sentences = [];
  let cur = [];
  for (const w of words) {
    const gap = cur.length ? w.start - cur.at(-1).end : 0;
    if (cur.length && gap > maxGapSec) {
      sentences.push(cur);
      cur = [];
    }
    cur.push(w);
    if (/[.!?]$/.test(w.text)) {
      sentences.push(cur);
      cur = [];
    }
  }
  if (cur.length) sentences.push(cur);

  // 1b. Merge sentences below the word minimum into a close neighbor
  // (never across a silence longer than maxGapSec).
  const mergedSents = [];
  for (const sent of sentences) {
    const prev = mergedSents.at(-1);
    const gap = prev ? sent[0].start - prev.at(-1).end : Infinity;
    const eitherTiny = prev && (prev.length < minWordsPerPhrase || sent.length < minWordsPerPhrase);
    if (eitherTiny && gap <= maxGapSec) prev.push(...sent);
    else mergedSents.push(sent);
  }

  // 2. Balanced chunking: a 6-word sentence becomes 3+3, never 5+1.
  const groups = [];
  const chunkBalanced = (sent) => {
    const textLen = sent.reduce((n, w, i) => n + w.text.length + (i > 0 ? 1 : 0), 0);
    const byWords = Math.ceil(sent.length / maxWordsPerPhrase);
    const byChars = Math.ceil(textLen / charBudget);
    // Hard caps (max words, chars-per-caption from maxLines) always split as
    // needed; the min-words preference acts earlier, at sentence merging.
    // A word is indivisible; more chunks than words would create empty captions.
    const k = Math.min(sent.length, Math.max(byWords, byChars));
    if (k <= 1) {
      groups.push(sent);
      return;
    }
    const base = Math.floor(sent.length / k);
    let extra = sent.length % k;
    let i = 0;
    for (let c = 0; c < k; c++) {
      const size = base + (extra-- > 0 ? 1 : 0);
      groups.push(sent.slice(i, i + size));
      i += size;
    }
  };
  mergedSents.forEach(chunkBalanced);

  // 2b. Duration cap: split any chunk whose speech span outstays maxDurationSec.
  const maxDur = style.layout.maxDurationSec || 0;
  if (maxDur > 0) {
    const durGroups = [];
    for (const g of groups) {
      const span = g.at(-1).end - g[0].start;
      const k = Math.ceil(span / maxDur);
      if (k <= 1 || g.length === 1) {
        durGroups.push(g);
        continue;
      }
      const base = Math.floor(g.length / k);
      let extra = g.length % k;
      let i = 0;
      for (let c = 0; c < k && i < g.length; c++) {
        const size = base + (extra-- > 0 ? 1 : 0);
        if (size > 0) durGroups.push(g.slice(i, i + size));
        i += size;
      }
    }
    groups.length = 0;
    groups.push(...durGroups);
  }

  // 3. Optional punctuation strip — after segmentation so sentences still split right.
  let displayGroups = stripPunctuation
    ? groups.map((g) =>
        g.map((w) => {
          const t = w.text.replace(PUNCT_RE, "");
          return t ? { ...w, text: t } : w;
        })
      )
    : groups;

  // 4. Optional case transform: "upper" | "lower" | "sentence" (first letter per phrase, "i" fixed up).
  const textCase = style.layout.textCase;
  if (textCase === "upper" || textCase === "lower" || textCase === "sentence") {
    displayGroups = displayGroups.map((g) =>
      g.map((w, i) => {
        let t = w.text;
        if (textCase === "upper") t = t.toUpperCase();
        else {
          t = t.toLowerCase();
          if (textCase === "sentence") {
            t = t.replace(/\bi(?=[' ]|$)/g, "I");
            if (i === 0) t = t.charAt(0).toUpperCase() + t.slice(1);
          }
        }
        return { ...w, text: t };
      })
    );
  }

  // Never more lines than maxLines: if the per-line width can't hold the
  // caption in that many lines, widen the lines rather than add a third.
  const breakCapped = (g) => {
    let lines = breakLines(g, maxCharsPerLine);
    let width = maxCharsPerLine;
    while (lines.length > Math.max(1, maxLines) && width < 200) {
      width = Math.ceil(width * 1.25);
      lines = breakLines(g, width);
    }
    return lines;
  };
  const phrases = displayGroups.map((g) => ({
    words: g,
    start: g[0].start,
    end: Math.max(g.at(-1).end + holdSec, g[0].start + minPhraseSec),
    lines: breakCapped(g),
  }));

  // Clamp each phrase so it never overlaps the next one.
  for (let i = 0; i < phrases.length - 1; i++) {
    phrases[i].end = Math.min(phrases[i].end, phrases[i + 1].start);
  }
  return phrases;
}
