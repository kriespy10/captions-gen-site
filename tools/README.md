# Blog generator

Edit `tools/bodies.py`, `tools/bodies2.py` or `tools/bodies3.py` (post text), `tools/news.py` (releases) and `tools/product.py` (current product facts), then from the repo root run:

    python -B tools/genblog.py

Regenerates guides, news, RSS, sitemap, `product.html`, `llms.txt` and homepage product schema. `python -B tools/genproduct.py` updates only the product surfaces. Run `python -B tools/check_seo.py` and the checks in the root README before publishing. Notify changed public URLs through IndexNow after deployment.
