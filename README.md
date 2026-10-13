Captions Gen website — https://captionsgen.com/

Static website hosted on GitHub Pages from the main branch. Edit index.html; images are in img/.

Generate the guides with `python -B tools/genblog.py` from the repository root. The generator includes the shared analytics assets and preference controls on every guide.

Google Analytics uses measurement ID `G-PR571RC95P` in analytics.js. The Google tag loads only after opt-in, only on captionsgen.com and www.captionsgen.com. Trial and buy links send `trial_click` and `checkout_click`; neither is a completed purchase. Visitors can revoke analytics using the footer control.

Run `node --test tools/analytics.test.cjs` to check consent behavior and page coverage. Serve locally with `python -m http.server 8765 --bind 127.0.0.1`; local previews do not send analytics.

Completed purchase tracking requires enabling Lemon Squeezy's Google Analytics integration with the same measurement ID. Configure both website and checkout domains in the Google tag's cross-domain settings before relying on attribution.
