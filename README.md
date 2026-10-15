Captions Gen website — https://captionsgen.com/

Static website hosted on GitHub Pages from the main branch. Edit index.html; images are in img/.

The homepage's design playground uses four fixed words, “Captions made for you”. `caption-presets.mjs` contains the 17 built-in preset values and defaults from Captions Gen 1.0.8 (`uxp-panel/main.js`). `caption-engine.mjs` adapts the plugin's `src/service.mjs` preview formulas to a four-word, 3.6-second loop. `caption-demo.js` wires the settings and playback; `caption-demo.css` styles the compact Design panel. Keep these in sync when plugin presets change. The browser demo fits text within its frame, uses web font fallbacks, and ensures contrasting pill text like the marketing previews. It transcribes no media, uploads nothing, and pauses rendering offscreen, in background tabs, or by default for reduced motion.

Run `node --test tools/analytics.test.cjs tools/caption-demo.test.mjs` for analytics and preview checks. Check preset switching, custom controls, playback, keyboard tabs, and desktop/mobile layout in the browser before publishing.

Generate the guides with `python -B tools/genblog.py` from the repository root. The generator includes the shared analytics assets and preference controls on every guide.

Guide content lives in tools/bodies.py and tools/bodies2.py. Set an entry's `modified` date only when its article content changes; the generator keeps the original publication date and uses the entry's modification date in the page and sitemap. Update SITE_UPDATED in the generator for homepage changes, and GUIDE_INDEX_UPDATED for guide-index changes. Keep the visible article, metadata, pricing, and linked checkout consistent.

Google Analytics uses measurement ID `G-PR571RC95P` in analytics.js. The Google tag loads only after opt-in, only on captionsgen.com and www.captionsgen.com. Trial and buy links send `trial_click` and `checkout_click`; neither is a completed purchase. Visitors can revoke analytics using the footer control.

Run `node --test tools/analytics.test.cjs` to check consent behavior and page coverage. Serve locally with `python -m http.server 8765 --bind 127.0.0.1`; local previews do not send analytics.

Completed purchase tracking requires enabling Lemon Squeezy's Google Analytics integration with the same measurement ID. Configure both website and checkout domains in the Google tag's cross-domain settings before relying on attribution.
