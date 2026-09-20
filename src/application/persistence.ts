export interface TransactionRunner {
  run<T>(work: (tx: unknown) => Promise<T>): Promise<T>;
}

export interface PersistenceHealth {
  database: "UP" | "DOWN";
  checkedAt: string;
}

export interface PersistenceModule {
  rounds: RoundRepository;
  bets: BetRepository;
  ledger: import("./wallet").WalletLedger;
  transaction: TransactionRunner;
  health(): Promise<PersistenceHealth>;
}

import type { BetRepository, RoundRepository } from "./repositories";
