// Captions Gen 1.1.2: synced from uxp-panel/main.js.
// Values use the shipped panel's slider units; gCase maps to browser textCase.
export const PANEL_VERSION = '1.1.2';
export const FIRST_PRESET = "Bold Impact";
export const GROUPING_DEFAULTS = {
  "textCase": "upper",
  "gStripPunct": false,
  "gMinWords": 3,
  "gMaxWords": 5,
  "gMaxChars": 0,
  "gMaxDur": 0,
  "gMaxLines": 2
};
export const DEFAULTS = {
  "gFontSize": 52,
  "gPosY": 81,
  "gTracking": 0,
  "gStroke": 8,
  "gShadow": 55,
  "gShadowDist": 10,
  "gShadowBlur": 25,
  "gShadowDir": 135,
  "gHlScale": 0,
  "gHlPop": 0,
  "gPillRadius": 56,
  "gBoxOpacity": 0,
  "gPop": 12,
  "gAnimDur": 2,
  "gSlideTime": 4,
  "gEaseIn": 0,
  "gEaseOut": 60,
  "gOutDur": 2,
  "gOutPop": 12,
  "gOutEaseIn": 0,
  "gOutEaseOut": 60,
  "gAnimStyle": "1",
  "gAnimOut": "0",
  "hlMode": "color",
  "karaoke": true
};

// Browser font keys use the shipped preset's first available web font.
// The Bold Font and Komika Axis are not web assets here; Montserrat Black
// and Bangers are the same fallback families listed by the installed panel.
export const PRESETS = {
  "Plain": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false},
  "Bold Impact": {"font":"montserrat-black","textCase":"upper","gStripPunct":true,"gMinWords":1,"gMaxWords":3,"gMaxLines":2,"gFontSize":58,"gPosY":70,"textColor":"#FFFFFF","gStroke":10,"strokeColor":"#000000","gShadow":70,"gShadowDist":8,"gShadowBlur":12,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#F7C204","gHlScale":12,"gHlPop":6,"gAnimStyle":"1","gAnimDur":1,"gPop":18},
  "Beast Comic": {"font":"bangers","textCase":"upper","gStripPunct":true,"gMinWords":1,"gMaxWords":2,"gMaxLines":1,"gFontSize":62,"gPosY":66,"textColor":"#FFFFFF","gStroke":14,"strokeColor":"#000000","gShadow":85,"gShadowDist":10,"gShadowBlur":4,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#39FF14","gHlScale":15,"gHlPop":10,"gAnimStyle":"11","gAnimDur":1,"gPop":25},
  "Karaoke Pill": {"font":"montserrat-xbold","textCase":"upper","gStripPunct":true,"gMinWords":2,"gMaxWords":4,"gMaxLines":2,"gFontSize":52,"gPosY":72,"textColor":"#FFFFFF","gStroke":4,"strokeColor":"#000000","gShadow":50,"gShadowDist":4,"gShadowBlur":8,"shadowColor":"#000000","karaoke":true,"hlMode":"pill","hlColor":"#7C3AED","gPillRadius":16,"gHlScale":6,"gHlPop":4,"gAnimStyle":"1","gAnimDur":1,"gPop":10},
  "Karaoke": {"font":"montserrat-bold","textCase":"none","gStripPunct":true,"gMinWords":3,"gMaxWords":6,"gMaxLines":2,"gFontSize":52,"gPosY":74,"textColor":"#FFFFFF","gStroke":6,"strokeColor":"#000000","gShadow":45,"gShadowDist":4,"gShadowBlur":10,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#00E676","gAnimStyle":"2","gAnimDur":1},
  "Punch": {"font":"anton","textCase":"upper","gStripPunct":true,"gMinWords":1,"gMaxWords":3,"gMaxLines":1,"gFontSize":70,"gPosY":66,"gTracking":1,"textColor":"#FFFFFF","gStroke":6,"strokeColor":"#000000","gShadow":60,"gShadowDist":6,"gShadowBlur":10,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#F7C204","gHlScale":8,"gHlPop":5,"gAnimStyle":"4","gAnimDur":1,"gPop":14},
  "Podcast": {"font":"montserrat-bold","textCase":"sentence","gStripPunct":true,"gMinWords":3,"gMaxWords":6,"gMaxLines":2,"gFontSize":50,"gPosY":72,"textColor":"#FFFFFF","gStroke":5,"strokeColor":"#000000","gShadow":55,"gShadowDist":4,"gShadowBlur":12,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#FFD400","gAnimStyle":"2","gAnimDur":1},
  "Minimal": {"font":"montserrat-medium","textCase":"lower","gStripPunct":true,"gMinWords":2,"gMaxWords":4,"gMaxLines":1,"gFontSize":44,"gPosY":75,"textColor":"#CFCFCF","gStroke":0,"gShadow":45,"gShadowDist":2,"gShadowBlur":14,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#FFFFFF","gHlScale":6,"gAnimStyle":"2","gAnimDur":2,"gAnimOut":"1"},
  "Glow": {"font":"montserrat-xbold","textCase":"upper","gStripPunct":true,"gMinWords":1,"gMaxWords":3,"gMaxLines":1,"gFontSize":54,"gPosY":68,"gTracking":1,"textColor":"#FFFFFF","gStroke":0,"gShadow":80,"gShadowDist":0,"gShadowBlur":30,"shadowColor":"#8EF6FF","karaoke":true,"hlMode":"color","hlColor":"#8EF6FF","gHlScale":8,"gAnimStyle":"9","gAnimDur":3,"gPop":8,"gAnimOut":"1"},
  "Subtitle Box": {"font":"inter","textCase":"sentence","gStripPunct":false,"gMinWords":4,"gMaxWords":10,"gMaxLines":2,"gFontSize":42,"gPosY":80,"textColor":"#FFFFFF","gStroke":0,"gShadow":0,"karaoke":false,"boxColor":"#000000","gBoxOpacity":65,"gAnimStyle":"2","gAnimDur":1,"gAnimOut":"1"},
  "Clean Fade": {"font":"inter","textCase":"sentence","gStripPunct":false,"gMinWords":3,"gMaxWords":6,"gMaxLines":2,"gFontSize":46,"gPosY":74,"textColor":"#FFFFFF","gStroke":0,"gShadow":50,"gShadowDist":3,"gShadowBlur":16,"shadowColor":"#000000","karaoke":false,"gAnimStyle":"14","gAnimDur":2,"gAnimOut":"1"},
  "Gamer": {"font":"luckiest","textCase":"upper","gStripPunct":true,"gMinWords":1,"gMaxWords":2,"gMaxLines":1,"gFontSize":58,"gPosY":58,"gTracking":1,"textColor":"#FFFFFF","gStroke":14,"strokeColor":"#000000","gShadow":90,"gShadowDist":8,"gShadowBlur":0,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#00E5FF","gHlScale":20,"gHlPop":18,"gAnimStyle":"11","gAnimDur":1,"gPop":30,"gAnimOut":"5"},
  "Serif Story": {"font":"dmserif","textCase":"lower","gStripPunct":true,"gMinWords":2,"gMaxWords":5,"gMaxLines":2,"gFontSize":54,"gPosY":66,"textColor":"#FFFFFF","gStroke":0,"gShadow":60,"gShadowDist":0,"gShadowBlur":20,"shadowColor":"#000000","karaoke":true,"hlMode":"color","hlColor":"#F5D76E","gAnimStyle":"3","gAnimDur":3,"gAnimOut":"2"},
  "Clean": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false,"gAnimStyle":"2","gAnimDur":2,"gStroke":0,"gShadow":25,"gShadowBlur":30,"gShadowDist":4,"gTracking":6,"karaoke":false},
  "Typewriter": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false,"gAnimStyle":"7","gAnimDur":3,"gStroke":6,"gTracking":8,"karaoke":false},
  "Spring": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false,"gAnimStyle":"11","gAnimDur":3,"gPop":14,"gShadow":45,"karaoke":false},
  "Rise": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false,"gAnimStyle":"12","gAnimDur":3,"gStroke":0,"gShadow":30,"gShadowBlur":30,"gShadowDist":3,"gSlideTime":4,"gEaseOut":70,"karaoke":true,"hlMode":"color","hlColor":"#FFFFFF","gHlScale":8},
  "Smooth": {"textCase":"upper","gMinWords":3,"gMaxWords":5,"gMaxLines":2,"gStripPunct":false,"gAnimStyle":"13","gAnimDur":3,"gPop":10,"gStroke":0,"gShadow":25,"gShadowBlur":35,"gShadowDist":3,"gTracking":4,"karaoke":false},
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
