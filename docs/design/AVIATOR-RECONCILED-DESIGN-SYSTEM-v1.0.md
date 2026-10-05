# AVIATOR — RECONCILED DESIGN SYSTEM v1.0

Design-system baseline · 5 October 2026

This written specification is the design authority for Aviator and supersedes generated visual mockups.

## Core principles

- Premium aviation cockpit, not neon casino UI.
- Mobile-first is the master design.
- Flight and multiplier are the primary visual hierarchy.
- Bet 1 and Bet 2 are the primary controls.
- Bet 1 and Bet 2 use one shared component with independent state.
- Bet 1 = gold; Bet 2 = silver/gunmetal.
- No neon styling, rainbow chips, excessive glow, or heavy glassmorphism.
- Compact bet cards; approximately 25% shorter than the earlier oversized design.
- No unnecessary duplication of flight, multiplier, balance, history, or controls.
- No nested gameplay scroll.

## Mobile hierarchy

HEADER → LIVE FLIGHT → CURRENT MULTIPLIER/STATE → RECENT MULTIPLIERS → BET 1 → BET 2 → SECONDARY INFORMATION → UTILITIES → BOTTOM NAVIGATION

## Desktop hierarchy

HEADER → LIVE FLIGHT → RECENT MULTIPLIERS → BET 1 + BET 2 → LIVE BETS / SESSION / DAILY CHALLENGE → SECONDARY INFORMATION

## Canonical colors

Background #0B0C0E · Surface #121417 / #191D21 / #22272C · Gold #C9A86A · Gold Bright #E3C27A · Gunmetal #343A40 · Silver #B9C0C7 · Flight Crimson #8F1824 · Crimson Bright #C52B38 · Success #38A66A · Warning #C9953C · Danger #C53A43 · Disabled #555B60.

## Bet system

Shared BetCard structure: position, mode, stake, autoCashOut, state, primaryAction. Desktop side-by-side; mobile stacked. Stake uses − value + with compact presets 1 / 5 / 10 / 20 / MAX. Auto Bet and Auto Cash Out remain separate semantics. Canonical states: READY, ACTIVE, CASH OUT, CASHED OUT, LOST, PROCESSING, DISABLED, UNAVAILABLE. IDLE and POTENTIAL PAYOUT are removed.

## Secondary surfaces

Recent Multipliers, Live Bets, Session, Daily Challenge, How to Play, Probably Fair, Responsible Gaming and Social remain secondary. Social is a destination, not part of the cockpit. Navigation: PLAY / CHALLENGES / SOCIAL / HISTORY / WALLET.

## Design tokens

Typography: Inter/system sans; weights 400/500/600/700; 11/12/14/16/20/24/32px scale. Mobile hero multiplier 44–56px; desktop 64–80px. Spacing: 4/8/12/16/20/24/32/40px. Radius: 6/10/14/18px. Motion: 120/200/320ms. Use restrained elevation and semantic color.

## Acceptance gate

Reject neon-heavy styling, cyan-heavy branding, duplicated flight artwork/information, divergent Bet 1/Bet 2 structures, oversized cards, desktop-first mobile compromises, excessive glassmorphism, social inside the cockpit, navigation competing with gameplay, history overpowering live play, inconsistent spacing, unexplained colors, or arbitrary dimensions.

## Authority

Future mockups and implementation screens must be evaluated against this baseline rather than treated as authoritative merely because they are newer or visually richer.
