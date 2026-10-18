// Backend for in-app bug reports and feature requests.
//   POST /api/report   from the Captions Gen engine (no auth, rate limited)
//   GET  /api/reports  list stored reports, newest first (Bearer ADMIN_TOKEN)
// Reports live in the REPORTS KV namespace; set ADMIN_TOKEN as a secret.
// Optional: NOTIFY_WEBHOOK (a Discord/Slack-style webhook URL secret) pings you per report.
const MAX_BODY = 40000;
const KINDS = ["bug", "feature"];
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/report" && request.method === "POST") return submit(request, env);
    if (url.pathname === "/api/reports" && request.method === "GET") return list(request, env);
    return json({ ok: false, error: "not found" }, 404);
  },
};

async function submit(request, env) {
  const text = await request.text();
  if (text.length > MAX_BODY) return json({ ok: false, error: "too large" }, 413);
  let r;
  try { r = JSON.parse(text); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const message = String(r.message || "").trim();
  if (!KINDS.includes(r.kind) || message.length < 10) return json({ ok: false, error: "invalid report" }, 400);

  // One report per IP per minute, max 20 a day: enough to stop a loop, not a person.
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const dayKey = `rate:${day}:${ip}`;
  const used = Number((await env.REPORTS.get(dayKey)) || 0);
  if (used >= 20 || (await env.REPORTS.get(`rate:burst:${ip}`))) return json({ ok: false, error: "slow down" }, 429);
  await env.REPORTS.put(dayKey, String(used + 1), { expirationTtl: 90000 });
  await env.REPORTS.put(`rate:burst:${ip}`, "1", { expirationTtl: 60 });

  const clean = {
    kind: r.kind,
    message: message.slice(0, 4000),
    email: String(r.email || "").slice(0, 120),
    app: r.app && typeof r.app === "object" ? r.app : {},
    log: r.kind === "bug" ? String(r.log || "").slice(-20000) : undefined,
    sentAt: new Date().toISOString(),
  };
  const id = `report:${clean.sentAt}:${crypto.randomUUID().slice(0, 8)}`;
  await env.REPORTS.put(id, JSON.stringify(clean));

  if (env.NOTIFY_WEBHOOK) {
    const line = `${clean.kind === "bug" ? "Bug" : "Feature"} report (${clean.app.panel || "?"}): ${clean.message.slice(0, 300)}`;
    try {
      await fetch(env.NOTIFY_WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: line, text: line }),
      });
    } catch {}
  }
  return json({ ok: true });
}

async function list(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ ok: false, error: "unauthorized" }, 401);
  const keys = (await env.REPORTS.list({ prefix: "report:", limit: 100 })).keys.map((k) => k.name).sort().reverse();
  const reports = [];
  for (const name of keys) reports.push({ id: name, ...JSON.parse((await env.REPORTS.get(name)) || "{}") });
  return json({ ok: true, reports });
}
