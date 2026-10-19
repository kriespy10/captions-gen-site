# News: short update posts, newest first. genblog.py builds news/*.html,
# news/index.html, news/feed.xml and adds them to sitemap.xml.
# Add a post per release at the top of the list; "version" may be "".

NEWS = [
  {
    "slug": "captions-gen-1-0-9",
    "date": "2026-10-18",
    "version": "1.0.9",
    "title": "Captions Gen 1.0.9: cleaner outlines and timing that follows speech",
    "desc": "Outlines no longer cut through neighbouring letters, letter spacing is in real pixels, captions wait for the next word after a pause, and you can report a bug from Settings.",
    "body": """
<p>1.0.9 fixes the two things people noticed most on the timeline: outlines and timing.</p>
<h2>Outlines sit behind the letters</h2>
<p>With a thick outline and tight letters, the black outline of one letter used to cut into the letter before it. You saw it most with Impact. Every caption template now draws all outlines first and all letters on top, the same way Premiere's own text does.</p>
<h2>Letter spacing in pixels</h2>
<p>The Letter spacing slider now goes from 0 to 16 px in steps of 1, and the live preview follows it exactly. Before, one step on the slider was 10 px on the timeline.</p>
<h2>Timing that follows speech</h2>
<p>Word times are snapped to the sound, so pauses stay pauses. Captions and the karaoke highlight now wait for the next word instead of running ahead of it.</p>
<h2>Report a bug or request a feature</h2>
<p>Settings has two new buttons, <strong>Report a bug</strong> and <strong>Request a feature</strong>. Your message comes straight to me, with the version numbers and the engine log attached for bug reports. Help &amp; FAQ now opens captionsgen.com.</p>
""",
  },
  {
    "slug": "captions-gen-1-0-8",
    "date": "2026-10-07",
    "version": "1.0.8",
    "title": "Captions Gen 1.0.7 and 1.0.8: start the engine from the panel",
    "desc": "When the caption engine isn't running, the panel now has a Start engine button, so you no longer need the Start menu.",
    "body": """
<p>Captions Gen runs a small engine on your computer for transcription and previews. It starts with Windows, but Windows can switch that off (Task Manager › Startup apps). When that happened, the panel said <em>Caption engine is offline</em> and the only way back was the Start menu.</p>
<p>The offline card now has a <strong>Start engine</strong> button. Press it, allow it if Premiere asks, and the panel picks the engine up within a few seconds.</p>
<p>1.0.8 is the same change. It was republished with a new version number because Creative Cloud skips installing a panel whose version hasn't changed.</p>
""",
  },
  {
    "slug": "captions-gen-1-0-6",
    "date": "2026-09-05",
    "version": "1.0.6",
    "title": "Captions Gen 1.0.6: works in Premiere Pro in any language",
    "desc": "Fixes empty caption boxes in non-English Premiere Pro, makes Text case work on the timeline, and stops free minutes being counted twice for the same clip.",
    "body": """
<p>A customer running Premiere Pro in Spanish sent a report that led to three fixes.</p>
<h2>Captions in non-English Premiere Pro</h2>
<p>In a translated Adobe install every caption showed up as an empty box. The caption templates looked up their settings by English name, and After Effects translates those names. They now look settings up by position, which works in every language.</p>
<h2>Text case on the timeline</h2>
<p>The ABC / abc / Abc control changed the preview but not the captions in Premiere, because the templates had All Caps switched on. That's off now, so the case you pick is the case you get.</p>
<h2>Free minutes counted once per clip</h2>
<p>In the free version, the same clip could use up free minutes again after clearing the cache or switching the model. Each clip range is now counted once.</p>
""",
  },
  {
    "slug": "captions-gen-launch",
    "date": "2026-08-26",
    "version": "1.0.5",
    "title": "Captions Gen is out: animated captions inside Premiere Pro",
    "desc": "Captions Gen launches: local transcription, word-by-word karaoke captions as editable Motion Graphics, animation presets, and in-app updates.",
    "body": """
<p>Captions Gen is a Premiere Pro plugin for Windows that turns speech into animated, word-synced captions on your timeline.</p>
<h2>What it does</h2>
<ul>
<li><strong>Transcribes on your computer</strong> with Whisper. No upload, no account, no monthly minutes.</li>
<li><strong>Places editable Motion Graphics</strong> on the track above your clip, one per caption, timed to the words.</li>
<li><strong>Karaoke highlights</strong>: colour swap, pop or a pill behind the active word.</li>
<li><strong>Presets and a live preview</strong>: Beast, Hormozi, Clean, Neon, Bubble and more, or build your own look and save it.</li>
<li><strong>Restyle</strong> swaps the look of captions you already placed, and <strong>Undo</strong> removes them.</li>
</ul>
<h2>Fixed before launch</h2>
<p>The first week of testing brought a run of fixes: Out animations now play, captions stay inside the frame on 16:9, the background box grows with multi-line captions, and a new <strong>Box bounces with the highlight</strong> option is there for the bouncy look.</p>
<h2>Updates are built in</h2>
<p>When a new version is out, the panel shows an <strong>Update</strong> button. It downloads a small patch, checks it and installs it. Restart Premiere Pro afterwards to load the new panel.</p>
""",
  },
]
