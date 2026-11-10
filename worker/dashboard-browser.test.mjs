import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from './report-worker.js';
import {audienceSummary} from './growth-chart.mjs';

// Exercise the actual generated script, including scripts extracted from a
// Wrangler bundle. Parsing alone cannot detect missing bundler runtime helpers.
export async function assertDashboardRenders(html) {
  const script=html.split('<script>')[1]?.split('</script>')[0];
  assert.ok(script,'Dashboard contains its client script');
  const elements=new Map();
  const element=id=>{
    if(!elements.has(id))elements.set(id,{id,hidden:true,innerHTML:'',textContent:'',value:id==='growth-period'?'30':id==='growth-metric'?'installs':'',appendChild(){}});
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
    fetch:async url=>{
      calls.push(url);
      if(url==='/api/funnel')return {ok:true,json:async()=>payload};
      if(url==='/api/downloads')return {ok:true,json:async()=>({ok:true,total:12,files:[{version:'1.1.9',downloads:12}]})};
      if(url==='/api/subscribers')return {ok:true,json:async()=>({subscribers:Array.from({length:579},()=>({}))})};
      throw new Error('Unexpected dashboard request');
    },URL,Blob,Date
  };
  vm.runInNewContext(script,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(element('growth-body').innerHTML,/<svg/,'Install graph renders after the API response');
  assert.match(element('growth-body').innerHTML,/growth-value">4</,'Four recorded installs remain separate from one opted-in device');
  assert.match(element('active-users').innerHTML,/Monthly active \(stats sample\)/);
  assert.match(element('downloads').innerHTML,/Installer downloads \(12\)/);
  assert.match(element('subs').innerHTML,/Email sign-ups \(579\)/);
  assert.deepEqual(calls,['/api/funnel','/api/downloads','/api/subscribers']);
  element('growth-metric').value='active';
  element('growth-metric').onchange();
  assert.match(element('growth-body').innerHTML,/active users/);
  element('growth-period').value='7';
  element('growth-period').onchange();
  assert.match(element('growth-body').innerHTML,/previous 7-day periods/);
  assert.doesNotMatch(element('growth-body').innerHTML,/NaN|Infinity/);
  return {chartRendered:true,metricSwitch:true,periodSwitch:true,subscribersRendered:579};
}

test('generated dashboard runs after authentication and both graph controls work',async()=>{
  const response=await worker.fetch(new Request('https://api.captionsgen.com/funnel'),{});
  await assertDashboardRenders(await response.text());
});
