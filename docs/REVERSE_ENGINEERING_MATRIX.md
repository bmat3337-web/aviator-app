# Reverse-Engineering Matrix

| Layer | Reference evidence | Target in aviator-app | Status |
|---|---|---|---|
| Round lifecycle | public rules + game references | deterministic state machine | SPEC |
| Betting | public rules | server-authoritative bet service | SPEC |
| Two simultaneous bets | public rules | independent bet records sharing roundId | SPEC |
| Auto Cashout | public rules | server-side threshold execution | SPEC |
| Auto Bet | public rules | round scheduler | SPEC |
| History | visible UI/public rules | immutable round results | SPEC |
| Live Bets | visible UI | realtime projection | SPEC |
| Top Bets | visible UI | aggregation/read model | SPEC |
| My Bets | visible UI | private projection | SPEC |
| Chat | visible UI | moderated realtime channel | SPEC |
| Provably Fair | public fairness UI + public research repos | isolated verifier | SPEC |
| Challenges | public SPRIBE product material | Mission/Race/Tournament engine | SPEC |
| Leaderboards | challenge architecture | sorted-score projection | SPEC |
| Rewards | challenge architecture | entitlement then ledger settlement | SPEC |
| Wallet | operator boundary | idempotent ledger adapter | SPEC |
| Exact proprietary API | not public | do not infer as fact | OUT OF SCOPE |
| Proprietary source | unavailable | clean-room implementation | OUT OF SCOPE |

## Reference repositories
- side-quest-dev/aviator-verifier: fairness verification reference
- kakarla07/aviator-crash-analysis: statistical-analysis reference
- Grizzy11/aviator-fairness-auditor: batch fairness-audit reference
- Laksidecloudz/aviator-clone: frontend/game-state reference
- steve-ongera/aviator: full-stack reference
- nutcas3/aviator-fun: backend/realtime reference

These are references, not authoritative SPRIBE source.
