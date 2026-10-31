Captions Gen website — https://captionsgen.com/

Static website hosted on GitHub Pages from the main branch. Edit index.html; images are in img/.

The homepage's design playground follows the shipped Captions Gen 1.1.2 panel: Presets (the initial tab), Customize, and Settings, with the active look and shared preview above Presets/Customize. A fresh demo starts on Bold Impact. `caption-presets.mjs` contains the 18 built-ins and current design/grouping defaults from `uxp-panel/main.js`. `caption-engine.mjs` adapts the plugin preview formulas to a four-word, 3.6-second loop; `caption-grouping.mjs` copies the shipped `src/grouping.js` so Caption text controls regroup the timed sample. Sync these modules when the plugin changes. The preview uses web font fallbacks (Montserrat Black for The Bold Font, Bangers for Komika Axis), fits text within its frame, and keeps pill text readable.

The Customize tab has separate Caption text and Design cards. Caption text controls case, punctuation, word/character/duration limits and line count. Design groups follow the panel order: Text, Karaoke, Animation, Stroke, Shadow, Background. Letter spacing uses real pixels from 0 to 16. Group resets restore that part of the active preset. The website uses accessible buttons, labeled inputs and native color inputs in place of UXP widgets.

Save preset opens the contextual Save as preset/Save as new, Update this preset, and Revert changes actions. Your presets are stored separately from the built-ins in browser storage (up to 30); the tile menu can set a main preset, duplicate, rename, export or delete. Main presets are restored on reload. Export uses the plugin's v4 `.cgpreset` format including font metadata; Import accepts current v4 files and asks visitors to migrate older files in the plugin. Existing browser saves migrate their earlier spacing scale once and persist v4 values. No transcription, timeline operations, licensing or engine status is simulated; Settings shows the plugin defaults as disabled controls with an explanation. The footer links to the existing free checkout. Previews play on demand and stop at the end; rendering suspends offscreen and in background tabs, and reduced motion disables automatic replay.

Run `node --test tools/analytics.test.cjs tools/caption-demo.test.mjs worker/worker.test.mjs` for analytics, preview and Worker checks. Check preset switching, custom controls, playback, keyboard disclosure buttons, group resets, and desktop/mobile layout in the browser before publishing.

Generate the guides with `python -B tools/genblog.py` from the repository root. The generator includes the shared analytics assets and preference controls on every guide.

News posts (one per release) live in `tools/news.py`, newest first. The same command builds `news/`, `news/index.html`, the RSS feed `news/feed.xml` and their sitemap entries.

Guide content lives in tools/bodies.py and tools/bodies2.py. Set an entry's `modified` date only when its article content changes; the generator keeps the original publication date and uses the entry's modification date in the page and sitemap. Update SITE_UPDATED in the generator for homepage changes, and GUIDE_INDEX_UPDATED for guide-index changes. Keep the visible article, metadata, pricing, and linked checkout consistent.

Google Analytics uses measurement ID `G-PR571RC95P` in analytics.js. The Google tag loads only after opt-in, only on captionsgen.com and www.captionsgen.com. Trial and buy links send `trial_click` and `checkout_click`; neither is a completed purchase. Visitors can revoke analytics using the footer control.

Run `node --test tools/analytics.test.cjs` to check consent behavior and page coverage. Serve locally with `python -m http.server 8765 --bind 127.0.0.1`; local previews do not send analytics.

Completed purchase tracking requires enabling Lemon Squeezy's Google Analytics integration with the same measurement ID. Configure both website and checkout domains in the Google tag's cross-domain settings before relying on attribution.

After publishing changed pages, run `python -B tools/indexnow.py` to notify Bing through IndexNow (ChatGPT search and Copilot read Bing's index). The key file `2a88f6ee9b151c8bffbd34b722a31453.txt` at the site root must stay published and match the key in the script.
