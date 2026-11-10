// Keep first-engine-boot signals separate from the opted-in activity sample.
// Neither source identifies verified people; install signals have no device ID.
export function audienceSummary(users, now = new Date(), activitySince = null, installSignals = {}) {
  const dayMs = 86400000;
  const date = new Date(now);
  if (!Number.isFinite(date.getTime())) throw new TypeError('Invalid summary date');
  const today = date.toISOString().slice(0, 10);
  const midnight = Date.parse(today + 'T00:00:00Z');
  const iso = (offset) => new Date(midnight + offset * dayMs).toISOString().slice(0, 10);
  const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  const dayOf = (value) => {
    if (typeof value !== 'string') return null;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : null;
  };
  const startTimestamp = typeof activitySince === 'string' ? Date.parse(activitySince) : NaN;
  const activityStartedAt = Number.isFinite(startTimestamp) && startTimestamp <= date.getTime()
    ? new Date(startTimestamp).toISOString() : null;
  const collectionSince = activityStartedAt ? activityStartedAt.slice(0, 10) : null;
  // The deployment's first day only contains part of that day's activity.
  const completeSince = activityStartedAt
    ? new Date(Math.ceil(startTimestamp / dayMs) * dayMs).toISOString().slice(0, 10) : null;
  const installDaily = {};
  for (const [day, signals] of Object.entries(installSignals || {})) {
    const count = signals && signals.install;
    if (validDay(day) && day <= today && day >= iso(-399) && Number.isSafeInteger(count) && count >= 0) {
      installDaily[day] = count;
    }
  }
  const newDaily = {};
  const activeDaily = {};
  const records = users.filter((user) => user && typeof user === 'object');
  const observedDays = records.map((user) => {
    const firstSeen = dayOf(user.firstSeen);
    if (firstSeen && firstSeen <= today) newDaily[firstSeen] = (newDaily[firstSeen] || 0) + 1;
    const days = new Set();
    for (const [day, active] of Object.entries(user.activityDays || {})) {
      if (active && validDay(day) && day <= today && day >= iso(-399)) days.add(day);
    }
    // These legacy timestamps prove activity on these dates, but cannot fill in
    // the intervening days. We preserve the positive observations, not a history.
    for (const event of ['panel_open', 'transcribe', 'captions_placed']) {
      const day = dayOf((user.first || {})[event]);
      if (day && day <= today && day >= iso(-399)) days.add(day);
    }
    for (const day of days) activeDaily[day] = (activeDaily[day] || 0) + 1;
    return days;
  });
  const countActive = (start, end, estimate = false) => observedDays.filter((days, index) => {
    if ([...days].some((day) => day >= start && day <= end)) return true;
    const lastSeen = estimate ? dayOf(records[index].lastSeen) : null;
    return lastSeen !== null && lastSeen >= start && lastSeen <= end;
  }).length;
  const windows = {};
  for (const days of [7, 30]) {
    const currentStart = iso(-(days - 1));
    const previousStart = iso(-(days * 2 - 1));
    const previousEnd = iso(-days);
    const complete = completeSince !== null && completeSince <= previousStart;
    const currentComplete = completeSince !== null && completeSince <= currentStart;
    windows[days] = {
      active: countActive(currentStart, today, !currentComplete),
      previousActive: complete ? countActive(previousStart, previousEnd) : null,
      activeComplete: currentComplete,
      currentStart, previousStart, previousEnd
    };
  }
  return {
    asOf: date.toISOString(), today, activitySince: collectionSince, activityStartedAt, activityCompleteSince: completeSince,
    total: records.length, installDaily, newDaily, activeDaily, windows,
    activeToday: countActive(today, today, completeSince === null || completeSince > today),
    activeTodayEstimated: completeSince === null || completeSince > today,
    activeYesterday: completeSince !== null && completeSince <= iso(-1) ? countActive(iso(-1), iso(-1)) : null,
    active30: windows[30].active,
    previousActive30: windows[30].previousActive,
    active30Complete: windows[30].activeComplete
  };
}

// This function is also embedded into the dashboard. Keep it self-contained.
export function growthSeries(audience, metric = 'installs', period = 30) {
  if (![7, 30].includes(Number(period))) throw new RangeError('Choose 7 or 30 days');
  if (!['installs', 'active'].includes(metric)) throw new RangeError('Unknown growth metric');
  const days = Number(period);
  const today = audience.today;
  const midnight = Date.parse(today + 'T00:00:00Z');
  if (!Number.isFinite(midnight)) throw new TypeError('Invalid audience date');
  const iso = (offset) => new Date(midnight + offset * 86400000).toISOString().slice(0, 10);
  const source = metric === 'installs' ? audience.installDaily : audience.activeDaily;
  const value = (day) => {
    if (metric === 'active') {
      if (!audience.activitySince || day < audience.activitySince) return null;
      // Today's observations are visibly partial. Once that day is in the past,
      // the deployment's incomplete first day must remain a gap forever.
      if (day !== today && (!audience.activityCompleteSince || day < audience.activityCompleteSince)) return null;
    }
    return Math.max(0, Number((source || {})[day]) || 0);
  };
  const current = Array.from({ length: days }, (_, i) => ({ day: iso(i - days + 1), value: value(iso(i - days + 1)) }));
  const previous = Array.from({ length: days }, (_, i) => ({ day: iso(i - 2 * days + 1), value: value(iso(i - 2 * days + 1)) }));
  const window = audience.windows[days];
  const sum = (points) => points.reduce((total, point) => total + (point.value || 0), 0);
  const total = metric === 'installs' ? sum(current) : window.active;
  const priorTotal = metric === 'installs' ? sum(previous) : window.previousActive;
  const percent = priorTotal !== null && priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : null;
  return {
    metric, period: days, current, previous, total, priorTotal, percent,
    currentComplete: metric === 'installs' || window.activeComplete,
    activitySince: audience.activitySince,
    empty: metric === 'installs' ? Object.keys(audience.installDaily || {}).length === 0 : audience.total === 0,
    asOf: audience.asOf
  };
}

// SVG and a disclosure table provide the same daily numbers without a chart library.
// This function is embedded in the dashboard, so it must remain self-contained.
export function growthMarkup(model) {
  const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const number = (value) => value === null ? '—' : Number(value).toLocaleString('en-US');
  const label = (day) => new Date(day + 'T00:00:00Z').toLocaleDateString('en-GB', model.periodUnit === 'month'
    ? { month: 'short', year: 'numeric', timeZone: 'UTC' } : { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const name = model.name || (model.metric === 'installs' ? 'new installs' : 'active users in the stats sample');
  const unit = model.unit || (model.metric === 'installs' ? 'Installs' : 'Users (stats)');
  const chartId = model.chartId || 'measurement-chart';
  const measureLabel = model.measureLabel || (model.metric === 'installs' ? 'Recorded first app starts' : 'Users who allowed stats');
  const previousText = model.previousLabel || (model.priorTotal === null ? 'Previous period unavailable' : 'vs. ' + number(model.priorTotal) + ' last period');
  const autoTodayPartial = !model.snapshot && !model.completedDays && model.periodUnit !== 'month';
  let badge;
  if (model.waiting) badge = '<span class="growth-change growth-building">Awaiting plugin update</span>';
  else if (model.comparisonLabel) badge = '<span class="growth-change growth-building">' + esc(model.comparisonLabel) + '</span>';
  else if (model.priorTotal === null) badge = '<span class="growth-change growth-building">' + esc(model.historyLabel || 'Building activity history') + '</span>';
  else if (model.snapshot && !model.currentComplete && model.percent === null) badge = '<span class="growth-change growth-building">Partial snapshot · no growth rate</span>';
  else if (model.priorTotal === 0) badge = '<span class="growth-change growth-neutral">' + (model.total > 0 ? model.snapshot ? 'First recorded orders' : 'First recorded activity' : 'No change yet') + '</span>';
  else if (model.percent === null) badge = '<span class="growth-change growth-building">' + (model.snapshot ? 'Partial snapshot' : 'Incomplete estimate') + ' · no growth rate</span>';
  else {
    const positive = model.percent > 0;
    const negative = model.percent < 0;
    const percent = Math.abs(model.percent).toLocaleString('en-US', { maximumFractionDigits: 1 });
    badge = '<span class="growth-change ' + (positive ? 'growth-up' : negative ? 'growth-down' : 'growth-neutral') + '">' +
      (positive ? '↗ ' : negative ? '↘ ' : '') + percent + '%<span class="growth-sr"> compared with the previous period</span></span>';
  }
  const allValues = [...model.current, ...model.previous].map((point) => point.value).filter((value) => value !== null);
  const max = Math.max(1, ...allValues);
  const ceiling = max <= 4 ? Math.ceil(max) : Math.ceil(max / 4) * 4;
  const x = (index) => 12 + index * 616 / (model.period - 1);
  const y = (value) => 194 - value * 168 / ceiling;
  const pointPath = (points) => {
    let open = false;
    return points.map((point, index) => {
      if (point.value === null) { open = false; return ''; }
      const command = (open ? 'L' : 'M') + x(index).toFixed(2) + ' ' + y(point.value).toFixed(2);
      open = true;
      return command;
    }).join(' ');
  };
  const currentPath = pointPath(model.current);
  const previousPath = pointPath(model.previous);
  const hasCurrent = model.current.some((point) => point.value !== null);
  const hasPrevious = model.previous.some((point) => point.value !== null);
  const line = (path, className) => path ? '<path d="' + path + '" class="' + className + '"/>' : '';
  const lastPoint = model.current.reduce((last, point, index) => point.value === null ? last : index, -1);
  const dots = model.current.map((point, index) => point.value === null ? '' : '<circle class="growth-dot' + (index === lastPoint ? ' growth-dot-endpoint' : '') + '" cx="' + x(index).toFixed(2) + '" cy="' + y(point.value).toFixed(2) + '" r="3"><title>' + esc(label(point.day) + ': ' + number(point.value) + ' ' + name + (point.partial ? ' (' + (model.partialPointLabel || (model.snapshot ? 'partial snapshot' : 'partial')) + ')' : autoTodayPartial && index === model.period - 1 ? ' (today, partial)' : '')) + '</title></circle>').join('');
  const sourceSwitch = model.sourceSwitch;
  const switchMarker = sourceSwitch && Number.isInteger(sourceSwitch.index) && sourceSwitch.index >= 0 && sourceSwitch.index < model.current.length
    ? '<g class="growth-source-switch"><line x1="' + x(sourceSwitch.index).toFixed(2) + '" x2="' + x(sourceSwitch.index).toFixed(2) + '" y1="24" y2="194"/><text x="' + (x(sourceSwitch.index)+(sourceSwitch.index > (model.period-1)/2 ? -6 : 6)).toFixed(2) + '" y="17" text-anchor="' + (sourceSwitch.index > (model.period-1)/2 ? 'end' : 'start') + '">' + esc(sourceSwitch.label) + '</text></g>' : '';
  const range = label(model.current[0].day) + ' – ' + label(model.current[model.period - 1].day);
  const previousRange = label(model.previous[0].day) + ' – ' + label(model.previous[model.period - 1].day);
  const summary = number(model.total) + ' ' + name + ' from ' + range + '. ' + previousText + '. ' + (model.summarySuffix || (model.completedDays ? 'Completed UTC days. Dates are UTC.' : model.periodUnit === 'month' ? 'This month is partial. Dates are UTC.' : 'Today is partial. Dates are UTC.'));
  let message = '';
  if (model.coverageMessage) message = model.coverageMessage;
  else if (model.empty) message = model.metric === 'installs' ? 'Your first recorded app starts will appear here.' : 'Activity from users who allowed stats will appear here.';
  else if (model.metric === 'active' && !model.currentComplete) message = 'Activity history is being collected. The total is estimated from last activity; unrecorded chart days are left blank.';
  else if (model.total === 0) message = model.metric === 'installs' ? 'No first app starts recorded in this period.' : 'No recorded activity in this period.';
  else if (model.metric === 'installs') message = 'First app starts, counted when the engine runs for the first time.';
  const tableValue = (point) => point.value === null
    ? point.observed > 0 ? 'Incomplete (' + number(point.observed) + ' recorded)' : 'Not recorded'
    : number(point.value);
  const rows = model.current.map((point, index) => '<tr><td>' + esc(label(point.day)) + (point.partial || (autoTodayPartial && index === model.period - 1) ? ' (partial)' : '') + '</td><td>' + tableValue(point) + '</td>' + (model.previousHidden ? '' : '<td>' + esc(label(model.previous[index].day)) + '</td><td>' + tableValue(model.previous[index]) + '</td>') + '</tr>').join('');
  return '<div class="growth-numbers" aria-live="polite"><div><div class="growth-value">' + number(model.total) +
    (model.currentComplete || model.total === null ? '' : '<span class="growth-partial">' + esc(model.partialLabel || 'estimated') + '</span>') + '</div><p class="growth-measure">' + measureLabel + '</p><p class="growth-versus">' + esc(previousText) + '</p></div>' + badge + '</div>' +
    '<div class="growth-chart"><svg viewBox="0 0 640 214" role="img" aria-labelledby="' + esc(chartId) + '-title ' + esc(chartId) + '-description">' +
    '<title id="' + esc(chartId) + '-title">' + esc(model.title || (model.metric === 'installs' ? 'New installs by day' : 'Observed active users by day (stats sample)')) + '</title><desc id="' + esc(chartId) + '-description">' + esc(summary) + '</desc>' +
    [0, 0.5, 1].map((fraction) => '<line class="growth-grid" x1="12" x2="628" y1="' + y(ceiling * fraction) + '" y2="' + y(ceiling * fraction) + '"/><text class="growth-axis-number" x="628" y="' + (y(ceiling * fraction) - 7) + '" text-anchor="end">' + number(ceiling * fraction) + '</text>').join('') +
    line(previousPath, 'growth-line growth-line-previous') + line(currentPath, 'growth-line growth-line-current') + dots + switchMarker +
    '</svg></div><div class="growth-dates"><span>' + esc(label(model.current[0].day)) + '</span><span>' + esc(model.endLabel || 'Today · partial · UTC') + '</span></div>' +
    '<div class="growth-legend"><span><i class="growth-key growth-key-current"></i>' + esc(range) + '</span>' + (model.previousHidden ? '' : '<span><i class="growth-key growth-key-previous"></i>' + esc(previousRange) + (hasPrevious ? '' : ' · not recorded') + '</span>') + '</div>' +
    (message ? '<p class="growth-message">' + esc(message) + '</p>' : '') +
    (!hasCurrent ? '<p class="growth-message">' + esc(model.noDataMessage || 'The daily line starts when activity recording begins.') + '</p>' : '') +
    '<details class="growth-data"><summary>View ' + (model.periodUnit === 'month' ? 'monthly' : 'daily') + ' numbers</summary><div class="growth-table-wrap"><table><caption>' + esc(model.tableCaption || 'Current and previous ' + model.period + '-day periods. All dates UTC.') + '</caption><thead><tr><th scope="col">' + (model.periodUnit === 'month' ? 'Month' : 'Current date') + '</th><th scope="col">' + unit + '</th>' + (model.previousHidden ? '' : '<th scope="col">Previous date</th><th scope="col">' + unit + '</th>') + '</tr></thead><tbody>' + rows + '</tbody></table></div></details>';
}


// New measurements begin at their own coverage timestamp. Legacy counters are
// deliberately not used to backfill download, receipt or session history.
export function measurementSeries(payload, metric = 'downloadRequests', period = 30) {
  if (metric === 'lemonOrders') {
    if (period !== 'history' && ![7, 30].includes(Number(period))) throw new RangeError('Choose 7 or 30 days, or imported history');
    const now = new Date(payload.asOf);
    if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid measurement date');
    const imported = payload.lemonOrders || {};
    const coverage = imported.coverage || {};
    const validDay = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value;
    const validCount = value => Number.isSafeInteger(value) && value >= 0;
    const known = imported.ok === true && imported.available === true && imported.schema === 1 && coverage.complete === true &&
      validDay(coverage.from) && validDay(coverage.through) && coverage.from <= coverage.through &&
      Number.isFinite(Date.parse(imported.snapshotAt)) && validCount(imported.totalOrders) && Array.isArray(imported.daily) && Array.isArray(imported.monthly) &&
      imported.daily.every(row => row && validDay(row.date) && validCount(row.orders)) &&
      imported.monthly.every(row => row && /^\d{4}-(0[1-9]|1[0-2])$/.test(row.month) && validCount(row.orders));
    const completeThrough = known && validDay(coverage.completeThrough) && coverage.completeThrough <= coverage.through ? coverage.completeThrough : null;
    const today = now.toISOString().slice(0,10);
    const endDay = known ? completeThrough || coverage.through : today;
    const midnight = Date.parse(endDay + 'T00:00:00Z');
    const iso = offset => new Date(midnight + offset * 86400000).toISOString().slice(0,10);
    const daily = new Map((known ? imported.daily : []).map(row => [row.date, row.orders]));
    const point = day => {
      const covered = known && day >= coverage.from && day <= coverage.through;
      const count = daily.get(day);
      const observed = covered ? validCount(count) ? count : count === undefined ? 0 : null : null;
      return { day, value: observed, observed, partial: covered && (!completeThrough || day > completeThrough) };
    };
    const days = period === 'history' ? 30 : Number(period);
    let current = Array.from({length:days},(_,index) => point(iso(index-days+1)));
    let previous = Array.from({length:days},(_,index) => point(iso(index-2*days+1)));
    const sum = points => points.some(item => item.observed !== null)
      ? points.reduce((total,item) => total + (item.observed || 0),0) : null;
    let total = sum(current);
    let currentComplete = current.every(item => item.value !== null && !item.partial);
    let priorTotal = previous.every(item => item.value !== null && !item.partial) ? sum(previous) : null;
    let count = days;
    if (period === 'history') {
      const start = known ? new Date(coverage.from + 'T00:00:00Z') : now;
      const end = known ? new Date(coverage.through + 'T00:00:00Z') : now;
      count = Math.max(2,(end.getUTCFullYear()-start.getUTCFullYear())*12+end.getUTCMonth()-start.getUTCMonth()+1);
      const monthly = new Map((known ? imported.monthly : []).map(row => [row.month,row.orders]));
      const month = offset => new Date(Date.UTC(end.getUTCFullYear(),end.getUTCMonth()+offset,1)).toISOString().slice(0,10);
      current = Array.from({length:count},(_,index) => {
        const day = month(index-count+1), key = day.slice(0,7);
        const last = new Date(Date.UTC(Number(key.slice(0,4)),Number(key.slice(5,7)),0)).toISOString().slice(0,10);
        const covered = known && day <= coverage.through && last >= coverage.from;
        const value = monthly.get(key);
        const observed = covered ? validCount(value) ? value : value === undefined ? 0 : null : null;
        return {day,value:observed,observed,partial:covered && (day < coverage.from || !completeThrough || last > completeThrough)};
      });
      previous = Array.from({length:count},(_,index) => ({day:month(index-2*count+1),value:null,observed:null}));
      total = known ? imported.totalOrders : null;
      priorTotal = null;
      currentComplete = false;
    }
    const snapshot = known ? new Date(imported.snapshotAt).toISOString().replace('T',' ').replace(/\.\d{3}Z$/,' UTC') : null;
    const message = known
      ? 'Historical import · snapshot ' + snapshot + '. Distinct Lemon Squeezy checkouts, not installations, downloads or unique people. This is not a continuous sync. ' +
        (period !== 'history' && completeThrough ? 'Completed UTC days through ' + completeThrough + '; the partial export day is excluded. ' : 'The snapshot cutoff is partial. ') +
        'Dates outside ' + coverage.from + ' to ' + coverage.through + ' are unknown.'
      : imported.ok === true && imported.available === false ? 'No Lemon Squeezy order snapshot has been imported yet. No zero counts have been substituted.'
      : 'Lemon Squeezy order history is temporarily unavailable. No zero counts have been substituted.';
    return {metric,period:count,current,previous,total,priorTotal,currentComplete,waiting:false,snapshot:true,
      percent:currentComplete && priorTotal > 0 ? (total-priorTotal)/priorTotal*100 : null,
      partialLabel:'snapshot',empty:total===0,asOf:now.toISOString(),name:'Lemon Squeezy orders',unit:'Orders',
      measureLabel:period !== 'history' && completeThrough ? 'Distinct checkouts · completed UTC days' : 'Distinct checkouts in the imported snapshot',title:period === 'history' ? 'Imported Lemon Squeezy orders by month' : 'Imported Lemon Squeezy orders by day',
      historyLabel:'Historical snapshot',coverageMessage:message,noDataMessage:'No imported order counts cover this period.',
      periodUnit:period === 'history' ? 'month' : 'day',previousHidden:period === 'history',
      previousLabel:period === 'history' ? 'Imported lifetime history · snapshot only' : null,
      tableCaption:period === 'history' ? 'Imported calendar-month orders. Partial boundary months are marked. All dates UTC.' : completeThrough ? 'Current and previous ' + days + '-day periods ending ' + completeThrough + '. Completed UTC days only; the partial export day is excluded.' : null,
      summarySuffix:period !== 'history' && completeThrough ? 'Completed UTC days ending ' + completeThrough + '. Historical snapshot only.' : 'Historical snapshot only. The cutoff is partial. Dates are UTC.',
      endLabel:period === 'history' ? 'Snapshot month · partial · UTC' : completeThrough ? 'Completed UTC days through ' + completeThrough : known ? 'Snapshot day · partial · UTC' : 'Snapshot coverage unavailable'};
  }
  const config = {
    downloadRequests: { since: 'downloadsSince', name: 'download requests', unit: 'Requests', label: 'Tracked download requests', title: 'Download requests by day' },
    uniqueInstalls: { since: 'installsSince', name: 'install registrations', unit: 'Registrations', label: 'First starts from the updated plugin', title: 'New install registrations by day' },
    sessionCount: { since: 'sessionsSince', name: 'sessions in the stats sample', unit: 'Sessions', label: 'Sessions from users who allowed stats', title: 'Opt-in sessions by day' }
  }[metric];
  if (!config) throw new RangeError('Unknown measurement metric');
  if (![7, 30].includes(Number(period))) throw new RangeError('Choose 7 or 30 days');
  const days = Number(period);
  const now = new Date(payload.asOf);
  if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid measurement date');
  const today = now.toISOString().slice(0, 10);
  const midnight = Date.parse(today + 'T00:00:00Z');
  const iso = (offset) => new Date(midnight + offset * 86400000).toISOString().slice(0, 10);
  const coverage = payload.coverage || {};
  const waiting = metric !== 'downloadRequests' && coverage.clientUpdateRequired === true;
  const rawSince = coverage[config.since];
  const timestamp = typeof rawSince === 'string' ? Date.parse(rawSince) : NaN;
  const hasCoverage = !waiting && Number.isFinite(timestamp) && timestamp <= now.getTime();
  const startDay = hasCoverage ? new Date(timestamp).toISOString().slice(0, 10) : null;
  const completeSince = hasCoverage ? new Date(Math.ceil(timestamp / 86400000) * 86400000).toISOString().slice(0, 10) : null;
  const rows = new Map((Array.isArray(payload.daily) ? payload.daily : []).map(row => [row.date, row]));
  const observed = (day) => {
    if (!hasCoverage) return null;
    const row = rows.get(day);
    if (day < startDay && !row) return null;
    const value = row && row[metric];
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  };
  const value = (day) => !hasCoverage || day < startDay || (day !== today && completeSince && day < completeSince) ? null : observed(day);
  const point = (day) => ({ day, value: value(day), observed: observed(day) });
  const current = Array.from({ length: days }, (_, i) => point(iso(i - days + 1)));
  const previous = Array.from({ length: days }, (_, i) => point(iso(i - 2 * days + 1)));
  const recordedTotal = (points) => points.reduce((total, point) => total + (observed(point.day) || 0), 0);
  const total = hasCoverage ? recordedTotal(current) : null;
  const priorTotal = hasCoverage && completeSince <= previous[0].day ? recordedTotal(previous) : null;
  const currentComplete = hasCoverage && completeSince <= current[0].day;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const coverageMessage = payload.measurementsUnavailable ? 'Live measurements are temporarily unavailable. No zero counts have been substituted.' : waiting
    ? 'Awaiting the plugin update that sends these measurements. Earlier activity cannot be reconstructed.'
    : !hasCoverage ? 'No measurements recorded yet. Recording starts with the new download route; earlier history is unavailable.'
    : !currentComplete ? 'Recorded since ' + formatDate(rawSince) + '. Earlier activity is unavailable; incomplete past days stay blank on the chart.'
    : metric === 'downloadRequests' ? 'Requests can include repeats. Browser estimates are shown separately below; a request does not confirm a completed transfer.'
    : metric === 'uniqueInstalls' ? 'Counted once while the saved app data remains. This counts installations, not verified people.'
    : 'Sessions from users who allowed stats. This sample is not your total active audience.';
  return {
    metric, period: days, current, previous, total, priorTotal,
    percent: priorTotal !== null && priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : null,
    currentComplete, partialLabel: 'recorded', waiting, empty: hasCoverage && total === 0,
    asOf: now.toISOString(), name: config.name, unit: config.unit, measureLabel: config.label,
    title: config.title, historyLabel: 'Building measurement history', coverageMessage
  };
}

// Daily and calendar-month distincts come straight from separate API aggregates.
// In particular, monthly browser estimates and MAU must never sum daily uniques.
export function measurementCards(payload, period = 30, {includeOrders = true} = {}) {
  const esc = (value) => String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const coverage = payload.coverage || {};
  const now = new Date(payload.asOf);
  const today = now.toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const currentDay = (payload.daily || []).find(row => row.date === today) || {};
  const currentMonth = (payload.monthly || []).find(row => row.month === month) || {};
  const monthName = now.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  const yesterdayStart = Date.parse(today + 'T00:00:00Z') - 86400000;
  const yesterday = new Date(yesterdayStart).toISOString().slice(0,10);
  const previousDay = (payload.daily || []).find(row => row.date === yesterday) || {};
  const previousMonthStart = Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1);
  const previousMonthDate = new Date(previousMonthStart);
  const previousMonth = (payload.monthly || []).find(row => row.month === previousMonthDate.toISOString().slice(0,7)) || {};
  const previousMonthName = previousMonthDate.toLocaleDateString('en-GB', { month:'long',year:'numeric',timeZone:'UTC' });
  const valid = (value) => Number.isSafeInteger(value) && value >= 0;
  const hasCoverage = (key) => typeof coverage[key] === 'string' && Number.isFinite(Date.parse(coverage[key])) && Date.parse(coverage[key]) <= now.getTime();
  const count = (row, field, known) => !known || row[field] === null ? '—' : (valid(row[field]) ? row[field] : 0).toLocaleString('en-US');
  const downloadsKnown = hasCoverage('downloadsSince');
  const browsersKnown = coverage.browserCountingEnabled === true && hasCoverage('browserDownloadsSince');
  const waiting = coverage.clientUpdateRequired === true;
  const installsKnown = !waiting && hasCoverage('installsSince');
  const sessionsKnown = !waiting && hasCoverage('sessionsSince');
  const priorKnown = (key,known,start) => known && Date.parse(coverage[key]) <= start;
  const history = (key, known, isClient) => {
    if (payload.measurementsUnavailable) return 'Temporarily unavailable';
    if (isClient && waiting) return 'Awaiting plugin update';
    if (!known) return 'Not recorded yet';
    return 'Since ' + new Date(coverage[key]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  };
  const pair = (label, value) => '<div class="measurement-pair"><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>';
  const card = (step, title, value, label, rows, note, state) => '<section class="measurement-card" aria-labelledby="measurement-title-' + step + '"><div class="measurement-card-heading"><span>' + step + '</span><h3 id="measurement-title-' + step + '">' + title + '</h3></div><strong class="measurement-number">' + value + '</strong><p class="measurement-number-label">' + label + '</p><dl>' + rows + '</dl><p class="measurement-state">' + esc(state) + '</p><p class="measurement-note">' + note + '</p></section>';
  const downloadRows = pair('Requests today', count(currentDay, 'downloadRequests', downloadsKnown)) +
    pair('Browser estimate today', count(currentDay, 'uniqueDownloadBrowsers', browsersKnown)) +
    pair('Browser estimate in ' + monthName, count(currentMonth, 'uniqueDownloadBrowsers', browsersKnown)) +
    pair('Browser estimate · previous calendar month (' + previousMonthName + ')',
      count(previousMonth,'uniqueDownloadBrowsers',priorKnown('browserDownloadsSince',browsersKnown,previousMonthStart)));
  const installRows = pair('Registrations today', count(currentDay, 'uniqueInstalls', installsKnown)) +
    pair('Registrations · previous calendar month (' + previousMonthName + ')',
      count(previousMonth,'uniqueInstalls',priorKnown('installsSince',installsKnown,previousMonthStart)));
  const sessionRows = pair('Active today', count(currentDay, 'activeDevices', sessionsKnown)) +
    pair('Active yesterday',count(previousDay,'activeDevices',priorKnown('sessionsSince',sessionsKnown,yesterdayStart))) +
    pair('Sessions today', count(currentDay, 'sessionCount', sessionsKnown)) +
    pair('Sessions in ' + monthName, count(currentMonth, 'sessionCount', sessionsKnown)) +
    pair('Active users · previous calendar month (' + previousMonthName + ')',
      count(previousMonth,'activeDevices',priorKnown('sessionsSince',sessionsKnown,previousMonthStart)));
  const orders = payload.lemonOrders || {}, orderCoverage = orders.coverage || {};
  const dayValid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value;
  const ordersKnown = orders.ok === true && orders.available === true && orders.schema === 1 && orderCoverage.complete === true &&
    dayValid(orderCoverage.from) && dayValid(orderCoverage.through) && orderCoverage.from <= orderCoverage.through &&
    Number.isFinite(Date.parse(orders.snapshotAt)) && valid(orders.totalOrders) && Array.isArray(orders.daily) && Array.isArray(orders.monthly) &&
    orders.daily.every(row => row && dayValid(row.date) && valid(row.orders)) &&
    orders.monthly.every(row => row && /^\d{4}-(0[1-9]|1[0-2])$/.test(row.month) && valid(row.orders));
  const orderMonths = new Map((ordersKnown ? orders.monthly : []).map(row => [row.month,row.orders]));
  const monthStart = month + '-01';
  const priorMonth = previousMonthDate.toISOString().slice(0,7);
  const priorMonthEnd = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),0)).toISOString().slice(0,10);
  const priorOrdersKnown = ordersKnown && dayValid(orderCoverage.completeThrough) && orderCoverage.completeThrough <= orderCoverage.through && orderCoverage.from <= priorMonth + '-01' && orderCoverage.completeThrough >= priorMonthEnd;
  const currentOrdersKnown = ordersKnown && orderCoverage.from <= today && orderCoverage.through >= monthStart;
  const orderNumber = (value,known) => known && valid(value) ? value.toLocaleString('en-US') : '—';
  const days = period === 'history' ? null : Number(period) === 7 ? 7 : 30;
  const orderCompleteThrough = ordersKnown && dayValid(orderCoverage.completeThrough) && orderCoverage.completeThrough <= orderCoverage.through ? orderCoverage.completeThrough : null;
  const periodEnd = orderCompleteThrough || (ordersKnown ? orderCoverage.through : today);
  const start = days ? new Date(Date.parse(periodEnd + 'T00:00:00Z')-(days-1)*86400000).toISOString().slice(0,10) : null;
  const periodKnown = ordersKnown && (days === null || start <= orderCoverage.through && periodEnd >= orderCoverage.from);
  const periodComplete = periodKnown && (days === null || orderCompleteThrough && start >= orderCoverage.from && periodEnd <= orderCompleteThrough);
  const periodOrders = days === null ? orders.totalOrders : (ordersKnown ? orders.daily : [])
    .filter(row => row.date >= start && row.date <= periodEnd && row.date >= orderCoverage.from && row.date <= orderCoverage.through && valid(row.orders))
    .reduce((sum,row) => sum+row.orders,0);
  const orderRows = pair(days === null ? 'Imported history' : 'Orders · last ' + days + (orderCompleteThrough ? ' completed UTC days' : ' days (partial snapshot)') + (periodKnown && !periodComplete ? ' (partial coverage)' : ''),orderNumber(periodOrders,periodKnown)) +
    (days !== null && orderCompleteThrough ? pair('Completed-day window ends',orderCompleteThrough) : '') +
    pair('Orders in ' + monthName + ' (snapshot)',orderNumber(orderMonths.get(month) ?? 0,currentOrdersKnown)) +
    pair('Orders · previous calendar month (' + previousMonthName + ')',orderNumber(orderMonths.get(priorMonth) ?? 0,priorOrdersKnown));
  const orderState = ordersKnown ? 'Historical import · snapshot ' + new Date(orders.snapshotAt).toISOString().replace('T',' ').replace(/\.\d{3}Z$/,' UTC')
    : orders.ok === true && orders.available === false ? 'No order import yet' : 'Order history temporarily unavailable';
  return card('01', 'Downloads', count(currentMonth, 'downloadRequests', downloadsKnown), 'requests in ' + esc(monthName), downloadRows,
      'Browser estimates use date flags, not identities. Calendar-month estimates are counted separately from daily estimates.',
      history('downloadsSince', downloadsKnown, false) + (browsersKnown ? '' : ' · browser estimates ' + (coverage.browserCountingEnabled ? 'not recorded yet' : 'not enabled'))) +
    card('02', 'Install registrations', count(currentMonth, 'uniqueInstalls', installsKnown), 'new registrations in ' + esc(monthName), installRows,
      'Counted once while saved app data remains. A normal reinstall keeps the counted marker; clearing app data can create another. Not a count of people.',
      history('installsSince', installsKnown, true)) +
    card('03', 'Active use · stats sample', count(currentMonth, 'activeDevices', sessionsKnown), 'active users in ' + esc(monthName), sessionRows,
      'Sessions and active users include only people who allowed stats. Calendar-month active users are deduplicated across the month.',
      history('sessionsSince', sessionsKnown, true)) +
    (includeOrders ? card('04', 'Lemon Squeezy orders', orderNumber(orders.totalOrders,ordersKnown), 'orders in imported lifetime history',orderRows,
      'Distinct checkouts, not installations, downloads or unique people. Historical snapshot only; no continuous sync. The snapshot day/month is partial.',orderState) : '') +
    '<p class="measurement-method" style="grid-column:1/-1">This month is partial; previous month is a full calendar month. Today is partial; yesterday is a full UTC day.</p>';
}

export const GROWTH_STYLES = `
.growth-card{margin:28px 0 32px;padding:26px 26px 20px;background:#131116;border:1px solid #312a3c;border-radius:18px;box-shadow:0 12px 40px #0002}
.growth-top{display:flex;justify-content:space-between;align-items:start;gap:16px}.growth-eyebrow{margin:0 0 8px;color:#bba6d7;font-size:10px;font-weight:700;letter-spacing:.17em}.growth-card h2{margin:0;color:#f2edf7;font-size:19px;line-height:1.35;font-weight:550;letter-spacing:-.02em}
.growth-controls{display:flex;gap:10px;align-items:center;margin:24px 0 18px}.growth-controls label{display:flex;align-items:center;gap:8px}.growth-controls select{max-width:100%;padding:7px 30px 7px 10px;border:1px solid #39323f;border-radius:7px;background:#211b29;color:#ede7f4;font:inherit;font-size:13px;cursor:pointer}.growth-period{margin-left:auto}.growth-live{display:inline-flex;gap:5px;align-items:center;white-space:nowrap;color:#a19ba8;font-size:11px;margin-top:3px}.growth-live i{display:block;width:5px;height:5px;border-radius:50%;background:#bc9bf4}
.growth-numbers{display:flex;align-items:start;justify-content:space-between;gap:15px;min-height:90px}.growth-value{font-size:44px;line-height:1.05;font-weight:500;letter-spacing:-.045em;font-variant-numeric:tabular-nums;color:#fcfaff}.growth-partial{font-size:11px;margin-left:10px;letter-spacing:0;color:#b6aabd;font-weight:400}.growth-versus{margin:9px 0 0;font-size:13px;color:#a69aaa}.growth-change{margin-top:4px;display:inline-block;font-size:12px;padding:5px 9px;border-radius:6px;font-variant-numeric:tabular-nums;white-space:nowrap}.growth-up{color:#83d9ae;background:#12372b}.growth-down{color:#efb0c6;background:#3b2130}.growth-neutral,.growth-building{color:#c2b4d3;background:#282032}.growth-building{font-size:11px;white-space:normal;text-align:right}
.growth-measure{margin:7px 0 0;font-size:11px;color:#a89bb3}
.growth-chart{margin:14px -2px 0}.growth-chart svg{display:block;width:100%;height:auto;overflow:visible}.growth-grid{stroke:#302936;stroke-width:1;stroke-dasharray:3 5}.growth-axis-number{fill:#817689;font-size:10px}.growth-line{fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.growth-line-current{stroke:#b18aff}.growth-line-previous{stroke:#dc8ab9;stroke-width:1.8;opacity:.68}.growth-dot{fill:#b18aff;stroke:#131116;stroke-width:1.5;opacity:0;transition:opacity .12s}.growth-dot-endpoint,.growth-chart:hover .growth-dot{opacity:1}.growth-dates{display:flex;justify-content:space-between;gap:12px;color:#a396ad;font-size:11px;margin-top:-2px}.growth-legend{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:18px;color:#b7a9c0;font-size:11px}.growth-legend span{display:inline-flex;gap:7px;align-items:center}.growth-key{display:block;width:15px;height:2px;border-radius:2px}.growth-key-current{background:#b18aff}.growth-key-previous{background:#dc8ab9;opacity:.68}.growth-message{margin:16px 0 0;color:#b9adbf;font-size:12px;line-height:1.6}
.growth-source-switch line{stroke:#d9bc81;stroke-width:1;stroke-dasharray:4 4}.growth-source-switch text{fill:#d9bc81;font-size:10px}
.growth-coverage{margin:16px 0 0;color:#91849a;font-size:11px;line-height:1.65}.growth-data{margin-top:18px;font-size:11px;color:#a89cb2}.growth-data summary{cursor:pointer;width:fit-content}.growth-table-wrap{overflow-x:auto}.growth-data table{border-collapse:collapse;width:100%;margin-top:12px;text-align:left;white-space:nowrap;font-variant-numeric:tabular-nums}.growth-data caption{text-align:left;padding-bottom:10px;font-size:11px}.growth-data th,.growth-data td{padding:7px;border-bottom:1px solid #2c2433}.growth-data th{color:#c5b8d0;font-weight:500}
.growth-active{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 30px}.growth-stat{padding:18px 20px;background:#101012;border:1px solid #2b2930;border-radius:12px}.growth-stat h3{margin:0 0 10px;font-size:12px;color:#a89eaf;font-weight:500}.growth-stat strong{display:block;color:#eee8f3;font-size:28px;font-weight:500;line-height:1.2;font-variant-numeric:tabular-nums;letter-spacing:-.03em}.growth-stat p{font-size:11px;line-height:1.6;margin:8px 0 0;color:#928698}.growth-stat .growth-stat-change{color:#b8a9c5}.growth-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.growth-card select:focus-visible,.growth-data summary:focus-visible{outline:2px solid #c7a7ff;outline-offset:4px}.growth-card[hidden],.growth-active[hidden]{display:none}
@media(max-width:520px){.growth-card{padding:21px 18px 18px;margin-top:24px;border-radius:14px}.growth-card h2{font-size:17px}.growth-live{display:none}.growth-controls{gap:8px;margin-top:20px}.growth-controls select{font-size:12px;padding-left:8px}.growth-value{font-size:39px}.growth-change{font-size:11px}.growth-active{gap:9px}.growth-stat{padding:16px 14px}.growth-legend{gap:8px 14px}.growth-dates{font-size:10px}.growth-numbers{min-height:84px}}
.measurement-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 26px}.measurement-card{padding:19px 16px;background:#111014;border:1px solid #302938;border-radius:13px;min-width:0}.measurement-card-heading{display:flex;align-items:center;gap:8px;margin-bottom:20px}.measurement-card-heading>span{color:#9b80b6;font-size:10px;font-variant-numeric:tabular-nums}.measurement-card h3{font-size:12px;font-weight:550;margin:0;color:#d7cddd}.measurement-number{font-size:34px;font-weight:500;line-height:1.1;letter-spacing:-.035em;font-variant-numeric:tabular-nums}.measurement-number-label{color:#a999b5;font-size:11px;margin:7px 0 20px}.measurement-card dl{margin:0}.measurement-pair{display:flex;justify-content:space-between;gap:10px;margin:9px 0;font-size:11px}.measurement-pair dt{color:#a79bae}.measurement-pair dd{margin:0;color:#e9e0ef;font-variant-numeric:tabular-nums;text-align:right}.measurement-state{font-size:10px;color:#b6a0c8;border-top:1px solid #302738;margin:16px 0 9px;padding-top:12px}.measurement-note{font-size:10px;line-height:1.65;color:#95899e;margin:0}.measurement-error{padding:20px;border:1px solid #3b2c43;border-radius:12px;color:#c1b1cc}.measurement-method{font-size:11px;color:#a89ab2;line-height:1.7}.legacy-measurements{margin:30px 0;color:#a99bb4}.legacy-measurements>summary{cursor:pointer;color:#c2b2ce;font-size:13px}.legacy-measurements .growth-card{margin-top:18px}.legacy-measurements .growth-active{margin-top:18px}
@media(max-width:650px){.measurement-cards{grid-template-columns:1fr}.measurement-card{padding:20px}.measurement-card-heading{margin-bottom:14px}.measurement-card dl{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}.measurement-card .measurement-note{max-width:60ch}.measurement-number{font-size:31px}}
@media(max-width:520px){.growth-controls{flex-wrap:wrap}.growth-controls label{min-width:0;max-width:100%}.growth-period{margin-left:0}}
@media(prefers-reduced-motion:reduce){.growth-dot{transition:none}}
`;
