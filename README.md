# Aviator Reference Architecture v1

Clean-room research/reference implementation specification for an Aviator-style crash-game system.

## Scope
- Round lifecycle and deterministic state machine
- Betting and cash-out lifecycle
- Provably-fair verification as a separately testable module
- Realtime event contracts
- Challenge/Mission/Race/Tournament architecture
- Leaderboards, rewards, wallet settlement and idempotency
- Statistical analysis and simulation

This repository is a reference architecture. It does not contain SPRIBE proprietary source code, private APIs, credentials, or claims of access to proprietary implementation details.

## Design principle
The client renders state. The authoritative server owns outcomes, bet acceptance, cash-out validation, settlement, challenge progress and rewards.

See docs/ARCHITECTURE.md and docs/REVERSE_ENGINEERING_MATRIX.md.
