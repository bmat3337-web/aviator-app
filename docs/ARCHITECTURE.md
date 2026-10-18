# Aviator Reference Architecture

## Core flow
WAITING -> BETTING -> STARTING -> FLYING -> CRASHED -> SETTLEMENT -> HISTORY

The round outcome is determined by the fairness engine before the public flight animation. The client never determines the authoritative crash point.

## Services
1. Game Engine: rounds, multiplier presentation, crash state.
2. Betting Engine: bet acceptance, cash-out, Auto Bet, Auto Cashout.
3. Fairness Engine: commitment/reveal and independently testable coefficient verification.
4. Realtime Engine: round events, live bets, chat and presence.
5. Challenge Engine: missions, races, tournaments, progress and reward entitlements.
6. Wallet/Ledger: authoritative debit/credit with idempotency.
7. Analytics: descriptive history, distributions, simulations and audit reports.

## Trust boundary
Client controls UI intent and configuration. Server controls outcome, timing, settlement, challenge state and rewards.

## Event envelope
```ts
type DomainEvent = {
  eventId: string;
  eventType: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  payload: unknown;
};
```

All financial and reward mutations must be idempotent.
