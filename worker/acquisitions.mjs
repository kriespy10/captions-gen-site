// A continuing distribution estimate across the move away from Lemon checkout.
// Each UTC day uses one source. Browser-days are not unique people across days.
// Self-contained because these functions are also serialized into the dashboard.
export function acquisitionSeries(payload, period = 30) {
  if (period !== 'history' && ![7, 30].includes(Number(period))) throw new RangeError('Choose 7 or 30 completed days, or history');
  const now = new Date(payload.asOf);
  if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid measurement date');
  const DAY = 86400000;
  const cutover = '2026-11-10';
  const today = now.toISOString().slice(0, 10);
  const midnight = Date.parse(today + 'T00:00:00Z');
  const iso = offset => new Date(midnight + offset * DAY).toISOString().slice(0, 10);
  const validDay = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  const validCount = value => Number.isSafeInteger(value) && value >= 0;
  const orders = payload.lemonOrders || {};
  const oldCoverage = orders.coverage || {};
  const oldKnown = orders.ok === true && orders.available === true && orders.schema === 1 && oldCoverage.complete === true &&
    validDay(oldCoverage.from) && validDay(oldCoverage.through) && oldCoverage.from <= oldCoverage.through &&
    validDay(oldCoverage.completeThrough) && oldCoverage.completeThrough <= oldCoverage.through &&
    Array.isArray(orders.daily) && orders.daily.every(row => row && validDay(row.date) && validCount(row.orders));
  const coverage = payload.coverage || {};
  const started = typeof coverage.browserDownloadsSince === 'string' ? Date.parse(coverage.browserDownloadsSince) : NaN;
  const liveKnown = payload.measurementsUnavailable !== true && coverage.browserCountingEnabled === true &&
    Number.isFinite(started) && started <= now.getTime() && Array.isArray(payload.daily);
  const liveSince = liveKnown ? new Date(started).toISOString().slice(0, 10) : null;
  const completeSince = liveKnown ? new Date(Math.ceil(started / DAY) * DAY).toISOString().slice(0, 10) : null;
  // D1 deletes daily rows at the start of their 400th following day. Its original
  // coverage timestamp does not turn those expired rows back into known zeros.
  const retainedSince = iso(-399);
  const oldDaily = new Map((oldKnown ? orders.daily : []).map(row => [row.date, row.orders]));
  const newDaily = new Map((liveKnown ? payload.daily : []).filter(row => row && validDay(row.date)).map(row => [row.date, row.uniqueDownloadBrowsers]));
  const point = day => {
    const source = day < cutover ? 'orders' : 'browsers';
    let observed = null, partial = false;
    if (day <= today && source === 'orders' && oldKnown && day >= oldCoverage.from && day <= oldCoverage.completeThrough) {
      observed = oldDaily.get(day) ?? 0;
    } else if (day <= today && source === 'browsers' && liveKnown && day >= liveSince && day >= retainedSince) {
      const count = newDaily.get(day);
      observed = count === undefined ? 0 : validCount(count) ? count : null;
      partial = observed !== null && (day < completeSince || day === today);
    }
    return { day, observed, value: partial && day !== today ? null : observed, partial, source };
  };
  const range = (from, through) => {
    const rows = [];
    for (let at = Date.parse(from + 'T00:00:00Z'), end = Date.parse(through + 'T00:00:00Z'); at <= end; at += DAY)
      rows.push(point(new Date(at).toISOString().slice(0, 10)));
    return rows;
  };
  const sum = rows => rows.some(row => row.observed !== null) ? rows.reduce((total, row) => total + (row.observed ?? 0), 0) : null;
  const complete = rows => rows.length > 0 && rows.every(row => row.value !== null && !row.partial);
  const aggregate = rows => ({ value: sum(rows), partial: !complete(rows) });
  const monthStart = today.slice(0, 7) + '-01';
  const previousMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
  const previousMonthEnd = new Date(Date.parse(monthStart + 'T00:00:00Z') - DAY).toISOString().slice(0, 10);
  const starts = [oldKnown && oldCoverage.from < cutover ? oldCoverage.from : null,
    liveKnown ? [cutover, liveSince, retainedSince].sort().at(-1) : null].filter(day => day && day <= today);
  const from = starts.sort()[0] || monthStart;
  const allRows = range(from, today);
  const summary = {
    today: aggregate([point(today)]), month: aggregate(range(monthStart, today)),
    previousMonth: aggregate(range(previousMonthStart, previousMonthEnd)), history: aggregate(allRows),
    monthName: now.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' }),
    previousMonthName: new Date(previousMonthStart).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    cutover, ordersAvailable: oldKnown, browsersAvailable: liveKnown,
    browserSince: liveKnown ? new Date(started).toISOString() : null
  };
  const days = period === 'history' ? null : Number(period);
  let current, previous;
  if (days) {
    current = range(iso(-days), iso(-1));
    previous = range(iso(-2 * days), iso(-days - 1));
  } else {
    const first = new Date(from + 'T00:00:00Z');
    const months = Math.max(2, (now.getUTCFullYear() - first.getUTCFullYear()) * 12 + now.getUTCMonth() - first.getUTCMonth() + 1);
    const month = offset => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1)).toISOString().slice(0, 10);
    current = Array.from({ length: months }, (_, index) => {
      const day = month(index - months + 1);
      const next = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)), 1));
      const end = [new Date(next.getTime() - DAY).toISOString().slice(0, 10), today].sort()[0];
      const rows = range(day, end);
      const value = sum(rows);
      return { day, value, observed: value, partial: !complete(rows), source: day < cutover.slice(0, 7) + '-01' ? 'orders' : day > cutover ? 'browsers' : 'mixed' };
    });
    previous = current.map(row => ({ day: row.day, value: null, observed: null, partial: false }));
  }
  const total = days ? sum(current) : summary.history.value;
  const currentComplete = days ? complete(current) : !summary.history.partial;
  const priorTotal = days && complete(previous) ? sum(previous) : null;
  const methods = new Set([...current, ...previous].filter(row => row.observed !== null).map(row => row.source));
  const sourceChanged = days !== null && methods.size > 1;
  const percent = days && currentComplete && priorTotal > 0 && !sourceChanged ? (total - priorTotal) / priorTotal * 100 : null;
  const comparisonLabel = !days ? 'Recorded history · estimate' : sourceChanged ? 'Counting method changed' :
    !currentComplete || priorTotal === null ? 'Incomplete comparison' : null;
  const marker = current.findIndex(row => days ? row.day === cutover : row.day.slice(0, 7) === cutover.slice(0, 7));
  const sourceNote = 'Before 10 Nov 2026: Lemon Squeezy orders. From 10 Nov: daily downloading-browser estimates. ' +
    'A returning browser can count again on another day; totals sum daily estimates, not unique people or confirmed installs. ' +
    'The methods and channels changed, so cross-switch growth rates are not compared.';
  const availability = !oldKnown ? ' Earlier order history is unavailable.' : '';
  const liveStatus = !liveKnown ? ' Direct-download browser estimates are unavailable.' :
    ' Browser recording began ' + new Date(started).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC') + '; its first partial day stays partial.';
  return {
    metric: 'acquisitions', name: 'acquisition signals', unit: 'Daily estimates', period: current.length,
    periodUnit: days ? 'day' : 'month', current, previous, total, priorTotal, percent, currentComplete,
    waiting: false, empty: total === 0, snapshot: false, completedDays: !!days, asOf: now.toISOString(),
    partialLabel: 'recorded estimate', partialPointLabel: 'partial coverage', comparisonLabel,
    measureLabel: days ? 'Sum of daily acquisition estimates · completed UTC days' : 'Sum of recorded daily acquisition estimates',
    title: days ? 'Acquisition estimate by day' : 'Acquisition estimate by month',
    previousHidden: !days, previousLabel: days ? null : 'Old checkout history + direct downloads going forward',
    historyLabel: 'Combined recorded history', coverageMessage: sourceNote + availability + liveStatus,
    noDataMessage: 'No acquisition counts cover this period. Unknown dates remain blank.',
    endLabel: days ? 'Completed UTC days through ' + iso(-1) : 'This month · partial · UTC',
    summarySuffix: days ? 'Completed UTC days only. Counts are acquisition estimates; source methods changed on 10 Nov 2026.' : 'Monthly sums of daily acquisition estimates. This month and partial coverage are marked. Dates UTC.',
    tableCaption: days ? 'Current and previous ' + days + '-day periods ending ' + iso(-1) + '. Partial or unknown dates do not establish a growth rate.' :
      'Calendar-month sums of the same daily acquisition estimates. These are not calendar-month distinct browsers. Partial months are marked.',
    sourceSwitch: marker < 0 ? null : { index: marker, label: 'Direct downloads · 10 Nov' }, summary
  };
}

export function acquisitionCard(model) {
  const esc = value => String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const summary = model.summary;
  const number = item => item.value === null ? '—' : item.value.toLocaleString('en-US');
  const row = (label, item) => '<div class="measurement-pair"><dt>' + esc(label) + (item.partial && item.value !== null ? ' (partial)' : '') + '</dt><dd>' + number(item) + '</dd></div>';
  return '<section class="measurement-card" aria-labelledby="acquisition-title"><div class="measurement-card-heading"><span>GROWTH</span><h3 id="acquisition-title">Acquisition estimate</h3></div>' +
    '<strong class="measurement-number">' + number(summary.month) + '</strong><p class="measurement-number-label">sum of daily estimates in ' + esc(summary.monthName) + '</p><dl>' +
    row('Today', summary.today) + row('Previous month (' + summary.previousMonthName + ')', summary.previousMonth) + row('Recorded history', summary.history) + '</dl>' +
    '<p class="measurement-state">Old checkouts before 10 Nov · direct downloads from 10 Nov</p><p class="measurement-note">A continuing estimate across the switch. Returning browsers can count again on another day. Monthly distinct browser estimates are shown separately in Downloads. ' +
    (summary.month.partial ? 'This month has partial coverage. ' : '') + 'Installs and active users keep their own counts.</p></section>';
}
