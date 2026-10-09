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
