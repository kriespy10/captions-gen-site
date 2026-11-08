# Existing guide refresh, 8 November 2026

Reviewed all 29 existing caption guides against the public 1.1.9 release and current Adobe and competitor documentation. Updated 28 article bodies; preserved the missing-caption troubleshooting body. All 29 receive a corrected shared product box generated from `tools/product.py`. The box now describes Premiere Pro and After Effects on Windows, the current free offer, and the difference between animated graphics and subtitle delivery.

The inventory and article decisions are in [the core/style guide review](editorial-bodies1-3.md) and [the remaining guide review](editorial-bodies2.md). [Competitor research](competitor-research.md) records primary sources and billing/platform corrections. Account analytics and raw Search Console responses are stored privately outside this repository.

## Reader-facing changes

- Explain the current Windows setup, Adobe host choices, shared engine and Models folder, model readiness, update steps and bounded After Effects compatibility where those facts help the article's task.
- Retain Premiere-specific native instructions, including Properties, Track Styles, Single Word captions, SRT and caption export. Correct language-pack and auto-detection instructions.
- Distinguish static text formatting, moving highlights, rendered animation and selectable subtitle files. Correct the CapCut and Submagic SRT handoff descriptions.
- Replace unsupported speed, success-rate and universal design claims with steps the reader can check on their own edit.
- Correct shipped preset fonts and their fallback fonts, saved-preset controls, competitor Mac support, billing periods and trials versus refunds.
- Add descriptive links to the existing free-plugin guide from the guide index and relevant caption workflows.

No new article URLs, redirects or deletions are included. Publication dates are preserved. Modification dates reflect the edited bodies and genuine shared product-box change. Historical release articles, downloads, the current update manifest and existing 1.1.7 media are preserved.

## Validation

- `python -B tools/genblog.py` rebuilds the site from its maintained sources.
- `python -B tools/check_seo.py` passes for 42 canonical pages, crawler policies, internal links and fragments, FAQ questions and answers, and shared product schema.
- The existing analytics, caption preview and Worker suite passes all 18 tests.
- Rendered browser review covers the guide index, free-plugin guide, comparison guide, export troubleshooting and Hormozi guide at 1440 x 900 and 390 x 844. No horizontal document overflow was observed; wide comparison tables scroll inside their containers. Navigation, images and the style guide's table-of-contents targets were checked.

These changes improve factual accuracy and access to current information. They do not establish a ranking increase, Google indexing or recommendations by an AI assistant.
