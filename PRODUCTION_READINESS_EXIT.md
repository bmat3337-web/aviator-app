# Aviator Production Readiness Exit Criteria v1.0

## Purpose

Define the exact conditions required before the foundation can be considered eligible for a controlled production-release review.

## Exit criteria

Every mandatory production gate must have:

- authoritative evidence;
- correct jurisdiction/provider scope;
- current verification and review dates;
- recorded provenance;
- independent verification;
- required approval/separation of duties;
- passing automated release-policy checks;
- corresponding operational documentation where applicable.

## Mandatory gates

1. SPRIBE commercial and technical authorization
2. Provider sandbox certification
3. Applicable licensing and market-access approval
4. KYC/AML implementation and verification
5. Responsible-gaming implementation and verification
6. Approved payment/deposit/withdrawal infrastructure
7. Production secrets and key-management controls
8. Security assessment and remediation evidence
9. Financial reconciliation, monitoring and incident controls

## Non-negotiable rule

A successful software build does not satisfy an external production gate. No live-money capability may be enabled merely because automated tests pass.

## Current status

**NOT READY FOR PRODUCTION REVIEW**

The repository remains in foundation/provider/regulatory readiness development. External production evidence is not yet present in the release evidence registry.
