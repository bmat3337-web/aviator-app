# AVIATOR FOUNDATION RELEASE GATES

A foundation build may advance only when these gates are satisfied.

## Automated
- Domain simulator verification passes.
- Application integration verification passes.
- Financial invariant verification passes.
- Provider contract verification passes.
- TypeScript production build passes.

## Architecture
- Client cannot authorize wallet state.
- Ledger entries are append-only.
- Bet settlement is idempotent.
- Provider events are validated before entering the domain.
- Provider access is isolated behind an adapter.
- Real-money credentials are absent from source control.

## Production blockers
- No SPRIBE production adapter without authorized documentation/credentials.
- No payment production connection without approved provider and compliance review.
- No real-money launch without licensing, KYC/AML, responsible-gaming, security, reconciliation and certification gates.
