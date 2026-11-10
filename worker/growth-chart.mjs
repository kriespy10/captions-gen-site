// Aggregate opted-in device records only. Anonymous boot pings are deliberately
// excluded: they cannot identify a returning device or a unique person.
export function audienceSummary(users, now = new Date(), activitySince = null) {
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
    total: records.length, newDaily, activeDaily, windows,
    activeToday: countActive(today, today, completeSince === null || completeSince > today),
    activeTodayEstimated: completeSince === null || completeSince > today,
    activeYesterday: completeSince !== null && completeSince <= iso(-1) ? countActive(iso(-1), iso(-1)) : null,
    active30: windows[30].active,
    previousActive30: windows[30].previousActive,
    active30Complete: windows[30].activeComplete
  };
}

// This function is also embedded into the dashboard. Keep it self-contained.
export function growthSeries(audience, metric = 'new', period = 30) {
  if (![7, 30].includes(Number(period))) throw new RangeError('Choose 7 or 30 days');
  if (!['new', 'active'].includes(metric)) throw new RangeError('Unknown growth metric');
  const days = Number(period);
  const today = audience.today;
  const midnight = Date.parse(today + 'T00:00:00Z');
  if (!Number.isFinite(midnight)) throw new TypeError('Invalid audience date');
  const iso = (offset) => new Date(midnight + offset * 86400000).toISOString().slice(0, 10);
  const source = metric === 'new' ? audience.newDaily : audience.activeDaily;
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
  const total = metric === 'new' ? sum(current) : window.active;
  const priorTotal = metric === 'new' ? sum(previous) : window.previousActive;
  const percent = priorTotal !== null && priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : null;
  return {
    metric, period: days, current, previous, total, priorTotal, percent,
    currentComplete: metric === 'new' || window.activeComplete,
    activitySince: audience.activitySince,
    empty: audience.total === 0,
    asOf: audience.asOf
  };
}

// SVG and a disclosure table provide the same daily numbers without a chart library.
// This function is embedded in the dashboard, so it must remain self-contained.
export function growthMarkup(model) {
  const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const number = (value) => Number(value).toLocaleString('en-US');
  const label = (day) => new Date(day + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const name = model.metric === 'new' ? 'new users' : 'active users';
  const previousText = model.priorTotal === null ? 'Previous period unavailable' : 'vs. ' + number(model.priorTotal) + ' last period';
  let badge;
  if (model.priorTotal === null) badge = '<span class="growth-change growth-building">Building activity history</span>';
  else if (model.priorTotal === 0) badge = '<span class="growth-change growth-neutral">' + (model.total > 0 ? 'First recorded activity' : 'No change yet') + '</span>';
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
  const dots = model.current.map((point, index) => point.value === null ? '' : '<circle class="growth-dot" cx="' + x(index).toFixed(2) + '" cy="' + y(point.value).toFixed(2) + '" r="3"><title>' + esc(label(point.day) + ': ' + number(point.value) + ' ' + name + (index === model.period - 1 ? ' (today, partial)' : '')) + '</title></circle>').join('');
  const range = label(model.current[0].day) + ' – ' + label(model.current[model.period - 1].day);
  const previousRange = label(model.previous[0].day) + ' – ' + label(model.previous[model.period - 1].day);
  const summary = number(model.total) + ' ' + name + ' from ' + range + '. ' + previousText + '. Today is partial. Dates are UTC.';
  let message = '';
  if (model.empty) message = 'Your first recorded users will appear here.';
  else if (model.metric === 'active' && !model.currentComplete) message = 'Activity history is being collected. The total is estimated from last activity; unrecorded chart days are left blank.';
  else if (model.total === 0) message = model.metric === 'new' ? 'No new measured users in this period.' : 'No recorded activity in this period.';
  else if (model.metric === 'new') message = 'Each new user is another editor trying what you made.';
  const rows = model.current.map((point, index) => '<tr><td>' + esc(label(point.day)) + (index === model.period - 1 ? ' (partial)' : '') + '</td><td>' + (point.value === null ? 'Not recorded' : number(point.value)) + '</td><td>' + esc(label(model.previous[index].day)) + '</td><td>' + (model.previous[index].value === null ? 'Not recorded' : number(model.previous[index].value)) + '</td></tr>').join('');
  return '<div class="growth-numbers" aria-live="polite"><div><div class="growth-value">' + number(model.total) +
    (model.currentComplete ? '' : '<span class="growth-partial">estimated</span>') + '</div><p class="growth-versus">' + esc(previousText) + '</p></div>' + badge + '</div>' +
    '<div class="growth-chart"><svg viewBox="0 0 640 214" role="img" aria-labelledby="growth-chart-title growth-chart-description">' +
    '<title id="growth-chart-title">' + esc(model.metric === 'new' ? 'New users by day' : 'Observed active users by day') + '</title><desc id="growth-chart-description">' + esc(summary) + '</desc>' +
    [0, 0.5, 1].map((fraction) => '<line class="growth-grid" x1="12" x2="628" y1="' + y(ceiling * fraction) + '" y2="' + y(ceiling * fraction) + '"/><text class="growth-axis-number" x="628" y="' + (y(ceiling * fraction) - 7) + '" text-anchor="end">' + number(ceiling * fraction) + '</text>').join('') +
    line(previousPath, 'growth-line growth-line-previous') + line(currentPath, 'growth-line growth-line-current') + dots +
    '</svg></div><div class="growth-dates"><span>' + esc(label(model.current[0].day)) + '</span><span>Today · partial · UTC</span></div>' +
    '<div class="growth-legend"><span><i class="growth-key growth-key-current"></i>' + esc(range) + '</span><span><i class="growth-key growth-key-previous"></i>' + esc(previousRange) + (hasPrevious ? '' : ' · not recorded') + '</span></div>' +
    (message ? '<p class="growth-message">' + esc(message) + '</p>' : '') +
    (!hasCurrent ? '<p class="growth-message">The daily line starts when activity recording begins.</p>' : '') +
    '<details class="growth-data"><summary>View daily numbers</summary><div class="growth-table-wrap"><table><caption>Current and previous ' + model.period + '-day periods. All dates UTC.</caption><thead><tr><th scope="col">Current date</th><th scope="col">Users</th><th scope="col">Previous date</th><th scope="col">Users</th></tr></thead><tbody>' + rows + '</tbody></table></div></details>';
}

export const GROWTH_STYLES = `
.growth-card{margin:28px 0 32px;padding:26px 26px 20px;background:#131116;border:1px solid #312a3c;border-radius:18px;box-shadow:0 12px 40px #0002}
.growth-top{display:flex;justify-content:space-between;align-items:start;gap:16px}.growth-eyebrow{margin:0 0 8px;color:#bba6d7;font-size:10px;font-weight:700;letter-spacing:.17em}.growth-card h2{margin:0;color:#f2edf7;font-size:19px;line-height:1.35;font-weight:550;letter-spacing:-.02em}
.growth-controls{display:flex;gap:10px;align-items:center;margin:24px 0 18px}.growth-controls label{display:flex;align-items:center;gap:8px}.growth-controls select{max-width:100%;padding:7px 30px 7px 10px;border:1px solid #39323f;border-radius:7px;background:#211b29;color:#ede7f4;font:inherit;font-size:13px;cursor:pointer}.growth-period{margin-left:auto}.growth-live{display:inline-flex;gap:5px;align-items:center;white-space:nowrap;color:#a19ba8;font-size:11px;margin-top:3px}.growth-live i{display:block;width:5px;height:5px;border-radius:50%;background:#bc9bf4}
.growth-numbers{display:flex;align-items:start;justify-content:space-between;gap:15px;min-height:90px}.growth-value{font-size:44px;line-height:1.05;font-weight:500;letter-spacing:-.045em;font-variant-numeric:tabular-nums;color:#fcfaff}.growth-partial{font-size:11px;margin-left:10px;letter-spacing:0;color:#b6aabd;font-weight:400}.growth-versus{margin:9px 0 0;font-size:13px;color:#a69aaa}.growth-change{margin-top:4px;display:inline-block;font-size:12px;padding:5px 9px;border-radius:6px;font-variant-numeric:tabular-nums;white-space:nowrap}.growth-up{color:#83d9ae;background:#12372b}.growth-down{color:#efb0c6;background:#3b2130}.growth-neutral,.growth-building{color:#c2b4d3;background:#282032}.growth-building{font-size:11px;white-space:normal;text-align:right}
.growth-chart{margin:14px -2px 0}.growth-chart svg{display:block;width:100%;height:auto;overflow:visible}.growth-grid{stroke:#302936;stroke-width:1;stroke-dasharray:3 5}.growth-axis-number{fill:#817689;font-size:10px}.growth-line{fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.growth-line-current{stroke:#b18aff}.growth-line-previous{stroke:#dc8ab9;stroke-width:1.8;opacity:.68}.growth-dot{fill:#b18aff;stroke:#131116;stroke-width:1.5;opacity:0;transition:opacity .12s}.growth-chart:hover .growth-dot{opacity:1}.growth-dates{display:flex;justify-content:space-between;gap:12px;color:#a396ad;font-size:11px;margin-top:-2px}.growth-legend{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:18px;color:#b7a9c0;font-size:11px}.growth-legend span{display:inline-flex;gap:7px;align-items:center}.growth-key{display:block;width:15px;height:2px;border-radius:2px}.growth-key-current{background:#b18aff}.growth-key-previous{background:#dc8ab9;opacity:.68}.growth-message{margin:16px 0 0;color:#b9adbf;font-size:12px;line-height:1.6}
.growth-coverage{margin:16px 0 0;color:#91849a;font-size:11px;line-height:1.65}.growth-data{margin-top:18px;font-size:11px;color:#a89cb2}.growth-data summary{cursor:pointer;width:fit-content}.growth-table-wrap{overflow-x:auto}.growth-data table{border-collapse:collapse;width:100%;margin-top:12px;text-align:left;white-space:nowrap;font-variant-numeric:tabular-nums}.growth-data caption{text-align:left;padding-bottom:10px;font-size:11px}.growth-data th,.growth-data td{padding:7px;border-bottom:1px solid #2c2433}.growth-data th{color:#c5b8d0;font-weight:500}
.growth-active{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 30px}.growth-stat{padding:18px 20px;background:#101012;border:1px solid #2b2930;border-radius:12px}.growth-stat h3{margin:0 0 10px;font-size:12px;color:#a89eaf;font-weight:500}.growth-stat strong{display:block;color:#eee8f3;font-size:28px;font-weight:500;line-height:1.2;font-variant-numeric:tabular-nums;letter-spacing:-.03em}.growth-stat p{font-size:11px;line-height:1.6;margin:8px 0 0;color:#928698}.growth-stat .growth-stat-change{color:#b8a9c5}.growth-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.growth-card select:focus-visible,.growth-data summary:focus-visible{outline:2px solid #c7a7ff;outline-offset:4px}.growth-card[hidden],.growth-active[hidden]{display:none}
@media(max-width:520px){.growth-card{padding:21px 18px 18px;margin-top:24px;border-radius:14px}.growth-card h2{font-size:17px}.growth-live{display:none}.growth-controls{gap:8px;margin-top:20px}.growth-controls select{font-size:12px;padding-left:8px}.growth-value{font-size:39px}.growth-change{font-size:11px}.growth-active{gap:9px}.growth-stat{padding:16px 14px}.growth-legend{gap:8px 14px}.growth-dates{font-size:10px}.growth-numbers{min-height:84px}}
@media(prefers-reduced-motion:reduce){.growth-dot{transition:none}}
`;
