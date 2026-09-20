# Aviator Release Evidence Protocol v1.0

## Objective
Ensure every production gate has independently traceable evidence before its status can change.

## Evidence lifecycle

PENDING
→ SUBMITTED
→ VERIFIED
→ ACCEPTED

A rejected or expired item returns to PENDING.

## Required evidence fields

- gate ID
- evidence kind
- unique reference
- description
- verification status
- verification timestamp
- verifier identity or system
- scope/jurisdiction where applicable
- expiry/review date where applicable

## Source hierarchy

1. Primary provider documentation or executed authorization
2. Regulator/licensing authority record
3. Approved payment/KYC/compliance provider evidence
4. Security assessment or independently generated technical artifact
5. Automated repository test/build evidence

Secondary commentary is not sufficient to establish a production authorization gate.

## Separation rule

Engineering tests can establish software behavior. They cannot establish external commercial authorization, licensing, certification, payment approval, or market access.

## Current foundation state

Foundation engineering evidence is represented in the repository.

External production evidence remains pending. No production gate may be promoted merely because an implementation exists.

## Change control

Any future promotion from BLOCKED requires:
- the corresponding evidence artifact;
- verification against its source;
- an auditable repository change;
- passing release-policy tests.
