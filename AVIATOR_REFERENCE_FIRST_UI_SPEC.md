# AVIATOR Reference-First UI Specification v1.0

Status: CANONICAL DESIGN BASELINE
Reference: Google Studio successful Aviator prototype and supplied desktop/mobile reference boards.
Rule: The production UI is built to this reference before additional feature implementation.

## 1. Visual hierarchy

1. Aviator identity/header
2. Live flight / hero environment
3. Multiplier + aircraft/trajectory
4. Round history
5. Bet 1 / Bet 2
6. Live players / game statistics
7. Challenge/support surfaces
8. Persistent primary navigation

The flight must remain the dominant experience. Supporting information must not visually compete with the multiplier.

## 2. Desktop reference composition

Use a three-zone application shell:

- Left: live round/history rail
- Center: flight visualization and dual betting controls
- Right: live players + game statistics
- Top: Aviator brand, primary navigation, wallet/profile
- Bottom: promotional/supporting flight banner and trust information

Bet 1 and Bet 2 remain independently visible below the flight visualization.

## 3. Mobile reference composition

Use a single-column flight-first experience:

- compact header: menu, Aviator brand, balance/deposit
- hero flight scene
- next-round indicator and online-player indicator over the scene
- multiplier and aircraft/trajectory
- history chips
- Bet/Auto mode selector
- Bet 1 and Bet 2 controls
- daily challenge
- How to Play / Game Rules / Game Limits / Probably Fair
- bottom navigation

The reference mobile betting cards use:
- stake amount prominently
- +/- controls
- quick amounts
- primary gold action
- Auto Cash Out controls
- Bet 1 / Bet 2 switching or simultaneous presentation as appropriate to viewport

## 4. Flight visual treatment

The supplied references establish:
- cinematic aviation imagery rather than flat gradients as the target visual direction
- aircraft as a major visual element
- visible flight trajectory
- environment changes: Sunrise, Day, Sunset, Night, Storm, Above Clouds, Runway
- dark premium treatment with champagne/gold accents
- red/pink flight-state emphasis where appropriate
- high-contrast multiplier typography
- restrained glass/panel treatment

Placeholder gradients are acceptable only as an interim simulator fallback; they are not the final reference target.

## 5. Betting controls

The production reference target is not the current plain form layout.

Each bet control should visually contain:
- Bet/Auto mode
- stake amount
- decrement/increment controls
- quick amount chips
- Auto Cash Out
- clear primary action

Action semantics:
- PLACE BET: actionable, gold
- CASH OUT: actionable, gold
- BETTING CLOSED / NEXT ROUND / WAITING: informational/disabled, subdued
- CASHED OUT / CRASHED / SETTLED: result state, subdued but explicit

Never allow a disabled state to visually resemble an available financial action.

## 6. Navigation

Desktop:
Play/Flight, Challenges, Social, History, Wallet, Profile.

Mobile:
Game/Flight, Challenge, Social/Chat, History, Profile.
Wallet remains accessible from header/profile.

## 7. Responsive acceptance

Desktop must preserve:
- three-zone flight workspace
- live players panel
- game statistics
- dual bet controls

Mobile must preserve:
- flight-first hero
- readable multiplier
- dual betting capability
- accessible quick stake controls
- bottom navigation

## 8. Engineering boundary

This document controls presentation direction only.

It does not authorize:
- real-money play
- payment processing
- SPRIBE production access
- regulatory launch
- KYC/AML operation

Authoritative game outcomes remain behind the provider/application boundary.

## 9. Build sequence

REFERENCE → DESIGN SYSTEM → STATIC UI COMPOSITION → RESPONSIVE UI → INTERACTION STATES → VERIFICATION → PREVIEW CLEARANCE → DEPLOYMENT

Do not use Vercel as the design iteration loop.
