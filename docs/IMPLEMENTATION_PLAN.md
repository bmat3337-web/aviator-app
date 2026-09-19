# Implementation Plan

## Phase 0 — Foundation
- TypeScript project
- domain types
- deterministic state machine
- event envelope
- unit-test harness

## Phase 1 — Game Core
- round service
- bet service
- cash-out
- Auto Bet/Cashout
- settlement
- history

## Phase 2 — Fairness
- verifier interface
- known-vector tests
- commitment/reveal validation
- coefficient implementation isolated behind an adapter

## Phase 3 — Realtime
- WebSocket/SSE event gateway
- live bets
- top bets
- My Bets
- chat/presence

## Phase 4 — Challenges
- Mission
- Race
- Tournament
- progress
- leaderboard
- reward entitlement

## Phase 5 — Ledger
- double-entry wallet adapter
- idempotent settlement
- reconciliation
- audit trail

## Phase 6 — Analytics
- distribution
- volatility
- historical reporting
- Monte Carlo simulation
- fairness audit reports

## Phase 7 — UI
- game canvas
- two betting panels
- history strip
- Challenge bar
- live bets
- chat
- fairness verifier

## Phase 8 — Verification
- deterministic tests
- property tests
- concurrency tests
- replay tests
- settlement idempotency tests
- end-to-end round simulations
