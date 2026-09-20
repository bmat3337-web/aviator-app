# OPERATOR CONTROL & AUDIT GATE

Reconciliation exceptions now have an authorization and audit boundary.

- VIEWER: inspect cases.
- OPERATOR: acknowledge cases and request controlled corrections.
- APPROVER: resolve cases.

Every state-changing action requires operator ID and request/correlation ID and produces an immutable audit-event contract. Financial corrections require a separate controlled workflow; resolving a case does not itself authorize a ledger mutation.
