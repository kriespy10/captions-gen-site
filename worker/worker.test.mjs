// Worker routes against an in-memory KV: node --test worker/worker.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { notify } from "./report-worker.js";
import { downloads } from "./downloads.js";

function setup(overrides = {}) {
  const store = new Map();
  const kv = {
    get: async (k) => store.get(k) ?? null,
    put: async (k, v) => void store.set(k, v),
    delete: async (k) => void store.delete(k),
    list: async ({ prefix }) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }),
  };
  const env = { REPORTS: kv, ADMIN_TOKEN: "admin", ...overrides };
  let ip = 0;
  const call = (method, path, body, headers = {}) =>
    worker.fetch(
      new Request("https://api.captionsgen.com" + path, {
        method,
        body: body == null ? undefined : typeof body === "string" ? body : JSON.stringify(body),
        headers: { "cf-connecting-ip": `10.0.0.${++ip}`, ...headers },
      }),
      env,
    );
  return { store, call };
}
const admin = { authorization: "Bearer admin" };
const ID = "123e4567-e89b-42d3-a456-426614174000";

test("website newsletter preflight allows only exact production origins, POST and Content-Type", async () => {
  const { call } = setup();
  for (const origin of ["https://captionsgen.com", "https://www.captionsgen.com"]) {
    const response = await call("OPTIONS", "/api/subscribe", null, {
      origin, "access-control-request-method": "POST", "access-control-request-headers": "content-type",
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.equal(response.headers.get("access-control-allow-methods"), "POST");
    assert.equal(response.headers.get("access-control-allow-headers"), "Content-Type");
    assert.equal(response.headers.get("access-control-max-age"), "600");
    assert.equal(response.headers.get("vary"), "Origin");
    assert.equal(response.headers.has("access-control-allow-credentials"), false);
  }
  for (const origin of ["https://captionsgen.com.evil.example", "http://captionsgen.com", "https://evil.example", "null"]) {
    const response = await call("OPTIONS", "/api/subscribe", null, { origin, "access-control-request-method": "POST" });
    assert.equal(response.status, 403);
    assert.equal(response.headers.has("access-control-allow-origin"), false);
  }
  for (const headers of [
    { "access-control-request-method": "DELETE" },
    { "access-control-request-method": "POST", "access-control-request-headers": "content-type, authorization" },
  ]) {
    const response = await call("OPTIONS", "/api/subscribe", null, { origin: "https://captionsgen.com", ...headers });
    assert.equal(response.status, 403);
    assert.equal(response.headers.has("access-control-allow-origin"), false);
  }
});

test("website newsletter success and validation errors carry matching CORS, without widening other routes", async () => {
  const { call } = setup();
  for (const origin of ["https://captionsgen.com", "https://www.captionsgen.com"]) {
    for (const [body, status] of [[{ email: "website@example.com", consent: "website-2026-11" }, 200], [{ email: "bad" }, 400]]) {
      const response = await call("POST", "/api/subscribe", body, { origin, "content-type": "application/json" });
      assert.equal(response.status, status);
      assert.equal(response.headers.get("access-control-allow-origin"), origin);
      assert.equal(response.headers.get("vary"), "Origin");
      assert.equal(response.headers.has("access-control-allow-credentials"), false);
    }
  }
  for (const headers of [{}, { origin: "https://captionsgen.com.evil.example" }]) {
    const response = await call("POST", "/api/subscribe", { email: "panel@example.com", consent: "panel-2026-10" }, headers);
    assert.equal(response.status, 200);
    assert.equal(response.headers.has("access-control-allow-origin"), false);
  }
  const response = await call("DELETE", "/api/subscribe", { email: "missing@example.com", token: "wrong" }, { origin: "https://captionsgen.com" });
  assert.equal(response.status, 403);
  assert.equal(response.headers.has("access-control-allow-origin"), false);
  assert.equal((await call("OPTIONS", "/api/reports", null, { origin: "https://captionsgen.com" })).status, 404);
});

test("website newsletter internal errors remain readable through the approved CORS origin", async () => {
  const response = await worker.fetch(new Request("https://api.captionsgen.com/api/subscribe", {
    method: "POST", headers: { origin: "https://captionsgen.com", "content-type": "application/json" },
    body: JSON.stringify({ email: "website@example.com", consent: "website-2026-11" }),
  }), { ADMIN_TOKEN: "admin", REPORTS: { get() { throw new Error("test failure"); } } });
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://captionsgen.com");
  assert.equal((await response.json()).ok, false);
});

const installer = (count = 42) => ({ name: "CaptionsGen-Setup-1.1.9.exe", state: "uploaded", download_count: count });
const release = (assets = [installer()]) => ({ draft: false, prerelease: false, assets });
function downloadCall(fetchImpl, headers = admin, env = { ADMIN_TOKEN: "admin" }) {
  const request = new Request("https://api.captionsgen.com/api/downloads", { headers });
  return downloads(request, env, new URL(request.url), fetchImpl);
}

test("installer counts require the existing admin authorization before contacting GitHub", async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw new Error("must not be called"); };
  for (const headers of [{}, { authorization: "Bearer wrong" }])
    assert.equal((await downloadCall(fetchImpl, headers)).status, 401);
  assert.equal((await downloadCall(fetchImpl, admin, {})).status, 401);
  const { call } = setup();
  assert.equal((await call("GET", "/api/downloads")).status, 401);
  assert.equal(calls, 0);
});

test("installer counts include only published full Windows setup assets and keep credentials local", async () => {
  const result = await downloadCall(async (url, options) => {
    assert.equal(url, "https://api.github.com/repos/kriespy10/captions-gen-site/releases?per_page=100&page=1");
    assert.equal(options.headers.authorization, undefined);
    assert.equal(options.headers["user-agent"], "CaptionsGen-download-dashboard");
    assert.equal(options.cf.cacheTtl, 300);
    return Response.json([
      release([installer(42), { name: "CaptionsGen-Update-1.1.9.exe", state: "uploaded", download_count: 999 }, { name: "notes.txt", state: "uploaded", download_count: 100 }, { name: "CaptionsGen-Setup-1.1.8.exe", state: "starter", download_count: 30 }]),
      { ...release([installer(10)]), draft: true },
      { ...release([installer(20)]), prerelease: true },
    ]);
  });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(await result.json(), { ok: true, source: "GitHub release assets", total: 42, files: [{ name: "CaptionsGen-Setup-1.1.9.exe", version: "1.1.9", downloads: 42 }], releasesUrl: "https://github.com/kriespy10/captions-gen-site/releases" });
});

test("an actual zero download count is distinct from unavailable", async () => {
  const result = await downloadCall(async () => Response.json([release([installer(0)])]));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).total, 0);
});

test("installer counts paginate before reporting the total", async () => {
  let calls = 0;
  const result = await downloadCall(async (url) => {
    calls++;
    assert.match(url, new RegExp("page=" + calls + "$"));
    return Response.json([release([installer(calls)])], calls === 1 ? { headers: { link: '<https://api.github.com/repos/kriespy10/captions-gen-site/releases?per_page=100&page=2>; rel="next"' } } : undefined);
  });
  assert.equal((await result.json()).total, 3);
  assert.equal(calls, 2);
});

test("GitHub failures, missing installers and malformed counters never become a false zero", async () => {
  const responses = [
    () => new Response("rate limited", { status: 403 }),
    () => { throw new Error("network failure"); },
    () => Response.json([]),
    () => Response.json({ message: "bad shape" }),
    () => Response.json([release([{ name: "CaptionsGen-Setup-1.1.9.exe", state: "uploaded" }])]),
    () => Response.json([release([installer(-1)])]),
    () => Response.json([release([installer("42")])]),
    () => new Response("not JSON"),
  ];
  for (const response of responses) {
    const result = await downloadCall(async () => response());
    assert.equal(result.status, 503);
    const data = await result.json();
    assert.equal(data.ok, false);
    assert.equal(Object.hasOwn(data, "total"), false);
  }
});

test("usage: opted-in steps reach the funnel; DELETE removes the install", async () => {
  const { store, call } = setup();
  for (const event of ["consent", "panel_open", "transcribe", "captions_placed"])
    assert.equal((await call("POST", "/api/usage", { id: ID, event, v: "1.0.10", os: "Windows" })).status, 200);
  assert.equal((await call("POST", "/api/usage", { id: ID, event: "free_limit" })).status, 400);
  assert.equal((await call("POST", "/api/usage", { id: "nope", event: "consent" })).status, 400);
  await call("POST", "/api/ping", { event: "install" });
  assert.equal((await call("GET", "/api/funnel")).status, 401);
  const d = await (await call("GET", "/api/funnel", null, admin)).json();
  assert.equal(d.optedIn, 1);
  assert.equal(d.pings.install, 1);
  assert.equal(d.steps.find((s) => s.event === "captions_placed").installs, 1);
  await call("DELETE", `/api/usage/${ID}`);
  assert.ok(![...store.keys()].some((k) => k.startsWith("u:")));
});

test("subscribe: stores the consent record, no IP, and returns an unsubscribe token", async () => {
  const { store, call } = setup();
  const r = await (await call("POST", "/api/subscribe", { email: " Editor@Example.com ", source: "panel", v: "1.0.10", consent: "panel-2026-10" })).json();
  assert.equal(r.ok, true);
  assert.match(r.token, /^[0-9a-f]{32}$/);
  const rec = JSON.parse(store.get("sub:editor@example.com"));
  assert.deepEqual(Object.keys(rec).sort(), ["at", "consent", "email", "source", "v"]);
  assert.ok(![...store.values()].some((v) => String(v).includes("10.0.0.")));
  assert.ok(![...store.keys()].some((k) => k.includes("10.0.0.")));
});

test("subscribe: refuses bad addresses and sign-ups without consent wording", async () => {
  const { call } = setup();
  assert.equal((await call("POST", "/api/subscribe", { email: "nope", consent: "x" })).status, 400);
  assert.equal((await call("POST", "/api/subscribe", { email: "a@b.co" })).status, 400);
});

test("unsubscribe: wrong token fails, the panel's DELETE and the email link both remove", async () => {
  const { store, call } = setup();
  const { token } = await (await call("POST", "/api/subscribe", { email: "a@b.co", consent: "panel-2026-10" })).json();
  assert.equal((await call("DELETE", "/api/subscribe", { email: "a@b.co", token: "0".repeat(32) })).status, 403);
  assert.equal((await call("DELETE", "/api/subscribe", { email: "a@b.co", token })).status, 200);
  assert.equal(store.has("sub:a@b.co"), false);

  await call("POST", "/api/subscribe", { email: "a@b.co", consent: "panel-2026-10" });
  const link = `/api/unsubscribe?e=a%40b.co&t=${token}`;
  const get = await call("GET", link);
  assert.equal(get.status, 200);
  assert.match(await get.text(), /<form method="post">/);
  assert.equal(store.has("sub:a@b.co"), true, "opening the link alone must not unsubscribe");
  const form = new URLSearchParams({ e: "a@b.co", t: token }).toString();
  const post = await call("POST", "/api/unsubscribe", form, { "content-type": "application/x-www-form-urlencoded" });
  assert.match(await post.text(), /unsubscribed/);
  assert.equal(store.has("sub:a@b.co"), false);
  assert.equal((await call("GET", `/api/unsubscribe?e=a%40b.co&t=${"0".repeat(32)}`)).status, 400);
});

test("subscribers export needs the admin token and carries working unsubscribe links", async () => {
  const { call } = setup();
  await call("POST", "/api/subscribe", { email: "a@b.co", consent: "panel-2026-10" });
  assert.equal((await call("GET", "/api/subscribers")).status, 401);
  const { subscribers } = await (await call("GET", "/api/subscribers", null, admin)).json();
  assert.equal(subscribers.length, 1);
  const link = new URL(subscribers[0].unsubscribeUrl);
  assert.equal((await call("GET", link.pathname + link.search)).status, 200);
});

test("the funnel page script parses", async () => {
  const { call } = setup();
  const html = await (await call("GET", "/funnel")).text();
  const js = html.split("<script>")[1].split("</script>")[0];
  assert.doesNotThrow(() => new Function(js));
});

async function notification(report) {
  const calls = [];
  const ok = await notify({ RESEND_API_KEY: "test-key-not-a-real-credential" }, report, async (url, options) => {
    calls.push({ url, options, mail: JSON.parse(options.body) });
    return { ok: true };
  });
  assert.equal(ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(Object.hasOwn(calls[0].mail, "html"), false, "report metadata stays in the plain-text body");
  return calls[0].mail;
}

test("report notification identifies After Effects and preserves the bug report details", async () => {
  const mail = await notification({
    kind: "bug", message: "Caption layers are missing", email: "editor@example.com", log: "diagnostic log",
    app: { hostApp: "after-effects", afterEffects: "26.0.0", premiere: "25.6.0", panel: "1.1.9", engine: "1.1.9", os: "win32 10.0 x64", licensed: false },
  });
  assert.equal(mail.subject, "[Captions Gen bug] Caption layers are missing");
  assert.equal(mail.reply_to, "editor@example.com");
  assert.equal(mail.text, "Caption layers are missing\n\nFrom: editor@example.com\nCaptions Gen 1.1.9 / engine 1.1.9 / After Effects 26.0.0 / win32 10.0 x64 / free\n\n--- stored report log excerpt (up to 20,000 characters) ---\ndiagnostic log");
  assert.doesNotMatch(mail.text, /Premiere/);
});

test("report notification preserves Premiere metadata with explicit and legacy host shapes", async () => {
  for (const host of [{ hostApp: "premiere" }, {}]) {
    const mail = await notification({
      kind: "feature", message: "Please add another caption style",
      app: { ...host, premiere: "25.6.0", panel: "1.1.2", engine: "1.1.2", os: "win32 10.0 x64", licensed: true },
    });
    assert.equal(mail.text, "Please add another caption style\n\nFrom: (no email given)\nCaptions Gen 1.1.2 / engine 1.1.2 / Premiere 25.6.0 / win32 10.0 x64 / licensed");
    assert.equal(Object.hasOwn(mail, "reply_to"), false);
  }
});

test("After Effects notification does not substitute a Premiere version when its own version is missing", async () => {
  const mail = await notification({
    kind: "feature", message: "Please add a style option",
    app: { hostApp: "after-effects", premiere: "25.6.0" },
  });
  assert.equal(mail.text.split("\n").at(-1), "Captions Gen ? / engine ? / After Effects ? / ? / free");
});

test("report notification bounds untrusted metadata and keeps it to one plain-text line", async () => {
  const mail = await notification({
    kind: "feature", message: "Please add a style option",
    app: { hostApp: "after-effects", panel: { value: "wrong type" }, engine: Infinity, afterEffects: "x".repeat(500), os: "win32\r\n\tInjected\u0000value\u2028x64" },
  });
  const lines = mail.text.split("\n");
  assert.equal(lines.length, 4, "metadata cannot add new message lines");
  assert.equal(lines[3], `Captions Gen ? / engine ? / After Effects ${"x".repeat(120)} / win32 Injected value x64 / free`);
  assert.doesNotMatch(lines[3], /[\u0000-\u001f\u007f-\u009f\u2028]/);
});

const LOG_HEADING = "--- stored report log excerpt (up to 20,000 characters) ---\n";
function retainedDiagnosticFixture() {
  const diagnostics = ["beginning", "middle", "end"].map((phase, index) => ({
    kind: "synthetic-model-diagnostic", phase, model: "fixture-model", details: String(index).repeat(6100),
  }));
  const lines = diagnostics.map(value => "CAPTIONS_DIAG " + JSON.stringify(value));
  assert.ok(lines.every(line => line.length > 6000), "every JSON diagnostic itself exceeds the old email limit");
  const filler = ".".repeat(20000 - lines.reduce((n, line) => n + line.length, 0) - 3);
  const log = [lines[0], lines[1], filler, lines[2]].join("\n");
  assert.equal(log.length, 20000);
  return { log, diagnostics };
}
function emailedExcerpt(mail) {
  const offset = mail.text.indexOf(LOG_HEADING);
  assert.ok(offset >= 0, "email identifies this as the bounded stored report excerpt");
  return mail.text.slice(offset + LOG_HEADING.length);
}
function diagnosticObjects(log) {
  return log.split("\n").filter(line => line.startsWith("CAPTIONS_DIAG ")).map(line => JSON.parse(line.slice("CAPTIONS_DIAG ".length)));
}

test("notify emails the entire retained 20,000-character excerpt with every long JSON diagnostic intact", async () => {
  const fixture = retainedDiagnosticFixture();
  const mail = await notification({ kind: "bug", message: "Synthetic report used only by the test", log: fixture.log });
  const excerpt = emailedExcerpt(mail);
  assert.equal(excerpt.length, 20000);
  assert.equal(excerpt, fixture.log, "beginning, middle and end must all survive email formatting");
  assert.deepEqual(diagnosticObjects(excerpt), fixture.diagnostics);
});

test("report submission emails exactly its bounded stored excerpt through an injected Resend transport", async t => {
  const fixture = retainedDiagnosticFixture();
  const mails = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.method, "POST");
    mails.push(JSON.parse(options.body));
    return new Response("{}", { status: 200 });
  });
  const { store, call } = setup({
    RESEND_API_KEY: "synthetic-resend-key-not-a-credential",
    MAIL_FROM: "test-reports@example.invalid", MAIL_TO: "test-recipient@example.invalid",
  });
  const response = await call("POST", "/api/report", {
    kind: "bug", message: "Synthetic report: keep all model diagnostics",
    log: "discarded prefix\n".repeat(100) + fixture.log,
    app: { hostApp: "after-effects", afterEffects: "26.0.0", engine: "1.1.10", panel: "1.1.10" },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  const reports = [...store.entries()].filter(([key]) => key.startsWith("report:"));
  assert.equal(reports.length, 1);
  const stored = JSON.parse(reports[0][1]);
  assert.equal(stored.log.length, 20000, "the existing storage bound remains enforced");
  assert.equal(stored.log, fixture.log, "only the earlier input prefix is discarded");
  assert.equal(mails.length, 1);
  assert.deepEqual(mails[0].to, ["test-recipient@example.invalid"]);
  assert.equal(emailedExcerpt(mails[0]), stored.log, "email and retained report must have identical log contents");
  assert.deepEqual(diagnosticObjects(emailedExcerpt(mails[0])), fixture.diagnostics);
});
