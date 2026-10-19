# Tells Bing (and through it ChatGPT search, Copilot, Yandex, Seznam) that pages changed.
# Run after publishing: python -B tools/indexnow.py            (every URL in sitemap.xml)
#                   or: python -B tools/indexnow.py URL [URL...] (only those URLs)
import json, re, sys, urllib.request

KEY = "2a88f6ee9b151c8bffbd34b722a31453"  # must match /<KEY>.txt at the site root
HOST = "captionsgen.com"

urls = sys.argv[1:] or re.findall(r"<loc>([^<]+)</loc>", open("sitemap.xml", encoding="utf-8").read())
body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                             headers={"Content-Type": "application/json; charset=utf-8"})
with urllib.request.urlopen(req) as r:
    print(r.status, f"submitted {len(urls)} URLs")  # 200 or 202 = accepted
