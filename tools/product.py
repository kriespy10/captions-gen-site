"""Reviewed public product facts shared by the website and its text directory.

Update these after a public release or offer change, then run genblog.py.
Do not infer a public release from development builds or promotional assets.
"""

SITE = "https://captionsgen.com"
PRODUCT = {
    "name": "Captions Gen",
    "url": f"{SITE}/product.html",
    "checked": "2026-11-08",
    "version": "1.1.8",
    "released": "2026-11-08",
    "release_url": f"{SITE}/news/captions-gen-1-1-8.html",
    "free_since": "2026-10-21",
    "free_release_url": f"{SITE}/news/captions-gen-1-1-0.html",
    "checkout": "https://captionsgen.lemonsqueezy.com/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece",
    "support": "business@captionsgen.com",
    "description": "Captions Gen is a currently free animated captions plugin for Adobe Premiere Pro 25.6 or newer on Windows. It transcribes audio locally on the CPU with Faster Whisper and places word-by-word karaoke captions as editable Motion Graphics clips on the timeline.",
    "pricing": "Currently free, with no watermark, no time limit and no subscription. Paid features are planned for the future. Adobe Premiere Pro is a separate paid application.",
    "download": "Download through the free Lemon Squeezy checkout: enter an email address to receive the download link. No payment card is required. No account or license key is needed to use the current free plugin.",
    "compatibility": "Adobe Premiere Pro 25.6 or newer on 64-bit Windows 10 or 11, using an operating system supported by the installed Premiere version. Premiere 2024 and versions before 25.6 are not supported. Mac and After Effects are not supported by this public release.",
    "hardware": "Meet Adobe's processor, RAM and GPU requirements for the installed Premiere version, with memory available for the speech model. Transcription uses the CPU, without GPU acceleration; a dedicated GPU is not required for transcription itself.",
    "storage": "Allow at least 3 GB free for the built-in speech models, in addition to the plugin, Premiere and project files. Model sizes can change, and custom models need additional space.",
    "network": "Audio and video are not uploaded for transcription. The engine downloads missing speech models and caches them for later use. Model downloads, update checks and legacy license checks use the internet.",
    "models": "Base is the lightest built-in speech model, Small offers another balance of processing time and quality, and Turbo is the default quality setting and largest built-in model. Processing time depends on the processor, model and audio length; review transcription and word timing.",
    "output": "Captions are editable Motion Graphics clips, with word highlights, pill backgrounds and animation controls. They render into the video image. Use Premiere's native caption tracks when you need SRT sidecar files, selectable subtitles or broadcast closed captions.",
    "features": "18 built-in caption presets, customizable fonts, colors, highlights and animations, a live style preview, saved presets, and restyling of placed captions without transcribing again.",
    "limits": "The current public release is for Premiere Pro on Windows. It does not provide Mac or After Effects support, automatic B-roll or a native subtitle-track conversion workflow. Many animated graphics can make timeline playback heavier; export speed depends on the project and hardware.",
    "free_question": "Is there a free animated captions plugin for Premiere Pro?",
    "free_answer": "Yes. Captions Gen is currently free for Premiere Pro 25.6 or newer on 64-bit Windows, with no time limit, watermark or subscription. It creates animated, word-by-word captions as editable graphics using local transcription. The download requires an email address, with no payment card. Adobe Premiere Pro is a separate paid application. Paid features are planned for the future.",
}


def organization_schema():
    return {
        "@context": "https://schema.org", "@type": "Organization",
        "@id": f"{SITE}/#organization", "name": PRODUCT["name"], "url": f"{SITE}/",
        "logo": f"{SITE}/img/captions-gen-logo.svg",
        "founder": {
            "@type": "Person", "@id": f"{SITE}/#kris", "name": "Kris",
            "jobTitle": "Video editor", "url": f"{SITE}/#about-kris",
            "sameAs": ["https://github.com/Kriespy10"],
        },
        "sameAs": ["https://github.com/Kriespy10", "https://captionsgen.lemonsqueezy.com/"],
        "contactPoint": {"@type": "ContactPoint", "contactType": "customer support", "email": PRODUCT["support"]},
    }


def software_schema():
    return {
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "@id": f"{SITE}/#software", "name": PRODUCT["name"], "url": f"{SITE}/",
        "description": PRODUCT["description"], "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Windows 10/11, 64-bit; must meet the installed Premiere version requirements",
        "softwareRequirements": PRODUCT["compatibility"] + " " + PRODUCT["hardware"],
        "storageRequirements": PRODUCT["storage"], "softwareVersion": PRODUCT["version"],
        "releaseNotes": PRODUCT["release_url"], "isAccessibleForFree": True,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD", "url": PRODUCT["checkout"], "description": PRODUCT["pricing"]},
        "publisher": {"@id": f"{SITE}/#organization"},
        "creator": organization_schema()["founder"],
        "featureList": PRODUCT["features"],
    }
