"""Check the shipped static pages, without network access or third-party packages."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

from product import PRODUCT, software_schema

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://captionsgen.com"


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.canonicals, self.links, self.schemas, self.robots = [], [], [], []
        self.ids, self.text, self.h1s = set(), [], 0
        self.script = None
        self.hidden = 0
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "h1":
            self.h1s += 1
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "link" and "canonical" in a.get("rel", "").split():
            self.canonicals.append(a.get("href"))
        if tag == "meta" and a.get("name", "").lower() in ("robots", "googlebot"):
            self.robots.append(a.get("content", "").lower())
        if tag in ("script", "style"):
            self.hidden += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.script = []

    def handle_endtag(self, tag):
        if tag == "script" and self.script is not None:
            value = json.loads("".join(self.script))
            self.schemas.extend(value if isinstance(value, list) else [value])
            self.script = None
        if tag in ("script", "style"):
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if self.script is not None:
            self.script.append(data)
        if not self.hidden:
            self.text.append(data)


def file_for(url):
    path = unquote(urlsplit(url).path)
    if path.endswith("/"):
        path += "index.html"
    return ROOT / path.lstrip("/")


def check():
    errors = []

    def expect(condition, message):
        if not condition:
            errors.append(message)

    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    sitemap = ET.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in sitemap.findall("s:url/s:loc", ns)]
    expect(len(urls) == len(set(urls)), "Sitemap has duplicate URLs")
    expect(f"{SITE}/product.html" in urls, "Product facts missing from sitemap")
    robots = RobotFileParser()
    robots.parse((ROOT / "robots.txt").read_text(encoding="utf-8").splitlines())
    bots = ("OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User",
            "Googlebot", "Google-Extended", "bingbot")
    pages = {}
    for url in urls:
        expect(url.startswith(SITE + "/"), f"Unexpected sitemap host: {url}")
        path = file_for(url)
        expect(path.is_file(), f"Missing sitemap file: {url}")
        if not path.is_file():
            continue
        try:
            page = pages[url] = Page(path)
        except (ValueError, OSError) as error:
            errors.append(f"Cannot parse {url}: {error}")
            continue
        expect(page.canonicals == [url], f"Non-self or duplicate canonical: {url}")
        expect(page.h1s == 1, f"Expected one H1: {url}")
        expect(not any(re.search(r"noindex|nosnippet|max-snippet\s*:\s*0\b", rule)
                       for rule in page.robots), f"Index/snippet block: {url}")
        for bot in bots:
            expect(robots.can_fetch(bot, url), f"robots.txt blocks {bot}: {url}")
        for schema in page.schemas:
            expect("aggregateRating" not in schema, f"Review ratings require evidence: {url}")
            if schema.get("@type") == "FAQPage":
                text = " ".join(" ".join(page.text).split())
                for question in schema.get("mainEntity", []):
                    expect(question["name"] in text, f"FAQ question absent from HTML: {url}")

    for url, page in pages.items():
        for href in page.links:
            target = urljoin(url, href)
            parts = urlsplit(target)
            if parts.scheme not in ("https", "http") or parts.hostname != "captionsgen.com":
                continue
            if not (parts.path.endswith(("/", ".html")) or not parts.path):
                continue
            target_file = file_for(target)
            expect(target_file.is_file(), f"Broken internal link from {url}: {href}")
            if parts.fragment and target_file.is_file():
                target_page = pages.get(target.split("#")[0].split("?")[0])
                if target_page is None:
                    target_page = Page(target_file)
                expect(unquote(parts.fragment) in target_page.ids,
                       f"Broken internal anchor from {url}: {href}")

    product_schemas = []
    for url in (SITE + "/", SITE + "/product.html"):
        if url not in pages:
            errors.append(f"Missing essential page: {url}")
            continue
        product = [s for s in pages[url].schemas if s.get("@type") == "SoftwareApplication"]
        expect(len(product) == 1, f"Expected one SoftwareApplication: {url}")
        if product:
            product_schemas.append(product[0])
            expect(product[0].get("@id") == SITE + "/#software", f"Unstable product ID: {url}")
            expect(str(product[0].get("offers", {}).get("price")) == "0", f"Wrong free offer: {url}")
    expect(len(product_schemas) == 2 and product_schemas[0] == product_schemas[1],
           "Homepage and product facts schema disagree")
    expect(all(schema == software_schema() for schema in product_schemas),
           "Published software schema differs from the maintained product source")
    manifest = json.loads((ROOT / "update/version.json").read_text(encoding="utf-8"))
    expect(PRODUCT["version"] == manifest["version"],
           "Product facts version differs from the public update manifest")
    llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
    expect(SITE + "/product.html" in llms, "llms.txt missing product reference")
    homepage = pages.get(SITE + "/")
    expect(homepage is not None and any(urljoin(SITE + "/", href) == SITE + "/product.html"
                                       for href in homepage.links),
           "Product reference must be reachable from homepage")
    if errors:
        raise SystemExit("SEO checks failed:\n- " + "\n- ".join(errors))
    print(f"SEO checks passed: {len(pages)} canonical pages; {len(bots)} crawler policies; "
          "internal links, FAQ visibility and shared product schema")


if __name__ == "__main__":
    check()
