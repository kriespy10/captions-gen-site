"""After Effects guides checked against the frozen public 1.1.9 Windows panel."""

AE_POSTS = {
    "how-to-add-captions-in-after-effects": dict(
        app="After Effects",
        published="2026-11-08",
        modified="2026-11-09",
        title="How to Add Captions in After Effects | Captions Gen",
        desc="Install Captions Gen, choose the right speech source and create editable animated captions in After Effects. Includes model setup, editing and export limits.",
        h1="How to add animated captions in After Effects",
        image="/img/guides/ae-first-captions-workflow.svg",
        rel=["edit-captions-in-after-effects", "after-effects-captions-not-showing", "word-by-word-captions-after-effects"],
        faq=[
            ("Is Captions Gen free for After Effects?",
             "The current Windows release is free, without a watermark, subscription or transcription time cap. The download uses an email checkout without a payment card. Adobe After Effects is a separate paid application. Paid Captions Gen features are planned for the future."),
            ("Which After Effects versions are supported?",
             "The public panel has been tested with After Effects 2026 on Windows 11. Earlier After Effects versions are not certified for this release. There is no public Mac installer."),
            ("Does the work area choose which audio is transcribed?",
             "No. Captions Gen reads the underlying media files of the selected supported layers, using their visible ranges within the composition. The work area does not choose the transcription range. Render a processed or retimed source to a new file when that is what you need captioned."),
            ("Do I need to run Update animation after Save caption?",
             "No. Saving through the panel's caption editor updates text and animation together. Update animation is the separate path offered after a supported manual Source Text change. Newly added word timings still need checking against the original speech."),
            ("Can this After Effects workflow export SRT or selectable subtitles?",
             "No. It creates editable animated caption layers that render into the picture. Keep a separate subtitle workflow when delivery needs SRT files, selectable subtitles or broadcast closed captions."),
        ],
        body="""
<p><strong>To add animated captions in After Effects with Captions Gen, install its Windows panel, select a supported audio or video layer, choose a look and press Generate Captions.</strong> The panel transcribes the selected speech locally and places editable caption layers in your composition. The animation becomes part of the video image when you render it.</p>
<p>I make Captions Gen. These instructions cover the <a href="/news/captions-gen-1-1-9.html">public 1.1.9 release</a>, tested with After Effects 2026 on Windows 11.</p>
<figure class="caption-example"><img src="/img/guides/ae-first-captions-workflow.svg" alt="Illustrated After Effects workflow: select speech footage, transcribe locally on the CPU, create editable caption precomposition layers, then render captions into the picture." width="960" height="860" loading="lazy"><figcaption>Workflow illustration. The selected media supplies the speech; the generated caption layers stay editable in the project. <a href="/img/guides/ae-first-captions-workflow.svg">Open full size</a>.</figcaption></figure>
<div class="tldr"><p class="t">Before your first caption</p><ul>
<li>Use After Effects 2026 on Windows 11 for the tested public configuration.</li>
<li>Install After Effects or Both from the full Windows Setup.</li>
<li>Allow at least 3 GB for the built-in models, plus your apps and project files.</li>
<li>Start with one short, online media layer at normal speed with audio enabled.</li>
<li>Wait for the engine and your chosen model before generating.</li>
</ul></div>

<h2 id="install">1. Install and open the After Effects panel</h2>
<ol>
<li>Save your projects and close the Adobe applications.</li>
<li><a href="__FREE__">Download the current Windows Setup</a>. The free checkout uses an email address to deliver the link; it does not require a payment card.</li>
<li>Run Setup and choose <strong>After Effects</strong>, or <strong>Both</strong> to install the Premiere Pro panel too. Keep Creative Cloud Desktop installed and complete Adobe's installation prompts.</li>
<li>Open After Effects, then choose <strong>Window &gt; Extensions &gt; Captions Gen</strong>.</li>
</ol>
<p>A Premiere-only installation does not add the AE panel. Run the full Setup with Both selected when you want to add it. The two panels share the speech engine and Models folder.</p>
<p>The current plugin is free, without a watermark, subscription or transcription time cap. Adobe After Effects is separate and paid. Paid plugin features are planned for the future. Check the <a href="/product.html">current pricing and compatibility facts</a> before downloading.</p>
<p>If Windows blocks the EXE, contact <a href="mailto:business@captionsgen.com">support</a>. The Windows EXE is Authenticode-unsigned; the signed Adobe panel package does not resolve a Windows Smart App Control block. Development instructions for CEP debug mode are not public installation steps.</p>

<h2 id="model">2. Choose a model and spoken language</h2>
<p>Let missing model downloads complete. In <strong>Settings</strong>, choose <strong>Base</strong>, <strong>Small</strong> or <strong>Turbo</strong>. Turbo is the default quality choice; Base is the lightest built-in model. Processing time depends on your CPU, the model and audio length, so start with a short section you can check.</p>
<p>Use <strong>Spoken language</strong> for the language actually being spoken, or Auto-detect. Search the picker by language name or code. Cantonese requires Turbo or a compatible custom model. The <strong>Custom models</strong> manager lets you refresh compatible Faster Whisper folders in the shared Models directory and assign a model to a language. It does not make an incompatible model support a language.</p>
<p>Transcription uses your CPU without GPU acceleration. Meet <a href="https://helpx.adobe.com/after-effects/desktop/get-started/technical-requirements/system-requirements.html">Adobe's After Effects requirements</a> as well, with memory available for the model. Allow at least 3 GB free for the built-in models in addition to the plugin, Adobe apps and project files.</p>
<p>The speech engine reads audio locally. Missing models and update checks need the internet. Optional usage statistics and reports you choose to send are separate from transcription; see <a href="/privacy.html">the privacy details</a>. Language selection does not translate captions.</p>

<h2 id="source">3. Select the source and check its range</h2>
<p>Open the composition where you want the captions. Select one short, file-based audio or video layer with clear speech and audio enabled. Multiple supported selected layers can be used later, but the panel reads their source files rather than recording the rendered composition mix.</p>
<p>Keep the source online and at <strong>100% forward speed</strong>, with Time Remapping off. Stretching, reversing or an unsupported interpreted frame-rate change can make it unsuitable. If the speech depends on retiming or After Effects audio effects, render that version to a new file and use the rendered file as the source.</p>
<figure class="caption-example"><img src="/img/guides/ae-source-range-vs-work-area.svg" alt="Timeline illustration: a selected layer runs from 2 to 10 seconds and the work area from 4 to 7 seconds. Captions Gen reads the selected layer's supported visible range, not just the work area." width="960" height="760" loading="lazy"><figcaption>Example with a trimmed layer. Moving only the work-area handles does not change the plugin's transcription input. <a href="/img/guides/ae-source-range-vs-work-area.svg">Open full size</a>.</figcaption></figure>
<p>The panel clips the selected layer's visible in/out range to the composition and source bounds. To caption less of a long source, prepare a shorter source-layer range and test it. The work area matters separately when you choose a render range.</p>

<h2 id="generate">4. Pick a look and generate your first captions</h2>
<ol>
<li>Choose one of the 18 built-in looks in <strong>Presets</strong>.</li>
<li>Open <strong>Customize</strong> if you want to change the font, colors, grouping or animation before generation.</li>
<li>In Settings, choose whether caption layers go above the selected layer or at the top of the composition.</li>
<li>Enable <strong>Check transcript before generating</strong> if you want a text review first.</li>
<li>Press <strong>Generate Captions</strong>. Complete the transcript review if offered, and keep the composition and selected source unchanged until placement finishes.</li>
</ol>
<p>The result is a set of editable caption precomposition layers. Play them with the original speech and check names, numbers, phrase breaks and highlight timing. A different preset changes the design, not whether the transcript needs proofreading.</p>
<p>For a single word on screen at a time, use the <a href="word-by-word-captions-after-effects.html">one-word layout instructions</a>. For a phrase that stays visible while its spoken word changes color, use a karaoke highlight. Those are separate design choices.</p>
<p>The <a href="/#custom">interactive browser demo</a> has an After Effects mode with prepared sample captions. It demonstrates design and editing concepts without transcribing your media or operating your Adobe project.</p>

<h2 id="edit">5. Correct the transcript and restyle the batch</h2>
<p>Open <strong>Captions</strong>, search for a phrase, choose it, edit the text and use <strong>Save caption</strong>. Saving updates its animation too. A valid original-audio link lets the panel try aligning added words; if that is unavailable, it can report estimated timing. Listen again after the correction.</p>
<p>If you edit Source Text manually inside a generated caption instead, return to the parent composition, select the changed caption and use <strong>Update animation</strong> when offered. You do not need this extra action after a successful Save caption. The <a href="edit-captions-in-after-effects.html">editing and timing guide</a> covers both paths and find/replace.</p>
<p>Change the current look and use <strong>Apply style</strong> to restyle the current batch. Design-only changes do not need another transcription; changes to grouping can regenerate captions using source history. Save the project before wide changes, and use AE's <strong>Edit &gt; Undo</strong> when you need to undo a supported grouped edit.</p>

<h2 id="render">6. Render and inspect a short output file</h2>
<p>Render a short part of the composition before committing to a long export. Adobe documents <strong>Composition &gt; Add to Render Queue</strong>, then choosing render/output settings, an output destination and <strong>Render</strong>. Check whether the render time span is the full composition or Work Area Only. See <a href="https://helpx.adobe.com/after-effects/desktop/render-and-export/basics-of-rendering-and-exporting/basics-rendering-exporting.html">Adobe's rendering and exporting guide</a>.</p>
<p>Watch the actual file with sound. Check that the caption layers are visible, the text is readable over the footage, and important words do not sit under the destination platform's interface.</p>
<p>The animation renders into the picture. This workflow does not export SRT, native subtitle tracks or selectable closed captions. If those are part of your delivery, prepare them separately. Premiere users can follow the <a href="import-srt-premiere-pro.html">native SRT workflow</a>.</p>

<h2 id="problems">If setup or the result looks wrong</h2>
<p>A missing extension, an offline speech engine and an invisible generated layer need different fixes. Use the <a href="after-effects-captions-not-showing.html">After Effects captions troubleshooting guide</a> to identify which stage failed before reinstalling or generating again.</p>
<p>This public release does not include a Mac installer, translation or automatic B-roll. When reporting a problem, include the AE version, panel version, exact error and the step that failed. Choosing to send a bug report also attaches recent engine diagnostics, as explained on the privacy page.</p>
""",
    ),
    "edit-captions-in-after-effects": dict(
        app="After Effects",
        published="2026-11-09",
        modified="2026-11-09",
        title="Edit Captions in After Effects | Captions Gen",
        desc="Correct caption text, use whole-word find and replace, and repair highlights after manual Source Text edits in the Captions Gen After Effects panel.",
        h1="Edit caption text and update timing in After Effects",
        image="/img/guides/ae-caption-editing-routes.svg",
        rel=["how-to-add-captions-in-after-effects", "word-by-word-captions-after-effects", "after-effects-captions-not-showing"],
        faq=[
            ("Does Save caption update the animation automatically?",
             "Yes. The Captions Gen editor saves the text and updates animation together. You do not need a second Update animation step after a successful save. Review newly added words because audio alignment can be unavailable and fallback timing can be estimated."),
            ("When should I use Update animation?",
             "Use it when offered after manually changing Source Text inside a supported generated caption. Return to the parent composition and select that caption. This is different from saving through the panel's caption editor."),
            ("Can I replace a repeated word across a composition?",
             "The AE Captions tab has whole-word, case-insensitive find and replace, with previews before Replace all. It works on the generated captions listed for the current composition. The public 1.1.9 panel marks this feature free during early access."),
            ("Does Apply style change the caption wording?",
             "Use Apply style for the current batch's look. Use the caption editor or find/replace for text corrections. Grouping changes can regenerate captions, so check the result and keep a saved project before wider changes."),
        ],
        body="""
<p><strong>To correct a Captions Gen caption in After Effects, open the panel's Captions tab, choose the caption, change its text and press Save caption.</strong> The save updates text and animation together. Use the separate Update animation action after a manual Source Text edit, when the panel offers it.</p>
<p>This guide covers the public <a href="/news/captions-gen-1-1-9.html">1.1.9 Windows panel</a>. It assumes you already have generated captions. For installation and your first batch, start with <a href="how-to-add-captions-in-after-effects.html">adding captions in After Effects</a>.</p>
<figure class="caption-example"><img src="/img/guides/ae-caption-editing-routes.svg" alt="Two illustrated correction routes: the Captions tab's Save caption writes text and animation together; manual Source Text editing requires returning to the parent composition and using Update animation when offered." width="960" height="900" loading="lazy"><figcaption>Editing illustration. A normal panel save and a manual Source Text change follow different timing paths. <a href="/img/guides/ae-caption-editing-routes.svg">Open full size</a>.</figcaption></figure>

<h2 id="panel-edit">Correct a caption in the panel</h2>
<ol>
<li>Open the composition containing the generated caption layers.</li>
<li>Open <strong>Captions</strong> in the Captions Gen panel.</li>
<li>Use <strong>Search captions</strong> to find the phrase. Check its text and start/end time so you edit the intended occurrence.</li>
<li>Choose the caption's edit action, correct its words and press <strong>Save caption</strong>.</li>
<li>Preview that phrase with the original audio and check the changed words.</li>
</ol>
<p>The list belongs to the current composition. If the composition changes while an edit is open, choose the caption again in the current list rather than treating an old selection as current. An empty list can also mean the open composition has no compatible generated captions.</p>
<p>For example, changing <em>we make caption</em> to <em>we make captions</em> is a text correction. Adding <em>clear animated</em> creates new words that need timing. The editor can try local alignment when the original source binding is valid; it reports estimated timing when that route is unavailable. Neither outcome removes the need to listen.</p>

<h2 id="replace">Find and replace a repeated mistake</h2>
<p>In <strong>Captions</strong>, open <strong>Find &amp; replace</strong>. Enter the word or phrase under <strong>Find whole words</strong>, enter the replacement, review the affected captions and their preview text, then use <strong>Replace all</strong>. This feature is marked free during early access in the public panel.</p>
<p>Matching ignores letter case and uses whole words. Finding <em>cat</em> matches <em>Cat</em>, but does not replace part of <em>category</em>. Replacement text is literal. Leave the replacement empty to inspect matches; do not use that as a bulk-delete method.</p>
<p>Replace all updates text and timing for the changed captions. Use AE's Edit &gt; Undo if the replacement was wrong, then check the restored wording and animation. A narrow replacement is easier to review than changing a short common word across a long composition.</p>

<h2 id="manual">Recover animation after a manual Source Text edit</h2>
<p>Generated phrases are precompositions with editable text inside. Adobe documents <a href="https://helpx.adobe.com/after-effects/desktop/add-text/create-and-edit-text-layers/creating-editing-text-layers.html">Source Text as the text layer's content and formatting property</a>. Changing that property directly can leave the generated word animation referring to its earlier text.</p>
<ol>
<li>Save the project, then open the generated caption precomposition and change the intended text.</li>
<li>Return to the parent composition containing the generated caption layer.</li>
<li>Select the changed caption layer.</li>
<li>Use <strong>Update animation</strong> when the panel shows <strong>Caption text changed</strong>.</li>
<li>Preview the full phrase, including the words before and after the edit.</li>
</ol>
<p>If the action is absent, confirm you selected a compatible generated caption in the parent composition rather than an arbitrary text layer or an unrelated precomposition. Don't rebuild text animators or remove the generated rig to force the button to appear.</p>

<h2 id="timing">Check timing at the speech, not just the cut</h2>
<p>The whole phrase can sit in the correct place while a newly inserted word highlights too early. Listen for the first changed word and check where its highlight begins. Also inspect the next unchanged word, because a phrase can sound right at the start and drift near its end.</p>
<p>Available timing anchors help preserve unchanged words. Added words may align to valid original audio or use estimated timing. A moved or retimed source, missing media or an unavailable binding can prevent audio alignment. If the speech has changed substantially, generate from the current supported source rather than expanding an old caption into unrelated dialogue.</p>
<p>Do not stretch or time-remap generated caption layers as a shortcut for repairing text. Return to a supported source workflow and check the result against speech. The <a href="word-by-word-captions-after-effects.html">word-by-word styling guide</a> explains the difference between phrase grouping and timed highlights.</p>

<h2 id="style">Change the look after the wording is correct</h2>
<p>Use Presets or Customize, then <strong>Apply style</strong> for the current batch in the active composition. Font, color and design changes are different from transcript corrections. Grouping changes can regenerate captions from saved source history, so don't assume every Apply style operation is only a cosmetic change to one selected layer.</p>
<p>Save a version before a wide restyle. Keep a separate subtitle delivery workflow if the job also needs SRT or selectable captions; these editable AE layers still render into the picture. If the text is correct but the layer disappears, use <a href="after-effects-captions-not-showing.html">the visibility troubleshooting checklist</a>.</p>
""",
    ),
    "after-effects-captions-not-showing": dict(
        app="After Effects",
        published="2026-11-09",
        modified="2026-11-09",
        title="After Effects Captions Not Showing: Fixes | Captions Gen",
        desc="Find why the Captions Gen panel, generated layers or exported captions are missing in After Effects. Check installation, speech source, visibility and range.",
        h1="After Effects captions not showing: find the failed step",
        image="/img/guides/ae-captions-troubleshooting.svg",
        rel=["how-to-add-captions-in-after-effects", "edit-captions-in-after-effects", "word-by-word-captions-after-effects"],
        faq=[
            ("Where should the Captions Gen panel appear in After Effects?",
             "The public Windows panel opens from Window > Extensions > Captions Gen. If it is missing, save work, close AE and run the current full Setup with After Effects or Both selected. Premiere's UXP Plugins menu is a different installation path."),
            ("Why is a caption missing after I solo the video?",
             "Soloing a video layer can exclude other visual layers, including separate caption layers, from preview and render. Review the Solo switches as well as each caption layer's Video switch."),
            ("Does the Shy switch stop captions from rendering?",
             "No. Shy hides a layer from the Timeline panel when Hide Shy Layers is enabled. It does not by itself remove the layer from preview or final output. Check Video visibility, Solo, time range and render settings instead."),
            ("Why does the work area not limit caption generation?",
             "Captions Gen reads supported selected source layers and their visible ranges. The composition work area is not its transcription selector. Render time-span settings control a separate stage of output."),
        ],
        body="""
<p><strong>When captions do not show in After Effects, first identify what is missing: the Captions Gen extension, a generated caption layer, or the captions in the exported file.</strong> Reinstalling the panel will not fix a layer excluded by Solo, and generating again will not fix an export that uses the wrong composition or time range.</p>
<p>This checklist covers Captions Gen's public <a href="/news/captions-gen-1-1-9.html">1.1.9 Windows release</a>, tested with AE 2026 on Windows 11. It does not treat an SRT file as a generated Captions Gen layer. For the complete first-use procedure, follow <a href="how-to-add-captions-in-after-effects.html">the setup and first-captions guide</a>.</p>
<figure class="caption-example"><img src="/img/guides/ae-captions-troubleshooting.svg" alt="Troubleshooting illustration with three branches: missing extension means check installation; no generated layer means check engine, model and source; an existing invisible layer means check time, visibility, Solo and render range." width="960" height="880" loading="lazy"><figcaption>Troubleshooting illustration. Choose the branch that matches the failure. <a href="/img/guides/ae-captions-troubleshooting.svg">Open full size</a>.</figcaption></figure>

<h2 id="panel">The extension is missing from the menu</h2>
<p>Look under <strong>Window &gt; Extensions &gt; Captions Gen</strong>. AE uses the released CEP panel; Premiere's Window &gt; UXP Plugins instructions do not apply here.</p>
<p>If the entry is absent, save your work, close AE, and run the current full Windows Setup with <strong>After Effects</strong> or <strong>Both</strong> selected. Complete Adobe's installation prompts and reopen AE. A Premiere-only selection does not install the AE extension.</p>
<p>Earlier AE versions are not certified for this release, and there is no public Mac installer. Check <a href="/product.html">the current compatibility requirements</a>. Do not copy development debug-mode or registry instructions into a public installation. If Windows blocks the EXE, contact support rather than treating the Adobe package signature as a Windows signing fix.</p>

<h2 id="generation">The panel opens but no captions are created</h2>
<table><thead><tr><th>Check</th><th>What to do</th></tr></thead><tbody>
<tr><td>Engine offline</td><td>Start the installed Captions Gen engine from Windows Start, reopen the panel and check its status.</td></tr>
<tr><td>Model still downloading</td><td>Allow the download to finish. Keep enough free storage for the built-in models and check the selected model before generating.</td></tr>
<tr><td>No supported source</td><td>Open the intended composition and select an online, file-based audio/video layer with an audio stream and audio enabled.</td></tr>
<tr><td>Retimed or interpreted footage</td><td>Use 100% forward speed without Time Remapping or unsupported frame-rate interpretation. Render the processed version to a new file if necessary.</td></tr>
<tr><td>No speech in the selected range</td><td>Listen to the underlying source range. A new empty result does not establish a panel installation failure.</td></tr>
</tbody></table>
<p>The panel reads source files. It does not record the rendered composition mix, and moving the work-area handles does not select the transcription input. Start with one short, unprocessed speech layer to separate source problems from project complexity. Read any displayed error before changing the setup.</p>

<h2 id="layers">Caption layers exist but the picture is blank</h2>
<ol>
<li>Confirm the viewer and timeline belong to the parent composition where the batch was generated.</li>
<li>Move the playhead inside a caption's start/end range. A caption layer need not show across the entire composition.</li>
<li>Check the caption layer's <strong>Video switch</strong>, and review <strong>Solo</strong> on the source video and other visual layers.</li>
<li>Check whether an opaque layer above the caption covers it. The panel's placement choice can put captions above the selected source or at the top of the composition.</li>
<li>Check opacity, scale and position on the caption and relevant parent/nested layers if you changed them after generation.</li>
</ol>
<p>Adobe explains that Solo can exclude other visual layers from both previews and rendering. It also distinguishes Shy from visibility: Shy can hide a row in the Timeline panel while the layer still renders. See <a href="https://helpx.adobe.com/after-effects/desktop/work-with-layers/manage-layers/layers.html">Adobe's layer management reference</a>.</p>
<p>If you cannot find a layer row, clear timeline search/filtering and review Hide Shy Layers. If the row exists but the output is absent, concentrate on its Video switch, Solo, time range and composition rather than Shy alone.</p>

<h2 id="text">The layer is visible but the words or highlight look wrong</h2>
<p>Check that the current time is inside the phrase rather than before its entrance or during its exit. Open the panel's Captions tab to confirm the stored wording. After a manual Source Text edit, select the generated caption in its parent composition and use <strong>Update animation</strong> when offered.</p>
<p>A successful <strong>Save caption</strong> through the panel already updates animation. It does not need that extra step. If added words have estimated timing, review them with sound. Follow <a href="edit-captions-in-after-effects.html">the text and timing recovery guide</a> before changing the generated rig itself.</p>
<p>Check the font, text color and background contrast too. A white caption over a bright shot can be technically present but hard to read. A different stroke or background can improve contrast; preview the exported result rather than judging the design on one still frame.</p>

<h2 id="export">Captions appear in AE but are missing from the export</h2>
<p>Check that the queued/exported composition is the parent composition containing both video and captions. Then check its render time span. Adobe's render settings distinguish the full composition from Work Area Only. Review that setting in <a href="https://helpx.adobe.com/after-effects/desktop/render-and-export/basics-of-rendering-and-exporting/basics-rendering-exporting.html">the rendering and exporting reference</a>, along with any layer-switch overrides you changed.</p>
<p>Render a short section containing a caption and watch the output file. If that works, use the same confirmed composition and settings for the intended range. A caption rendered into the picture will not become a selectable subtitle track or a separate SRT file.</p>

<h2 id="report">What to include in a useful bug report</h2>
<p>Record the AE version, Captions Gen version, exact error, model, source type and the step that failed. Say whether the caption layer was never created, exists but is invisible, or only disappears in export. A screenshot of the relevant timeline and panel can be useful, but remove client details before sharing it.</p>
<p>Choosing Send bug report attaches recent engine diagnostics. Messages and logs can include paths or filenames; see <a href="/privacy.html">the report privacy details</a>. Avoid sending a project or media file unless support actually needs it and you are authorized to share it.</p>
""",
    ),
    "word-by-word-captions-after-effects": dict(
        app="After Effects",
        published="2026-11-09",
        modified="2026-11-09",
        title="Word-by-Word Captions in After Effects | Captions Gen",
        desc="Choose one word at a time or a phrase with moving highlights in After Effects. Set caption grouping, karaoke color or pills, then check speech timing.",
        h1="Word-by-word captions in After Effects: layout or highlight?",
        image="/img/guides/ae-one-word-vs-highlight.svg",
        rel=["how-to-add-captions-in-after-effects", "edit-captions-in-after-effects", "after-effects-captions-not-showing"],
        faq=[
            ("How do I show only one word at a time?",
             "In Captions Gen Customize > Caption text, set Min words and Max words to 1 before generation. That changes the grouping. Check the result against speech and choose an entrance/exit that does not obscure short words."),
            ("How do I keep a phrase visible and highlight each spoken word?",
             "Keep several words per caption and enable Highlight words as spoken in the Karaoke design group. Choose Color swap or Pill background, then review the word timing against the audio."),
            ("How many words can a karaoke caption contain?",
             "The public panel limits karaoke highlights to up to eight words per caption. Its broader Max words control is a grouping option, not a promise to highlight 36 words in one karaoke caption."),
            ("Do I need a separate layer for every highlighted word?",
             "Not in this generated workflow. Captions Gen creates editable phrase precompositions and animates their words. A one-word layout instead makes individual words the grouping units."),
        ],
        body="""
<p><strong>For one word on screen at a time, set Captions Gen's Min words and Max words to 1. For a phrase that stays visible while the spoken word changes color or gains a pill, keep several words per caption and enable Highlight words as spoken.</strong> Both can look like word-by-word captions, but grouping and highlighting solve different problems.</p>
<p>This guide covers the public <a href="/news/captions-gen-1-1-9.html">1.1.9 After Effects panel for Windows</a>. Install it and create a first batch with the <a href="how-to-add-captions-in-after-effects.html">AE setup guide</a>.</p>
<figure class="caption-example"><img src="/img/guides/ae-one-word-vs-highlight.svg" alt="Three illustrated frames compare one-word captions reading Make, it, clear with a persistent Make it clear phrase whose yellow highlight moves from word to word." width="960" height="880" loading="lazy"><figcaption>Layout illustration. The same phrase can use separate one-word groups or one phrase with a moving highlight. Frame spacing is illustrative; check timing against your audio. <a href="/img/guides/ae-one-word-vs-highlight.svg">Open full size</a>.</figcaption></figure>

<h2 id="choose">Choose the reading pattern first</h2>
<table><thead><tr><th>Wanted result</th><th>Control to change</th><th>What to review</th></tr></thead><tbody>
<tr><td>One word replaces the previous word</td><td>Caption text: Min words 1, Max words 1</td><td>Short words, pauses and whether the changes feel too busy</td></tr>
<tr><td>A phrase stays visible with a moving color</td><td>Several words per group; Karaoke: Color swap</td><td>Which word is active at each speech onset</td></tr>
<tr><td>A phrase stays visible with a moving pill</td><td>Several words per group; Karaoke: Pill background</td><td>Highlight timing, pill size and text contrast</td></tr>
<tr><td>Words reveal progressively</td><td>Choose a word-oriented In animation, such as Word reveal</td><td>What remains visible before and after each reveal</td></tr>
</tbody></table>
<p>For a sentence the viewer needs to read ahead, a short phrase can provide more context than one isolated word. For a deliberate single-word emphasis, the one-word layout may fit. Try the actual speech rather than choosing solely from a still image.</p>

<h2 id="one-word">Build a one-word layout</h2>
<ol>
<li>Select the supported speech layer in your composition.</li>
<li>Choose a preset, then open <strong>Customize &gt; Caption text</strong>.</li>
<li>Set <strong>Min words</strong> to <strong>1</strong> and <strong>Max words</strong> to <strong>1</strong>.</li>
<li>Choose text case, punctuation and line count for the design.</li>
<li>Generate captions and listen through several word changes, including pauses.</li>
</ol>
<p>A one-word grouping does not by itself add karaoke color, a pill or a bouncing entrance. Choose those separately under Design. Start with a restrained entrance so a very short word is not spent entirely inside its animation.</p>
<p>Grouping changes after a batch exists can regenerate captions through Apply style using saved source history. Save the project before changing a long batch, and inspect the new phrase boundaries afterward. Do not promise that changing Max words only restyles existing text layers without another source pass.</p>

<h2 id="highlight">Keep a phrase visible with moving word highlights</h2>
<ol>
<li>Choose <strong>Karaoke</strong> or <strong>Karaoke Pill</strong> as a starting preset.</li>
<li>In Caption text, keep several words in each group. The released karaoke path supports up to <strong>8 words per caption</strong>.</li>
<li>Open the <strong>Karaoke</strong> group under <strong>Design</strong> and enable <strong>Highlight words as spoken</strong>.</li>
<li>Choose <strong>Color swap</strong> or <strong>Pill background</strong>, then set the highlight color and related controls.</li>
<li>Preview with the source audio, especially names, contractions and words around pauses.</li>
</ol>
<p>The general Max words slider extends beyond eight, but that is not the karaoke highlight capacity. The panel also uses character, duration and line limits when grouping. A maximum is a limit, not a guarantee that every caption contains that exact number of words.</p>
<p>Use the <a href="/#custom">After Effects mode in the browser demo</a> to compare color and pill designs on prepared sample text. It cannot demonstrate recognition quality for your own audio, and its sample word timings are estimated.</p>

<h2 id="native">How this differs from native text animation</h2>
<p>After Effects also has native text animators and selectors for targeting parts of a text layer. Adobe's <a href="https://helpx.adobe.com/after-effects/desktop/animating-text/text-animation-examples/examples-resources-text-animation.html">text animation examples</a> include selecting a specific word. That gives you manual animation control; selecting a word does not itself transcribe speech or create verified spoken-word timing.</p>
<p>Captions Gen supplies a generated caption workflow with editable precompositions. You do not need to build a separate text layer for every word just to use its phrase highlight. If you manually change generated Source Text afterward, follow the panel's editing and timing rules so the rig and its wording stay consistent.</p>

<h2 id="review">Review readability and corrections together</h2>
<p>Watch the phrase over both bright and dark frames. Check that the active word is distinguishable and that a pill does not collide with other text. For long words, adjust the design and grouping instead of assuming a fixed word count will fit every shot.</p>
<p>Correct words in the <strong>Captions</strong> tab and use <strong>Save caption</strong>. Saving updates animation automatically. For a manual Source Text change, use Update animation when offered. New words can need estimated timing if original-audio alignment is unavailable; see <a href="edit-captions-in-after-effects.html">editing captions and recovering timing</a>.</p>
<p>Render a short sample and watch it with sound at the intended viewing size. These graphics become part of the picture, not an SRT file or a selectable subtitle stream. If a caption is absent rather than mistimed, use the <a href="after-effects-captions-not-showing.html">AE visibility and export checklist</a>.</p>
""",
    ),
}
