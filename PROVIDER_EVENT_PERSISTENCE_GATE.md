# PROVIDER EVENT PERSISTENCE GATE

Provider event idempotency has a PostgreSQL persistence boundary.

- Event keys survive process restarts when backed by PostgreSQL.
- Database uniqueness and conflict-safe inserts suppress duplicates.
- Settlement duplicate detection resolves against persisted bet state.
- In-memory ingestion remains available for deterministic development tests.
- Persistence does not authorize payouts; authoritative ledger and reconciliation remain required.
