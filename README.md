Captions Gen website — https://captionsgen.com/

Static website hosted on GitHub Pages from the main branch. Edit index.html; images are in img/.

The homepage's design playground uses four fixed words, “Captions made for you”. `caption-presets.mjs` contains the 17 built-in preset values and defaults from Captions Gen 1.0.8 (`uxp-panel/main.js`). `caption-engine.mjs` adapts the plugin's `src/service.mjs` preview formulas to a four-word, 3.6-second loop. `caption-demo.js` wires the settings, on-demand playback, and preset gallery; `caption-demo.css` follows the supplied Premiere screenshots. The browser demo has Captions and Presets views, with its preview inside the Design card. Preset thumbnails use the same four sample words; category filters and the Use action follow the plugin. Save stores up to 30 named designs locally in the visitor's browser, with a Mine filter and per-preset deletion. No transcription, license activation, or service status is simulated. Keep these in sync when plugin presets change. The browser demo fits text within its frame, uses web font fallbacks, and ensures contrasting pill text like the marketing previews. It transcribes no media and uploads nothing. Previews play on demand and stop when finished; rendering suspends offscreen and in background tabs. Reduced motion suppresses automatic motion previews.

The Design card follows the six disclosure groups in `uxp-panel/index.html`: Text, Karaoke, Stroke, Shadow, Background, and Animation. Keep their order, labels, grouped controls, In/Out columns, hollow slider knobs, and sentence-case typography aligned with the plugin. PRESET_META in caption-presets.mjs comes from uxp-panel/main.js. The website uses accessible buttons, labeled inputs, and color inputs in place of UXP-only widgets. Group resets restore that part of the active preset.

Run `node --test tools/analytics.test.cjs tools/caption-demo.test.mjs worker/worker.test.mjs` for analytics, preview and Worker checks. Check preset switching, custom controls, playback, keyboard disclosure buttons, group resets, and desktop/mobile layout in the browser before publishing.

Generate the guides with `python -B tools/genblog.py` from the repository root. The generator includes the shared analytics assets and preference controls on every guide.

News posts (one per release) live in `tools/news.py`, newest first. The same command builds `news/`, `news/index.html`, the RSS feed `news/feed.xml` and their sitemap entries.

Guide content lives in tools/bodies.py and tools/bodies2.py. Set an entry's `modified` date only when its article content changes; the generator keeps the original publication date and uses the entry's modification date in the page and sitemap. Update SITE_UPDATED in the generator for homepage changes, and GUIDE_INDEX_UPDATED for guide-index changes. Keep the visible article, metadata, pricing, and linked checkout consistent.

Google Analytics uses measurement ID `G-PR571RC95P` in analytics.js. The Google tag loads only after opt-in, only on captionsgen.com and www.captionsgen.com. Trial and buy links send `trial_click` and `checkout_click`; neither is a completed purchase. Visitors can revoke analytics using the footer control.

Run `node --test tools/analytics.test.cjs` to check consent behavior and page coverage. Serve locally with `python -m http.server 8765 --bind 127.0.0.1`; local previews do not send analytics.

Completed purchase tracking requires enabling Lemon Squeezy's Google Analytics integration with the same measurement ID. Configure both website and checkout domains in the Google tag's cross-domain settings before relying on attribution.

After publishing changed pages, run `python -B tools/indexnow.py` to notify Bing through IndexNow (ChatGPT search and Copilot read Bing's index). The key file `2a88f6ee9b151c8bffbd34b722a31453.txt` at the site root must stay published and match the key in the script.
