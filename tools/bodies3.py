# -*- coding: utf-8 -*-
# Guides added for the free release (October 2026). Imported by genblog.py.
# Same fields as bodies2.py, plus "published" (datePublished), "image" and "faq".
P3 = {}

def fig(name, alt, cap):
    return (f'<figure class="caption-example"><img src="/img/styles/{name}.png" width="1280" height="480" '
            f'loading="lazy" alt="{alt}"><figcaption>{cap}</figcaption></figure>')

GUIDE_SIZES = {"panel-steps.jpg": (1200, 399), "preset-looks.jpg": (1200, 837)}

def gfig(file, alt, cap):
    if "." not in file:
        file += ".png"
    w, h = GUIDE_SIZES.get(file, (1280, 720))
    return (f'<figure class="caption-example"><img src="/img/guides/{file}" width="{w}" height="{h}" '
            f'loading="lazy" alt="{alt}"><figcaption>{cap}</figcaption></figure>')

def tldr(*items):
    return '<div class="tldr"><p class="t">In short</p><ul>' + "".join(f"<li>{i}</li>" for i in items) + "</ul></div>"

def toc(*items):
    # genblog.py also shows a copy as a sticky sidebar on wide screens.
    return ('<aside class="toc toc-inline" aria-label="On this page"><p class="t">On this page</p><ol>'
            + "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items) + "</ol></aside>")

def tip(text):
    return f'<p class="tip"><b>Tip:</b> {text}</p>'

def note(text):
    return f'<p class="note"><b>Note:</b> {text}</p>'

PANEL = gfig("panel-steps.jpg", "The Captions Gen panel: pick a look on the Presets tab, then change the highlight color and size on the Customize tab",
             "Step 1: pick a look on Presets. Step 2: make it yours on Customize. Then press Generate.")
SAFE = gfig("vertical-safe-zone", "A 9:16 phone frame with the caption area marked in green, and the bottom and right edge marked in red where TikTok, Reels and Shorts put their buttons",
            "Keep captions out of the red areas on TikTok, Reels and Shorts.")
LOOKS = gfig("preset-looks.jpg", "Six caption presets: Bold Impact, Karaoke Pill, Beast Comic, Glow, Punch and Gamer",
             "Six of the 18 free presets, as they look in Premiere Pro.")
INSTALL = """<ol>
<li><a href="__FREE__">Get the free Windows setup</a> through the email checkout, with no payment card. Save your work, close the Adobe apps, then choose <strong>Premiere Pro</strong> in setup. You need Premiere Pro 25.6 or newer on supported 64-bit Windows 10 or 11, Creative Cloud Desktop and Adobe installation permissions.</li>
<li>Reopen Premiere Pro and go to <kbd>Window</kbd> &gt; <kbd>UXP Plugins</kbd> &gt; <kbd>Captions Gen</kbd>. Let any missing speech models download before generating; allow at least 3 GB for the built-in models. Later transcription uses the cached models on your CPU.</li>
<li>Select the clip with the voice in your timeline.</li>
</ol><p>Use the full Setup for a first installation. Check the <a href="/product.html">current product requirements</a> and <a href="/news/captions-gen-1-1-9.html">1.1.9 release notes</a> if you're updating an existing installation.</p>"""


# ---------------------------------------------------------------- Hormozi
P3["hormozi-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-11-08",
image="/img/guides/hormozi-anatomy.png",
title="Hormozi Style Captions in Premiere Pro: Font, Settings and Free Preset",
desc="Recreate Hormozi style captions in Premiere Pro with bold fonts, a yellow word highlight and readable placement. Follow manual steps or use the free Bold Impact preset.",
h1="Hormozi style captions in Premiere Pro",
rel=["mrbeast-style-captions-premiere-pro","free-caption-templates-premiere-pro","word-by-word-captions-premiere-pro","highlight-words-in-captions-premiere-pro"],
faq=[
("What font is used for Hormozi captions?",
 "Montserrat Black or ExtraBold gives you a bold, wide look; Anton gives taller, narrower letters. These are free Google Fonts. Captions Gen's Bold Impact preset tries The Bold Font first if installed, then falls back to Montserrat Black."),
("Can Premiere Pro make Hormozi captions without a plugin?",
 "Yes, with manual graphics work. Premiere can transcribe and create native captions, including a Single Word layout in current versions. To move a yellow highlight across a multi-word line, upgrade captions to graphics and time the color changes yourself."),
("Is there a free Hormozi captions preset for Premiere Pro?",
 "Yes. Captions Gen is currently free for Premiere Pro 25.6 or newer on supported 64-bit Windows. Bold Impact gives heavy caps with a yellow spoken word; Punch gives a taller version. The download uses an email checkout, with no payment card, watermark or time limit."),
("Can I change the yellow to green?",
 "Yes. In Captions Gen, open the Customize tab and pick a different highlight color. Save it as your own preset so every video uses it."),
("Can I still edit the captions after generating them?",
 "Yes. Captions Gen places editable Motion Graphics clips on the Premiere timeline. You can correct the text or move a clip. Version 1.1.9 includes animation updates after text edits; review the word timing after a correction."),
("Does it work on Mac or in CapCut?",
 "This public Captions Gen release is for Windows, with Premiere Pro and After Effects panels. There is no public Mac installer or CapCut plugin. The manual Premiere method in this guide can also be used on a Mac."),
],
body="""
<p>To recreate Hormozi style captions in Premiere Pro, use heavy white caps, a dark outline and a yellow highlight that follows the spoken word. Keep the phrases short enough to read at phone size.</p>
<p>You can build the highlight by hand with graphics, or start from Captions Gen's currently free Bold Impact preset on Windows. The settings below are a starting point for the look, not a claim about every caption in Alex Hormozi's videos.</p>
""" + tldr(
"Font: Montserrat Black or ExtraBold, all caps.",
"Style: white text, thick black outline, a soft shadow.",
"Highlight: the spoken word turns yellow (or green) and pops a little.",
"Length: two or three words on screen at a time.",
"Premiere's native Single Word layout shows one word at a time. For a moving highlight within a line, use timed graphics or <a href=\"https://captionsgen.com/\">Captions Gen</a>.",
) + toc(
("what-it-is", "What Hormozi style captions are"),
("font", "The font"),
("settings", "The exact settings"),
("highlight", "How the word highlight works"),
("by-hand", "Method 1: by hand"),
("plugin", "Method 2: free with Captions Gen"),
("placement", "Where to place them"),
("mistakes", "Common mistakes"),
) + """
<h2 id="what-it-is">What Hormozi style captions are</h2>
<p>Editors use "Hormozi style" for short phrases in heavy caps with a contrasting spoken-word highlight. The look is associated with Alex Hormozi's social videos, but you can adapt the font, color and timing to your own channel.</p>
<p>It works because it's easy to read with the sound off. The eye only has to take in a couple of words, and the color shows exactly where the speaker is.</p>
""" + gfig("hormozi-anatomy", "A Hormozi style caption with four labels: heavy font in all caps, thick black outline and shadow, the spoken word in yellow, and only two or three words on screen",
           "The four things that make the look.") + """
<h2 id="font">The font</h2>
<p>The look needs a heavy, wide font in all caps. These free fonts all work:</p>
<ul>
<li><strong>Montserrat Black</strong>: wide, round and very bold.</li>
<li><strong>Montserrat ExtraBold</strong>: a little lighter if Black feels too heavy.</li>
<li><strong>Anton</strong>: tall and narrow. Fits more letters on a vertical frame.</li>
</ul>
<p>All three are on Google Fonts. Install the font, then restart Premiere Pro so it shows up in the font list.</p>
""" + tip("Captions Gen bundles Montserrat and Anton. Bold Impact uses The Bold Font if you already have it installed, with Montserrat Black as a fallback. The website preview uses that fallback.") + """
<h2 id="settings">The exact settings</h2>
<p>These settings describe the Bold Impact preset. Font selection depends on which fonts are installed; adjust size and position for your sequence.</p>
<table class="spec">
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Font</td><td>The Bold Font if installed; otherwise Montserrat Black</td></tr>
<tr><td>Case</td><td>ALL CAPS</td></tr>
<tr><td>Text color</td><td><span class="swatch" style="background:#ffffff"></span>White #FFFFFF</td></tr>
<tr><td>Outline</td><td><span class="swatch" style="background:#000000"></span>Black, thick</td></tr>
<tr><td>Shadow</td><td>Black, short distance, a little blur</td></tr>
<tr><td>Spoken word</td><td><span class="swatch" style="background:#F7C204"></span>Yellow #F7C204, a little bigger</td></tr>
<tr><td>Words on screen</td><td>2 to 3</td></tr>
<tr><td>Animation</td><td>A quick pop as each group appears</td></tr>
</tbody>
</table>
<p>Prefer green? Use <span class="swatch" style="background:#00E676"></span>#00E676. It's the green of the Karaoke preset.</p>

<h2 id="highlight">How the word highlight works</h2>
<p>The highlight is what makes this style hard to do by hand. Every word changes color at the exact moment it's spoken.</p>
""" + gfig("word-highlight-timing", "Three frames of the caption USE YOUR SHIELD: first USE is yellow, then YOUR, then SHIELD, at 0.00, 0.28 and 0.52 seconds",
           "The yellow moves with the voice, one word at a time.") + """
<p>In the manual method, you can split a three-word graphic into three timed segments and change which word is yellow in each segment. The more speech you include, the more color changes you need to maintain.</p>

<h2 id="by-hand">Method 1: by hand in Premiere Pro</h2>
<p>This works with Premiere alone. It's fine for one short video, but slow if you post often.</p>
<ol>
<li><strong>Transcribe.</strong> Open <kbd>Window</kbd> &gt; <kbd>Text</kbd>, then click <em>Transcribe sequence</em>.</li>
<li><strong>Create short captions.</strong> Click <em>Create captions</em> and set a low maximum length so you get two or three words per caption.</li>
<li><strong>Style the track.</strong> Select the captions, open <kbd>Window &gt; Properties</kbd>, and set the font, caps, white fill, black stroke and shadow. Save it as a Track Style.</li>
<li><strong>Turn captions into graphics.</strong> Select the captions and choose <em>Graphics and Titles &gt; Upgrade Caption to Graphic</em>. Keep a copy of the native caption track if you need SRT or closed captions.</li>
<li><strong>Color each word.</strong> In each graphic, make the spoken word yellow. Cut the clip where the next word starts and move the color along.</li>
<li><strong>Add the pop.</strong> Keyframe the scale from about 100% to 110% and back over a few frames.</li>
</ol>
""" + note("Steps 5 and 6 need manual timing. Changing the words or the cut may mean revisiting those segments and keyframes.") + """
<h2 id="plugin">Method 2: free with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> transcribes locally on the CPU and builds editable Motion Graphics clips with the preset's timing, highlight and animation. It's currently free. Review the transcript and word timing before exporting.</p>
""" + INSTALL + """
<p>Then make the captions:</p>
<ol start="4">
<li>On the <strong>Presets</strong> tab, tap <strong>Bold Impact</strong>. The preview plays the look.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
<p>That's it. Each word gets its own timing and color, as editable graphics on the track above your clip.</p>
""" + PANEL + """
<h3>Make it your own</h3>
<p>Open the <strong>Customize</strong> tab to change the look. The changes show in the preview right away.</p>
<ul>
<li><strong>Highlight color:</strong> switch yellow to green, red or blue.</li>
<li><strong>Max words:</strong> how many words show at once. Two or three is the classic look.</li>
<li><strong>Text size</strong> and <strong>Highlight size:</strong> how big the text is and how much the spoken word grows.</li>
<li><strong>Position from top:</strong> move the captions up or down.</li>
<li><strong>Animation:</strong> how each group comes in, such as Pop or Bounce.</li>
</ul>
<p>Open <strong>Save preset</strong> beside the preview and choose <strong>Save as preset</strong> or <strong>Save as new preset</strong>. To make it the starting look, open its <strong>⋯</strong> menu and choose <strong>Make main preset</strong>.</p>

<h3>A taller version</h3>
<p>The <strong>Punch</strong> preset is the same idea in Anton, a tall and narrow font. It fits longer words on a vertical frame.</p>
""" + fig("Punch", "Punch caption preset: tall narrow caps with the spoken word in yellow", "Punch: the same look in a tall, narrow font.") + """
<h2 id="placement">Where to place them</h2>
<p>On vertical video, the app's buttons cover parts of the frame. Put your captions a little below the middle, away from the bottom and the right edge.</p>
""" + SAFE + """
<h2 id="mistakes">Common mistakes</h2>
<ul>
<li><strong>Too many words.</strong> The look falls apart as a full sentence. Keep it to three words or fewer.</li>
<li><strong>Two highlight colors.</strong> Pick yellow or green for the whole video. Switching looks like a mistake.</li>
<li><strong>A thin outline.</strong> Over a bright shot the white text disappears. Keep the outline thick.</li>
<li><strong>Typos in names.</strong> In Captions Gen Settings, turn on <em>Check transcript before generating</em>. Review names before placement, then play through the final graphics.</li>
</ul>
<p class="sources">"Hormozi style" describes the look; Captions Gen isn't affiliated with Alex Hormozi. Native workflow references: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-styles-for-captions.html">caption styles in Properties</a> and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word captions</a>.</p>
""")


# ---------------------------------------------------------------- MrBeast
P3["mrbeast-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-11-08",
image="/img/guides/mrbeast-anatomy.png",
title="MrBeast Style Captions in Premiere Pro: Font, Bounce and Free Preset",
desc="Make MrBeast style captions in Premiere Pro with a comic font, thick outline and bouncing word highlight. Follow manual steps or try the free Beast Comic preset.",
h1="MrBeast style captions in Premiere Pro",
rel=["hormozi-style-captions-premiere-pro","free-caption-templates-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro","animated-captions-premiere-pro"],
faq=[
("What font is used for MrBeast captions?",
 "For a similar comic look, try Bangers or Luckiest Guy, both available on Google Fonts. Captions Gen's Beast Comic preset uses Komika Axis if installed, then Bangers or Luckiest Guy as fallbacks. This is a styling recipe, not an identification of the font in a particular MrBeast video."),
("How do I make words bounce in Premiere Pro?",
 "For a manual bounce, use a separate graphic for each word and keyframe Scale from about 80% to 110%, then 100%. Adjust the keyframe spacing to the frame rate and speech. Captions Gen's Beast Comic preset applies its own bounce animation automatically."),
("Is there a free MrBeast captions preset for Premiere Pro?",
 "Yes. Captions Gen is currently free for Premiere Pro 25.6 or newer on supported 64-bit Windows. Beast Comic has a green spoken-word highlight and bounce; Gamer uses Luckiest Guy with a cyan highlight. The email checkout needs no payment card."),
("Should I use MrBeast style captions on long YouTube videos?",
 "Use them for the big moments, like the hook, numbers and reveals. For a whole long video, a calmer style such as Podcast or Subtitle Box is easier to watch."),
("Does it work on Mac?",
 "The public Captions Gen installer is Windows only, with Premiere Pro and After Effects panels. There is no public Mac installer. You can still build the look by hand in Premiere on a Mac."),
],
body="""
<p>For a MrBeast style caption look in Premiere Pro, start with a bold comic font, a thick outline and short phrases. A bright spoken-word highlight and a quick bounce give the text more movement.</p>
<p>The settings below are a recipe you can adjust, rather than an exact match for every MrBeast video. Build it with graphic keyframes or try Captions Gen's currently free Beast Comic preset on Windows.</p>
""" + tldr(
"Font: a comic font like Bangers or Luckiest Guy, all caps.",
"Style: a very thick black outline and a hard shadow with no blur.",
"Highlight: the spoken word in neon green, yellow or cyan.",
"Motion: each word bounces in, growing past full size and settling.",
"Free option: the Beast Comic preset in <a href=\"https://captionsgen.com/\">Captions Gen</a>.",
) + toc(
("what-it-is", "What MrBeast style captions are"),
("font", "The font"),
("settings", "The exact settings"),
("bounce", "The bounce"),
("by-hand", "Method 1: by hand"),
("plugin", "Method 2: free with Captions Gen"),
("tips", "Tips for better results"),
) + """
<h2 id="what-it-is">What MrBeast style captions are</h2>
<p>The look comes from the high-energy style of MrBeast's videos and the shorts cut from them. It feels like a comic book: big letters, bold colors and a lot of movement.</p>
<p>The motion can suit a hook, a reveal or a reaction. For a long stretch of dialogue, compare it with a calmer style at the size viewers will actually watch.</p>
""" + gfig("mrbeast-anatomy", "A MrBeast style caption with four labels: comic font in all caps, very thick outline and hard shadow, the spoken word in bright green, and one or two words at a time",
           "The four things that make the look.") + """
<h2 id="font">The font</h2>
<p>Two free fonts you can use to build a similar comic look:</p>
<ul>
<li><strong>Bangers</strong>: narrow comic letters with a slant.</li>
<li><strong>Luckiest Guy</strong>: round and chunky. Feels more like a game.</li>
</ul>
<p>Both are on Google Fonts. Restart Premiere Pro after you install them.</p>
""" + tip("Captions Gen bundles Bangers and Luckiest Guy. Beast Comic tries Komika Axis first if it's already installed, then uses one of those fallbacks. The website preview uses Bangers.") + """
<h2 id="settings">The exact settings</h2>
<p>These settings describe the Beast Comic preset. Its font depends on what's installed; the manual bounce below is a separate recipe.</p>
<table class="spec">
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Font</td><td>Komika Axis if installed; otherwise Bangers or Luckiest Guy</td></tr>
<tr><td>Case</td><td>ALL CAPS</td></tr>
<tr><td>Text color</td><td><span class="swatch" style="background:#ffffff"></span>White #FFFFFF</td></tr>
<tr><td>Outline</td><td><span class="swatch" style="background:#000000"></span>Black, very thick</td></tr>
<tr><td>Shadow</td><td>Black, hard edge, almost no blur</td></tr>
<tr><td>Spoken word</td><td><span class="swatch" style="background:#39FF14"></span>Neon green #39FF14, noticeably bigger</td></tr>
<tr><td>Words on screen</td><td>1 to 2</td></tr>
<tr><td>Animation</td><td>A bouncy pop on every word</td></tr>
</tbody>
</table>
<p>Other colors that fit the look: <span class="swatch" style="background:#F7C204"></span>yellow #F7C204 and <span class="swatch" style="background:#00E5FF"></span>cyan #00E5FF.</p>

<h2 id="bounce">The bounce</h2>
<p>The bounce is what makes the captions feel alive. Each word starts small, grows a little past full size, then settles.</p>
""" + gfig("bounce-animation", "The word YOUR at 80% size on frame 0, 110% on frame 3 and 100% on frame 5, with a curve showing the scale going past 100% and settling",
           "Small, then a little too big, then normal. All in about five frames.") + """
<p>That small overshoot is the trick. Without it, the word just grows and looks stiff.</p>

<h2 id="by-hand">Method 1: by hand in Premiere Pro</h2>
<ol>
<li><strong>Install the font.</strong> Get Bangers or Luckiest Guy and restart Premiere.</li>
<li><strong>Transcribe and create captions.</strong> In <kbd>Window</kbd> &gt; <kbd>Text</kbd>, transcribe the sequence. Choose the <em>Single Word</em> layout in Captioning Preferences if your version has it; otherwise split the caption text into one word per clip.</li>
<li><strong>Turn captions into graphics.</strong> Select them and choose <em>Graphics and Titles &gt; Upgrade Caption to Graphic</em>. Keep a native caption-track copy if you also need SRT.</li>
<li><strong>Style one graphic.</strong> In <kbd>Window &gt; Properties</kbd>, set a comic font, all caps, a thick black stroke and hard shadow. Save a <em>Linked Style</em> to reuse that appearance on the other graphics.</li>
<li><strong>Add the bounce.</strong> Keyframe each graphic's Scale: start at 80%, reach 110% a few frames later, then settle at 100%. Adjust the spacing to the speech and frame rate.</li>
<li><strong>Set the color.</strong> Give each one-word graphic a bright fill. For a green highlight moving across a multi-word line, split the line at each word boundary and change only the active word's color; scaling the whole line will not bounce just that word.</li>
</ol>
""" + note("A Scale keyframe affects the selected graphic. Animate separate word graphics when you want individual words to bounce. Review the full line again after changing the cut.") + """
<h2 id="plugin">Method 2: free with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> transcribes locally on the CPU and applies the preset's timing, color and bounce to editable Motion Graphics clips. It's currently free, without a watermark or time limit. Review the words and their timing after generation.</p>
""" + INSTALL + """
<p>Then make the captions:</p>
<ol start="4">
<li>On the <strong>Presets</strong> tab, tap <strong>Beast Comic</strong>.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
<p>Every word gets its own timing, color and bounce, as editable graphics on your timeline.</p>
""" + PANEL + """
<h3>Make it your own</h3>
<p>On the <strong>Customize</strong> tab you can:</p>
<ul>
<li>Change the highlight color.</li>
<li>Set <strong>Max words</strong> to 1 for a punchier feel.</li>
<li>Make the spoken word bigger with <strong>Highlight size</strong>.</li>
<li>Move the captions with <strong>Position from top</strong>.</li>
</ul>
<p>Use <strong>Save preset</strong> beside the preview, then <strong>Save as preset</strong> or <strong>Save as new preset</strong>. Open the saved tile's <strong>⋯</strong> menu and choose <strong>Make main preset</strong> to start there next time.</p>

<h3>Another option: Gamer</h3>
<p>The <strong>Gamer</strong> preset uses Luckiest Guy with a thick outline, hard shadow and cyan highlight. Try it on gaming and reaction footage.</p>
""" + fig("Gamer", "Gamer caption preset: USE YOUR in a chunky round font with YOUR in cyan", "Gamer: chunky letters and a bouncing cyan word.") + """
<h2 id="tips">Tips for better results</h2>
<ul>
<li><strong>Give big words their own screen.</strong> Numbers, money and names hit harder alone.</li>
<li><strong>Go bigger in the hook.</strong> Raise the text size for the first three seconds, then bring it back down.</li>
<li><strong>Keep the outline thick.</strong> On a busy background a thick outline reads better than a box behind the text.</li>
<li><strong>Mind the buttons.</strong> On Shorts, Reels and TikTok, keep captions above the bottom fifth of the frame.</li>
</ul>
""" + SAFE + """
<p class="sources">"MrBeast style" describes the look; Captions Gen isn't affiliated with MrBeast. Native workflow references: Adobe's <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html">Single Word captions</a> and <a href="https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/apply-linked-and-track-styles.html">Linked Styles in Properties</a>.</p>
""")


# ---------------------------------------------------------------- Templates
P3["free-caption-templates-premiere-pro"] = dict(
published="2026-10-22", modified="2026-11-08",
image="/img/guides/template-vs-preset.png",
title="Free Caption Templates for Premiere Pro: 18 Animated Presets",
desc="Free animated caption templates for Premiere Pro: karaoke highlights, pill boxes, comic and glow looks. How they differ from MOGRT text templates, and how to use them.",
h1="Free caption templates for Premiere Pro",
rel=["premiere-pro-caption-presets","hormozi-style-captions-premiere-pro","mrbeast-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
faq=[
("Are there free caption templates for Premiere Pro?",
 "Yes. Premiere includes Track Styles for native captions. A free MOGRT can supply a graphic design, though it doesn't transcribe speech by itself. Captions Gen is currently free with 18 built-in presets for animated caption graphics on Windows; the Adobe app is separate and paid."),
("What is the difference between a MOGRT and a caption preset?",
 "A MOGRT is a Motion Graphics Template that can expose editable text and design controls; it doesn't generate a transcript by itself. In Captions Gen, a preset combines design, grouping and animation settings for captions generated from speech."),
("How do I save my own caption template in Premiere Pro?",
 "In Premiere, style a native caption in Properties and save a Track Style. In Captions Gen, customize a look, open Save preset beside the preview, and choose Save as preset or Save as new preset. Its tile menu lets you export the preset to share."),
("Do the templates work in other languages?",
 "Captions Gen offers searchable spoken-language selection and compatible custom speech models. Accuracy and word timing vary by language and model. Choose a font that contains the script's characters and review the result; a preset does not translate speech."),
("Is there a watermark or time limit?",
 "The current free Captions Gen release has no watermark or transcription time limit. The email checkout needs no payment card. Paid features are planned for the future."),
],
body="""
<p>Looking for free caption templates for Premiere Pro? Most of what you'll find are MOGRT text templates. They look nice, but you still type and time every caption yourself.</p>
<p>This guide separates graphic templates, native caption styles and speech-driven plugin presets. It also covers the 18 currently free animated presets in Captions Gen for Premiere Pro on Windows.</p>
""" + tldr(
"MOGRT text templates: reusable graphics; text and timing need another workflow.",
"Premiere Track Styles: free and quick, but static. No word highlight or animation.",
"Captions Gen presets: combine text grouping, appearance and animation with locally generated word timings.",
"<a href=\"https://captionsgen.com/\">Captions Gen</a> has 18 free animated presets, with no time limit and no watermark (Windows).",
) + toc(
("kinds", "The three kinds of caption templates"),
("compare", "Side by side"),
("presets", "The 18 free presets"),
("use", "How to use them"),
("own", "Make your own template"),
("share", "Share it with your team"),
) + """
<h2 id="kinds">The three kinds of caption templates</h2>
""" + gfig("template-vs-preset", "Left: a text template timeline with one purple clip per caption, each to be typed by hand. Right: a caption preset timeline with many blue word clips lined up with the audio",
           "A text template is one clip per caption. A preset styles the whole transcript at once.") + """
<h3>1. MOGRT text templates</h3>
<p>A MOGRT (Motion Graphics Template) provides a reusable graphic, often with editable text and design controls. Add it to the timeline and fill in the controls its author exposed.</p>
<p>It can work well for a title or lower third. A MOGRT alone doesn't transcribe the dialogue or decide where every caption belongs, so plan how you'll supply and time the words.</p>

<h3>2. Premiere Track Styles</h3>
<p>Premiere Pro can save a caption look as a Track Style. It's free and applies to the whole caption track at once.</p>
<p>The catch: Track Styles are static. There's no highlight on the spoken word and no animation.</p>

<h3>3. Caption presets in a plugin</h3>
<p>Captions Gen transcribes your audio locally on the CPU, then uses its preset settings to group the words and build timed Motion Graphics clips. Some presets use spoken-word highlights; calmer ones use simpler text or fades.</p>
<p>Review the words and timing before delivery. The generated graphics render into the picture, so use a separate native caption track when you need SRT or closed captions.</p>

<h2 id="compare">Side by side</h2>
<table class="spec">
<thead><tr><th></th><th>MOGRT</th><th>Track Style</th><th>Plugin preset</th></tr></thead>
<tbody>
<tr><td>Transcribes speech itself</td><td>No</td><td>No; use Speech to Text first</td><td>Captions Gen does</td></tr>
<tr><td>Timing</td><td>You supply it</td><td>Existing caption timing, per phrase or Single Word</td><td>Generated word timing, then review</td></tr>
<tr><td>Spoken word highlight</td><td>Depends on template and timing work</td><td>No moving highlight within a line</td><td>Available in karaoke presets</td></tr>
<tr><td>Animation</td><td>Depends on template</td><td>No graphic keyframe animation</td><td>Available by preset</td></tr>
<tr><td>Best for</td><td>Titles</td><td>Plain subtitles</td><td>Social captions</td></tr>
</tbody>
</table>

<h2 id="presets">The 18 free presets</h2>
<p>Captions Gen comes with 18 presets, grouped by the kind of video they suit.</p>
""" + LOOKS + """
<h3>Trend looks</h3>
<table class="spec">
<thead><tr><th>Preset</th><th>Look</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Bold Impact</td><td>Heavy caps, yellow spoken word</td><td>Business, podcasts (<a href="hormozi-style-captions-premiere-pro.html">Hormozi style</a>)</td></tr>
<tr><td>Beast Comic</td><td>Comic font, green word, bounce</td><td>Challenges, vlogs (<a href="mrbeast-style-captions-premiere-pro.html">MrBeast style</a>)</td></tr>
<tr><td>Karaoke Pill</td><td>A rounded box slides behind the spoken word</td><td>Talking heads, tutorials</td></tr>
<tr><td>Karaoke</td><td>Two outlined lines, the word turns green</td><td>Interviews, longer sentences</td></tr>
<tr><td>Punch</td><td>Tall, narrow caps, yellow word</td><td>Motivation, sports</td></tr>
<tr><td>Gamer</td><td>Chunky font, cyan word, bounce</td><td>Gaming, reactions</td></tr>
<tr><td>Glow</td><td>Light caps with a soft cyan glow</td><td>Music, night shots, tech</td></tr>
</tbody>
</table>
""" + fig("Karaoke-Pill", "Karaoke Pill caption preset: a purple rounded box behind the spoken word SHIELD", "Karaoke Pill: a rounded box slides behind the spoken word.") + """
<h3>Clean looks</h3>
<table class="spec">
<thead><tr><th>Preset</th><th>Look</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Podcast</td><td>Sentence case, yellow word</td><td>Podcast clips</td></tr>
<tr><td>Minimal</td><td>Lowercase grey, the word turns white</td><td>Calm, aesthetic edits</td></tr>
<tr><td>Subtitle Box</td><td>White text on a dark box</td><td>Busy backgrounds, long videos</td></tr>
<tr><td>Serif Story</td><td>Lowercase serif</td><td>Storytelling, documentaries</td></tr>
<tr><td>Clean Fade, Clean, Plain</td><td>Simple text, soft or no animation</td><td>Corporate, education</td></tr>
</tbody>
</table>

<h3>Motion looks</h3>
<table class="spec">
<thead><tr><th>Preset</th><th>Look</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Typewriter</td><td>Text types on</td><td>Quotes, reveals</td></tr>
<tr><td>Spring</td><td>Words spring into place</td><td>Upbeat edits</td></tr>
<tr><td>Rise</td><td>Words rise in, like a lyric video</td><td>Music, voice-overs</td></tr>
<tr><td>Smooth</td><td>A soft slide</td><td>Vlogs, travel</td></tr>
</tbody>
</table>
""" + tip("The installer bundles Montserrat, Anton, Bangers, Luckiest Guy, Inter and DM Serif Display. Bold Impact can also use an installed The Bold Font; Beast Comic can use an installed Komika Axis. The website preview uses the bundled fallbacks.") + """
<h2 id="use">How to use them</h2>
""" + INSTALL + """
<ol start="4">
<li>Tap a preset on the <strong>Presets</strong> tab. The big preview plays it.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
<p>Your captions appear as editable graphics above your clip. Review names, line breaks and word highlights before exporting.</p>
""" + PANEL + """
<p>Changed your mind about the look? Pick another preset and click <strong>Apply style to placed captions</strong>. The captions restyle without transcribing again.</p>

<h2 id="own">Make your own template</h2>
<p>Most editors build one style for their channel and use it on every video. Here's how:</p>
<ol>
<li>Pick the preset that's closest to what you want.</li>
<li>Open <strong>Customize</strong> and change the font, colors, size, outline, shadow or animation.</li>
<li>Open <strong>Save preset</strong> beside the preview, choose <strong>Save as preset</strong> or <strong>Save as new preset</strong>, and give it a name.</li>
<li>Open the saved tile's <strong>⋯</strong> menu and choose <strong>Make main preset</strong>. The panel opens on that preset next time.</li>
</ol>

<h2 id="share">Share it with your team</h2>
<p>Open a preset's <strong>⋯</strong> menu to export it as a small file. On another computer, click <strong>Import</strong> to add it.</p>
<p>It's the easy way to keep the same caption style across a channel, a team or a client's videos.</p>
<p>The <a href="/news/captions-gen-1-1-9.html">1.1.9 combined Windows installer</a> also offers an After Effects panel, tested with After Effects 2026 on Windows 11. It creates native editable caption layers and shares the engine and Models folder with Premiere. The instructions above cover Premiere Pro.</p>
""")


# ---------------------------------------------------------------- AutoCut
P3["autocut-alternative-captions"] = dict(
published="2026-10-22", modified="2026-11-08",
image="/img/styles/Bold-Impact.png",
title="Free AutoCut Alternative for Captions in Premiere Pro (2026)",
desc="Compare AutoCut's paid caption workflow with currently free Captions Gen for Premiere Pro on Windows: animated graphics, local transcription and honest limits.",
h1="A free AutoCut alternative for captions",
rel=["submagic-alternative-premiere-pro","best-caption-plugin-premiere-pro","free-caption-plugin-premiere-pro","animated-captions-premiere-pro"],
faq=[
("Is AutoCut free?",
 "AutoCut advertises a 14-day free trial without a credit card. Continued AutoCaptions use needs a paid plan; check the current AI Plan quote and billing period on its pricing page. Vendor pages reviewed 8 November 2026."),
("What is a free AutoCut alternative for captions?",
 "For Premiere Pro 25.6 or newer on supported 64-bit Windows, Captions Gen is currently free without a time limit or watermark. It creates animated Motion Graphics clips using local CPU transcription. It doesn't cut silences or switch podcast cameras."),
("Is there a free AutoCut alternative for DaVinci Resolve or Mac?",
 "Captions Gen's public installer is for Premiere Pro and After Effects on Windows. It doesn't include DaVinci Resolve support or a Mac installer. For ordinary subtitles on Mac, check the native caption tools in the editor you already use."),
("Can I use AutoCut and Captions Gen together?",
 "You can try finishing the cut in AutoCut before generating captions with Captions Gen. Keep a project copy and test a short section first; this guide does not establish compatibility between every version or feature of the two plugins."),
("Does Captions Gen upload my footage?",
 "Captions Gen doesn't upload audio or video for transcription. It uses local CPU models; downloading missing models and checking for updates still need an internet connection."),
],
body="""
<p>If you use AutoCut mainly for animated captions, Captions Gen offers a currently free alternative in Premiere Pro on Windows. It creates editable Motion Graphics clips with local CPU transcription, without a watermark or transcription time limit.</p>
<p>If captions are all you need, you don't have to pay for a whole editing suite. Here's how AutoCut compares with a free alternative for captions.</p>
""" + tldr(
"AutoCaptions is a paid AutoCut feature after its 14-day trial; check the current AI Plan price before buying.",
"<a href=\"https://captionsgen.com/\">Captions Gen</a> makes animated, word-by-word captions in Premiere Pro for free. No time limit, no watermark.",
"AutoCut does a lot more: silence cutting, zooms, B-roll. Captions Gen is captions only.",
"AutoCut supports Premiere Pro and DaVinci Resolve on Windows and Mac. Captions Gen supports Premiere Pro and After Effects on Windows.",
) + toc(
("what", "What AutoCut is"),
("cost", "What AutoCut captions cost"),
("compare", "AutoCut vs Captions Gen"),
("autocut-better", "When AutoCut is the better pick"),
("captionsgen-better", "When Captions Gen is the better pick"),
("switch", "How to switch"),
("both", "Using both together"),
) + note("I make Captions Gen, so read this with that in mind. AutoCut's pricing and AutoCaptions pages were reviewed on 8 November 2026. This comparison is about caption workflows, not a test of every AutoCut feature.") + """
<h2 id="what">What AutoCut is</h2>
<p>AutoCut is a set of AI editing tools that run inside Premiere Pro and DaVinci Resolve. The main ones:</p>
<ul>
<li><strong>AutoCut Silences:</strong> removes pauses and dead air.</li>
<li><strong>AutoPodcast:</strong> switches between podcast cameras by who's talking.</li>
<li><strong>AutoZoom:</strong> adds punch-in zooms.</li>
<li><strong>AutoCaptions:</strong> adds animated captions.</li>
</ul>
<p>It's a strong tool if you use several of those. If you only want captions, you're paying for a lot you don't use.</p>

<h2 id="cost">What AutoCut captions cost</h2>
<p>AutoCut lists a <strong>Basic</strong> plan for silence removal and an <strong>AI Plan</strong> for its wider editing features, including captions. It advertises a 14-day trial with no credit card. Check the <a href="https://www.autocut.com/en/pricing/">current pricing page</a> for the quote, billing period and taxes that apply to you.</p>
<p>Captions Gen is currently free, with no subscription. Its download uses an email checkout, with no payment card. Premiere Pro and After Effects are separate paid Adobe applications, and paid Captions Gen features are planned for the future.</p>
<h2 id="compare">AutoCut vs Captions Gen</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>AutoCut</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Price for captions</td><td>Paid AI Plan; see current vendor quote</td><td>Currently free</td></tr>
<tr><td>Free option</td><td>14-day trial, no card</td><td>Current free release has no time limit or watermark</td></tr>
<tr><td>Animated word-by-word captions</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>Presets</td><td>Editable presets in Standard and Advanced modes; see vendor examples</td><td>18 built-ins, plus your own saved presets</td></tr>
<tr><td>Silence cutting, zooms, B-roll</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No, captions only</span></td></tr>
<tr><td>Premiere Pro</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>DaVinci Resolve</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No</span></td></tr>
<tr><td>Mac</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>Windows only</span></td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p>The <a href="/news/captions-gen-1-1-9.html">Captions Gen 1.1.9 Windows setup</a> also offers After Effects or Both. The After Effects panel has been tested with After Effects 2026 on Windows 11; earlier versions aren't certified for this release. Both panels share the engine and Models folder. The steps below are for Premiere Pro.</p>
<p class="sources">Sources reviewed 8 November 2026: <a href="https://www.autocut.com/en/pricing/" rel="nofollow">AutoCut plans and trial</a> and <a href="https://www.autocut.com/en/autocaptions/" rel="nofollow">AutoCaptions features and supported editors</a>. Check the vendor's live quote before buying.</p>

<h2 id="autocut-better">When AutoCut is the better pick</h2>
<ul>
<li>You also want silence cutting, zooms or podcast camera switching.</li>
<li>You edit on a Mac or in DaVinci Resolve.</li>
<li>You already pay for the AI Plan. Try its captions before adding another tool.</li>
</ul>

<h2 id="captionsgen-better">When Captions Gen is the better pick</h2>
<ul>
<li><strong>You only need captions.</strong> No subscription for one feature.</li>
<li><strong>You need local transcription.</strong> Captions Gen doesn't upload your audio or video for transcription.</li>
<li><strong>You reuse one style.</strong> Save your look and choose <em>Make main preset</em> from its tile menu.</li>
<li><strong>You want to restyle later.</strong> Pick another preset and apply it to captions you already placed.</li>
</ul>
""" + fig("Bold-Impact", "Bold Impact caption preset: USE YOUR SHIELD in heavy white caps with SHIELD in yellow", "Bold Impact, one of the 18 free presets.") + """
<h2 id="switch">How to switch</h2>
<p>Try a short copy of a finished sequence first. Initial setup time includes downloading the speech models.</p>
""" + INSTALL + """
<ol start="4">
<li>Pick a look on the <strong>Presets</strong> tab.</li>
<li>Change colors or size on <strong>Customize</strong> if you like.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
""" + PANEL + """
<h2 id="both">Using both together</h2>
<p>A workflow to test is finishing the cut with AutoCut, then adding captions with Captions Gen. Keep a project copy; this isn't a compatibility guarantee for every combination of plugin versions.</p>
<ol>
<li>Cut your video with AutoCut as usual.</li>
<li>Select the final clip and generate captions with Captions Gen.</li>
</ol>
""" + tip("Add captions last. If you change the cut afterwards, generate again so the timing stays right.") + """
""")


# ---------------------------------------------------------------- Submagic
P3["submagic-alternative-premiere-pro"] = dict(
published="2026-10-22", modified="2026-11-08",
image="/img/guides/web-app-round-trip.png",
title="Free Submagic Alternative for Premiere Pro (No Watermark)",
desc="Submagic is a web app with plans from $19/month and length limits. Captions Gen adds Submagic-style animated captions inside Premiere Pro for free, without uploading.",
h1="A free Submagic alternative for Premiere Pro",
rel=["autocut-alternative-captions","mrbeast-style-captions-premiere-pro","hormozi-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
faq=[
("Is Submagic free?",
 "Submagic offers a trial for uploading and editing three short videos; its help page says no-watermark downloads require a subscription. The pricing page lists Starter, Pro and Business at $19, $39 and $69 per member per month with monthly billing, reviewed 8 November 2026. Yearly billing has different rates."),
("Is there a free Submagic alternative without a watermark?",
 "Captions Gen is currently free without a watermark or transcription time limit for Premiere Pro 25.6 or newer on supported 64-bit Windows. The download uses an email checkout, with no payment card. Adobe Premiere Pro is separate and paid."),
("Does Submagic work inside Premiere Pro?",
 "Submagic's editor runs in the browser rather than as a Premiere panel. You upload media and download the result. Submagic also advertises SRT export for text and timing; that file doesn't carry its animated graphic appearance."),
("Can I get Submagic-style captions in Premiere Pro?",
 "You can make similar comic, bold-highlight and pill-background looks with Captions Gen's Beast Comic, Bold Impact and Karaoke Pill presets. These are Captions Gen designs, not copies of Submagic templates, and they remain editable graphics on the Premiere timeline."),
("Is my footage uploaded with Captions Gen?",
 "Captions Gen doesn't upload audio or video for transcription. Faster Whisper runs locally on the CPU. Missing speech models download and are cached; update checks also use the internet."),
],
body="""
<p>For an alternative to Submagic inside Premiere Pro, Captions Gen creates animated caption graphics directly on your timeline. It's currently free on Windows and transcribes on the CPU without uploading your audio or video.</p>
<p>Submagic is a browser editor with captioning and other editing tools. The useful choice is whether you want a web workflow with those extras or editable graphics in the Premiere project you already use.</p>
""" + tldr(
"Submagic runs in the browser. Monthly-billed plans list $19, $39 or $69 per member, with different video-length limits.",
"Its trial lets you upload and edit three short videos; no-watermark downloads require a subscription.",
"<a href=\"https://captionsgen.com/\">Captions Gen</a> adds Submagic-style captions inside Premiere Pro for free, with no watermark and no length limit.",
"Submagic also adds B-roll, emojis and sound effects. Captions Gen is captions only, on Windows.",
) + toc(
("how", "How Submagic works"),
("compare", "Submagic vs Captions Gen"),
("why", "Why editors look for an alternative"),
("submagic-better", "When Submagic is the better pick"),
("looks", "Get the same looks in Premiere"),
("steps", "Step by step"),
) + note("I make Captions Gen, so read this with that in mind. Submagic's pricing, trial and export pages were reviewed on 8 November 2026. This comparison covers the caption workflow, not a benchmark of transcription accuracy.") + """
<h2 id="how">How Submagic works</h2>
<p>Submagic is a website, not a Premiere Pro plugin. The workflow looks like this:</p>
<ol>
<li>Export your video from your editor.</li>
<li>Upload it to Submagic.</li>
<li>Pick a caption style and fix the words.</li>
<li>Download the video with the captions burned in.</li>
<li>Import it back into Premiere if you want to keep editing.</li>
</ol>
<p>Submagic also advertises <strong>SRT export</strong>. An SRT can bring text and timings into Premiere's native caption workflow, but it doesn't transfer animated highlights, backgrounds or bounce effects. A downloaded video contains the rendered animation in its picture.</p>
""" + gfig("web-app-round-trip", "Rendered-video workflow: export from Premiere, upload to a web editor, add captions, download the rendered video and import it back. Captions Gen generates graphics in the Premiere project",
           "Rendered animated video needs a round trip. An SRT handoff carries text and timing instead of that animation.") + """
<h2 id="compare">Submagic vs Captions Gen</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>Submagic</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Where it runs</td><td>Browser editor</td><td>Premiere panel; After Effects panel also available on Windows</td></tr>
<tr><td>Price</td><td>$19, $39 or $69/member/month with monthly billing; yearly rates differ</td><td>Currently free</td></tr>
<tr><td>Free option</td><td>Trial for 3 short uploads; subscription for no-watermark downloads</td><td>No time limit or watermark in the current free release</td></tr>
<tr><td>Video length</td><td>Up to 2, 5 or 30 minutes by plan</td><td>No transcription time cap; processing depends on hardware and audio</td></tr>
<tr><td>Your footage</td><td>Uploaded for the web workflow</td><td>No audio or video upload for transcription</td></tr>
<tr><td>Handoff and later edits</td><td>Rendered animated video, or SRT text/timing without animation</td><td>Editable Motion Graphics clips in Premiere</td></tr>
<tr><td>Extras</td><td>B-roll, zooms, emojis, sound effects and more</td><td>Captions only</td></tr>
<tr><td>Mac</td><td>Web workflow in a supported browser</td><td>No public Mac installer</td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p class="sources">Sources reviewed 8 November 2026: <a href="https://www.submagic.co/pricing" rel="nofollow">Submagic pricing</a>, <a href="https://care.submagic.co/en/article/does-submagic-have-a-free-trial-7opyg3/" rel="nofollow">three-video trial</a>, and <a href="https://www.submagic.co/video-to-text" rel="nofollow">SRT export</a>. Dollar prices are the US-dollar listing; check the current billing term, regional price and taxes before buying.</p>
<h2 id="why">Why editors look for an alternative</h2>
<ul>
<li><strong>The rendered-video round trip.</strong> Changes to the underlying cut may require another export and upload. An SRT handoff avoids baking in the text, but loses the animation.</li>
<li><strong>Length caps.</strong> Longer videos need a bigger plan.</li>
<li><strong>Client footage.</strong> Some clients don't want their footage uploaded to another service.</li>
<li><strong>Graphic edits.</strong> A typo in a rendered animated video needs another render. An SRT can be edited as native caption text, with a separate styling workflow.</li>
</ul>

<h2 id="submagic-better">When Submagic is the better pick</h2>
<ul>
<li>You want to work in a browser, or you edit on a Mac where Captions Gen has no public installer.</li>
<li>You want one tool that also adds B-roll, emojis and sound effects to a talking-head clip.</li>
</ul>

<h2 id="looks">Build similar looks in Premiere</h2>
<p>These Captions Gen presets give you starting points for common caption designs. They don't import or reproduce Submagic templates exactly:</p>
<table class="spec">
<thead><tr><th>The look you want</th><th>Preset to pick</th></tr></thead>
<tbody>
<tr><td>Heavy caps, yellow spoken word</td><td>Bold Impact</td></tr>
<tr><td>Comic font, bouncing green word</td><td>Beast Comic</td></tr>
<tr><td>Colored box behind the spoken word</td><td>Karaoke Pill</td></tr>
<tr><td>Two lines, the word turns green</td><td>Karaoke</td></tr>
<tr><td>Soft glowing text</td><td>Glow</td></tr>
<tr><td>Calm, sentence case</td><td>Podcast</td></tr>
</tbody>
</table>
""" + LOOKS + """
<h2 id="steps">Step by step</h2>
""" + INSTALL + """
<ol start="4">
<li>Pick a preset on the <strong>Presets</strong> tab.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
""" + PANEL + """
<p>Changed the cut? Generate again. Want a different look? Pick another preset and click <strong>Apply style to placed captions</strong>. You never leave Premiere Pro.</p>
""" + tip("Captions Gen places captions as separate graphics, not burned into the video. You can fix a typo on the timeline at any time.") + """
<p>The <a href="/news/captions-gen-1-1-9.html">1.1.9 setup</a> can also install an After Effects panel, tested with After Effects 2026 on Windows 11. It creates native editable caption layers. There is no public Mac installer or translation feature.</p>
""")
