"""Generate the After Effects product landing from the maintained public facts.

Importing this module has no side effects. genproduct.generate owns publication
of the generated page alongside the existing product surfaces.
"""
import json
from datetime import date
from html import escape
from pathlib import Path

from product import PRODUCT, SITE, organization_schema, software_schema

ROOT = Path(__file__).resolve().parents[1]
FILENAME = "after-effects.html"
URL = f"{SITE}/{FILENAME}"
PUBLISHED = "2026-11-09"
UPDATED = "2026-11-09"
TITLE = "Free After Effects Caption Plugin | Captions Gen"
DESCRIPTION = (
    "Create editable animated captions in After Effects on Windows. "
    "Captions Gen is currently free, with local transcription, no watermark and no time cap."
)


def faq_entries():
    """One source supplies both the visible questions and their structured data."""
    p = PRODUCT
    return [
        (
            "Is Captions Gen free for After Effects?",
            "Yes. The current Windows plugin is free, with no watermark, subscription "
            "or transcription time cap. Its download checkout asks for an email address "
            "without a payment card. Adobe After Effects is a separate paid application. "
            "Paid Captions Gen features are planned for the future.",
        ),
        (
            "Which After Effects and Windows versions are supported?",
            p.get("after_effects_compatibility", p["compatibility"])
            + " This public release does not include a Mac installer. Meet Adobe's "
            "requirements for the installed application, with memory available for the speech model.",
        ),
        (
            "Does my audio or video leave my computer for transcription?",
            p["network"],
        ),
        (
            "Can I correct the captions and change their design?",
            "Yes. Use the After Effects panel's Captions tab to correct text. "
            "Save caption updates the text and animation together. After a manual Source Text edit, "
            "use Update animation where offered and review word timing. Appearance-only "
            "Apply style changes reuse the existing timing; changing caption grouping "
            "can require transcription again.",
        ),
        (
            "Can Captions Gen import SRT or translate subtitles?",
            "This public release creates animated caption layers from speech. It does not "
            "import SRT, convert native subtitle tracks or translate speech. The animation "
            "renders into the picture. Use a separate subtitle workflow when delivery requires "
            "an SRT file, selectable subtitles or broadcast captions.",
        ),
        (
            "Do I also need to install the Premiere Pro panel?",
            "No. Choose After Effects in the Windows setup if that is the panel you need. "
            "You can choose Both to install the Premiere Pro panel too. The panels share "
            "one speech engine and Models folder; the Adobe applications are separate paid products.",
        ),
    ]


def after_effects_page():
    p = PRODUCT
    ae_compatibility = p.get("after_effects_compatibility", p["compatibility"])
    released = date.fromisoformat(p["released"]).strftime("%d %B %Y").lstrip("0")
    updated = date.fromisoformat(UPDATED).strftime("%d %B %Y").lstrip("0")
    published = date.fromisoformat(PUBLISHED).strftime("%d %B %Y").lstrip("0")
    dates = f'Page published <time datetime="{PUBLISHED}">{published}</time>.'
    if UPDATED != PUBLISHED:
        dates += f' Updated <time datetime="{UPDATED}">{updated}</time>.'
    questions = faq_entries()
    schema = [
        organization_schema(),
        software_schema(),
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": URL + "#webpage",
            "url": URL,
            "name": TITLE,
            "description": DESCRIPTION,
            "datePublished": PUBLISHED,
            "dateModified": UPDATED,
            "mainEntity": {"@id": f"{SITE}/#software"},
            "publisher": {"@id": f"{SITE}/#organization"},
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "After Effects plugin", "item": URL},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": question,
                 "acceptedAnswer": {"@type": "Answer", "text": answer}}
                for question, answer in questions
            ],
        },
    ]
    faq_html = "\n".join(
        f'<details><summary>{escape(question)}</summary><p>{escape(answer)}</p></details>'
        for question, answer in questions
    )
    checkout = escape(p["checkout"], quote=True)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(TITLE)}</title>
<meta name="description" content="{escape(DESCRIPTION, quote=True)}">
<link rel="canonical" href="{URL}">
<meta property="og:title" content="{escape(TITLE, quote=True)}">
<meta property="og:description" content="{escape(DESCRIPTION, quote=True)}">
<meta property="og:url" content="{URL}">
<meta property="og:type" content="website">
<meta property="og:image" content="{SITE}/img/styles/Bold-Impact.png">
<meta property="og:image:alt" content="Captions Gen Bold Impact caption style with a yellow spoken-word highlight">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/captions-gen-logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="/analytics.css">
<link rel="stylesheet" href="/after-effects.css">
<script defer src="/analytics.js"></script>
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body class="ae-page">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="wrap main-nav" aria-label="Main navigation">
    <a class="brand" href="/"><img src="/img/captions-gen-logo.svg" width="34" height="34" alt="">Captions Gen</a>
    <div class="nav-links"><a href="#output">What you get</a><a href="#requirements">Requirements</a><a href="/blog/how-to-add-captions-in-after-effects.html">Setup guide</a><a class="nav-download" href="{checkout}" target="_blank" rel="noopener">Download free</a></div>
  </nav>
</header>
<main id="main" tabindex="-1">
  <section class="hero wrap" aria-labelledby="page-title">
    <div class="hero-copy">
      <p class="eyebrow">After Effects <span aria-hidden="true">/</span> Windows</p>
      <h1 id="page-title">Animated <span>captions</span> for After Effects.</h1>
      <p class="lede">Captions Gen is a currently free After Effects caption plugin. Transcribe speech locally on your CPU and create editable animated caption layers in your composition.</p>
      <p class="free-line"><span>No watermark</span><span>No transcription time cap</span></p>
      <div class="hero-actions"><a class="button" href="{checkout}" target="_blank" rel="noopener">Download free <small>Windows setup {escape(p['version'])}</small></a><a class="text-link" href="/blog/how-to-add-captions-in-after-effects.html">Read the full setup guide <span aria-hidden="true">↗</span></a></div>
      <p class="download-note">Email checkout. No payment card. After Effects is a separate paid Adobe application.</p>
      <p class="compatibility-note">{escape(ae_compatibility)}</p>
    </div>
    <figure class="hero-preview">
      <div class="preview-label"><span class="status-dot" aria-hidden="true"></span>Bold Impact <span>Caption style preview</span></div>
      <img src="/img/styles/Bold-Impact.png" width="1280" height="480" fetchpriority="high" alt="Bold Impact caption render reading Use Your Shield, with Shield highlighted in yellow">
      <figcaption>A rendered caption style. The built-in designs are available in both Adobe panels.</figcaption>
      <ul class="preview-facts" aria-label="Caption features"><li><strong>18</strong>built-in presets</li><li><strong>Local</strong>CPU transcription</li><li><strong>Editable</strong>caption layers</li></ul>
    </figure>
  </section>

  <section class="section section-bordered" id="output" aria-labelledby="output-heading">
    <div class="wrap">
      <div class="section-intro"><p class="eyebrow">Inside your composition</p><h2 id="output-heading">A caption design you can keep editing.</h2><p>Generate from supported selected audio or video layers, then review the words and timing in your project. The caption treatment becomes part of the picture when you render.</p></div>
      <div class="feature-grid">
        <article class="feature"><span class="feature-number" aria-hidden="true">01</span><h3>Follow the spoken word</h3><p>Keep a phrase visible with an active-word color, size change or moving pill. Choose a preset and review its highlight against the voice.</p><a href="/blog/word-by-word-captions-after-effects.html">Choose a layout or highlight</a></article>
        <article class="feature"><span class="feature-number" aria-hidden="true">02</span><h3>Correct the text</h3><p>Use the Captions tab to find and edit captions. Save caption updates text and animation together. Check timing again after adding words.</p><a href="/blog/edit-captions-in-after-effects.html">Edit words and update animation</a></article>
        <article class="feature"><span class="feature-number" aria-hidden="true">03</span><h3>Change the look</h3><p>Customize a built-in design and save your own preset. Appearance-only Apply style changes reuse the existing timing; changing caption grouping can require transcription again.</p><a href="/#custom">Try the browser style designer</a></article>
      </div>
    </div>
  </section>

  <section class="section wrap workflow-section" aria-labelledby="workflow-heading">
    <div class="workflow-copy"><p class="eyebrow">From speech to layers</p><h2 id="workflow-heading">Stay with the edit.</h2><p>The panel reads supported selected speech sources and uses a local CPU model. It creates editable caption precomposition layers for your composition, ready for text, timing and design review.</p><p>Source selection matters. A selected layer's visible range, retiming and audio source can affect what is supported. Use the setup guide for those details before a long batch.</p><a class="text-link" href="/blog/how-to-add-captions-in-after-effects.html">Install and generate your first captions <span aria-hidden="true">↗</span></a><p class="small-note">The browser designer uses prepared sample captions. It does not transcribe footage or operate After Effects.</p></div>
    <figure class="workflow-figure"><img src="/img/guides/ae-first-captions-workflow.svg" width="960" height="860" loading="lazy" alt="Workflow illustration: select supported speech layers, transcribe locally on the CPU, create editable caption phrase layers and render the composition"><figcaption>Workflow illustration. <a href="/img/guides/ae-first-captions-workflow.svg">Open full-size diagram</a>.</figcaption></figure>
  </section>

  <section class="section section-bordered" aria-labelledby="fit-heading">
    <div class="wrap fit-layout">
      <div class="section-intro"><p class="eyebrow">Choose the output</p><h2 id="fit-heading">Does it fit your delivery?</h2></div>
      <div class="fit-content">
        <div class="fit-row"><h3>Animated caption layers</h3><p>Use Captions Gen when you want editable words, highlights and graphic animation in a supported After Effects project. Review the transcript, then render a short sample with sound.</p></div>
        <div class="fit-row"><h3>An existing SRT or selectable subtitles</h3><p>This public release does not import SRT, convert native subtitle tracks or translate speech. Keep a separate subtitle workflow when your client needs a caption file or selectable subtitles. <a href="/blog/import-srt-premiere-pro.html">Premiere's native SRT workflow</a> serves that separate delivery.</p></div>
        <div class="fit-row"><h3>What the free download covers</h3><p>{escape(p['pricing'])} When comparing another tool's free tier or trial, check its export limits, watermark, usage allowance and supported operating system before moving the edit.</p></div>
      </div>
    </div>
  </section>

  <section class="section wrap" id="requirements" aria-labelledby="requirements-heading">
    <div class="section-intro"><p class="eyebrow">Before you download</p><h2 id="requirements-heading">Check your app and computer.</h2><p>The current public release is for Windows. It does not include a Mac installer.</p></div>
    <dl class="requirements">
      <div><dt>After Effects</dt><dd>{escape(ae_compatibility)} Creative Cloud Desktop and Adobe installation permissions are required.</dd></div>
      <div><dt>Local processing</dt><dd>{escape(p['hardware'])}</dd></div>
      <div><dt>Speech models</dt><dd>{escape(p['storage'])} Base is the lightest built-in option; Small and the default Turbo are also available.</dd></div>
      <div><dt>Internet and footage</dt><dd>{escape(p['network'])}</dd></div>
      <div><dt>One Windows setup</dt><dd>Choose After Effects or Both. Both panels share the engine and Models folder. Installing the Premiere Pro panel is optional.</dd></div>
    </dl>
    <p class="support-note">The Windows setup remains Authenticode-unsigned. The Adobe CEP package signature is separate and does not resolve a Windows Smart App Control block. If setup is blocked, <a href="mailto:{escape(p['support'], quote=True)}">contact support</a>. See <a href="/product.html">all current product facts and limits</a>.</p>
  </section>

  <section class="section section-bordered" id="help" aria-labelledby="help-heading">
    <div class="wrap"><div class="section-intro"><p class="eyebrow">After Effects help</p><h2 id="help-heading">Start with the step you need.</h2></div>
      <nav class="help-grid" aria-label="After Effects caption guides">
        <a href="/blog/how-to-add-captions-in-after-effects.html"><span>Install and generate</span><p>Set up the panel, choose supported source layers and create your first captions.</p><b aria-hidden="true">↗</b></a>
        <a href="/blog/edit-captions-in-after-effects.html"><span>Edit caption text</span><p>Correct words, review timing and update animation after a manual edit.</p><b aria-hidden="true">↗</b></a>
        <a href="/blog/after-effects-captions-not-showing.html"><span>Find missing captions</span><p>Separate installation, model, source, layer visibility and render-range problems.</p><b aria-hidden="true">↗</b></a>
        <a href="/blog/word-by-word-captions-after-effects.html"><span>Choose word-by-word captions</span><p>Compare one-word layouts with a moving highlight across a phrase.</p><b aria-hidden="true">↗</b></a>
      </nav>
    </div>
  </section>

  <section class="section wrap faq-section" id="faq" aria-labelledby="faq-heading">
    <div class="section-intro"><p class="eyebrow">Questions before installing</p><h2 id="faq-heading">A few useful details.</h2></div>
    <div class="faq-list">{faq_html}</div>
  </section>

  <section class="wrap final-section" aria-labelledby="download-heading">
    <div><p class="eyebrow">Captions Gen for After Effects</p><h2 id="download-heading">Try it on a short edit.</h2><p>Generate a sample, correct the words and watch the rendered result.</p></div>
    <div><a class="button" href="{checkout}" target="_blank" rel="noopener">Download free <small>Windows setup {escape(p['version'])}</small></a><p class="download-note">Email required. No payment card.</p></div>
  </section>
  <section class="wrap maker-section" aria-labelledby="maker-heading"><h2 id="maker-heading">Made by Kris, a video editor.</h2><p>I built Captions Gen for editors who want animated captions inside their Adobe projects. This page describes <a href="{escape(p['release_url'], quote=True)}">public release {escape(p['version'])}, released {released}</a>. You can <a href="mailto:{escape(p['support'], quote=True)}">email me</a> with product questions or corrections.</p><p class="small-note">{dates} Current pricing and compatibility are maintained in <a href="/product.html">the official product reference</a>.</p></section>
</main>
<footer class="site-footer wrap"><div class="footer-links"><a href="/">Product overview</a><a href="/product.html">Product facts</a><a href="/blog/">All caption guides</a><a href="/news/">Release notes</a><a href="/privacy.html">Website privacy</a><button class="analytics-preferences" type="button" data-analytics-preferences>Analytics preferences</button></div><p>© 2026 Captions Gen. Not affiliated with Adobe. Adobe and After Effects are trademarks of Adobe Inc.</p></footer>
</body>
</html>
'''


def generate(root=ROOT):
    """Write only this landing page; callers own the wider site generation."""
    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    (root / FILENAME).write_text(after_effects_page(), encoding="utf-8", newline="")
