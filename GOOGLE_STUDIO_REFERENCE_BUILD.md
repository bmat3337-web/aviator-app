# AVIATOR Google Studio Reference Build

## Status

**REFERENCE BUILD — SUCCESSFUL**

The Google Studio Aviator prototype is retained as a UX and interaction reference for the canonical Aviator project.

It is not the production source of truth.

## Reference authority

The prototype is used to validate:

- Flight-first visual hierarchy
- Dominant multiplier presentation
- Aircraft and trajectory composition
- Multiplier history strip
- Dual Bet 1 / Bet 2 presentation
- Auto Bet and Auto Cash Out presentation
- Mobile navigation treatment
- Dark / charcoal / champagne-gold visual language
- Responsive information density
- Flight-state presentation

## Canonical engineering boundary

The production implementation remains:

`bmat3337-web/aviator-app` → `aviator/foundation-v1`

The reference prototype must not be copied into production where doing so would bypass:

- provider abstraction
- authoritative provider outcomes
- application boundaries
- financial controls
- auditability
- regulatory gates
- security controls

## Acceptance rule

A production UI change may use the reference prototype for visual and interaction comparison, but production behavior remains governed by the canonical application/domain contracts.

## Real-money boundary

The reference prototype does not authorize:

- real-money play
- payment processing
- wallet settlement
- SPRIBE production integration
- regulatory launch
- KYC/AML operation

Those remain independently gated.
