// Worker routes against an in-memory KV: node --test worker/worker.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "./report-worker.js";

function setup() {
  const store = new Map();
  const kv = {
    get: async (k) => store.get(k) ?? null,
    put: async (k, v) => void store.set(k, v),
    delete: async (k) => void store.delete(k),
    list: async ({ prefix }) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }),
  };
  const env = { REPORTS: kv, ADMIN_TOKEN: "admin" };
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
