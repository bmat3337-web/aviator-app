# AVIATOR Floot → GPT/Git Migration Handoff

**Date:** 2026-10-09  
**Repository:** `bmat3337-web/aviator-app`  
**Migration branch:** `migration/floot-to-gpt-git-2026-10-09`  
**Default branch:** `main`  
**Authority:** locked Aviator UI Canon and reconciled design system  
**Purpose:** prepare continuation of engineering work in GPT + Git after UI prototyping in Floot.

## Operating model

- Floot is the UI laboratory and visual prototyping environment.
- Git is the canonical engineering source of truth.
- GPT + Git is the continuation environment for implementation, tests, audits, and production reconciliation.
- Do not assume Floot source is already present in Git. This handoff records what must be reconciled; it does not claim a code migration has occurred.
- Do not publish/deploy or merge this branch without explicit authorization.
- Do not claim tests, build, CI, runtime, or production execution unless actually run and evidenced.
- Every meaningful Git change must include a concrete verification payload. Batch related changes and run implementation plus tests/verification in the same work cycle.
- Preserve Aviator as a standalone product. Do not introduce IGAMI branding or HakkaCore runtime dependencies.

## Git baseline and prior evidence

- Repository confirmed accessible; default branch is `main`.
- Existing implementation audit: `docs/AVIATOR-LOCKED-UI-IMPLEMENTATION-AUDIT-v1.2.md`.
- Existing design authority: `docs/AVIATOR-RECONCILED-DESIGN-SYSTEM-v1.0.md`.
- Audit commit recorded in project notes: `09e0d56a79e10e7c02e001b2b1ad83c5b59a0723`.
- Audit verdict: UI authority LOCKED; implementation PARTIAL CONFORMANCE; certification NOT YET PASS.
- Historical UI commits recorded: `f93b87c3c003546dbbf2dc92836f0a65d92833`, `e358ca2c9a5ab8f7ae13d95773e66ba3891e4399`. Verify ancestry/current branch before treating these as current HEAD.
- The audit document identifies the reviewed HEAD as `5e99e4f1be3448dac1abbd682107cf98e94a284d`; verify the actual live `main` ref before any implementation work.
- Floot project: `Aviator UI Sprint — HAKKA`, project ID `045e180e-af9a-4cc0-9772-1c6d1b55180f`.
- Floot latest checkpoint before migration: `Real Aircraft Asset Integration`, ID `db9c1d7d-2d59-466d-8ac1-89fe5a8e7ca8`.
- Latest Floot work includes a newly generated aircraft image asset uploaded as `/_cdn/static/67b5d685-b324-4c7f-be26-9c236d57f90f-aviator-aircraft-cutout.png` and referenced in Floot `pages/_index.tsx`. The Floot daily build-action limit prevented completing verification/checkpoint after this last asset swap. This path is Floot-hosted and is not a Git asset path; do not assume it is portable or committed.

## Locked UI and product requirements

- Product is premium aviation cockpit, not neon casino UI.
- Palette: background `#0B0C0E`; surfaces `#121417`, `#191D21`, `#22272C`; gold `#C9A86A`; bright gold `#E3C27A`; gunmetal `#343A40`; silver `#B9C0C7`; flight crimson `#8F1824`; crimson bright `#C52B38`; success `#38A66A`; warning `#C9953C`; danger `#C53A43`.
- Mobile hierarchy: header → live flight → multiplier/state → recent multipliers embedded compactly at flight base → Bet 1 → Bet 2 → secondary info → utilities → bottom navigation.
- During live play, keep live flight and both betting positions accessible; Bet 1 gold, Bet 2 silver/gunmetal.
- One authoritative flight scene and multiplier. Aircraft, trajectory, and environment form one visual composition. Aircraft is a recognizable real aircraft asset, not a Lucide/icon glyph. The multiplier remains legible and dominant.
- Aircraft position and trajectory must share a normalized flight-progress source. Trajectory must be continuous and monotonic through early/mid/high multipliers, with restrained crimson fill and no loops, discontinuities, or graph-like visual dominance.
- Aircraft asset must be a genuine clean cutout with transparent background; the latest Floot image had an obvious white rectangular card and is not acceptable. The replacement asset was generated, but transparency/rendering is not yet visually verified.
- Recent multiplier chips should be compact and borderless/subtle; no duplicated aircraft, multiplier, round state, balance, or flight scene.
- Bet cards share one component with independent position state. Position-aware actions are mandatory: e.g. `BET 1 · CASH OUT`, `BET 2 · CASH OUT`. Locked lifecycle includes READY, PLACING/PLACED, ACTIVE, PROCESSING, CASHED OUT with multiplier, LOST/CRASHED, DISABLED/UNAVAILABLE.
- Auto Bet means participation in future rounds; it must not enter a round after flight has already started. Quick presets configure but never execute.
- Minimum touch target goal 44px; primary action 52–56px; WCAG AA contrast and visible focus; respect reduced motion.
- No heavy glassmorphism, operational neon, decorative LED treatment, excessive glow, or high-saturation green/red drift.
- FUN MODE is a demo boundary; mock balances are not evidence of real wallet, settlement, provider, or production money behavior.

## Research relationships and authority

- Reference: `AVIATOR_FLIGHT_SCREEN_RELATIONSHIP_STUDY.pdf` (7 Oct 2026) based on the supplied gameplay video and captured frames.
- Relationship: reference video/frame evidence → Flight Screen Relationship Study → locked UI Canon → Floot prototype/visual QA → GPT/Git reconciliation → production engineering and verification.
- HAKKARESEARCH records evidence/reasoning; PSA provides institutional engineering/verification standards; HakkaLibrary may contain only generic reusable components that meet reuse/provenance/verification criteria. Do not claim PSA certification without evidence.
- Research specifically rejects treating the aircraft as a decorative icon and rejects moving the aircraft away from the multiplier as the only solution. Preserve believable aircraft/trajectory composition while maintaining numeric legibility.

## Known issues and migration priorities

### P0 — first engineering sprint
1. Inspect current `main` HEAD and repository tree; verify all refs and branch ancestry before edits.
2. Read current flight component, animation/progress source, aircraft asset usage, and styles from Git (not from Floot memory alone).
3. Reproduce and fix bet lifecycle correctness:
   - visible enabled button must always have a valid action;
   - manual bet placement only in the permitted pre-round phase;
   - Auto Bet schedules entry for the next eligible round, never mid-flight;
   - reach LOST/CRASHED states correctly and settle transitions deterministically.
4. Create/verify a portable aircraft cutout asset in the Git repository (not Floot-hosted URL). Inspect alpha channel/background before use.
5. Ensure aircraft and trajectory share one normalized progress model, and that aircraft position does not obscure the multiplier at representative early/mid/high states.

### P1 — next
6. Reconcile design tokens to the locked palette and remove neon/glow drift.
7. Add missing Auto Cash Out quick presets and remove duplicated balance in bet cards if still present.
8. Confirm recent multipliers are compact and borderless/subtle; fix any metadata grid overflow.
9. Verify real destinations for navigation links; no inert anchor placeholders.
10. Accessibility pass: 44px target goals, contrast, focus, live announcements, reduced motion.

### P2 — acceptance
11. Capture browser evidence for early flight, around 5x, high multiplier, crash, READY/next flight, both bet positions, narrow mobile, and desktop.
12. Run actual typecheck, tests, production build, and CI only if available; record exact command/output. Do not infer passing from a remote typecheck or utility test alone.
13. Update the implementation audit with PASS/PARTIAL/FAIL/NOT IMPLEMENTED/NOT VERIFIABLE and attach concrete evidence.
14. Keep the branch open and unmerged until explicitly instructed.

## First GPT/Git session instruction

Resume from Git, not from assumptions. Start by inspecting:
- actual current `main` SHA and migration branch SHA;
- repository tree and current flight/bet component files;
- current package scripts and available tests;
- relevant workflow status only if actually available.

Then report a concise baseline reconciliation: current HEAD, existing work, Floot-only changes not yet migrated, P0 defects, and the first implementation+verification batch. Do not begin broad refactors or publish.