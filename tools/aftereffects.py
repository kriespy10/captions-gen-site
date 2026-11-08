"""After Effects guides for the public Windows panel, not development builds."""

AE_POSTS = {
    "how-to-add-captions-in-after-effects": dict(
        app="After Effects",
        published="2026-11-08",
        modified="2026-11-08",
        title="How to Add Animated Captions in After Effects | Captions Gen",
        desc="Install Captions Gen in After Effects on Windows, select your source layer, generate editable animated captions, fix words and timing, and render your video.",
        h1="How to add animated captions in After Effects",
        rel=["animated-captions-premiere-pro", "free-caption-plugin-premiere-pro"],
        faq=[
            ("Is Captions Gen free for After Effects?",
             "Yes. The current Windows release is free, with no watermark, subscription or transcription time cap. Download uses an email checkout without a payment card. Adobe After Effects is a separate paid application; paid Captions Gen features are planned for the future."),
            ("Which After Effects version has been tested?",
             "The public panel has been tested with After Effects 2026 on Windows 11. Earlier After Effects versions are not certified for this release. There is no public Mac installer."),
            ("Does it transcribe the composition's work area or audio effects?",
             "It reads the underlying files of the selected supported audio/video layers and their visible layer ranges. The composition work area does not choose the transcription range, and After Effects audio effects are not captured. Render processed or retimed audio to a new file when that is the source you need captioned."),
            ("Can I export these captions as SRT?",
             "This workflow creates editable animated layers rendered into the picture. It does not create an SRT file or selectable subtitle stream. Use a separate subtitle workflow when your delivery requires one."),
        ],
        body="""
<p><strong>To add animated captions in After Effects with Captions Gen, install the Windows panel, open your composition, select an audio or video layer, choose a preset and press Generate Captions.</strong> The result is editable caption layers in your project, with word highlights and animation rendered into the picture.</p>
<p>I make Captions Gen. This guide covers the <a href="/news/captions-gen-1-1-9.html">public 1.1.9 Windows release</a>, tested with After Effects 2026 on Windows 11. Earlier After Effects versions are not certified. The plugin is currently free without a watermark or transcription time cap; Adobe After Effects is separate and paid.</p>

<h2 id="install">1. Install the After Effects panel</h2>
<ol>
<li>Save your Adobe projects and close the Adobe applications.</li>
<li><a href="__FREE__">Get the current Windows setup</a>. The free checkout asks for an email address to deliver the download, with no payment card.</li>
<li>Run Setup and choose <strong>After Effects</strong>, or <strong>Both</strong> if you also want the Premiere Pro panel. Creative Cloud Desktop and Adobe installation permissions are required.</li>
<li>Reopen After Effects and choose <strong>Window &gt; Extensions &gt; Captions Gen</strong>.</li>
</ol>
<p>Already using Captions Gen only in Premiere? Run the full Setup and choose Both to add the After Effects panel. The two panels share one speech engine and Models folder, so you do not need separate copies of the speech models.</p>
<p>The Windows EXE remains Authenticode-unsigned; Adobe package signing does not resolve a Windows Smart App Control block. If Windows blocks setup, contact <a href="mailto:business@captionsgen.com">support</a>.</p>

<h2 id="model">2. Wait for the speech model to be ready</h2>
<p>Open the panel and let a missing model finish downloading. Built-in choices are Base, Small and Turbo; Turbo is selected by default. Base is the lightest built-in choice. Allow at least 3 GB free for the built-in models, in addition to the plugin, Adobe applications and project files.</p>
<p>Transcription runs locally on the CPU, without GPU acceleration. After Effects still needs the hardware Adobe requires. Processing time depends on your processor, selected model and audio length. Audio and video are not uploaded for transcription; model downloads and update checks use the internet. See the <a href="/product.html">complete requirements</a> and <a href="/privacy.html">privacy information</a>.</p>

<h2 id="source">3. Select the speech source in your composition</h2>
<p>For your first test, open a composition and select one short, file-based audio or video layer containing clear speech. Keep its audio enabled. The panel can use multiple supported selected layers, but it does not transcribe the rendered composition mix.</p>
<p>The source range follows the visible layer in/out points within the composition. Moving the work-area handles does not choose a different transcription range. The engine reads the underlying source file, so After Effects audio effects are not included.</p>
<p>Start with normal forward playback at 100% speed. Time Remap, stretching, reverse playback or a conformed frame rate can make a layer unsupported. For a retimed source or processed audio mix, render a copy to a new audio/video file and test that copy.</p>

<h2 id="generate">4. Pick a look and generate captions</h2>
<p>Choose one of the 18 built-in looks in <strong>Presets</strong>. Use <strong>Customize</strong> to adjust the design, then press <strong>Generate Captions</strong>. If the transcript-review step is enabled, correct the words before confirming the generation.</p>
<p>Captions are created as editable layers in per-phrase precompositions. Play the result with the original audio and check names, numbers, line breaks and word highlights. A useful-looking preset does not remove the need to proofread the transcript.</p>
<p>The <a href="/#custom">browser style preview</a> lets you try caption designs before installing. It is a design sample; it does not transcribe audio or place layers in After Effects.</p>

<h2 id="edit">5. Correct words and review the animation</h2>
<p>Use the panel's <strong>Captions</strong> tab to find and edit a caption, then save it. Saving updates its word animation. Where a valid audio-source link is still available, the panel can try aligning new words to the audio; otherwise it can warn that timing is estimated. Listen again after a correction.</p>
<p>If you change Source Text manually inside a generated caption, return to the parent composition, select the caption and use <strong>Update animation</strong>. This refreshes the animation for the changed text; it does not guarantee exact timing for newly added words. Review those highlights against the voice.</p>
<p>Use <strong>Apply style</strong> to change the look of the current caption batch. Changes to caption grouping can require transcription again. After Effects Undo can undo the panel's grouped host edits; keep a saved project before making wider changes.</p>

<h2 id="render">6. Render a short captioned sample</h2>
<p>Keep the generated caption layers enabled and inside the duration you render. Export a short sample through your usual After Effects render workflow and watch the actual file. The animated words are part of the picture.</p>
<p>These layers do not create native subtitle tracks, SRT files or selectable closed captions. If your client also needs subtitle delivery, keep that as a separate workflow. In Premiere Pro, the <a href="import-srt-premiere-pro.html">native SRT workflow</a> serves that purpose.</p>

<h2 id="troubleshoot">If the panel or captions do not appear</h2>
<ul>
<li><strong>No Captions Gen entry:</strong> close After Effects, rerun the current full Setup with After Effects or Both selected, then restart the app. Check Window &gt; Extensions, not Premiere's UXP Plugins menu.</li>
<li><strong>The engine or model is not ready:</strong> wait for downloads to complete and check the panel's status before generating.</li>
<li><strong>No supported source selected:</strong> open a composition, select an available file-based layer with audio enabled, and check its speed and time-remapping settings.</li>
<li><strong>Words are wrong:</strong> check the spoken-language choice and source audio, then correct the text and review its timing.</li>
<li><strong>Captions exist but are absent from the render:</strong> check the layer visibility, composition duration and render range.</li>
</ul>
<p>The current release has no public Mac installer, translation or automatic B-roll. If you need help, send the relevant After Effects version, panel version and error through the panel's report flow. Bug reports include a recent engine-log excerpt; the <a href="/privacy.html">privacy page</a> explains that optional flow.</p>
<p class="sources">Product references: <a href="/product.html">current public facts and limitations</a>, <a href="/news/captions-gen-1-1-9.html">1.1.9 release notes</a> and <a href="/#install">Windows installation</a>. Premiere users can compare the <a href="animated-captions-premiere-pro.html">Premiere-specific caption workflows</a>.</p>
""",
    )
}
