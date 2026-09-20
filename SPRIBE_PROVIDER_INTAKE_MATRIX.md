# SPRIBE Provider Intake & Evidence Matrix v1.0

## Intake rule

Populate this matrix only from authoritative SPRIBE/provider materials or executed commercial/technical documentation. Do not infer missing semantics.

| ID | Required input | Evidence expected | Architecture mapping | Status |
|---|---|---|---|---|
| P01 | Commercial authorization | Executed authorization/agreement | Release gate | PENDING |
| P02 | API/authentication | Provider API specification | ProviderAdapter.connect | PENDING |
| P03 | Sandbox | Sandbox endpoint + credentials process | Simulator replacement gate | PENDING |
| P04 | Round events | Event schema + transport | subscribeRoundEvents | PENDING |
| P05 | Ordering | Sequence/order guarantees | Provider ingestion | PENDING |
| P06 | Bet placement | Request/response contract | placeBet | PENDING |
| P07 | Cash-out | Cash-out contract | cashOut | PENDING |
| P08 | Settlement | Settlement/callback contract | transactional settlement | PENDING |
| P09 | Retry/idempotency | Retry semantics + unique identifiers | idempotency/concurrency | PENDING |
| P10 | Currency/stakes | Supported currencies and limits | wallet/risk | PENDING |
| P11 | Wallet model | Debit/credit and balance semantics | ledger | PENDING |
| P12 | Reconciliation | Provider reconciliation procedure | reconciliation | PENDING |
| P13 | Certification | Sandbox certification criteria | production gate | PENDING |
| P14 | Production credentials | Issuance/rotation requirements | secrets management | PENDING |
| P15 | Operational support | Escalation/SLA/contact model | operations | PENDING |

## Acceptance rule

An item can move from PENDING only after authoritative evidence is received, reviewed, and recorded in the release evidence system.

A provider response that does not specify a required behavior remains unresolved.

## Current state

**SPRIBE PROVIDER INPUTS: PENDING**

The existing simulator and provider abstraction remain the only development path until the provider contract is available.
