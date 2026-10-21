// Design settings from Captions Gen 1.1 (free release), uxp-panel/main.js.
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
  // Creator looks: the styles caption tools build their template lists around.
  // Named after the look, not the creator. `font` and `textCase` set the demo's
  // Font and Case the way the plugin applies the preset's bundled font.
  "Bold Impact": { font: "montserrat-black", textCase: "upper", gFontSize: 58, textColor: "#FFFFFF", gStroke: 10, strokeColor: "#000000", gShadow: 70, gShadowDist: 8, gShadowBlur: 12, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#F7C204", gHlScale: 12, gHlPop: 6, gAnimStyle: "1", gAnimDur: 1, gPop: 18 },
  "Beast Comic": { font: "bangers", textCase: "upper", gFontSize: 62, textColor: "#FFFFFF", gStroke: 14, strokeColor: "#000000", gShadow: 85, gShadowDist: 10, gShadowBlur: 4, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#39FF14", gHlScale: 15, gHlPop: 10, gAnimStyle: "11", gAnimDur: 1, gPop: 25 },
  "Karaoke Pill": { font: "montserrat-xbold", textCase: "upper", gFontSize: 52, textColor: "#FFFFFF", gStroke: 4, strokeColor: "#000000", gShadow: 50, gShadowDist: 4, gShadowBlur: 8, shadowColor: "#000000", karaoke: true, hlMode: "pill", hlColor: "#7C3AED", gPillRadius: 16, gHlScale: 6, gHlPop: 4, gAnimStyle: "1", gAnimDur: 1, gPop: 10 },
  "Karaoke": { font: "montserrat-bold", textCase: "none", gFontSize: 52, textColor: "#FFFFFF", gStroke: 6, strokeColor: "#000000", gShadow: 45, gShadowDist: 4, gShadowBlur: 10, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#00E676", gAnimStyle: "2", gAnimDur: 1 },
  "Punch": { font: "anton", textCase: "upper", gFontSize: 70, textColor: "#FFFFFF", gStroke: 6, strokeColor: "#000000", gShadow: 60, gShadowDist: 6, gShadowBlur: 10, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#F7C204", gHlScale: 8, gHlPop: 5, gAnimStyle: "4", gAnimDur: 1, gPop: 14 },
  "Gamer": { font: "luckiest", textCase: "upper", gFontSize: 58, textColor: "#FFFFFF", gStroke: 14, strokeColor: "#000000", gShadow: 90, gShadowDist: 8, gShadowBlur: 0, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#00E5FF", gHlScale: 20, gHlPop: 18, gAnimStyle: "11", gAnimDur: 1, gPop: 30, gAnimOut: "5" },
  "Glow": { font: "montserrat-xbold", textCase: "upper", gFontSize: 54, textColor: "#FFFFFF", gStroke: 0, gShadow: 80, gShadowDist: 0, gShadowBlur: 30, shadowColor: "#8EF6FF", karaoke: true, hlMode: "color", hlColor: "#8EF6FF", gHlScale: 8, gAnimStyle: "9", gAnimDur: 3, gPop: 8, gAnimOut: "1" },
  "Podcast": { font: "montserrat-bold", textCase: "none", gFontSize: 50, textColor: "#FFFFFF", gStroke: 5, strokeColor: "#000000", gShadow: 55, gShadowDist: 4, gShadowBlur: 12, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#FFD400", gAnimStyle: "2", gAnimDur: 1 },
  "Minimal": { font: "montserrat-medium", textCase: "lower", gFontSize: 44, textColor: "#CFCFCF", gStroke: 0, gShadow: 45, gShadowDist: 2, gShadowBlur: 14, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#FFFFFF", gHlScale: 6, gAnimStyle: "2", gAnimDur: 2, gAnimOut: "1" },
  "Subtitle Box": { font: "inter", textCase: "none", gFontSize: 42, textColor: "#FFFFFF", gStroke: 0, gShadow: 0, karaoke: false, boxColor: "#000000", gBoxOpacity: 65, gAnimStyle: "2", gAnimDur: 1, gAnimOut: "1" },
  "Clean Fade": { font: "inter", textCase: "none", gFontSize: 46, textColor: "#FFFFFF", gStroke: 0, gShadow: 50, gShadowDist: 3, gShadowBlur: 16, shadowColor: "#000000", karaoke: false, gAnimStyle: "14", gAnimDur: 2, gAnimOut: "1" },
  "Serif Story": { font: "dmserif", textCase: "lower", gFontSize: 54, textColor: "#FFFFFF", gStroke: 0, gShadow: 60, gShadowDist: 0, gShadowBlur: 20, shadowColor: "#000000", karaoke: true, hlMode: "color", hlColor: "#F5D76E", gAnimStyle: "3", gAnimDur: 3, gAnimOut: "2" },
  // Classics kept from 1.0.x.
  "Clean": { gAnimStyle: "2", gAnimDur: 2, gStroke: 0, gShadow: 25, gShadowBlur: 30, gShadowDist: 4, gTracking: 2, karaoke: false },
  "Typewriter": { gAnimStyle: "7", gAnimDur: 3, gStroke: 6, gTracking: 3, karaoke: false },
  "Spring": { gAnimStyle: "11", gAnimDur: 3, gPop: 14, gShadow: 45, karaoke: false },
  // Apple Music lyric: words fade in + rise at their spoken times (anim 12).
  "Rise": { gAnimStyle: "12", gAnimDur: 3, gStroke: 0, gShadow: 30, gShadowBlur: 30, gShadowDist: 3, gSlideTime: 4, gEaseOut: 70, karaoke: true, hlMode: "color", hlColor: "#FFFFFF", gHlScale: 8 },
  // System motion: whole caption eases up in, eases down out (anim 13).
  "Smooth": { gAnimStyle: "13", gAnimDur: 3, gPop: 10, gStroke: 0, gShadow: 25, gShadowBlur: 35, gShadowDist: 3, gTracking: 1, karaoke: false },
};

export const PRESET_META = {
  "Plain":        { cat: "Clean",  desc: "the template as-is: white Impact, karaoke yellow, pop-in" },
  "Bold Impact":  { cat: "Trend",  desc: "heavy caps, black outline and hard shadow, yellow spoken word, quick pop" },
  "Beast Comic":  { cat: "Trend",  desc: "comic font, 1-2 words, thick stroke, green spoken word, bounce" },
  "Karaoke Pill": { cat: "Trend",  desc: "rounded box slides behind the spoken word" },
  "Karaoke":      { cat: "Trend",  desc: "two outlined lines, the spoken word turns green" },
  "Punch":        { cat: "Trend",  desc: "tall condensed caps, 1-3 big words slide up" },
  "Gamer":        { cat: "Trend",  desc: "chunky font, huge outline, bouncing cyan word" },
  "Glow":         { cat: "Trend",  desc: "light caps with a cyan glow, gentle float" },
  "Podcast":      { cat: "Clean",  desc: "sentence case, two lines, yellow spoken word" },
  "Minimal":      { cat: "Clean",  desc: "all lowercase, soft grey, the spoken word turns white" },
  "Subtitle Box": { cat: "Clean",  desc: "white sentence case on a dark box, for tutorials and talks" },
  "Clean Fade":   { cat: "Clean",  desc: "sober sans, words fade in as spoken, no color" },
  "Serif Story":  { cat: "Clean",  desc: "lowercase serif, soft shadow, blur-fade, for storytelling" },
  "Clean":        { cat: "Clean",  desc: "no stroke, soft shadow, wide spacing, no karaoke" },
  "Typewriter":   { cat: "Motion", desc: "letters type in, thin stroke, no karaoke" },
  "Spring":       { cat: "Motion", desc: "damped bounce entrance" },
  "Rise":         { cat: "Motion", desc: "words rise and fade in as spoken, lyric-video style" },
  "Smooth":       { cat: "Motion", desc: "whole caption eases up in and down out" },
};
