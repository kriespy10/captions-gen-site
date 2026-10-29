# News: short update posts, newest first. genblog.py builds news/*.html,
# news/index.html, news/feed.xml and adds them to sitemap.xml.
# Add a post per release at the top of the list; "version" may be "".

NEWS = [
  {
    "slug": "captions-gen-1-1-2",
    "date": "2026-10-29",
    "version": "1.1.2",
    "title": "Captions Gen 1.1.2: animate edited words, with cleaner controls",
    "desc": "Update word animation after editing caption text in Premiere, including added words. Plus a quieter panel and fixes for caption grouping, placement and installation.",
    "body": """
<p>Edited a caption after generating it? Captions Gen 1.1.2 can update its word animation to include the revised text and newly added words.</p>
<h2>Update animation after editing text</h2>
<p>Select an edited Captions Gen graphic on the timeline. When the panel detects the change, <strong>Caption text changed</strong> appears with <strong>Update animation</strong>. Click it to retime the selected edited graphics. Unchanged captions in the selection keep their existing timing, and the notice disappears after the update.</p>
<p>On Premiere Pro 26, the installer includes a signed local text reader, so the panel can read your current edits without copying or pasting text. Restart Premiere after installing the update. The CCX panel file alone does not include that reader.</p>
<p>Each graphic supports up to <strong>eight animated words</strong>. New timings are estimates: play the result against the audio and adjust if needed. This works with Captions Gen graphics, not Premiere's native subtitle tracks or arbitrary titles. An older same-count edit made before the panel first observes a caption cannot always be detected; subsequent edits in that session are detected.</p>
<h2>Fewer controls in the footer</h2>
<p><strong>Generate Captions</strong> stays the main action. <strong>Save preset…</strong> now sits beside the preset name, with options to save a new preset, update your own edited preset or revert changes. Saving a preset is optional: your design changes already apply to the next generation.</p>
<p><strong>Apply style</strong> appears near the preview when the current design differs from the last generated captions. Their ⋯ menu contains <strong>Remove generated captions</strong>. This is separate from Premiere's <strong>Edit &gt; Undo</strong>, which can undo an animation update.</p>
<h2>Grouping, placement and installation fixes</h2>
<p>This update also includes fixes for caption grouping and placement, including missing graphics reported on Spanish Premiere, and verifies that Adobe installed the actual new panel files. Local generation tests passed in English and Spanish Premiere. If replacing an earlier test build needs Windows administrator approval, the installer asks for Adobe removal and installation and preserves this panel's settings around the replacement.</p>
<p>Requires Windows 10/11 and Premiere Pro 25.6 or newer. Install the update, restart Premiere, then try an edit on a short caption.</p>
<p><strong>Windows 11 installation note:</strong> Smart App Control may still block the currently unsigned Windows installers on some PCs. Windows code-signing verification is in progress; 1.1.2 does not resolve that installation restriction. Please contact us if Windows blocks installation.</p>
""",
  },
  {
    "slug": "captions-gen-1-1-0",
    "date": "2026-10-21",
    "version": "1.1.0",
    "title": "Captions Gen 1.1: now free, with 18 new caption looks",
    "desc": "The 15-minute limit is gone: Captions Gen is now free. Plus 18 presets with the looks creators use, free fonts, instant previews and a simpler panel.",
    "body": """
<p>Captions Gen is free now. The 15-minute limit is gone, with no watermark and no subscription.</p>
<h2>Free, with no time limit</h2>
<p>Transcription, word-by-word karaoke captions, the built-in presets and the live preview are free to use, with no time limit, no watermark and no subscription. If you bought a license, it stays active. Thank you for the early support. To hear about new features, use <strong>Get updates by email</strong> in Settings.</p>
<h2>18 presets with the looks creators use</h2>
<p>New presets: Bold Impact, Beast Comic, Karaoke Pill, Karaoke, Punch, Gamer, Glow, Podcast, Minimal, Subtitle Box, Clean Fade and Serif Story, next to the classics Clean, Typewriter, Spring, Rise and Smooth. Each preset sets the font, case and how many words show at once. The installer adds the free fonts they use: Montserrat, Anton, Bangers, Luckiest Guy, Inter and DM Serif Display.</p>
<p><img src="https://captionsgen.com/img/styles/Bold-Impact.png" alt="Bold Impact caption preset" loading="lazy" style="max-width:100%;border-radius:12px"></p>
<h2>A simpler panel</h2>
<p>The panel now has three tabs. <strong>Presets</strong> is where you pick a look, <strong>Customize</strong> is where you change it, and Generate stays at the bottom of both. Edits apply right away; <strong>Update preset</strong> or <strong>Save as new</strong> keeps them. Star a preset as your main one and the panel opens on it every time. A preset's ⋯ menu can duplicate it or export it as a file to share, and <strong>Import</strong> adds one. Restyle is now called <strong>Apply style to placed captions</strong>.</p>
<h2>Instant previews</h2>
<p>Preset previews are saved on your computer and prepared in the background, so tapping a preset shows it right away instead of after several seconds.</p>
<h2>A short intro for new users</h2>
<p>New installs open with a four-step walkthrough of the basics. You can watch it again from Settings › Show the intro again.</p>
<h2>Optional usage stats</h2>
<p>The panel asks once whether you want to share anonymous usage stats to help me improve it. No means no: it stops sending anything. The <a href="https://captionsgen.com/privacy.html">privacy page</a> lists exactly what is sent.</p>
""",
  },
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
