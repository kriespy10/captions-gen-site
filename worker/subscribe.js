// Email updates sign-ups from the Captions Gen panel (src/newsletter.mjs in the plugin).
//   POST   /api/subscribe     {email, source, v, consent}  -> {ok, token}
//   DELETE /api/subscribe     {email, token}               the panel's Settings > Unsubscribe
//   GET    /api/unsubscribe?e=&t=                          page with an Unsubscribe button (link for emails)
//   POST   /api/unsubscribe   form e, t                    removes the address
//   GET    /api/subscribers   export with unsubscribe links (Bearer ADMIN_TOKEN)
// Stored per address until the person unsubscribes: the address, when and where it
// signed up, the plugin version and which sign-up wording it agreed to (`consent`).
// No IP address is stored; a hash of it blocks rapid repeats for a minute.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const short = (s, n) => String(s || "").replace(/[^\w .()-]/g, "").slice(0, n);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const page = (title, body, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>` +
      `<style>:root{color-scheme:dark}body{margin:0;background:#070708;color:#f4f4f5;font:16px/1.6 -apple-system,"Segoe UI",system-ui,sans-serif}main{max-width:520px;margin:12vh auto;padding:0 16px}p{color:#b5b5ba}button{font:inherit;padding:10px 16px;border:0;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer}a{color:#69b5ff}</style>` +
      `<main><h1>${title}</h1>${body}</main></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const hex = (buf, bytes) => [...new Uint8Array(buf)].slice(0, bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

// Unsubscribe token: HMAC of the address, so links work without storing a token.
export async function tokenFor(env, email) {
  const secret = env.SUBSCRIBE_SECRET || env.ADMIN_TOKEN;
  if (!secret) return null;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("unsub:" + email)), 16);
}

async function body(request) {
  const text = await request.text();
  if (text.length > 2000) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export async function subscribe(request, env, url) {
  if (url.pathname === "/api/subscribe" && request.method === "POST") return add(request, env);
  if (url.pathname === "/api/subscribe" && request.method === "DELETE") {
    const r = await body(request);
    const email = String((r && r.email) || "").trim().toLowerCase();
    if (!email || !r.token || r.token !== (await tokenFor(env, email))) return json({ ok: false, error: "invalid" }, 403);
    await env.REPORTS.delete(`sub:${email}`);
    return json({ ok: true });
  }
  if (url.pathname === "/api/unsubscribe") return unsubscribePage(request, env, url);
  if (url.pathname === "/api/subscribers" && request.method === "GET") return list(request, env, url);
  return null;
}

async function add(request, env) {
  const r = await body(request);
  const email = String((r && r.email) || "").trim().toLowerCase().slice(0, 120);
  if (!EMAIL_RE.test(email) || !r.consent) return json({ ok: false, error: "invalid" }, 400);
  const token = await tokenFor(env, email);
  if (!token) return json({ ok: false, error: "not configured" }, 500);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const rl = `rate:sub:${hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)), 8)}`;
  if (await env.REPORTS.get(rl)) return json({ ok: false, error: "slow down" }, 429);
  await env.REPORTS.put(rl, "1", { expirationTtl: 60 });
  const old = JSON.parse((await env.REPORTS.get(`sub:${email}`)) || "null");
  const rec = {
    email,
    at: (old && old.at) || new Date().toISOString(),
    source: short(r.source, 16) || "panel",
    v: short(r.v, 16),
    consent: short(r.consent, 40),
  };
  await env.REPORTS.put(`sub:${email}`, JSON.stringify(rec));
  return json({ ok: true, token });
}

async function unsubscribePage(request, env, url) {
  let email = "", token = "";
  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    email = String((form && form.get("e")) || "");
    token = String((form && form.get("t")) || "");
  } else {
    email = url.searchParams.get("e") || "";
    token = url.searchParams.get("t") || "";
  }
  email = email.trim().toLowerCase();
  const valid = email && token && token === (await tokenFor(env, email));
  const help = `<p>If you keep getting emails, write to <a href="mailto:business@captionsgen.com">business@captionsgen.com</a> and we'll remove you.</p>`;
  if (!valid) return page("This link doesn't work", help, 400);
  // GET only shows a button: mail scanners open links, and that must not unsubscribe anyone.
  if (request.method !== "POST")
    return page(
      "Unsubscribe from Captions Gen emails",
      `<p>${esc(email)} will stop getting emails about Captions Gen updates, new features and new styles.</p>` +
        `<form method="post"><input type="hidden" name="e" value="${esc(email)}"><input type="hidden" name="t" value="${esc(token)}"><button>Unsubscribe</button></form>`,
    );
  await env.REPORTS.delete(`sub:${email}`);
  return page("You're unsubscribed", `<p>${esc(email)} won't get Captions Gen emails anymore. The plugin keeps working as before.</p>`);
}

async function list(request, env, url) {
  const auth = request.headers.get("authorization") || "";
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ ok: false, error: "unauthorized" }, 401);
  const subscribers = [];
  let cursor;
  do {
    const p = await env.REPORTS.list({ prefix: "sub:", cursor });
    for (const k of p.keys) {
      const s = JSON.parse((await env.REPORTS.get(k.name)) || "null");
      if (!s) continue;
      const t = await tokenFor(env, s.email);
      subscribers.push({ ...s, unsubscribeUrl: `${url.origin}/api/unsubscribe?e=${encodeURIComponent(s.email)}&t=${t}` });
    }
    cursor = p.list_complete ? null : p.cursor;
  } while (cursor);
  subscribers.sort((a, b) => (a.at < b.at ? 1 : -1));
  return json({ ok: true, subscribers });
}
