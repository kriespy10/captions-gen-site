# Competitor fact check, 8 November 2026

Read-only content research for the Captions Gen 1.1.9 website refresh. No content source or plugin files were edited for this audit. Line references below describe the source before the refresh and may move. Current vendor pages were opened, rather than accepting search snippets as current facts. No rankings, traffic, keyword volume or conversion conclusions are inferred.

Read alongside the [1.1.9 release notes](https://captionsgen.com/news/captions-gen-1-1-9.html) and `tools/product.py`. Product copy should reflect the public Windows release for Premiere and After Effects; it must not imply a public Mac release or certified support for earlier After Effects versions.

## Corrections in tools/bodies2.py

### CapCut comparison: replace the universal burned-in claim

Location: `capcut-vs-premiere-pro-captions`, approximately lines 532 and 538. The current paragraph says CapCut captions return as pixels and every typo requires repeating the trip. That only describes an exported video with captions burned in. CapCut's [caption-export help](https://www.capcut.com/help/captions-fail-to-export) documents standalone SRT/TXT export for automatically recognized desktop captions. Its [feature help](https://www.capcut.com/help/how-to-recognise-subtitles) also warns that availability differs by platform, region and version. Adobe documents [SRT import as an editable caption track](https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html).

Minimum replacement: “If you bring a captioned video back from CapCut, burned-in words are pixels and cannot be corrected as text in Premiere. Where your CapCut version and plan offer SRT export, you can bring the text and timing into a Premiere caption track instead. Animated styling does not transfer through that subtitle file.”

Make the revision-time paragraph conditional on the rendered-video workflow. An SRT correction does not necessarily require another video render. Keep the existing instruction to check the installed plan and version: CapCut's [Pro-prompt help](https://www.capcut.com/help/capcut-pro-prompt-standard-user) says premium features can trigger an upgrade at export. Do not replace it with a blanket free or paid caption claim.

The separate free-plugin guide's approximately line 314 paragraph already specifically describes bringing back the video; adding “with captions burned in” makes its condition explicit.

### AutoCut: correct Mac support and the source URL

Location: `best-caption-plugin-premiere-pro`, approximately lines 342 and 348. The table's Mac cell says “Not stated.” The [official pricing page](https://www.autocut.com/en/pricing/) explicitly states macOS and Windows support for Premiere and Resolve. Change this cell to Yes and use this working pricing URL instead of `https://autocut.com/pricing`.

The same page supports the existing AI-plan comparison: $19.80 monthly reference price, $14.90/month with annual billing, $178.80 paid annually, and a 14-day trial without a card. Captions belong to the AI plan; Basic only includes silence removal. Keep these figures as USD checked 8 November 2026, with billing period and vendor-confirmation wording. Do not imply Basic includes captions.

### FireCut: correct Mac support; retain verified Pro prices

Location: same table, approximately line 343. [FireCut downloads](https://firecut.ai/downloads/premiere-pro/) explicitly offers Windows and macOS packages. Change Mac from “Not stated” to Yes.

The [Premiere-specific pricing page](https://www.firecut.ai/pricing/premiere-pro/) supports Pro at $20/month billed yearly, 25 transcription hours per month and a 7-day trial. Its actual HTML also contains the monthly Pro card at $34/month, although the text extractor initially displays only the annual selection. Therefore $240/year and $34 monthly remain supported. The Pro caption limit shares source-video hours with other metered features; it is not 25 hours separately for every feature. Avoid confusing the Premiere plugin with FireCut Shorts or Resolve prices.

### PremiereCopilot: remove unconfirmed paid totals and replace the secondary source

Location: same table, approximately lines 340 and 348. The live [vendor pricing page](https://www.premierecopilot.com/en/pricing) renders Pro+ and Creator prices as a dash in the retrieved current page. Cached search results still show older prices and limits, so they are unsuitable for refreshing the paid amount. The current page explicitly lists macOS, Windows and server-side AI processing. Its current Smart Captions allowance is 2/day free and 20/day Pro+.

Minimum correction: Mac Yes; transcription “Server-side”; free option “Daily limits, check vendor”; paid price and first-year amount “Check vendor.” Remove the $95.88 bar instead of treating a missing price as zero. Even the cached vendor version offered annual billing, making monthly price times twelve inconsistent with the table's “cheapest 12 months” legend. Link the vendor directly and remove the secondary roundup attribution.

### SubMachine: primary verification is available

Location: same table, approximately lines 341 and 348. The [official homepage](https://www.submachine.ai/) advertises a one-week trial. Its linked [official aescripts listing](https://aescripts.com/submachine/) verifies $8/month, $80/year or $150 perpetual, Adobe transcription/MOGRT workflow, and Mac/Windows requirements. Retain the existing price values; change trial “Not stated” to “1-week trial” and Mac “Not stated” to Yes. Cite these primary pages instead of the September roundup.

### Caption Plug and Premiere Assistant: amounts still supported

[Caption Plug](https://www.captionplug.com/) still lists $14.99 once, local Whisper, Windows/Mac downloads and a 14-day refund policy. A refund policy is not a free trial, so preserve that distinction in the column. Cloud APIs are optional; avoid implying every selectable transcription mode is local.

[Premiere Assistant pricing](https://cutback.video/premiere-assistant/pricing) still supports the table's paid monthly range of $9–35, annual effective range of $8–30/month, and $96–360/year. Starter allows three transcriptions per month. The [official FAQ](https://cutback.video/guide/faq) documents Windows and Mac installation paths and a 30-minute maximum per Starter transcription. Mac can be Yes instead of “Not stated,” with the FAQ cited.

### Adobe: preserve the current feature wording

The existing cautious native-feature descriptions remain supported. Adobe's [Single Word instructions](https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-single-word-captions.html), updated 18 August 2026, describe one word per caption synchronized with speech. [Track Styles](https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/create-linked-and-track-styles.html) are reusable across caption tracks.

[Adobe Speech to Text](https://www.adobe.com/products/premiere/speech-to-text.html) confirms inclusion in the Premiere subscription and offline transcription after the relevant language pack is installed. Do not describe native transcription as necessarily cloud-based or native word-by-word captions as unavailable. No numeric Adobe price is needed: [its product page](https://www.adobe.com/products/premiere.html) localizes prices and billing terms, so “included with your separate paid Premiere subscription” is clearer here. Keep transcription languages distinct from caption-translation languages.

## Submagic: actual claims are in tools/bodies3.py

No literal Submagic price/feature comparison was found in `tools/bodies2.py`; it is in `free-submagic-alternative-premiere-pro` in `tools/bodies3.py`, approximately lines 530–607.

[Current pricing](https://www.submagic.co/pricing) still supports USD $19/$39/$69 monthly and $12/$23/$41 per member per month billed yearly. [Upload-limit help](https://care.submagic.co/en/article/what-is-the-size-and-video-length-limit-for-each-video-in-submagic-gl84of/), updated 28 October 2026, confirms 3,000 MB and plan-specific 2/5/30-minute video limits. Date the retained figures, and do not describe an annual equivalent as monthly billing.

[Trial help](https://care.submagic.co/en/article/does-submagic-have-a-free-trial-7opyg3/), also updated 28 October, offers three short uploads and requires a subscription for watermark-free video download. Its marketing page uses different recurring-allowance wording. Safest copy: “Three short videos to try; paid subscription for watermark-free video export,” without promising a recurring free allowance.

The “Edit captions later: in Submagic, before export” comparison is too narrow. The vendor's [video-to-text page](https://www.submagic.co/video-to-text) explicitly advertises SRT export. Distinguish editing a rendered captioned video from importing subtitle text/timing into Premiere. The browser workflow remains valid; [its integration page](https://www.submagic.co/integrations) lists automation/API connections, not a native Premiere panel.

## Editorial minimum

Preserve existing commercial and how-to intent, URLs, author disclosure and useful native-tool alternatives. Replace demonstrably stale cells and conditional workflow claims. Update the comparison's visible checked date and metadata only after applying the actual review. The blanket $15–35/month “poor value” paragraph is editorial opinion rather than a researched finding; simplify to choosing total cost based on the features used. Do not claim measured speed, accuracy superiority or guaranteed AI recommendations from these sources.
