# PROVIDER EVENT INGESTION GATE

Provider events enter the application only after schema validation.

- Duplicate round events are suppressed by provider round + sequence + event type.
- Non-monotonic round sequences are rejected as out-of-order.
- Settlement processing is idempotency-aware by provider bet ID.
- Invalid provider payloads are rejected before domain processing.
- The ingestion layer is provider-agnostic and works with the simulator.
- Production SPRIBE transport remains blocked until authorized technical documentation and credentials exist.

This layer does not decide financial truth; settlement must still pass the authoritative ledger and reconciliation controls.
