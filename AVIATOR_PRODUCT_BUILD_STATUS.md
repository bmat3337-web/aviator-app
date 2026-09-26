# AVIATOR — Product Build Status & Target Product

**Status:** CANONICAL PRODUCT STATUS DOCUMENT  
**Repository:** bmat3337-web/aviator-app  
**Latest inspected commit:** 4cf13809c61b59ed6cb75a8c80673ef65893711f  
**Product status:** Production foundation substantially built; production integration and external production gates remain outstanding.

## 1. Product definition

AVIATOR is being built as a **production-grade real-time aviation-themed multiplier gaming platform**.

It is **not a demo product**.

The deterministic simulator currently in the repository is a development and verification implementation. It exercises the domain, UI, provider boundary, realtime architecture, settlement foundation and release controls before authorized production provider and commercial infrastructure are connected.

The distinction is:

- **Current development implementation:** deterministic simulator / controlled provider substitute.
- **Target product:** authorized production provider + real-time game lifecycle + real player accounts + production wallet/payment infrastructure + production settlement + compliance + operations.

## 2. Built: product experience

The approved AVIATOR UI Canon v1.3 has been implemented and locked.

Implemented experience:

- AVIATOR header and product identity
- live flight cockpit
- aircraft
- trajectory
- atmospheric environment
- authoritative multiplier presentation
- flight-state presentation
- recent multiplier history
- Bet 1
- Bet 2
- Auto Bet
- Auto Cash Out
- stake controls
- stake presets
- contextual BET / CASH OUT actions
- secondary product modules
- primary bottom navigation

Canonical mobile hierarchy:

HEADER  
↓  
LIVE FLIGHT  
↓  
RECENT MULTIPLIERS  
↓  
BET 1  
↓  
BET 2  
↓  
SECONDARY INFORMATION / UTILITIES  
↓  
BOTTOM NAVIGATION

Bet 1 remains above Bet 2 on mobile. Live Flight, Bet 1 and Bet 2 form the primary cockpit.

## 3. Built: flight system

The flight presentation is aviation-first rather than a conventional financial chart.

Implemented:

- aircraft visual
- luminous trajectory
- multiplier
- atmospheric backgrounds
- horizon/depth treatment
- environment states
- state-driven presentation
- flight positioning
- responsive composition

The product flight lifecycle is:

WAITING → PREPARING → BETTING OPEN → FLYING → FLEW AWAY → ROUND ENDED → NEXT ROUND

Recent repository work has corrected duplicate aircraft/trajectory rendering, canonical bet-control composition, mobile bet-header geometry, bet-action markup and reference fidelity.

## 4. Built: Bet 1 / Bet 2

A reusable bet-card component supports independent Bet 1 and Bet 2 state.

Each position has:

- stake
- increment/decrement
- direct stake input
- presets
- Auto Bet
- Auto Cash Out
- Auto Cash Out threshold
- BET action
- CASH OUT action
- active state
- terminal state
- status presentation

Visual distinction:

- Bet 1 = gold
- Bet 2 = cyan

The domain model contains separate BET1 and BET2 slots.

## 5. Built: domain foundation

A deterministic simulator provides a reproducible development implementation containing:

- round lifecycle
- deterministic crash calculation
- round sequencing
- multiplier progression
- dual-slot bet state
- bet placement
- Auto Bet
- Auto Cash Out
- manual cash-out
- payout calculation
- crash handling
- settlement state

This simulator is **not the production provider**. It is a controlled implementation used to validate the platform foundation.

## 6. Built: provider boundary

The provider abstraction covers:

- provider connection
- round-event subscription
- bet placement
- cash-out
- provider bet receipts
- provider settlements
- provider round events

The intended production boundary is:

AVIATOR APPLICATION  
↓  
ProviderAdapter  
↓  
Authorized Production Provider

Provider-specific transport and authentication remain outside the core application domain.

## 7. Built: realtime foundation

Implemented:

- realtime flight session
- realtime flight projection
- provider realtime bridge
- event sequencing
- stale-stream detection
- authoritative snapshot resynchronization
- transport lifecycle
- event ingestion
- out-of-order protection

Recovery model:

STREAM STALE  
↓  
RESYNC REQUIRED  
↓  
AUTHORITATIVE SNAPSHOT  
↓  
RESYNC COMPLETE  
↓  
STREAM RESUMES

## 8. Built: provider event and settlement integrity

Transactional provider event storage includes:

- duplicate-event protection
- sequence-order protection
- provider-round locking
- transactional ingestion
- conflict protection
- rollback handling

Transactional provider settlement includes:

- bet-row locking
- duplicate settlement protection
- ledger idempotency
- payout recording
- bet settlement-state update
- transaction rollback handling

## 9. Built: financial-control foundation

Implemented:

- settlement reconciliation
- MATCHED detection
- MISSING detection
- MISMATCH detection
- DUPLICATE detection
- reconciliation cases
- operator authorization
- audit-event construction
- PostgreSQL audit storage

Settlement foundation:

Provider Settlement  
↓  
Validation  
↓  
Reconciliation  
↓  
Transactional Settlement  
↓  
Ledger Entry  
↓  
Bet State Update  
↓  
Audit / Operations

## 10. Built: persistence foundation

The PostgreSQL foundation includes structures for:

- rounds
- bets
- player association
- provider events
- idempotency
- ledger entries
- reconciliation cases
- audit events

The schema already establishes production-oriented constraints such as unique provider-round identifiers, Bet 1/Bet 2 slot constraints, positive stakes and ledger idempotency.

## 11. Built: release and evidence framework

Automated foundation gates include:

- domain verification
- application integration
- provider validation
- financial controls
- foundation acceptance
- production build

The repository intentionally prevents production readiness from being claimed before external evidence exists.

Current release model:

**FOUNDATION VERIFIED**

and:

**PRODUCTION BLOCKED**

## 12. Still required: production provider

Required:

- authorized provider agreement
- production authentication
- production event transport
- production round lifecycle
- production multiplier events
- production crash events
- production bet placement
- production cash-out
- provider receipts
- provider settlement feed
- provider certification
- production reconciliation

The existing ProviderAdapter is the integration boundary.

## 13. Still required: player accounts

Required:

- registration
- authentication
- player identity
- session management
- account security
- player-to-bet ownership
- player-to-wallet association
- device/session controls

The current demo balance must be replaced by authoritative player/account state.

## 14. Still required: production wallet

Required:

- player wallet
- balances
- deposits
- withdrawals
- transaction history
- ledger
- balance invariants
- idempotent financial operations
- reconciliation
- monitoring

The existing ledger and settlement foundation is the base for this layer.

## 15. Still required: payments

Required:

- approved payment provider(s)
- deposits
- withdrawals
- payment state machine
- payment reconciliation
- duplicate protection
- failed-payment handling
- refunds/chargebacks where applicable
- financial reporting

## 16. Still required: KYC / AML

Required according to applicable production markets:

- identity verification
- customer due diligence
- AML controls
- transaction-risk controls
- account restrictions
- compliance records
- compliance audit trail
- escalation procedures

## 17. Still required: responsible gaming

Required:

- responsible-gaming controls
- applicable player limits
- session controls
- applicable self-exclusion mechanisms
- responsible-gaming messaging
- intervention/risk controls
- operational procedures
- verification evidence

## 18. Still required: security and production secrets

Required:

- production credential management
- provider secrets
- payment credentials
- secure key storage
- secret rotation
- environment separation
- access control
- security assessment
- monitoring
- incident response

## 19. Still required: regulatory / market access

Required before commercial launch:

- jurisdiction assessment
- applicable licensing determination
- market-access approvals
- provider authorization
- compliance approval
- production operating procedures

Exact requirements depend on the jurisdictions in which AVIATOR is offered.

## 20. Still required: production operations

Required:

- production monitoring
- provider health monitoring
- realtime-stream monitoring
- settlement monitoring
- reconciliation queues
- exception handling
- incident management
- operator permissions
- audit review
- financial operations
- production reporting

The existing operator-control and audit foundation is the beginning of this layer.

## 21. Product modules that still need full implementation

### Challenges

Needs:

- challenge definitions
- progression
- eligibility
- rewards
- persistence
- anti-abuse controls

### Social

Needs:

- player identity
- social relationships
- activity/events
- privacy controls
- moderation
- reporting
- abuse prevention

### History

Needs:

- authoritative round history
- player bet history
- transaction history
- filtering
- pagination
- settlement records

### Wallet

Needs the complete production wallet and payment experience.

### Themes / Environments

The visual environment system exists.

It must ultimately be connected to authoritative product rules wherever environment changes are intended to be state-driven rather than presentation-only.

## 22. Target production architecture

AVIATOR CLIENT  
↓  
APPLICATION API  
↓  
┌─────────────────────────────┐  
│ Game Session                │  
│ Player / Wallet             │  
│ Product Services            │  
└─────────────────────────────┘  
↓  
DOMAIN SERVICES  
↓  
┌─────────────────────────────┐  
│ Provider Adapter            │  
│ Financial Controls          │  
└─────────────────────────────┘  
↓  
Production Provider / Ledger / Audit  
↓  
Realtime Projection  
↓  
AVIATOR CLIENT

The existing repository architecture is intended to evolve into this model without replacing the established domain/application/infrastructure separation.

## 23. Production sequence

### Foundation — substantially built

- product UI
- UI Canon
- flight cockpit
- Bet 1 / Bet 2
- deterministic domain
- provider contract
- realtime abstractions
- settlement foundation
- reconciliation
- audit
- release gates
- evidence framework

### Production provider

- authorization
- credentials
- live event stream
- round lifecycle
- bet placement
- cash-out
- settlement
- certification

### Player and wallet platform

- authentication
- accounts
- wallet
- ledger
- payments
- withdrawals
- financial reconciliation

### Compliance and operations

- KYC/AML
- responsible gaming
- regulatory controls
- security
- secrets
- monitoring
- operational tooling

### Full product ecosystem

- Challenges
- Social
- History
- Wallet
- progression
- settings
- notifications

### Production certification and launch

- external evidence
- provider certification
- security assessment
- compliance approval
- payment approval
- production credentials
- operational readiness
- controlled rollout

## 24. Current production gates

The repository currently defines nine mandatory production gates, intentionally blocked until independent evidence exists:

1. SPRIBE authorization
2. Provider certification
3. Regulatory market access
4. KYC/AML
5. Responsible gaming
6. Payments
7. Production secrets
8. Security assessment
9. Financial operations

These gates do not invalidate the engineering foundation. They prevent the foundation from being incorrectly represented as a commercially ready production platform.

## 25. Current build position

| Area | State |
|---|---|
| AVIATOR visual identity | BUILT |
| UI Canon v1.3 | APPROVED / LOCKED |
| Mobile cockpit | BUILT |
| Desktop composition | BUILT |
| Flight presentation | BUILT |
| Bet 1 | BUILT |
| Bet 2 | BUILT |
| Auto Bet foundation | BUILT |
| Auto Cash Out foundation | BUILT |
| Deterministic domain | BUILT |
| Provider abstraction | BUILT |
| Realtime foundation | BUILT |
| Realtime resync | BUILT |
| Provider event integrity | BUILT |
| Settlement transaction foundation | BUILT |
| Reconciliation | BUILT |
| Ledger foundation | BUILT |
| Operator controls | BUILT |
| Audit foundation | BUILT |
| Release/evidence framework | BUILT |
| Production provider | REQUIRED |
| Player accounts | REQUIRED |
| Production wallet | REQUIRED |
| Production payments | REQUIRED |
| KYC/AML | REQUIRED |
| Responsible gaming | REQUIRED |
| Security assessment | REQUIRED |
| Regulatory/market access | REQUIRED |
| Provider certification | REQUIRED |
| Production operations | REQUIRED |
| Full Challenges product | REQUIRED |
| Full Social product | REQUIRED |
| Full History product | REQUIRED |
| Full Wallet product | REQUIRED |

## 26. Definitive product statement

> **AVIATOR is a production-grade, real-time aviation-themed multiplier gaming platform built around a persistent glass cockpit where players manage two independent positions during a live flight, supported by authoritative provider events, deterministic application state, transactional settlement, financial controls, player accounts, wallet infrastructure, compliance, operations and a complete surrounding product ecosystem.**

The simulator is a development mechanism.

The UI Canon is the approved experience specification.

The domain/application/infrastructure work is the production foundation.

The remaining work is production integration, commercial infrastructure, compliance, operations, certification and completion of the surrounding product modules.

## 27. Canonical references

- UI Canon: `AVIATOR_UI_CANON_v1.3_IMPLEMENTATION.md`
- Environment system: `AVIATOR_ENVIRONMENT_SYSTEM.md`
- Release gates: `src/application/releaseManifest.ts`
- Release evidence: `src/application/releaseEvidence.ts`
- Provider contract: `src/application/providerAdapter.ts`
- Realtime bridge: `src/application/providerRealtimeBridge.ts`
- Settlement foundation: `src/infrastructure/transactionalProviderSettlement.ts`
- Provider event store: `src/infrastructure/transactionalProviderEvents.ts`
- Reconciliation: `src/application/reconciliation.ts`
- PostgreSQL schema: `src/infrastructure/postgresSchema.ts`

**Repository:** https://github.com/bmat3337-web/aviator-app
