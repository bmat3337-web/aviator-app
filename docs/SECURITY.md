# Security and Integrity Requirements

- Never trust client-provided round outcomes.
- Never settle a bet from UI state.
- Use idempotency keys for bet, cash-out, settlement and reward operations.
- Maintain immutable domain events and auditable financial mutations.
- Separate challenge scoring from wallet settlement.
- Rate-limit chat and betting commands.
- Reconcile wallet invariants after settlement batches.
- Treat reconnects as state-recovery operations, not new bets.
- Never store secrets in source control.
- Do not represent a third-party proprietary API as known unless verified from public documentation or observed authorized integration data.
