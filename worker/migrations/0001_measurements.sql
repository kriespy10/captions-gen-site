-- No IP addresses, browser identifiers, email addresses or hardware identifiers.
-- Browser download estimates are aggregate counters controlled by date-only cookies.
CREATE TABLE measurement_meta (
  name TEXT PRIMARY KEY,
  started_at TEXT NOT NULL
);

CREATE TABLE measurement_daily (
  date TEXT PRIMARY KEY,
  download_requests INTEGER NOT NULL DEFAULT 0 CHECK(download_requests >= 0),
  download_browsers INTEGER NOT NULL DEFAULT 0 CHECK(download_browsers >= 0),
  installs INTEGER NOT NULL DEFAULT 0 CHECK(installs >= 0),
  expires_at INTEGER NOT NULL
);
CREATE INDEX measurement_daily_expiry ON measurement_daily(expires_at);

CREATE TABLE measurement_monthly (
  month TEXT PRIMARY KEY,
  download_requests INTEGER NOT NULL DEFAULT 0 CHECK(download_requests >= 0),
  download_browsers INTEGER NOT NULL DEFAULT 0 CHECK(download_browsers >= 0),
  installs INTEGER NOT NULL DEFAULT 0 CHECK(installs >= 0),
  expires_at INTEGER NOT NULL
);
CREATE INDEX measurement_monthly_expiry ON measurement_monthly(expires_at);

-- A random one-off receipt deduplicates a first-install event and its retries.
-- It is never joined to a usage ID. The receipt expires after 90 days.
CREATE TABLE installation_receipts (
  receipt_id TEXT PRIMARY KEY,
  occurred_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX installation_receipts_expiry ON installation_receipts(expires_at);

-- The trigger and receipt insert commit atomically; retries cannot increment twice.
CREATE TRIGGER installation_registered AFTER INSERT ON installation_receipts BEGIN
  INSERT INTO measurement_daily(date, installs, expires_at)
    VALUES(substr(NEW.occurred_at, 1, 10), 1, unixepoch(substr(NEW.occurred_at, 1, 10), '+400 days'))
    ON CONFLICT(date) DO UPDATE SET installs = installs + 1;
  INSERT INTO measurement_monthly(month, installs, expires_at)
    VALUES(substr(NEW.occurred_at, 1, 7), 1, unixepoch(substr(NEW.occurred_at, 1, 7) || '-01', '+400 days'))
    ON CONFLICT(month) DO UPDATE SET installs = installs + 1;
  INSERT OR IGNORE INTO measurement_meta(name, started_at) VALUES('installsSince', NEW.received_at);
END;

-- Only an existing opted-in usage ID may register sessions. No OS/version stored.
CREATE TABLE measured_sessions (
  session_id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  date TEXT NOT NULL,
  month TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX measured_sessions_subject ON measured_sessions(subject_id);
CREATE INDEX measured_sessions_date_subject ON measured_sessions(date, subject_id);
CREATE INDEX measured_sessions_month_subject ON measured_sessions(month, subject_id);
CREATE INDEX measured_sessions_expiry ON measured_sessions(expires_at);
