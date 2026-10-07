# AVIATOR UI CANON v1.3 — Implementation Contract

Status: APPROVED / LOCKED

This repository implements the approved AVIATOR UI Canon v1.3.

## Source of truth
1. Canon v1.3
2. Approved user sketches
3. Approved mobile flight-screen mockup
4. Reference screenshots for interaction/space principles
5. Base44 / Google AI Studio are reference-only

## Master experience
AVIATOR = Aviation Atmosphere + Glass Cockpit + Precision Controls + Product-Grade Presentation.

The product is DEMO/SIMULATION ONLY. No real-money functionality is introduced by this UI build.

## Mobile order
HEADER
LIVE FLIGHT
COMPACT MULTIPLIER PILLS
BET 1
BET 2
SECONDARY INFORMATION / UTILITIES
BOTTOM NAVIGATION

Bet 1 is always above Bet 2. Bottom navigation must never obscure primary controls.

## Flight
The flight is the dominant visual object. It must read as an atmospheric flight environment, not a generic financial graph.

Required:
- aircraft
- luminous but restrained trajectory
- authoritative multiplier
- atmospheric sky/cloud/horizon/depth
- state-driven motion
- sufficient vertical visual weight

Reduce/remove from presentation:
- heavy axes
- large tick labels
- conventional chart grid
- strong plotting baseline
- redundant large flight/multiplier indicators

Flight states:
WAITING -> PREPARING -> BETTING OPEN -> FLYING -> FLEW AWAY -> ROUND ENDED -> NEXT ROUND.

## Recent multiplier pills
There is NO two-item limit.

Use a compact horizontal sequence of recent multiplier pills. It may scroll horizontally. It sits directly below the flight on mobile. Full history belongs in History/Session History.

## Bet cards
Bet 1 and Bet 2 are one reusable component with independent state.

Approved geometry:
- top row: STAKE / AUTO BET / AUTO C/O
- aligned minus/value/plus controls for Stake and Auto Cash Out
- presets: 1 / 5 / 10 / 20 / MAX
- full-width contextual BET 1 / BET 2 action with stake amount
- concise status/balance footer

Bet 1 uses gold accent. Bet 2 uses cyan accent.

Do not add a large Bet 1/Bet 2 header above the control row.
Do not add Potential Payout, Idle labels, or unnecessary explanatory copy.
Keep cards approximately 25% shorter than earlier oversized versions while preserving touch usability.

## Glass and atmosphere
Glass sits over the aviation environment.
Glass hierarchy:
- strongest: Live Flight / Bet 1 / Bet 2
- medium: multiplier pills / challenge / themes / stats
- lightest: utility information

Do not create a wall of identical translucent cards.

## Architecture
Use the existing React 19 + Vite + TypeScript foundation and preserve the existing domain/application/infrastructure separation.

Build from the system:
Canon -> tokens -> primitives -> atmosphere -> flight -> approved BetCard -> responsive composition -> secondary modules -> motion/polish -> validation.

Do not replace the architecture with prototype-generated code.

## State
One authoritative live state drives multiplier, flight state, aircraft position, trajectory progress, Bet 1 state, Bet 2 state, stake, Auto Bet, Auto Cash Out and theme.

## Acceptance
The implementation must preserve the approved geometry, mobile hierarchy, flight dominance, compact multiplier pills, glass hierarchy, atmosphere, independent Bet 1/Bet 2 state, safe-area navigation and responsive behavior.


## Atmosphere Engine v1.0 — Research Refinement

The flight-screen reference study establishes four coordinated roles:

1. Atmosphere — persistent spatial environment, depth and cloud movement.
2. Graph — evolving flight trajectory.
3. Aircraft — current position on the trajectory.
4. Multiplier — dominant numerical readout embedded in the flight scene.

The atmosphere engine must not own graph, aircraft, multiplier or betting state.

### Implementation decision

The previous atmosphere implementation depended primarily on looping video assets plus CSS fallback layers. v1.0 introduces a deterministic procedural cloud renderer using the browser Canvas 2D API.

The renderer uses seeded multi-layer cloud fields, depth-dependent drift, blur, haze and bounded device-pixel ratio. It deliberately avoids true volumetric rendering at this stage because the product target includes mobile devices and the current objective is a controllable premium atmosphere rather than maximum physical simulation.

### HAKKARESEARCH alignment

The implementation is treated as an evidence-backed visual/engineering refinement: the atmosphere is a spatial composition, not a decorative backdrop, and cloud motion is separated from authoritative flight state.

### HakkaLibrary alignment

The renderer is a promotion candidate, not yet a library asset. HakkaLibrary promotion requires proven use, stable contract, domain-neutral behaviour, deterministic behaviour where applicable and tests. Aviator is currently the first consumer, so extraction into HakkaLibrary is deferred until the contract has evidence beyond this product.

### PSA controls

- deterministic seeded generation
- explicit ownership boundary
- lifecycle start/stop/resize
- bounded frame delta
- DPR cap
- reduced-motion support
- no product-domain state inside the renderer
- testable deterministic seed behaviour
- Git-first implementation traceability

### Acceptance

The atmosphere refinement is complete only when typecheck, flight-presentation verification and production build pass, followed by visual QA on target mobile hardware. The final visual check must confirm that cloud motion adds depth without competing with the aircraft, trajectory or multiplier.
