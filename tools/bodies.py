# -*- coding: utf-8 -*-
# Core captionsgen.com guides. Imported by genblog.py.
POSTS = {}

POSTS["how-to-add-captions-in-premiere-pro"] = dict(
title="How to Add Captions in Premiere Pro: Create, Style, Export",
desc="Add captions in Premiere Pro using Speech to Text. Follow the transcript, caption track, Properties styling, and burn-in or SRT export steps in this guide.",
h1="How to add captions in Premiere Pro, step by step",
modified="2026-10-20",
body="""
<p>To add captions in Premiere Pro, <strong>transcribe your sequence, create captions from the transcript, style the caption track, and choose how to export it</strong>. Premiere includes Speech to Text; you do not need a separate plugin for standard subtitles.</p>
<p class="cta-line">Premiere's own captions are static: one style per track and no highlight on the spoken word. For animated, word-by-word captions in the same timeline, <a href="https://captionsgen.com/">Captions Gen</a> is a Premiere Pro plugin that generates them in one click. It transcribes on your computer and places editable Motion Graphics captions on the timeline. Free for Windows, with no time limit or watermark.</p>
<p>This guide uses the current Text and Properties panels. Older Premiere tutorials may show Essential Graphics for styling.</p>

<h2 id="transcribe">1. Transcribe the sequence</h2>
<p>Open your edited sequence and choose <kbd>Window &gt; Text</kbd>. In the Transcript tab, transcribe the sequence if a transcript has not already been created during import. Choose the spoken language and the dialogue audio you want to transcribe. A language pack may need to download before local transcription can run.</p>
<p>Review names, numbers, and technical terms in the transcript before generating captions. If transcription fails or the transcript is empty, use the <a href="premiere-pro-speech-to-text-not-working.html">Speech to Text troubleshooting guide</a>.</p>

<h2 id="create">2. Create captions from the transcript</h2>
<p>In the Text panel's Captions tab, select <strong>Create captions from transcript</strong>. Use the Subtitle format for ordinary on-screen subtitles, or the format specified by your delivery brief for broadcast closed captions.</p>
<p>Set the line length, duration, gap, and number of lines for the video you are making. Short lines can help a vertical video, but check the result at the intended viewing size rather than forcing every sentence into the same number of characters.</p>
<p>Create the captions. Premiere adds timed caption clips to a track above the video. Check that the track's eye icon is enabled, then play the sequence to review the text and timing. See <a href="premiere-pro-captions-not-showing.html">what to check when captions are not showing</a> if the preview is blank.</p>

<h2 id="style">3. Style the captions in Properties</h2>
<p>Select a caption clip and open <kbd>Window &gt; Properties</kbd>. Set its font, size, fill, stroke, background, and position as needed. Keep enough contrast for the footage behind it, and check the frame edges on the final aspect ratio.</p>
<p>Save a reusable Track Style to apply a consistent look across the track. A style helps you avoid correcting the same appearance on every caption. The <a href="change-caption-font-premiere-pro.html">caption font and Track Style guide</a> covers this in more detail.</p>

<h2 id="review">4. Review timing and line breaks</h2>
<p>Play the captioned section with sound. Correct spelling in the Captions tab and adjust clip boundaries where a caption appears too early or disappears before the phrase finishes. Keep a readable phrase together when possible.</p>
<p>For an existing subtitle file, import the SRT and add it to the timeline instead of transcribing again. Follow the <a href="import-srt-premiere-pro.html">SRT import workflow</a> for that route.</p>

<h2 id="export">5. Export visible captions or an SRT file</h2>
<p>In Export mode, expand <strong>Captions</strong> and choose an export option:</p>
<ul>
<li><strong>Burn Captions Into Video</strong> makes captions permanently visible in the picture.</li>
<li><strong>Create Sidecar File</strong> produces a separate caption file for upload or hand-off. Select SRT when that format is available and appropriate.</li>
<li><strong>Embed In Output File</strong> produces a selectable stream in supported formats.</li>
<li><strong>None</strong> omits captions.</li>
</ul>
<p>Export a short sample and check it in the intended player before rendering the entire project. For visible social-video subtitles, see the <a href="burn-in-captions-premiere-pro.html">burn-in export guide</a>.</p>

<h2>Can Premiere make word-by-word captions?</h2>
<p>Current versions include a <strong>Single Word</strong> layout in Captioning Preferences. For a moving highlight across a multi-word line or animated graphics, compare the approaches in the <a href="animated-captions-premiere-pro.html">animated caption guide</a>.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption creation instructions</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">Properties and Track Styles</a>, and <a href="https://helpx.adobe.com/ca/premiere/desktop/render-and-export/export-files/overview-of-export-settings.html">export settings</a>.</p>
""")

POSTS["auto-captions-premiere-pro"] = dict(
title="Premiere Pro Auto Captions: Generate, Style & Export",
desc="Generate auto captions in Premiere Pro with Speech to Text. Choose the dialogue track, create subtitles, fix mistakes, style the text, and export your video.",
h1="Auto captions in Premiere Pro with Speech to Text",
modified="2026-10-20",
body="""
<p>Premiere Pro makes auto captions in two stages: <strong>Speech to Text creates a transcript, then Create captions turns that transcript into timed subtitles</strong>. Automatic transcription is included with Premiere. Creating the transcript does not place visible text on the video by itself.</p>
<p class="cta-line">Premiere's auto captions come out as plain subtitles. For auto captions that highlight and animate each spoken word, <a href="https://captionsgen.com/">Captions Gen</a> is a Premiere Pro plugin that does it in one click. It transcribes on your computer and places editable Motion Graphics captions on the timeline. Free for Windows, with no time limit or watermark.</p>

<h2 id="generate">Generate auto captions in four steps</h2>
<ol>
<li><strong>Transcribe the sequence.</strong> Open <kbd>Window &gt; Text</kbd>, go to Transcript, and transcribe if no transcript exists yet. Choose the spoken language and the dialogue audio. Download the language pack if Premiere asks for it.</li>
<li><strong>Create the caption track.</strong> Go to Captions and select <strong>Create captions from transcript</strong>. Pick Subtitle for ordinary subtitles, set the line length and timing preferences, and create the captions.</li>
<li><strong>Proofread and style.</strong> Check names, numbers, and punctuation. Select a caption clip and use <kbd>Window &gt; Properties</kbd> to style it; save a Track Style for a consistent appearance.</li>
<li><strong>Choose the export.</strong> In Export &gt; Captions, burn the text into the video or create a separate caption file. Leaving the option on None produces video without the caption track.</li>
</ol>
<p>For a slower walkthrough with styling and delivery choices, follow <a href="how-to-add-captions-in-premiere-pro.html">how to add captions in Premiere Pro</a>.</p>

<h2 id="accuracy">Improve automatic caption accuracy</h2>
<p>Use the cleanest dialogue available. If your project separates speech from music, select the dialogue source instead of relying on a busy mix. Choose the correct spoken language, then review words the model may not recognize, such as people's names and product names.</p>
<p>Fixing the transcript before creating captions reduces repeated corrections. Still play through the generated caption track: accurate words can have awkward line breaks or timing after an edit. See <a href="fix-caption-timing-premiere-pro.html">how to adjust caption timing</a>.</p>

<h2 id="troubleshoot">Why did auto captions produce no visible text?</h2>
<ul>
<li><strong>The transcript exists but no caption clips appear:</strong> create captions from the transcript.</li>
<li><strong>The caption clips exist but the preview is blank:</strong> enable the caption track's eye icon and check the playhead position.</li>
<li><strong>The preview works but the export is blank:</strong> check Export &gt; Captions instead of transcribing again.</li>
<li><strong>Transcription is unavailable or fails:</strong> check the selected audio, language pack, and <a href="premiere-pro-speech-to-text-not-working.html">Speech to Text troubleshooting steps</a>.</li>
</ul>
<p>The <a href="premiere-pro-captions-not-showing.html">missing-caption checklist</a> separates preview problems from export problems.</p>

<h2 id="single-word">Auto captions one word at a time</h2>
<p>In current versions, expand Captioning Preferences in the Create Captions dialog and select <strong>Layout &gt; Single Word</strong>. If your version lacks that option, check its available layouts. The <a href="word-by-word-captions-premiere-pro.html">word-by-word caption guide</a> explains the difference between showing one word and highlighting it within a line.</p>

<h2 id="graphics">When an animated caption plugin helps</h2>
<p>Native captions are a useful choice for subtitles and sidecar files. If you want karaoke highlights, pill backgrounds, bounce animations, and editable graphics from a repeatable preset, consider <a href="https://captionsgen.com/#styles">Captions Gen's animated caption styles</a>. It transcribes locally with Whisper and builds graphics on the Premiere timeline.</p>
<p>Keep a native caption track as well when your delivery needs an SRT file. Graphics are part of the picture, not a substitute for a selectable caption file. Compare the <a href="animated-captions-premiere-pro.html">native and graphics workflows</a> before choosing.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption workflow</a> and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word layout</a>.</p>
""")

POSTS["animated-captions-premiere-pro"] = dict(
title="Animated Captions in Premiere Pro: Native, Graphics, Plugin",
desc="Compare native single-word captions, manually animated graphics, and Captions Gen for Premiere Pro. Choose a workflow for subtitles or karaoke highlights.",
h1="Animated captions in Premiere Pro: choose your workflow",
modified="2026-10-20",
body="""
<p>To make animated captions in Premiere Pro, start with the look you need: <strong>one word appearing at a time, manually animated text, or a moving highlight within a multi-word line</strong>. These use different workflows. Current Premiere versions include native single-word captions; graphics give you more control over motion and highlighting.</p>

<h2 id="native">1. Native single-word captions</h2>
<p>Transcribe the sequence, create captions from the transcript, and select <strong>Layout &gt; Single Word</strong> in Captioning Preferences. Premiere creates timed one-word caption clips. Style them in Properties and choose the caption export format you need.</p>
<p>This route suits a simple one-word-at-a-time look and keeps the text on a native caption track. For the setup, follow the <a href="word-by-word-captions-premiere-pro.html">word-by-word captions workflow</a>.</p>

<h2 id="manual">2. Animate caption graphics by hand</h2>
<p>Create ordinary captions first, then use <strong>Upgrade Caption to Graphic</strong> for the clips you want to animate. Once the text is a graphic, use its text appearance and keyframes to build the motion you need.</p>
<p>A moving highlight across several words takes additional timing work. One method is to split the graphic at each spoken word and change that word's appearance in each segment. It gives you control, but corrections and longer edits mean more clips to maintain. See <a href="highlight-words-in-captions-premiere-pro.html">how to highlight spoken words</a>.</p>
<p>Graphics render as part of the video. Keep the original caption track if you also need a sidecar file or closed-caption delivery.</p>

<h2 id="plugin">3. Generate animated graphics with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> transcribes on your machine with Whisper and places word-synced graphics on the Premiere timeline. Its presets combine karaoke highlights, color swaps or pill backgrounds, bounce, and in/out animations. You can edit the placed graphics or use Restyle to change their appearance without transcribing again.</p>
<figure class="caption-example"><img src="/img/styles/Beast.png" width="1280" height="480" loading="lazy" alt="Captions Gen preview reading Use Your Shield, with Shield highlighted in yellow"><figcaption>A Captions Gen graphic with the spoken word highlighted. This is a plugin preview, not Premiere's native caption track.</figcaption></figure>
<p>The plugin runs on Windows 10/11 with Premiere Pro 25.0 or newer. It's free, with no time limit or watermark.</p>

<h2>Which workflow fits your edit?</h2>
<ul>
<li><strong>Readable subtitles or a separate caption file:</strong> start with Premiere's native captions.</li>
<li><strong>One word at a time:</strong> try the native Single Word layout before adding another tool.</li>
<li><strong>A few custom animated titles:</strong> manual graphics can give you the control you need.</li>
<li><strong>Repeatable karaoke highlights and animation presets:</strong> test Captions Gen on a representative clip.</li>
</ul>
<p>If your existing workflow goes through another editor, the <a href="capcut-vs-premiere-pro-captions.html">CapCut and Premiere caption comparison</a> covers the export-and-import tradeoff. If captions are missing rather than needing animation, start with the <a href="premiere-pro-captions-not-showing.html">visibility and export checks</a>.</p>
<p class="sources">Reference: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">native Single Word caption workflow</a>.</p>
""")

POSTS["premiere-pro-captions-not-showing"] = dict(
title="Premiere Pro Captions Not Showing? 6 Fixes (Preview & Export)",
desc="Captions not showing in Premiere Pro, or missing after export? Turn on the caption track, create captions from the transcript, and tick Burn Captions Into Video. 6 quick fixes.",
h1="Premiere Pro captions not showing: preview and export fixes",
modified="2026-10-19",
body="""
<p>If captions are not showing in Premiere Pro, first enable the <strong>eye icon on the caption track</strong> and move the playhead over a caption clip. If they show in the Program Monitor but disappear from the exported video, set <strong>Captions &gt; Export Options &gt; Burn Captions Into Video</strong>. A transcript alone does not create visible captions.</p>
<div class="box quick-answer">
<p class="t">Start with the symptom you see</p>
<ul>
<li><a href="#create-track">No caption clips on the timeline</a>: create captions from the transcript.</li>
<li><a href="#track-visibility">Caption clips exist, but the preview is blank</a>: check track visibility, timing, and text appearance.</li>
<li><a href="#export-captions">The preview works, but the exported video has no text</a>: check the export option and the player.</li>
</ul>
</div>
<p>These steps use the current Premiere interface. Older tutorials may show Essential Graphics or a Program Monitor CC menu; use the caption track controls and Properties panel in current versions.</p>

<h2 id="track-visibility">1. Enable the caption track's eye icon</h2>
<p>Find the caption track above the video tracks in the Timeline. Turn on its eye icon, then park the playhead inside one of its caption clips. If you have several caption tracks, enable the one you want to preview. Expand the track header if the control is hard to see.</p>
<p>Also confirm that you are looking at the <strong>Program Monitor for the same sequence</strong>, rather than a source clip. Scrub through a few caption clips to see whether the problem affects the whole track or only one caption.</p>

<h2 id="create-track">2. Create captions from the transcript</h2>
<p>Open <kbd>Window &gt; Text</kbd>. Words in the Transcript tab are transcription data, not a visible caption track. In the Captions tab, choose <strong>Create captions from transcript</strong>, select the appropriate format, and create the captions. For ordinary subtitles, the Subtitle format is a useful starting point.</p>
<p>If there is no transcript yet, transcribe the sequence first. Follow the <a href="how-to-add-captions-in-premiere-pro.html">complete Premiere Pro caption workflow</a> if you need the setup steps.</p>

<h2 id="appearance">3. Check the caption's timing and appearance</h2>
<p>Select an affected caption clip and open <kbd>Window &gt; Properties</kbd>. Check the font size, fill color, background, and position: text can be present but hard to see against the footage or positioned outside the frame. Try a readable white fill with a dark background before restoring your preferred style.</p>
<p>A caption only appears during its clip's duration. Check the in and out points, especially after importing an SRT file or moving the sequence. Use the <a href="fix-caption-timing-premiere-pro.html">caption timing guide</a> for offsets, or the <a href="change-caption-font-premiere-pro.html">caption font guide</a> for styling.</p>

<h2 id="export-captions">4. Choose how captions should leave Premiere</h2>
<p>Open Export mode and expand <strong>Captions</strong>. The available options depend on the track type and export format:</p>
<ul>
<li><strong>None</strong> exports the video without captions.</li>
<li><strong>Burn Captions Into Video</strong> makes text part of the picture. Use this when you want it visible in the video itself.</li>
<li><strong>Create Sidecar File</strong> saves a separate caption file, such as SRT. The video does not display that text until a platform or player loads the file.</li>
<li><strong>Embed In Output File</strong>, where supported, stores a selectable caption stream. The player must support and enable it.</li>
</ul>
<p>If the Captions section is disabled, check whether the source sequence actually contains a caption track. See <a href="premiere-pro-captions-not-exporting.html">captions missing after export</a> for the delivery checks.</p>

<h2 id="player">5. Check the file you are playing</h2>
<p>For a sidecar export, upload or load the caption file alongside the video. For embedded closed captions, enable captions in a compatible player. Opening only the MP4 does not load a separate SRT automatically in every player.</p>
<p>To isolate the problem, export a short section with captions burned in. If that file displays the text, return to the sidecar or embedded delivery settings rather than changing the caption wording.</p>

<h2 id="graphics">What if the text is a graphic rather than a caption?</h2>
<p>Text made with the Type tool, upgraded captions, and Captions Gen output lives on video tracks as graphics. Check the video track's output, the graphic clip's duration and appearance, and any layers covering it. The caption export options do not turn those graphics on or off.</p>

<h2>Still missing?</h2>
<p>Test a new short sequence with one fresh Subtitle caption and default styling. If that works, compare its track, timing, and export settings with the affected sequence. Save a copy of the project before resetting settings or rebuilding a track.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/translate-captions.html">caption track visibility controls</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption creation workflow</a>, and <a href="https://helpx.adobe.com/ca/premiere/desktop/render-and-export/export-files/overview-of-export-settings.html">caption export options</a>.</p>
""")
