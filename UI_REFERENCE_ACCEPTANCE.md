# AVIATOR UI Reference Acceptance

## Purpose

Provide a low-cost acceptance checklist before consuming Vercel deployment resources.

## Flight surface

- [x] Flight is the dominant surface.
- [x] Multiplier is the dominant numeric element.
- [x] Aircraft and trajectory are visible.
- [x] Multiplier history is visible.
- [x] Bet 1 and Bet 2 are simultaneously represented.
- [x] Auto Bet and Auto Cash Out are separately represented.
- [x] Mobile navigation exposes Flight, Challenge, Social, History and Profile.
- [x] Premium dark/gold visual language is preserved.

## State behavior

- [x] Round state is displayed.
- [x] Bet state is displayed per slot.
- [x] Place Bet and Cash Out are restricted to valid simulator states.
- [x] Non-actionable controls are disabled.
- [x] Provider outcomes remain outside the presentation layer.

## Verification rule

UI edits are batched. Do not use Vercel as the edit/repair loop.

Required sequence:

**CHANGE → VERIFY → CLEAR → DEPLOY**

A Vercel deployment is cleared only after the consolidated change has verification evidence.

## Reference relationship

Google Studio is the successful UX reference. GitHub is the canonical engineering destination. The reference may inform presentation and interaction decisions but does not override domain, provider, financial, security or regulatory controls.
