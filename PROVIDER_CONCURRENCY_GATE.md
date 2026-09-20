# PROVIDER CONCURRENCY GATE

Provider callbacks for the same round are serialized within PostgreSQL using a transaction-scoped advisory lock keyed by provider round ID.

1. Acquire round-scoped transaction lock.
2. Check duplicate event identity.
3. Read latest persisted sequence.
4. Reject non-monotonic events.
5. Insert with a conflict-safe uniqueness guard.
6. Commit atomically.

The lock releases automatically on commit or rollback. Deployment still requires PostgreSQL operational validation and load testing against the actual callback concurrency profile.
