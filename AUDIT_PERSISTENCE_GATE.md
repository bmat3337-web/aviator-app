# AUDIT PERSISTENCE GATE

Operator audit events have an append-only PostgreSQL persistence boundary.

- Audit event identity is unique.
- Replayed writes return DUPLICATE.
- Writes occur transactionally.
- Records preserve operator, action, case, request ID, timestamp and metadata.
- Application workflows never update or delete existing audit records.

Production deployment must additionally enforce database privileges so application identities cannot mutate historical audit rows.
