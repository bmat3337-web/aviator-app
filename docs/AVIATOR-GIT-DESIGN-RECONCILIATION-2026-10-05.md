# AVIATOR — Git / Design Reconciliation Record

**Date:** 2026-10-05  
**Repository:** bmat3337-web/aviator-app  
**Default branch:** main

## Git baseline verified

At reconciliation start, the repository default branch was:

- **HEAD:** `4d1ef2425a317a9647f17b82b3379b577ab0350b`
- **Commit:** `Fix Aviator UI JSX structure after build verification`
- **Repository:** `bmat3337-web/aviator-app`

This establishes the implementation snapshot against which the design-system document was recorded.

## Design authority recorded

The reconciled design baseline was added as:

`docs/AVIATOR-RECONCILED-DESIGN-SYSTEM-v1.0.md`

Commit:

`363b9b11246b0c61e3168f690a06caddcee9f4dc`

Commit message:

`docs: add reconciled Aviator design system v1.0`

## Reconciliation intent

This commit records the **design authority** without claiming that the current UI implementation already satisfies every requirement.

The design baseline explicitly governs future UI work and review.

### Mandatory reconciliation targets

1. **Mobile-first architecture**
   - Mobile is the master information architecture.
   - Desktop expands rather than defines the experience.

2. **No-neon visual language**
   - Remove neon cyan/magenta treatment.
   - Remove rainbow history treatments.
   - Remove decorative glow and LED-style borders.

3. **HAKKA material language**
   - Near-black / gunmetal surfaces.
   - Gold primary identity.
   - Silver/gunmetal Bet 2 identity.
   - Crimson reserved primarily for flight atmosphere and critical live state.

4. **Unified BetCard**
   - Bet 1 and Bet 2 must be the same component structure.
   - No visual regression where Bet 2 becomes a separate bespoke card.

5. **Compactness**
   - Bet cards remain approximately 25% shorter than the earlier oversized design.
   - Density is achieved through spacing, alignment, consolidation, and removal of redundant content—not illegible typography.

6. **Duplication control**
   - One authoritative flight scene.
   - No duplicated multiplier, aircraft, round state, balance, betting controls, or navigation.
   - Reused responsive representations must share component/data sources.

7. **Core hierarchy**
   - Flight → multiplier/state → recent multipliers → Bet 1 → Bet 2.
   - Secondary information remains secondary.

8. **Semantic color**
   - Color communicates identity or state.
   - Color is not decorative.

9. **No nested gameplay scrolling**
   - The cockpit remains part of one continuous document.

10. **Design tokens**
    - Colors, spacing, typography, radius, elevation, motion, breakpoints, and component dimensions must be centrally tokenized.

## Scope boundary

This reconciliation is documentation-only.

It does **not**:
- alter backend/game/provider contracts;
- introduce production financial functionality;
- replace the FUN MODE boundary;
- import IGAMI branding;
- replace production engineering architecture;
- declare visual compliance without implementation verification.

## Next implementation gate

Before treating the UI as conformant, compare the actual implementation against:

`docs/AVIATOR-RECONCILED-DESIGN-SYSTEM-v1.0.md`

The implementation should then be audited specifically for:
- color-token compliance;
- neon removal;
- Bet 1 / Bet 2 component parity;
- mobile-first hierarchy;
- compactness;
- duplication;
- responsive behavior;
- nested scrolling;
- tokenization.

**Status: DESIGN AUTHORITY RECORDED — IMPLEMENTATION CONFORMANCE NOT YET CERTIFIED.**
