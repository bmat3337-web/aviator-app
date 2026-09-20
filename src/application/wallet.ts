export type WalletEntryType = "DEPOSIT" | "BET_RESERVATION" | "BET_RELEASE" | "PAYOUT" | "WITHDRAWAL" | "ADJUSTMENT";

export interface MoneyAmount { currency: string; minorUnits: bigint; }

export interface LedgerEntry {
  entryId: string;
  accountId: string;
  type: WalletEntryType;
  amount: MoneyAmount;
  referenceId: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface WalletLedger {
  getAvailableBalance(accountId: string): Promise<MoneyAmount>;
  append(entry: LedgerEntry): Promise<void>;
  hasIdempotencyKey(accountId: string, key: string): Promise<boolean>;
}

/** Production wallet state must be server-authoritative and ledger-backed. */
export interface WalletService {
  reserveForBet(accountId: string, amount: MoneyAmount, betId: string): Promise<void>;
  settlePayout(accountId: string, amount: MoneyAmount, betId: string): Promise<void>;
}
