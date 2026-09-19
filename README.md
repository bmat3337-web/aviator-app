# Aviator Analysis Engine

Production foundation for deterministic Aviator round, streak, volatility, analytics and challenge analysis.

## Scope
- Canonical round ingestion
- Threshold/state classification
- Current and historical streak analysis
- Rolling distribution analytics
- Explicit separation of historical statistics from predictions
- Versioned analysis contracts
- Foundation for backtesting, signals, Telegram Bot and Mini App

## Baseline
The original prototype used a 100-round in-memory history and thresholds of >=2.0x, >=5.0x and <=1.5x. This foundation preserves those concepts while removing the runtime-only storage constraint.

## Safety
Historical frequencies are descriptive statistics. They are not guarantees of future game outcomes.

## Structure
- src/domain.ts — domain contracts
- src/analysis.ts — deterministic analysis engine
- tests/analysis.test.ts — executable baseline tests
