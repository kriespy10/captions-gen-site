# -*- coding: utf-8 -*-
# Guides added for the free release (October 2026). Imported by genblog.py.
# Same fields as bodies2.py, plus "published" (datePublished) and "image".
P3 = {}

def fig(name, alt, cap):
    return (f'<figure class="caption-example"><img src="/img/styles/{name}.png" width="1280" height="480" '
            f'loading="lazy" alt="{alt}"><figcaption>{cap}</figcaption></figure>')

P3["hormozi-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/styles/Bold-Impact.png",
title="Hormozi-Style Captions in Premiere Pro (Free Preset)",
desc="How to make Hormozi-style captions in Premiere Pro: big bold caps, a few words at a time, the spoken word in yellow or green. By hand, or free in one click.",
h1="Hormozi-style captions in Premiere Pro",
rel=["mrbeast-style-captions-premiere-pro","free-caption-templates-premiere-pro","word-by-word-captions-premiere-pro"],
body="""
<p>Quick answer: "Hormozi-style" captions are heavy uppercase words, two or three at a time, white with a thick black outline, and the word being spoken flips to yellow or green with a small pop. Premiere Pro can't highlight the spoken word on a caption track, so you either build each word as a graphic by hand or use a plugin that generates them. <a href="https://captionsgen.com/">Captions Gen</a> does it in one click with its free <strong>Bold Impact</strong> preset.</p>
""" + fig("Bold-Impact", "Bold Impact caption preset: USE YOUR SHIELD in heavy white caps with SHIELD highlighted in yellow", "The Bold Impact preset in Captions Gen: heavy caps, black outline, the spoken word in yellow.") + """
<h2>What makes the look</h2>
<ul>
<li><strong>Font:</strong> a heavy geometric sans in all caps. Montserrat Black or ExtraBold is the usual pick; Anton works for a taller, condensed version.</li>
<li><strong>Few words:</strong> two or three words on screen, centred in the lower-middle of a vertical frame, so the eye never has to read a full line.</li>
<li><strong>Contrast:</strong> white fill, a thick black stroke and a hard drop shadow, so the text reads over any shot.</li>
<li><strong>The spoken word:</strong> changes color (yellow and green are the classics) and scales up slightly the moment it is said.</li>
<li><strong>Snappy timing:</strong> each group of words appears exactly on the first syllable and leaves on the last.</li>
</ul>

<h2>Doing it by hand in Premiere Pro</h2>
<ol>
<li>Transcribe the sequence and create captions with a short maximum length (Text panel, Captions, Create captions, then set the line length low).</li>
<li>Style the caption track: Montserrat Black, all caps, white, a 6 to 10 px black stroke and a shadow. Save it as a Track Style.</li>
<li>For the highlight, right-click the captions and choose <em>Upgrade Caption to Graphic</em>. Each caption becomes a graphic clip.</li>
<li>In every graphic, color the spoken word and keyframe a small scale-up. Then split each clip at the start of the next word and move the color along.</li>
</ol>
<p>Steps 1 and 2 take a few minutes. Step 4 is the slow part: a 60-second short has around 150 words, so it means a few hundred cuts and color changes, and a retake means doing them again.</p>

<h2>Doing it with Captions Gen (free)</h2>
<ol>
<li>Install <a href="__FREE__">Captions Gen</a> (Windows 10/11, Premiere Pro 25.0 or newer) and open it from Window, UXP Plugins.</li>
<li>Select the clip with the voice in your timeline.</li>
<li>On the <strong>Presets</strong> tab, tap <strong>Bold Impact</strong>. The preview shows the look on sample words.</li>
<li>Optional: on <strong>Customize</strong>, switch the highlight to green, change the size or how many words show at once, then save it as your own preset.</li>
<li>Press <strong>Generate</strong>. Captions Gen transcribes on your computer and places word-timed, editable graphics on the track above your clip.</li>
</ol>
<p>Want it taller and more condensed? The <strong>Punch</strong> preset uses Anton with a yellow spoken word. Prefer green? <strong>Karaoke</strong> turns the spoken word green over two outlined lines.</p>
""" + fig("Punch", "Punch caption preset: tall condensed caps with the spoken word in yellow", "Punch: the same idea in a tall condensed font.") + """
<h2>Tips that make it look right</h2>
<ul>
<li>Keep it to three words or fewer. The look falls apart as a full sentence.</li>
<li>Place the captions in the middle third of a 9:16 frame, above TikTok's and Reels' bottom buttons.</li>
<li>Use one highlight color per video. Switching between yellow and green in one edit looks accidental.</li>
<li>Check the transcript for names and jargon before you style anything. Fixing a word after the graphics exist takes longer.</li>
</ul>
<p>"Hormozi-style" is the name editors use for this look, after the videos that made it popular. Captions Gen isn't affiliated with him; the preset is simply named after what it looks like.</p>
""")

P3["mrbeast-style-captions-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/styles/Beast-Comic.png",
title="MrBeast-Style Captions in Premiere Pro (Free Preset)",
desc="Make MrBeast-style captions in Premiere Pro: a comic font, one or two words at a time, a thick outline and a bouncing colored word. By hand or free in one click.",
h1="MrBeast-style captions in Premiere Pro",
rel=["hormozi-style-captions-premiere-pro","free-caption-templates-premiere-pro","captions-for-tiktok-reels-shorts-premiere-pro"],
body="""
<p>Quick answer: MrBeast-style captions use a loud comic or cartoon font, only one or two words at a time, a very thick black outline and a hard shadow, and the spoken word in a bright color that bounces in. In Premiere Pro you can build it by hand with graphics, or get it in one click with the free <strong>Beast Comic</strong> preset in <a href="https://captionsgen.com/">Captions Gen</a>.</p>
""" + fig("Beast-Comic", "Beast Comic caption preset: USE YOUR in a comic font with YOUR highlighted in bright green", "The Beast Comic preset: comic font, thick outline, the spoken word in green.") + """
<h2>What makes the look</h2>
<ul>
<li><strong>Font:</strong> a bold comic face such as Bangers or Luckiest Guy. Both are free Google Fonts.</li>
<li><strong>One or two words:</strong> fewer words than Hormozi-style captions, so each one lands like a punchline.</li>
<li><strong>Outline and shadow:</strong> a stroke of 10 px or more and a solid shadow with no blur, so the text looks like a sticker.</li>
<li><strong>Bounce:</strong> each word drops or scales in with a small overshoot.</li>
<li><strong>Color:</strong> the spoken word in neon green, yellow or cyan.</li>
</ul>

<h2>Doing it by hand in Premiere Pro</h2>
<ol>
<li>Install Bangers or Luckiest Guy from Google Fonts and restart Premiere.</li>
<li>Create captions from the transcript with the shortest line length, then <em>Upgrade Caption to Graphic</em>.</li>
<li>Style one graphic: the comic font, all caps, a thick black stroke and a hard shadow. Save it as a Master Style and apply it to the rest.</li>
<li>For each word, keyframe Scale from about 80% to 110% to 100% over five or six frames, and color the spoken word.</li>
</ol>
<p>It looks great and takes a long time: the bounce and color have to be set for every word, and a 60-second video has around 150 of them.</p>

<h2>Doing it with Captions Gen (free)</h2>
<ol>
<li>Install <a href="__FREE__">Captions Gen</a>. The installer adds Bangers and Luckiest Guy for you.</li>
<li>Select your clip in the timeline.</li>
<li>On <strong>Presets</strong>, tap <strong>Beast Comic</strong>. For a chunkier font with a cyan word, try <strong>Gamer</strong>.</li>
<li>Press <strong>Generate</strong>. Every word gets its own timing, color and bounce, as editable graphics.</li>
</ol>
""" + fig("Gamer", "Gamer caption preset: USE YOUR in a chunky font with YOUR in cyan", "Gamer: a chunkier font, a huge outline and a bouncing cyan word.") + """
<h2>Tips</h2>
<ul>
<li>Put the biggest words, like numbers and money, on their own so they get the full screen.</li>
<li>Bump the size up for the hook in the first three seconds, then bring it back down.</li>
<li>If the background is busy, keep the outline thick rather than adding a box behind the text.</li>
</ul>
<p>"MrBeast-style" is the name editors use for this look. Captions Gen isn't affiliated with MrBeast; the preset is named after the look itself.</p>
""")

P3["free-caption-templates-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/styles/Karaoke-Pill.png",
title="Free Caption Templates for Premiere Pro: 18 Animated Presets",
desc="Free animated caption templates for Premiere Pro: karaoke highlights, pill boxes, comic and glow looks. How they differ from MOGRT text templates and how to use them.",
h1="Free caption templates for Premiere Pro",
rel=["premiere-pro-caption-presets","hormozi-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
body="""
<p>Quick answer: most free "caption templates" for Premiere Pro are MOGRT text templates. You still type or paste every caption and time it yourself. <a href="https://captionsgen.com/">Captions Gen</a> is a free plugin with 18 animated caption presets that are applied to your transcript automatically, word by word, with no time limit and no watermark. Windows only for now.</p>

<h2>Text templates vs caption presets</h2>
<p>A MOGRT from a template site is one animated title. Great for a lower third, slow for captions: 150 words means dozens of template clips to fill in and line up with the audio. A caption preset is a style that gets applied to every word of a transcript at once, with the timing taken from the speech.</p>
<p>Premiere's own Track Styles are free caption presets too, but they are static: one look for the whole line, no highlight on the spoken word and no animation.</p>

<h2>The 18 free presets in Captions Gen</h2>
<p><strong>Trend looks:</strong> Bold Impact (heavy caps, yellow spoken word), Beast Comic (comic font, green word, bounce), Karaoke Pill (a rounded box slides behind the spoken word), Karaoke (two outlined lines, the word turns green), Punch (tall condensed caps), Gamer (chunky font, cyan word) and Glow (light caps with a cyan glow).</p>
""" + fig("Karaoke-Pill", "Karaoke Pill caption preset: a purple rounded box behind the spoken word SHIELD", "Karaoke Pill: a rounded box slides behind the spoken word.") + """
<p><strong>Clean looks:</strong> Podcast (sentence case, yellow word), Minimal (lowercase grey, the word turns white), Subtitle Box (white text on a dark box), Clean Fade, Serif Story (lowercase serif for storytelling), Clean and Plain.</p>
""" + fig("Glow", "Glow caption preset: light caps with a cyan glow on the spoken word", "Glow: light caps with a soft cyan glow.") + """
<p><strong>Motion looks:</strong> Typewriter, Spring, Rise (lyric-video style) and Smooth.</p>
<p>The installer adds the free fonts these looks use (Montserrat, Anton, Bangers, Luckiest Guy, Inter and DM Serif Display), so they look the same on your machine as in the preview.</p>

<h2>How to use them</h2>
<ol>
<li>Download <a href="__FREE__">Captions Gen</a> and run the installer.</li>
<li>In Premiere Pro, open Window, UXP Plugins, Captions Gen, and select the clip with the voice.</li>
<li>Tap a preset on the <strong>Presets</strong> tab. The big preview plays it.</li>
<li>Tweak colors, size and how many words show at once on <strong>Customize</strong>, and save it as your own preset. Star it to make it the one the panel opens on.</li>
<li>Press <strong>Generate</strong>. Changed your mind later? Pick another look and use <strong>Apply style to placed captions</strong>.</li>
</ol>

<h2>Share a template with your team</h2>
<p>A preset's ⋯ menu can export it as a small file, and <strong>Import</strong> adds it on another computer. It's the easy way to keep one caption style across a channel or a client's videos.</p>
""")

P3["autocut-alternative-captions"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/styles/Bold-Impact.png",
title="Free AutoCut Alternative for Captions in Premiere Pro",
desc="Only need AutoCut for captions? AutoCaptions needs the $19.80/month AI Plan. Captions Gen makes animated word-by-word captions in Premiere Pro for free.",
h1="A free AutoCut alternative for captions",
rel=["submagic-alternative-premiere-pro","best-caption-plugin-premiere-pro","free-caption-plugin-premiere-pro"],
body="""
<p>Quick answer: AutoCut is a Premiere Pro and DaVinci Resolve extension that does a lot more than captions: silence cutting, podcast camera switching, auto zooms, B-roll and more. Its AutoCaptions feature is only in the AI Plan ($19.80 a month, or $178.80 a year). If captions are what you need, <a href="https://captionsgen.com/">Captions Gen</a> makes animated, word-by-word captions inside Premiere Pro for free, with no time limit and no watermark.</p>
<p>I make Captions Gen, so read this with that in mind. The AutoCut facts below come from AutoCut's own pages, checked on 22 October 2026.</p>

<h2>AutoCut vs Captions Gen for captions</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>AutoCut</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Price for captions</td><td>AI Plan, $19.80/month or $178.80/year</td><td>Free</td></tr>
<tr><td>Free option</td><td>14-day trial, no card</td><td>Free, no time limit, no watermark</td></tr>
<tr><td>Animated word-by-word captions</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>Presets</td><td>Editable presets; 90+ in Advanced AutoCaptions</td><td>18 presets, plus your own saved presets</td></tr>
<tr><td>Transcription</td><td>Not stated on its site</td><td>Local, on your computer</td></tr>
<tr><td>Silence cutting, zooms, B-roll</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No, captions only</span></td></tr>
<tr><td>Premiere Pro</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark yes"><i>✓</i>Yes</span></td></tr>
<tr><td>DaVinci Resolve</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>No</span></td></tr>
<tr><td>Mac</td><td><span class="mark yes"><i>✓</i>Yes</span></td><td><span class="mark no"><i>✕</i>Windows only</span></td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p class="sources">Sources: <a href="https://www.autocut.com/en/pricing/" rel="nofollow">AutoCut pricing</a>, <a href="https://autocut.com/en/autocaptions" rel="nofollow">AutoCaptions</a>, <a href="https://www.autocut.com/en/blogs/how-to-activate-autocut-free-trial/" rel="nofollow">AutoCut free trial</a>. Prices in US dollars before tax; check the vendor's site before buying.</p>

<h2>When AutoCut is the better pick</h2>
<ul>
<li>You also want silence cutting, auto zooms or multicam podcast switching. That's AutoCut's core, and Captions Gen doesn't do it.</li>
<li>You edit on a Mac or in DaVinci Resolve.</li>
<li>You already pay for the AI Plan: try its captions before adding another tool.</li>
</ul>

<h2>When Captions Gen is the better pick</h2>
<ul>
<li>You only need captions and don't want a subscription for them.</li>
<li>You want your audio to stay on your computer: Captions Gen transcribes locally.</li>
<li>You build one caption style and reuse it on every video: save it as a preset, star it, and every Generate uses it.</li>
</ul>

<h2>Switching takes five minutes</h2>
<ol>
<li><a href="__FREE__">Download Captions Gen</a> and run the installer (Windows 10/11, Premiere Pro 25.0+).</li>
<li>Open Window, UXP Plugins, Captions Gen and select your clip.</li>
<li>Pick a look on Presets, adjust it on Customize, and press Generate.</li>
</ol>
<p>You can keep AutoCut for cutting and use Captions Gen for the captions. They don't get in each other's way.</p>
""")

P3["submagic-alternative-premiere-pro"] = dict(
published="2026-10-22", modified="2026-10-22",
image="/img/styles/Beast-Comic.png",
title="Free Submagic Alternative Inside Premiere Pro (No Watermark)",
desc="Submagic is a web app with paid plans from $19/month and length limits per video. Captions Gen adds animated captions inside Premiere Pro for free, without uploading.",
h1="A free Submagic alternative inside Premiere Pro",
rel=["autocut-alternative-captions","mrbeast-style-captions-premiere-pro","free-caption-plugin-premiere-pro"],
body="""
<p>Quick answer: Submagic is a web app. You upload a video, it adds animated captions, and you download the result. Paid plans start at $19 a month, each plan caps how long a video can be, and the free tier covers three short videos. If you edit in Premiere Pro, <a href="https://captionsgen.com/">Captions Gen</a> puts the same kind of animated captions straight on your timeline, for free, without uploading anything.</p>
<p>I make Captions Gen, so read this with that in mind. The Submagic facts come from Submagic's own pricing and help pages, checked on 22 October 2026.</p>

<h2>Submagic vs Captions Gen</h2>
<div class="ptable-wrap">
<table class="ptable">
<thead><tr><th></th><th>Submagic</th><th>Captions Gen</th></tr></thead>
<tbody>
<tr><td>Where it runs</td><td>In the browser (web app)</td><td>Inside Premiere Pro</td></tr>
<tr><td>Price</td><td>$19, $39 or $69/month ($12, $23 or $41/month billed yearly)</td><td>Free</td></tr>
<tr><td>Free option</td><td>3 short videos; paid plans export without a watermark</td><td>Free, no time limit, no watermark</td></tr>
<tr><td>Video length</td><td>Up to 2, 5 or 30 minutes by plan</td><td>No limit</td></tr>
<tr><td>Your footage</td><td>Uploaded (up to 3,000 MB)</td><td>Stays on your computer</td></tr>
<tr><td>Captions you can edit later</td><td>In Submagic, before export</td><td>Editable graphics on your Premiere timeline</td></tr>
<tr><td>Extras</td><td>B-roll, zooms, emojis, sound effects and more</td><td>Captions only</td></tr>
<tr><td>Mac</td><td><span class="mark yes"><i>✓</i>Any browser</span></td><td><span class="mark no"><i>✕</i>Windows only</span></td></tr>
</tbody>
</table>
</div>
<div class="ptable-legend"><span>On a phone, swipe the table sideways.</span></div>
<p class="sources">Sources: <a href="https://www.submagic.co/pricing" rel="nofollow">Submagic pricing</a>, <a href="https://care.submagic.co/en/article/7opyg3/" rel="nofollow">Submagic free plan</a>, <a href="https://care.submagic.co/en/article/gl84of/" rel="nofollow">Submagic upload limits</a>. Prices in US dollars; check the vendor's site before buying.</p>

<h2>Why editors look for an alternative</h2>
<ul>
<li><strong>The round trip.</strong> Export from Premiere, upload, caption, download, import, and do it again after every change to the cut.</li>
<li><strong>Length caps.</strong> Longer videos need a bigger plan.</li>
<li><strong>Client footage.</strong> Some clients don't want their footage uploaded to another service.</li>
</ul>

<h2>When Submagic is the better pick</h2>
<ul>
<li>You don't edit in Premiere Pro, or you work on a Mac.</li>
<li>You want one tool that also adds B-roll, emojis and sound effects to a talking-head clip.</li>
</ul>

<h2>Getting Submagic-style captions in Premiere</h2>
<ol>
<li><a href="__FREE__">Download Captions Gen</a> and install it (Windows 10/11, Premiere Pro 25.0+).</li>
<li>Select your clip in Premiere and pick a preset: <strong>Beast Comic</strong> for the bouncy comic look, <strong>Bold Impact</strong> for heavy caps with a yellow word, <strong>Karaoke Pill</strong> for a box behind the spoken word.</li>
<li>Press Generate. When you change the cut, generate again or use <strong>Apply style to placed captions</strong>, without leaving Premiere.</li>
</ol>
""")
