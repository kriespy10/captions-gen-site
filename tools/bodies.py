# -*- coding: utf-8 -*-
# Core captionsgen.com guides. Imported by genblog.py.
POSTS = {}

POSTS['how-to-add-captions-in-premiere-pro'] = dict(
title='How to Add Captions in Premiere Pro: Create, Style, Export',
desc='Create native captions in Premiere Pro: transcribe the sequence, style a caption track, fix timing, then export burned-in text, SRT or supported embedded captions.',
h1='How to add captions in Premiere Pro, step by step',
modified='2026-11-09',
body="""
<p>To add captions in Premiere Pro, <strong>transcribe your sequence, create captions from the transcript, style the caption track, and choose how to export it</strong>. Premiere includes Speech to Text; you do not need a separate plugin for standard subtitles.</p>
<p class="cta-line">For a moving highlight across a line of text, <a href="animated-captions-premiere-pro.html">compare native captions and animated graphics</a>. Captions Gen transcribes locally on the CPU and places editable Motion Graphics clips in Premiere Pro 25.6 or newer on supported 64-bit Windows. It's currently free, with no time limit or watermark. The download requires an email address, with no payment card; see the <a href="/product.html">installation requirements</a> before choosing it.</p>
<p>This guide uses the current Text and Properties panels. Older Premiere tutorials may show Essential Graphics for styling.</p>

<figure class="caption-example"><img src="/img/guides/core-caption-workflow.svg" width="960" height="1080" loading="lazy" alt="A Premiere caption workflow moves from transcript text to timed caption clips, then to burned-in video, SRT sidecar or supported embedded captions"><figcaption>Workflow illustration. A transcript, a caption track and the delivered file are three separate stages. <a href="/img/guides/core-caption-workflow.svg">Open full-size diagram</a>.</figcaption></figure>

<h2 id="delivery">Choose the delivery before styling</h2>
<p>Check the upload or client brief first. A caption track keeps subtitle text available for caption-file export. A text graphic gives you animation control and renders into the picture. You can keep both in a project when you need a styled video and a separate subtitle file.</p>
<table class="spec"><thead><tr><th>You need</th><th>Start here</th><th>Check at delivery</th></tr></thead><tbody>
<tr><td>Always-visible social captions</td><td>Native captions with burn-in, or animated graphics</td><td>Play the exported video with subtitles turned off</td></tr>
<tr><td>A separate SRT for a platform</td><td>A native Subtitle track</td><td>Upload the SRT alongside the matching video</td></tr>
<tr><td>Broadcast closed captions</td><td>The caption standard in the delivery brief</td><td>Confirm the supported format and receiving system</td></tr>
</tbody></table>
<p>For broadcast specifications, use the <a href="closed-captions-premiere-pro.html">closed-caption delivery guide</a>. For an existing subtitle file, go directly to <a href="import-srt-premiere-pro.html">SRT import</a>.</p>
<h2 id="transcribe">1. Transcribe the sequence</h2>
<p>Open your edited sequence and choose <kbd>Window &gt; Text</kbd>. In the Transcript tab, transcribe the sequence if a transcript has not already been created during import. Choose the spoken language and the dialogue audio you want to transcribe. A language pack may need to download before local transcription can run.</p>
<p>Review names, numbers, and technical terms in the transcript before generating captions. If transcription fails or the transcript is empty, use the <a href="premiere-pro-speech-to-text-not-working.html">Speech to Text troubleshooting guide</a>.</p>

<h2 id="create">2. Create captions from the transcript</h2>
<p>In the Text panel's Captions tab, select <strong>Create captions from transcript</strong>. Use the Subtitle format for ordinary on-screen subtitles, or the format specified by your delivery brief for broadcast closed captions.</p>
<p>Set the line length, duration, gap, and number of lines for the video you are making. Short lines can help a vertical video, but check the result at the intended viewing size rather than forcing every sentence into the same number of characters.</p>
<p>Before confirming, check the caption format and any selected style. A short dialogue sample is enough to judge line length and reading time before captioning a long edit. Save a sequence copy if you are replacing an existing caption track.</p>
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

<h2 id="delivery-check">Check the exported result, not only the timeline</h2>
<p>Open the exported file from its saved location and play the same captioned phrase you reviewed in Premiere. For burn-in, turn the player's subtitles off: the text should stay visible. For a sidecar, verify that the SRT contains the expected words and upload it with the exact matching video. Embedded captions need a compatible player with the caption stream enabled.</p>
<p>If a graphic already contains the same words as an enabled native track, check for doubled text before export. Keep the subtitle copy for delivery and enable only the visible treatment you want in the picture. See <a href="premiere-pro-captions-not-exporting.html">caption export troubleshooting</a> if the result differs from the preview.</p>
<h2>Can Premiere make word-by-word captions?</h2>
<p>Current versions include a <strong>Single Word</strong> layout in Captioning Preferences. For a moving highlight across a multi-word line or animated graphics, compare the approaches in the <a href="animated-captions-premiere-pro.html">animated caption guide</a>.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption creation instructions</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">Properties and Track Styles</a>, and <a href="https://helpx.adobe.com/ca/premiere/desktop/render-and-export/export-files/overview-of-export-settings.html">export settings</a>.</p>
""",
image='/img/guides/core-caption-workflow.svg',
rel=['import-srt-premiere-pro', 'change-caption-font-premiere-pro', 'premiere-pro-captions-not-exporting', 'how-to-add-captions-in-after-effects'],
)

POSTS['auto-captions-premiere-pro'] = dict(
title='Premiere Pro Auto Captions: Generate and Check the Results',
desc='Use Speech to Text for Premiere Pro auto captions. Check the audio source, transcript, caption track and export, and fix recognition mistakes before delivery.',
h1='Generate auto captions in Premiere Pro, then check them',
modified='2026-11-09',
body="""
<p>Premiere Pro makes auto captions in two stages: <strong>Speech to Text creates a transcript, then Create captions turns that transcript into timed subtitles</strong>. Automatic transcription is included with Premiere. Creating the transcript does not place visible text on the video by itself.</p>
<p class="cta-line">For karaoke highlights and animated graphics, <a href="https://captionsgen.com/">Captions Gen</a> offers another workflow on Premiere Pro 25.6 or newer for supported 64-bit Windows. It transcribes locally on the CPU and creates editable Motion Graphics clips. The plugin is currently free without a watermark or time limit; the download needs an email address, with no payment card.</p>

<figure class="caption-example"><img src="/img/guides/core-auto-caption-gates.svg" width="960" height="1080" loading="lazy" alt="Four checkpoints for automatic captions: audible speech, transcript text, timed caption clips and the exported result"><figcaption>Workflow illustration. Stop at the first failed checkpoint instead of retranscribing a working caption track. <a href="/img/guides/core-auto-caption-gates.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="prepare">Prepare one representative dialogue sample</h2>
<p>Automatic captions still need an editorial pass. Start with a section containing the speakers, names and audio conditions in your actual edit. Listen to it before transcription: the recognizer needs speech in the audio source you choose, even when the waveform or file name looks correct.</p>
<p>Finish major picture cuts before correcting every caption boundary. If you change the edit later, review the captions around those cuts again. For a full first-time setup and delivery choices, use the <a href="how-to-add-captions-in-premiere-pro.html">native caption tutorial</a>; this page focuses on the automatic pipeline and checking its output.</p>
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

<h2 id="review-pass">Review words and timing as separate passes</h2>
<ol>
<li>Read the transcript while listening. Correct names, numbers, specialist terms and speaker mistakes before creating captions.</li>
<li>Create the caption track, then play it at normal speed. Check whether each phrase enters with the speech, stays long enough to read and breaks in a sensible place.</li>
<li>View the result at the final aspect ratio and a realistic viewing size. Adjust styling if text covers a face or disappears against bright footage.</li>
<li>Export a short sample using the intended caption delivery setting. A working transcript and Program Monitor preview do not prove that a sidecar was included in an upload.</li>
</ol>
<p>Changing the font will not repair a recognition mistake, and retranscribing will not fix an export left on None. The diagnostic below keeps those jobs separate.</p>
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

<h2 id="revisions">What should you do after a late video edit?</h2>
<p>Review the captions spanning the changed section, including the first phrase after it. Check both the text and the clip boundaries against the new audio. If the speech itself changed, regenerate or replace the affected captions as needed, then review the exported sample again. Keep a copy of an already delivered sequence when revisions must stay traceable.</p>
<h2 id="graphics">When an animated caption plugin helps</h2>
<p>Native captions are a useful choice for subtitles and sidecar files. If you want karaoke highlights, pill backgrounds, bounce animations, and editable graphics from a repeatable preset, consider <a href="https://captionsgen.com/#styles">Captions Gen's animated caption styles</a>. It uses Faster Whisper on the CPU. Missing speech models download first and are cached for later use; allow at least 3 GB for the built-in models, then review the generated words and timing. The <a href="/product.html">product reference</a> lists the current requirements.</p>
<p>Keep a native caption track as well when your delivery needs an SRT file. Graphics are part of the picture, not a substitute for a selectable caption file. Compare the <a href="animated-captions-premiere-pro.html">native and graphics workflows</a> before choosing.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption workflow</a> and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word layout</a>.</p>
""",
image='/img/guides/core-auto-caption-gates.svg',
rel=['how-to-add-captions-in-premiere-pro', 'premiere-pro-speech-to-text-not-working', 'fix-caption-timing-premiere-pro', 'word-by-word-captions-premiere-pro'],
)

POSTS['animated-captions-premiere-pro'] = dict(
title='Animated Captions in Premiere Pro: Native, Graphics, Plugin',
desc='Compare native single-word captions, manually animated graphics, and Captions Gen for Premiere Pro. Choose a workflow for subtitles or karaoke highlights.',
h1='Animated captions in Premiere Pro: choose your workflow',
modified='2026-11-09',
body="""
<p>To make animated captions in Premiere Pro, start with the look you need: <strong>one word appearing at a time, manually animated text, or a moving highlight within a multi-word line</strong>. These use different workflows. Current Premiere versions include native single-word captions; graphics give you more control over motion and highlighting.</p>

<figure class="caption-example"><img src="/img/guides/core-caption-motion-options.svg" width="960" height="1080" loading="lazy" alt="Three caption treatments: one native word at a time, manually keyframed text graphics and a highlighted spoken word within a phrase"><figcaption>Workflow illustration. Choose the output and motion you need before choosing a tool. <a href="/img/guides/core-caption-motion-options.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="delivery">Decide whether the text must remain a subtitle file</h2>
<p>Native caption tracks are the starting point for SRT and supported closed-caption delivery. Graphics are the starting point for keyframes, layered designs and a moving highlight. When a project needs both, preserve a native caption sequence or track before upgrading any captions to graphics.</p>
<p>A one-word layout changes how the words are grouped. A word highlight changes the appearance of the word being spoken inside a longer caption. These effects can look similar in a short preview, but they need different timing and editing controls.</p>
<h2 id="native">1. Native single-word captions</h2>
<p>Transcribe the sequence, create captions from the transcript, and select <strong>Layout &gt; Single Word</strong> in Captioning Preferences. Premiere creates timed one-word caption clips. Style them in Properties and choose the caption export format you need.</p>
<p>This route suits a simple one-word-at-a-time look and keeps the text on a native caption track. For the setup, follow the <a href="word-by-word-captions-premiere-pro.html">word-by-word captions workflow</a>.</p>

<h2 id="manual">2. Animate caption graphics by hand</h2>
<p>Create ordinary captions first, select the clips you want to animate, then choose <strong>Graphics and Titles &gt; Upgrade Caption to Graphic</strong>. Once the text is a graphic, use its text appearance and keyframes to build the motion you need.</p>
<p>A moving highlight across several words takes additional timing work. One method is to split the graphic at each spoken word and change that word's appearance in each segment. It gives you control, but corrections and longer edits mean more clips to maintain. See <a href="highlight-words-in-captions-premiere-pro.html">how to highlight spoken words</a>.</p>
<p>Try the motion on one graphic first: set an initial position or scale, enable animation for that property in Effect Controls, move the playhead and change the value. Review the movement at normal speed before copying it to more clips. Keyframes applied to a whole graphic do not automatically identify each spoken word.</p>
<p>Graphics render as part of the video. Keep the original caption track if you also need a sidecar file or closed-caption delivery.</p>

<h2 id="plugin">3. Generate animated graphics with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> transcribes locally on the CPU with Faster Whisper and places word-synced Motion Graphics clips on the Premiere timeline. Its presets combine karaoke highlights, color swaps or pill backgrounds, bounce, and in/out animations. You can edit the placed graphics or use <strong>Apply style</strong> to change their appearance without transcribing again. After editing caption text, review the updated animation and word timing.</p>
<figure class="caption-example"><img src="/img/styles/Bold-Impact.png" width="1280" height="480" loading="lazy" alt="Captions Gen preview reading Use Your Shield, with Shield highlighted in yellow"><figcaption>A Captions Gen graphic with the spoken word highlighted. This is a plugin preview, not Premiere's native caption track.</figcaption></figure>
<p>The plugin runs on supported 64-bit Windows 10 or 11 with Premiere Pro 25.6 or newer. It's currently free, with no time limit or watermark. Enter an email address at the free checkout to get the download, with no payment card. Missing speech models download before use, so allow at least 3 GB of model storage and time for that first download. Review the <a href="/product.html">full requirements and limitations</a>.</p>
<p>Working in After Effects too? The <a href="/news/captions-gen-1-1-9.html">1.1.9 Windows setup</a> can install Premiere Pro, After Effects, or both, sharing the engine and Models folder. The After Effects panel creates native editable caption layers and is tested with After Effects 2026 on Windows 11. This guide's timeline steps are for Premiere Pro.</p>

<h2 id="edit-check">Check an actual caption correction before a long batch</h2>
<p>Generate a short representative sample, then correct one word. Review the highlight around the edited text rather than judging only the unchanged preset preview. With Captions Gen, use the caption editor where available; direct Properties text edits can require <strong>Update animation</strong> for the selected changed graphics. Recheck the timing after that update.</p>
<p>Use <strong>Apply style</strong> to change the design of the placed captions rather than transcribing again for a color change. The <a href="free-caption-plugin-premiere-pro.html">free plugin guide</a> explains the current Windows installation and editing limits. In After Effects, follow the separate <a href="word-by-word-captions-after-effects.html">word-by-word layer workflow</a>; its composition controls differ from Premiere's timeline.</p>
<h2>Which workflow fits your edit?</h2>
<ul>
<li><strong>Readable subtitles or a separate caption file:</strong> start with Premiere's native captions.</li>
<li><strong>One word at a time:</strong> try the native Single Word layout before adding another tool.</li>
<li><strong>A few custom animated titles:</strong> manual graphics can give you the control you need.</li>
<li><strong>Repeatable karaoke highlights and animation presets:</strong> test Captions Gen on a representative clip.</li>
</ul>
<p>If your existing workflow goes through another editor, the <a href="capcut-vs-premiere-pro-captions.html">CapCut and Premiere caption comparison</a> covers the export-and-import tradeoff. If captions are missing rather than needing animation, start with the <a href="premiere-pro-captions-not-showing.html">visibility and export checks</a>.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-images-and-graphics/animate-layers-using-the-effect-controls-panel.html">graphics keyframing instructions</a> and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">native Single Word caption workflow</a>.</p>
""",
image='/img/guides/core-caption-motion-options.svg',
rel=['word-by-word-captions-premiere-pro', 'premiere-pro-captions-to-graphics', 'highlight-words-in-captions-premiere-pro', 'word-by-word-captions-after-effects'],
)

POSTS['premiere-pro-captions-not-showing'] = dict(
title='Premiere Pro Captions Not Showing? Preview and Export Fixes',
desc='Find why Premiere Pro captions are missing: separate transcript, track visibility, text appearance and export problems, with checks for graphics and subtitle files.',
h1='Premiere Pro captions not showing: preview and export fixes',
modified='2026-11-09',
body="""
<p>If captions are not showing in Premiere Pro, first enable the <strong>eye icon on the caption track</strong> and move the playhead over a caption clip. If they show in the Program Monitor but disappear from the exported video and you want permanently visible text, set <strong>Captions &gt; Export Options &gt; Burn Captions Into Video</strong>. A transcript alone does not create visible captions.</p>
<div class="box quick-answer">
<p class="t">Start with the symptom you see</p>
<ul>
<li><a href="#create-track">No caption clips on the timeline</a>: create captions from the transcript.</li>
<li><a href="#track-visibility">Caption clips exist, but the preview is blank</a>: check track visibility, timing, and text appearance.</li>
<li><a href="#export-captions">The preview works, but the exported video has no text</a>: check the export option and the player.</li>
</ul>
</div>
<p>These steps use the current Premiere interface. Older tutorials may show Essential Graphics or a Program Monitor CC menu; use the caption track controls and Properties panel in current versions.</p>

<figure class="caption-example"><img src="/img/guides/core-missing-captions-map.svg" width="960" height="1080" loading="lazy" alt="A diagnostic map separates no caption track, a blank Program Monitor, missing exported captions and graphics on video tracks"><figcaption>Workflow illustration. Match the symptom to the right stage before changing settings. <a href="/img/guides/core-missing-captions-map.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="identify">Identify the kind of text that is missing</h2>
<p>Click the affected text item in the Timeline. A native caption clip belongs to a caption track; a Type-tool title, upgraded caption or Captions Gen graphic belongs to a video track. The Text panel's transcript is a third kind of data. Caption export options apply to native caption tracks, so start with the correct branch.</p>
<p>For an After Effects composition, use <a href="after-effects-captions-not-showing.html">After Effects panel and layer visibility checks</a>. Premiere's caption-track controls do not describe those layers.</p>
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

<h2 id="isolate">Isolate one caption before rebuilding the track</h2>
<ol>
<li>Save a project or sequence copy. Choose one caption whose text and timing you can recognize.</li>
<li>Put the playhead inside that caption and confirm the open sequence matches the Program Monitor. Make the intended track visible.</li>
<li>Temporarily use an ordinary readable size, white fill, dark background and an in-frame position. If it appears, restore the design one setting at a time.</li>
<li>Export a short sample with the intended delivery option. Check that exact new file, rather than an older export in the same folder.</li>
</ol>
<p>This separates a styling problem from a missing track or delivery problem without discarding corrected words. If only an imported SRT is offset, use the <a href="import-srt-premiere-pro.html">import guide</a> and <a href="fix-caption-timing-premiere-pro.html">timing checks</a> before recreating it.</p>
<h2>Still missing?</h2>
<p>Test a new short sequence with one fresh Subtitle caption and default styling. If that works, compare its track, timing, and export settings with the affected sequence. Save a copy of the project before resetting settings or rebuilding a track.</p>
<p class="sources">References: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/translate-captions.html">caption track visibility controls</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption creation workflow</a>, and <a href="https://helpx.adobe.com/ca/premiere/desktop/render-and-export/export-files/overview-of-export-settings.html">caption export options</a>.</p>
""",
image='/img/guides/core-missing-captions-map.svg',
rel=['premiere-pro-captions-not-exporting', 'premiere-pro-speech-to-text-not-working', 'fix-caption-timing-premiere-pro', 'after-effects-captions-not-showing'],
)
