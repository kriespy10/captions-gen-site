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
    return ('<nav class="toc" aria-label="On this page"><p class="t">On this page</p><ol>'
            + "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items) + "</ol></nav>")

def tip(text):
    return f'<p class="tip"><b>Tip:</b> {text}</p>'

def note(text):
    return f'<p class="note"><b>Note:</b> {text}</p>'

PANEL = gfig("panel-steps.jpg", "The Captions Gen panel: pick a look on the Presets tab, then change the highlight color and size on the Customize tab",
             "Step 1: pick a look on Presets. Step 2: make it yours on Customize. Then press Generate.")
SAFE = gfig("vertical-safe-zone", "A 9:16 phone frame with the caption area marked in green, and the bottom and right edge marked in red where TikTok, Reels and Shorts put their buttons",
            "Keep captions out of the red areas on TikTok, Reels and Shorts.")
COST = gfig("caption-tool-cost", "Bar chart of yearly cost: AutoCut AI Plan monthly $237.60, Submagic Starter monthly $228, AutoCut AI Plan yearly $178.80, Submagic Starter yearly $144, Captions Gen $0",
            "What a caption tool costs over a year, at list prices checked 22 October 2026.")
LOOKS = gfig("preset-looks.jpg", "Six caption presets: Bold Impact, Karaoke Pill, Beast Comic, Glow, Punch and Gamer",
             "Six of the 18 free presets, as they look in Premiere Pro.")
INSTALL = """<ol>
<li><a href="__FREE__">Download Captions Gen</a> and run the installer. It needs Windows 10 or 11 and Premiere Pro 25.0 or newer.</li>
<li>Open Premiere Pro and go to <kbd>Window</kbd> &gt; <kbd>UXP Plugins</kbd> &gt; <kbd>Captions Gen</kbd>.</li>
<li>Select the clip with the voice in your timeline.</li>
</ol>"""


# ---------------------------------------------------------------- Hormozi
P3["hormozi-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/guides/hormozi-anatomy.png",
title="Hormozi Style Captions in Premiere Pro: Font, Settings and Free Preset",
desc="How to make Hormozi style captions in Premiere Pro: the font, the exact settings, the yellow word highlight and where to place them. By hand, or free in one click.",
h1="Hormozi style captions in Premiere Pro",
rel=["mrbeast-style-captions-premiere-pro","free-caption-templates-premiere-pro","word-by-word-captions-premiere-pro","highlight-words-in-captions-premiere-pro"],
faq=[
("What font is used for Hormozi captions?",
 "Editors usually recreate the look with Montserrat Black or Montserrat ExtraBold in all caps. Both are free Google Fonts. Anton is a good choice if you want taller, narrower letters."),
("Can Premiere Pro make Hormozi captions without a plugin?",
 "Partly. Premiere can transcribe and style a caption track, but it can't color the spoken word. For that you upgrade the captions to graphics and change each word by hand, which takes a long time."),
("Is there a free Hormozi captions preset for Premiere Pro?",
 "Yes. Captions Gen is a free plugin for Premiere Pro on Windows. Its Bold Impact preset gives you heavy caps with the spoken word in yellow, and Punch gives a taller version."),
("Can I change the yellow to green?",
 "Yes. In Captions Gen, open the Customize tab and pick a different highlight color. Save it as your own preset so every video uses it."),
("Can I still edit the captions after generating them?",
 "Yes. Captions Gen places normal graphic clips on your timeline. You can fix a word, move a clip or delete one like any other graphic."),
("Does it work on Mac or in CapCut?",
 "Captions Gen is Windows only for now and works inside Premiere Pro. CapCut has its own caption styles, so you don't need a plugin there."),
],
body="""
<p>Hormozi style captions are the big, bold captions you see on almost every business and podcast short. Two or three words at a time, heavy white caps with a black outline, and the word being spoken turns yellow.</p>
<p>This guide shows you what makes the look, the exact settings, and two ways to make it in Premiere Pro: by hand, or free in one click.</p>
""" + tldr(
"Font: Montserrat Black or ExtraBold, all caps.",
"Style: white text, thick black outline, a soft shadow.",
"Highlight: the spoken word turns yellow (or green) and pops a little.",
"Length: two or three words on screen at a time.",
"Premiere can't highlight the spoken word by itself. A plugin like <a href=\"https://captionsgen.com/\">Captions Gen</a> does it for free.",
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
<p>The style is named after Alex Hormozi, whose short videos made it popular. Today it's one of the most copied caption looks on TikTok, Instagram Reels and YouTube Shorts.</p>
<p>It works because it's easy to read with the sound off. The eye only has to take in a couple of words, and the color shows exactly where the speaker is.</p>
""" + gfig("hormozi-anatomy", "A Hormozi style caption with four labels: heavy font in all caps, thick black outline and shadow, the spoken word in yellow, and only two or three words on screen",
           "The four things that make the look.") + """
<h2 id="font">The font</h2>
<p>The look needs a heavy, wide font in all caps. These free fonts all work:</p>
<ul>
<li><strong>Montserrat Black</strong>: the most common pick. Wide, round and very bold.</li>
<li><strong>Montserrat ExtraBold</strong>: a little lighter if Black feels too heavy.</li>
<li><strong>Anton</strong>: tall and narrow. Fits more letters on a vertical frame.</li>
</ul>
<p>All three are on Google Fonts. Install the font, then restart Premiere Pro so it shows up in the font list.</p>
""" + tip("Captions Gen installs Montserrat and Anton for you, so the presets look the same on your computer as in the preview.") + """
<h2 id="settings">The exact settings</h2>
<p>These are the settings of the Bold Impact preset in Captions Gen. Use them as a starting point if you build the look by hand.</p>
<table class="spec">
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Font</td><td>Montserrat Black</td></tr>
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
<p>So a three-word caption is really three versions of the same caption, one after the other. A 60-second video has around 150 spoken words, so that's 150 color changes.</p>

<h2 id="by-hand">Method 1: by hand in Premiere Pro</h2>
<p>This works with Premiere alone. It's fine for one short video, but slow if you post often.</p>
<ol>
<li><strong>Transcribe.</strong> Open <kbd>Window</kbd> &gt; <kbd>Text</kbd>, then click <em>Transcribe sequence</em>.</li>
<li><strong>Create short captions.</strong> Click <em>Create captions</em> and set a low maximum length so you get two or three words per caption.</li>
<li><strong>Style the track.</strong> Select the captions and set the font, caps, white fill, black stroke and shadow from the table above. Save it as a Track Style.</li>
<li><strong>Turn captions into graphics.</strong> Right-click the captions and choose <em>Upgrade Caption to Graphic</em>.</li>
<li><strong>Color each word.</strong> In each graphic, make the spoken word yellow. Cut the clip where the next word starts and move the color along.</li>
<li><strong>Add the pop.</strong> Keyframe the scale from about 100% to 110% and back over a few frames.</li>
</ol>
""" + note("Steps 5 and 6 are the slow part: a few hundred cuts and color changes for one minute of video. A new take means doing them again.") + """
<h2 id="plugin">Method 2: free with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> is a free plugin that does all six steps for you. It transcribes on your computer and places word-timed captions on your timeline.</p>
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
<p>Happy with it? Click <strong>Save as new</strong> and star it. The panel opens on your starred preset next time, so every video gets the same look.</p>

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
<li><strong>Typos in names.</strong> Check the transcript before you style anything. Captions Gen can show you the transcript first: turn on <em>Check transcript before generating</em>.</li>
</ul>
<p class="sources">"Hormozi style" is the name editors use for this look. Captions Gen isn't affiliated with Alex Hormozi; the preset is named after what it looks like.</p>
""")


# ---------------------------------------------------------------- MrBeast
P3["mrbeast-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/guides/mrbeast-anatomy.png",
title="MrBeast Style Captions in Premiere Pro: Font, Bounce and Free Preset",
desc="How to make MrBeast style captions in Premiere Pro: the comic font, thick outline, bouncing green word and the right settings. By hand, or free in one click.",
h1="MrBeast style captions in Premiere Pro",
rel=["hormozi-style-captions-premiere-pro","free-caption-templates-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro","animated-captions-premiere-pro"],
faq=[
("What font is used for MrBeast captions?",
 "Editors usually recreate the look with a bold comic font such as Bangers or Luckiest Guy. Both are free on Google Fonts."),
("How do I make words bounce in Premiere Pro?",
 "Keyframe the Scale of each word: about 80% on the first frame, about 110% two or three frames later, then 100%. Captions Gen does this for every word automatically."),
("Is there a free MrBeast captions preset for Premiere Pro?",
 "Yes. Captions Gen is a free plugin for Premiere Pro on Windows. Its Beast Comic preset uses Bangers with a green bouncing word, and Gamer uses Luckiest Guy with a cyan word."),
("Should I use MrBeast style captions on long YouTube videos?",
 "Use them for the big moments, like the hook, numbers and reveals. For a whole long video, a calmer style such as Podcast or Subtitle Box is easier to watch."),
("Does it work on Mac?",
 "Captions Gen is Windows only for now. On a Mac you can still build the look by hand with the steps in this guide."),
],
body="""
<p>MrBeast style captions are loud, fun and hard to miss. A comic font, one or two words at a time, a very thick outline, and the spoken word in a bright color that bounces in.</p>
<p>This guide covers the font, the settings, the bounce, and how to make the look in Premiere Pro: by hand, or free in one click.</p>
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
<p>It's built to grab attention in the first seconds of a short, which is why gaming, challenge and reaction channels use it a lot.</p>
""" + gfig("mrbeast-anatomy", "A MrBeast style caption with four labels: comic font in all caps, very thick outline and hard shadow, the spoken word in bright green, and one or two words at a time",
           "The four things that make the look.") + """
<h2 id="font">The font</h2>
<p>You need a bold, slightly playful font. These two free fonts are the usual picks:</p>
<ul>
<li><strong>Bangers</strong>: narrow comic letters with a slant. Closest to the classic look.</li>
<li><strong>Luckiest Guy</strong>: round and chunky. Feels more like a game.</li>
</ul>
<p>Both are on Google Fonts. Restart Premiere Pro after you install them.</p>
""" + tip("The Captions Gen installer adds Bangers and Luckiest Guy for you.") + """
<h2 id="settings">The exact settings</h2>
<p>These are the settings of the Beast Comic preset in Captions Gen.</p>
<table class="spec">
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Font</td><td>Bangers</td></tr>
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
<li><strong>Transcribe and create captions.</strong> In <kbd>Window</kbd> &gt; <kbd>Text</kbd>, transcribe the sequence and create captions with the shortest line length.</li>
<li><strong>Turn captions into graphics.</strong> Right-click them and choose <em>Upgrade Caption to Graphic</em>.</li>
<li><strong>Style one graphic.</strong> Comic font, all caps, thick black stroke, hard shadow. Save it as a Master Style and apply it to the rest.</li>
<li><strong>Add the bounce.</strong> For each word, keyframe Scale: 80% on the first frame, 110% on frame 3, 100% on frame 5.</li>
<li><strong>Color the spoken word.</strong> Make it green, and move the color along as the next word starts.</li>
</ol>
""" + note("This looks great but takes a long time. The bounce and color need setting for every word, and a 60-second video has around 150 of them.") + """
<h2 id="plugin">Method 2: free with Captions Gen</h2>
<p><a href="https://captionsgen.com/">Captions Gen</a> is a free plugin that does the transcript, timing, color and bounce for you.</p>
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
<p>Save it as your own preset and star it, so it's ready for the next video.</p>

<h3>Another option: Gamer</h3>
<p>The <strong>Gamer</strong> preset uses Luckiest Guy with an even thicker outline and a cyan word. Great for gaming and reaction videos.</p>
""" + fig("Gamer", "Gamer caption preset: USE YOUR in a chunky round font with YOUR in cyan", "Gamer: chunky letters and a bouncing cyan word.") + """
<h2 id="tips">Tips for better results</h2>
<ul>
<li><strong>Give big words their own screen.</strong> Numbers, money and names hit harder alone.</li>
<li><strong>Go bigger in the hook.</strong> Raise the text size for the first three seconds, then bring it back down.</li>
<li><strong>Keep the outline thick.</strong> On a busy background a thick outline reads better than a box behind the text.</li>
<li><strong>Mind the buttons.</strong> On Shorts, Reels and TikTok, keep captions above the bottom fifth of the frame.</li>
</ul>
""" + SAFE + """
<p class="sources">"MrBeast style" is the name editors use for this look. Captions Gen isn't affiliated with MrBeast; the preset is named after what it looks like.</p>
""")


# ---------------------------------------------------------------- Templates
P3["free-caption-templates-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/guides/template-vs-preset.png",
title="Free Caption Templates for Premiere Pro: 18 Animated Presets",
desc="Free animated caption templates for Premiere Pro: karaoke highlights, pill boxes, comic and glow looks. How they differ from MOGRT text templates, and how to use them.",
h1="Free caption templates for Premiere Pro",
rel=["premiere-pro-caption-presets","hormozi-style-captions-premiere-pro","mrbeast-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
faq=[
("Are there free caption templates for Premiere Pro?",
 "Yes. Premiere's own Track Styles are free but static. Free MOGRT text templates work for titles but need typing for every caption. Captions Gen is a free plugin with 18 animated caption presets that apply to your whole transcript."),
("What is the difference between a MOGRT and a caption preset?",
 "A MOGRT is one animated text clip that you fill in by hand. A caption preset is a style that gets applied to every word of a transcript at once, with the timing taken from the voice."),
("How do I save my own caption template in Premiere Pro?",
 "In Premiere, style a caption and save it as a Track Style. In Captions Gen, change a preset on the Customize tab and click Save as new. You can export it as a file to share."),
("Do the templates work in other languages?",
 "Yes. Captions Gen transcribes with Whisper, which supports about 100 languages, and the presets work the same in any of them."),
("Is there a watermark or time limit?",
 "No. Captions Gen is free now, with no time limit and no watermark."),
],
body="""
<p>Looking for free caption templates for Premiere Pro? Most of what you'll find are MOGRT text templates. They look nice, but you still type and time every caption yourself.</p>
<p>This guide explains the three kinds of free caption templates, which one saves the most time, and how to use 18 free animated presets in Premiere Pro.</p>
""" + tldr(
"MOGRT text templates: free and pretty, but one clip per caption, filled in by hand.",
"Premiere Track Styles: free and quick, but static. No word highlight or animation.",
"Caption presets in a plugin: style and time every word of the transcript in one click.",
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
<p>A MOGRT (Motion Graphics Template) is a single animated text clip. You download it, drag it onto your timeline and type your words in.</p>
<p>That's perfect for a title or a lower third. For captions it's slow: a 60-second video needs about 50 of them, each typed and lined up with the voice.</p>

<h3>2. Premiere Track Styles</h3>
<p>Premiere Pro can save a caption look as a Track Style. It's free and applies to the whole caption track at once.</p>
<p>The catch: Track Styles are static. There's no highlight on the spoken word and no animation.</p>

<h3>3. Caption presets in a plugin</h3>
<p>A caption plugin transcribes your clip and applies a preset to every word. The words, timing, highlight and animation all come from one click.</p>
<p>This is the fastest way to get animated captions, and it's what Captions Gen does.</p>

<h2 id="compare">Side by side</h2>
<table class="spec">
<thead><tr><th></th><th>MOGRT</th><th>Track Style</th><th>Plugin preset</th></tr></thead>
<tbody>
<tr><td>Words typed for you</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Timed to the voice</td><td>No</td><td>Per line</td><td>Per word</td></tr>
<tr><td>Spoken word highlight</td><td>No</td><td>No</td><td>Yes</td></tr>
<tr><td>Animation</td><td>Yes</td><td>No</td><td>Yes</td></tr>
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
""" + tip("The installer adds the free fonts these presets use (Montserrat, Anton, Bangers, Luckiest Guy, Inter and DM Serif Display), so your captions match the preview.") + """
<h2 id="use">How to use them</h2>
""" + INSTALL + """
<ol start="4">
<li>Tap a preset on the <strong>Presets</strong> tab. The big preview plays it.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
<p>Your captions appear on the track above your clip, timed word by word.</p>
""" + PANEL + """
<p>Changed your mind about the look? Pick another preset and click <strong>Apply style to placed captions</strong>. The captions restyle without transcribing again.</p>

<h2 id="own">Make your own template</h2>
<p>Most editors build one style for their channel and use it on every video. Here's how:</p>
<ol>
<li>Pick the preset that's closest to what you want.</li>
<li>Open <strong>Customize</strong> and change the font, colors, size, outline, shadow or animation.</li>
<li>Click <strong>Save as new</strong> and give it a name.</li>
<li>Star it. The panel now opens on your preset every time.</li>
</ol>

<h2 id="share">Share it with your team</h2>
<p>Open a preset's <strong>⋯</strong> menu to export it as a small file. On another computer, click <strong>Import</strong> to add it.</p>
<p>It's the easy way to keep the same caption style across a channel, a team or a client's videos.</p>
""")


# ---------------------------------------------------------------- AutoCut
P3["autocut-alternative-captions"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/guides/caption-tool-cost.png",
title="Free AutoCut Alternative for Captions in Premiere Pro (2026)",
desc="Only need AutoCut for captions? AutoCaptions needs the $19.80/month AI Plan. Captions Gen makes animated word-by-word captions in Premiere Pro for free.",
h1="A free AutoCut alternative for captions",
rel=["submagic-alternative-premiere-pro","best-caption-plugin-premiere-pro","free-caption-plugin-premiere-pro","animated-captions-premiere-pro"],
faq=[
("Is AutoCut free?",
 "No. AutoCut has a 14-day free trial with no card needed. After that, its captions feature (AutoCaptions) is part of the AI Plan at $19.80 a month or $178.80 a year (checked 22 October 2026)."),
("What is the best free AutoCut alternative for captions?",
 "If you edit in Premiere Pro on Windows, Captions Gen is free with no time limit and no watermark. It makes animated, word-by-word captions on your timeline. It doesn't cut silences."),
("Is there a free AutoCut alternative for DaVinci Resolve or Mac?",
 "Captions Gen works only in Premiere Pro on Windows for now. DaVinci Resolve Studio has its own built-in subtitles, and Premiere Pro on Mac has built-in captions without word highlights."),
("Can I use AutoCut and Captions Gen together?",
 "Yes. Use AutoCut to cut silences and zoom, then Captions Gen to add the captions. They don't get in each other's way."),
("Does Captions Gen upload my footage?",
 "No. It transcribes on your computer. Your audio and video don't leave your machine."),
],
body="""
<p>AutoCut is a popular extension for Premiere Pro and DaVinci Resolve. It cuts silences, switches podcast cameras, adds zooms and more. It also makes captions, but only on its paid AI Plan.</p>
<p>If captions are all you need, you don't have to pay for a whole editing suite. Here's how AutoCut compares with a free alternative for captions.</p>
""" + tldr(
"AutoCut's captions (AutoCaptions) need the AI Plan: $19.80 a month or $178.80 a year.",
"<a href=\"https://captionsgen.com/\">Captions Gen</a> makes animated, word-by-word captions in Premiere Pro for free. No time limit, no watermark.",
"AutoCut does a lot more: silence cutting, zooms, B-roll. Captions Gen is captions only.",
"Captions Gen is Windows and Premiere Pro only. AutoCut also runs on Mac and DaVinci Resolve.",
) + toc(
("what", "What AutoCut is"),
("cost", "What AutoCut captions cost"),
("compare", "AutoCut vs Captions Gen"),
("autocut-better", "When AutoCut is the better pick"),
("captionsgen-better", "When Captions Gen is the better pick"),
("switch", "How to switch"),
("both", "Using both together"),
) + note("I make Captions Gen, so read this with that in mind. The AutoCut facts below come from AutoCut's own pages, checked on 22 October 2026.") + """
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
<p>AutoCaptions is part of the <strong>AI Plan</strong>. That's $19.80 a month, or $178.80 if you pay for the year. There's a 14-day free trial with no card needed.</p>
""" + COST + """
<h2 id="compare">AutoCut vs Captions Gen</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>AutoCut</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Price for captions</td><td>AI Plan, $19.80/month or $178.80/year</td><td>Free</td></tr>
<tr><td>Free option</td><td>14-day trial, no card</td><td>Free, no time limit, no watermark</td></tr>
<tr><td>Animated word-by-word captions</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>Presets</td><td>Editable presets; 90+ in Advanced AutoCaptions</td><td>18 presets, plus your own saved presets</td></tr>
<tr><td>Transcription</td><td>Not stated on its site</td><td>On your computer</td></tr>
<tr><td>Silence cutting, zooms, B-roll</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No, captions only</span></td></tr>
<tr><td>Premiere Pro</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>DaVinci Resolve</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No</span></td></tr>
<tr><td>Mac</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>Windows only</span></td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p class="sources">Sources: <a href="https://www.autocut.com/en/pricing/" rel="nofollow">AutoCut pricing</a>, <a href="https://autocut.com/en/autocaptions" rel="nofollow">AutoCaptions</a>, <a href="https://www.autocut.com/en/blogs/how-to-activate-autocut-free-trial/" rel="nofollow">AutoCut free trial</a>. Prices in US dollars before tax; check the vendor's site before buying.</p>

<h2 id="autocut-better">When AutoCut is the better pick</h2>
<ul>
<li>You also want silence cutting, zooms or podcast camera switching.</li>
<li>You edit on a Mac or in DaVinci Resolve.</li>
<li>You already pay for the AI Plan. Try its captions before adding another tool.</li>
</ul>

<h2 id="captionsgen-better">When Captions Gen is the better pick</h2>
<ul>
<li><strong>You only need captions.</strong> No subscription for one feature.</li>
<li><strong>You want your footage to stay private.</strong> Captions Gen transcribes on your computer.</li>
<li><strong>You reuse one style.</strong> Save your look as a preset, star it, and every video gets it.</li>
<li><strong>You want to restyle later.</strong> Pick another preset and apply it to captions you already placed.</li>
</ul>
""" + fig("Bold-Impact", "Bold Impact caption preset: USE YOUR SHIELD in heavy white caps with SHIELD in yellow", "Bold Impact, one of the 18 free presets.") + """
<h2 id="switch">How to switch</h2>
<p>It takes about five minutes.</p>
""" + INSTALL + """
<ol start="4">
<li>Pick a look on the <strong>Presets</strong> tab.</li>
<li>Change colors or size on <strong>Customize</strong> if you like.</li>
<li>Press <strong>Generate</strong>.</li>
</ol>
""" + PANEL + """
<h2 id="both">Using both together</h2>
<p>You don't have to choose. You can keep AutoCut for cutting and use Captions Gen for the captions.</p>
<ol>
<li>Cut your video with AutoCut as usual.</li>
<li>Select the final clip and generate captions with Captions Gen.</li>
</ol>
""" + tip("Add captions last. If you change the cut afterwards, generate again so the timing stays right.") + """
""")


# ---------------------------------------------------------------- Submagic
P3["submagic-alternative-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/guides/web-app-round-trip.png",
title="Free Submagic Alternative for Premiere Pro (No Watermark)",
desc="Submagic is a web app with plans from $19/month and length limits. Captions Gen adds Submagic-style animated captions inside Premiere Pro for free, without uploading.",
h1="A free Submagic alternative for Premiere Pro",
rel=["autocut-alternative-captions","mrbeast-style-captions-premiere-pro","hormozi-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
faq=[
("Is Submagic free?",
 "Submagic's free plan covers three short videos. Paid plans cost $19, $39 or $69 a month, or $12, $23 or $41 a month billed yearly (checked 22 October 2026)."),
("Is there a free Submagic alternative without a watermark?",
 "Yes. Captions Gen is free with no watermark and no time limit. It works inside Premiere Pro on Windows."),
("Does Submagic work inside Premiere Pro?",
 "No. Submagic is a web app. You export your video, upload it, add captions and download the result."),
("Can I get Submagic-style captions in Premiere Pro?",
 "Yes. Captions Gen has presets for the same popular looks, such as Beast Comic, Bold Impact and Karaoke Pill, and places them on your timeline as editable graphics."),
("Is my footage uploaded with Captions Gen?",
 "No. Captions Gen transcribes on your computer. Nothing is uploaded."),
],
body="""
<p>Submagic is a popular web app for animated captions on short videos. You upload a clip, it adds captions, and you download the result.</p>
<p>If you already edit in Premiere Pro, there's a simpler way: add the same kind of captions right on your timeline, for free, without uploading anything.</p>
""" + tldr(
"Submagic runs in the browser. Plans cost $19 to $69 a month, with a cap on video length.",
"Its free plan covers three short videos.",
"<a href=\"https://captionsgen.com/\">Captions Gen</a> adds Submagic-style captions inside Premiere Pro for free, with no watermark and no length limit.",
"Submagic also adds B-roll, emojis and sound effects. Captions Gen is captions only, on Windows.",
) + toc(
("how", "How Submagic works"),
("compare", "Submagic vs Captions Gen"),
("why", "Why editors look for an alternative"),
("submagic-better", "When Submagic is the better pick"),
("looks", "Get the same looks in Premiere"),
("steps", "Step by step"),
) + note("I make Captions Gen, so read this with that in mind. The Submagic facts come from Submagic's own pricing and help pages, checked on 22 October 2026.") + """
<h2 id="how">How Submagic works</h2>
<p>Submagic is a website, not a Premiere Pro plugin. The workflow looks like this:</p>
<ol>
<li>Export your video from your editor.</li>
<li>Upload it to Submagic.</li>
<li>Pick a caption style and fix the words.</li>
<li>Download the video with the captions burned in.</li>
<li>Import it back into Premiere if you want to keep editing.</li>
</ol>
""" + gfig("web-app-round-trip", "Two workflows: a web app needs export, upload, add captions, download and import back, again after every change. Captions Gen needs select your clip, pick a preset, generate",
           "A web app means a round trip. A plugin keeps you in Premiere Pro.") + """
<h2 id="compare">Submagic vs Captions Gen</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>Submagic</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Where it runs</td><td>In the browser (web app)</td><td>Inside Premiere Pro</td></tr>
<tr><td>Price</td><td>$19, $39 or $69/month ($12, $23 or $41/month billed yearly)</td><td>Free</td></tr>
<tr><td>Free option</td><td>3 short videos; paid plans export without a watermark</td><td>Free, no time limit, no watermark</td></tr>
<tr><td>Video length</td><td>Up to 2, 5 or 30 minutes by plan</td><td>No limit</td></tr>
<tr><td>Your footage</td><td>Uploaded (up to 3,000 MB)</td><td>Stays on your computer</td></tr>
<tr><td>Edit captions later</td><td>In Submagic, before export</td><td>Editable graphics on your Premiere timeline</td></tr>
<tr><td>Extras</td><td>B-roll, zooms, emojis, sound effects and more</td><td>Captions only</td></tr>
<tr><td>Mac</td><td><span class="mark yes"><i>✓</i>Any browser</span></td><td><span class="mark no"><i>✕</i>Windows only</span></td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p class="sources">Sources: <a href="https://www.submagic.co/pricing" rel="nofollow">Submagic pricing</a>, <a href="https://care.submagic.co/en/article/7opyg3/" rel="nofollow">Submagic free plan</a>, <a href="https://care.submagic.co/en/article/gl84of/" rel="nofollow">Submagic upload limits</a>. Prices in US dollars; check the vendor's site before buying.</p>
""" + COST + """
<h2 id="why">Why editors look for an alternative</h2>
<ul>
<li><strong>The round trip.</strong> Every change to the cut means exporting, uploading and downloading again.</li>
<li><strong>Length caps.</strong> Longer videos need a bigger plan.</li>
<li><strong>Client footage.</strong> Some clients don't want their footage uploaded to another service.</li>
<li><strong>Burned-in captions.</strong> Once downloaded, a typo means going back to the web app.</li>
</ul>

<h2 id="submagic-better">When Submagic is the better pick</h2>
<ul>
<li>You don't edit in Premiere Pro, or you work on a Mac.</li>
<li>You want one tool that also adds B-roll, emojis and sound effects to a talking-head clip.</li>
</ul>

<h2 id="looks">Get the same looks in Premiere</h2>
<p>The most popular Submagic-style looks have a matching free preset in Captions Gen:</p>
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
""")
