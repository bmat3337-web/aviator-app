# PROVIDER SETTLEMENT TRANSACTION GATE

Provider settlement is processed as one database transaction.

- The bet row is locked with `FOR UPDATE`.
- A transaction-scoped advisory lock serializes settlement retries for the same provider bet.
- The ledger payout uses an account/idempotency uniqueness boundary.
- The bet settlement transition occurs only inside the same transaction.
- A previously settled bet returns `DUPLICATE` and does not create another payout.
- Database failure rolls back both ledger and bet changes.

Currency mapping is deliberately a deployment/application concern and must be bound to the authorized wallet/provider contract before real-money operation.
