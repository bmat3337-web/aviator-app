# AVIATOR Foundation v1

Controlled canonical foundation for the standalone AVIATOR product.

## Status

Foundation verified through an isolated Google AI Studio proof-of-capability experiment and an independent alternative implementation.

## Boundaries

- Simulation/development only
- No real-money payments
- No SPRIBE connection or invented provider APIs
- No production credentials
- Real-money launch remains gated by provider, regulatory, payment, KYC/AML, responsible-gaming, security and certification readiness

## Canonical architecture

UI → Application → Game Domain → IGameProvider → SimulatorProvider / future authorized SPRIBEProvider

## Core round lifecycle

WAITING → BETTING_OPEN → BETTING_CLOSED → FLYING → CRASH → RESULT → NEXT_ROUND

## Bet lifecycle

IDLE → BETTING_OPEN → BET_PLACED → ACTIVE → CASHED_OUT / CRASHED → SETTLED

Bet 1 and Bet 2 are independent state machines.
