-- Transient write coordination only: no raw opted-in ID and no analytics use.
-- A deletion is acknowledged only after earlier KV writers have finished.
CREATE TABLE usage_write_leases (
  lease_id TEXT PRIMARY KEY,
  subject_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX usage_write_leases_subject ON usage_write_leases(subject_hash, expires_at);
CREATE INDEX usage_write_leases_expiry ON usage_write_leases(expires_at);
