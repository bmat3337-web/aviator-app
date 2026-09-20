# Aviator Release Gates

## Foundation branch status

| Gate | Foundation | Production |
|---|---|---|
| Domain verification | Required automated check | Required |
| Application integration | Required automated check | Required |
| Provider validation | Required automated check | Required |
| Transactional ingestion | Required automated check | Required |
| Settlement idempotency | Required automated check | Required |
| Reconciliation | Required automated check | Required |
| Operator authorization | Required automated check | Required |
| Append-only audit | Required automated check | Required |
| Acceptance test | Required automated check | Required |
| Production build | Required automated check | Required |
| SPRIBE authorization | Not applicable yet | **BLOCKED** |
| Provider certification | Not applicable yet | **BLOCKED** |
| Licensing / market access | Not applicable yet | **BLOCKED** |
| KYC / AML | Not applicable yet | **BLOCKED** |
| Responsible gaming | Not applicable yet | **BLOCKED** |
| Payments | Not applicable yet | **BLOCKED** |
| Production secrets | Not applicable yet | **BLOCKED** |
| Security assessment | Not applicable yet | **BLOCKED** |
| Financial operations | Not applicable yet | **BLOCKED** |

## Evidence rule

A production gate may only move from BLOCKED after verifiable evidence is added to the release record. Code presence alone does not establish provider authorization, certification, licensing, payment approval, or regulatory market access.

## Prohibited state

The foundation branch must not be treated as a live-money release while any mandatory production gate remains BLOCKED.
