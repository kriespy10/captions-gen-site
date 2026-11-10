-- Suppress delayed opt-in events after deletion without retaining the raw usage ID.
-- This SHA-256 marker expires after 90 days and is never used for measurement.
CREATE TABLE usage_revocations (
  subject_hash TEXT PRIMARY KEY,
  revoked_at TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX usage_revocations_expiry ON usage_revocations(expires_at);
