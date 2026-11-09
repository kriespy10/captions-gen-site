"""Generate the product facts page and directory, and sync homepage facts.

May be run directly or called by genblog.py. Importing has no side effects.
"""
import json
import re
from datetime import date
from html import escape
from html.parser import HTMLParser
from pathlib import Path

from product import PRODUCT, SITE, organization_schema, software_schema

ROOT = Path(__file__).resolve().parents[1]
TITLE = "Captions Gen: Free Pricing, Compatibility & Product Facts"
DESCRIPTION = "Current Captions Gen pricing, Premiere Pro and After Effects compatibility on Windows, local transcription, download requirements and limitations."


class HomepageFAQs(HTMLParser):
    """Keep the machine-readable FAQ tied to the answers visitors actually see."""

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.section_depth = 0
        self.question = None
        self.answer = None
        self.in_summary = False
        self.entries = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section":
            if self.section_depth:
                self.section_depth += 1
            elif attrs.get("id") == "faq":
                self.section_depth = 1
        if not self.section_depth:
            return
        if tag == "details":
            self.question, self.answer = [], []
        elif tag == "summary":
            self.in_summary = True
        elif tag in ("p", "li", "br") and self.answer is not None:
            self.answer.append(" ")

    def handle_endtag(self, tag):
        if tag == "summary":
            self.in_summary = False
        elif tag == "details" and self.question is not None:
            question = " ".join("".join(self.question).split())
            answer = " ".join("".join(self.answer).split())
            if not question or not answer:
                raise ValueError("Homepage FAQ has an empty question or answer")
            self.entries.append({"@type": "Question", "name": question,
                                 "acceptedAnswer": {"@type": "Answer", "text": answer}})
            self.question = self.answer = None
        elif tag == "section" and self.section_depth:
            self.section_depth -= 1

    def handle_data(self, data):
        if self.section_depth and self.question is not None:
            (self.question if self.in_summary else self.answer).append(data)


def product_page():
    p = PRODUCT
    checked = date.fromisoformat(p["checked"]).strftime("%d %B %Y").lstrip("0")
    released = date.fromisoformat(p["released"]).strftime("%d %B %Y").lstrip("0")
    free_since = date.fromisoformat(p["free_since"]).strftime("%d %B %Y").lstrip("0")
    schema = [organization_schema(), software_schema(), {
        "@context": "https://schema.org", "@type": "WebPage", "@id": p["url"] + "#webpage",
        "url": p["url"], "name": TITLE, "description": DESCRIPTION,
        "dateModified": p["checked"], "mainEntity": {"@id": f"{SITE}/#software"},
        "publisher": {"@id": f"{SITE}/#organization"},
    }, {
        "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Product facts", "item": p["url"]},
        ],
    }]
    rows = [("Current price", p["pricing"]), ("Download", p["download"]),
            ("Compatibility", p["compatibility"]), ("Hardware", p["hardware"]),
            ("Model storage", p["storage"]), ("Local processing and internet", p["network"]),
            ("Speech models", p["models"]), ("Caption output", p["output"]),
            ("Included features", p["features"])]
    facts = "\n".join(f'<div><dt>{escape(label)}</dt><dd>{escape(text)}</dd></div>' for label, text in rows)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(TITLE)}</title>
<meta name="description" content="{escape(DESCRIPTION)}">
<link rel="canonical" href="{p['url']}">
<meta property="og:title" content="{escape(TITLE)}">
<meta property="og:description" content="{escape(DESCRIPTION)}">
<meta property="og:url" content="{p['url']}">
<meta property="og:type" content="website">
<meta property="og:image" content="{SITE}/img/styles/Bold-Impact.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/analytics.css">
<script defer src="/analytics.js"></script>
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
<style>
  :root {{ color-scheme:dark; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:#070708; color:#f4f4f5; font:16px/1.65 -apple-system,"Segoe UI",system-ui,sans-serif; }}
  nav, main, footer {{ max-width:840px; margin:auto; padding:24px; }}
  nav {{ display:flex; gap:18px; flex-wrap:wrap; align-items:center; border-bottom:1px solid #242428; font-size:14px; }}
  nav .brand {{ margin-right:auto; font-weight:700; color:#f4f4f5; text-decoration:none; }}
  main {{ padding-top:32px; }}
  h1 {{ max-width:700px; font-size:clamp(30px,6vw,44px); line-height:1.15; letter-spacing:-.025em; margin:12px 0 18px; }}
  h2 {{ margin-top:36px; font-size:23px; line-height:1.3; }}
  p, li, dd {{ color:#b5b5ba; }}
  a {{ color:#69b5ff; }}
  a:focus-visible, button:focus-visible {{ outline:2px solid #ffeb3b; outline-offset:4px; }}
  .meta {{ color:#8e8e93; font-size:14px; }}
  .intro {{ font-size:18px; }}
  .btn {{ display:inline-block; background:#ffeb3b; color:#111; font-weight:700; text-decoration:none; border-radius:10px; padding:11px 20px; }}
  dl {{ margin:24px 0; border:1px solid #242428; border-radius:14px; overflow:hidden; }}
  dl div {{ display:grid; grid-template-columns:155px 1fr; gap:20px; padding:18px 20px; border-top:1px solid #242428; }}
  dl div:first-child {{ border-top:0; }}
  dt {{ font-weight:650; }}
  dd {{ margin:0; }}
  .note {{ border-left:3px solid #ffeb3b; padding:12px 18px; background:#151517; border-radius:0 10px 10px 0; }}
  footer {{ border-top:1px solid #242428; margin-top:28px; padding-bottom:48px; font-size:14px; }}
  footer p {{ margin:10px 0; }}
  @media(max-width:580px) {{ dl div {{ grid-template-columns:1fr; gap:6px; }} }}
</style>
</head>
<body>
<nav aria-label="Main navigation"><a class="brand" href="/">Captions Gen</a><a href="/blog/">Caption guides</a><a href="/news/">Release notes</a><a href="/#install">Install</a></nav>
<main>
<p class="meta">Official product information · checked <time datetime="{p['checked']}">{checked}</time></p>
<h1>Captions Gen: pricing, compatibility and product facts</h1>
<p class="intro">{escape(p['description'])}</p>
<p>Made by <a href="/#about-kris">Kris, a video editor</a>. This page describes the public Windows release for Premiere Pro and After Effects. See the <a href="/news/">release notes</a> for published changes.</p>
<a class="btn" href="{p['checkout']}">Download free</a>
<h2 id="facts">Current product facts</h2>
<dl>{facts}</dl>
<p>For setup and model choices, see <a href="/#install">requirements and installation</a> and <a href="/#performance">transcription and performance</a>.</p>
<h2 id="free">Is there a free animated captions plugin for Premiere Pro?</h2>
<p>{escape(p['free_answer'])}</p>
<h3>Is there a free animated captions plugin for After Effects?</h3>
<p>Yes. Captions Gen is currently free for After Effects on Windows, with no watermark, subscription or transcription time cap. The panel has been tested with After Effects 2026 on Windows 11 and creates native editable caption layers with local CPU transcription. Choose After Effects or Both in the same Windows setup. Adobe After Effects is a separate paid application. The <a href="/blog/how-to-add-captions-in-after-effects.html">After Effects setup and first-caption guide</a> explains the workflow.</p>
<p>The old 15-minute limit was removed with <a href="{p['free_release_url']}">Captions Gen 1.1.0 on {free_since}</a>. If an older panel still shows that limit, use the offered update and restart the Adobe application.</p>
<h2 id="fit">When Captions Gen fits your edit</h2>
<p>Use it when you edit in a supported Windows version of Premiere Pro or After Effects and want animated karaoke highlights, reusable styles and graphics you can continue editing. It suits short-form videos, interviews and other spoken footage where the caption design is part of the picture.</p>
<p class="note">{escape(p['limits'])}</p>
<p>For subtitle delivery, compare the <a href="/blog/animated-captions-premiere-pro.html">native and animated graphics workflows</a>. The <a href="/blog/free-caption-plugin-premiere-pro.html">free caption plugin guide</a> explains the difference between included Premiere captions and a free animation plugin.</p>
<p>Start in your Adobe application: <a href="/blog/how-to-add-captions-in-after-effects.html">generate animated captions in After Effects</a>, or <a href="/blog/animated-captions-premiere-pro.html">choose a Premiere Pro caption workflow</a>. After Effects layers and Premiere Motion Graphics clips have different host editing steps.</p>
<h2 id="release">Public release and support</h2>
<p>Current public version: <a href="{p['release_url']}">{escape(p['version'])}, released {released}</a>. The <a href="/update/version.json">update manifest</a> reports the published update. The current Windows setup offers Premiere Pro, After Effects, or Both, with a shared engine and Models folder. Mac is not included in this public release.</p>
<p>For product questions or corrections, email <a href="mailto:{p['support']}">{p['support']}</a>. Read the <a href="/privacy.html">website privacy information</a> for optional analytics and checkout details.</p>
</main>
<footer><p><a href="/">Product overview and live style preview</a> · <a href="/news/">News and updates</a> · <a href="/llms.txt">Text directory</a> · <a href="/privacy.html">Website privacy</a></p><button class="analytics-preferences" type="button" data-analytics-preferences>Analytics preferences</button><p>© 2026 Captions Gen. Not affiliated with Adobe. Adobe, Premiere Pro and After Effects are trademarks of Adobe Inc.</p></footer>
</body>
</html>
'''


def text_directory():
    p = PRODUCT
    return f'''# Captions Gen

> {p['description']}

Official website: {SITE}/. Product facts checked {p['checked']}.

## Current facts
- Pricing: {p['pricing']}
- Download: {p['download']}
- Compatibility: {p['compatibility']}
- Processing: {p['network']}
- Hardware: {p['hardware']}
- Storage: {p['storage']}
- Output: {p['output']}
- Features: {p['features']}
- Public version: {p['version']} ({p['released']}).
- Support: {p['support']}. Made by Kris, a video editor.

## Product and release information
- [Product facts]({p['url']}): current pricing, compatibility, download requirements, limitations and support.
- [Home]({SITE}/): product overview, editable style preview and free download.
- [Requirements and installation]({SITE}/#install): supported Adobe applications and Windows versions, app selection and installation steps.
- [Transcription and performance]({SITE}/#performance): CPU transcription, Base/Small/Turbo models, downloads and timeline performance.
- [Current public release]({p['release_url']}): version {p['version']}, released {p['released']}.
- [Free release announcement]({p['free_release_url']}): the 15-minute limit was removed on {p['free_since']}.
- [News and release notes]({SITE}/news/): published updates.
- [Website privacy]({SITE}/privacy.html): optional analytics and checkout information.

## Caption guides
- [Add animated captions in After Effects]({SITE}/blog/how-to-add-captions-in-after-effects.html): combined Windows setup, the After Effects panel, caption layers, text edits, styling and rendering.
- [Edit captions in After Effects]({SITE}/blog/edit-captions-in-after-effects.html): correct words, review timing and update animation after text edits.
- [After Effects captions not showing]({SITE}/blog/after-effects-captions-not-showing.html): distinguish a missing panel from invisible generated layers or an unsupported speech source.
- [Word-by-word captions in After Effects]({SITE}/blog/word-by-word-captions-after-effects.html): choose a one-word layout or a spoken-word highlight within a phrase.
- [Free caption plugin for Premiere Pro]({SITE}/blog/free-caption-plugin-premiere-pro.html): free animated plugin versus Premiere's included native caption tools.
- [Animated captions workflows]({SITE}/blog/animated-captions-premiere-pro.html): native single-word captions, manual graphics and the plugin workflow.
- [Word-by-word captions]({SITE}/blog/word-by-word-captions-premiere-pro.html): one word at a time versus highlights within a phrase.
- [Add captions in Premiere Pro]({SITE}/blog/how-to-add-captions-in-premiere-pro.html): native captions, styling and export.
- [Import and export SRT]({SITE}/blog/import-srt-premiere-pro.html): subtitle files and native caption tracks.
- [All caption guides]({SITE}/blog/): tutorials and troubleshooting.
'''


def sync_homepage(path):
    html = path.read_text(encoding="utf-8")
    def replace_schema(match):
        data = json.loads(match.group(1))
        if not isinstance(data, dict):
            return match.group(0)
        if data.get("@type") == "SoftwareApplication":
            data = software_schema()
        elif data.get("@type") == "Organization":
            data = organization_schema()
        elif data.get("@type") == "FAQPage":
            data["mainEntity"] = faq_entries
        return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'
    faq = f'''    <details>
      <summary>{PRODUCT['free_question']}</summary>
      <p>{escape(PRODUCT['free_answer'])}</p>
    </details>
'''
    question_pattern = r'    <details>\s*<summary>' + re.escape(PRODUCT["free_question"]) + r'</summary>.*?</details>\n'
    if re.search(question_pattern, html, flags=re.S):
        html = re.sub(question_pattern, faq, html, count=1, flags=re.S)
    else:
        marker = '    <details>\n      <summary>Is there a karaoke captions plugin for Premiere Pro?</summary>'
        if marker not in html:
            raise ValueError("Homepage FAQ insertion point not found")
        html = html.replace(marker, faq + marker, 1)
    faq_entries = HomepageFAQs(html).entries
    if len(faq_entries) < 3:
        raise ValueError("Homepage FAQ section was not found or is incomplete")
    html = re.sub(r'<script type="application/ld\+json">(.*?)</script>', replace_schema, html, flags=re.S)
    price_link = '<p><a href="/product.html">Current pricing, compatibility and product facts</a>. Adobe Premiere Pro and After Effects are separate paid applications. Paid features are planned for the future.</p>'
    if price_link not in html:
        marker = '        <p>Bought a license before? Thank you for the early support. Your key stays active.</p>'
        if marker not in html:
            raise ValueError("Homepage pricing insertion point not found")
        html = html.replace(marker, '        ' + price_link + '\n' + marker, 1)
    footer_link = '<a href="/product.html">Product facts</a>'
    if footer_link not in html:
        marker = '      <a href="/privacy.html">Website privacy</a>'
        if marker not in html:
            raise ValueError("Homepage footer insertion point not found")
        html = html.replace(marker, '      ' + footer_link + '\n' + marker, 1)
    path.write_text(html, encoding="utf-8", newline="")


def generate(root=ROOT):
    root = Path(root)
    (root / "product.html").write_text(product_page(), encoding="utf-8", newline="")
    (root / "llms.txt").write_text(text_directory(), encoding="utf-8", newline="")
    sync_homepage(root / "index.html")


if __name__ == "__main__":
    generate()
    print("wrote product facts + text directory; synced homepage schema and links")
