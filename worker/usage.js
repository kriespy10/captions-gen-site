// Opt-in usage stats for the Captions Gen panel, plus anonymous install counts.
//   POST   /api/usage       {id, event, v, os, licensed}  only after the user said yes in the panel
//   DELETE /api/usage/<id>  sent when the user turns stats off; removes everything for that id
//   POST   /api/ping        {event}  no id: bumps a daily counter (first engine boot, engine start once a day)
//   GET    /api/funnel      totals for the funnel page (Bearer ADMIN_TOKEN)
//   GET    /funnel          the funnel page itself (asks for the admin token, keeps it in the browser),
//                           plus the email sign-up count and a CSV export (subscribe.js)
// No IP address, file name, transcript or project data is stored. Every key expires after ~13 months.
import { audienceSummary, growthSeries, growthMarkup, measurementSeries, measurementCards, GROWTH_STYLES } from "./growth-chart.mjs";
import { acquisitionSeries, acquisitionCard } from "./acquisitions.mjs";
import { usageRevoked, revokedUsageIds, beginUsageWrite, endUsageWrite } from "./measurements.mjs";

const TTL = 400 * 86400;
const ACTIVITY_EVENTS = ["panel_open", "transcribe", "captions_placed"];
const ACTIVITY_SINCE_KEY = "meta:activity-history-since";
// Funnel order: each install is counted once per step it ever reached.
export const EVENTS = ["consent", "panel_open", "transcribe", "captions_placed", "buy_click", "licensed"];
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
    try {
      await env.REPORTS.delete(`u:${del[1]}`);
      return json({ ok: true });
    } catch { return json({ ok:false,error:"Could not remove usage history. Retry deletion." },503); }
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
  if (!r || typeof r.id !== "string" || !ID.test(r.id) || !EVENTS.includes(r.event)) return json({ ok: false, error: "invalid" }, 400);
  let writeLease;
  try {
  const key = `u:${r.id}`;
  writeLease=await beginUsageWrite(env,r.id);
  if (writeLease.revoked) {
    await env.REPORTS.delete(key);
    return json({ ok:false,error:"usage consent was revoked" },403);
  }
  const now = new Date().toISOString();
  const u = JSON.parse((await env.REPORTS.get(key)) || "null") || { firstSeen: now, first: {}, days: {} };
  // The panel sends each event at most once a day, so `days` reads as "days it happened".
  u.first[r.event] ||= now;
  u.days[r.event] = (u.days[r.event] || 0) + 1;
  u.lastSeen = now;
  if (ACTIVITY_EVENTS.includes(r.event)) {
    if (!(await env.REPORTS.get(ACTIVITY_SINCE_KEY))) {
      await env.REPORTS.put(ACTIVITY_SINCE_KEY, now);
    }
    const earliest = new Date(Date.parse(now) - 399 * 86400000).toISOString().slice(0, 10);
    const today = now.slice(0, 10);
    u.activityDays ||= {};
    // First-event dates are known positive observations, not a full backfill.
    for (const event of ACTIVITY_EVENTS) {
      const timestamp = Date.parse(u.first[event]);
      if (Number.isFinite(timestamp)) u.activityDays[new Date(timestamp).toISOString().slice(0, 10)] = true;
    }
    u.activityDays[today] = true;
    for (const day of Object.keys(u.activityDays)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < earliest || day > today) delete u.activityDays[day];
    }
  }
  u.v = short(r.v, 16);
  u.os = short(r.os, 16);
  u.licensed = !!r.licensed || !!u.first.licensed;
  await env.REPORTS.put(key, JSON.stringify(u), { expirationTtl: TTL });
  // A DELETE can commit while this request is waiting for KV. Re-check D1's
  // primary after the put and remove any late KV write before acknowledging it.
  if (await usageRevoked(env,r.id)) {
    await env.REPORTS.delete(key);
    return json({ ok:false,error:"usage consent was revoked" },403);
  }
  return json({ ok: true });
  } catch { return json({ ok:false,error:"usage storage unavailable" },503); }
  finally {
    // A crashed writer's coordination record expires after fifteen minutes;
    // an active writer releases it only after its final revocation/cleanup check.
    try { await endUsageWrite(env,writeLease); } catch { /* Deletion remains retryable until the lease expires. */ }
  }
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
  const names = await listAll(env,"u:");
  const revoked = await revokedUsageIds(env,names.map(name => name.slice(2)),today);
  for (const name of names) {
    if (revoked.has(name.slice(2))) continue;
    const u = JSON.parse((await env.REPORTS.get(name)) || "null");
    if (u) users.push(u);
  }
  const since = (days) => new Date(today.getTime() - days * 86400000).toISOString();
  const steps = EVENTS.map((event) => ({ event, installs: users.filter((u) => u.first[event]).length }));
  const tally = (f) => users.reduce((m, u) => ((m[f(u)] = (m[f(u)] || 0) + 1), m), {});
  const totals = (event) => Object.values(daily).reduce((n, d) => n + (d[event] || 0), 0);
  return {
    audience: audienceSummary(users, today, await env.REPORTS.get(ACTIVITY_SINCE_KEY), daily),
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
main{max-width:760px;margin:auto;padding:24px 16px}h1{font-size:24px;margin:0 0 4px}p{color:#a1a1aa;margin:4px 0 16px}
.row{display:grid;grid-template-columns:150px 1fr 48px;gap:10px;align-items:center;margin:6px 0}
.bar{height:22px;background:#3b82f6;border-radius:4px;min-width:2px}.n{text-align:right;font-variant-numeric:tabular-nums}
h2{font-size:16px;margin:28px 0 8px}.lbl{color:#d4d4d8}input,button{font:inherit;padding:8px 10px;border-radius:6px;border:1px solid #3f3f46;background:#18181b;color:inherit}
button{background:#3b82f6;border:0;cursor:pointer}#err{color:#f87171}small{color:#71717a}
${GROWTH_STYLES}
</style><main><h1>Captions Gen audience</h1><p>Acquisition estimates, install registrations and opt-in activity.</p>
<form id="f" hidden><input id="t" type="password" placeholder="Admin token" size="30"> <button>Show</button></form>
<div id="err"></div>
<section id="growth" class="growth-card" aria-labelledby="growth-title" hidden>
  <div class="growth-top"><div><p class="growth-eyebrow">CAPTIONS GEN / GROWTH</p><h2 id="growth-title">Downloads, installs and active use.</h2></div><span class="growth-live"><i aria-hidden="true"></i>Updated on refresh</span></div>
  <div class="growth-controls"><label><span class="growth-sr">Metric</span><select id="growth-metric"><option value="acquisitions" selected>Acquisition estimate</option><option value="uniqueInstalls">Install registrations</option><option value="sessionCount">Sessions (opt-in)</option><option value="downloadRequests">Download requests</option></select></label><label class="growth-period"><span class="growth-sr">Period</span><select id="growth-period"><option id="growth-period-7" value="7">Last 7 completed UTC days</option><option id="growth-period-30" value="30">Last 30 completed UTC days</option><option id="growth-history-option" value="history" selected>All history · by month</option></select></label></div>
  <div id="growth-body"></div>
  <p class="growth-coverage">Acquisition estimates use historical Lemon Squeezy orders before 10 November 2026 and daily browser download estimates from 10 November. The source changes at that boundary; these are different signals, not verified unique people or installations. New installations are counted once while saved app data remains. Sessions and active users are opt-in stats. Dates UTC.</p>
</section>
<div id="measurement-cards" class="measurement-cards" aria-live="polite"></div>
<p id="measurement-method" class="measurement-method" hidden>Acquisition totals sum daily estimates. Calendar-month distinct browsers in Downloads and monthly active users are counted separately, not summed from daily unique counts. Today and current-month card totals are partial. Acquisition signals, download requests, install registrations and active users measure different things.</p>
<details id="order-archive" class="legacy-measurements" hidden><summary>Historical Lemon Squeezy orders</summary><section class="growth-card" aria-labelledby="order-archive-title"><div class="growth-top"><div><p class="growth-eyebrow">HISTORICAL SNAPSHOT</p><h2 id="order-archive-title">Lemon Squeezy order archive</h2></div></div><div class="growth-controls"><label><span class="growth-sr">Order archive period</span><select id="order-archive-period"><option value="7">Last 7 completed UTC days</option><option value="30">Last 30 completed UTC days</option><option value="history" selected>Imported monthly history</option></select></label></div><div id="order-archive-body"></div></section></details>
<details id="legacy-measurements" class="legacy-measurements" hidden><summary>Legacy measurements</summary>
<section class="growth-card" aria-labelledby="legacy-title"><div class="growth-top"><div><p class="growth-eyebrow">HISTORICAL SIGNALS</p><h2 id="legacy-title">Legacy first-start signals</h2></div></div><div class="growth-controls"><label class="growth-period"><span class="growth-sr">Legacy period</span><select id="legacy-period"><option value="7">Last 7 days</option><option value="30" selected>Last 30 days</option></select></label></div><div id="legacy-growth-body"></div></section>
<div id="active-users" class="growth-active" hidden></div><section id="downloads" aria-live="polite"></section><div id="out"></div></details>
<div id="subs"></div></main>
<script>
// Wrangler preserves function names with this helper inside serialized functions.
// The browser only needs the function value, not the Worker debugging metadata.
function __name(target){return target;}
${growthSeries.toString()}
${growthMarkup.toString()}
${measurementSeries.toString()}
${measurementCards.toString()}
${acquisitionSeries.toString()}
${acquisitionCard.toString()}
let audience=null;
let measurements=null;
function renderGrowth(){
  if(!measurements)return;
  const metric=document.getElementById("growth-metric").value;
  const select=document.getElementById("growth-period");
  const history=document.getElementById("growth-history-option");
  history.hidden=metric!=="acquisitions";history.disabled=history.hidden;
  document.getElementById("growth-period-7").textContent=history.hidden?"Last 7 days":"Last 7 completed UTC days";
  document.getElementById("growth-period-30").textContent=history.hidden?"Last 30 days":"Last 30 completed UTC days";
  if(history.hidden&&select.value==="history")select.value="30";
  const period=select.value==="history"?"history":Number(select.value);
  document.getElementById("measurement-cards").innerHTML=(measurements.measurementsUnavailable?'<p class="measurement-error">Live measurements are temporarily unavailable. Historical estimates remain separate.</p>':'')+acquisitionCard(acquisitionSeries(measurements,"history"))+measurementCards(measurements,period,{includeOrders:false});
  document.getElementById("growth-body").innerHTML=growthMarkup(metric==="acquisitions"?acquisitionSeries(measurements,period):measurementSeries(measurements,metric,period));
}
function renderOrderArchive(){
  if(!measurements)return;
  const value=document.getElementById("order-archive-period").value;
  const model=measurementSeries(measurements,"lemonOrders",value==="history"?"history":Number(value));
  model.chartId="order-archive-chart";
  document.getElementById("order-archive-body").innerHTML=growthMarkup(model);
}
function renderLegacyGrowth(){
  if(!audience)return;
  const model=growthSeries(audience,"installs",Number(document.getElementById("legacy-period").value));
  model.name="legacy first-start signals";model.unit="Signals";model.measureLabel="Historical anonymous engine signals";
  model.title="Legacy first-start signals by day";model.chartId="legacy-chart";
  model.coverageMessage="Historical first-start signals can repeat after app data is reset or acknowledgements fail. These are not unique install registrations.";
  document.getElementById("legacy-growth-body").innerHTML=growthMarkup(model);
}
const L={consent:"Said yes to stats",panel_open:"Opened the panel",transcribe:"Transcribed",captions_placed:"Placed captions",buy_click:"Clicked Buy",licensed:"Licensed"};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function bars(rows,max){return rows.map(([k,n])=>'<div class="row"><span class="lbl">'+esc(k)+'</span><div class="bar" style="width:'+(max?100*n/max:0)+'%"></div><span class="n">'+n+'</span></div>').join("")}
async function load(tok){
  const r=await fetch("/api/funnel",{headers:{authorization:"Bearer "+tok}});
  if(!r.ok){document.getElementById("err").textContent="Wrong token.";try{localStorage.removeItem("tok")}catch{};f.hidden=false;return}
  try{localStorage.setItem("tok",tok)}catch{}
  f.hidden=true;const d=await r.json();
  audience=d.audience;
  document.getElementById("legacy-measurements").hidden=false;
  renderLegacyGrowth();
  document.getElementById("legacy-period").onchange=renderLegacyGrowth;
  const activeBox=document.getElementById("active-users");
  activeBox.hidden=false;
  function comparison(current,previous,period){
    if(previous===null)return "Building activity history";
    if(previous===0)return current>0?"First recorded activity":"No change "+period;
    const percent=Math.round((current-previous)/previous*100);
    return (percent>0?"+":"")+percent+"% "+period;
  }
  activeBox.innerHTML='<section class="growth-stat"><h3>Legacy active-today estimate</h3><strong>'+audience.activeToday.toLocaleString("en-US")+'</strong><p>'+(audience.activeTodayEstimated?'Estimated from last activity. ':'')+'Today is partial · UTC</p><p class="growth-stat-change">'+esc(comparison(audience.activeToday,audience.activeYesterday,"vs. yesterday"))+'</p></section>'+
    '<section class="growth-stat"><h3>Legacy monthly estimate</h3><strong>'+audience.active30.toLocaleString("en-US")+'</strong><p>Last 30 days'+(audience.active30Complete?'':' · estimated from last activity')+'</p><p class="growth-stat-change">'+esc(comparison(audience.active30,audience.previousActive30,"vs. previous 30 days"))+'</p></section>';
  const p=d.pings;let h="<details><summary>Detailed plugin stats</summary><h2>Anonymous boot signals</h2><p>These signals are not unique users and can repeat after app data is reset.</p>"+bars([["First engine boots",p.install],["Engine running (install-days)",p.engine_start]],Math.max(p.install,p.engine_start,1));
  h+="<h2>Opted-in installs ("+d.optedIn+")</h2>"+bars(d.steps.map(s=>[L[s.event]||s.event,s.installs]),d.optedIn);
  h+="<h2>Engagement</h2>"+bars([["Used on 2+ days",d.returning],["Active last 7 days",d.active7],["Active last 30 days",d.active30],["Placed captions, not bought",d.usedNotBought]],d.optedIn||1);
  h+="<h2>Versions</h2>"+bars(Object.entries(d.versions),d.optedIn||1)+"<h2>OS</h2>"+bars(Object.entries(d.os),d.optedIn||1);
  const days=Object.keys(p.daily).sort().reverse().slice(0,14);
  h+="<h2>Last 14 days</h2>"+days.map(k=>'<div><small>'+k+'</small> first engine boots '+(p.daily[k].install||0)+', engines running '+(p.daily[k].engine_start||0)+'</div>').join("");
  h+="</details>";
  document.getElementById("out").innerHTML=h;
  loadMeasurements(tok);
  loadDownloads(tok);
  loadSubs(tok);
}
async function loadMeasurements(tok){
  const box=document.getElementById("measurement-cards");
  box.innerHTML='<p class="measurement-method">Loading measurements…</p>';
  try{
    async function read(path){const response=await fetch(path,{headers:{authorization:"Bearer "+tok}});if(!response.ok)throw new Error("unavailable");return response.json()}
    const results=await Promise.allSettled([read("/api/measurements"),read("/api/lemon-orders")]);
    const live=results[0].status==="fulfilled"?results[0].value:null;
    const orders=results[1].status==="fulfilled"?results[1].value:null;
    const liveOK=live&&live.ok&&live.coverage&&Array.isArray(live.daily)&&Array.isArray(live.monthly);
    const ordersOK=orders&&orders.ok&&orders.schema===1&&typeof orders.available==="boolean";
    if(!liveOK&&!ordersOK)throw new Error("unavailable");
    const payload=liveOK?live:{asOf:new Date().toISOString(),coverage:{},daily:[],monthly:[],measurementsUnavailable:true};
    payload.lemonOrders=ordersOK?orders:{ok:false,available:false};
    measurements=payload;
    document.getElementById("growth").hidden=false;
    document.getElementById("measurement-method").hidden=false;
    renderGrowth();
    document.getElementById("order-archive").hidden=false;
    renderOrderArchive();
    document.getElementById("growth-metric").onchange=renderGrowth;
    document.getElementById("growth-period").onchange=renderGrowth;
    document.getElementById("order-archive-period").onchange=renderOrderArchive;
  }catch{
    box.innerHTML='<p class="measurement-error">Measurements are temporarily unavailable. No zero counts have been substituted. Try refreshing later.</p>';
  }
}
async function loadDownloads(tok){
  const box=document.getElementById("downloads");
  box.innerHTML="<h2>GitHub asset requests</h2><p>Loading download counts…</p>";
  try{
    const r=await fetch("/api/downloads",{headers:{authorization:"Bearer "+tok}});
    if(!r.ok)throw new Error("unavailable");
    const d=await r.json();
    if(!d.ok)throw new Error("unavailable");
    box.innerHTML="<h2>GitHub asset requests ("+d.total+")</h2>"+
      bars(d.files.map(file=>["Windows setup "+file.version,file.downloads]),Math.max(d.total,1))+
      '<p>GitHub release download requests, including repeats. These are not unique people, completed transfers or installs. Earlier Lemon Squeezy downloads are not included. Counts may take a few minutes to refresh. <a href="https://github.com/kriespy10/captions-gen-site/releases" target="_blank" rel="noopener">View releases</a>.</p>';
  }catch{
    box.innerHTML="<h2>GitHub asset requests</h2><p>Download counts are temporarily unavailable. Try refreshing later.</p>";
  }
}
async function loadSubs(tok){
  const r=await fetch("/api/subscribers",{headers:{authorization:"Bearer "+tok}});
  if(!r.ok)return;
  const list=(await r.json()).subscribers;
  const box=document.getElementById("subs");
  box.innerHTML="<h2>Email sign-ups ("+list.length+")</h2><p>Each row has its own unsubscribe link: put it in every email you send.</p>";
  if(!list.length)return;
  const b=document.createElement("button");b.textContent="Download CSV";box.appendChild(b);
  b.onclick=()=>{
    const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
    const rows=[["email","subscribed_at","source","plugin_version","consent","unsubscribe_url"]].concat(list.map(s=>[s.email,s.at,s.source,s.v,s.consent,s.unsubscribeUrl]));
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(",")).join("\\n")],{type:"text/csv"}));
    a.download="captions-gen-subscribers.csv";a.click();
  };
}
const f=document.getElementById("f");f.onsubmit=e=>{e.preventDefault();load(document.getElementById("t").value.trim())};
let saved=null;try{saved=localStorage.getItem("tok")}catch{}
saved?load(saved):(f.hidden=false);
</script></html>`;
