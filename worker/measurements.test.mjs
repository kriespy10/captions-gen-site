// Exercise the actual migration/SQL using SQLite, with a small D1 binding adapter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { measurements, INSTALLER_URL, usageRevocationHash, beginUsageWrite } from './measurements.mjs';
import worker from './report-worker.js';

const migration = readFileSync(new URL('./migrations/0001_measurements.sql', import.meta.url),'utf8');
const revocationMigration = readFileSync(new URL('./migrations/0002_usage_revocations.sql', import.meta.url),'utf8');
const leasesMigration = readFileSync(new URL('./migrations/0003_usage_write_leases.sql', import.meta.url),'utf8');
const ID = '123e4567-e89b-42d3-a456-426614174000';
const RECEIPT = '223e4567-e89b-42d3-a456-426614174000';
const SESSION = '323e4567-e89b-42d3-a456-426614174000';
const NOW = new Date('2026-11-10T14:00:00Z');
const admin = { authorization:'Bearer admin' };

function setup(extra = {}) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(migration);
  sqlite.exec(revocationMigration);
  sqlite.exec(leasesMigration);
  const kv = new Map();
  const prepare = (sql, values = []) => ({
    bind: (...args) => prepare(sql,args),
    execute() {
      const query = sqlite.prepare(sql);
      if (/^\s*SELECT/i.test(sql)) return { success:true,results:query.all(...values),meta:{changes:0} };
      const result = query.run(...values);
      return { success:true,results:[],meta:{changes:Number(result.changes)} };
    },
    async run() { return this.execute(); },
  });
  const db = { prepare, async batch(statements) {
    sqlite.exec('BEGIN');
    try { const results = statements.map(item => item.execute()); sqlite.exec('COMMIT'); return results; }
    catch(error) { sqlite.exec('ROLLBACK'); throw error; }
  } };
  const env = { METRICS:db, ADMIN_TOKEN:'admin', DOWNLOAD_BROWSER_COUNTS:'true', REPORTS:{
    get:async key => kv.get(key) || null, delete:async key => kv.delete(key),
    put:async (key,value) => kv.set(key,value),
    list:async ({prefix}) => ({keys:[...kv.keys()].filter(key=>key.startsWith(prefix)).map(name=>({name})),list_complete:true}),
  }, ...extra };
  const call = async (method,path,body,headers={},now=NOW) => {
    const request = new Request('https://api.captionsgen.com'+path,{
      method,headers,body:body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    return measurements(request,env,new URL(request.url),now);
  };
  const summary = async (now=NOW) => (await call('GET','/api/measurements',undefined,admin,now)).json();
  return { sqlite,kv,env,call,summary };
}

test('download counters use separate atomic daily/monthly browser estimates, not summed daily uniques',async () => {
  const {call,summary} = setup();
  const first = await call('GET','/api/download/windows?email=must-not-be-stored@example.com',undefined,{},new Date('2026-11-01T12:00:00Z'));
  assert.equal(first.status,302);
  assert.equal(first.headers.get('location'),INSTALLER_URL);
  assert.match(first.headers.get('set-cookie'),/^cg_download_counts=2026-11-01\.2026-11;/);
  assert.match(first.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);
  const cookie1 = first.headers.get('set-cookie').split(';')[0];
  const second = await call('GET','/api/download/windows',undefined,{cookie:cookie1},new Date('2026-11-02T12:00:00Z'));
  const cookie2 = second.headers.get('set-cookie').split(';')[0];
  await call('GET','/api/download/windows',undefined,{cookie:cookie2},new Date('2026-11-02T13:00:00Z'));
  const data = await summary();
  assert.deepEqual(data.daily.map(row => [row.date,row.downloadRequests,row.uniqueDownloadBrowsers]),[
    ['2026-11-01',1,1],['2026-11-02',2,1],
  ]);
  assert.equal(data.monthly[0].downloadRequests,3);
  assert.equal(data.monthly[0].uniqueDownloadBrowsers,1);
  assert.equal(JSON.stringify(data).includes('must-not-be-stored'),false);
});

test('a fresh calendar month increments monthly estimate despite a retained older date marker',async () => {
  const {call,summary} = setup();
  await call('GET','/api/download/windows',undefined,{cookie:'cg_download_counts=2026-10-31.2026-10'});
  const data = await summary();
  assert.equal(data.monthly[0].month,'2026-11');
  assert.equal(data.monthly[0].uniqueDownloadBrowsers,1);
});

test('HEAD/prefetch are ignored; opt-out and disabled browser estimates still count raw requests',async () => {
  const {call,summary,env} = setup();
  for (const [method,headers] of [['HEAD',{}],['GET',{purpose:'prefetch'}],['GET',{'sec-purpose':'prefetch;prerender'}]]) {
    const response = await call(method,'/api/download/windows',undefined,headers);
    assert.equal(response.status,302);
    assert.equal(response.headers.has('set-cookie'),false);
  }
  assert.equal((await summary()).daily.length,0);
  const off = await call('GET','/api/download/windows',undefined,{cookie:'cg_download_counting=off'});
  assert.match(off.headers.get('set-cookie'),/Max-Age=0/);
  assert.equal((await summary()).daily[0].uniqueDownloadBrowsers,null);
  env.DOWNLOAD_BROWSER_COUNTS='false';
  const disabled = await call('GET','/api/download/windows');
  assert.equal(disabled.headers.has('set-cookie'),false);
  const data = await summary();
  assert.equal(data.daily[0].downloadRequests,2);
  assert.equal(data.daily[0].uniqueDownloadBrowsers,null);
  assert.equal(data.coverage.browserCountingEnabled,false);
});

test('download delivery works during database failure without setting a false counted cookie',async () => {
  const {call} = setup({METRICS:{batch:async () => {throw new Error('offline');},prepare:()=>({bind(){return this;}})}});
  const response = await call('GET','/api/download/windows');
  assert.equal(response.status,302);
  assert.equal(response.headers.get('location'),INSTALLER_URL);
  assert.equal(response.headers.has('set-cookie'),false);
});

test('browser-count preference is a separate fixed-target form without identifiers or open redirects',async () => {
  const {call} = setup();
  const response = await call('POST','/api/download-counting?next=https://evil.example','choice=off',{'content-type':'application/x-www-form-urlencoded'});
  assert.equal(response.status,303);
  assert.equal(response.headers.get('location'),'https://captionsgen.com/privacy.html#download-counts');
  assert.match(response.headers.getSetCookie()[0],/^cg_download_counting=off; Path=\/api\/;/);
  assert.equal(response.headers.getSetCookie().length,2);
  assert.equal((await call('POST','/api/download-counting','choice=anything')).status,400);
  const status = await call('GET','/api/download-counting',undefined,{cookie:'cg_download_counting=off'});
  assert.match(await status.text(),/currently off/);
  assert.equal(status.headers.has('set-cookie'),false);
});

test('installation receipts atomically increment once, including concurrent retries and changed dates',async () => {
  const {call,summary,sqlite} = setup();
  const body = {receiptId:RECEIPT,occurredAt:'2026-11-10T10:00:00Z'};
  const results = await Promise.all(Array.from({length:10},()=>call('POST','/api/install-registration',body)));
  assert.equal(results.every(response=>response.status===200),true);
  const payloads = await Promise.all(results.map(response=>response.json()));
  assert.equal(payloads.filter(response=>!response.duplicate).length,1);
  const changed = await call('POST','/api/install-registration',{...body,occurredAt:'2026-11-09T10:00:00Z'});
  assert.equal((await changed.json()).duplicate,true);
  const data = await summary();
  assert.equal(data.daily[0].uniqueInstalls,1);
  assert.equal(data.monthly[0].uniqueInstalls,1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM installation_receipts').get().n,1);
  assert.deepEqual(Object.keys(sqlite.prepare('SELECT * FROM installation_receipts').get()),['receipt_id','occurred_at','received_at','expires_at']);
});

test('invalid, stale and future events are rejected; measurement errors never claim acknowledgement',async () => {
  const {call,env} = setup();
  for (const body of [null,[],{receiptId:{toString:'bad'},occurredAt:NOW.toISOString()},
    {receiptId:RECEIPT,occurredAt:'2025-01-01T00:00:00Z'},
    {receiptId:RECEIPT,occurredAt:'2026-11-10T16:00:00Z'},
    {receiptId:RECEIPT,occurredAt:'2026-11-10T14:00:00'},
    {receiptId:'not-a-uuid',occurredAt:NOW.toISOString()}])
    assert.equal((await call('POST','/api/install-registration',JSON.stringify(body))).status,400);
  env.METRICS=undefined;
  assert.equal((await call('POST','/api/install-registration',{receiptId:RECEIPT,occurredAt:NOW.toISOString()})).status,503);
});

test('sessions require a currently opted-in ID, dedupe retries and count monthly devices independently',async () => {
  const {call,summary,kv} = setup();
  const body = {id:ID,sessionId:SESSION,startedAt:'2026-11-01T10:00:00Z',v:'1.2.0',os:'Windows'};
  assert.equal((await call('POST','/api/session',body)).status,403);
  kv.set('u:'+ID,JSON.stringify({firstSeen:'2026-11-01T10:00:00Z'}));
  assert.equal((await call('POST','/api/session',body)).status,200);
  assert.equal((await (await call('POST','/api/session',body)).json()).duplicate,true);
  await call('POST','/api/session',{...body,sessionId:'423e4567-e89b-42d3-a456-426614174000',startedAt:'2026-11-02T10:00:00Z'});
  const data = await summary();
  assert.equal(data.daily.filter(row=>row.activeDevices===1).length,2);
  assert.equal(data.monthly[0].activeDevices,1);
  assert.equal(data.monthly[0].sessionCount,2);
  assert.equal(JSON.stringify(data).includes(ID),false);
  assert.equal(JSON.stringify(data).includes('Windows'),false);
  assert.equal(data.coverage.clientUpdateRequired,true);
});

test('opting out deletes D1 session history and existing KV usage; D1 failure preserves retryability',async () => {
  const {call,summary,kv,env} = setup();
  kv.set('u:'+ID,'{}');
  await call('POST','/api/session',{id:ID,sessionId:SESSION,startedAt:NOW.toISOString()});
  const request = () => new Request('https://api.captionsgen.com/api/usage/'+ID,{method:'DELETE'});
  const response = await worker.fetch(request(),env);
  assert.equal(response.status,200);
  assert.equal(kv.has('u:'+ID),false);
  assert.equal((await summary()).daily.length,0);
  kv.set('u:'+ID,'{}');
  env.METRICS={prepare:()=>({bind(){return this;},run:async()=>{throw new Error('offline');}})};
  assert.equal((await worker.fetch(request(),env)).status,503);
  assert.equal(kv.has('u:'+ID),true);
});

test('receipt expiry preserves aggregate rolls; sessions and aggregates respect bounded retention',async () => {
  const {call,summary,sqlite,kv} = setup();
  await call('POST','/api/install-registration',{receiptId:RECEIPT,occurredAt:NOW.toISOString()});
  kv.set('u:'+ID,'{}');
  await call('POST','/api/session',{id:ID,sessionId:SESSION,startedAt:NOW.toISOString()});
  const later = new Date(NOW.getTime()+91*86400000);
  assert.equal((await summary(later)).monthly[0].uniqueInstalls,1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM installation_receipts').get().n,0);
  assert.equal((await call('POST','/api/install-registration',{receiptId:RECEIPT,occurredAt:NOW.toISOString()}, {}, later)).status,400);
  const expired=await summary(new Date(NOW.getTime()+401*86400000));
  assert.equal(expired.daily.length,0);
  assert.equal(expired.monthly.length,0);
});

test('measurement summaries require the existing admin token and distinguish unavailable from zero',async () => {
  const {call,env} = setup();
  assert.equal((await call('GET','/api/measurements')).status,401);
  assert.equal((await call('GET','/api/measurements',undefined,{authorization:'Bearer wrong'})).status,401);
  const empty=await (await call('GET','/api/measurements',undefined,admin)).json();
  assert.equal(empty.ok,true);
  assert.deepEqual(empty.daily,[]);
  assert.equal(empty.coverage.downloadsSince,null);
  env.METRICS=undefined;
  const failed=await call('GET','/api/measurements',undefined,admin);
  assert.equal(failed.status,503);
  assert.equal(Object.hasOwn(await failed.json(),'daily'),false);
});

test('late sessions cannot recreate history even when KV returns a stale opted-in record after deletion',async () => {
  const {call,kv,env,sqlite} = setup();
  kv.set('u:'+ID,'{}');
  const oldGet = env.REPORTS.get;
  let revokeDuringRead = true;
  env.REPORTS.get = async key => {
    const stale = await oldGet(key);
    if (key === 'u:'+ID && revokeDuringRead) {
      revokeDuringRead = false;
      const response = await worker.fetch(new Request('https://api.captionsgen.com/api/usage/'+ID,{method:'DELETE'}),env);
      assert.equal(response.status,200);
    }
    return stale;
  };
  const response = await call('POST','/api/session',{id:ID,sessionId:SESSION,startedAt:NOW.toISOString()});
  assert.equal(response.status,403);
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM measured_sessions').get().n,0);
  const marker = sqlite.prepare('SELECT * FROM usage_revocations').get();
  assert.equal(marker.subject_hash,await usageRevocationHash(ID));
  assert.equal(marker.subject_hash.length,64);
  assert.equal(JSON.stringify(marker).includes(ID),false);
  assert.equal(sqlite.prepare("SELECT COUNT(*) n FROM measurement_meta WHERE name='sessionsSince'").get().n,0);
});

test('a delayed usage KV write is removed when opt-out commits between its first check and put',async () => {
  const {kv,env} = setup();
  let reachedPut,releasePut;
  const putReached = new Promise(resolve=>{reachedPut=resolve;});
  const putReleased = new Promise(resolve=>{releasePut=resolve;});
  const originalPut = env.REPORTS.put;
  env.REPORTS.put = async (key,value) => {
    if (key === 'u:'+ID) { reachedPut(); await putReleased; }
    return originalPut(key,value);
  };
  const pending = worker.fetch(new Request('https://api.captionsgen.com/api/usage',{
    method:'POST',body:JSON.stringify({id:ID,event:'panel_open',v:'1.1.10'}),
  }),env);
  await putReached;
  const deletion = await worker.fetch(new Request('https://api.captionsgen.com/api/usage/'+ID,{method:'DELETE'}),env);
  assert.equal(deletion.status,503,'deletion cannot acknowledge while an older writer is paused');
  releasePut();
  assert.equal((await pending).status,403);
  assert.equal(kv.has('u:'+ID),false);
  const retry=await worker.fetch(new Request('https://api.captionsgen.com/api/usage/'+ID,{method:'DELETE'}),env);
  assert.equal(retry.status,200);
});

test('revocation persists across failed KV cleanup; stale KV ghosts are excluded from audience totals',async () => {
  const {kv,env,sqlite} = setup();
  const originalRecord = {firstSeen:NOW.toISOString(),lastSeen:NOW.toISOString(),first:{panel_open:NOW.toISOString()},days:{panel_open:1}};
  kv.set('u:'+ID,JSON.stringify(originalRecord));
  const originalDelete = env.REPORTS.delete;
  let failOnce = true;
  env.REPORTS.delete = async key => { if(failOnce) {failOnce=false;throw new Error('KV unavailable');} return originalDelete(key); };
  const request = () => new Request('https://api.captionsgen.com/api/usage/'+ID,{method:'DELETE'});
  assert.equal((await worker.fetch(request(),env)).status,503);
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM usage_revocations').get().n,1);
  const funnel = await worker.fetch(new Request('https://api.captionsgen.com/api/funnel',{headers:admin}),env);
  assert.equal((await funnel.json()).optedIn,0);
  const late = await worker.fetch(new Request('https://api.captionsgen.com/api/usage',{
    method:'POST',body:JSON.stringify({id:ID,event:'consent'}),
  }),env);
  assert.equal(late.status,403);
  assert.equal((await worker.fetch(request(),env)).status,200);
  assert.equal(kv.has('u:'+ID),false);
});

test('revocation is limited to the old random ID and expires after 90 days',async () => {
  const {call,env,sqlite} = setup();
  await call('DELETE','/api/usage/'+ID);
  const marker = sqlite.prepare('SELECT * FROM usage_revocations').get();
  assert.equal(marker.expires_at,Math.floor(NOW.getTime()/1000)+90*86400);
  const freshId='523e4567-e89b-42d3-a456-426614174000';
  const response = await worker.fetch(new Request('https://api.captionsgen.com/api/usage',{
    method:'POST',body:JSON.stringify({id:freshId,event:'consent'}),
  }),env);
  assert.equal(response.status,200);
  await call('GET','/api/measurements',undefined,admin,new Date(NOW.getTime()+91*86400000));
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM usage_revocations').get().n,0);
});

test('an interrupted writer lease has no raw ID and only delays cleanup acknowledgement for fifteen minutes',async () => {
  const {call,env,sqlite,kv} = setup();
  kv.set('u:'+ID,'{}');
  await beginUsageWrite(env,ID,NOW);
  const lease=sqlite.prepare('SELECT * FROM usage_write_leases').get();
  assert.equal(JSON.stringify(lease).includes(ID),false);
  assert.equal(lease.expires_at,Math.floor(NOW.getTime()/1000)+900);
  assert.equal((await call('DELETE','/api/usage/'+ID)).status,503);
  assert.equal(kv.has('u:'+ID),false,'KV cleanup is attempted even while an older write remains outstanding');
  const later=new Date(NOW.getTime()+901000);
  assert.equal((await call('DELETE','/api/usage/'+ID,undefined,{},later)).status,200);
  await call('GET','/api/measurements',undefined,admin,later);
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM usage_write_leases').get().n,0);
});

test('Wrangler routes remain top-level rather than becoming values inside the vars table',() => {
  const config=readFileSync(new URL('./wrangler.toml',import.meta.url),'utf8');
  let table='',routes=0,flags=0;
  for (const raw of config.split(/\r?\n/)) {
    const line=raw.trim();
    if (/^\[.+\]$/.test(line)) table=line;
    if (/^routes\s*=/.test(line)) { assert.equal(table,''); routes++; }
    if (/^(DOWNLOAD_BROWSER_COUNTS|MEASUREMENT_CLIENT_RELEASED)\s*=/.test(line)) { assert.equal(table,'[vars]'); flags++; }
  }
  assert.equal(routes,1);
  assert.equal(flags,2);
});
