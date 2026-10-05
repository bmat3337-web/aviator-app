# AVIATOR — Reconciled Design System v1.0

**Date:** 2026-10-05  
**Status:** Design-system baseline / written design authority  
**Scope:** Aviator standalone product UI  
**Basis:** Carried-forward Aviator product decisions + HAKKARESEARCH-aligned design direction

> This is a written design specification, not a visual mockup.

## 1. Design Thesis

Aviator is a premium aviation cockpit, not a neon casino interface.

Priorities:
- Flight first.
- Multiplier first.
- Bet 1 and Bet 2 are the primary controls.
- Secondary information supports, but never competes with, live play.
- Desktop expands the mobile information architecture; it does not define it.
- Mobile-first is the master design.
- Compactness and duplication control are explicit design-system requirements.

## 2. HAKKA Material Language

The visual language is premium, dark, restrained, and material rather than neon.

### Canonical palette

| Token | Value | Role |
|---|---|---|
| Background | #0B0C0E | Application foundation |
| Surface 1 | #121417 | Primary elevated surface |
| Surface 2 | #191D21 | Component surface |
| Surface 3 | #22272C | Higher elevation |
| Elevated | #292F35 | Focused/interactive surface |
| Border | #343A40 | Structural border |
| Subtle border | #272C31 | Low-emphasis separation |
| Brand Gold | #C9A86A | Identity / primary action |
| Gold Bright | #E3C27A | Emphasis |
| Gunmetal | #343A40 | Material / secondary surfaces |
| Silver | #B9C0C7 | Bet 2 identity |
| Flight Crimson | #8F1824 | Flight atmosphere |
| Crimson Bright | #C52B38 | Critical flight state |
| Success | #38A66A | Ready / successful |
| Warning | #C9953C | Warning |
| Danger | #C53A43 | Loss / danger |
| Disabled | #555B60 | Unavailable |

### Explicitly removed

- Neon cyan/magenta borders
- Rainbow multiplier chips
- Glowing card outlines
- Excessive colored shadows
- Nightclub/arcade illumination
- Decorative LED treatment
- Cyan-heavy branding

Glow is semantic or atmospheric only: aircraft/trajectory, current multiplier, live/crash event, primary action emphasis, or critical state transition.

## 3. Design Tokens

### Typography

```
font.family = Inter / system sans
weights = 400 / 500 / 600 / 700
xs 11px · sm 12px · md 14px · lg 16px · xl 20px · 2xl 24px · 3xl 32px
mobile hero multiplier: 44–56px · desktop: 64–80px
```

### Spacing

```
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40px
Mobile default rhythm: 8 / 12 / 16 / 24px
```

### Radius

```
sm 6px · md 10px · lg 14px · xl 18px · pill 999px
```

### Elevation

```
card: 0 4px 16px rgba(0,0,0,.25)
elevated: 0 8px 24px rgba(0,0,0,.32)
modal: 0 16px 40px rgba(0,0,0,.45)
```

Use restrained dark elevation. Avoid heavy glassmorphism.

### Motion

```
fast 120ms · standard 200ms · slow 320ms
```

Use for state transitions, toggles, button feedback, multiplier changes, and navigation. Do not animate everything.

## 4. Mobile-First Information Architecture

```
HEADER
↓
LIVE FLIGHT
↓
CURRENT MULTIPLIER / STATE
↓
RECENT MULTIPLIERS
↓
BET 1
↓
BET 2
↓
SECONDARY INFORMATION
↓
UTILITIES
↓
BOTTOM NAVIGATION
```

Mobile is the master design. Desktop and tablet progressively expand the same information architecture.

## 5. Live Flight

- The flight is the visual hero.
- One authoritative flight scene: aircraft, trajectory, environment, and flight state.
- Round ID and live/crash state remain visible.
- The cinematic environment may vary (sunrise, day, sunset, night, storm, above clouds, runway), while the UI system remains consistent.
- Flight effects must support gameplay and never compete with betting controls.

### Duplication prohibition

Do not independently render a second aircraft, second flight scene, duplicate multiplier, or duplicate round state unless responsive composition genuinely requires a reused component/data source.

## 6. Multiplier

The multiplier is the primary live numerical value.

Requirements:
- Large and highly readable.
- High contrast.
- Integrated into the flight.
- Restrained illumination.
- No rainbow coloring.
- No excessive glow.
- No competing multiplier displays.

## 7. Betting System

There are exactly two independent positions:

```
<BetCard position="1" />
<BetCard position="2" />
```

Shared structure:
- position
- mode
- stake
- autoCashOut
- state
- primaryAction

Desktop: side-by-side.  
Mobile: stacked Bet 1 → Bet 2.

## 8. Bet Card Design

Bet 1 and Bet 2 are instances of the same component.

Both cards must have:
- identical dimensions
- identical internal grid
- identical spacing
- identical typography
- identical control placement
- identical action placement
- identical state model

Only position, accent, values, and state vary.

```
BET CARD
├── Position + BET 1/2 identity
├── BET | AUTO interaction
├── Stake control
├── Auto Cash Out control
├── Quick presets
├── State indicator
└── Primary action
```

**Bet 1 identity:** gold  
**Bet 2 identity:** silver/gunmetal

Cyan is not the primary Bet 2 identity.

## 9. Compactness

Bet cards remain approximately 25% shorter than the earlier oversized design.

- Reduce vertical padding rather than shrinking text into illegibility.
- Align fields horizontally.
- Remove redundant labels and decorative elements.
- Use compact presets.
- Keep the primary action strong but shallow.
- Every component must justify its vertical space.

## 10. Stake and Auto Controls

```
Stake:        −   10.00   +
Quick values: 1   5   10   20   MAX
```

Auto Bet and Auto Cash Out are separate semantics.

- **Auto Bet:** participation in future rounds.
- **Auto Cash Out:** cash-out threshold for the current round.

```
Auto Cash Out: −   2.00x   +
```

## 11. Bet States

```
READY · ACTIVE · CASH OUT · CASHED OUT · LOST · PROCESSING · DISABLED · UNAVAILABLE
```

Non-canonical states removed:
- IDLE
- POTENTIAL PAYOUT

Bet 1 and Bet 2 are independently stateful. Example: Bet 1 may be CASHED OUT while Bet 2 remains ACTIVE.

## 12. Recent Multipliers

Recent multipliers are a lightweight cockpit component associated with round outcomes.

```
1.20x   5.84x   4.76x   1.61x   4.09x
```

Use compact chips with restrained semantic coloration. Heavy borders around individual history items are explicitly removed.

**Recent Multipliers ≠ Live Bets ≠ My Bets ≠ Session.**

## 13. Secondary Surfaces

### Live Bets
Participant activity; may include Player, Bet, Amount, Multiplier, Status.

Views:
- All Bets
- My Bets
- Top
- Previous

### Session
- Players Online
- Total Bets
- Highest Multiplier
- Round ID
- Live State

### Daily Challenge
- Objective
- Progress
- Reward/progression

### Supporting information
- How to Play → Game Rules
- Probably Fair → Learn More
- Responsible Gaming → Tools & Limits

None of these surfaces may interrupt the core flight → multiplier → Bet 1 → Bet 2 hierarchy.

## 14. Social and Navigation

Social is a product destination, not part of the live betting cockpit.

```
PLAY · CHALLENGES · SOCIAL · HISTORY · WALLET
```

Mobile uses bottom navigation. Desktop uses header/navigation.

Settings and utilities remain global rather than consuming a primary navigation slot.

## 15. Header and FUN MODE

The header remains compact and contains only persistent high-value information:
- Aviator identity
- FUN MODE
- balance
- notifications
- profile/menu

FUN MODE is a product boundary. A displayed demo balance is not evidence of a production real-money wallet or financial implementation.

## 16. Responsive Rules

### Mobile

```
Single column
→ Flight
→ History
→ Bet 1
→ Bet 2
→ Secondary
→ Bottom nav
```

### Tablet

Progressively widen the flight and introduce side-by-side secondary information where space permits.

### Desktop

```
HEADER
↓
LIVE FLIGHT
↓
RECENT MULTIPLIERS
↓
BET 1 + BET 2
↓
LIVE BETS / SESSION / DAILY CHALLENGE
↓
SECONDARY INFORMATION
```

Optional desktop side panels may contain secondary information, but the central flight and betting controls remain dominant.

## 17. Interaction Constraints

- One continuous document; no nested gameplay scroll.
- No inner scroll trapped inside the cockpit.
- Navigation must not obscure gameplay.
- Social content must not sit between Bet 1 and Bet 2.
- Secondary information remains secondary.
- Both betting positions remain accessible without losing live-flight context.

## 18. Duplication Control

Never duplicate:
- aircraft
- flight scene
- multiplier
- round state
- balance
- bet controls
- recent history
- session metrics
- navigation

unless responsive composition requires a reused representation.

Duplicated information must come from the same component/data source; it must not become a second independently designed representation.

## 19. Semantic Color Rules

| Color | Meaning |
|---|---|
| Gold | Primary identity / primary action |
| Silver / Gunmetal | Secondary betting position |
| Crimson | Flight / critical live event |
| Green | Ready / successful / positive |
| Red | Loss / danger / crash |
| White | Critical information |
| Gray | Secondary / inactive |

**Color is semantic, not decorative.**

## 20. Component Token Model

```
tokens/
├── colors
├── typography
├── spacing
├── radius
├── borders
├── elevation
├── motion
├── breakpoints
└── component
```

Component tokens include:

```
bet.card.height
bet.card.padding
bet.control.height
bet.action.height
history.chip.height
header.height
bottomNav.height
flight.minHeight
```

Compactness must be enforceable through shared tokens rather than subjective per-screen tuning.

## 21. Acceptance / Quality Gate

Reject a proposed Aviator UI if it introduces:
- neon-heavy styling or cyan-heavy branding
- duplicated flight artwork or duplicated information
- different Bet 1 and Bet 2 component structures
- oversized betting cards
- desktop-first compromises on mobile
- excessive glassmorphism
- social content inside the cockpit
- navigation competing with gameplay
- history overpowering live play
- secondary content overpowering the flight
- unexplained colors
- inconsistent spacing
- arbitrary component dimensions

## 22. Canonical Design Equation

```
HAKKA MATERIAL LANGUAGE
+
AVIATOR FLIGHT ATMOSPHERE
+
MOBILE-FIRST INFORMATION ARCHITECTURE
+
COMPACT DUAL-BET SYSTEM
+
SEMANTIC COLOR
+
DESIGN TOKENS
+
NO DUPLICATION
+
NO NEON
+
CONSISTENT COMPONENT SYSTEM
```

**Result:** a premium aviation cockpit. The flight is the hero, the multiplier is the primary signal, Bet 1 and Bet 2 are the primary controls, and every other surface supports those elements.

## 23. Baseline Status

This document supersedes the generated visual mockup as the design-system authority. Future mockups or implementation screens must be evaluated against this baseline rather than treated as authoritative merely because they are newer or visually richer.
