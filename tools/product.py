"""Reviewed public product facts shared by the website and its text directory.

Update these after a public release or offer change, then run genblog.py.
Do not infer a public release from development builds or promotional assets.
"""

SITE = "https://captionsgen.com"
AFTER_EFFECTS_COMPATIBILITY = "After Effects has been tested with After Effects 2026 on Windows 11; earlier After Effects versions are not certified for this release."
PRODUCT = {
    "name": "Captions Gen",
    "url": f"{SITE}/product.html",
    "checked": "2026-11-10",
    "version": "1.1.11",
    "released": "2026-11-10",
    "release_url": "https://captionsgen.com/news/captions-gen-1-1-11.html",
    "free_since": "2026-10-21",
    "free_release_url": f"{SITE}/news/captions-gen-1-1-0.html",
    "download_url": "https://api.captionsgen.com/api/download/windows",
    "support": "business@captionsgen.com",
    "description": "Captions Gen is a currently free animated captions plugin for Adobe Premiere Pro and After Effects on Windows. It transcribes audio locally on the CPU with Faster Whisper, then places editable Motion Graphics clips in Premiere or native caption layers in After Effects.",
    "pricing": "Currently free, with no watermark, no time limit and no subscription. Paid features are planned for the future. Adobe Premiere Pro and After Effects are separate paid applications.",
    "download": "Download one Windows setup directly. No email address is required; newsletter signup is optional. Choose Premiere Pro, After Effects, or both during setup. No payment card is required. No account or license key is needed to use the current free plugin.",
    "after_effects_compatibility": AFTER_EFFECTS_COMPATIBILITY,
    "compatibility": "Premiere Pro 25.6 or newer on supported 64-bit Windows 10 or 11. " + AFTER_EFFECTS_COMPATIBILITY + " Creative Cloud Desktop and Adobe installation permissions are required. Install either panel or both with the same Windows setup. Premiere versions before 25.6 are not supported. This public release does not include a Mac installer.",
    "hardware": "Meet Adobe's processor, RAM and GPU requirements for the Adobe application you use, with memory available for the speech model. Transcription uses the CPU, without GPU acceleration; a dedicated GPU is not required for transcription itself.",
    "storage": "Allow at least 3 GB free for the built-in speech models, in addition to the plugin, Adobe applications and project files. Both panels use the same engine and Models folder. Model sizes can change, and custom models need additional space.",
    "network": "Audio and video are not uploaded for transcription. The engine downloads missing speech models and caches them for later use. Model downloads, update checks and legacy license checks use the internet.",
    "models": "Base is the lightest built-in speech model, Small offers another balance of processing time and quality, and Turbo is the default quality setting and largest built-in model. Processing time depends on the processor, model and audio length; review transcription and word timing.",
    "output": "Premiere receives editable Motion Graphics clips; After Effects receives native editable caption layers in your composition. Word highlights, pill backgrounds and animations render into the video image. Use Premiere's native caption tracks when you need SRT sidecar files, selectable subtitles or broadcast closed captions.",
    "features": "18 built-in caption presets, customizable fonts, colors, highlights and animations, a live style preview, saved presets, Apply style for placed captions, searchable spoken languages, compatible custom speech models and animation updates after caption edits.",
    "limits": "The public release supports Premiere Pro and After Effects on Windows. It does not include a Mac installer, translation, automatic B-roll or native subtitle-track conversion. Many animated captions can make playback heavier; export speed depends on the project and hardware.",
    "free_question": "Is there a free animated captions plugin for Premiere Pro?",
    "free_answer": "Yes. Captions Gen is currently free for Premiere Pro 25.6 or newer on 64-bit Windows, with no time limit, watermark or subscription. It creates animated, word-by-word captions as editable graphics using local transcription. Download the installer directly. No email address or payment card is required. Adobe Premiere Pro is a separate paid application. Paid features are planned for the future.",
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
        "sameAs": ["https://github.com/Kriespy10"],
        "contactPoint": {"@type": "ContactPoint", "contactType": "customer support", "email": PRODUCT["support"]},
    }


def software_schema():
    return {
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "@id": f"{SITE}/#software", "name": PRODUCT["name"], "url": f"{SITE}/",
        "description": PRODUCT["description"], "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Windows 10/11, 64-bit; must meet the installed Adobe application requirements",
        "softwareRequirements": PRODUCT["compatibility"] + " " + PRODUCT["hardware"],
        "storageRequirements": PRODUCT["storage"], "softwareVersion": PRODUCT["version"],
        "releaseNotes": PRODUCT["release_url"], "isAccessibleForFree": True,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD", "url": PRODUCT["download_url"], "description": PRODUCT["pricing"]},
        "publisher": {"@id": f"{SITE}/#organization"},
        "creator": organization_schema()["founder"],
        "featureList": PRODUCT["features"],
    }
