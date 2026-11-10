import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from './report-worker.js';
import {audienceSummary} from './growth-chart.mjs';

// Exercise the actual generated script, including scripts extracted from a
// Wrangler bundle. Parsing alone cannot detect missing bundler runtime helpers.
export async function assertDashboardRenders(html, {ordersUnavailable=false,liveUnavailable=false,noImport=false}={}) {
  const script=html.split('<script>')[1]?.split('</script>')[0];
  assert.ok(script,'Dashboard contains its client script');
  const elements=new Map();
  const element=id=>{
    if(!elements.has(id))elements.set(id,{id,hidden:true,innerHTML:'',textContent:'',value:id==='growth-period'||id==='legacy-period'?'30':id==='growth-metric'?'downloadRequests':'',appendChild(){}});
    return elements.get(id);
  };
  const daily={'2026-11-09':{install:3},'2026-11-10':{install:1}};
  const audience=audienceSummary([{
    firstSeen:'2026-11-01T10:00:00Z',lastSeen:'2026-11-10T10:00:00Z',
    first:{panel_open:'2026-11-01T10:00:00Z'},activityDays:{'2026-11-10':true}
  }],new Date('2026-11-10T12:00:00Z'),'2026-09-01T00:00:00Z',daily);
  const payload={ok:true,audience,pings:{install:4,engine_start:2,daily},optedIn:1,steps:[],returning:0,active7:1,active30:1,usedNotBought:0,versions:{'1.1.9':1},os:{Windows:1}};
  const calls=[];
  const context={
    document:{getElementById:element,createElement:tag=>({tag,appendChild(){}})},
    localStorage:{getItem:()=> 'local-fixture-token',setItem(){},removeItem(){}},
    fetch:async (url,options)=>{
      calls.push(url);
      assert.equal(options.headers.authorization,'Bearer local-fixture-token','each private endpoint uses the existing admin header');
      if(url==='/api/funnel')return {ok:true,json:async()=>payload};
      if(url==='/api/lemon-orders') {
        if(ordersUnavailable)return {ok:false};
        return {ok:true,json:async()=>noImport?{ok:true,schema:1,available:false,coverage:null,totalOrders:null,daily:[],monthly:[]}:{
          ok:true,schema:1,source:'Lemon Squeezy orders',available:true,snapshotAt:'2026-11-10T10:00:00Z',
          coverage:{from:'2026-09-01',through:'2026-11-10',completeThrough:'2026-11-09',complete:true,timezone:'UTC'},
          totalOrders:9,daily:[{date:'2026-10-31',orders:6},{date:'2026-11-09',orders:2},{date:'2026-11-10',orders:1}],
          monthly:[{month:'2026-10',orders:6},{month:'2026-11',orders:3}]
        }};
      }
      if(url==='/api/measurements'&&liveUnavailable)return {ok:false};
      if(url==='/api/measurements')return {ok:true,json:async()=>({
        ok:true,asOf:'2026-11-10T12:00:00Z',
        coverage:{downloadsSince:'2026-09-01T00:00:00Z',browserDownloadsSince:'2026-09-01T00:00:00Z',installsSince:'2026-09-01T00:00:00Z',sessionsSince:'2026-09-01T00:00:00Z',browserCountingEnabled:true,clientUpdateRequired:false},
        daily:[{date:'2026-11-09',downloadRequests:3,uniqueDownloadBrowsers:2,uniqueInstalls:2,sessionCount:5,activeDevices:2},{date:'2026-11-10',downloadRequests:1,uniqueDownloadBrowsers:1,uniqueInstalls:1,sessionCount:2,activeDevices:1}],
        monthly:[{month:'2026-11',downloadRequests:4,uniqueDownloadBrowsers:2,uniqueInstalls:3,sessionCount:7,activeDevices:2}]
      })};
      if(url==='/api/downloads')return {ok:true,json:async()=>({ok:true,total:12,files:[{version:'1.1.9',downloads:12}]})};
      if(url==='/api/subscribers')return {ok:true,json:async()=>({subscribers:Array.from({length:579},()=>({}))})};
      throw new Error('Unexpected dashboard request');
    },URL,Blob,Date:class extends Date{constructor(...args){super(...(args.length?args:['2026-11-10T12:00:00Z']))}}
  };
  vm.runInNewContext(script,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(element('growth-body').innerHTML,/<svg/,'Install graph renders after the API response');
  if(liveUnavailable)assert.match(element('growth-body').innerHTML,/growth-value">—</);
  else assert.match(element('growth-body').innerHTML,/growth-value">4</,'Four download requests remain separate from orders, install registrations and the activity sample');
  assert.match(element('measurement-cards').innerHTML,/active users in November/);
  if(!liveUnavailable)assert.match(element('measurement-cards').innerHTML,/Browser estimate in November<\/dt><dd>2<\/dd>/);
  assert.match(element('legacy-growth-body').innerHTML,/Legacy first-start signals/);
  assert.match(element('downloads').innerHTML,/GitHub asset requests \(12\)/);
  assert.match(element('subs').innerHTML,/Email sign-ups \(579\)/);
  assert.deepEqual(calls,['/api/funnel','/api/measurements','/api/lemon-orders','/api/downloads','/api/subscribers']);
  element('growth-metric').value='uniqueInstalls';
  element('growth-metric').onchange();
  if(!liveUnavailable)assert.match(element('growth-body').innerHTML,/growth-value">3</);
  assert.match(element('growth-body').innerHTML,/install registrations/);
  element('growth-metric').value='sessionCount';
  element('growth-metric').onchange();
  if(!liveUnavailable)assert.match(element('growth-body').innerHTML,/growth-value">7</);
  element('growth-period').value='7';
  element('growth-period').onchange();
  assert.match(element('growth-body').innerHTML,/previous 7-day periods/);
  assert.doesNotMatch(element('growth-body').innerHTML,/NaN|Infinity/);
  element('growth-metric').value='lemonOrders';element('growth-metric').onchange();
  assert.equal(element('growth-history-option').hidden,false);
  assert.match(element('growth-body').innerHTML,/Distinct checkouts/);
  if(ordersUnavailable||noImport){
    assert.match(element('growth-body').innerHTML,/growth-value">—</);
    assert.match(element('measurement-cards').innerHTML,noImport?/No order import yet/:/Order history temporarily unavailable/);
  }else{
    assert.match(element('growth-body').innerHTML,/growth-value">2</);
    assert.match(element('measurement-cards').innerHTML,/measurement-number">9<\/strong><p class="measurement-number-label">orders in imported lifetime history/);
    assert.match(element('growth-body').innerHTML,/snapshot 2026-11-10 10:00:00 UTC/);
    assert.match(element('growth-body').innerHTML,/Completed UTC days through 2026-11-09/);
    assert.equal(element('growth-period-7').textContent,'Last 7 completed UTC days');
  }
  element('growth-period').value='history';element('growth-period').onchange();
  assert.match(element('growth-body').innerHTML,/View monthly numbers/);
  assert.doesNotMatch(element('growth-body').innerHTML,/Today · partial/,'historical monthly snapshots do not look like live daily tracking');
  assert.doesNotMatch(element('growth-body').innerHTML,/NaN|Infinity|local-fixture-token/);
  element('growth-metric').value='downloadRequests';element('growth-metric').onchange();
  assert.equal(element('growth-period').value,'30','an order-only history period cannot leak into live metrics');
  assert.equal(element('growth-history-option').hidden,true);
  assert.equal(element('growth-period-7').textContent,'Last 7 days');
  return {chartRendered:true,threeMetricSwitch:true,ordersMetricSwitch:true,monthlyOrderHistory:true,calendarMonthDistinct:true,periodSwitch:true,subscribersRendered:579};
}

test('generated dashboard runs after authentication and both graph controls work',async()=>{
  const response=await worker.fetch(new Request('https://api.captionsgen.com/funnel'),{});
  await assertDashboardRenders(await response.text());
});

test('historical order failure or no import leaves live measurements, legacy details and subscribers working',async()=>{
  const html=await (await worker.fetch(new Request('https://api.captionsgen.com/funnel'),{})).text();
  await assertDashboardRenders(html,{ordersUnavailable:true});
  await assertDashboardRenders(html,{noImport:true});
});

test('a live measurement outage does not hide an available historical order snapshot',async()=>{
  const html=await (await worker.fetch(new Request('https://api.captionsgen.com/funnel'),{})).text();
  await assertDashboardRenders(html,{liveUnavailable:true});
});
