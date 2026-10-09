# Aviator Next.js + Floot UI Reconciliation — 2026-10-09

## Decision
Update the existing Next.js application with the approved Floot cockpit presentation. Do not migrate the entire application to Vite, and do not modify `main` or merge this branch without explicit authorization.

## Branch baseline
- Base branch: `arch/psa-nextjs-alignment`
- Work branch: `feat/nextjs-floot-ui-reconciliation-2026-10-09`
- Framework: Next.js 15.5.x, React 19, TypeScript
- Next.js entry: `app/page.tsx`
- Existing cockpit: `src/ui/AviatorProductionApp.tsx`
- Existing styles: `src/ui/aviator.css`

## Implemented in this cycle
- Bound the aircraft position and trajectory to one normalized multiplier progress value.
- Replaced the fixed full-length curve with a progressive cubic Bézier trajectory ending at the aircraft position.
- Added a restrained crimson gradient area under the trajectory.
- Preserved the existing provider/domain integration and the existing Next.js application entry point.

## Verification evidence
- GitHub source re-fetched after the commit.
- Confirmed the updated file contains normalized aircraft coordinates, dynamic trajectory generation, and the gradient area.
- Confirmed the prior hard-coded full trajectory is removed.
- No local TypeScript build, test suite, browser QA, or Vercel deployment was executed as part of this cycle. These remain required before promotion.

## Outstanding verification
1. Confirm Vercel preview detects Next.js on this branch.
2. Run `npm run build` and the relevant existing verification scripts.
3. Browser-test responsive layout, flight progression, both independent bet cards, Auto Bet/Auto Cash Out state behavior, crash handling, and reduced-motion/accessibility behavior.
4. Inspect the aircraft and atmosphere assets at mobile and desktop sizes.
5. Keep `main` and production deployment unchanged until acceptance.

## Reconciliation sprint 2 — visual tokens and mobile cockpit
- Appended a clearly marked CSS reconciliation layer to move the cockpit toward the locked graphite / warm-gold / restrained-crimson palette.
- Changed the flight-history strip to borderless, low-emphasis presentation with compact multiplier pills.
- Reduced the final mobile flight-scene height from the overriding 500px rule to 380px to reduce vertical competition with the two bet cards; existing bet action target remains 52px in the final mobile override.
- Preserved the existing reduced-motion rule and all earlier CSS so the change is a reversible override rather than a destructive rewrite.

### Source verification for sprint 2
- Re-fetched the CSS from the active branch after commit.
- Source assertions passed for locked background/surface/gold/crimson tokens, borderless history, 380px mobile flight height, and the reduced-motion rule.
- This is source-level verification only. Build, automated tests, rendered browser comparison, touch-device QA, and accessibility audit were not run.
- Vercel remains paused per user instruction; no preview/deployment action was taken.

### Remaining implementation risks
- Aircraft is still an inline silhouette, not yet a verified repository-owned recognizable aircraft asset.
- Header controls and bottom navigation include controls without completed destinations/actions.
- Auto Bet semantics and displayed demo balance require a focused provider/UI behavior review before acceptance.
