# SPRIBE Contract Fixture Template v1.0

This template is intentionally non-authoritative. It provides the structure required to translate the actual SPRIBE technical package into executable contract tests once received.

## Required sections

### Authentication
- Endpoint:
- Authentication mechanism:
- Credential rotation:
- Sandbox credentials:

### Round events
- Transport:
- Event types:
- Round identifier:
- Sequence/order guarantee:
- Timestamp semantics:

### Bet placement
- Request schema:
- Response schema:
- Provider bet identifier:
- Accepted/rejected semantics:
- Stake limits:

### Cash-out
- Request schema:
- Provider bet identifier:
- Accepted/rejected semantics:
- Race/concurrency semantics:

### Settlement
- Callback/event schema:
- Outcome values:
- Payout representation:
- Retry semantics:
- Idempotency key:

### Wallet
- Debit timing:
- Credit timing:
- Currency representation:
- Balance source of truth:

### Reconciliation
- Provider report format:
- Reporting cadence:
- Required identifiers:
- Exception procedure:

### Certification
- Sandbox test suite:
- Certification criteria:
- Production approval process:

## Evidence rule

Do not populate these fields from assumptions, reverse engineering, public screenshots, or simulator behavior. Populate only from authoritative provider material and record the source in the release evidence system.

**Status: TEMPLATE ONLY — NOT A SPRIBE CONTRACT.**
