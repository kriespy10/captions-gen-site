// Aggregate public GitHub release-asset counters. These are download requests,
// not unique people or confirmed completed installations. No visitor IDs are kept.
const REPOSITORY = "kriespy10/captions-gen-site";
const RELEASES = `https://github.com/${REPOSITORY}/releases`;
const SETUP = /^CaptionsGen-Setup-(\d+\.\d+\.\d+)\.exe$/;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json", "cache-control": "private, no-store" },
});

export async function downloads(request, env, url, fetchImpl = fetch) {
  if (url.pathname !== "/api/downloads" || request.method !== "GET") return null;
  if (!env.ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${env.ADMIN_TOKEN}`)
    return json({ ok: false, error: "unauthorized" }, 401);
  try {
    const files = [];
    let more = true;
    for (let page = 1; more; page++) {
      // Refuse an incomplete total if a future repository needs more pages.
      if (page > 10) throw new Error("too many releases");
      const response = await fetchImpl(`https://api.github.com/repos/${REPOSITORY}/releases?per_page=100&page=${page}`, {
        headers: { accept: "application/vnd.github+json", "user-agent": "CaptionsGen-download-dashboard", "x-github-api-version": "2026-03-10" },
        signal: AbortSignal.timeout(8000),
        cf: { cacheTtl: 300, cacheEverything: true },
      });
      if (!response.ok) throw new Error("GitHub unavailable");
      const releases = await response.json();
      if (!Array.isArray(releases)) throw new Error("invalid releases");
      for (const release of releases) {
        if (release.draft || release.prerelease) continue;
        if (!Array.isArray(release.assets)) throw new Error("invalid assets");
        for (const asset of release.assets) {
          const match = SETUP.exec(asset.name);
          if (!match || asset.state !== "uploaded") continue;
          if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0)
            throw new Error("invalid download count");
          files.push({ name: asset.name, version: match[1], downloads: asset.download_count });
        }
      }
      more = /rel="next"/.test(response.headers.get("link") || "");
    }
    if (!files.length) throw new Error("no published installers");
    return json({ ok: true, source: "GitHub release assets", total: files.reduce((n, file) => n + file.downloads, 0), files, releasesUrl: RELEASES });
  } catch {
    return json({ ok: false, error: "Installer download counts are temporarily unavailable." }, 503);
  }
}
