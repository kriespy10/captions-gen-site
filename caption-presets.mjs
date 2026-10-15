// Design settings from Captions Gen 1.0.8, uxp-panel/main.js.
// Keep the defaults and preset overrides in plugin slider units.
export const DEFAULTS = {
  gFontSize: 52, gPosY: 81, gTracking: 0,
  gStroke: 8, gShadow: 55, gShadowDist: 10, gShadowBlur: 25, gShadowDir: 135,
  gHlScale: 0, gHlPop: 0, gPillRadius: 56, gBoxOpacity: 0,
  gPop: 12, gAnimDur: 2, gSlideTime: 4, gEaseIn: 0, gEaseOut: 60, gOutDur: 2, gOutPop: 12, gOutEaseIn: 0, gOutEaseOut: 60,
  gAnimStyle: "1", gAnimOut: "0", hlMode: "color", karaoke: true,
};

export const PRESETS = {
  "Plain": {},
  "Beast": { gAnimStyle: "0", gStroke: 12, strokeColor: "#000000", gShadow: 80, karaoke: true, hlMode: "color", hlColor: "#FFEB3B", gHlScale: 5 },
  "Clean": { gAnimStyle: "2", gAnimDur: 2, gStroke: 0, gShadow: 25, gShadowBlur: 30, gShadowDist: 4, gTracking: 2, karaoke: false },
  "Neon": { gAnimStyle: "3", gAnimDur: 2, gPop: 20, gStroke: 0, gShadow: 90, gShadowBlur: 45, gShadowDist: 1, karaoke: true, hlMode: "color", hlColor: "#39FF14", shadowColor: "#39FF14" },
  "Bubble": { gAnimStyle: "9", gAnimDur: 2, gStroke: 0, gShadow: 40, karaoke: true, hlMode: "pill", hlColor: "#0A84FF" },
  "Typewriter": { gAnimStyle: "7", gAnimDur: 3, gStroke: 6, gTracking: 3, karaoke: false },
  "Flow": { gAnimStyle: "8", gAnimDur: 2, gShadow: 50, karaoke: true, hlMode: "color", hlColor: "#00E676", gHlScale: 10 },
  // Hormozi-style: heavy white caps, hot yellow highlight, hard shadow.
  "Hormozi": { gAnimStyle: "1", gAnimDur: 1, gPop: 8, gStroke: 0, gShadow: 85, gShadowDist: 6, gShadowBlur: 8, karaoke: true, hlMode: "color", hlColor: "#FFE600", gHlScale: 12, textColor: "#FFFFFF" },
  // CapCut-style word chips: white rounded background behind the active word,
  // spring-pops on every word activation.
  "Chips": { gAnimStyle: "2", gAnimDur: 1, gStroke: 0, gShadow: 35, karaoke: true, hlMode: "pill", hlColor: "#FFFFFF", gPillRadius: 12, gHlPop: 18 },
  // Apple-inspired: Float = soft scale+fade; Expand = letters settle from wide
  // tracking (Apple TV titles); Spring = damped bounce.
  "Float": { gAnimStyle: "9", gAnimDur: 3, gStroke: 0, gShadow: 20, gShadowBlur: 35, gShadowDist: 3, karaoke: false },
  "Expand": { gAnimStyle: "10", gAnimDur: 3, gPop: 30, gStroke: 0, gShadow: 15, gShadowBlur: 30, gTracking: 2, karaoke: false },
  "Spring": { gAnimStyle: "11", gAnimDur: 3, gPop: 14, gShadow: 45, karaoke: false },
  // Apple Music lyric: words fade in + rise at their spoken times (anim 12).
  "Rise": { gAnimStyle: "12", gAnimDur: 3, gStroke: 0, gShadow: 30, gShadowBlur: 30, gShadowDist: 3, gSlideTime: 4, gEaseOut: 70, karaoke: true, hlMode: "color", hlColor: "#FFFFFF", gHlScale: 8 },
  // System motion: whole caption eases up in, eases down out (anim 13).
  "Smooth": { gAnimStyle: "13", gAnimDur: 3, gPop: 10, gStroke: 0, gShadow: 25, gShadowBlur: 35, gShadowDist: 3, gTracking: 1, karaoke: false },
  "Podcast": { gAnimStyle: "2", gAnimDur: 2, gStroke: 0, gShadow: 0, gBoxOpacity: 75, boxColor: "#000000", gTracking: 1, karaoke: false },
  // Podcast box + karaoke highlight sweep.
  "Studio": { gAnimStyle: "0", gStroke: 0, gShadow: 0, gBoxOpacity: 90, boxColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#FFEB3B", gHlScale: 8 },
  // AE "Fade Up Words" look: words fade in, in place, at their spoken times.
  "Fade In": { gAnimStyle: "14", gAnimDur: 3, gStroke: 0, gShadow: 30, gShadowBlur: 30, gShadowDist: 3, karaoke: true, hlMode: "color", hlColor: "#FFFFFF", gHlScale: 8 },
};

export const PRESET_META = {
  "Plain":      { cat: "Clean",  desc: "the template as-is: white Impact, karaoke yellow, pop-in" },
  "Beast":      { cat: "Trend",  desc: "heavy stroke and shadow, yellow karaoke, no motion" },
  "Hormozi":    { cat: "Trend",  desc: "hard shadow, hot-yellow karaoke that grows, quick pop" },
  "Chips":      { cat: "Trend",  desc: "white chip behind the spoken word, springs on every word" },
  "Neon":       { cat: "Trend",  desc: "green glow shadow, blur-fade entrance, green karaoke" },
  "Flow":       { cat: "Trend",  desc: "words reveal as spoken, green karaoke" },
  "Bubble":     { cat: "Trend",  desc: "blue pill behind the spoken word, soft float-in" },
  "Clean":      { cat: "Clean",  desc: "no stroke, soft shadow, wide spacing, no karaoke" },
  "Typewriter": { cat: "Clean",  desc: "letters type in, thin stroke, no karaoke" },
  "Podcast":    { cat: "Clean",  desc: "black box behind the caption, fade-in, no karaoke" },
  "Studio":     { cat: "Clean",  desc: "black box, yellow karaoke, no motion" },
  "Float":      { cat: "Motion", desc: "soft scale + fade entrance" },
  "Expand":     { cat: "Motion", desc: "letters settle in from wide spacing" },
  "Spring":     { cat: "Motion", desc: "damped bounce entrance" },
  "Rise":       { cat: "Motion", desc: "words rise and fade in as spoken, lyric-video style" },
  "Smooth":     { cat: "Motion", desc: "whole caption eases up in and down out" },
  "Fade In":    { cat: "Motion", desc: "words fade in, in place, as spoken" },
};
