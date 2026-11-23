export const LIVE_DOWNLOADS_MARKUP = `
<section id="live-downloads" class="growth-card live-downloads" aria-labelledby="live-download-title" hidden>
  <div class="live-download-header">
    <h2 id="live-download-title">Live downloads</h2>
    <button id="live-download-toggle" type="button">Pause updates</button>
  </div>
  <dl class="live-download-counts">
    <div class="live-download-today">
      <dt>Today · UTC</dt>
      <dd>
        <strong><span id="live-download-today" class="growth-sr">—</span><span id="live-download-today-digits" aria-hidden="true">—</span></strong>
        <span id="live-download-change" role="status"></span>
      </dd>
    </div>
    <div>
      <dt>This month</dt>
      <dd><strong><span id="live-download-month" class="growth-sr">—</span><span id="live-download-month-digits" aria-hidden="true">—</span></strong></dd>
    </div>
  </dl>
  <div class="live-download-footer">
    <p>Windows installer requests</p>
    <p><span id="live-download-status" role="status">Connecting…</span><time id="live-download-checked" hidden></time></p>
  </div>
</section>`;

export const LIVE_DOWNLOADS_STYLES = `
.live-downloads { margin-bottom: 20px; }
.live-download-header, .live-download-footer {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px;
}
.live-download-header button {
  background: #211b29; border: 1px solid #51445d; color: #f2edf7; font-size: 12px;
}
.live-download-header button:focus-visible { outline: 2px solid #c7a7ff; outline-offset: 4px; }
.live-download-counts {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 18px 0;
}
.live-download-counts > div { border: 1px solid #312a3c; border-radius: 12px; padding: 12px 14px; }
.live-download-counts > .live-download-today { background: #20182b; border-color: #59416d; }
.live-download-counts dt { color: #cfc0dc; font-size: 13px; }
.live-download-counts dd { margin: 4px 0 0; }
.live-download-counts strong {
  display: block; color: #fcfaff; font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 600;
  font-variant-numeric: tabular-nums; line-height: 1.1; letter-spacing: -.045em;
  overflow-wrap: anywhere;
}
.live-digit { display: inline-grid; position: relative; overflow: hidden; vertical-align: top; height: 1.1em; }
.live-digit-in, .live-digit-out { animation: 400ms cubic-bezier(.22, .68, .24, 1) both; }
.live-digit-in { animation-name: live-digit-enter; }
.live-digit-out { position: absolute; inset: 0; animation-name: live-digit-leave; }
@keyframes live-digit-enter { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes live-digit-leave { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@media (prefers-reduced-motion: reduce) {
  .live-digit-in { animation: none; }
  .live-digit-out { display: none; }
}
#live-download-change { display: block; min-height: 1.5em; color: #9ee5b9; font-size: 13px; }
.live-download-footer p { margin: 0; color: #bcb0c9; font-size: 12px; }
#live-download-checked::before { content: ' · '; }
.live-downloads[data-connection="live"] #live-download-status { color: #9ee5b9; }
@media (max-width: 420px) {
  .live-download-counts { gap: 8px; }
  .live-download-counts > div { padding: 10px; }
}`;

// Serialized into the dashboard HTML, so this function owns its dependencies.
export function startLiveDownloads(token) {
  const panel = document.getElementById('live-downloads');
  if (!panel.hidden) return;

  const today = document.getElementById('live-download-today');
  const todayDigits = document.getElementById('live-download-today-digits');
  const month = document.getElementById('live-download-month');
  const monthDigits = document.getElementById('live-download-month-digits');
  const change = document.getElementById('live-download-change');
  const status = document.getElementById('live-download-status');
  const checked = document.getElementById('live-download-checked');
  const toggle = document.getElementById('live-download-toggle');
  const format = new Intl.NumberFormat('en-US');
  const interval = 10000;
  let previous = null;
  let timer;
  let pending = false;
  let paused = false;
  let signedOut = false;

  function setStatus(connection, message) {
    panel.dataset.connection = connection;
    if (status.textContent !== message) status.textContent = message;
  }

  function renderCount(label, digits, count, roll) {
    const next = format.format(count);
    const last = label.textContent;
    if (next === last) return;
    label.textContent = next;
    if (!roll) {
      digits.textContent = next;
      return;
    }

    const priorDigits = last.padStart(next.length);
    const columns = Array.from(next, (character, index) => {
      const prior = priorDigits[index];
      if (character === prior || character === ',') return character;

      const column = document.createElement('span');
      column.className = 'live-digit';
      const entering = document.createElement('span');
      entering.className = 'live-digit-in';
      entering.textContent = character;
      column.append(entering);
      if (prior >= '0' && prior <= '9') {
        const leaving = document.createElement('span');
        leaving.className = 'live-digit-out';
        leaving.textContent = prior;
        column.append(leaving);
      }
      return column;
    });
    digits.replaceChildren(...columns);
  }

  async function refresh() {
    if (pending || paused || signedOut || document.hidden) return;
    pending = true;
    try {
      const response = await fetch('/api/live-downloads', {
        headers: { authorization: 'Bearer ' + token },
        signal: AbortSignal.timeout(8000),
      });
      if (response.status === 401) {
        signedOut = true;
        toggle.hidden = true;
        setStatus('signed-out', 'Reload to sign in');
        return;
      }
      if (!response.ok) throw new Error('Download counts unavailable');
      const counts = await response.json();
      if (paused || document.hidden) return;
      const increase = previous?.date === counts.date ? counts.today - previous.today : 0;
      renderCount(today, todayDigits, counts.today, increase > 0);
      const monthIncreased = previous?.month === counts.month && counts.monthToDate > previous.monthToDate;
      renderCount(month, monthDigits, counts.monthToDate, monthIncreased);
      change.textContent = increase > 0 ? '+' + format.format(increase) + ' since last check' : '';
      checked.dateTime = counts.asOf;
      checked.textContent = 'Checked ' + counts.asOf.slice(11, 19) + ' UTC';
      checked.hidden = false;
      previous = counts;
      setStatus('live', 'Updates every 10 seconds');
    } catch {
      if (!paused && !document.hidden) setStatus('retrying', 'Reconnecting…');
    } finally {
      pending = false;
      if (!paused && !signedOut && !document.hidden) timer = setTimeout(refresh, interval);
    }
  }

  toggle.onclick = () => {
    paused = !paused;
    toggle.textContent = paused ? 'Resume updates' : 'Pause updates';
    clearTimeout(timer);
    if (paused) setStatus('paused', 'Updates paused');
    else {
      setStatus('connecting', 'Checking…');
      refresh();
    }
  };
  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    if (!document.hidden) refresh();
  });

  panel.hidden = false;
  refresh();
}
