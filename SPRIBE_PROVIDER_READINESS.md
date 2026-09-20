# SPRIBE PROVIDER READINESS SPRINT v1.0

## Objective

Convert the completed foundation into an evidence-driven readiness package for an authorized SPRIBE integration.

## Required provider inputs

1. Commercial/operator authorization
2. API and authentication contract
3. Sandbox credentials and endpoint details
4. Round/event transport and ordering guarantees
5. Bet placement semantics
6. Cash-out semantics
7. Settlement/callback semantics
8. Retry and idempotency guarantees
9. Currency and stake limits
10. Wallet/debit-credit model
11. Reconciliation requirements
12. Certification procedure
13. Production credential issuance process
14. Required operational/support contacts

## Mapping to existing foundation

| Provider input | Existing boundary |
|---|---|
| Authentication | ProviderAdapter.connect |
| Round events | subscribeRoundEvents / provider ingestion |
| Event ordering | transactional provider event store |
| Bet placement | ProviderAdapter.placeBet |
| Cash-out | ProviderAdapter.cashOut |
| Settlement | transactional provider settlement |
| Retry/idempotency | event and settlement idempotency |
| Wallet semantics | ledger / transactional wallet boundaries |
| Reconciliation | reconciliation service and cases |
| Certification | production release gate |

## Evidence rule

No adapter implementation may infer undocumented SPRIBE semantics. Missing provider information remains a blocking readiness item.

## Current status

SPRIBE integration is **PENDING PROVIDER INPUTS**.

The simulator remains the only development provider until authorized documentation and sandbox access are available.
