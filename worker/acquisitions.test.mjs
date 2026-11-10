import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acquisitionSeries, acquisitionCard } from './acquisitions.mjs';
import { measurementCards } from './growth-chart.mjs';

const fixture = () => ({
  asOf: '2026-11-11T12:00:00Z',
  coverage: { browserCountingEnabled: true, browserDownloadsSince: '2026-11-10T03:29:41.952Z' },
  lemonOrders: { ok: true, schema: 1, available: true,
    coverage: { from: '2026-09-01', through: '2026-11-10', completeThrough: '2026-11-09', complete: true },
    daily: [{ date: '2026-10-31', orders: 6 }, { date: '2026-11-09', orders: 52 }, { date: '2026-11-10', orders: 999 }]
  },
  daily: [{ date: '2026-11-09', uniqueDownloadBrowsers: 999 }, { date: '2026-11-10', uniqueDownloadBrowsers: 1 }, { date: '2026-11-11', uniqueDownloadBrowsers: 1 }],
  monthly: [{ month: '2026-11', uniqueDownloadBrowsers: 1 }]
});

test('the cutover selects one daily source and never adds overlapping orders and browser estimates', () => {
  const payload = fixture();
  const daily = acquisitionSeries(payload, 7);
  assert.equal(daily.current.find(row => row.day === '2026-11-09').observed, 52);
  assert.equal(daily.current.find(row => row.day === '2026-11-10').observed, 1);
  assert.equal(daily.total, 53);
  assert.equal(daily.current.at(-1).day, '2026-11-10', 'daily comparison excludes the current partial day');
  assert.deepEqual(daily.sourceSwitch, { index: 6, label: 'Direct downloads · 10 Nov' });
  const history = acquisitionSeries(payload, 'history');
  assert.equal(history.total, 60);
  assert.equal(history.summary.month.value, 54);
  assert.equal(history.current.find(row => row.day === '2026-11-01').observed, 54);
  assert.equal(history.current.reduce((sum, row) => sum + (row.observed || 0), 0), history.total);
  assert.doesNotMatch(acquisitionCard(history), /999/);
});

test('the first partial browser day remains a chart gap after that day is over, with observations retained', () => {
  const model = acquisitionSeries(fixture(), 7);
  const first = model.current.at(-1);
  assert.equal(first.partial, true);
  assert.equal(first.value, null);
  assert.equal(first.observed, 1);
  assert.equal(model.currentComplete, false);
  assert.equal(model.percent, null);
  assert.equal(model.summary.today.partial, true);
  assert.equal(model.summary.history.value, 60, 'partial recorded values are not discarded');
});

test('monthly acquisition totals sum the same daily estimates while monthly distinct browsers remain separate', () => {
  const payload = fixture();
  const model = acquisitionSeries(payload, 'history');
  assert.equal(model.summary.month.value, 52 + 1 + 1);
  assert.match(acquisitionCard(model), /sum of daily estimates in November/);
  const cards = measurementCards(payload);
  assert.match(cards, /Browser estimate in November<\/dt><dd>1<\/dd>/);
  assert.match(model.tableCaption, /not calendar-month distinct browsers/);
});

test('missing historical orders do not invent zeros or hide observed direct downloads', () => {
  const payload = fixture();
  payload.lemonOrders = { ok: true, schema: 1, available: false };
  const daily = acquisitionSeries(payload, 30);
  assert.equal(daily.current.find(row => row.day === '2026-11-09').observed, null);
  assert.equal(daily.total, 1);
  assert.equal(daily.priorTotal, null);
  assert.equal(daily.percent, null);
  assert.equal(acquisitionSeries(payload, 'history').total, 2);
  assert.match(daily.coverageMessage, /Earlier order history is unavailable/);
});

test('disabled, missing, unavailable and explicit-null browser counts never fall back to orders or requests', () => {
  for (const change of [
    payload => { payload.coverage.browserCountingEnabled = false; },
    payload => { payload.coverage.browserDownloadsSince = null; },
    payload => { payload.measurementsUnavailable = true; },
    payload => { payload.daily = payload.daily.map(row => ({ ...row, uniqueDownloadBrowsers: null, downloadRequests: 500 })); }
  ]) {
    const payload = fixture();
    change(payload);
    const model = acquisitionSeries(payload, 'history');
    assert.equal(model.total, 58);
    assert.equal(model.summary.today.value, null);
    assert.equal(model.summary.month.value, 52);
    assert.equal(model.summary.month.partial, true);
    assert.equal(acquisitionSeries(payload, 7).current.at(-1).observed, null);
  }
});

test('source changes suppress percentages even with full days and complete prior counts', () => {
  const payload = fixture();
  payload.coverage.browserDownloadsSince = '2026-11-10T00:00:00Z';
  const model = acquisitionSeries(payload, 7);
  assert.equal(model.currentComplete, true);
  assert.equal(model.priorTotal, 6);
  assert.equal(model.percent, null);
  assert.equal(model.comparisonLabel, 'Counting method changed');
});

test('fully covered windows using one source still support a valid growth comparison', () => {
  const payload = fixture();
  payload.asOf = '2026-11-10T19:00:00Z';
  payload.lemonOrders.daily.push({ date: '2026-11-02', orders: 10 });
  const model = acquisitionSeries(payload, 7);
  assert.equal(model.total, 52);
  assert.equal(model.priorTotal, 16);
  assert.equal(model.currentComplete, true);
  assert.equal(model.percent, 225);
  assert.equal(model.comparisonLabel, null);
  assert.equal(model.sourceSwitch, null);
  assert.equal(model.summary.today.value, 1, 'today is still available in the live card');
});

test('month and year boundaries stay UTC and expired D1 history remains unknown', () => {
  const payload = fixture();
  payload.asOf = '2027-01-02T00:10:00Z';
  payload.daily = [{ date: '2026-12-31', uniqueDownloadBrowsers: 3 }, { date: '2027-01-01', uniqueDownloadBrowsers: 2 }, { date: '2027-01-02', uniqueDownloadBrowsers: 4 }];
  let model = acquisitionSeries(payload, 'history');
  assert.equal(model.summary.month.value, 6);
  assert.equal(model.summary.previousMonth.value, 3);
  assert.equal(model.summary.previousMonth.partial, false);
  assert.equal(model.current.find(row => row.day === '2027-01-01').observed, 6);
  payload.asOf = '2028-03-02T00:10:00Z';
  payload.daily = [];
  model = acquisitionSeries(payload, 'history');
  assert.equal(model.current.find(row => row.day === '2026-11-01').observed, 52, 'expired direct counts do not become a false known zero');
  assert.equal(model.current.find(row => row.day === '2026-12-01').value, null);
  assert.equal(model.summary.history.partial, true);
});

test('unavailable data stays unknown and the embedded helpers have no module dependencies', () => {
  const payload = { asOf: '2026-11-10T18:00:00Z', coverage: {}, daily: [] };
  const model = acquisitionSeries(payload, 'history');
  assert.equal(model.total, null);
  assert.equal(model.summary.month.value, null);
  assert.doesNotMatch(acquisitionCard(model), /NaN|Infinity/);
  assert.match(acquisitionCard(model), /measurement-number">—<\/strong>/);
  const embeddedModel = new Function('return (' + acquisitionSeries.toString() + ')')()(fixture(), 'history');
  assert.equal(embeddedModel.total, 60);
  assert.equal(new Function('return (' + acquisitionCard.toString() + ')')()(embeddedModel), acquisitionCard(embeddedModel));
  assert.throws(() => acquisitionSeries(payload, 31), /7 or 30/);
  assert.throws(() => acquisitionSeries({ asOf: 'invalid' }), /Invalid/);
});
