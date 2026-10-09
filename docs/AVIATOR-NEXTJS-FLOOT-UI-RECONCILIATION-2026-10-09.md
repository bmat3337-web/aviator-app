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

## Reconciliation sprint 3 — Auto Bet UI/provider boundary review
- Added a UI effect that only attempts an Auto Bet placement when the provider reports `BETTING_OPEN`, and only for an idle slot that has not already been marked for Auto Bet.
- Changed the explicit manual placement handler to send `autoBet: false`, preventing a manual click from silently turning the provider slot into an Auto Bet instruction.
- Source assertions passed for the eligible-state guard, idle-slot guard, manual-placement flag, and provider call presence.

### Sprint 3 limitations / follow-up
- This change is not yet verified against a running simulator. The provider currently owns round progression and the UI cannot guarantee that Auto Bet armed during an open betting window waits for the *next* round; that edge case needs a dedicated queue model and tests.
- The demo simulator's crash/result/next-round lifecycle also needs end-to-end inspection before claiming repeat Auto Bet works across rounds.
- An attempted repository-owned aircraft SVG was not confirmed present in Git; no asset integration is claimed. The inline silhouette remains.
- Header and bottom-navigation controls still require action/destination implementation or explicit disabled treatment.
- No build, automated test, browser QA, Vercel preview, or deployment was run. Vercel remains paused and `main` remains untouched.

## Reconciliation sprint 4 — deterministic simulator lifecycle
- Changed the demo simulator to advance from `CRASH` to a fresh `WAITING` round on the next tick, incrementing the deterministic sequence index and resetting the bet slots.
- Reordered flight resolution so crash takes precedence over auto cash-out at the exact crash multiplier; a target at the crash boundary cannot be recorded as a win.
- Extended `src/domain/simulator.test.ts` with source assertions for next-round reset, sequence advancement, clean bet slots, and the crash-boundary rule.

### Verification status
- Re-fetched the simulator and test source after their commits; the expected transition and test assertions are present.
- The tests were **not executed**. These are source checks only; no TypeScript build, test runtime, browser QA, or Vercel activity occurred.
- Important remaining limitation: Auto Bet is not yet a complete repeat-round queue. The UI effect still needs explicit arming semantics so toggling it during an open betting window cannot unexpectedly place a bet in that same round, and queued preferences must persist across fresh rounds without carrying stale bet outcomes.
- Aircraft asset integration remains unverified; the UI still uses its inline silhouette.
- Vercel remains paused. No merge, deployment, or change to `main`.


## Reconciliation sprint 5 — Auto Bet queue semantics (implementation committed; runtime verification pending)
- Added a pure eligibility guard for automatic placement: Auto Bet must remain enabled, the round must be BETTING_OPEN, the slot must be IDLE, the current round must not be explicitly skipped, and the slot must not already have placed in that round.
- Added independent per-slot skip-round and placed-round markers in the UI. Enabling during BETTING_OPEN skips the current round; enabling during WAITING can place when that round opens; enabling during flight/terminal phases remains queued for a later round. Disabling the toggle prevents future automatic placements.
- Kept manual placement explicitly `autoBet: false`; changed the action label from “NEXT ROUND” to “QUEUED” to avoid overstating exact placement timing.
- Added targeted pure-function assertions for waiting/open-window behavior, disabled state, later-round persistence, slot eligibility, and duplicate prevention.
- Source-only verification is not equivalent to running the tests. Test execution, typecheck, build, browser QA, and runtime simulation remain NOT RUN unless separately recorded below.
- Vercel remains paused; production and `main` must remain unchanged.
