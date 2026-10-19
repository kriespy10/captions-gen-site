// Opt-in usage stats for the Captions Gen panel, plus anonymous install counts.
//   POST   /api/usage       {id, event, v, os, licensed}  only after the user said yes in the panel
//   DELETE /api/usage/<id>  sent when the user turns stats off; removes everything for that id
//   POST   /api/ping        {event}  no id: bumps a daily counter (first engine boot, engine start once a day)
//   GET    /api/funnel      totals for the funnel page (Bearer ADMIN_TOKEN)
//   GET    /funnel          the funnel page itself (asks for the admin token, keeps it in the browser)
// No IP address, file name, transcript or project data is stored. Every key expires after ~13 months.
const TTL = 400 * 86400;
// Funnel order: each install is counted once per step it ever reached.
export const EVENTS = ["consent", "panel_open", "transcribe", "captions_placed", "free_limit", "buy_click", "licensed"];
export const PINGS = ["install", "engine_start"];
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const short = (s, n = 24) => String(s || "").replace(/[^\w .()-]/g, "").slice(0, n);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });

export async function usage(request, env, url) {
  const del = url.pathname.match(/^\/api\/usage\/([0-9a-f-]{36})$/);
  if (del && request.method === "DELETE") {
    await env.REPORTS.delete(`u:${del[1]}`);
    return json({ ok: true });
  }
  if (url.pathname === "/api/usage" && request.method === "POST") return record(request, env);
  if (url.pathname === "/api/ping" && request.method === "POST") return ping(request, env);
  if (url.pathname === "/api/funnel" && request.method === "GET") return funnel(request, env);
  if (url.pathname === "/funnel" && request.method === "GET")
    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
  return null;
}

async function body(request) {
  const text = await request.text();
  if (text.length > 2000) return null;
  try { return JSON.parse(text); } catch { return null; }
}

async function record(request, env) {
  const r = await body(request);
  if (!r || !ID.test(r.id) || !EVENTS.includes(r.event)) return json({ ok: false, error: "invalid" }, 400);
  const key = `u:${r.id}`;
  const now = new Date().toISOString();
  const u = JSON.parse((await env.REPORTS.get(key)) || "null") || { firstSeen: now, first: {}, days: {} };
  // The panel sends each event at most once a day, so `days` reads as "days it happened".
  u.first[r.event] ||= now;
  u.days[r.event] = (u.days[r.event] || 0) + 1;
  u.lastSeen = now;
  u.v = short(r.v, 16);
  u.os = short(r.os, 16);
  u.licensed = !!r.licensed || !!u.first.licensed;
  await env.REPORTS.put(key, JSON.stringify(u), { expirationTtl: TTL });
  return json({ ok: true });
}

async function ping(request, env) {
  const r = await body(request);
  if (!r || !PINGS.includes(r.event)) return json({ ok: false, error: "invalid" }, 400);
  const key = `c:${new Date().toISOString().slice(0, 10)}:${r.event}`;
  const n = Number((await env.REPORTS.get(key)) || 0);
  await env.REPORTS.put(key, String(n + 1), { expirationTtl: TTL });
  return json({ ok: true });
}

async function listAll(env, prefix) {
  const names = [];
  let cursor;
  do {
    const page = await env.REPORTS.list({ prefix, cursor });
    names.push(...page.keys.map((k) => k.name));
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return names;
}

export async function summarize(env, today = new Date()) {
  const daily = {};
  for (const name of await listAll(env, "c:")) {
    const [, day, event] = name.split(":");
    (daily[day] ||= {})[event] = Number((await env.REPORTS.get(name)) || 0);
  }
  const users = [];
  for (const name of await listAll(env, "u:")) {
    const u = JSON.parse((await env.REPORTS.get(name)) || "null");
    if (u) users.push(u);
  }
  const since = (days) => new Date(today.getTime() - days * 86400000).toISOString();
  const steps = EVENTS.map((event) => ({ event, installs: users.filter((u) => u.first[event]).length }));
  const tally = (f) => users.reduce((m, u) => ((m[f(u)] = (m[f(u)] || 0) + 1), m), {});
  const totals = (event) => Object.values(daily).reduce((n, d) => n + (d[event] || 0), 0);
  return {
    pings: { install: totals("install"), engine_start: totals("engine_start"), daily },
    optedIn: users.length,
    steps,
    returning: users.filter((u) => (u.days.panel_open || 0) >= 2).length,
    active7: users.filter((u) => u.lastSeen >= since(7)).length,
    active30: users.filter((u) => u.lastSeen >= since(30)).length,
    versions: tally((u) => u.v || "?"),
    os: tally((u) => u.os || "?"),
    // Opted-in installs that used it but never bought: most useful row for "why no sale".
    usedNotBought: users.filter((u) => u.first.captions_placed && !u.licensed).length,
  };
}

async function funnel(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ ok: false, error: "unauthorized" }, 401);
  return json({ ok: true, ...(await summarize(env)) });
}

const PAGE = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Captions Gen funnel</title>
<style>
:root{color-scheme:dark}body{margin:0;background:#070708;color:#f4f4f5;font:15px/1.5 -apple-system,"Segoe UI",system-ui,sans-serif}
main{max-width:680px;margin:auto;padding:24px 16px}h1{font-size:24px;margin:0 0 4px}p{color:#a1a1aa;margin:4px 0 16px}
.row{display:grid;grid-template-columns:150px 1fr 48px;gap:10px;align-items:center;margin:6px 0}
.bar{height:22px;background:#3b82f6;border-radius:4px;min-width:2px}.n{text-align:right;font-variant-numeric:tabular-nums}
h2{font-size:16px;margin:28px 0 8px}.lbl{color:#d4d4d8}input,button{font:inherit;padding:8px 10px;border-radius:6px;border:1px solid #3f3f46;background:#18181b;color:inherit}
button{background:#3b82f6;border:0;cursor:pointer}#err{color:#f87171}small{color:#71717a}
</style><main><h1>Captions Gen funnel</h1><p>Opt-in installs only, plus anonymous daily counts.</p>
<form id="f" hidden><input id="t" type="password" placeholder="Admin token" size="30"> <button>Show</button></form>
<div id="err"></div><div id="out"></div></main>
<script>
const L={consent:"Said yes to stats",panel_open:"Opened the panel",transcribe:"Transcribed",captions_placed:"Placed captions",free_limit:"Hit the free limit",buy_click:"Clicked Buy",licensed:"Licensed"};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function bars(rows,max){return rows.map(([k,n])=>'<div class="row"><span class="lbl">'+esc(k)+'</span><div class="bar" style="width:'+(max?100*n/max:0)+'%"></div><span class="n">'+n+'</span></div>').join("")}
async function load(tok){
  const r=await fetch("/api/funnel",{headers:{authorization:"Bearer "+tok}});
  if(!r.ok){document.getElementById("err").textContent="Wrong token.";try{localStorage.removeItem("tok")}catch{};f.hidden=false;return}
  try{localStorage.setItem("tok",tok)}catch{}
  f.hidden=true;const d=await r.json();
  const p=d.pings;let h="<h2>Everyone who didn't say no (no ID)</h2>"+bars([["New installs",p.install],["Engine running (install-days)",p.engine_start]],Math.max(p.install,p.engine_start,1));
  h+="<h2>Opted-in installs ("+d.optedIn+")</h2>"+bars(d.steps.map(s=>[L[s.event]||s.event,s.installs]),d.optedIn);
  h+="<h2>Engagement</h2>"+bars([["Used on 2+ days",d.returning],["Active last 7 days",d.active7],["Active last 30 days",d.active30],["Placed captions, not bought",d.usedNotBought]],d.optedIn||1);
  h+="<h2>Versions</h2>"+bars(Object.entries(d.versions),d.optedIn||1)+"<h2>OS</h2>"+bars(Object.entries(d.os),d.optedIn||1);
  const days=Object.keys(p.daily).sort().reverse().slice(0,14);
  h+="<h2>Last 14 days</h2>"+days.map(k=>'<div><small>'+k+'</small> new installs '+(p.daily[k].install||0)+', engines running '+(p.daily[k].engine_start||0)+'</div>').join("");
  document.getElementById("out").innerHTML=h;
}
const f=document.getElementById("f");f.onsubmit=e=>{e.preventDefault();load(document.getElementById("t").value.trim())};
let saved=null;try{saved=localStorage.getItem("tok")}catch{}
saved?load(saved):(f.hidden=false);
</script></html>`;
