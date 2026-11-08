# Captions Gen: AI visibility research and live baseline

Checked 8 November 2026 (Europe/Amsterdam). This is a read-only research and HTTP baseline captured before the changes made for this audit are published. It describes public responses and documentation, not private index state or a completed ChatGPT/Gemini/Claude recommendation benchmark.

## Finding

The sampled live pages are accessible and already publish substantial product information as static HTML. The available search tool can find Captions Gen for a neutral free-plugin query. A blanket crawler block is not supported by this sample. Search extracts still contain older requirements even where the live pages have been corrected; factual consistency, fresh retrieval, clear product evidence, and independent coverage are the priorities. Crawl eligibility alone cannot guarantee an assistant will recommend the product.

## Live HTTP access baseline

Requests used Python's HTTP client from this workstation without browser rendering. All paths below resolved directly to the same HTTPS URL on `captionsgen.com`, returned HTTP 200, and reported `Server: GitHub.com`.

| Path | User agent | Content type | Bytes | Index/access observations |
| --- | --- | --- | ---: | --- |
| `/` | Normal browser | `text/html; charset=utf-8` | 79,452 | Self-canonical; no robots meta or X-Robots-Tag |
| `/` | `OAI-SearchBot` | `text/html; charset=utf-8` | 79,452 | Same response body as normal browser |
| `/` | `Claude-SearchBot` | `text/html; charset=utf-8` | 79,452 | Same response body as normal browser |
| `/` | `Claude-User` | `text/html; charset=utf-8` | 79,452 | Same response body as normal browser |
| `/` | `Googlebot` | `text/html; charset=utf-8` | 79,452 | Same response body as normal browser |
| `/robots.txt` | Normal browser | `text/plain; charset=utf-8` | 409 | Wildcard `Allow: /`; sitemap declared |
| `/llms.txt` | Normal browser | `text/plain; charset=utf-8` | 13,854 | Product facts and guide links; no X-Robots-Tag |
| `/sitemap.xml` | Normal browser | `application/xml` | 4,585 | Homepage, guide, and release-note URLs present |
| `/blog/free-caption-plugin-premiere-pro.html` | Normal browser | `text/html; charset=utf-8` | 20,720 | Self-canonical; no robots meta or X-Robots-Tag |

The five homepage response bodies had the same SHA-256: `71e98e4e5afeff4f03fd8744aa08950d7dbf94f0616505b04941185cb14d8862`. No sampled response contained the checked challenge markers (`cf-chl-`, “Just a moment...”, “Attention Required!”, “captcha”, or “Verify you are human”). This is a limited marker check, not an exhaustive security-system assessment.

These requests only changed the User-Agent header. They did not originate from verified OpenAI, Anthropic, or Google crawler IP addresses. They cannot prove that real crawlers are unblocked, have visited, indexed the pages, or refreshed cached information. Genuine crawler verification requires host/CDN logs and the providers' verification guidance. The current wildcard robots group already permits `Claude-SearchBot` and `Claude-User`; adding explicit groups documents the intent but does not itself remove an observed block.

The live homepage's canonical URL is [captionsgen.com](https://captionsgen.com/). The sampled guide's canonical is [Free caption plugins for Premiere Pro](https://captionsgen.com/blog/free-caption-plugin-premiere-pro.html). Neither sampled HTML response had a `noindex` directive.

## Current provider controls and methods

| Surface | What to permit/check | Distinction |
| --- | --- | --- |
| ChatGPT search | `OAI-SearchBot` in robots.txt and at the hosting layer; published crawler IP ranges | `GPTBot` concerns training independently. `ChatGPT-User` supports user-initiated fetches and does not control search inclusion. |
| Claude search and retrieval | `Claude-SearchBot` and `Claude-User` | `ClaudeBot` concerns potential training use; it is not the search crawler. |
| Gemini Apps | Google crawl/index access and the `Google-Extended` product token | Google-Extended governs both Gemini Apps grounding from the Search index and future Gemini training. |
| Google Search AI Overviews / AI Mode | Googlebot, indexing, snippet eligibility, and Search Console's Search generative AI inclusion control | These Google Search surfaces are distinct from Gemini Apps. |

Sources: [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended), [Google Search AI guidance](https://developers.google.com/search/docs/appearance/ai-features), and [Search generative AI control](https://support.google.com/webmasters/answer/16908024?hl=en).

The live robots.txt explicitly allows `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `Google-Extended`, and Bingbot, among others. Search access and training policy should be treated as separate choices where a provider exposes separate controls. In particular, blocking Google-Extended can affect Gemini Apps grounding while leaving ordinary Google Search inclusion unchanged.

Google's official Search AI guidance prioritizes normal SEO: accessible pages, useful textual content, internal links, good page experience, and structured data matching visible content. It requires neither a special AI file nor special AI schema. Indexing and serving are not guaranteed. [Google Search AI guidance](https://developers.google.com/search/docs/appearance/ai-features)

Static HTML is useful across retrieval systems. Google can render JavaScript, but recommends server-side rendering or prerendering because not all bots execute it. This site already returns its important text in HTML; preserving that is more valuable than introducing a JavaScript-only product reference. [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

`SoftwareApplication` JSON-LD can describe the plugin. Google specifies an offer price of zero for a free app. Software rich-result eligibility additionally requires a real review or rating; do not invent either to satisfy that requirement. Valid descriptive schema and guaranteed rich-result display are different things. [Software application structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)

The current llms.txt v2 proposal, updated 10 August 2026, recommends a small index linking to clean Markdown references. Discovery links can use `rel="alternate" type="text/markdown"` and `rel="describedby"`. Treat this as an optional agent accessibility aid, with the same facts as the visible site, rather than evidence of a ranking boost or universal assistant adoption. [llms.txt proposal](https://llmstxt.org/)

IndexNow notifies participating search engines about changed URLs. It does not guarantee crawling/indexing, is not a universal submission channel to the three assistants, and should be used after relevant changes are live. Avoid repeated submissions without meaningful changes. [IndexNow FAQ](https://www.indexnow.org/faq)

## Recent measurement and policy changes

- Google reports that its Search Console **Generative AI performance report** rolled out worldwide on 31 August 2026. It reports impressions from AI Overviews and AI Mode, with page/country/device/date dimensions. It is not a Gemini Apps report; low-impression properties may not see it. Older advice that GSC cannot separate any AI visibility is outdated. [Official report documentation](https://support.google.com/webmasters/answer/16984139?hl=en)
- Google's separate **Search generative AI inclusion control** also rolled out worldwide on that date. Verify the site's effective setting, including inheritance, before concluding that technical eligibility is complete. [Official control documentation](https://support.google.com/webmasters/answer/16908024?hl=en)
- Bing's AI Performance dashboard reports sampled citations for Copilot, Bing AI summaries, and selected partner experiences. Citation counts are not visits, recommendation rankings, or complete coverage of ChatGPT/Gemini/Claude. [Bing AI Performance documentation](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
- Anthropic says it began recognizing a general machine-readable AI training preference signal on 30 October 2026, with explicit ClaudeBot rules taking precedence. This is a training preference development, not an inclusion shortcut. [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

The connected GSC Wizard returned `payment_required` because its subscription was inactive during this task. It was not retried. Private GSC indexing, performance, and Search generative AI inclusion settings remain unverified; public HTTP responses cannot substitute for those account checks.

## Search baseline and freshness evidence

Queries run through the available web-search tool included:

- `free captions plugin premiere pro no watermark`
- `"Captions Gen" plugin Premiere Pro free`
- `"Captions Easy" "free" Premiere Pro`
- `site:captionsgen.com free caption plugin premiere pro`

The neutral free-plugin query returned the [Captions Gen homepage](https://captionsgen.com/), [release announcement](https://captionsgen.com/news/captions-gen-1-1-0.html), and a [Maker Launches listing](https://makerlaunches.com/launch/captions-gen), alongside other products. This establishes discoverability in this particular search tool at this time. It does not establish Google/Bing ranking positions, repeatable recommendation share, or behavior inside the three consumer assistants.

One returned homepage extract still described GPU-accelerated transcription and approximately 1 GB model storage. A returned [Submagic alternative guide](https://captionsgen.com/blog/submagic-alternative-premiere-pro.html) extract still said Premiere 25.0+. Direct HTTP reads of the live homepage and guide instead showed Premiere 25.6+, local CPU transcription, and, where storage was discussed, at least 3 GB for models. Search extracts can lag the source; they should not be treated as current product specifications or proof the current page still contains the older claims.

The search sample also surfaced an older community discussion asserting that convenient free caption tools were unavailable. Historical discussions can remain discoverable long after product availability changes. Do not infer that a particular assistant used that discussion without inspecting its actual citations.

## Priorities tailored to Captions Gen

1. **Keep one clear product reference.** State the public brand consistently as Captions Gen. Include Premiere 25.6+, Windows-only support, local CPU transcription, editable Motion Graphics output, and exact free terms. Explain that the plugin is free while Premiere itself remains required. Put these facts in visible HTML and generate any Markdown/llms/schema representation from the same source.
2. **Answer eligibility and workflow questions directly.** Free with no time limit/watermark/subscription; email needed for the free download; no card; no Mac support; model downloads and update checks need the internet. Explain graphics versus native subtitle tracks/SRT so assistants can recommend it for the right use case.
3. **Use existing useful guides rather than multiplying similar pages.** Give the homepage, free-plugin guide, installation help, and product reference clear internal links. Keep comparisons accurate, date checked, and explicit about the maker's commercial relationship. Do not imply this is the only free plugin without a current comprehensive comparison.
4. **Preserve evidence and freshness.** Link versioned release notes, current requirements, screenshots, and a real workflow demo. Update modification dates only for actual content changes. After publication, submit changed URLs through existing sitemap/IndexNow flows and inspect priority URLs in the webmaster accounts.
5. **Align independent descriptions.** Audit existing directory listings, checkout descriptions, public repository descriptions, and demo/video descriptions against the same fact sheet. The Maker Launches listing currently reflects free/local/editable captions, but its category is “Figma & app plugins” and it omits the Windows-only and Premiere 25.6+ limitations. Prepare owner edits adding these facts and a product-reference link. No listing changes, purchases, messages, or outreach were performed in this audit.

These are practical applications of the documented retrieval and content principles, not experimentally proven ranking factors for this product. Improving access and evidence cannot instantly change model training data or force a recommendation.

## Neutral benchmark to run after publication

Run these unbranded prompts in fresh ChatGPT, Gemini, and Claude sessions:

1. Is there a free animated captions plugin for Premiere Pro without a watermark?
2. What free Premiere Pro plugins can make word-by-word karaoke captions on Windows?
3. I use Premiere Pro 25.6 on Windows. How can I add animated captions without a subscription?
4. Which Premiere Pro caption tools transcribe locally instead of uploading my video?
5. Compare free plugins for editable animated captions in Premiere Pro. Include limitations and sources.
6. Can I get CapCut-style word highlights inside Premiere Pro for free?
7. I need an SRT file and accessible closed captions from Premiere Pro. What workflow should I use?
8. I use Premiere Pro on a Mac. Which free caption tools are compatible?

Prompts 7 and 8 check correct qualification: a Windows-only graphics plugin should not be recommended indiscriminately. In separate diagnostic sessions, ask “Is Captions Gen free, and what does it require?” Then test an explicit product URL only for retrieval troubleshooting. Brand/URL-supplied tests do not count toward spontaneous discovery.

For each observation record date, app, model if shown, locale, exact prompt, web-search setting, source links, product mention, whether actually recommended, and correctness of price/limits/OS/version/output claims. Run each unbranded prompt three times per app in independent fresh sessions with web retrieval enabled; record retrieval-disabled behavior separately. Save responses or screenshots. Compare against the same prompt set after 14 and 30 days. Report raw counts and variability, not a universal ranking claim.

Track assistant referral visits and download/checkout starts separately from mentions and citations. Consent-dependent analytics may undercount; checkout clicks are not completed downloads. Pair actual consumer-app observations with GSC AI impressions and verified crawler logs where available. No three-app baseline or improvement percentage has been established by this report.
