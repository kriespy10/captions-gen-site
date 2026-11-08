# Premiere Pro and After Effects site update

Reviewed the complete public site against the released 1.1.9 Windows setup and the actual signed After Effects package. The homepage previously mentioned both apps in metadata while much of the visible product story still described Premiere alone.

## Current product surfaces

The homepage now presents Premiere Pro and After Effects together, with separate host workflow cards, menu paths, output descriptions and installation requirements. Hero, maker copy, features, pricing, guides, performance advice, FAQs and footer follow that scope. Existing layout and functional hooks are retained. The decorative timeline is identified as a Premiere illustration; the browser playground is identified as a shared style preview, not an Adobe host simulator.

All visible homepage FAQ answers now generate their own FAQ schema. This removes stale machine-readable answers and keeps all 18 questions consistent with the page. Product facts, software schema, the text directory and related current product information remain based on the reviewed public release.

The guide hub groups After Effects and Premiere workflows. The new [After Effects guide](https://captionsgen.com/blog/how-to-add-captions-in-after-effects.html) covers the full Windows setup, source selection, local models, editable caption layers, text/animation updates and rendering. Its publication date is explicitly 8 November. Its instructions were checked against released source, including selected-layer ranges, unsupported retiming, original-file audio and the distinction from SRT delivery.

Each guide identifies its Adobe application and links to the other host's workflow. Premiere-native subtitle, Track Style and SRT tutorials retain their Premiere-specific instructions. The latest release links to the AE walkthrough; earlier release content and downloads are retained.

Privacy copy covers both panels and separates local transcription from optional usage/reporting. It accurately describes pre-choice ID-less counters, optional bug reports with automatically attached bounded/redacted logs, fallible deletion requests and expiry after the last update. The support Worker now labels After Effects reports with their host/version while retaining current and legacy Premiere reports. Notification tests mock mail delivery; no test emails are sent.

## Validation

- The generator and SEO checker pass for 43 canonical pages, including FAQ visibility, internal links/fragments and current product schema.
- All 22 analytics, caption preview and Worker tests pass, including four notification regressions.
- Browser review covers homepage hero, host cards, preview and installation, the guide hub, AE guide, product reference and privacy at desktop and mobile sizes. No document overflow was observed.
- Worker packaging passes a dry run with the existing config and KV binding. The existing [Wrangler deployment workflow](https://developers.cloudflare.com/workers/wrangler/commands/workers/) is used with preserved variables and strict conflict checks.

Public copy does not claim a Mac installer, translation, GPU transcription or earlier After Effects certification. The AE acceptance remains After Effects 2026 on Windows 11. Private account analytics and source inspection receipts remain outside this repository.
