# AVIATOR FOUNDATION RELEASE MANIFEST v1.0

The canonical foundation release definition separates automated engineering gates from mandatory real-money launch gates.

## Automated foundation gates
- Domain and simulator verification
- Application integration
- Provider contract validation
- Persistent/transactional provider ingestion
- Round concurrency protection
- Transactional settlement and payout idempotency
- Provider/internal/ledger reconciliation
- Exception-case workflow
- Operator authorization
- Append-only audit persistence
- Deterministic foundation acceptance test
- Production TypeScript build

## Mandatory production gates
1. Authorized SPRIBE commercial and technical integration.
2. Provider sandbox/certification completion.
3. Applicable licensing and market-access approval.
4. KYC/AML and responsible-gaming controls.
5. Approved payment and withdrawal infrastructure.
6. Production secret/key-management controls.
7. Security assessment and operational hardening.
8. Financial reconciliation, monitoring and incident procedures.

## Explicitly blocked
The foundation must not connect live SPRIBE endpoints, production payment processing, production player funds, or production credentials.

## Branch policy
aviator/foundation-v1 is the development/release-gate branch. main remains untouched until required review and approval is completed.

This manifest is an engineering gate, not evidence that licensing, provider authorization, certification, or market access has been obtained.
