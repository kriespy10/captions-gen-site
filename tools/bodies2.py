# -*- coding: utf-8 -*-
# Twenty more captionsgen.com guides. Imported by genblog.py. Each entry: title, desc, h1, body, rel (3 related slugs).
P = {}

P["subtitles-vs-captions-premiere-pro"] = dict(
modified='2026-11-09',
title="Subtitles vs Captions in Premiere Pro: What's the Difference?",
desc="Choose Subtitle, CEA-608 or CEA-708 in Premiere Pro, then deliver burn-in, SRT or embedded captions. Learn which settings and files actually matter.",
h1="Subtitles vs captions in Premiere Pro",
rel=["how-to-add-captions-in-premiere-pro","closed-captions-premiere-pro","how-to-add-subtitles-in-premiere-pro"],
body="""
<p><strong>In Premiere Pro, Subtitle is a caption-track format; burn-in, sidecar and embedded captions are delivery choices.</strong> CEA-608 and CEA-708 are other caption formats used in specified workflows. A subtitle can be selectable in a player, and a closed-caption track can be burned into the picture. Pick the format and delivery separately.</p>
<p>The words also describe different editorial jobs. Dialogue subtitles often reproduce or translate speech. Accessibility captions can also identify speakers and meaningful sounds. A format choice does not add missing information or make an unchecked transcript accurate.</p>
<h2 id="two-decisions">Make two decisions before creating captions</h2>
<p>First ask what text the viewer needs: dialogue, another language, speaker identification or sound descriptions. Then ask what file the recipient needs. A client asking for an SRT and a client asking for a CEA-708 stream have different delivery requirements, even if the video picture is identical.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-delivery.svg" width="960" height="1000" loading="lazy" alt="Choose a caption format first, then choose visible burn-in, a sidecar subtitle file or a supported embedded stream"/><figcaption>Workflow illustration. Caption format and delivery method are separate decisions. <a href="/img/guides/native-caption-delivery.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="subtitle-format">Use Subtitle for flexible native subtitles</h2>
<p>Choose Subtitle in Create captions for an ordinary native subtitle track. Use Properties and a <a href="premiere-pro-caption-presets.html">Track Style</a> to keep its appearance consistent. Review the recognized words and caption boundaries after creation.</p>
<p>Choose burn-in if the picture must retain the design. Choose a supported sidecar such as SRT when the destination should receive text and timing separately. Do not expect an SRT upload to reproduce a Premiere font, background box or animation. YouTube, for example, accepts basic UTF-8 SRT without its style markup.</p>
<h2 id="closed-caption-format">Use the requested closed-caption format</h2>
<p>CEA-608 and CEA-708 have their own stream, channel and formatting constraints. Ask the recipient which standard, service and output container they accept. Choose that format when creating the track, and keep a copy before changing an existing delivery setup.</p>
<p>The available export choices depend on the track and container. Adobe lists different supported tracks for SCC, MCC, XML and other sidecars. An MP4 with visible words is not equivalent to a separately specified caption stream. The <a href="closed-captions-premiere-pro.html">closed-caption delivery guide</a> covers those checks.</p>
<h2 id="choose-output">Match the exported result to the request</h2>
<ol>
<li>For words that must be visible in the picture, open Export, expand Captions and choose Burn Captions Into Video for the intended native track.</li>
<li>For a separate file, choose a supported sidecar format and confirm the selected language track. Keep the resulting caption file with the matching video version.</li>
<li>For embedded captions, use a supported container and caption format, then test in a compatible player with captions enabled.</li>
<li>Export a short sample and inspect the actual file or loaded sidecar. The Program Monitor alone does not prove the delivery is correct.</li>
</ol>
<h2 id="switching-format">If the format was wrong</h2>
<p>Save the project before replacing a reviewed caption track. Create a new track from the checked transcript with the required format, or work from the appropriate caption file. Compare text, timing, supported characters and export settings before removing the old version.</p>
<p>If another language is needed, separate transcription from translation. Premiere's current Translate captions workflow creates another track using cloud services. Review that translation and keep track names clear. Captions Gen's public release does not translate speech.</p>
<h2 id="animated-graphics">Where animated graphics fit</h2>
<p>Premiere's Single Word layout can create native one-word captions. For a moving highlight inside a phrase, use <a href="highlight-words-in-captions-premiere-pro.html">timed graphics</a>. Captions Gen 1.1.9 produces editable Premiere graphics or After Effects caption layers using local CPU transcription. Those designs render into the picture; they do not supply an SRT sidecar.</p>
<p>Keep a native track when subtitle delivery is also required, and maintain consistent corrections in both versions. If a sidecar exists but you see no text, check whether the player loaded it before changing the captions themselves.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption formats and creation settings</a>, <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">export choices</a>, <a href="https://support.google.com/youtube/answer/2734698?hl=en">YouTube caption-file support</a>, and <a href="/product.html">Captions Gen product facts</a>.</p>
""")

P["how-to-add-subtitles-in-premiere-pro"] = dict(
modified='2026-11-09',
title="How to Add Subtitles in Premiere Pro From SRT or Text",
desc="Add subtitles to Premiere Pro from an existing SRT or manually prepared text, check their timing, apply a style and export the matching video and subtitle file.",
h1="How to add subtitles in Premiere Pro",
rel=["how-to-add-captions-in-premiere-pro","import-srt-premiere-pro","change-caption-font-premiere-pro"],
body="""
<p><strong>If you already have subtitles, import the SRT with File &gt; Import, then drag it from the Project panel into your sequence.</strong> Premiere creates a native caption track. This is the useful route for a translator's file, manually written subtitles or a reviewed transcript that already has timecodes.</p>
<p>If you have only speech audio, start with <a href="how-to-add-captions-in-premiere-pro.html">the full transcription-to-captions guide</a>. The steps below focus on bringing prepared subtitles into an edit and delivering them correctly, rather than transcribing the same video again.</p>
<h2 id="prepare-file">Check the subtitle file before import</h2>
<p>Confirm that the file belongs to the exact edit you are using. A translator may have worked from a different opening, an earlier cut or an export with a countdown. Keep that reference video until timing has been checked.</p>
<p>SRT contains numbered entries, start and end timestamps, and subtitle text. It does not carry your animated design. Use plain UTF-8 text when preparing an SRT for YouTube; changing a document's extension to .srt does not give it the required structure.</p>
<figure class="caption-example"><img src="/img/guides/native-subtitle-import.svg" width="960" height="1000" loading="lazy" alt="Prepared subtitle text and timecodes go into an SRT, then a Premiere caption track, then video and subtitle delivery"/><figcaption>Workflow illustration for subtitles you already have. <a href="/img/guides/native-subtitle-import.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="manual-subtitles">Prepare a short SRT manually if needed</h2>
<p>For a short, carefully timed passage, you can write an SRT in a plain-text editor. This original example illustrates the structure; replace its sample wording and timings with your own.</p>
<pre><code>1
00:00:01,000 --&gt; 00:00:03,200
Welcome to the workshop.

2
00:00:03,400 --&gt; 00:00:05,800
Let's set up the first shot.</code></pre>
<p>Keep a blank line between entries and make each end later than its start. Listen to the speech while marking the times. For a long programme, a subtitle editor or transcription workflow is more practical than typing every timestamp manually. Review names, meaningful sounds and speaker changes according to the job's brief.</p>
<h2 id="import-subtitles">Import and place the subtitles</h2>
<ol>
<li>Save the Premiere project, open the matching sequence and import the .srt using File &gt; Import.</li>
<li>Find the subtitle item in the Project panel and drag it into the sequence. Premiere creates a caption track from it.</li>
<li>Enable the intended caption track and move the playhead over a subtitle. Check the opening, a middle passage and the ending against the reference audio.</li>
<li>If every subtitle is shifted by the same amount, move the selected captions together. If the error grows or changes after a cut, use the <a href="fix-caption-timing-premiere-pro.html">offset and drift checks</a> instead of applying one global shift.</li>
</ol>
<h2 id="style-subtitles">Style the native caption track</h2>
<p>Select a caption and open Window &gt; Properties. Set its font and appearance, then save and apply a <a href="premiere-pro-caption-presets.html">Track Style</a>. Check longer subtitles for wrapping and clipping. A new font can change line breaks even when the words and timecodes are unchanged.</p>
<p>For another subtitle language, keep the tracks identifiable and preview the intended one. Translation is an editorial step, not a font choice. Premiere offers Translate captions in current versions, using cloud translation services; a supplied translator's reviewed SRT can be imported directly.</p>
<h2 id="export-subtitles">Deliver the picture and subtitle file</h2>
<p>Open Export and expand Captions. Burn Captions Into Video when the recipient wants fixed visible text. Choose a supported sidecar such as SRT when they need a separate subtitle file. Check the selected track and destination path, then load the actual exported subtitle file with the matching video.</p>
<p>A sidecar is not automatically displayed by every player. Upload it separately when the destination requires that, and check accented characters and timing after upload. Use the dedicated <a href="import-srt-premiere-pro.html">SRT import/export guide</a> for file problems.</p>
<h2 id="subtitle-problems">If something looks wrong</h2>
<p>If no caption track appears, verify that the file is a supported caption format rather than a plain transcript or word-processing document. If the track exists but no text is visible, check track output, clip timing and <a href="premiere-pro-captions-not-showing.html">caption visibility</a>. If the export loses the font, confirm whether you delivered a sidecar that the receiving player styles itself.</p>
<p>Animated Captions Gen graphics are a separate output. The current plugin does not import a native subtitle track or turn an SRT into animated graphics. Keep the native subtitles when the delivery requires them.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html">caption-file import</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html">supported formats</a>, <a href="https://support.google.com/youtube/answer/2734698?hl=en">basic SRT structure and UTF-8 support</a>, and <a href="/product.html">plugin output limits</a>.</p>
""")

P["change-caption-font-premiere-pro"] = dict(
modified='2026-11-09',
title="How to Change the Caption Font in Premiere Pro",
desc="Change native caption fonts in Premiere Properties, update a whole track with Track Styles, and diagnose missing fonts, substitutions and graphics controls.",
h1="How to change the caption font in Premiere Pro",
rel=["best-fonts-for-captions","premiere-pro-caption-presets","how-to-add-captions-in-premiere-pro"],
body="""
<p><strong>Select a native caption clip, open Window &gt; Properties, and change its font in the text controls.</strong> To reuse that appearance across the caption track, create or update a Track Style. If you selected a title or a Captions Gen graphic instead, use that graphic's controls; it is not a native caption track.</p>
<h2 id="identify-text">Identify the text before changing it</h2>
<p>Native captions live on a caption track. Type-tool titles and converted captions live on video tracks. Captions Gen also puts editable Motion Graphics clips on Premiere video tracks. A font control found in one workflow does not automatically change the other kinds of text.</p>
<p>If you need native subtitles first, follow <a href="how-to-add-subtitles-in-premiere-pro.html">adding prepared subtitles</a> or the main <a href="how-to-add-captions-in-premiere-pro.html">speech-to-text guide</a>. You can style their caption track after it exists.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-font.svg" width="960" height="1000" loading="lazy" alt="Identify a caption track or graphic, change its text appearance, then review long lines and the exported result"/><figcaption>Workflow illustration. The selected timeline item determines which text controls apply. <a href="/img/guides/native-caption-font.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="change-font">Change one native caption</h2>
<ol>
<li>Place the playhead over an affected caption and select its caption clip on the timeline.</li>
<li>Open Properties and choose the intended font family and weight. Check that the typeface contains the characters used by the subtitle language.</li>
<li>Adjust size, fill, stroke, shadow or background to suit the footage. Avoid judging only against a paused dark frame if the next shot is bright.</li>
<li>Review a longer caption and the actual delivery framing. A wider font may wrap or extend beyond the picture.</li>
</ol>
<p>For a 1080 x 1920 edit, 55 to 75 pixels can be a starting experiment, not a required size. Different fonts have different visible heights. Review an exported sample at phone size and adjust to your text and viewing distance.</p>
<h2 id="whole-track">Apply the look across a track</h2>
<p>Use the plus control beside Track style to create a named style, then save it to the Project or Local styles as appropriate. Choose it for the caption track. The <a href="premiere-pro-caption-presets.html">Track Style guide</a> explains those save locations and reuse.</p>
<p>When changing a style already in use, edit a linked caption and choose Redefine Style. Read the dialog before confirming: Premiere distinguishes applying the edit across the track from overwriting the stored style. Check the intended track and inspect any captions with individual formatting.</p>
<h2 id="missing-font">If the font is missing or substituted</h2>
<p>Make sure the family and required weight are installed on the computer or activated through Adobe Fonts. Wait for activation to finish, reopen the font menu and restart Premiere if it still does not appear. Test a short phrase containing the actual accented or non-Latin characters you need.</p>
<p>For a project with several graphic fonts, Adobe also provides Graphics and Titles &gt; Replace Fonts in Project. Save a copy before making a project-wide substitution. It is broader than styling one caption track; do not use it casually when a client needs different fonts in titles and subtitles.</p>
<h2 id="font-changed-one">If only one caption changed</h2>
<p>Check whether you edited a single caption locally rather than its Track Style. Reapply the intended style or use Redefine Style for the appropriate scope. Do not select every unrelated video clip hoping the caption font will follow.</p>
<p>If no text changes, confirm that the selected item is the one visible in the Program Monitor. An enabled second caption track or a duplicate graphic can make it look as though the edit did nothing.</p>
<h2 id="plugin-fonts">Fonts in Captions Gen</h2>
<p>In the current Windows plugin, choose a preset, open Customize and set the design before generating. Use Apply style to restyle the generated batch. Saved .cgpreset files carry font identity and design settings, not the font files themselves, so check fonts when sharing a custom look.</p>
<p>After changing caption words, review timing and use Update animation where offered. A font change is a style operation; changing the words can also affect highlights and grouping. After Effects users have a different editing surface, covered in the <a href="how-to-add-captions-in-after-effects.html">After Effects guide</a>.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">caption appearance controls</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/redefine-linked-and-track-styles.html">Redefine Style</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/replace-fonts.html">Replace Fonts in Project</a>, and <a href="/product.html">Captions Gen features</a>.</p>
""")

P["premiere-pro-caption-presets"] = dict(
modified='2026-11-09',
title="Premiere Pro Caption Presets: Save, Apply and Share Styles",
desc="Save and apply Premiere Pro Track Styles, reuse caption creation settings, and share Captions Gen designs as .cgpreset files. Illustrated steps and checks.",
h1="Save, apply and share Premiere Pro caption presets",
rel=["change-caption-font-premiere-pro","animated-captions-premiere-pro","best-fonts-for-captions"],
body="""
<p><strong>To save the look of native captions in Premiere Pro, create a Track Style in Properties.</strong> The Caption preset in Create captions controls how the transcript becomes caption clips. A Captions Gen preset saves a plugin design, including animation. Choose the type that matches what you want to reuse.</p>

<h2 id="preset-types">Which kind of caption preset do you need?</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th>Preset or style</th><th>What it controls</th><th>Where you use it</th></tr></thead>
<tbody>
<tr><td>Create captions preset</td><td>Caption creation settings such as format, line length, duration and number of lines</td><td>Premiere's Create captions dialog, when making a native caption track</td></tr>
<tr><td>Adobe Track Style</td><td>The appearance of native captions, such as font, fill, stroke and background</td><td>Properties and the Track style menu</td></tr>
<tr><td>Captions Gen preset</td><td>The plugin's caption design, including its highlight and animation settings</td><td>The Captions Gen panel; saved designs can be shared as .cgpreset files</td></tr>
</tbody>
</table>
</div>
<p>These are different workflows. A native Track Style does not generate speech timing or a moving word highlight. A Captions Gen preset does not turn its graphics into native subtitle tracks.</p>
<figure class="caption-example"><img src="/img/guides/presets-workflow.svg" width="960" height="1080" loading="lazy" alt="Three preset workflows: caption creation settings, Adobe Track Styles for native caption appearance, and Captions Gen presets for animated graphics"><figcaption>Workflow illustration. Choose the preset type before saving or sharing it. <a href="/img/guides/presets-workflow.svg">Open full-size diagram</a>.</figcaption></figure>

<h2 id="creation-preset">Set up captions in Create captions</h2>
<p>Use this part of the workflow when you are turning a reviewed transcript into a native caption track.</p>
<ol>
<li>Open the Text panel and choose <strong>Captions &gt; Create captions from transcript</strong>. If you need the transcription steps, start with the <a href="how-to-add-captions-in-premiere-pro.html">native Premiere captions guide</a>.</li>
<li>Choose an available <strong>Caption preset</strong>, then check Format, line length, duration, gap and Lines for this edit. Subtitle is a useful starting format for ordinary subtitle delivery; follow the delivery specification for broadcast formats.</li>
<li>Choose an available caption style in the <strong>Style</strong> field if you already have one. Create the captions, then review line breaks and timing against the audio.</li>
</ol>
<p>For a short vertical video, try shorter lines and check them on a phone. A wide interview can need a different layout. There is no line-length preset that suits every font, frame size and speaking pace.</p>

<h2 id="save-track-style">Save a native caption Track Style</h2>
<ol>
<li>Select a native caption clip on the timeline and open <strong>Window &gt; Properties</strong>.</li>
<li>Set its font and appearance. Start with readable text, then adjust fill, stroke, shadow or background as needed. See the <a href="change-caption-font-premiere-pro.html">caption font guide</a> for appearance checks.</li>
<li>Use the <strong>plus control</strong> beside the Track style menu and choose <strong>Create style</strong>. Give the style a name you will recognize in another edit.</li>
<li>Save to the <strong>Project</strong> to create a style item there, or to <strong>Local styles</strong> for reuse through the style browser in other projects on that computer.</li>
<li>Choose the style from the Track style menu for the intended caption track. Check a few captions, including a long line, before applying the same look throughout your delivery.</li>
</ol>
<p>Adobe's current instructions describe these <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">caption style controls and save locations</a>. Older tutorials may show Essential Graphics; these steps use Properties.</p>

<h2 id="update-track-style">Change all linked captions with Redefine Style</h2>
<p>Editing one caption's appearance can leave you with a local change. To update a saved style, select a caption using it, make the change and choose <strong>Redefine Style</strong> beside the style menu. Read the dialog: for captions, Premiere offers a choice between applying the change across the track and overwriting the saved style.</p>
<p>Check that you chose the intended track and style before confirming. Adobe documents the distinction in its <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/redefine-linked-and-track-styles.html">Redefine Style instructions</a>.</p>

<h2 id="share-native-style">Reuse or share a native caption style</h2>
<p>For another project on the same computer, save the style to Local styles and choose it through the style browser. For a project handoff, save the Track Style to the Project and keep a short sample caption in the project so the recipient can see the intended result. A reusable project template can carry that setup into later edits.</p>
<p>The recipient still needs the font. Check the project on the receiving computer before treating the handoff as complete. Exporting captions as SRT is a different task: it delivers subtitle text and timing, not your complete Premiere design. Use the <a href="import-srt-premiere-pro.html">SRT workflow</a> for that delivery.</p>

<h2 id="animated-presets">Save and share an animated Captions Gen preset</h2>
<p>I make Captions Gen. The <a href="/product.html">current 1.1.9 Windows release</a> has 18 built-in designs for editable animated captions. In Premiere, it places Motion Graphics clips on video tracks. It currently has no watermark or transcription time cap; Adobe Premiere Pro is a separate paid application.</p>
<ol>
<li>In Captions Gen, choose a built-in look and adjust it in <strong>Customize</strong>.</li>
<li>Open <strong>Save preset</strong> beside the preview, choose <strong>Save as preset</strong> or <strong>Save as new preset</strong>, and give the design a name. It appears under <strong>Your presets</strong>.</li>
<li>To share a saved design, open that preset's <strong>⋯</strong> menu and choose <strong>Export</strong>. Save the <strong>.cgpreset</strong> file.</li>
<li>On the receiving installation, choose <strong>Import</strong> under Your presets and select the file. Check the font and preview, then generate and review a short captioned sample.</li>
</ol>
<p>A .cgpreset file contains design settings and font identity, not a transcript or font files. It is for Captions Gen; importing it as a native Adobe Track Style or SRT will not work. Installing the required font and checking its license is part of sharing your design.</p>
<p>Use <strong>Apply style</strong> to change the look of captions already placed by the plugin. After changing caption text, use <strong>Update animation</strong> where offered and review word timing. If you already have native captions and want to animate them manually, follow <a href="premiere-pro-captions-to-graphics.html">converting captions to graphics</a>.</p>

<h2 id="preset-problems">If the saved look does not appear</h2>
<ul>
<li><strong>Only one caption changed:</strong> check the track's selected Track Style and whether you changed one caption locally. Use Redefine Style when the change should reach the track or saved style.</li>
<li><strong>The style is missing in a new project:</strong> check whether you saved it only to the original Project. Use Local styles for reuse on the same computer, or carry the project style with the handoff.</li>
<li><strong>The font looks different:</strong> check that the receiving computer has the intended font and weight installed.</li>
<li><strong>A preset has no moving highlight:</strong> a native caption Track Style stores appearance. Use timed graphics for a highlight that follows speech within a line, or use native Single Word captions when one word at a time is enough.</li>
</ul>
<p>Try the <a href="/\u0023custom">browser caption designer</a> for a sample of Captions Gen's styles, or check the <a href="free-caption-plugin-premiere-pro.html">free plugin guide</a> for supported versions and installation. The browser preview uses sample text; it does not transcribe your footage.</p>
<p class="sources">References checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">Create captions settings</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/apply-linked-and-track-styles.html">applying Linked and Track Styles</a>, and <a href="/product.html">Captions Gen product facts</a>.</p>
""")

P["premiere-pro-captions-to-graphics"] = dict(
modified='2026-11-09',
title="Convert Captions to Graphics in Premiere Pro: Step by Step",
desc="Use Upgrade Caption to Graphic, keep a subtitle copy for SRT, and animate the resulting graphics. An illustrated Premiere Pro workflow with export checks.",
h1="Convert captions to graphics in Premiere Pro",
rel=["animated-captions-premiere-pro","word-by-word-captions-premiere-pro","how-to-add-captions-in-premiere-pro"],
body="""
<p>Select caption clips on the timeline, then choose <strong>Graphics and Titles &gt; Upgrade Caption to Graphic</strong>. Premiere creates graphics on a video track with the caption text and timing. Review them before adding effects or animation.</p>
<p><strong>Save a copy before converting if you also need SRT or closed captions.</strong> The graphics render into the picture through video tracks. They do not replace a native subtitle track for a separate caption-file delivery.</p>

<h2 id="before-converting">Check whether conversion is needed</h2>
<p>Keep native captions when your job is to correct text, adjust timing, change a font or reuse a static look. Premiere's <a href="premiere-pro-caption-presets.html">Track Styles</a> handle consistent appearance without conversion. Current Premiere versions also offer a <a href="word-by-word-captions-premiere-pro.html">Single Word layout</a> if you want one word displayed at a time.</p>
<p>Convert when you need graphics controls such as keyframed motion or effects. A moving highlight inside a multi-word line needs additional word-level animation; choosing Upgrade Caption to Graphic does not create that highlight automatically.</p>

<h2 id="convert-captions">Convert selected captions, or a whole track</h2>
<ol>
<li><strong>Review the native captions first.</strong> Correct names, numbers, line breaks and timing while they are still in the caption workflow. If you have only a transcript, <a href="how-to-add-captions-in-premiere-pro.html">create the caption track</a> before trying to upgrade it.</li>
<li><strong>Save and duplicate the sequence.</strong> Keep one copy with its native caption track if you need SRT or another caption format later. Work on the other copy for the animated version.</li>
<li><strong>Select the caption clips to convert.</strong> Select clips on the caption track in the Timeline, rather than selecting transcript words or an ordinary video clip. For a whole track, check that the selection includes all the intended caption clips before continuing.</li>
<li>Choose <strong>Graphics and Titles &gt; Upgrade Caption to Graphic</strong>.</li>
<li><strong>Inspect the resulting graphics on the video track.</strong> Play several captions and check their text, in/out points, position and appearance. Watch for another video or graphic layer covering them.</li>
<li>Select a resulting graphic and open <strong>Properties</strong> for its text and appearance. Add and review keyframes or effects as needed. Test one caption before building the same animation across a long sequence.</li>
</ol>
<figure class="caption-example"><img src="/img/guides/captions-to-graphics-workflow.svg" width="960" height="900" loading="lazy" alt="Save a native-caption copy, upgrade selected captions, then animate and render the resulting video-track graphics"><figcaption>Workflow illustration with simplified timelines. Keep a native-caption copy before conversion when subtitle delivery is required. <a href="/img/guides/captions-to-graphics-workflow.svg">Open full-size diagram</a>.</figcaption></figure>
<p>Preserving the original is a separate step, not something to assume the conversion command will do for you. If you keep native captions and graphics in the same working sequence, check their visibility so the video does not show the same words twice.</p>

<h2 id="after-conversion">What changes after conversion?</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th>Task</th><th>Native caption track</th><th>Converted graphics</th></tr></thead>
<tbody>
<tr><td>Keep a consistent static look</td><td>Use a Track Style</td><td>Edit the graphic's appearance</td></tr>
<tr><td>Add motion or effects</td><td>Caption-track controls have different limits</td><td>Use graphics controls, effects and keyframes</td></tr>
<tr><td>Deliver an SRT sidecar</td><td>Export a supported caption file from the native track</td><td>The graphics themselves do not produce an SRT track</td></tr>
<tr><td>Make words visible in the rendered video</td><td>Use caption burn-in</td><td>Keep the graphics and their video-track output enabled</td></tr>
</tbody>
</table>
</div>
<p>A graphic can retain the caption's text and clip timing without knowing exactly when each word is spoken. For a karaoke highlight, review the audio and add the word changes or use a speech-driven tool that generates word timing.</p>

<h2 id="command-unavailable">If Upgrade Caption to Graphic is unavailable</h2>
<p>First check what you have selected. A transcript is not a caption clip, and existing Type-tool text or plugin graphics are already a different kind of timeline item. Select an actual native caption clip in the Timeline and look for the command in Graphics and Titles.</p>
<p>If you cannot find a native caption track, return to the Text panel and create captions from the transcript. If the track exists but its text is missing from the preview, follow <a href="premiere-pro-captions-not-showing.html">the caption visibility checks</a> before converting more clips. Conversion is not a general fix for an unavailable transcript or a missing speech model.</p>
<p>Menu locations and panel names can differ in older tutorials. Check the installed Premiere version when asking for help, and try one caption in a saved copy before changing the whole edit.</p>

<h2 id="export-graphics">Export graphics and subtitle files separately</h2>
<p>For the animated version, keep the graphics inside the export range with their video track enabled, then export a short section and watch the actual file. The native Captions export options do not control those graphic clips. If they are missing, check their duration, video-track output, appearance and any covering layers.</p>
<p>For an SRT file or specified closed-caption delivery, use the preserved native-caption sequence and its supported export settings. Keep text revisions consistent between the two versions. See <a href="premiere-pro-captions-not-exporting.html">caption export checks</a> and the <a href="import-srt-premiere-pro.html">SRT guide</a> for those outputs.</p>

<h2 id="generate-animated-graphics">Generate animated graphics directly with Captions Gen</h2>
<p>I make Captions Gen. It transcribes selected speech locally on your CPU and creates editable Motion Graphics clips with word timing in Premiere, so its output does not need the native-caption upgrade step. It does not import or convert your native caption track.</p>
<p>The <a href="/product.html">current public Windows release</a> supports Premiere Pro 25.6 or newer and is free without a watermark or transcription time cap. Adobe Premiere Pro is separate and paid. Choose a preset, generate from your source clip and review the transcript and highlights. Check the <a href="free-caption-plugin-premiere-pro.html">free plugin setup guide</a> before installing.</p>
<p>Both workflows need a text and timing check. Use native captions for SRT or selectable subtitle delivery, and graphics for the animated treatment rendered into the picture. For the panel in After Effects, follow the separate <a href="how-to-add-captions-in-after-effects.html">After Effects captions guide</a>; this Premiere menu command is not an After Effects step.</p>
<p class="sources">References checked 9 November 2026: Adobe documents the <a href="https://helpx.adobe.com/premiere/desktop/troubleshooting/limitations-and-known-issues/known-and-fixed-issues.html">Upgrade Caption to Graphic command</a> in its caption-related export guidance; see also <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">creating native captions</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-images-and-graphics/animate-layers-using-the-effect-controls-panel.html">animating graphics with Effect Controls</a> and <a href="/product.html">Captions Gen's output and limitations</a>.</p>
""")

P["premiere-pro-captions-not-exporting"] = dict(
modified='2026-11-09',
title="Premiere Pro Captions Not Exporting: Settings to Check",
desc="Diagnose missing Premiere captions by output type: burned-in text, SRT sidecar, embedded captions or graphics. Check tracks, export range and the actual file.",
h1="Premiere Pro captions not exporting",
rel=["premiere-pro-captions-not-showing","burn-in-captions-premiere-pro","closed-captions-premiere-pro"],
body="""
<p><strong>If native captions are missing from the exported picture, open Export &gt; Captions and check Export Options.</strong> Choose Burn Captions Into Video for visible words in the picture. A sidecar or embedded stream needs a compatible receiving workflow. For graphics on video tracks, check their video output instead of native caption export settings.</p>
<h2 id="identify-delivery">First identify what is missing</h2>
<p>Compare the request with the files you actually exported. An MP4 plus an SRT can be a correct sidecar delivery even when opening only the MP4 shows no words. Conversely, text visible in a video does not prove that a required selectable caption stream exists.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-export-check.svg" width="960" height="1000" loading="lazy" alt="Check native burn-in settings, a separate sidecar or supported embedded stream, and video-track output for graphics"/><figcaption>Diagnostic illustration. Start with the intended output rather than changing every setting at once. <a href="/img/guides/native-caption-export-check.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="burn-in-missing">Native text should be visible in the video</h2>
<ol>
<li>Open the same sequence that contains the caption track. Park the playhead over a caption and confirm it is visible in the Program Monitor.</li>
<li>Check the track's output and the caption clip's time range. Enable only the caption tracks intended for this picture version.</li>
<li>In Export, expand Captions and choose Burn Captions Into Video. Review the listed caption tracks and export range.</li>
<li>Export a short passage to a new, clearly named file. Open that new file, rather than an older export cached in a player.</li>
</ol>
<p>If captions are missing in the preview too, first use the <a href="premiere-pro-captions-not-showing.html">preview visibility guide</a>. Export settings cannot reveal a caption outside its clip duration or repair text placed outside the frame.</p>
<h2 id="sidecar-missing">A sidecar exported, but the player shows nothing</h2>
<p>Find the actual caption file and confirm that its language and timing match this video. Load it explicitly in a compatible player or upload it using the destination's caption-file controls. A separate SRT does not become pixels in an MP4 just because the files share a folder.</p>
<p>If you want a video that always carries the visual treatment, make a separate burned-in version. Keep the clean video and sidecar when the delivery also requires selectable subtitles. The <a href="import-srt-premiere-pro.html">SRT guide</a> covers import, encoding and offsets.</p>
<h2 id="embedded-missing">Embedded captions are absent or unavailable</h2>
<p>The caption format and output container determine which embedded options appear. Check both against the recipient's specification. Then test the output in a player that supports the embedded caption stream and enable captions there.</p>
<p>Do not assume every MP4 export supports the requested broadcast caption format. Adobe documents specific container and caption combinations. For CEA-608, CEA-708 and required channel/service choices, follow the <a href="closed-captions-premiere-pro.html">closed-caption checklist</a>.</p>
<h2 id="graphics-missing">Animated graphics are missing</h2>
<p>Captions Gen output, Type-tool titles and upgraded captions live on video tracks. Their visibility depends on the graphic clip, its layers and the video track. Keep them inside the export range and check for an opaque layer above them. The native Captions section does not control those graphics.</p>
<p>If you can see the design in the sequence but not in a short export, check the selected source sequence, range and graphic visibility before changing transcription settings. A new transcript cannot repair a disabled video track.</p>
<h2 id="queue-range">Check queued jobs and the export range</h2>
<p>When using Media Encoder, inspect that queued job's settings and source. Do not assume a previously queued job adopts every later edit. Use a newly queued short sample after changing the sequence or caption options.</p>
<p>Test the opening, a middle section and the ending of the final delivery. Verify the intended language track, visible text and sidecar separately. A successful short test narrows the problem; it does not certify every later caption or another output preset.</p>
<h2 id="still-images">Export Frame is a separate case</h2>
<p>A still image exported from the Program Monitor is different from exporting the sequence video. Adobe lists a caption-in-Export-Frame issue for Premiere 25.6.1 and gives upgrading the affected caption to a graphic as a workaround. Do not treat that version-specific still-image note as the diagnosis for all missing video captions. Preserve native captions before any conversion.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">caption export options</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html">supported caption containers</a>, <a href="https://helpx.adobe.com/premiere/desktop/troubleshooting/limitations-and-known-issues/known-and-fixed-issues.html">version-specific Export Frame issue</a>, and <a href="/product.html">plugin output limits</a>.</p>
""")

P["premiere-pro-captions-language"] = dict(
modified='2026-11-09',
title="Premiere Pro Captions Language: Set, Change and Auto-Detect",
desc="Choose the spoken language in Premiere, download its transcription pack, fix wrong-language captions and distinguish local recognition from cloud translation.",
h1="Setting the caption language in Premiere Pro",
rel=["auto-captions-premiere-pro","premiere-pro-speech-to-text-not-working","how-to-add-captions-in-premiere-pro"],
body="""
<p><strong>Choose the language actually spoken in the audio before transcription.</strong> In Premiere, check Media Analysis &amp; Transcription preferences and the language used for the transcript. If you need subtitles in another language, transcribe and review the speech first, then use a separate translation workflow.</p>
<h2 id="language-or-translation">Decide whether you need recognition or translation</h2>
<p>An English recording with French subtitles involves two jobs. Recognition finds the English words and timing. Translation changes their language. Choosing French as the spoken language for the English audio does not replace that second job and can make recognition worse.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-language.svg" width="960" height="1000" loading="lazy" alt="Identify the spoken language, create and review its transcript, then translate a separate caption track if needed"/><figcaption>Workflow illustration. Spoken language and subtitle language can be different. <a href="/img/guides/native-caption-language.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="set-language">Set the spoken language in Premiere</h2>
<ol>
<li>Open Window &gt; Text and check whether you are working with the intended source clip or sequence transcript.</li>
<li>Review Media Analysis &amp; Transcription preferences. Enable language auto-detection for detection, or disable it when you need to choose a known spoken language manually.</li>
<li>In the transcript creation options, select the appropriate language and dialogue source. For a sequence static transcript, Adobe also provides an In-to-Out transcription option for a short test.</li>
<li>Transcribe the sample and check actual words, not just the presence of a completed transcript. Correct the setting before processing the rest.</li>
</ol>
<p>With auto-detection enabled, Adobe describes Default language as a locale/fallback setting when detection cannot determine the language. That is different from forcing every imported clip to use that language.</p>
<h2 id="language-pack">Install the required language pack</h2>
<p>In Text &gt; Transcript &gt; Create transcript, open Language and use the download icon for a missing pack. Adobe includes English with Premiere; additional packs can be installed as needed. Wait until the download is complete, then retry the sample.</p>
<p>Premiere's Speech to Text uses its downloaded language packs for local transcription. A missing pack and poor recognition from noisy speech are separate problems. For a download or stalled transcript, use the <a href="premiere-pro-speech-to-text-not-working.html">transcription troubleshooting guide</a>.</p>
<h2 id="wrong-language">If a transcript used the wrong language</h2>
<p>Save a project copy before replacing text that someone has already corrected. Identify the affected source or sequence, correct the spoken-language setting, then create a new transcript as appropriate. Create a new caption track from the checked result and compare it with the existing track before discarding edits.</p>
<p>Check proper names and numbers manually. A correctly chosen language does not guarantee correct spelling, punctuation or speaker identification. If imported subtitles are in the wrong language, obtain the correct file or translate the captions; changing a font will not translate them.</p>
<h2 id="mixed-language">If two languages appear in one edit</h2>
<p>Test separate passages with their known languages. A multilingual model does not guarantee that brief code-switching is recognized correctly. For a clean language change between sections, transcribing those sections separately can make review easier. Keep resulting tracks and versions clearly named.</p>
<p>Use the <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/languages-supported-by-speech-to-text.html">current Adobe language list</a> rather than assuming that every language supported by another model is available in Premiere's engine.</p>
<h2 id="translate-captions">Translate a reviewed caption track</h2>
<p>Current Premiere versions provide Translate captions from the Captions tab. Choose the target language and review the new track. Adobe states that this uses cloud services and third-party translation models. Check client requirements before sending caption text to that workflow.</p>
<p>Check the new translation for meaning, reading length, names and timing. Preview the intended language track rather than accidentally enabling two translations over each other. Deliver each required subtitle language with its matching file and label.</p>
<h2 id="captions-gen-language">Language selection in Captions Gen</h2>
<p>Captions Gen 1.1.9 has a searchable spoken-language selector, Auto-detect and compatible custom speech models. Both Adobe panels use its shared local CPU engine and Models folder. Its language coverage depends on the selected model; the public plugin does not translate speech.</p>
<p>The resulting animated graphics are separate from Premiere's native caption tracks. Check <a href="/product.html">current product limits</a> before changing workflow. For its composition panel, use the <a href="how-to-add-captions-in-after-effects.html">After Effects guide</a>.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/get-started/preferences-and-settings/transcription-preferences.html">transcription preferences</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/download-language-packs-from-within-premiere.html">language-pack downloads</a>, and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/translate-captions.html">cloud caption translation</a>.</p>
""")

P["highlight-words-in-captions-premiere-pro"] = dict(
modified='2026-11-09',
title="How to Highlight Words in Captions in Premiere Pro",
desc="Make a karaoke-style moving word highlight in Premiere Pro with timed graphics, or generate it with Captions Gen. Manual steps, edit checks and output limits.",
h1="How to highlight words in captions in Premiere Pro",
rel=["word-by-word-captions-premiere-pro","animated-captions-premiere-pro","premiere-pro-captions-to-graphics"],
body="""
<p><strong>To highlight the word being spoken while a whole phrase stays visible, use timed graphics.</strong> You can build a sequence of highlighted states manually or generate word-timed graphics with a plugin. Premiere's native Single Word layout is a different look: it shows one word at a time.</p>
<h2 id="choose-highlight">Choose the effect before building it</h2>
<p>A permanently yellow keyword, one word on screen, and a highlight moving through a sentence require different timing. A native Track Style keeps a caption's appearance consistent; it does not automatically move a colored word through the line as the voice changes.</p>
<p>For a static emphasis, select the relevant text and change its appearance. For one word at a time, use the <a href="word-by-word-captions-premiere-pro.html">Single Word workflow</a>. The rest of this guide covers a multi-word phrase with an active spoken word.</p>
<figure class="caption-example"><img src="/img/guides/native-word-highlight.svg" width="960" height="1000" loading="lazy" alt="The same phrase stays visible across three timed states while its active highlighted word moves with speech"/><figcaption>Timing illustration. The sample states explain a moving highlight; they are not Premiere screenshots or measured audio alignment. <a href="/img/guides/native-word-highlight.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="manual-highlight">Build a short moving highlight manually</h2>
<ol>
<li>Create and proofread the native captions. Save a duplicate sequence if you will also deliver SRT or closed captions.</li>
<li>Select the phrase you want to animate and choose Graphics and Titles &gt; Upgrade Caption to Graphic. See the <a href="premiere-pro-captions-to-graphics.html">conversion guide</a> for the full preparation.</li>
<li>Work on a short phrase first. In the graphic's text controls, select its first spoken word and change its fill color while leaving the other words readable.</li>
<li>Locate the next word's onset by listening and scrubbing. Split the graphic there, then edit the next piece so the previous word returns to its normal appearance and the new word is highlighted.</li>
<li>Repeat for the phrase. Keep the base font, position and line breaks consistent so the phrase does not jump between states.</li>
<li>Play with sound at normal speed, then inspect the word changes frame by frame where they look early or late.</li>
</ol>
<p>This method creates a timed state for each word. A cut in the audio, a different reading or newly inserted words can require retiming those states. Adding a colored box introduces another layer to position and animate; it is not supplied automatically by the conversion command.</p>
<h2 id="plugin-highlight">Generate word highlights with Captions Gen</h2>
<p>I make Captions Gen. Its current 1.1.9 Windows release transcribes selected speech locally on the CPU and places editable Motion Graphics clips in Premiere. It offers color swaps, active-word size changes and pill backgrounds through its own designs.</p>
<ol>
<li>Install the supported panel using the <a href="free-caption-plugin-premiere-pro.html">setup guide</a>, then wait until the chosen speech model is ready.</li>
<li>Select a suitable speech clip, choose a preset and adjust its design in Customize. Use the preview to check readability.</li>
<li>Generate captions and review names, numbers, phrase breaks and highlight timing against the source audio.</li>
<li>Use Apply style for changes to the generated batch's appearance. After changing words, use Update animation where offered and review timing again.</li>
</ol>
<p>Automatic transcription still needs review. Available timing can be retained after an edit, and added words can be aligned to source audio where possible. Estimated timing is not proof that the highlighted word matches the voice.</p>
<h2 id="highlight-problems">Fix distracting highlight behavior</h2>
<p>If the highlight is early throughout, compare it with the actual audio and check for a constant offset. If it changes after an edit, review the affected section rather than moving every caption. The <a href="fix-caption-timing-premiere-pro.html">timing guide</a> separates those cases.</p>
<p>If the line moves when a word grows, reduce the active-word size change or use color alone. If the phrase is too dense, shorten the grouping and test another line break. A highlight should leave the rest of the phrase readable, including over a bright shot.</p>
<h2 id="highlight-delivery">Export and retain subtitle delivery</h2>
<p>These graphics render into the picture through video tracks. Keep their tracks enabled and test a short export. Keep a separate native caption track or sequence when SRT, selectable subtitles or broadcast captions are required.</p>
<p>Captions Gen is currently free without a watermark or transcription time cap on supported Windows systems. Premiere Pro is separate and paid, and the plugin has no public Mac installer or translation feature. The <a href="how-to-add-captions-in-after-effects.html">After Effects panel</a> creates caption layers in a composition rather than using this Premiere graphic-splitting workflow.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">native Single Word layout</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-images-and-graphics/animate-layers-using-the-effect-controls-panel.html">graphics animation controls</a>, and <a href="/product.html">Captions Gen features and limits</a>.</p>
""")

P["closed-captions-premiere-pro"] = dict(
modified='2026-11-09',
title="Closed Captions in Premiere Pro: 608, 708 and Broadcast",
desc="Prepare CEA-608 or CEA-708 captions in Premiere Pro from a delivery brief, choose compatible sidecar or embedded output and verify the exported stream.",
h1="Closed captions in Premiere Pro",
rel=["subtitles-vs-captions-premiere-pro","premiere-pro-captions-not-exporting","how-to-add-captions-in-premiere-pro"],
body="""
<p><strong>For closed-caption delivery in Premiere Pro, choose the recipient's required caption format and export method.</strong> CEA-608, CEA-708, an SRT sidecar and visible burned-in text are not interchangeable specifications. Ask for the required format, channel or service, and output container before creating the delivery track.</p>
<h2 id="delivery-brief">Get the delivery details first</h2>
<p>Record the exact picture version, frame rate, start timecode, caption language and required file type. Confirm whether the recipient wants an embedded caption stream, a separate caption file, a visible-text review copy or several of these.</p>
<p>CEA-608 is an older caption standard and CEA-708 provides digital caption services. That distinction does not tell you which one a particular broadcaster accepts. Follow the supplied specification rather than choosing whichever export option appears first.</p>
<figure class="caption-example"><img src="/img/guides/native-closed-caption-delivery.svg" width="960" height="1000" loading="lazy" alt="A broadcast delivery brief determines caption format, stream and container, followed by a supported export and receiver-side verification"/><figcaption>Delivery illustration. The recipient's specification controls the settings; this is not an approval or compliance certificate. <a href="/img/guides/native-closed-caption-delivery.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="create-closed-track">Create and review the caption track</h2>
<ol>
<li>Open the final matching sequence and save a working copy.</li>
<li>Create a reviewed transcript or import the supplied compatible caption file. Correct names and other transcription errors before making the delivery version.</li>
<li>In Create captions, choose the specified Format and relevant stream options. Check the settings against the brief before creating the track.</li>
<li>Review text, timing, speaker identification and meaningful sound descriptions required by the programme. Automatic recognition of speech alone does not complete that editorial work.</li>
<li>Check that the intended caption track is active. Keep alternate language or review tracks identifiable.</li>
</ol>
<p>Format restrictions affect available styling and characters. Test the actual delivery format rather than designing a freely styled Subtitle track and assuming every property will survive conversion. The <a href="subtitles-vs-captions-premiere-pro.html">subtitle and caption-format guide</a> explains that distinction.</p>
<h2 id="sidecar-format">Choose a supported sidecar</h2>
<p>Adobe documents different supported tracks for different export extensions. SCC supports CEA-608 tracks. MCC supports CEA-608 and CEA-708. XML and STL have their own supported track combinations. Check the exact required extension and track, not just the existence of a sidecar file.</p>
<p>If the requested option is missing, inspect both the caption-track format and export settings. Renaming an SRT file to SCC or MCC does not convert its contents. Return to the correct format or obtain the required file through an appropriate caption workflow.</p>
<h2 id="embedded-stream">Choose supported embedded output</h2>
<p>Embedded captions require a compatible caption format and container. Adobe lists MOV and specified MXF containers among its supported embedding/decoding formats. This does not mean every codec and preset in those containers meets every delivery specification.</p>
<p>Open Export and inspect the available caption tracks and embedded options. Keep the specified channel/service selected and check other required picture and audio settings separately. Use a short sample to confirm the receiving workflow can read the stream.</p>
<h2 id="verify-delivery">Verify the exported deliverable</h2>
<p>Watch the actual exported video in a player that supports the delivered caption format, with captions enabled. Load sidecars explicitly when needed. Check the beginning, several speaker changes, pauses and the ending against the final edit.</p>
<p>For a formal handoff, obtain the recipient's confirmation or required quality-control result. Seeing words in Premiere's Program Monitor only confirms the preview. It does not establish that the exported stream is present or accepted.</p>
<h2 id="burn-in-review">Keep a visible-text review copy separate</h2>
<p>Burn-in makes captions part of the picture and can help a reviewer see the wording. It cannot replace a required selectable stream or sidecar. Label a review copy clearly so it is not mistaken for the final embedded-caption master.</p>
<p>If captions are missing from a file, use the <a href="premiere-pro-captions-not-exporting.html">export troubleshooting guide</a>. If timing is wrong in both preview and export, correct the caption track before generating another delivery.</p>
<h2 id="graphics-limit">Animated graphics are another output</h2>
<p>Captions Gen 1.1.9 creates animated Premiere graphics or After Effects layers. It does not generate a native broadcast caption stream or SRT sidecar. Keep the required native caption workflow alongside the animated version, and copy later wording corrections into each deliverable.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html">caption creation settings</a>, <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">track-specific sidecar and embedded options</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html">supported containers</a>, and <a href="/product.html">Captions Gen output limits</a>.</p>
""")

P["how-to-add-text-in-premiere-pro"] = dict(
modified='2026-11-09',
title="How to Add Text in Premiere Pro (Titles and Lower Thirds)",
desc="Add titles and lower thirds with the Premiere Pro Type tool, style them in Properties, animate a simple fade and fix missing or covered text.",
h1="How to add text in Premiere Pro",
rel=["how-to-add-captions-in-premiere-pro","best-fonts-for-captions","premiere-pro-captions-to-graphics"],
body="""
<p><strong>Select the Type tool, click in Premiere Pro's Program Monitor and type your title.</strong> The result is a graphic in the sequence. Select it to adjust text and appearance in Properties, then set its duration on the timeline. For speech subtitles or SRT delivery, use a native caption track instead.</p>
<h2 id="title-or-caption">Choose a title, subtitle or animated speech graphic</h2>
<p>A name label, lower third or chapter heading can be a text graphic without transcription. Dialogue that needs selectable subtitles belongs in a caption workflow. A designed, animated speech treatment can use graphics, but the delivered picture alone does not supply a subtitle file.</p>
<p>Knowing which you need prevents a long edit full of manually typed titles when a <a href="how-to-add-captions-in-premiere-pro.html">transcript-to-caption workflow</a> would be more suitable.</p>
<figure class="caption-example"><img src="/img/guides/native-title-workflow.svg" width="960" height="1000" loading="lazy" alt="Create title text in the Program Monitor, style the selected graphic, then set its timing and review the export"/><figcaption>Title workflow illustration. The graphic is a designed example, not an Adobe interface capture. <a href="/img/guides/native-title-workflow.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="create-title">Create the text graphic</h2>
<ol>
<li>Open the intended sequence and place the playhead near the title's start.</li>
<li>Select the Type tool from the toolbar. With the standard keyboard layout, T is its shortcut; custom shortcuts can differ.</li>
<li>Click in the Program Monitor and enter the wording. Check spelling before duplicating the title across several shots.</li>
<li>Select the graphic on the timeline and inspect its start and end. Drag its edges to cover the required part of the edit.</li>
<li>Preview the title with the underlying footage and audio, rather than judging only the text in isolation.</li>
</ol>
<p>Adobe's current instructions use the Properties panel. If an older tutorial sends you to Essential Graphics for editing text, look for the equivalent text and appearance controls in Properties in your installed version.</p>
<h2 id="style-title">Style a title or lower third</h2>
<p>With the intended text layer selected, choose its font, weight, size and fill. Add a stroke or background when the footage makes the words hard to see. Check the longest name or line you expect to use, including accented characters.</p>
<p>Use alignment controls for deliberate placement and leave room for the destination's player interface. A lower third should not cover an important face, demonstration or existing subtitle. For a vertical crop, review the graphic after reframing.</p>
<p>To reuse a design, save an appropriate text style or duplicate a correctly prepared title and replace its wording. For native subtitles, the corresponding reuse mechanism is a <a href="premiere-pro-caption-presets.html">Track Style</a>; the two jobs should remain identifiable.</p>
<h2 id="animate-title">Animate a simple fade</h2>
<p>Start with a short title before building a complex animation. Select the graphic, open Effect Controls and locate the opacity property for the item or layer you intend to animate. Set the playhead at the desired start and enable its stopwatch.</p>
<p>Set opacity to zero at the first keyframe, move forward and set it to full visibility. Preview the change, then add an exit later if needed. Check which level you animated: changing a whole graphic can affect every layer inside it. Use the relevant layer controls when only one part should move.</p>
<p>For position or scale animation, use the same keyframe process and review the complete title at normal speed. Adobe also provides keyframe interpolation controls. A fast entrance should still leave enough time to read the words.</p>
<h2 id="text-problems">If the text is missing or uneditable</h2>
<p>Confirm that the playhead is inside the graphic's duration and its video track is enabled. Check for an opaque clip above it, off-frame placement, zero opacity or an unexpected animation keyframe.</p>
<p>If typing creates another title, select the intended graphic and text layer before editing. If a font is substituted, install or activate the required family and weight, then check line breaks again. See the <a href="change-caption-font-premiere-pro.html">font troubleshooting guide</a> for related checks.</p>
<h2 id="speech-text">For text that follows speech</h2>
<p>Premiere's native Single Word layout can show a timed word at a time. For a moving highlight across a phrase, use timed graphics or a plugin such as Captions Gen. The current Windows plugin transcribes locally on the CPU and creates editable graphics; it does not convert those graphics into a native subtitle file.</p>
<p>For a composition-based version, follow the <a href="how-to-add-captions-in-after-effects.html">After Effects caption guide</a>. For either app, render a short final-size sample and check the actual file before applying the design throughout the project.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/create-titles.html">Type tool title workflow</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-images-and-graphics/animate-layers-using-the-effect-controls-panel.html">Effect Controls animation</a>, and <a href="/product.html">Captions Gen product facts</a>.</p>
""")

P["free-caption-plugin-premiere-pro"] = dict(
modified='2026-11-09',
title="Free Caption Plugin for Premiere Pro: Auto Captions, No Watermark",
desc="Yes: Captions Gen is currently free for Premiere Pro 25.6+ on Windows. Check no-watermark limits, local transcription, email download and setup steps.",
h1="Free caption plugins for Premiere Pro",
rel=["best-caption-plugin-premiere-pro","free-caption-templates-premiere-pro","hormozi-style-captions-premiere-pro"],
faq=[('Is there a free animated caption plugin for Premiere Pro?', 'Yes. Captions Gen is currently free for Premiere Pro 25.6 or newer on 64-bit Windows supported by your Premiere version. It creates editable animated captions with local transcription, no watermark and no transcription time cap. Adobe Premiere Pro is a separate paid subscription.'), ('Is Captions Gen a 15-minute trial?', 'No. The 15-minute limit was removed in <a href="/news/captions-gen-1-1-0.html">version 1.1.0 on 21 October 2026</a>. The current release has no transcription time cap, watermark or subscription. Paid features are planned for the future.'), ('Do I need a card to download Captions Gen?', 'No. The current free download uses Lemon Squeezy checkout and asks for your email address, without a payment card. See <a href="/product.html">current product facts and download details</a>.'), ('Does Captions Gen upload my footage for transcription?', 'No. Transcription processes your audio locally on your CPU. Initial speech-model downloads and update checks use the internet. Local transcription does not mean the plugin makes no network requests.'), ('Does Captions Gen work on Mac or older Premiere versions?', "The current public release supports Windows and Premiere Pro 25.6 or newer. Mac and Premiere versions before 25.6 are not supported. Your computer must also meet Adobe's requirements for its installed Premiere version."), ('Does the free release also support After Effects?', 'Yes. The <a href="/news/captions-gen-1-1-9.html">1.1.9 Windows setup</a> offers Premiere Pro, After Effects, or Both. The panel has been tested with After Effects 2026 on Windows 11; earlier After Effects versions are not certified. Both panels share the engine and Models folder.'), ('Can Captions Gen export SRT or translate captions?', "The public release creates editable animated graphics. It does not provide native subtitle-track conversion or translation. Use Premiere's native caption workflow when you need an SRT sidecar or selectable captions.")],
body="""
<p><strong>Yes. <a href="/product.html">Captions Gen</a> is currently a free animated caption plugin for Adobe Premiere Pro 25.6 or newer on Windows, with no watermark and no transcription time cap.</strong> It uses local CPU transcription and places editable, word-timed Motion Graphics clips on your timeline. Download uses an email checkout without a payment card. Adobe Premiere Pro is a separate paid application.</p>
<p>I make Captions Gen. These facts describe <a href="/news/captions-gen-1-1-9.html">public version 1.1.9</a>, checked on 9 November 2026. Paid features are planned for the future; the current offer is not a promise that every future feature will remain free.</p>
<h2 id="free-options">Choose a free workflow by output</h2>
<p>Premiere's built-in Speech to Text is included with a paid Premiere plan and can make native caption tracks. Current versions offer Track Styles and a Single Word layout. That is the starting point when you need native subtitles, SRT or specified closed-caption delivery.</p>
<p>Captions Gen is the graphics route for a moving highlight, pill background or animated caption design. Its 18 built-in presets and saved custom designs do not turn into a native subtitle track. Use the <a href="best-caption-plugin-premiere-pro.html">ten-option comparison</a> if you also want to compare other plugins, trials and paid plans.</p>
<h2 id="free-plugin-shortlist">Three free plugins, different outputs</h2>
<p>Cueline, Sylba and Captions Gen all document a free caption workflow. Choose by the output and computer you use. I make Captions Gen; this is a comparison of published capabilities, not a hands-on accuracy or speed ranking.</p>
<table class="spec"><thead><tr><th>Plugin</th><th>Documented free workflow</th><th>Compatibility and download</th></tr></thead><tbody>
<tr><td><a href="https://conformlabs.co/cueline/">Cueline Captions</a></td><td>Local transcription to native Premiere caption tracks; free and MIT open source</td><td>Premiere 2022+; macOS and Windows; direct GitHub installers</td></tr>
<tr><td><a href="https://sylba.app/en/premiere-pro-auto-captions/">Sylba</a></td><td>Free Captions section with animated graphics and SRT; no time cap or watermark; other sections have an optional Pro plan</td><td>Premiere 2022+; macOS and Windows; free sections require sign-in</td></tr>
<tr><td><a href="/product.html">Captions Gen</a></td><td>Local CPU transcription to editable animated graphics; currently no time cap or watermark</td><td>Premiere 25.6+ on supported Windows; email checkout, no card; no public Mac installer</td></tr>
</tbody></table>
<p>For native subtitle tracks, compare Cueline with Premiere's included tools. For animated captions on a Mac, check Sylba's current installer and terms. For Windows editors who also need composition layers, Captions Gen's same free setup includes an <a href="/after-effects.html">After Effects captions panel</a>. The Cueline and Sylba caption pages linked here describe Premiere workflows; they do not establish After Effects caption support.</p>
<p class="sources">Competitor documentation checked 9 November 2026: <a href="https://conformlabs.co/cueline/">Cueline output, platforms and MIT licence</a>; <a href="https://sylba.app/en/premiere-pro-auto-captions/">Sylba captions, free limits and SRT</a>; <a href="https://sylba.app/en/">Sylba sign-in and Free/Pro sections</a>. Check those sources before installing; published capabilities are not test results.</p>
<figure class="caption-example"><img src="/img/guides/native-free-plugin-setup.svg" width="960" height="1000" loading="lazy" alt="Check supported Windows and Premiere versions, download the free setup by email, then wait for the model and generate a reviewed sample"/><figcaption>Setup illustration for the current Windows release. It is not an installer screenshot. <a href="/img/guides/native-free-plugin-setup.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="free-limits">The old 15-minute limit has been removed</h2>
<p>The previous 15-minute trial cap ended with <a href="/news/captions-gen-1-1-0.html">version 1.1.0 on 21 October 2026</a>. The current release has no transcription time cap, watermark or subscription. An older installed panel or an old description can still refer to the previous limit; use the current product and release pages for the public offer.</p>
<p>No time cap does not mean instantaneous processing. Speed depends on the CPU, chosen model, memory and audio length. Generated graphics also add work during playback and export.</p>
<h2 id="check-compatibility">Check compatibility and model storage</h2>
<p>Premiere requires 25.6 or newer on supported 64-bit Windows 10 or 11. Meet Adobe's requirements for the installed Premiere version, with memory available for the speech model. Older Premiere versions and a public Mac installer are not supported by this release.</p>
<p>Transcription runs on the CPU without GPU acceleration. A dedicated GPU is not required for transcription itself, but Premiere's own graphics requirements still apply. Base is the lightest built-in model, Small offers another balance, and Turbo is the default and largest built-in choice.</p>
<p>Allow at least 3 GB free for built-in models, plus space for the plugin, Adobe apps and projects. Missing models download and are cached for reuse. Internet is used for those downloads and update checks; audio and video are not uploaded for transcription.</p>
<h2 id="install-premiere">Install the Premiere panel</h2>
<ol>
<li><a href="__FREE__">Open the free download checkout</a> and enter an email address for the download link. No payment card is required.</li>
<li>Save your projects and close the Adobe apps. Run the current full Windows setup and choose Premiere Pro, or Both if you also need After Effects.</li>
<li>Keep Creative Cloud Desktop installed and complete the required Adobe installation prompts. Setup installs the selected panels, shared engine and bundled preset fonts.</li>
<li>Reopen Premiere and choose Window &gt; UXP Plugins &gt; Captions Gen.</li>
<li>Wait for the selected speech model to show ready before generating. A panel being open does not mean its model download is complete.</li>
</ol>
<p>The Windows EXE remains Authenticode-unsigned. Signing of the separate Adobe CEP package does not resolve a Windows Smart App Control block. If setup is blocked, contact <a href="mailto:business@captionsgen.com">support</a>; do not disable protection just to run the download.</p>
<h2 id="first-captions">Generate and inspect a short sample</h2>
<p>Select a suitable timeline speech clip, choose a preset and use Customize to adjust its design. Generate Captions, then check spelling, names, numbers and highlights against the audio. Review a short exported sample before processing a long edit.</p>
<p>Use Apply style to change the generated batch's appearance. After changing caption words, use Update animation where offered and review timing again. Available timing can be retained, while new words may need alignment or estimated timing.</p>
<p>The <a href="/#custom">browser caption designer</a> lets you explore prepared sample text and designs. It does not transcribe files or place graphics into an Adobe project.</p>
<h2 id="after-effects-free">The same free setup also offers After Effects</h2>
<p>The 1.1.9 installer offers Premiere Pro, After Effects or Both. Both panels share the speech engine and Models folder. After Effects receives native editable caption layers and has been tested with After Effects 2026 on Windows 11; earlier versions are not certified for this release.</p>
<p>See the <a href="/after-effects.html">free After Effects captions plugin and output examples</a> before choosing it. After Effects uses Window &gt; Extensions &gt; Captions Gen. Follow the <a href="how-to-add-captions-in-after-effects.html">After Effects setup and first-caption guide</a> for supported source layers and composition-specific steps.</p>
<h2 id="free-output-limit">Keep subtitle delivery separate</h2>
<p>The plugin does not import SRT, convert native subtitle tracks, translate speech or add automatic B-roll in this public release. If the client needs selectable subtitles or a caption file, keep the <a href="how-to-add-captions-in-premiere-pro.html">native Premiere caption workflow</a> alongside the animated picture.</p>
<p class="sources">Product sources checked 9 November 2026: <a href="/product.html">current facts and compatibility</a>, <a href="/news/captions-gen-1-1-0.html">removal of the trial cap</a>, <a href="/news/captions-gen-1-1-9.html">1.1.9 public release</a>, and <a href="https://www.adobe.com/products/premiere/speech-to-text.html">Adobe's native Speech to Text</a>.</p>
""")


P["best-caption-plugin-premiere-pro"] = dict(
modified='2026-11-09',
title='Best Caption Plugins for Premiere Pro (2026): 10 Compared',
desc="Compare ten Premiere caption options by output, platform, free limits and billing, including Cueline, Sylba and Captions Gen. Vendor facts checked 9 November 2026.",
h1="Best caption plugins for Premiere Pro in 2026, compared",
rel=["free-caption-plugin-premiere-pro","animated-captions-premiere-pro","capcut-vs-premiere-pro-captions"],
body="""
<p><strong>For currently free animated captions on Windows, Captions Gen is a suitable starting point. For native subtitles or SRT, start with Premiere's built-in caption tracks.</strong> For a Mac or a broader editing suite, compare the other tools below against the output and revision workflow you actually need.</p>
<p>I make Captions Gen. This compares nine plugins and Premiere's native captions using vendor documentation checked 9 November 2026. I have not run a controlled accuracy or speed benchmark across them. Published features, pricing and trial terms are not proof that one engine will recognize your footage better.</p>
<h2 id="choose-output">Choose the output before the subscription</h2>
<p>A native caption track, editable title/MOGRT and rendered PNG animation support different correction steps. If a client changes a name after delivery, check whether you edit the timeline text, reopen the plugin's transcript or regenerate rendered media.</p>
<figure class="caption-example"><img src="/img/guides/comparison-caption-tool-choice.svg" width="960" height="1000" loading="lazy" alt="Choose native subtitle delivery, editable animated graphics or rendered caption media, then compare platform support, processing and billing"/><figcaption>Decision illustration, not a performance ranking. Test the output and correction workflow with your own short sample. <a href="/img/guides/comparison-caption-tool-choice.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="compare">Ten caption options compared</h2>
<p>Quoted amounts below are vendor-listed US dollar prices before applicable tax, checked on the stated date. Annual monthly equivalents require annual billing. Where a current amount or mode is unclear, follow the source rather than treating a missing figure as free.</p>
<div class="ptable-wrap"><table class="ptable">
<thead><tr><th>Tool</th><th>Output or workflow</th><th>Price and free entry</th><th>Important check</th></tr></thead><tbody>
<tr class="pick"><td>Captions Gen<br>Made by me</td><td>Editable Premiere Motion Graphics; local CPU transcription</td><td>Currently free; email checkout without a card</td><td>Windows, Premiere 25.6+; no native SRT conversion or public Mac installer</td></tr>
<tr><td>Premiere Pro built-in</td><td>Native caption track, Track Styles and Single Word layout</td><td>Included with paid Premiere</td><td>Use supported sidecar/embedded options when delivery requires them</td></tr>
<tr><td>Cueline Captions</td><td>Native Premiere caption tracks; local whisper.cpp transcription</td><td>Free and MIT open source</td><td>Premiere 2022+ on macOS/Windows; choose it for subtitle tracks rather than assuming an animated-graphics output</td></tr>
<tr><td>Sylba</td><td>Animated graphics, SRT or Dynamic Text; local transcription</td><td>Captions section: no time cap or watermark; free sign-in; optional Pro for other sections</td><td>Premiere 2022+ on macOS/Windows; check the Free/Pro split for other editing features</td></tr>
<tr><td>Caption Plug</td><td>Animated PNG-sequence output, plus a separate native caption-track mode; local Whisper with optional cloud APIs</td><td>$14.99 one-time; 14-day refund policy</td><td>Windows/Mac downloads; refund requires a purchase and is not a free trial</td></tr>
<tr><td>Premiere Assistant by Cutback</td><td>Caption/editing suite with transcription, caption editing and animation features</td><td>Free Starter lists three transcriptions/month; paid tiers have different allowances</td><td>Check project length, feature limits and current billing on the pricing page</td></tr>
<tr><td>PremiereCopilot</td><td>In-Premiere animated captions; vendor docs describe both title clips and PNG clips</td><td>Free Smart Captions: two runs/day; paid tiers available</td><td>Verify the current output mode and text-correction workflow in a short test</td></tr>
<tr><td>SubMachine</td><td>MOGRT-based caption workflow</td><td>$8/month, $80/year or $150 perpetual</td><td>Check supported Premiere/OS versions and the transcript/template workflow</td></tr>
<tr><td>AutoCut AI plan</td><td>AutoCaptions within a wider editing suite; Advanced Mode beta adds design controls in Premiere</td><td>$14.90/month equivalent, $178.80 billed yearly; 14-day trial</td><td>Basic does not include AutoCaptions; check current trial and plan conditions</td></tr>
<tr><td>FireCut Pro</td><td>Caption PNGs edited through the plugin's caption workflow</td><td>$20/month equivalent billed yearly; 7-day trial</td><td>Pro lists 25 transcription hours/month; verify metered features and current plan</td></tr>
</tbody></table></div>
<p>Scroll the table sideways for every column. A daily free allowance, an expiring trial, a refund after purchase and a currently free release are different offers. Compare the actual checkout, renewal and cancellation terms before buying.</p>
<p class="sources">Free-plugin sources checked 9 November 2026: <a href="https://conformlabs.co/cueline/">Cueline caption tracks, free MIT release and compatibility</a>; <a href="https://sylba.app/en/premiere-pro-auto-captions/">Sylba caption output and free limits</a>; <a href="https://sylba.app/en/">Sylba sign-in and optional Pro sections</a>. These are vendor descriptions, not independent test results.</p>
<h2 id="which">Which one should you shortlist?</h2>
<ul>
<li>For a native caption file or selectable subtitles, test Premiere's built-in workflow first. You may not need an animation plugin.</li>
<li>For animated graphics on supported Windows without a current plugin subscription, try a short <a href="free-caption-plugin-premiere-pro.html">Captions Gen sample</a>.</li>
<li>For a free Mac workflow, compare Cueline's native caption tracks with Sylba's animated captions and SRT. Verify the supported OS and Premiere version before installation. Captions Gen currently has no public Mac installer.</li>
<li>If you already use AutoCut, FireCut or Premiere Assistant for other editing jobs, test its included caption route before adding another subscription.</li>
<li>For MOGRT-oriented editing, inspect SubMachine's templates and their text controls. A one-time license and a monthly subscription have different handoff and update considerations.</li>
</ul>
<h2 id="test">Run a useful trial on your own dialogue</h2>
<ol>
<li>Use the same short clip, language and final frame size in each candidate.</li>
<li>Count and correct actual transcript errors, including names and numbers. Keep these observations specific to the sample.</li>
<li>Change one name, insert a word and restyle the result. Check how each correction affects timing and rendered output.</li>
<li>Save, reopen and export a short final-size sample. Confirm the expected captions are present in the actual file.</li>
<li>Record the chosen mode, model, settings and machine if comparing processing time. Do not generalize a single run into an accuracy or speed claim for all users.</li>
</ol>
<p>Vendor statements about native editing and local processing should be checked for the selected mode. Caption Plug's animated media and its native caption-track mode, for example, are different outputs. FireCut documents returning to its panel to edit PNG captions.</p>
<p>PremiereCopilot's current Smart Captions page describes editable title clips in its introduction but PNG clips and re-rendering elsewhere on the same page. Confirm what the current installed mode creates and how text corrections work; this comparison does not resolve that documentation conflict through a hands-on test.</p>
<h2 id="privacy-billing">Check data processing and billing</h2>
<p>Local recognition processes audio on the computer; server recognition sends required data to the provider. A tool offering both can behave differently by mode. Read the current policy for client footage and check whether a model download, account or cloud API is needed.</p>
<p>Keep the billing term explicit. An annual monthly equivalent is not a monthly cancellable charge. Usage can be shared with other AI features, so a quoted allowance is not automatically that many complete captioned projects.</p>
<h2 id="captions-gen-fit">Captions Gen's scope</h2>
<p>Captions Gen 1.1.9 has 18 built-in designs, saved presets, a preview and Apply style for its generated batch. It currently has no watermark or transcription time cap. Check the speech-model and storage requirements before installing.</p>
<p>One Windows setup offers Premiere Pro 25.6+ and an After Effects panel tested with After Effects 2026 on Windows 11, sharing the engine and Models folder. It does not include translation, native subtitle-track conversion or a public Mac installer. Paid features are planned. Check <a href="/product.html">current product facts</a> and the separate <a href="how-to-add-captions-in-after-effects.html">After Effects guide</a>.</p>
<p class="sources">Vendor sources checked 9 November 2026: <a href="https://www.captionplug.com/">Caption Plug</a>; <a href="https://cutback.video/premiere-assistant/pricing">Premiere Assistant plans</a>; <a href="https://www.premierecopilot.com/en/pricing">PremiereCopilot limits</a> and <a href="https://www.premierecopilot.com/en/smart-captions">output</a>; <a href="https://aescripts.com/submachine/">SubMachine</a>; <a href="https://www.autocut.com/en/pricing/">AutoCut plans</a> and <a href="https://www.autocut.com/en/updates/">Advanced Mode notes</a>; <a href="https://firecut.ai/pricing/premiere-pro/">FireCut plans</a> and <a href="https://learn.firecut.ai/overview-premiere-pro/faq">caption editing/Mac FAQ</a>; <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Adobe Single Word captions</a>.</p>
""")

P["word-by-word-captions-premiere-pro"] = dict(
modified='2026-11-09',
title="Word by Word Captions in Premiere Pro (One Word at a Time)",
desc="Create one-word-at-a-time captions with Premiere Single Word layout, or use timed graphics for karaoke highlights. Setup, timing, styling and export checks.",
h1="Word by word captions in Premiere Pro",
rel=["highlight-words-in-captions-premiere-pro","animated-captions-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro"],
body="""
<p><strong>For one word at a time, choose Layout &gt; Single Word in Premiere Pro's Create Captions dialog.</strong> For a complete phrase with a moving spoken-word highlight, use timed graphics. These looks have different reading behavior and editing requirements.</p>
<h2 id="two-word-looks">Choose which word-by-word look you mean</h2>
<p>Single Word places each word in its own native caption clip. A karaoke-style graphic keeps several words visible and changes the active one. Reducing a phrase's character limit is not the same as choosing Premiere's dedicated Single Word layout.</p>
<figure class="caption-example"><img src="/img/guides/native-single-word-layout.svg" width="960" height="1000" loading="lazy" alt="Single Word displays one word per native caption, while karaoke graphics retain a phrase and highlight its active word"/><figcaption>Concept illustration showing two different word-by-word treatments. <a href="/img/guides/native-single-word-layout.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="native-single-word">Create native Single Word captions</h2>
<ol>
<li>Open the intended sequence and switch to Window &gt; Workspaces &gt; Captions and Graphics if helpful.</li>
<li>In the Text panel, transcribe the sequence if no appropriate transcript exists. Review spelling and names before creating captions.</li>
<li>Open the Captions tab and choose Create captions from transcript.</li>
<li>Expand Captioning Preferences. Under Layout, choose Single Word.</li>
<li>Check the caption format, style and other timing settings, then create the captions.</li>
<li>Play the new caption track with the audio. Inspect fast speech, pauses, names and word boundaries rather than assuming every generated word is correct.</li>
</ol>
<p>These steps follow Adobe's current Single Word instructions. If the option is absent, inspect the layouts supported by your installed version. Do not assume that an older Premiere version has the same dialog just because it can create ordinary captions.</p>
<h2 id="style-single-word">Style and check the result</h2>
<p>Select a caption and adjust it in Properties. Save and apply a <a href="premiere-pro-caption-presets.html">Track Style</a> for consistent appearance. Check both a short word and a long one so the selected font size works across the passage.</p>
<p>Keep a word on screen for its intended speech moment, and inspect awkward gaps or flashes. A phrase-caption duration rule does not necessarily work for individual word clips. If fast dialogue is uncomfortable to read this way, try a short phrase layout instead of enlarging every word further.</p>
<p>After changing the edit or source timing, review the affected captions. A previously aligned word track does not remain correct automatically after an unrelated audio trim or speed change.</p>
<h2 id="karaoke-phrase">Keep a phrase visible with a moving highlight</h2>
<p>For this look, retain the surrounding words while timing each highlight to the voice. You can <a href="premiere-pro-captions-to-graphics.html">upgrade native captions to graphics</a> and build timed states manually, or generate graphics with word timestamps.</p>
<p>Captions Gen 1.1.9 provides the latter workflow on supported Windows systems. Select a suitable speech clip, choose a preset, generate and review the text and timing. It places editable Motion Graphics clips in Premiere and uses local CPU transcription. The <a href="highlight-words-in-captions-premiere-pro.html">highlight guide</a> covers the manual and plugin routes in more detail.</p>
<h2 id="after-word-edit">After editing a word</h2>
<p>For a native caption, correct the text and inspect the clip's timing. If one clip now contains a different number of words, check whether the intended one-word presentation still holds.</p>
<p>For Captions Gen graphics, use Update animation where offered after changing the words, then listen again. Added words may need original-audio alignment or estimated timing. Apply style changes the design; it does not replace checking an edited transcript.</p>
<h2 id="word-delivery">Choose the output before delivery</h2>
<p>Native caption tracks can be exported through supported sidecar or burn-in settings. A single-word SRT contains many short entries; test how the destination displays them. It does not carry a plugin's pill, bounce or animated design.</p>
<p>Graphic animations render into the picture. Keep a separate native track when the job needs selectable subtitles or an SRT file too. Check the <a href="premiere-pro-captions-not-exporting.html">export guide</a> if the preview and delivery differ.</p>
<p>For After Effects, use its <a href="how-to-add-captions-in-after-effects.html">separate panel workflow</a>. The native Premiere Layout option described here is not an After Effects menu step. Captions Gen is currently free without a watermark or transcription time cap; Adobe applications are separate paid products.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word instructions</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">caption appearance controls</a>, and <a href="/product.html">Captions Gen output and limits</a>.</p>
""")

P["captions-for-tiktok-reels-shorts-premiere-pro"] = dict(
modified='2026-11-09',
title="Captions for TikTok, Reels and Shorts in Premiere Pro",
desc="Prepare Premiere captions for vertical video: frame size, interface-safe placement, readable line breaks, word timing and burn-in or subtitle-file delivery.",
h1="Captions for TikTok, Reels and Shorts in Premiere Pro",
rel=["word-by-word-captions-premiere-pro","best-fonts-for-captions","burn-in-captions-premiere-pro"],
body="""
<p><strong>Set the vertical sequence first, then style captions at the size people will actually watch.</strong> A 1080 x 1920 sequence is a common 9:16 starting point. Keep words clear of the destination app's interface, review line breaks and timing, and test an exported sample on a phone.</p>
<p>The destination, frame crop and amount of text matter more than copying one fixed position. TikTok, Reels and Shorts can display different overlays across devices and viewing modes. This guide's placement example is an illustration, not a universal platform safe-zone template.</p>
<h2 id="vertical-sequence">Set the sequence and framing before captions</h2>
<ol>
<li>Choose the delivery aspect ratio and frame size for this version of the edit. Keep a separate sequence when also delivering landscape video.</li>
<li>Reframe the footage and check faces, demonstrations and other visual information. Avoid placing captions over the subject simply because the lower centre is available.</li>
<li>Finish the main cut before creating a large caption batch, then review timing after any later change to the speech.</li>
<li>Check graphics and subtitle placement again if the sequence is resized or cropped after styling.</li>
</ol>
<figure class="caption-example"><img src="/img/guides/native-vertical-safe-area.svg" width="960" height="1000" loading="lazy" alt="Vertical-video planning checks the frame, caption reading area and destination interface before final export"/><figcaption>Placement illustration. Shown clearances are conceptual, not official TikTok, Reels or Shorts measurements. <a href="/img/guides/native-vertical-safe-area.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="vertical-readability">Choose readable text and line breaks</h2>
<p>Use a clear font, sufficient contrast and a line length that fits the frame. For a 1080 x 1920 sample, 55 to 75 pixels and short lines can be starting experiments. They are not platform requirements; font metrics and the actual words change the result.</p>
<p>Preview the longest likely phrase. Break at a natural language boundary rather than isolating a small function word or splitting a name. If the caption covers too much of the video, shorten the phrase or reduce the treatment rather than pushing it into interface controls.</p>
<p>Test the font over the brightest and busiest shots. A restrained stroke or background can help. See the <a href="best-fonts-for-captions.html">font and readability guide</a> for a practical comparison process.</p>
<h2 id="vertical-timing">Choose phrases, single words or a moving highlight</h2>
<p>Native phrase captions work when the viewer benefits from reading ahead. Current Premiere versions also offer Single Word layout. A moving active-word highlight keeps a phrase visible and uses a different graphics workflow.</p>
<p>Play the passage at normal speed with sound, then muted. Check whether the text remains understandable rather than assuming a fast animation improves the edit. Do not use one minimum-duration rule for both full phrases and individual words.</p>
<p>If the recognised text is correct but the timing is wrong, use the <a href="fix-caption-timing-premiere-pro.html">timing checks</a>. If phrase splitting is awkward, revise caption boundaries and review the result with the speech.</p>
<h2 id="vertical-interface">Check placement in the destination app</h2>
<p>Render a short sample containing the intended caption position and upload a private or draft version where the destination permits it. Inspect the actual viewing screen, including controls, title text and any automatically displayed subtitles. Do this on the device or viewing mode that matters for the delivery.</p>
<p>Do not label a generic percentage inset as a guaranteed safe area for every app. Leave room to adjust per platform. If the same video is distributed in several places, prepare platform-specific placement versions when necessary.</p>
<h2 id="vertical-export">Export the intended caption treatment</h2>
<p>Burn native captions into the picture when the design must remain visible in the video. In Export, expand Captions and check the selected track and burn-in option. If delivering an SRT too, export it separately and keep its language and edit version clear.</p>
<p>Type-tool graphics and Captions Gen animations render through video tracks. Their visibility is not controlled by the native Captions export section. Check track output, clip duration and covering layers, then watch the exported file.</p>
<h2 id="vertical-plugin">Animated designs inside the Adobe edit</h2>
<p>Captions Gen 1.1.9 creates word-timed editable graphics in Premiere using local CPU transcription. It has 18 built-in presets, custom styling and Apply style for a generated batch. Review spelling and highlights after generation and text edits.</p>
<p>The public Windows release is currently free without a watermark or transcription time cap. It does not supply SRT conversion or translation. Its <a href="how-to-add-captions-in-after-effects.html">After Effects panel</a> creates composition layers, while native Premiere subtitles remain a separate delivery workflow. See the <a href="free-caption-plugin-premiere-pro.html">setup and compatibility guide</a> before choosing that route.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/edit-projects/intro-to-editing/set-the-aspect-ratio-of-a-sequence.html">sequence aspect-ratio controls</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word captions</a>, <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">caption delivery</a>, and <a href="/product.html">Captions Gen facts</a>.</p>
""")

P["import-srt-premiere-pro"] = dict(
modified='2026-11-09',
title="Import and Export SRT Subtitle Files in Premiere Pro",
desc="Import SRT into Premiere, fix offsets and encoding, then export a matching subtitle file. Learn what transfers and why fonts or animation may not.",
h1="Import and export SRT files in Premiere Pro",
rel=["how-to-add-subtitles-in-premiere-pro","fix-caption-timing-premiere-pro","premiere-pro-captions-not-exporting"],
body="""
<p><strong>Import an SRT with File &gt; Import, then drag the imported item from the Project panel into your sequence.</strong> Premiere creates a native caption track. To deliver SRT, choose the supported sidecar option in Export &gt; Captions and check the intended track and output path.</p>
<h2 id="srt-contains">Know what the SRT contains</h2>
<p>SRT carries numbered subtitle entries with start/end timestamps and text. It is useful for translation handoffs and selectable subtitles. It does not transfer a complete Motion Graphics design, moving pill, bounce animation or a plugin preset.</p>
<p>Basic SRT uses time values rather than an intrinsic video frame-rate setting. A different edit, a source speed change or an incorrect time conversion can still make its timings wrong. Keep the reference video used to create the file.</p>
<figure class="caption-example"><img src="/img/guides/native-srt-roundtrip.svg" width="960" height="1000" loading="lazy" alt="SRT text and timestamps become a native Premiere caption track, then a reviewed sidecar for the matching video"/><figcaption>File-workflow illustration. The subtitle file and final edit must match. <a href="/img/guides/native-srt-roundtrip.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="import-srt">Import and inspect the track</h2>
<ol>
<li>Save the project and open the intended final sequence.</li>
<li>Import the .srt. If it came from email or a downloaded archive, first confirm that you have the actual subtitle file rather than a shortcut or document preview.</li>
<li>Drag the subtitle item from the Project panel into the sequence to create the caption track.</li>
<li>Enable the intended caption track and inspect its first entry against the source audio.</li>
<li>Check a middle passage and the ending before making a global timing correction.</li>
</ol>
<p>Adobe also supports several other caption formats. Use its current list for a specific file type; do not assume that WebVTT, a plain transcript or a word-processing file imports as SRT. Renaming the extension does not convert the content.</p>
<h2 id="srt-timing">Diagnose constant offset versus drift</h2>
<p>If the same words are two seconds late at the beginning, middle and end, a constant shift is a useful candidate. Move the affected captions together and check all three points again.</p>
<p>If the opening matches but the ending becomes progressively late, a global move will not solve the file. Compare the reference cut, start timecode and any speed changes. If the error appears only after a removed shot, repair that section or obtain subtitles for the current edit. The <a href="fix-caption-timing-premiere-pro.html">timing guide</a> covers those patterns.</p>
<h2 id="srt-text">Fix text and encoding problems</h2>
<p>For YouTube, use plain UTF-8 SRT. Check accented characters, punctuation, speaker labels and non-Latin text after import and after upload. A file that looks right in one editor may have been saved with a different encoding.</p>
<p>Inspect suspicious entries in a plain-text editor or subtitle editor: timestamps should be valid, each end should follow its start, and entries need the expected separators. Save a copy before editing a supplied translation. For a short original example, see <a href="how-to-add-subtitles-in-premiere-pro.html">preparing subtitle text manually</a>.</p>
<h2 id="srt-style">Style the imported subtitles</h2>
<p>Select a native caption, open Properties and create or apply a <a href="premiere-pro-caption-presets.html">Track Style</a>. Review wrapping after a font change. Styling in Premiere can help a burned-in picture version, but a receiving SRT player can use its own appearance.</p>
<p>For example, YouTube's documented basic SRT support does not recognize style markup. Do not promise that sending an SRT will reproduce a client's precise font or animation.</p>
<h2 id="export-srt">Export and test the sidecar</h2>
<p>In Export, expand Captions, choose Create Sidecar File and select SRT where supported. Confirm the caption track, destination and filename. If several languages exist, export and label the correct one for each delivery rather than relying on a default selection.</p>
<p>Open the actual resulting file with the matching video or upload it through the destination's subtitle controls. Check several cue points, then retain both video and subtitle versions together. If the MP4 itself must display the words, make a separate <a href="burn-in-captions-premiere-pro.html">burned-in version</a>.</p>
<h2 id="srt-plugin-limit">SRT and Captions Gen</h2>
<p>The current Captions Gen release creates animated graphics from speech; it does not import an SRT or convert native subtitle tracks. Its Premiere graphics and After Effects caption layers render into the picture. Keep a separate native track when the job also needs an editable subtitle sidecar.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html">SRT import steps</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html">supported formats</a>, <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">sidecar export</a>, and <a href="https://support.google.com/youtube/answer/2734698?hl=en">YouTube's UTF-8/basic SRT requirements</a>.</p>
""")

P["premiere-pro-speech-to-text-not-working"] = dict(
modified='2026-11-09',
title="Premiere Pro Speech to Text Not Working? 7 Things to Check",
desc="Check Premiere transcription context, language packs, dialogue source, progress and version-specific issues before replacing captions or clearing media cache.",
h1="Premiere Pro speech to text not working",
rel=["auto-captions-premiere-pro","premiere-pro-captions-language","premiere-pro-captions-not-showing"],
body="""
<p><strong>When Premiere Pro Speech to Text fails, first check the transcript context, language pack and selected audio.</strong> A source-clip transcript, a static sequence transcript and an existing caption track are different items. Diagnose the failed step before deleting captions, replacing a reviewed transcript or switching tools.</p>
<h2 id="context">1. Confirm which transcript you are creating</h2>
<p>Open Window &gt; Text and identify the source clip or sequence you intend to transcribe. If you need a transcript of the sequence audio, Adobe documents Generate static transcript and its audio-analysis options. A source transcript is not automatically proof that the intended sequence mix was analysed.</p>
<p>Words already visible in Transcript are also different from visible caption clips. If recognition succeeded but no text appears in the picture, <a href="how-to-add-captions-in-premiere-pro.html">create captions from that transcript</a> rather than treating it as a transcription failure.</p>
<figure class="caption-example"><img src="/img/guides/native-transcription-diagnosis.svg" width="960" height="1000" loading="lazy" alt="Check transcript context and speech source, then language/model readiness, then isolate a short test before broader troubleshooting"/><figcaption>Diagnostic illustration. Change one condition at a time so a successful test is useful. <a href="/img/guides/native-transcription-diagnosis.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="language-pack">2. Check the spoken language and pack</h2>
<p>In the transcript creation options, open Language and install a missing language pack using its download icon. English is included with Premiere; other packs may need downloading first. Wait for completion before retrying.</p>
<p>If auto-detection selected the wrong language, check Media Analysis &amp; Transcription preferences. Disable language auto-detection when you need a known language manually. Test a short spoken passage and inspect the actual words. See the <a href="premiere-pro-captions-language.html">language guide</a> for detection, fallback and translation differences.</p>
<h2 id="audio-source">3. Listen to the audio source being analysed</h2>
<p>Confirm that the selected file contains audible speech. For sequence transcription, choose the relevant dialogue or audio track in the transcription options rather than an unrelated music track.</p>
<p>Check disabled clips, track output and the actual sequence mix when that is the chosen source. Keep this distinct from source-file transcription, which can inspect underlying media rather than the playback mix you expected.</p>
<h2 id="short-test">4. Isolate a short test</h2>
<p>Mark a clear spoken passage and use the In-to-Out option where available in the static sequence-transcription dialog. Keep the chosen language and source explicit. Wait for the model download and transcription progress rather than judging solely from a paused interface.</p>
<p>If a short passage works but the full edit does not, test another section to locate the difference. A long job taking time does not by itself prove that Premiere is frozen. Avoid starting repeated duplicate jobs while the first is still running.</p>
<h2 id="recognition-quality">5. Separate a completed bad transcript from a failed job</h2>
<p>Wrong words in a completed transcript can come from the language setting, unfamiliar names, unclear speech or overlapping dialogue. Correct names and numbers manually and compare a clearer source where available. Repeating the same settings is not a guaranteed accuracy improvement.</p>
<p>For a decoding check, export a short dialogue passage as a suitable audio file, import it separately and test transcription. A successful result can narrow the problem to the original source or workflow; it does not establish a single cause.</p>
<h2 id="version-issues">6. Check the installed version and known issues</h2>
<p>If the Text panel itself is blank or stuck loading, Adobe lists a Premiere 25.6.1 empty-Text/UXP-panel issue as fixed in 26.0. Check whether the documented version and symptom match your case before applying that diagnosis.</p>
<p>Save projects before updating through Creative Cloud and review compatibility with installed plugins. An update is a version-specific troubleshooting step, not a promise that every language or audio problem will disappear.</p>
<h2 id="cache-support">7. Use broader troubleshooting after basic checks</h2>
<p>If the source, pack, language and short test do not resolve the issue, follow Adobe's current cache and application troubleshooting for the installed version. Keep a saved project and record the exact error, source type and failed step before contacting support. Do not delete arbitrary project or model folders.</p>
<p>Captions Gen uses a separate local CPU speech engine and its own downloaded models. It can be an alternative workflow on supported Windows systems, but it does not repair Adobe's transcript or import its native caption track. Check its <a href="free-caption-plugin-premiere-pro.html">setup and output limits</a> before switching.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/auto-transcribe-video-using-speech-to-text.html">static sequence-transcription options</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/download-language-packs-from-within-premiere.html">language-pack steps</a>, <a href="https://helpx.adobe.com/premiere/desktop/get-started/preferences-and-settings/transcription-preferences.html">detection preferences</a>, and <a href="https://helpx.adobe.com/premiere/desktop/troubleshooting/limitations-and-known-issues/known-and-fixed-issues.html">version-specific panel issue</a>.</p>
""")

P["fix-caption-timing-premiere-pro"] = dict(
modified='2026-11-09',
title="Fix Caption Timing in Premiere Pro: Early, Late, Overlapping",
desc="Fix early, late or drifting Premiere captions with cue-point checks, offset corrections and section repairs. Review highlights after changing words.",
h1="Fix caption timing in Premiere Pro",
rel=["premiere-pro-captions-not-showing","import-srt-premiere-pro","how-to-add-captions-in-premiere-pro"],
body="""
<p><strong>Compare a caption with the speech near the beginning, middle and end before moving the whole track.</strong> A constant offset can be shifted together. Growing drift or an error after a cut needs a different correction. For animated graphics, also distinguish the caption clip's timing from the highlight timing inside it.</p>
<h2 id="timing-pattern">Identify the pattern</h2>
<p>Choose three clear spoken words in the actual final edit. Note whether captions are equally early or late at each point, progressively further away, or correct until a particular edit. Use the sequence audio, not memory of an earlier export.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-offset-drift.svg" width="960" height="1000" loading="lazy" alt="Equal timing error suggests an offset; increasing error suggests drift; a sudden change points to an edited section"/><figcaption>Timing illustration with hypothetical patterns. It does not diagnose a particular file automatically. <a href="/img/guides/native-caption-offset-drift.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="constant-offset">Move a constant offset together</h2>
<ol>
<li>Save a project copy and identify the affected native caption track.</li>
<li>Select the caption clips that share the offset. Keep unrelated tracks and correctly timed sections out of the selection.</li>
<li>Move the selected clips earlier or later so a clear word matches the audio. Zoom in enough to inspect the boundary.</li>
<li>Check the beginning, middle and end again. Confirm that the shift did not move an opening cue before the usable sequence range.</li>
</ol>
<p>An imported file may start against a different reference point. For example, captions prepared against a video with an opening countdown can be offset from a sequence without it. Confirm the reference version before compensating.</p>
<h2 id="drifting-captions">Investigate drift before stretching anything</h2>
<p>If the opening matches but the ending does not, compare the exact cut, source duration, speed changes and timecode conversion. SRT stores timestamps; it has no intrinsic frame-rate setting you can simply toggle to repair every drifting file.</p>
<p>A continuous speed change and a removed section produce different error patterns. Repair or regenerate timing for the matching edit rather than dragging one edge until a single endpoint looks right. Retest several cue points after the correction.</p>
<h2 id="after-edit">Correct a changed section</h2>
<p>If timing changes after a specific cut, inspect the first affected caption and the edit at that point. A later audio trim without matching caption changes can leave everything after it shifted. Move or rebuild only the affected region when earlier captions are still correct.</p>
<p>Finish the main speech edit before making a final caption pass. If another edit is necessary afterwards, include captions in the review rather than assuming a ripple operation preserved every intended relationship.</p>
<h2 id="boundaries">Fix boundaries, overlaps and reading time</h2>
<p>For a native caption clip, move its start or end to the intended speech or reading boundary. Check adjacent clips so the correction does not create a gap or overlapping time range. Also inspect whether two caption tracks are enabled when you expected one.</p>
<p>Split a long passage at a sensible phrase boundary, or combine wording where the chosen caption workflow supports that edit. Judge reading time against the amount of text. A fixed phrase-duration rule does not suit native Single Word captions.</p>
<h2 id="graphic-word-timing">Fix timing inside animated captions</h2>
<p>A graphic can start at the correct moment while its active-word highlight is wrong. Moving the entire graphic shifts every internal word; it does not fix one misplaced highlight. First check the clip boundary, then compare the word changes with the voice.</p>
<p>In Captions Gen 1.1.9, use Update animation where offered after editing caption words. Existing timing can be retained and added words can be aligned to source audio where possible. If timing is estimated, listen and review rather than treating it as measured alignment. Apply style changes appearance, not the meaning of an edited transcript.</p>
<p>After Effects users edit caption layers through a different panel surface. Follow its <a href="how-to-add-captions-in-after-effects.html">caption workflow</a> instead of treating native Premiere subtitle clips and composition layers as the same items.</p>
<h2 id="timing-export">Check the delivered file too</h2>
<p>Export a short corrected section and compare its audio and captions. For a sidecar, load the matching subtitle file explicitly. If preview timing is correct but delivery differs, inspect the selected sequence, range and file pair before retiming the project again.</p>
<p>Keep captions and the final video version together. The <a href="import-srt-premiere-pro.html">SRT guide</a> covers mismatched files, while <a href="premiere-pro-captions-not-exporting.html">export troubleshooting</a> separates sidecars from visible graphics.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html">imported-caption workflow</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word captions</a>, and <a href="/product.html">Captions Gen animation-update behavior</a>. Offset/drift checks are editorial diagnosis steps, not measured benchmarks.</p>
""")

P["capcut-vs-premiere-pro-captions"] = dict(
modified='2026-11-09',
title="CapCut vs Premiere Pro Captions: Which Should You Use?",
desc="Choose CapCut or Premiere captions by editing workflow, export entitlement, subtitle handoff and correction steps. Compare SRT with burned-in animated video.",
h1="CapCut vs Premiere Pro captions",
rel=["animated-captions-premiere-pro","best-caption-plugin-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro"],
body="""
<p><strong>Use the caption workflow that keeps your text, timing and revisions manageable.</strong> If the edit already lives in Premiere, its native captions or an in-app graphics workflow can avoid a rendered round trip. If you edit in CapCut, check the caption tools and export entitlement in the actual account and platform before moving the project.</p>
<p>This is a workflow comparison, not a controlled test of recognition accuracy or speed. I make Captions Gen, the Premiere/After Effects plugin discussed below.</p>
<h2 id="capcut-or-premiere">Choose by what needs to stay editable</h2>
<p>Premiere native captions remain a caption track and support suitable subtitle-file delivery. An animated graphic is a designed picture treatment. A video exported with CapCut captions burned in brings the visible words back as pixels; editing those words later requires returning to the source project or replacing that rendered treatment.</p>
<figure class="caption-example"><img src="/img/guides/comparison-capcut-premiere.svg" width="960" height="1000" loading="lazy" alt="Keep a caption project editable, transfer text and timing with SRT where supported, or transfer a rendered captioned video with animation baked in"/><figcaption>Handoff illustration. SRT and rendered video preserve different parts of the work. <a href="/img/guides/comparison-capcut-premiere.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="capcut-captions">Creating captions in CapCut</h2>
<p>CapCut's desktop help documents Captions &gt; Auto Captions, followed by the audio source, language and Generate. Mobile and web workflows differ. Review the recognised text and line breaks before choosing the final design.</p>
<p>Do not assume that a template you can preview is included in a free export. CapCut's current help lists auto captions among Pro capabilities and explains that using Pro assets or features can trigger a subscription requirement when exporting. Other individual tools can be marketed differently, so confirm the entitlement in your specific account and platform.</p>
<p>Before rebuilding a long edit there, generate and export a short real sample. Check whether the selected caption style, watermark behavior, resolution and destination are available under the actual plan. Pricing can vary by region, platform and offer.</p>
<h2 id="premiere-captions">Creating captions in Premiere</h2>
<p>Premiere's Speech to Text uses downloaded language packs for local transcription. Create a reviewed caption track, apply a Track Style and choose burn-in or supported caption-file export. Current versions also have Single Word layout for one word at a time.</p>
<p>A moving highlight across a phrase needs graphics or another timed animation workflow. The <a href="animated-captions-premiere-pro.html">Premiere animation guide</a> compares native captions, manual graphics and plugins without treating them as the same output.</p>
<h2 id="handoff">Choose the handoff deliberately</h2>
<ol>
<li>For a finished visual treatment, export the captioned video and inspect the actual file. Animation becomes part of that picture.</li>
<li>Where the CapCut version and plan support subtitle-file export, use SRT to transfer editable subtitle text and timing. Test availability rather than assuming every device has the same export controls.</li>
<li>Import the SRT into Premiere using the <a href="import-srt-premiere-pro.html">native subtitle-file workflow</a>. Recreate the appearance as needed; the animated template does not come with it.</li>
<li>After any later picture edit, compare the captions against the new speech timing. Keep a matching reference video with the subtitle file.</li>
</ol>
<h2 id="compare-real-sample">Compare a real sample, not a marketing number</h2>
<p>Use the same dialogue passage in each candidate. Check names, technical terms, mixed-language sections, pauses and line breaks. Correct a word after generation and see what happens to its timing and style. These practical checks are more informative for your job than an unverified universal accuracy percentage.</p>
<p>Inspect the final-size export on the intended screen. A bold animated template can still cover important footage or become uncomfortable during fast speech. Try a simpler native style if it communicates the passage better.</p>
<h2 id="processing-cost">Check processing and ongoing cost</h2>
<p>Adobe's local Speech to Text and its cloud Translate captions are separate processing choices. Check the current upload behavior for the other tool and selected feature before using client footage. The presence of a desktop app alone does not establish that every operation is local.</p>
<p>Premiere captions are included in a paid Adobe application. CapCut plans and export entitlements vary; use the price shown for the actual account rather than a general dollar figure from a different region. A plugin can have another billing model on top of its Adobe requirement.</p>
<h2 id="captions-gen-route">An in-Premiere graphics option</h2>
<p>Captions Gen 1.1.9 generates word-timed editable Motion Graphics with local CPU transcription on supported Windows systems. It has its own 18 built-in designs, customization and Apply style for a generated batch. These can provide bold highlights, pill backgrounds and animation without claiming to duplicate every CapCut template.</p>
<p>The current plugin is free without a watermark or transcription time cap; Adobe Premiere is separate. It has no SRT import/conversion or translation feature. One installer also offers an <a href="how-to-add-captions-in-after-effects.html">After Effects panel</a>. Check <a href="/product.html">compatibility and output limits</a> before choosing the workflow.</p>
<p class="sources">Checked 9 November 2026: CapCut's <a href="https://www.capcut.com/help/how-to-recognise-subtitles">desktop Auto Captions help</a>, <a href="https://www.capcut.com/help/difference-between-standard-and-pro-subscription">Standard/Pro distinction</a>, <a href="https://www.capcut.com/help/join-capcut-pro-for-exporting">export entitlement</a>, and <a href="https://www.capcut.com/help/captions-fail-to-export">caption export help</a>; Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html">SRT handoff</a>.</p>
""")

P["best-fonts-for-captions"] = dict(
modified='2026-11-09',
title="Best Fonts for Captions and Subtitles (With Sizes)",
desc="Choose readable caption fonts for your footage and language. Compare size, weight, contrast and line breaks, then test the video at delivery size.",
h1="Best fonts for captions and subtitles",
rel=["change-caption-font-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro","premiere-pro-caption-presets"],
body="""
<p><strong>The best caption font is one you can read on the final video without fighting the footage.</strong> Start with a clear family, check its language characters, then compare weight, size, line breaks and background treatment in a short export. A font name alone does not determine readability.</p>
<h2 id="font-shortlist">Start with a small, practical shortlist</h2>
<p>Inter or Arial can be useful neutral starting points. Montserrat or Poppins can suit a heavier social-video treatment. Anton or Bebas Neue can provide condensed emphasis for short text. These are design suggestions to test, not a ranking backed by a reading-speed study.</p>
<p>Compare the exact available weights and the actual script you need. A family that works for short English words may have different coverage or line length in another language. Check the font source and license before sharing it with a client or bundling it in a project handoff.</p>
<figure class="caption-example"><img src="/img/guides/native-font-readability.svg" width="960" height="1000" loading="lazy" alt="Compare a font using the same caption, delivery size and bright or dark footage; inspect contrast and longest line"/><figcaption>Readability illustration. It demonstrates a comparison process, not exact specimens of the named font families. <a href="/img/guides/native-font-readability.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="font-test">Run a useful font test</h2>
<ol>
<li>Choose a short real passage containing a long line, numbers, a name and the characters used by the language.</li>
<li>Keep the footage, wording, position and timing the same while comparing two candidate fonts.</li>
<li>Check the lightest and busiest shots, not only a still frame chosen for the text.</li>
<li>Export at the intended resolution and watch at the expected size. For phone delivery, inspect it on a phone.</li>
<li>Choose the result that remains clear, then check the rest of the captions for unusual wrapping.</li>
</ol>
<p>This isolates the font decision better than comparing one family on clean footage with another on a bright, moving background. It also catches substitutions that the editing view may make easy to miss.</p>
<h2 id="font-size">Choose size by visible height and line length</h2>
<p>On a 1080 x 1920 edit, 55 to 75 pixels can be a starting experiment for a short social caption. It is not a universal recommendation or platform rule. Two fonts at the same numerical size can have different visible heights and widths.</p>
<p>Try the longest caption and the narrowest part of your framing. If it becomes three cramped lines, shorten the grouping or use a different line break before making every caption tiny. Keep enough clearance for the destination's controls and surrounding visual information.</p>
<h2 id="weight-contrast">Use weight and contrast deliberately</h2>
<p>Very thin strokes or dense decorative forms can be difficult at small sizes. A heavier weight may help, but excessive outlines can close up letter shapes. Check the interior spaces in letters as well as the overall boldness.</p>
<p>Try a dark stroke, a shadow or a background when the image changes behind the text. Keep only what improves separation. A design that works on a dark shot may disappear on a white shirt or a bright sky, so test those transitions.</p>
<h2 id="case-language">Check case, punctuation and language</h2>
<p>All caps can be a stylistic choice for brief emphasis; sentence case can be useful for longer passages. Compare them with the actual text rather than asserting that one case always reads faster.</p>
<p>Check accents, apostrophes, currency symbols and any non-Latin script in the exported file. An apparently installed font can still fall back for missing characters. A subtitle file shown by a player may use the player's own font rather than the font selected in Premiere.</p>
<h2 id="save-font-style">Apply the result in Premiere</h2>
<p>For native captions, select a caption, open Properties and set the font and appearance. Save a <a href="premiere-pro-caption-presets.html">Track Style</a> to reuse the look. For a missing family or project-wide substitution, follow the <a href="change-caption-font-premiere-pro.html">font troubleshooting guide</a>.</p>
<p>For animated graphics, review the active-word color and size as well as the base font. A word that grows can change the apparent spacing or cover nearby text. Captions Gen has saved design presets and Apply style for its generated batch, but its .cgpreset files do not include font files.</p>
<h2 id="font-delivery">Keep delivery expectations clear</h2>
<p>Burned-in captions and animated graphics retain their appearance as part of the video image. A basic SRT sidecar delivers text and timing, not the complete font design. Provide the right output and a short review sample when a client's requested appearance matters.</p>
<p>Use the <a href="captions-for-tiktok-reels-shorts-premiere-pro.html">vertical-caption guide</a> for placement checks, or the <a href="how-to-add-captions-in-after-effects.html">After Effects guide</a> for composition layers.</p>
<p class="sources">Checked 9 November 2026: <a href="https://fonts.google.com/specimen/Inter">Inter</a> and <a href="https://fonts.google.com/specimen/Montserrat">Montserrat</a> official family pages, Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/replace-fonts.html">font substitution controls</a>, and <a href="https://support.google.com/youtube/answer/2734698?hl=en">YouTube's basic SRT styling limits</a>. Font choices and sample sizes above are editorial starting points.</p>
""")

P["burn-in-captions-premiere-pro"] = dict(
modified='2026-11-09',
title="How to Burn In Captions in Premiere Pro (Export Settings)",
desc="Burn native captions into Premiere video through Export settings, verify the intended tracks and keep a clean master or separate subtitle file when needed.",
h1="How to burn in captions in Premiere Pro",
rel=["premiere-pro-captions-not-exporting","captions-for-tiktok-reels-shorts-premiere-pro","closed-captions-premiere-pro"],
body="""
<p><strong>For native captions, open Export, expand Captions and choose Burn Captions Into Video.</strong> Check the intended caption tracks and export range, then render a short sample. The words become part of the video picture, so a player does not need to load a separate subtitle file to display that text.</p>
<p>Graphics are different: Type-tool titles, upgraded captions and Captions Gen output render through video tracks. The native caption burn-in setting does not control those graphic clips.</p>
<h2 id="burn-in-choice">Decide whether burn-in fits the delivery</h2>
<p>Use burn-in when the delivered picture should retain a fixed caption design or the destination cannot take the required caption file. Use a native sidecar or supported embedded stream when the viewer or recipient needs separately selectable captions.</p>
<p>A client can request both a captioned video and a clean video with subtitle files. Label those versions clearly. Once words are burned into a delivered image, turning off a player's CC button will not remove them.</p>
<figure class="caption-example"><img src="/img/guides/native-caption-burn-in.svg" width="960" height="1000" loading="lazy" alt="Keep a clean master, burn the intended native caption track into a delivery copy, and export a separate subtitle file when required"/><figcaption>Delivery illustration. A visible-text copy and a clean subtitle-file delivery serve different purposes. <a href="/img/guides/native-caption-burn-in.svg">Open full-size diagram</a>.</figcaption></figure>
<h2 id="burn-in-steps">Burn a native caption track into the picture</h2>
<ol>
<li>Open the intended final sequence and save the project.</li>
<li>Enable the caption track or tracks meant to appear in this picture version. Disable unintended alternative-language tracks so they do not appear together.</li>
<li>Check the caption text and timing in the Program Monitor, including a long line and a bright background shot.</li>
<li>Open Export and expand Captions. Choose Burn Captions Into Video and inspect the available Caption Tracks.</li>
<li>Set the correct export range, format and destination filename. Follow the recipient's picture and audio requirements.</li>
<li>Export a short passage and open that actual new file. Verify that the text is visible without loading an SRT.</li>
</ol>
<p>Adobe documents burn-in for active caption tracks. If no relevant track appears, check whether your text is native captions or graphics, and confirm you opened the correct sequence.</p>
<h2 id="burn-in-graphics">If the captions are graphics</h2>
<p>Keep the graphic clips inside the export range with their video-track output enabled. Check text-layer visibility, opacity, animation boundaries and any opaque layer above the graphic. Export through the ordinary video rendering workflow.</p>
<p>Captions Gen's Premiere Motion Graphics and After Effects caption layers use this picture-based output. They do not create a selectable caption stream or SRT sidecar. If required, retain the <a href="how-to-add-captions-in-premiere-pro.html">native caption workflow</a> alongside the animation.</p>
<h2 id="burn-in-quality">Check quality at delivery size</h2>
<p>Caption pixels are compressed with the rest of the video. Inspect fine strokes, outlines and small letters in the actual export, especially after scaling or a low-quality encode. No universal bitrate or font size guarantees readable text for every codec and frame size.</p>
<p>Choose an appropriate export preset for the destination, then test the longest caption over changing footage. For a vertical social version, check a phone and the app's interface. See <a href="captions-for-tiktok-reels-shorts-premiere-pro.html">vertical caption placement</a> and <a href="best-fonts-for-captions.html">font readability</a> for those design checks.</p>
<h2 id="clean-master">Keep a clean master when later changes are likely</h2>
<p>If a colourist, translator or client will create another version, keep a sequence or master without burned-in text. A burned-in typo cannot be removed by deleting an SRT. Return to the source project, correct the caption and export a new delivery.</p>
<p>When also supplying subtitle files, export each required language track and keep it matched to the video version. The <a href="import-srt-premiere-pro.html">SRT guide</a> explains the separate file handoff. Burn-in alone does not replace specified broadcast closed-caption data.</p>
<h2 id="burn-in-problems">If text is missing or duplicated</h2>
<p>If it is absent in the preview, check track visibility and caption time ranges before export. If it appears in the preview but not the file, inspect the export source, chosen caption option and intended track. Use a new filename for the test so an older file is not mistaken for the corrected result.</p>
<p>If words appear twice, check for both graphics and native burn-in, multiple enabled language tracks or a receiving app adding another subtitle layer. Inspect which text is already part of the video before changing the caption file.</p>
<p>The <a href="premiere-pro-captions-not-exporting.html">missing-export guide</a> separates native burn-in, sidecar, embedded and graphic cases. Check the final delivered file after the full export, not only the short test.</p>
<p class="sources">Checked 9 November 2026: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/export-caption-tracks.html">burn-in and Caption Tracks options</a>, <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html">supported caption formats</a>, and <a href="/product.html">Captions Gen output limits</a>.</p>
""")
