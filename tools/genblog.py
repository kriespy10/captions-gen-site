# -*- coding: utf-8 -*-
# Generates the captionsgen.com guides from their editable source files.
import json, os, io
from datetime import date
from html import escape

SITE = "https://captionsgen.com"
FREE = "https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece"
DATE = "2026-08-26"
SITE_UPDATED = "2026-10-15"
GUIDE_INDEX_UPDATED = "2026-10-19"
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
  .ptable-legend { display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:12.5px; margin:10px 2px 0; }
"""

CLOSING = """
<div class="box">
<p class="t">Try animated captions on your own edit</p>
<p><a href="https://captionsgen.com/#styles">Captions Gen</a> creates word-synced animated graphics inside Premiere Pro, with local Whisper transcription, karaoke highlights, animation presets, and Restyle. Native captions remain useful when you need subtitles or a separate caption file.</p>
<p><strong>Windows 10/11 · Premiere Pro 25.0+</strong>. Try the same plugin with 15 minutes of transcription included before choosing a license.</p>
<p>Launch price: <strong>US$14.99 with LAUNCH</strong>, limited to 100 redemptions. Regular price: US$24.99. Applicable tax is added at checkout. One-time purchase, 3 activations, and all 1.x updates included.</p>
<a class="btn" href="__FREE__">Try free · 15 minutes</a>
<a target="_blank" rel="noopener" class="btn ghost" href="https://captionsgen.lemonsqueezy.com/checkout/buy/dbc6cfa2-cee0-40c4-b73f-38efe70b2b63?checkout%5Bdiscount_code%5D=LAUNCH">Buy · US$14.99 with LAUNCH</a>
</div>
"""

def page(slug, title, desc, h1, body_html, related, modified=DATE, image=None):
    closing = CLOSING.replace("__FREE__", FREE)
    rel = "\n".join(f'<li><a href="{r["slug"]}.html">{r["t"]}</a></li>' for r in related)
    article = {
        "@context": "https://schema.org", "@type": "Article", "headline": h1,
        "datePublished": DATE, "dateModified": modified,
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
    schema = json.dumps([article, breadcrumb], ensure_ascii=False)
    image_meta = f'<meta property="og:image" content="{SITE}{image}">' if image else ''
    display_date = date.fromisoformat(modified).strftime("%d %B %Y").lstrip('0')
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
<meta name="twitter:card" content="{'summary_large_image' if image else 'summary'}">
<script type="application/ld+json">{schema}</script>
<style>{CSS}</style>
</head>
<body>
<nav><div class="wrap">
  <a class="brand" href="https://captionsgen.com/"><svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#000"/><rect x="11" y="27" width="13" height="10" rx="3" fill="#fff"/><rect x="27" y="25" width="14" height="14" rx="4" fill="#ffeb3b"/><rect x="44" y="27" width="9" height="10" rx="3" fill="#fff"/></svg>Captions Gen</a>
  <div class="links">
    <a href="https://captionsgen.com/#styles">Styles</a>
    <a href="https://captionsgen.com/#custom">Build your own</a>
    <a href="https://captionsgen.com/#how">How it works</a>
    <a href="https://captionsgen.com/#install">Install</a>
    <a href="https://captionsgen.com/#faq">FAQ</a>
    <a class="on" href="https://captionsgen.com/blog/">Guides</a>
    <a class="buy" href="https://captionsgen.com/#buy">Buy · $14.99</a>
  </div>
</div></nav>
<article><div class="col">
<p class="breadcrumbs"><a href="{SITE}/">Home</a> / <a href="{SITE}/blog/">Caption guides</a> / {h1}</p>
<h1>{h1}</h1>
<div class="meta">Updated <time datetime="{modified}">{display_date}</time> · by <a href="https://github.com/Kriespy10">Kris</a>, maker of Captions Gen</div>
{body_html}
{closing}
<div class="box"><p class="t">Related guides</p><ul>{rel}</ul></div>
</div></article>
<footer><div class="col">© 2026 Captions Gen · <a href="{SITE}/">Home</a> · <a href="{SITE}/#faq">FAQ</a> · <a href="{SITE}/blog/">Guides</a> · {PRIVACY_FOOTER}</div></footer>
</body>
</html>
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bodies import POSTS
from bodies2 import P
REL0 = {
  "how-to-add-captions-in-premiere-pro": ["auto-captions-premiere-pro","premiere-pro-captions-not-showing","burn-in-captions-premiere-pro"],
  "auto-captions-premiere-pro": ["how-to-add-captions-in-premiere-pro","premiere-pro-captions-not-showing","animated-captions-premiere-pro"],
  "animated-captions-premiere-pro": ["word-by-word-captions-premiere-pro","highlight-words-in-captions-premiere-pro","best-caption-plugin-premiere-pro"],
  "premiere-pro-captions-not-showing": ["how-to-add-captions-in-premiere-pro","premiere-pro-captions-not-exporting","premiere-pro-speech-to-text-not-working"],
}
for k, v in REL0.items(): POSTS[k]["rel"] = v
POSTS.update(P)
POSTS["animated-captions-premiere-pro"]["image"] = "/img/styles/Beast.png"

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
    <a class="buy" href="https://captionsgen.com/#buy">Buy · $14.99</a>
  </div>
</div></nav>"""
cards = "".join(f'<a class="post" href="{k}.html"><div class="pt">{v["h1"]}</div><div class="pd">{v["desc"]}</div></a>' for k, v in POSTS.items())
idx = f"""<!doctype html>
<html lang="en"><head>
{ANALYTICS_HEAD}
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23000'/%3E%3Crect x='11' y='27' width='13' height='10' rx='3' fill='%23fff'/%3E%3Crect x='27' y='25' width='14' height='14' rx='4' fill='%23ffeb3b'/%3E%3Crect x='44' y='27' width='9' height='10' rx='3' fill='%23fff'/%3E%3C/svg%3E">
<title>Premiere Pro caption guides · Captions Gen</title>
<meta name="description" content="Practical guides on captions in Premiere Pro: adding captions, auto captions, animated karaoke captions, and fixing captions that won't show.">
<link rel="canonical" href="{SITE}/blog/"><meta property="og:title" content="Premiere Pro caption guides"><meta property="og:url" content="{SITE}/blog/">
<style>{CSS}</style></head><body>
{NAV_HTML}
<article><div class="col idx"><h1>Premiere Pro caption guides</h1><p class="sub">Practical workflows for native subtitles and animated caption graphics. Written by Kris, maker of Captions Gen.</p>
<div class="box quick-answer"><p class="t">Start with your task</p><ul>
<li><a href="how-to-add-captions-in-premiere-pro.html">Add captions: transcription, styling, and export</a></li>
<li><a href="auto-captions-premiere-pro.html">Generate auto captions with Speech to Text</a></li>
<li><a href="premiere-pro-captions-not-showing.html">Fix captions missing from the preview or export</a></li>
<li><a href="animated-captions-premiere-pro.html">Choose an animated or word-by-word workflow</a></li>
</ul></div>{cards}</div></article>
<footer><div class="col">© 2026 Captions Gen · <a href="{SITE}/">Home</a> · <a href="{SITE}/#faq">FAQ</a> · {PRIVACY_FOOTER}</div></footer>
</body></html>
"""
with io.open(os.path.join("blog", "index.html"), "w", encoding="utf-8", newline="") as f:
    f.write(idx)
print("wrote index")
for slug, p in POSTS.items():
    related = [{"slug": s, "t": POSTS[s]["h1"]} for s in p.get("rel", []) if s in POSTS]
    html = page(slug, p["title"], p["desc"], p["h1"], p["body"].replace("__FREE__", FREE), related,
                p.get("modified", DATE), p.get("image"))
    import re as _re
    html = html.replace('<a target="_blank" rel="noopener" ', "<a ").replace('href="https://captionsgen.lemonsqueezy', 'target="_blank" rel="noopener" href="https://captionsgen.lemonsqueezy')
    with io.open(os.path.join("blog", slug + ".html"), "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print("wrote", slug, len(html))

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      f'  <url><loc>{SITE}/</loc><lastmod>{SITE_UPDATED}</lastmod></url>', f'  <url><loc>{SITE}/blog/</loc><lastmod>{GUIDE_INDEX_UPDATED}</lastmod></url>']
sm += [f'  <url><loc>{SITE}/blog/{k}.html</loc><lastmod>{p.get("modified", DATE)}</lastmod></url>' for k, p in POSTS.items()]
sm.append('</urlset>')
io.open("sitemap.xml", "w", encoding="utf-8", newline="").write(chr(10).join(sm) + chr(10))
print("sitemap", len(POSTS) + 2, "urls")
