# Aviator Analysis Engine

Production-oriented foundation for Aviator analytics, Telegram Mini App challenges, provider ingestion, and deterministic PostgreSQL-backed settlement.

## Verification

`npm run typecheck` and `npm test` run on every push/PR.

CI also provisions PostgreSQL 16 and runs the settlement integration suite against the real PL/pgSQL migration.

## Production secrets

- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `INGESTION_TOKEN`

## Integrity model

Provider rounds are normalized and validated before persistence. Participant predictions are authenticated with Telegram WebApp init data. Challenge settlement is server-side only and uses an idempotent PostgreSQL settlement function.

This project provides historical/statistical analytics and challenge infrastructure; it does not guarantee future Aviator outcomes.

## Structure

- `src/domain.ts` — domain contracts
- `src/analysis.ts` — deterministic analysis engine
- `src/provider.ts` — provider-neutral ingestion contract
- `src/challenge-service.ts` — challenge lifecycle and scoring
- `src/settlement-worker.ts` — server-side settlement boundary
- `database/migrations/` — PostgreSQL schema and settlement function
- `tests/` — unit and PostgreSQL integration coverage
