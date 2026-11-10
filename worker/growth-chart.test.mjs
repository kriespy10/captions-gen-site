import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audienceSummary, growthSeries, growthMarkup } from './growth-chart.mjs';
import worker from './report-worker.js';

const now = new Date('2026-11-10T16:30:00Z');
const user = (firstSeen, extra = {}) => ({ firstSeen, first: {}, lastSeen: firstSeen, ...extra });

test('new installs use first-engine-boot signals, UTC dates and disjoint period boundaries', () => {
  const audience = audienceSummary([
    user('2026-10-12T00:00:00Z'),
    user('2026-10-11T23:59:59Z'),
    user('2026-11-11T01:00:00+02:00'), // Still November 10 UTC.
    user('2026-11-11T00:00:00Z'), // A future record cannot increase this period.
    user('2026-09-11T23:59:59Z'),
  ], now, null, {
    '2026-10-12': { install: 2 }, '2026-10-11': { install: 1 },
    '2026-11-10': { install: 3 }, '2026-11-11': { install: 99 },
    '2026-11-09': { install: -1 }, 'bad-date': { install: 99 }
  });
  assert.equal(audience.newDaily['2026-11-10'], 1, 'firstSeen bins remain separate diagnostics');
  const chart = growthSeries(audience, 'installs', 30);
  assert.deepEqual(chart.current[0], { day: '2026-10-12', value: 2 });
  assert.deepEqual(chart.previous.at(-1), { day: '2026-10-11', value: 1 });
  assert.equal(chart.total, 5);
  assert.equal(chart.priorTotal, 1);
  assert.equal(chart.percent, 400);
  assert.equal(chart.current.at(-1).value, 3);
});


test('52 first app starts stay distinct from a 68-device opted-in active sample', () => {
  const users = Array.from({ length: 68 }, () => user('2026-11-10T08:00:00Z'));
  const audience = audienceSummary(users, now, null, {
    '2026-11-09': { install: 52 }, '2026-10-01': { install: 12 }
  });
  assert.equal(audience.active30, 68);
  assert.equal(audience.newDaily['2026-11-10'], 68);
  const primary = growthSeries(audience);
  assert.equal(primary.metric, 'installs');
  assert.equal(primary.total, 52, 'main total must not use opt-in firstSeen or MAU');
  assert.equal(primary.priorTotal, 12);
  const html = growthMarkup(primary);
  assert.match(html, /New installs by day/);
  assert.match(html, /Recorded first app starts/);
  assert.match(html, /<th scope="col">Installs<\/th>/);
  assert.doesNotMatch(html, /new users|68/);
  const activity = growthMarkup(growthSeries(audience, 'active', 30));
  assert.match(activity, /stats sample/);
});

test('seven-day periods cross leap days and years without local-time drift', () => {
  const leap = growthSeries(audienceSummary([], new Date('2024-03-02T10:00:00Z')), 'installs', 7);
  assert.equal(leap.current[0].day, '2024-02-25');
  assert.equal(leap.current[4].day, '2024-02-29');
  assert.equal(leap.previous.at(-1).day, '2024-02-24');
  const year = growthSeries(audienceSummary([], new Date('2027-01-02T10:00:00Z')), 'installs', 7);
  assert.equal(year.current[0].day, '2026-12-27');
  assert.equal(year.previous[0].day, '2026-12-20');
  assert.throws(() => growthSeries({}, 'installs', 31), /7 or 30/);
  assert.throws(() => growthSeries({}, 'downloads', 7), /Unknown/);
});

test('activity deduplicates each device by day and backfills only known qualified first dates', () => {
  const audience = audienceSummary([
    user('2026-09-01T10:00:00Z', {
      first: { panel_open: '2026-11-10T08:00:00Z', transcribe: '2026-11-10T09:00:00Z', licensed: '2026-11-09T09:00:00Z' },
      lastSeen: '2026-11-10T09:00:00Z',
      activityDays: { '2026-11-10': true, '2026-11-09': true, '2026-11-11': true, 'invalid': true }
    }),
    user('2026-09-01T10:00:00Z', { first: { consent: '2026-11-10T09:00:00Z' }, lastSeen: '2026-11-10T09:00:00Z' })
  ], now, '2026-09-01T00:00:00Z');
  assert.equal(audience.activeDaily['2026-11-10'], 1);
  assert.equal(audience.activeDaily['2026-11-09'], 1);
  assert.equal(audience.activeDaily['2026-11-11'], undefined);
  assert.equal(audience.activeToday, 1, 'complete tracking ignores consent-only lastSeen');
  assert.equal(audience.active30, 1, 'a device active on two dates is one monthly user');
  assert.equal(audience.activeTodayEstimated, false);
});

test('historical gaps remain null and lastSeen estimates are explicitly marked until coverage is complete', () => {
  const audience = audienceSummary([
    user('2026-10-01T08:00:00Z', { first: { panel_open: '2026-10-02T08:00:00Z' }, lastSeen: '2026-11-10T08:00:00Z' })
  ], now, '2026-11-10T12:00:00Z');
  assert.equal(audience.activityCompleteSince, '2026-11-11');
  assert.equal(audience.activeToday, 1);
  assert.equal(audience.activeTodayEstimated, true);
  assert.equal(audience.active30Complete, false);
  assert.equal(audience.previousActive30, null);
  assert.equal(audience.activeYesterday, null);
  const chart = growthSeries(audience, 'active', 30);
  assert.equal(chart.current[0].value, null);
  assert.equal(chart.previous.every(point => point.value === null), true);
  assert.equal(chart.priorTotal, null);
  assert.equal(chart.percent, null);
  const html = growthMarkup(chart);
  assert.match(html, /Building activity history/);
  assert.match(html, /estimated/);
  assert.match(html, /Not recorded/);
  assert.doesNotMatch(html, /Infinity|NaN/);
});

test('the first partial tracking day cannot establish a full prior monthly comparison', () => {
  const users = [user('2026-09-01T00:00:00Z', {
    activityDays: { '2026-09-12': true, '2026-10-12': true },
    lastSeen: '2026-10-12T01:00:00Z'
  })];
  const partial = audienceSummary(users, now, '2026-09-12T00:00:01Z');
  assert.equal(partial.previousActive30, null);
  const complete = audienceSummary(users, now, '2026-09-12T00:00:00Z');
  assert.equal(complete.previousActive30, 1);
  assert.equal(complete.active30, 1);
  assert.equal(growthSeries(complete, 'active', 30).percent, 0);
});

test('a partial collection day stays a chart gap after it becomes a past day', () => {
  const audience = audienceSummary([
    user('2026-10-01T08:00:00Z', {
      activityDays: { '2026-11-10': true, '2026-11-11': true },
      lastSeen: '2026-11-11T08:00:00Z'
    })
  ], new Date('2026-11-11T16:30:00Z'), '2026-11-10T12:00:00Z');
  assert.equal(audience.activityCompleteSince, '2026-11-11');
  const chart = growthSeries(audience, 'active', 7);
  assert.equal(chart.current.find(point => point.day === '2026-11-10').value, null);
  assert.equal(chart.current.find(point => point.day === '2026-11-11').value, 1);
  assert.equal(audience.activeTodayEstimated, false);
  assert.match(growthMarkup(chart), /<td>10 Nov<\/td><td>Not recorded<\/td>/);
  const initialDay = audienceSummary([
    user('2026-10-01T08:00:00Z', { activityDays: { '2026-11-10': true } })
  ], now, '2026-11-10T12:00:00Z');
  assert.equal(growthSeries(initialDay, 'active', 7).current.at(-1).value, 1, 'today remains a clearly labeled partial observation');
});

test('zero baselines never produce invented growth percentages and the chart has a text fallback', () => {
  const first = growthMarkup(growthSeries(audienceSummary([], now, null, { '2026-11-10': { install: 1 } }), 'installs', 30));
  assert.match(first, /First recorded activity/);
  assert.doesNotMatch(first, /Infinity|NaN|100%/);
  assert.match(first, /role="img"/);
  assert.match(first, /<caption>Current and previous 30-day periods/);
  assert.match(first, /Today · partial · UTC/);
  const empty = growthMarkup(growthSeries(audienceSummary([], now), 'installs', 7));
  assert.match(empty, /Your first recorded app starts will appear here/);
  assert.match(empty, /No change yet/);
});

test('usage records keep qualified daily history once per device and consent alone cannot start coverage', async () => {
  const store = new Map();
  const env = {
    ADMIN_TOKEN: 'test-admin',
    REPORTS: {
      get: async key => store.get(key) || null,
      put: async (key, value) => { store.set(key, value); },
      delete: async key => { store.delete(key); },
      list: async ({ prefix }) => ({ keys: [...store.keys()].filter(key => key.startsWith(prefix)).map(name => ({ name })), list_complete: true })
    }
  };
  const id = '123e4567-e89b-42d3-a456-426614174000';
  const call = async (event) => worker.fetch(new Request('https://api.captionsgen.com/api/usage', {
    method: 'POST', body: JSON.stringify({ id, event, v: '1.1.9' })
  }), env);
  assert.equal((await call('consent')).status, 200);
  assert.equal(store.has('meta:activity-history-since'), false);
  assert.equal((await call('panel_open')).status, 200);
  const started = store.get('meta:activity-history-since');
  assert.match(started, /^\d{4}-\d{2}-\d{2}T/);
  await call('transcribe');
  await call('captions_placed');
  assert.equal(store.get('meta:activity-history-since'), started);
  const rec = JSON.parse(store.get('u:' + id));
  assert.deepEqual(Object.keys(rec.activityDays), [new Date().toISOString().slice(0, 10)]);
  const response = await worker.fetch(new Request('https://api.captionsgen.com/api/funnel', { headers: { authorization: 'Bearer test-admin' } }), env);
  const summary = await response.json();
  assert.equal(summary.audience.total, 1);
  assert.equal(summary.audience.activeToday, 1);
  assert.equal(JSON.stringify(summary.audience).includes(id), false);
  await worker.fetch(new Request('https://api.captionsgen.com/api/usage/' + id, { method: 'DELETE' }), env);
  assert.equal(store.has('u:' + id), false);
});

test('the rendered dashboard script parses and keeps detailed telemetry secondary', async () => {
  const response = await worker.fetch(new Request('https://api.captionsgen.com/funnel'), {});
  const html = await response.text();
  assert.doesNotThrow(() => new Function(html.split('<script>')[1].split('</script>')[0]));
  assert.match(html, /<option value="installs">New installs/);
  assert.match(html, /Monthly active \(stats sample\)/);
  assert.match(html, /<details><summary>Detailed plugin stats/);
  assert.match(html, /These signals are not unique users/);
  assert.match(html, /Active today \(stats sample\)/);
  assert.match(html, /Active users \(stats\)/);
  assert.match(html, /Active users show only the stats sample, not your total audience/);
  assert.match(html, /disabling stats can miss starts/);
  assert.match(html, /function __name\(target\)/, 'preserve the bundled-function name helper');
});
