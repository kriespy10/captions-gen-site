# Blog generator

Edit `tools/bodies.py`, `tools/bodies2.py`, `tools/bodies3.py` or `tools/aftereffects.py` (guides), `tools/news.py` (releases) and `tools/product.py` (current product facts), then from the repo root run:

    python -B tools/genblog.py

Regenerates guides, news, RSS, sitemap, `product.html`, `llms.txt` and homepage product schema. `python -B tools/genproduct.py` updates only the product surfaces. Run `python -B tools/check_seo.py` and the checks in the root README before publishing. Notify changed public URLs through IndexNow after deployment.

Guides share framed illustrations, responsive tables and an on-page contents list derived from their H2 sections. The generator adds a stable ID to an H2 only when the source has none, and keeps source IDs for incoming links. Publication and modification dates remain distinct. Write substantive changes in the source modules; keep the original `published` date and update `modified` for actual content changes.

Use a relevant `img` in ordinary HTML with a descriptive `alt`, its real `width` and `height`, and a contextual figure caption. Label original diagrams as illustrations and provide a full-size link when details benefit from a larger view. The first article image supplies Article metadata unless an entry chooses another image shown in that article. Social metadata uses a bitmap shown in the article when one exists, since social cards generally do not render SVGs. App screenshots and browser illustrations must be described according to what they actually show. Do not imply that a diagram establishes native app testing.

The guide hub separates After Effects tasks from Premiere Pro tasks. Add new After Effects entries to `tools/aftereffects.py` with `app="After Effects"`; cross-link setup, editing, visibility and word-highlighting tasks where they help the reader. The relevant text directory links are maintained in `tools/genproduct.py`. Keep task groups in `genblog.py` consistent when adding a new Premiere guide.
