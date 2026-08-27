# -*- coding: utf-8 -*-
# Humanized bodies for the four captionsgen.com guides. Imported by genblog.py.
POSTS = {}

POSTS["how-to-add-captions-in-premiere-pro"] = dict(
title="How to Add Captions in Premiere Pro (2026 Guide)",
desc="Add captions and subtitles in Premiere Pro step by step: transcribe, create captions, style them, and export. Plus when closed captions make sense.",
h1="How to add captions in Premiere Pro",
body="""
<p>Premiere Pro has had captions built in since 2021, and for a plain subtitle track it works well. You don't need a plugin or a template pack, and you don't need to leave the app. This is the whole workflow, including the styling limit you'll hit and what to do about it.</p>

<h2>Step 1: transcribe your sequence</h2>
<p>Open <kbd>Window &gt; Text</kbd>, switch to the Transcript tab, and click Transcribe sequence. Premiere's speech to text runs on your machine and usually finishes in less time than the clip is long. Pick the spoken language or leave it on auto detect. If your dialogue sits on its own audio track, point the transcription at that track; it saves cleanup later.</p>

<h2>Step 2: create captions from the transcript</h2>
<p>In the same panel, click Create captions. Three settings in that dialog matter. Format should be Subtitle for normal on-screen captions (closed captions are covered below). Max characters per line defaults to 42, which reads like TV subtitles; for the short-form look with 3 to 5 words per caption, drop it to somewhere between 16 and 20. Lines can be single or double, and short-form is almost always single.</p>
<p>Premiere then adds a caption track above your video with every caption timed to the transcript. If it misheard a word, double-click the caption text and fix it. The timing stays where it was.</p>

<h2>Step 3: style the track</h2>
<p>Select a caption and open <kbd>Window &gt; Essential Graphics</kbd>. Set the font, size, color, outline and background box once, then save the result as a Track Style so every caption on the track follows it.</p>
<p>This is also where native captions stop: one style for the whole track. There is no per-word color, no pop-in, and no karaoke highlight. Every caption looks the same as the one before it.</p>

<h2>Step 4: export</h2>
<p>In the export dialog, open the Captions tab. Burn captions into video turns the text into pixels, which is what you want for Instagram, TikTok and YouTube Shorts. Create sidecar file writes a separate .srt instead, which is what you want for YouTube's own caption system or a client hand-off.</p>

<h2>What about closed captions?</h2>
<p>If a broadcaster or platform asked you for closed captions (CEA-608 or 708), choose that format instead of Subtitle in step 2. Closed captions travel in a data stream the viewer can switch on and off, and their styling is restricted on purpose, so don't fight it. For social video, burned-in subtitles are the norm.</p>

<div class="box">
<p class="t">Want captions that move?</p>
<p>Native captions are one static style. If you want each word to light up as it's spoken, that is what <a href="https://captionsgen.com/">Captions Gen</a> does: it transcribes locally and places animated karaoke captions on your timeline as editable graphics. <a href="__FREE__">Try it free</a> with 15 minutes of transcription included.</p>
</div>

<h2>The short version</h2>
<p>Transcribe sequence, Create captions, set 16 to 20 characters per line for short-form, style the track once, burn in on export. It takes about ten minutes the first time and a couple of minutes once you've done it twice.</p>
""")

POSTS["auto-captions-premiere-pro"] = dict(
title="Auto Captions in Premiere Pro: Fastest Setup (2026)",
desc="Turn on auto captions in Premiere Pro with the built-in speech to text, improve accuracy, and learn when a caption plugin is worth it. Nothing uploads to the cloud.",
h1="Auto captions in Premiere Pro, the fast way",
body="""
<p>You don't have to type captions in Premiere Pro, and you haven't had to for years. Automatic transcription ships with the app, runs offline, and costs nothing. What trips people up is the difference between a transcript and captions, and what the automatic route can't do to the look. The whole thing takes four steps.</p>

<h2>The four-step auto caption workflow</h2>
<ol>
<li>Transcribe. Open <kbd>Window &gt; Text</kbd>, go to the Transcript tab, click Transcribe sequence. The language auto detects, and the audio never leaves your machine.</li>
<li>Generate captions. Click Create captions with the format set to Subtitle. Use 16 to 20 characters per line for the short-form look, or 32 to 42 for documentary-style lines.</li>
<li>Proofread. Skim the caption track and fix names, brands and numbers, which are the usual speech-to-text casualties. Double-click a caption to change the text without touching its timing.</li>
<li>Style and export. Set one Track Style in Essential Graphics, then burn the captions in from the export dialog's Captions tab.</li>
</ol>

<h2>Getting more accurate auto captions</h2>
<p>Two things change accuracy more than anything else. Transcribe from the cleanest dialogue track you have rather than the full mix with music, and pick the language yourself when you know it. Audio quality matters too: a noisy phone recording transcribes like a noisy phone recording. Expect to fix a handful of words per minute of speech, mostly proper nouns.</p>

<h2>Where the built-in auto captions stop</h2>
<p>Premiere's automatic captions know when a sentence is spoken, but the native caption track can't use word-level timing. You can't highlight the current word or animate words one by one, and the track has a single static style. That isn't a setting you've missed; the caption system doesn't support it.</p>
<p>If you want that look, you can convert the captions to graphics and keyframe them by hand, which is fine for one clip and painful for thirty, or use a plugin that transcribes with word timestamps and builds the animation for you.</p>

<div class="box">
<p class="t">Auto captions with word-by-word animation</p>
<p><a href="https://captionsgen.com/">Captions Gen</a> is a Premiere Pro plugin that transcribes locally, like Premiere does, and places karaoke-style animated captions as editable graphics. Pick a preset, press Generate, and restyle whenever you like without transcribing again. The <a href="__FREE__">free version</a> includes 15 minutes of transcription.</p>
</div>

<h2>Which route to take</h2>
<p>For static subtitles, Premiere's own auto captions are enough and they're four clicks away. For animated captions you need word timing, and that comes from a plugin, not from a hidden setting.</p>
""")

POSTS["animated-captions-premiere-pro"] = dict(
title="Animated Captions in Premiere Pro: 3 Ways Compared",
desc="Get CapCut-style animated captions in Premiere Pro three ways: manual keyframing, the CapCut round trip, or a caption plugin. What each one costs you in time.",
h1="Animated captions in Premiere Pro: the three real options",
body="""
<p>The word-by-word caption look, where each word pops or lights up as it's spoken, is everywhere in short-form video right now, and Premiere Pro can't do it on its own. The caption track has one static style and that's the end of it. Editors still get the look in Premiere every day, using one of three routes, and each has a real cost.</p>

<h2>Option 1: keyframe it by hand</h2>
<p>Create captions the normal way, then right-click a caption and choose Upgrade caption to graphic. It becomes a Motion Graphics layer you can keyframe: scale pops, per-word color through text styling, position bounces. You get total control and it costs nothing.</p>
<p>What it costs is time. A 30-second clip has maybe 60 to 80 words, and animating a highlight across them by hand takes an afternoon. Multiply that by a month of content. This route suits the occasional hero clip, not a weekly workflow.</p>

<h2>Option 2: the CapCut round trip</h2>
<p>Export your edit, run it through CapCut for auto captions, export from CapCut, and bring the file back into Premiere. It works, which is why so many editors do it, but you pay in several places. Every revision means another export and import cycle. You either accept a generation loss or manage large intermediate files. The captions are burned in, so they can't be edited once anything changes. And your caption text lives outside your project, so changing one word means doing the loop again.</p>

<h2>Option 3: a caption plugin inside Premiere</h2>
<p>Plugins transcribe with word-level timestamps and place animated captions straight onto your timeline. There's no round trip and the captions stay editable. Several exist at different prices. Whichever you pick, check that it gives you captions as native Premiere graphics, so you can still fix a word or nudge timing, rather than as rendered files.</p>

<div class="box">
<p class="t">Where Captions Gen fits</p>
<p><a href="https://captionsgen.com/">Captions Gen</a> ($14.99, one-time) transcribes on your machine and places karaoke captions as editable Motion Graphics. It has a color-swap or pill highlight, bounce, in and out animations, presets, and a Restyle button that changes the look of the whole sequence in seconds without transcribing again. <a href="__FREE__">Try the free version</a>: same plugin, 15 minutes of transcription included.</p>
</div>

<h2>Which one should you pick?</h2>
<p>If you animate one special clip a month, keyframe it by hand. If you're tied to CapCut's specific templates, do the round trip and plan for revisions. If you publish short-form video from Premiere regularly, a plugin pays for itself in the first week. In every case, you no longer have to leave Premiere to get animated captions.</p>
""")

POSTS["premiere-pro-captions-not-showing"] = dict(
title="Premiere Pro Captions Not Showing? 6 Fixes That Work",
desc="Captions not showing in Premiere Pro? Check the CC toggle, caption track visibility, the export burn-in setting and three more causes. Most fixes take seconds.",
h1="Premiere Pro captions not showing: six fixes",
body="""
<p>The captions exist on the timeline but the Program Monitor shows nothing. Or they show while you edit and are gone from the export. In both cases the cause is almost always a single hidden toggle. Work down this list; most people are done at fix 1 or 2.</p>

<h2>1. The CC toggle in the Program Monitor</h2>
<p>The Program Monitor has its own caption display switch: the CC button under the preview (it lives in the wrench menu on older versions). When it's off, captions never render in the preview, whatever the timeline says. Click it, choose your caption track, and you're done. This is the most common cause by a wide margin.</p>

<h2>2. Caption track visibility</h2>
<p>Caption tracks have an output toggle like video tracks, in the track header on the left of the timeline. If it got bumped off, everything disappears. Also check that the track isn't collapsed so far that you can't see the caption blocks.</p>

<h2>3. You have a transcript, not captions</h2>
<p>Text in the Transcript tab of the Text panel does not mean captions exist. Transcript and captions are separate things. If the Captions tab is empty and there's no caption track on the timeline, you still need to click Create captions.</p>

<h2>4. Captions missing from the export</h2>
<p>If the preview is fine and the export is blank, open the Captions tab in the export dialog. If it says None, nothing goes out. Choose Burn captions into video for social, where the text becomes part of the image, or Create sidecar file for a separate .srt. This tab resets between exports more often than you'd expect.</p>

<h2>5. Closed captions on a player that hides them</h2>
<p>If the track format is CEA-608 or 708 closed captions, the text only shows when the player's CC feature is on. That is the format working as designed. For captions that are always visible on social, use the Subtitle format and burn them in.</p>

<h2>6. Overlapping or zero-length captions</h2>
<p>Imported .srt files sometimes carry overlapping timecodes or entries with no duration, and those render as flicker or as nothing at all. Scrub the caption track for suspiciously thin blocks, then retime or delete them.</p>

<div class="box">
<p class="t">While you're in the caption settings</p>
<p>If you ended up here because you wanted a better look than the static native track, <a href="https://captionsgen.com/">Captions Gen</a> places animated word-by-word captions as normal graphics. They don't depend on CC toggles or caption formats, so they show up in every preview and every export. <a href="__FREE__">The free version is here</a>.</p>
</div>

<h2>Still nothing?</h2>
<p>Restart Premiere with the caption track visible and CC switched on; the Program Monitor sometimes needs the nudge after toggling. And if captions show in the preview but not in your upload, go back to fix 4. Nine times out of ten the export tab had quietly reset to None.</p>
""")
