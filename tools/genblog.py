# -*- coding: utf-8 -*-
# Generates the captionsgen.com guides from their editable source files.
import json, os, io, re
from datetime import date
from html import escape
from product import PRODUCT

SITE = "https://captionsgen.com"
FREE = "https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece"
DATE = "2026-08-26"
SITE_UPDATED = "2026-11-08"
GUIDE_INDEX_UPDATED = "2026-11-09"
# Every guide includes the shared requirements box below. Its factual correction
# is a content update even when the rest of an article has not changed.
SHARED_REQUIREMENTS_UPDATED = "2026-11-08"
ANALYTICS_HEAD = '<link rel="stylesheet" href="/analytics.css">\n<script defer src="/analytics.js"></script>'
PRIVACY_FOOTER = '<a href="/privacy.html">Website privacy</a> · <button class="analytics-preferences" type="button" data-analytics-preferences>Analytics preferences</button>'

CSS = """
  :root { --bg:#070708; --card:#151517; --hair:rgba(255,255,255,.07); --hair2:rgba(255,255,255,.14);
    --text:#f4f4f5; --muted:#8e8e93; --muted2:#b5b5ba; --blue:#0a84ff; --blue2:#3395ff; --yellow:#ffeb3b;
    --green:#30d158; --amber:#ff9f0a; --red:#ff6b6b; --cyan:#64d2ff; --card2:#1b1b1e; --pick:#0d1a2b;
    --body:"Instrument Sans",-apple-system,"Segoe UI",system-ui,sans-serif; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:var(--body); background:var(--bg); color:var(--text); line-height:1.65; -webkit-font-smoothing:antialiased; }
  .wrap { max-width:1040px; margin:0 auto; padding:0 24px; }
  .col { max-width:720px; margin:0 auto; padding:0 20px; }
  nav { position:sticky; top:0; z-index:20; backdrop-filter:saturate(160%) blur(18px); -webkit-backdrop-filter:saturate(160%) blur(18px); background:rgba(7,7,8,.66); border-bottom:1px solid var(--hair); }
  nav .wrap { display:flex; align-items:center; justify-content:space-between; height:54px; }
  nav a { text-decoration:none; }
  .brand { display:flex; align-items:center; gap:10px; color:var(--text); font-weight:600; font-size:15px; letter-spacing:-.01em; }
  .brand svg { width:26px; height:26px; display:block; }
  nav .links { display:flex; gap:24px; font-size:13.5px; align-items:center; }
  nav .links a { color:var(--muted2); }
  nav .links a:hover { color:var(--text); }
  nav .links a.on { color:var(--text); }
  nav .links a.buy { color:#fff; background:var(--blue); padding:7px 15px; border-radius:999px; font-weight:600; }
  nav .links a.buy:hover { background:var(--blue2); }
  @media (max-width:800px) { nav .links a:not(.buy):not(.on) { display:none; } }
  .idx h1 { margin-bottom:6px; } .idx .sub { color:var(--muted); margin-bottom:26px; }
  .post { display:block; background:var(--card); border:1px solid var(--hair); border-radius:14px; padding:18px 20px; margin-bottom:12px; text-decoration:none; }
  .post:hover { border-color:var(--hair2); }
  .post .pt { color:var(--text); font-weight:700; font-size:18px; margin-bottom:4px; }
  .post .pd { color:var(--muted2); font-size:14px; }
  article { padding:40px 0 20px; }
  h1 { font-size:34px; line-height:1.2; letter-spacing:-.02em; margin:0 0 10px; }
  .meta { color:var(--muted); font-size:13px; margin-bottom:28px; }
  .app-guide { padding:12px 16px; margin:0 0 24px; border:1px solid var(--hair2); border-radius:10px; font-size:14px; }
  .breadcrumbs { font-size:13px; color:var(--muted); margin:0 0 16px; }
  .breadcrumbs a { color:var(--muted2); }
  .sources { font-size:13px; margin-top:28px; }
  .caption-example { margin:24px 0; }
  .caption-example img { display:block; width:100%; height:auto; border-radius:12px; }
  .caption-example figcaption { color:var(--muted); font-size:13px; margin-top:8px; }
  .quick-answer { margin-top:20px; }
  .quick-answer ul { margin-bottom:0; }
  h2 { font-size:22px; margin:36px 0 10px; letter-spacing:-.01em; }
  h2[id] { scroll-margin-top:78px; }
  h3 { font-size:17px; margin:24px 0 8px; }
  p, li { color:var(--muted2); font-size:16px; }
  li { margin-bottom:6px; }
  strong { color:var(--text); }
  a { color:var(--blue); }
  a:hover { color:var(--blue2); }
  ol li::marker { color:var(--yellow); font-weight:700; }
  .box { background:var(--card); border:1px solid var(--hair); border-radius:14px; padding:18px 20px; margin:32px 0; }
  .box p { margin:6px 0; }
  .box .t { color:var(--text); font-weight:700; }
  kbd { background:var(--card); border:1px solid var(--hair2); border-radius:5px; padding:1px 6px; font-size:13px; color:var(--text); }
  footer { border-top:1px solid var(--hair); margin-top:48px; padding:24px 0 48px; color:var(--muted); font-size:13px; }
  footer a { color:var(--muted); }
  .cta-line { background:rgba(10,132,255,.08); border-left:3px solid var(--blue); padding:10px 14px; border-radius:0 10px 10px 0; margin:18px 0 6px; font-size:15px; }
  .btn { display:inline-block; background:var(--yellow); color:#111; font-weight:700; text-decoration:none; padding:11px 18px; border-radius:10px; margin:10px 10px 0 0; }
  .btn:hover { color:#111; background:#fff176; }
  .btn.ghost { background:transparent; color:var(--text); border:1px solid var(--hair2); }
  .btn.ghost:hover { color:var(--text); background:rgba(255,255,255,.06); }
  .ptable-wrap { position:relative; left:50%; transform:translateX(-50%); width:min(1100px, calc(100vw - 40px)); margin:18px 0 6px; border:1px solid var(--hair2); border-radius:16px; overflow-x:auto; background:var(--card); -webkit-overflow-scrolling:touch; }
  .ptable { width:100%; min-width:1040px; border-collapse:separate; border-spacing:0; font-size:14px; font-variant-numeric:tabular-nums; }
  .ptable th { background:var(--card2); color:var(--muted); font-size:11.5px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; text-align:left; padding:12px 11px; border-bottom:1px solid var(--hair2); white-space:nowrap; }
  .ptable td { padding:14px 11px; border-bottom:1px solid var(--hair); color:var(--muted2); vertical-align:middle; line-height:1.4; }
  .ptable tr:last-child td { border-bottom:0; }
  .ptable tbody tr:hover td { background:var(--card2); }
  .ptable td:first-child, .ptable th:first-child { position:sticky; left:0; z-index:1; background:var(--card); border-right:1px solid var(--hair); }
  .ptable th:first-child { background:var(--card2); }
  .ptable tbody tr:hover td:first-child { background:var(--card2); }
  .ptable .tool { color:var(--text); font-weight:700; font-size:15px; white-space:nowrap; }
  .ptable .sub { color:var(--muted); font-size:12.5px; margin-top:2px; }
  .ptable .price { color:var(--text); font-weight:600; white-space:nowrap; }
  .ptable td:nth-child(2) .sub { white-space:nowrap; }
  .ptable tr.pick td, .ptable tr.pick:hover td { background:var(--pick); }
  .ptable tr.pick td:first-child { box-shadow:inset 3px 0 0 var(--yellow); }
  .ptable .tag { display:inline-block; margin-left:6px; padding:2px 8px; border-radius:999px; border:1px solid var(--yellow); color:var(--yellow); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; vertical-align:2px; }
  .pill { display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:999px; font-size:12.5px; font-weight:600; white-space:nowrap; border:1px solid currentColor; }
  .pill::before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; }
  .pill.ok { color:var(--green); } .pill.sub { color:var(--amber); } .pill.mix { color:var(--cyan); } .pill.neutral { color:var(--muted2); }
  .mark { display:inline-flex; align-items:center; gap:7px; white-space:nowrap; }
  .mark i { font-style:normal; display:inline-grid; place-items:center; width:20px; height:20px; border-radius:50%; font-size:12px; font-weight:800; border:1px solid currentColor; }
  .mark.yes { color:var(--green); } .mark.no { color:var(--red); } .mark.na { color:var(--muted); }
  .yr { min-width:150px; }
  .yr .amt { color:var(--text); font-weight:600; white-space:nowrap; }
  .yr .bar { position:relative; height:6px; margin-top:7px; border-radius:3px; background:var(--hair); overflow:hidden; }
  .yr .bar span { position:absolute; left:0; top:0; bottom:0; border-radius:3px; background:var(--amber); }
  .yr .bar span.lo { background:var(--green); }
  .yr .bar span.range { opacity:.35; }
  @media (max-width:600px) {
    .ptable-wrap { left:0; transform:none; width:auto; }
    .ptable .tool + .sub { display:none; }
    .ptable td:first-child { max-width:132px; }
    .ptable .tool { white-space:normal; font-size:14px; }
    .ptable .tag { display:block; width:max-content; margin:5px 0 0; }
  }
  .ver { display:inline-block; font-size:11.5px; font-weight:700; letter-spacing:.06em; color:var(--blue); background:rgba(10,132,255,.14); border-radius:6px; padding:2px 8px; margin-right:8px; vertical-align:1px; }
  .post .pm { color:var(--muted); font-size:13px; margin-bottom:6px; }
  .tldr { background:var(--card); border:1px solid var(--hair); border-left:3px solid var(--yellow); border-radius:0 14px 14px 0; padding:14px 20px 6px; margin:22px 0 26px; }
  .tldr .t, .toc .t { color:var(--text); font-weight:700; margin:0 0 6px; font-size:15px; }
  .tldr ul { margin:0; padding-left:20px; }
  .toc { border:1px solid var(--hair); border-radius:14px; padding:14px 20px; margin:0 0 30px; }
  .toc ol { margin:0; padding-left:22px; columns:2; column-gap:28px; }
  .toc li { font-size:14.5px; margin-bottom:4px; break-inside:avoid; }
  .toc a { color:var(--muted2); text-decoration:none; }
  .toc a:hover { color:var(--text); }
  @media (max-width:600px) { .toc ol { columns:1; } }
  article .col { position:relative; }
  .toc-rail { display:none; }
  @media (min-width:1040px) {
    article .col.has-toc { margin-left:max(0px, calc(50% - 480px)); }
    .has-toc .ptable-wrap { left:0; transform:none; width:auto; }
    .has-toc .ptable { min-width:0; }
    .toc-inline { display:none; }
    .toc-rail { display:block; position:absolute; top:0; bottom:0; left:calc(100% + 28px); width:212px; }
    .toc-side { position:sticky; top:84px; margin:0; border:0; border-left:1px solid var(--hair2); border-radius:0; padding:2px 0 2px 18px; }
    .toc-side ol { columns:1; list-style:none; padding:0; }
    .toc-side li { font-size:14px; line-height:1.45; margin-bottom:9px; }
    .toc-side a.on { color:var(--text); }
    .toc-side a.on::before { content:""; position:absolute; left:-1px; width:2px; height:1.4em; background:var(--yellow); }
  }
  .tip, .note { border-radius:0 12px 12px 0; padding:10px 16px; margin:18px 0; font-size:15px; color:var(--muted2); }
  .tip { background:rgba(48,209,88,.07); border-left:3px solid var(--green); }
  .note { background:rgba(255,159,10,.07); border-left:3px solid var(--amber); }
  .tip b, .note b { color:var(--text); }
  .spec { width:100%; border-collapse:collapse; margin:14px 0 8px; font-size:15px; border:1px solid var(--hair); border-radius:12px; overflow:hidden; }
  .spec th, .spec td { text-align:left; padding:10px 14px; border-bottom:1px solid var(--hair); vertical-align:top; }
  .spec th { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.06em; background:var(--card2); }
  .spec td { color:var(--muted2); }
  .spec td:first-child { color:var(--text); font-weight:600; white-space:nowrap; }
  .spec tr:last-child td { border-bottom:0; }
  .swatch { display:inline-block; width:12px; height:12px; border-radius:3px; vertical-align:-1px; margin-right:6px; border:1px solid rgba(255,255,255,.35); }
  .ptable-legend { display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:12.5px; margin:10px 2px 0; }
"""

# Marks the sidebar link of the section being read.
TOC_JS = """(function(){function f(){var l=[].slice.call(document.querySelectorAll('.toc-side a')),i=0;
l.forEach(function(a,k){var e=document.getElementById(a.hash.slice(1));if(e&&e.getBoundingClientRect().top<140)i=k});
l.forEach(function(a,k){a.classList.toggle('on',k===i)})}
addEventListener('scroll',f,{passive:true});addEventListener('DOMContentLoaded',f)})();"""

# Shared article treatment, applied only to guides by page(), not news or products.
WORKFLOW_CSS = """
  .caption-example { margin:30px 0; }
  .caption-example img { border:1px solid var(--hair2); background:#101013; }
  .caption-example figcaption { line-height:1.5; color:var(--muted2); padding:0 2px; }
  .caption-example figcaption a { white-space:nowrap; }
  .ptable-wrap { left:0; transform:none; width:100%; }
  .ptable { min-width:620px; }
  .ptable:has(th:nth-child(6)) { min-width:1000px; }
  .ptable th { white-space:normal; }
  .ptable td:first-child { width:27%; }
  .spec { table-layout:fixed; }
  .spec th, .spec td { overflow-wrap:anywhere; }
  .spec td:first-child { white-space:normal; }
  article ol > li { padding-left:4px; margin-bottom:12px; }
  article .tip, article .note { line-height:1.6; }
  article a:focus-visible { outline:2px solid var(--yellow); outline-offset:4px; border-radius:2px; }
  .toc-side { max-height:calc(100vh - 108px); overflow-y:auto; scrollbar-width:thin; }
  .skip-link { position:absolute; z-index:40; top:8px; left:16px; transform:translateY(-180%); padding:8px 14px; background:var(--yellow); color:#111; border-radius:8px; }
  .skip-link:focus { transform:none; }
  #guide-content { scroll-margin-top:70px; }
  @media (max-width:600px) {
    h1 { font-size:30px; }
    .spec th, .spec td { padding:10px 9px; font-size:14px; }
    .caption-example { margin:24px 0; }
  }
"""

CLOSING = f"""
<div class="box">
<p class="t">Try animated captions on your own edit</p>
<p>{escape(PRODUCT['description'])}</p>
<p>{escape(PRODUCT['pricing'])}</p>
<p>Current release: <a href="{escape(PRODUCT['release_url'], quote=True)}">{escape(PRODUCT['version'])}</a>. Check <a href="https://captionsgen.com/product.html">supported Adobe versions, installation requirements and limitations</a>. Use Premiere Pro's native caption tracks when you need SRT, selectable subtitles or broadcast closed captions.</p>
<a class="btn" href="__FREE__">Download free</a>
<a class="btn ghost" href="https://captionsgen.com/#styles">See the caption styles</a>
</div>
"""

def prepare_article(body_html):
    """Keep the on-page list aligned with every real article section."""
    body_html = re.sub(r'<aside class="toc toc-inline".*?</aside>\s*', '', body_html, flags=re.S)
    # Diagrams remain ordinary discoverable images; their full canvas also opens
    # from the image itself so a small-screen reader can inspect fine details.
    def linked_diagram(match):
        start, image, src = match.groups()
        return f'{start}<a class="diagram-link" href="{src}">{image}</a>'
    body_html = re.sub(r'(<figure\b[^>]*>\s*)(<img\b[^>]*\bsrc="(/img/guides/[^\"]+\.svg)"[^>]*>)', linked_diagram, body_html)
    used = set(re.findall(r'\bid="([^"]+)"', body_html))
    def heading(match):
        attrs, label = match.groups()
        if re.search(r'\bid=', attrs):
            return match.group(0)
        base = re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', label).lower()).strip('-') or 'section'
        anchor, count = base, 2
        while anchor in used:
            anchor, count = f'{base}-{count}', count + 1
        used.add(anchor)
        return f'<h2{attrs} id="{anchor}">{label}</h2>'
    body_html = re.sub(r'<h2([^>]*)>(.*?)</h2>', heading, body_html, flags=re.S)
    headings = re.findall(r'<h2[^>]*\bid="([^"]+)"[^>]*>(.*?)</h2>', body_html, flags=re.S)
    if headings:
        items = ''.join(f'<li><a href="#{escape(anchor, quote=True)}">{label}</a></li>' for anchor, label in headings)
        toc = f'<aside class="toc toc-inline" aria-label="On this page"><p class="t">On this page</p><ol>{items}</ol></aside>\n'
        first_heading = body_html.index('<h2')
        body_html = body_html[:first_heading] + toc + body_html[first_heading:]
    return body_html


def page(slug, title, desc, h1, body_html, related, modified=DATE, image=None, published=DATE, faq=None, app="Premiere Pro"):
    page_css = CSS + WORKFLOW_CSS
    if faq:
        body_html += "\n<h2>Questions people ask</h2>\n" + "\n".join(f"<h3>{q}</h3>\n<p>{a}</p>" for q, a in faq)
    body_html = prepare_article(body_html)
    first_image = re.search(r'<img\b[^>]*\bsrc="([^"]+)"[^>]*>', body_html)
    if image is None and first_image:
        image = first_image.group(1)
    closing = CLOSING.replace("__FREE__", FREE)
    if app == "After Effects":
        app_guide = '<p class="app-guide"><strong>After Effects guide.</strong> Working in Premiere Pro? <a href="animated-captions-premiere-pro.html">Choose a Premiere caption workflow</a>.</p>'
    else:
        app_guide = '<p class="app-guide"><strong>Premiere Pro guide.</strong> Using After Effects? <a href="how-to-add-captions-in-after-effects.html">Install its panel and create your first captions</a>.</p>'
    rel = "\n".join(f'<li><a href="{r["slug"]}.html">{r["t"]}</a></li>' for r in related)
    article = {
        "@context": "https://schema.org", "@type": "Article", "headline": h1,
        "description": desc, "inLanguage": "en", "articleSection": app,
        "datePublished": published, "dateModified": modified,
        "author": {"@type": "Person", "name": "Kris", "url": "https://github.com/Kriespy10"},
        "publisher": {"@type": "Organization", "name": "Captions Gen", "url": SITE,
                      "logo": {"@type": "ImageObject", "url": f"{SITE}/img/captions-gen-logo.svg"}},
        "mainEntityOfPage": f"{SITE}/blog/{slug}.html"
    }
    if image:
        article["image"] = f"{SITE}{image}"
    breadcrumb = {
        "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Caption guides", "item": f"{SITE}/blog/"},
            {"@type": "ListItem", "position": 3, "name": h1, "item": f"{SITE}/blog/{slug}.html"}
        ]
    }
    toc_rail = ""
    m = re.search(r'<aside class="toc toc-inline".*?</aside>', body_html, re.S)
    if m:
        # Same list as a sticky sidebar on wide screens; the inline copy shows on smaller ones.
        side = m.group(0).replace('class="toc toc-inline"', 'class="toc toc-side"', 1)
        toc_rail = f'<div class="toc-rail">{side}</div>\n<script>{TOC_JS}</script>'
    schemas = [article, breadcrumb]
    if faq:
        # The same visible question/answer pairs were included before building the TOC.
        schemas.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}} for q, a in faq]})
    schema = json.dumps(schemas, ensure_ascii=False)
    # Search can discover the SVG body illustration. Social previews generally
    # need a bitmap, so keep an existing representative caption sample when one
    # appears in the article, rather than offering an unsupported SVG card.
    social_image = image if image and not image.lower().endswith('.svg') else None
    if social_image is None:
        raster = re.search(r'<img\b[^>]*\bsrc="([^\"]+\.(?:png|jpe?g|webp))"', body_html, flags=re.I)
        if raster:
            social_image = raster.group(1)
    image_meta = f'<meta property="og:image" content="{SITE}{social_image}">' if social_image else ''
    display_date = date.fromisoformat(modified).strftime("%d %B %Y").lstrip('0')
    published_date = date.fromisoformat(published).strftime("%d %B %Y").lstrip('0')
    dates = f'Published <time datetime="{published}">{published_date}</time>'
    if modified != published:
        dates += f' · Updated <time datetime="{modified}">{display_date}</time>'
    title, desc, h1 = escape(title), escape(desc), escape(h1)
    return f"""<!doctype html>
<html lang="en">
<head>
{ANALYTICS_HEAD}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23000'/%3E%3Crect x='11' y='27' width='13' height='10' rx='3' fill='%23fff'/%3E%3Crect x='27' y='25' width='14' height='14' rx='4' fill='%23ffeb3b'/%3E%3Crect x='44' y='27' width='9' height='10' rx='3' fill='%23fff'/%3E%3C/svg%3E">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/blog/{slug}.html">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/blog/{slug}.html">
<meta property="og:type" content="article">
{image_meta}
<meta name="twitter:card" content="{'summary_large_image' if social_image else 'summary'}">
<script type="application/ld+json">{schema}</script>
<style>{page_css}</style>
</head>
<body>
<a class="skip-link" href="#guide-content">Skip to guide</a>
<nav><div class="wrap">
  <a class="brand" href="https://captionsgen.com/"><svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#000"/><rect x="11" y="27" width="13" height="10" rx="3" fill="#fff"/><rect x="27" y="25" width="14" height="14" rx="4" fill="#ffeb3b"/><rect x="44" y="27" width="9" height="10" rx="3" fill="#fff"/></svg>Captions Gen</a>
  <div class="links">
    <a href="https://captionsgen.com/#styles">Styles</a>
    <a href="https://captionsgen.com/#custom">Build your own</a>
    <a href="https://captionsgen.com/#how">How it works</a>
    <a href="https://captionsgen.com/#install">Install</a>
    <a href="https://captionsgen.com/#faq">FAQ</a>
    <a class="on" href="https://captionsgen.com/blog/">Guides</a>
    <a href="https://captionsgen.com/news/">News</a>
    <a class="buy" href="https://captionsgen.com/#buy">Get it free</a>
  </div>
</div></nav>
<main id="guide-content" tabindex="-1"><article><div class="col{' has-toc' if toc_rail else ''}">
{toc_rail}
<p class="breadcrumbs"><a href="{SITE}/">Home</a> / <a href="{SITE}/blog/">Caption guides</a> / {h1}</p>
<h1>{h1}</h1>
<div class="meta">{dates} · by <a href="https://github.com/Kriespy10">Kris</a>, maker of Captions Gen</div>
{app_guide}
{body_html}
{closing}
<div class="box"><p class="t">Related guides</p><ul>{rel}</ul></div>
</div></article></main>
<footer><div class="col">© 2026 Captions Gen · <a href="{SITE}/">Home</a> · <a href="{SITE}/product.html">Product facts &amp; compatibility</a> · <a href="{SITE}/#faq">FAQ</a> · <a href="{SITE}/blog/">Guides</a> · <a href="{SITE}/news/">News</a> · {PRIVACY_FOOTER}</div></footer>
</body>
</html>
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bodies import POSTS
from bodies2 import P
from bodies3 import P3
from aftereffects import AE_POSTS
from genproduct import generate as generate_product
POSTS.update(P)
POSTS.update(P3)
POSTS.update(AE_POSTS)
for post in POSTS.values():
    post["modified"] = max(post.get("modified", DATE), SHARED_REQUIREMENTS_UPDATED)

ORDER = list(POSTS.keys())

os.makedirs("blog", exist_ok=True)
NAV_HTML = """<nav><div class="wrap">
  <a class="brand" href="https://captionsgen.com/"><svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#000"/><rect x="11" y="27" width="13" height="10" rx="3" fill="#fff"/><rect x="27" y="25" width="14" height="14" rx="4" fill="#ffeb3b"/><rect x="44" y="27" width="9" height="10" rx="3" fill="#fff"/></svg>Captions Gen</a>
  <div class="links">
    <a href="https://captionsgen.com/#styles">Styles</a>
    <a href="https://captionsgen.com/#custom">Build your own</a>
    <a href="https://captionsgen.com/#how">How it works</a>
    <a href="https://captionsgen.com/#install">Install</a>
    <a href="https://captionsgen.com/#faq">FAQ</a>
    <a class="on" href="https://captionsgen.com/blog/">Guides</a>
    <a href="https://captionsgen.com/news/">News</a>
    <a class="buy" href="https://captionsgen.com/#buy">Get it free</a>
  </div>
</div></nav>"""
def guide_cards(app, slugs=None):
    return "".join(f'<a class="post" href="{k}.html"><div class="pt">{v["h1"]}</div><div class="pd">{v["desc"]}</div></a>'
                   for k, v in POSTS.items() if v.get("app", "Premiere Pro") == app and (slugs is None or k in slugs))


GUIDE_GROUPS = [
    ("Create and import captions", "Transcribe speech, bring in an existing subtitle file, or install the animated caption panel.", [
        "how-to-add-captions-in-premiere-pro", "auto-captions-premiere-pro", "how-to-add-subtitles-in-premiere-pro", "import-srt-premiere-pro", "free-caption-plugin-premiere-pro"]),
    ("Design and animate", "Choose readable fonts, reusable designs, word highlights and graphics workflows.", [
        "animated-captions-premiere-pro", "change-caption-font-premiere-pro", "premiere-pro-caption-presets", "premiere-pro-captions-to-graphics", "highlight-words-in-captions-premiere-pro", "word-by-word-captions-premiere-pro", "how-to-add-text-in-premiere-pro", "captions-for-tiktok-reels-shorts-premiere-pro", "best-fonts-for-captions", "hormozi-style-captions-premiere-pro", "mrbeast-style-captions-premiere-pro", "free-caption-templates-premiere-pro"]),
    ("Fix timing, preview and export", "Locate the stage that failed and check the delivered file.", [
        "premiere-pro-captions-not-showing", "premiere-pro-captions-not-exporting", "premiere-pro-speech-to-text-not-working", "fix-caption-timing-premiere-pro", "burn-in-captions-premiere-pro"]),
    ("Compare tools and delivery formats", "Check the output, platform and costs before choosing a caption workflow.", [
        "subtitles-vs-captions-premiere-pro", "closed-captions-premiere-pro", "premiere-pro-captions-language", "best-caption-plugin-premiere-pro", "capcut-vs-premiere-pro-captions", "autocut-alternative-captions", "submagic-alternative-premiere-pro"]),
]


def grouped_premiere_guides():
    sections = []
    covered = set()
    for title, intro, slugs in GUIDE_GROUPS:
        covered.update(slugs)
        sections.append(f'<h3>{title}</h3><p>{intro}</p>{guide_cards("Premiere Pro", slugs)}')
    remaining = [k for k, v in POSTS.items() if v.get("app", "Premiere Pro") == "Premiere Pro" and k not in covered]
    if remaining:
        sections.append('<h3>More Premiere Pro guides</h3>' + guide_cards("Premiere Pro", remaining))
    return ''.join(sections)
idx = f"""<!doctype html>
<html lang="en"><head>
{ANALYTICS_HEAD}
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23000'/%3E%3Crect x='11' y='27' width='13' height='10' rx='3' fill='%23fff'/%3E%3Crect x='27' y='25' width='14' height='14' rx='4' fill='%23ffeb3b'/%3E%3Crect x='44' y='27' width='9' height='10' rx='3' fill='%23fff'/%3E%3C/svg%3E">
<title>Premiere Pro &amp; After Effects Caption Guides | Captions Gen</title>
<meta name="description" content="Caption workflows for After Effects and Premiere Pro: installation, local transcription, animated graphics, native subtitles, styling and troubleshooting.">
<link rel="canonical" href="{SITE}/blog/"><meta property="og:title" content="Caption guides for Premiere Pro and After Effects"><meta property="og:url" content="{SITE}/blog/">
<style>{CSS}</style></head><body>
{NAV_HTML}
<article><div class="col idx"><h1>Caption guides for Premiere Pro and After Effects</h1><p class="sub">Choose the Adobe application you use. These guides cover Captions Gen's animated graphics and Premiere Pro's native subtitle tools. Written by Kris, maker of Captions Gen.</p>
<div class="box quick-answer"><p class="t">Start with your task</p><ul>
<li><a href="how-to-add-captions-in-after-effects.html">After Effects: install the panel and generate your first captions</a></li>
<li><a href="edit-captions-in-after-effects.html">After Effects: correct caption text and update timing</a></li>
<li><a href="after-effects-captions-not-showing.html">After Effects: fix a missing panel or invisible captions</a></li>
<li><a href="how-to-add-captions-in-premiere-pro.html">Add captions: transcription, styling, and export</a></li>
<li><a href="auto-captions-premiere-pro.html">Generate auto captions with Speech to Text</a></li>
<li><a href="premiere-pro-captions-not-showing.html">Fix captions missing from the preview or export</a></li>
<li><a href="animated-captions-premiere-pro.html">Choose an animated or word-by-word workflow</a></li>
<li><a href="free-caption-plugin-premiere-pro.html">Check the free plugin, compatibility and setup</a></li>
</ul></div><h2 id="after-effects">After Effects</h2><p>Use the Windows panel to create editable animated caption layers in a composition.</p>{guide_cards('After Effects')}
<h2 id="premiere-pro">Premiere Pro</h2><p>Choose native caption tracks for subtitle delivery, or editable graphics for animated caption designs.</p>{grouped_premiere_guides()}</div></article>
<footer><div class="col">© 2026 Captions Gen · <a href="{SITE}/">Home</a> · <a href="{SITE}/product.html">Product facts &amp; compatibility</a> · <a href="{SITE}/#faq">FAQ</a> · <a href="{SITE}/news/">News</a> · {PRIVACY_FOOTER}</div></footer>
</body></html>
"""
with io.open(os.path.join("blog", "index.html"), "w", encoding="utf-8", newline="") as f:
    f.write(idx)
print("wrote index")
for slug, p in POSTS.items():
    related = [{"slug": s, "t": POSTS[s]["h1"]} for s in p.get("rel", []) if s in POSTS]
    html = page(slug, p["title"], p["desc"], p["h1"], p["body"].replace("__FREE__", FREE), related,
                p.get("modified", DATE), p.get("image"), p.get("published", DATE), p.get("faq"), p.get("app", "Premiere Pro"))
    import re as _re
    html = html.replace('<a target="_blank" rel="noopener" ', "<a ").replace('href="https://captionsgen.lemonsqueezy', 'target="_blank" rel="noopener" href="https://captionsgen.lemonsqueezy')
    with io.open(os.path.join("blog", slug + ".html"), "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print("wrote", slug, len(html))

# ---- News: short update posts (tools/news.py) ----------------------------------
from news import NEWS
NEWS_UPDATED = NEWS[0]["date"]
os.makedirs("news", exist_ok=True)
NEWS_NAV = NAV_HTML.replace('<a class="on" href="https://captionsgen.com/blog/">', '<a href="https://captionsgen.com/blog/">').replace('<a href="https://captionsgen.com/news/">', '<a class="on" href="https://captionsgen.com/news/">')
NEWS_FOOTER = f'<footer><div class="col">© 2026 Captions Gen · <a href="{SITE}/">Home</a> · <a href="{SITE}/product.html">Product facts &amp; compatibility</a> · <a href="{SITE}/#faq">FAQ</a> · <a href="{SITE}/blog/">Guides</a> · <a href="{SITE}/news/">News</a> · {PRIVACY_FOOTER}</div></footer>'
NEWS_HEAD = f"""{ANALYTICS_HEAD}
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23000'/%3E%3Crect x='11' y='27' width='13' height='10' rx='3' fill='%23fff'/%3E%3Crect x='27' y='25' width='14' height='14' rx='4' fill='%23ffeb3b'/%3E%3Crect x='44' y='27' width='9' height='10' rx='3' fill='%23fff'/%3E%3C/svg%3E">
<link rel="alternate" type="application/rss+xml" title="Captions Gen news" href="{SITE}/news/feed.xml">"""
NEWS_CLOSING = f"""<div class="box">
<p class="t">Get the update</p>
<p>Already using Captions Gen? Open <strong>Settings &gt; Check for updates</strong> in your Adobe panel. Save your work and close the Adobe apps when the installer asks, then reopen them. To add another Adobe app, use the full Windows setup. Captions Gen is free, with no time limit.</p>
<a class="btn" href="{FREE}">Download free</a>
<a class="btn ghost" href="{SITE}/#how">See how it works</a>
</div>"""
def nice_date(d): return date.fromisoformat(d).strftime("%d %B %Y").lstrip("0")
def news_meta(n):
    v = f'<span class="ver">v{n["version"]}</span>' if n.get("version") else ""
    return f'{v}<time datetime="{n["date"]}">{nice_date(n["date"])}</time>'
for i, n in enumerate(NEWS):
    url = f"{SITE}/news/{n['slug']}.html"
    schema = json.dumps([{
        "@context": "https://schema.org", "@type": "BlogPosting", "headline": n["title"], "description": n["desc"],
        "datePublished": n["date"], "dateModified": n["date"],
        "author": {"@type": "Person", "name": "Kris", "url": "https://github.com/Kriespy10"},
        "publisher": {"@type": "Organization", "name": "Captions Gen", "url": SITE,
                      "logo": {"@type": "ImageObject", "url": f"{SITE}/img/captions-gen-logo.svg"}},
        "mainEntityOfPage": url,
    }, {
        "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "News", "item": f"{SITE}/news/"},
            {"@type": "ListItem", "position": 3, "name": n["title"], "item": url}]
    }], ensure_ascii=False)
    more = "".join(f'<li><a href="{m["slug"]}.html">{escape(m["title"])}</a></li>' for m in NEWS if m is not n)
    t, d = escape(n["title"]), escape(n["desc"])
    html = f"""<!doctype html>
<html lang="en">
<head>
{NEWS_HEAD}
<title>{t}</title>
<meta name="description" content="{d}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">{schema}</script>
<style>{CSS}</style>
</head>
<body>
{NEWS_NAV}
<article><div class="col">
<p class="breadcrumbs"><a href="{SITE}/">Home</a> / <a href="{SITE}/news/">News</a> / {t}</p>
<h1>{t}</h1>
<div class="meta">{news_meta(n)} · by <a href="https://github.com/Kriespy10">Kris</a>, maker of Captions Gen</div>
{n["body"].strip()}
{NEWS_CLOSING}
<div class="box"><p class="t">More updates</p><ul>{more}</ul></div>
</div></article>
{NEWS_FOOTER}
</body>
</html>
"""
    with io.open(os.path.join("news", n["slug"] + ".html"), "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print("wrote news", n["slug"])
news_cards = "".join(f'<a class="post" href="{n["slug"]}.html"><div class="pm">{news_meta(n)}</div><div class="pt">{escape(n["title"])}</div><div class="pd">{escape(n["desc"])}</div></a>' for n in NEWS)
news_idx = f"""<!doctype html>
<html lang="en"><head>
{NEWS_HEAD}
<title>News and updates · Captions Gen</title>
<meta name="description" content="What's new in Captions Gen for Premiere Pro and After Effects on Windows: release notes for every update.">
<link rel="canonical" href="{SITE}/news/"><meta property="og:title" content="Captions Gen news and updates"><meta property="og:url" content="{SITE}/news/">
<style>{CSS}</style></head><body>
{NEWS_NAV}
<article><div class="col idx"><h1>News and updates</h1><p class="sub">What's new in Captions Gen, one short post per update. Check for updates from either Adobe panel. <a href="feed.xml">RSS feed</a></p>
{news_cards}</div></article>
{NEWS_FOOTER}
</body></html>
"""
with io.open(os.path.join("news", "index.html"), "w", encoding="utf-8", newline="") as f:
    f.write(news_idx)
from email.utils import format_datetime
from datetime import datetime, timezone
def rfc822(d): return format_datetime(datetime.fromisoformat(d).replace(hour=12, tzinfo=timezone.utc))
items = "".join(f"""
  <item><title>{escape(n["title"])}</title><link>{SITE}/news/{n["slug"]}.html</link><guid>{SITE}/news/{n["slug"]}.html</guid><pubDate>{rfc822(n["date"])}</pubDate><description>{escape(n["desc"])}</description></item>""" for n in NEWS)
feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Captions Gen news</title><link>{SITE}/news/</link><description>Updates to Captions Gen for Premiere Pro and After Effects.</description><language>en</language><lastBuildDate>{rfc822(NEWS_UPDATED)}</lastBuildDate>{items}
</channel></rss>
"""
io.open(os.path.join("news", "feed.xml"), "w", encoding="utf-8", newline="").write(feed)
print("wrote news index + feed", len(NEWS), "posts")

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      f'  <url><loc>{SITE}/</loc><lastmod>{SITE_UPDATED}</lastmod></url>',
      f'  <url><loc>{PRODUCT["url"]}</loc><lastmod>{PRODUCT["checked"]}</lastmod></url>',
      f'  <url><loc>{SITE}/blog/</loc><lastmod>{GUIDE_INDEX_UPDATED}</lastmod></url>']
sm += [f'  <url><loc>{SITE}/blog/{k}.html</loc><lastmod>{p.get("modified", DATE)}</lastmod></url>' for k, p in POSTS.items()]
sm.append(f'  <url><loc>{SITE}/news/</loc><lastmod>{NEWS_UPDATED}</lastmod></url>')
sm += [f'  <url><loc>{SITE}/news/{n["slug"]}.html</loc><lastmod>{n["date"]}</lastmod></url>' for n in NEWS]
sm.append('</urlset>')
io.open("sitemap.xml", "w", encoding="utf-8", newline="").write(chr(10).join(sm) + chr(10))
print("sitemap", len(POSTS) + 4 + len(NEWS), "urls")
generate_product()
