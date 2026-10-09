# Aviator UI — Version 2 (Locked)

**Status:** LOCKED — visual reference  
**Project:** `aviator-app`  
**Repository:** https://github.com/bmat3337-web/aviator-app  
**Baseline branch:** `main`  
**Baseline commit:** `e358ca2c9a5ab8f7ae13d95773e66ba3891e4399`  
**Documentation branch:** `ui/v2-locked`  
**Version:** `2.0.0`  
**Locked:** 2026-10-09  
**Scope:** UI reference and change-control record only. This document does not claim that the mockup has been implemented in application source.

## 1. Purpose

This document records the user-approved Aviator mobile UI Version 2 as the canonical visual target for future implementation and visual QA. The exact user-supplied image is the authority for visual appearance.

## 2. Locked image

**Canonical reference filename:** `docs/ui/assets/AVIATOR-UI-V2-LOCKED.jpg`

The locked source image is the image supplied by the user in the conversation on 2026-10-09 (the reference displaying the Aviator header, live-round bar, flight graph, recent rounds, stacked BET 1 and BET 2 panels, taller green action buttons, and bottom navigation).

**Asset verification:** The repository image asset must be present at the path above before this document can be considered fully reconciled with the image. Do not substitute a regenerated mockup or claim that a generated approximation is the user-approved source image.

## 3. Locked structure

1. Header: AVIATOR branding, wallet balance/add-funds control, menu.
2. Round status: players, round identifier, LIVE indicator, elapsed timer.
3. Flight scene: atmospheric cloudscape, aircraft, one rising gold trajectory, central multiplier, different but subtle left/right graph scales/treatments.
4. Recent rounds: compact horizontal multiplier history.
5. Unified gold-framed betting area.
6. BET 1 and BET 2 are vertically stacked and structurally identical.
7. Each bet section is identified by a compact position pill attached to the left side of its gold separator.
8. Each section contains stake controls, Auto Bet, Auto Cash Out, preset rails, and a full-width green primary action.
9. Bottom navigation: Play, Challenges, Social, History, Wallet.

## 4. Locked visual properties

- Preserve the supplied reference's composition, dimensions/proportions, typography, colors, spacing, borders, controls, graph treatment, trajectory, multiplier placement, and navigation.
- Preserve the taller green PLACE BET buttons in both betting sections.
- Preserve the shared cockpit border and separator pills.
- Do not redesign, add decorative elements, change the atmosphere, rearrange controls, or perform unsolicited visual polish.
- Do not use a different regenerated image as the locked source.

## 5. Functional state-color contract

State determines semantic color; position does not. Bet 1 and Bet 2 must use the same state mapping.

| State | Semantic color | Required meaning |
|---|---|---|
| `READY` | Green | Position is ready to place a bet |
| `PLACING` | Subdued green | Bet submission is in progress |
| `ACTIVE` | Gold | Bet is active during a live round |
| `PROCESSING` | Subdued gold | Cash-out processing is in progress |
| `CASHED_OUT` | Green | Successful cash-out |
| `CRASHED` | Red | Position lost on crash |
| `LOST` | Red | Losing terminal state |

This is a functional requirement, not permission to alter the locked reference's appearance beyond the necessary state-dependent behavior. Do not assign permanent gold to Bet 1 or silver to Bet 2. Labels and action text must identify state; color must not be the only indicator.

## 6. Change control

**No change to locked visual elements without explicit user authorization.**

For any future authorized modification:
1. Record the exact requested change.
2. Make only that change.
3. Compare the result against the locked image.
4. Verify relevant behavior and responsive layout.
5. Record the changed files, commit SHA, and verification results.
6. Do not claim source implementation, tests, or runtime verification unless actually performed.

## 7. Git reconciliation

This documentation is intended to be committed on `ui/v2-locked`, based on `main` at `e358ca2c9a5ab8f7ae13d95773e66ba3891e4399`. The application source is not modified by this design-lock record.

### Acceptance checklist

- [x] Approved layout and change-control requirements documented.
- [x] State-color contract documented.
- [ ] Exact user-supplied locked image committed at `docs/ui/assets/AVIATOR-UI-V2-LOCKED.jpg`.
- [ ] Git branch and commit verified after documentation and image asset are committed.
- [ ] Visual implementation compared against the locked image.

**Current limitation:** Do not mark the image-asset and implementation-verification checklist items complete until they have been independently verified.
