import type { MoneyAmount, WalletLedger, WalletService } from "./wallet";
import type { SqlPool, SqlValue } from "../infrastructure/postgresContracts";
const text=(v:string):SqlValue=>({type:"text",value:v});
const numeric=(v:bigint):SqlValue=>({type:"numeric",value:v.toString()});

/**
 * Financial write boundary. A real implementation must run reservation and
 * settlement inside a database transaction and never trust client balances.
 */
export class TransactionalWalletService implements WalletService {
  constructor(private readonly pool: SqlPool, private readonly ledger: WalletLedger) {}

  async reserveForBet(accountId:string, amount:MoneyAmount, betId:string):Promise<void>{
    if(amount.minorUnits<=0n) throw new Error("BET_AMOUNT_MUST_BE_POSITIVE");
    const tx=await this.pool.connect();
    try {
      const balance=await tx.query<Record<string,unknown>>(
        "SELECT COALESCE(SUM(amount_minor_units),0) AS balance FROM aviator_ledger_entries WHERE account_id=$1 AND currency=$2 FOR UPDATE",
        [text(accountId),text(amount.currency)]);
      const available=BigInt(String(balance.rows[0]?.balance ?? 0));
      if(available<amount.minorUnits) throw new Error("INSUFFICIENT_FUNDS");
      await tx.query(
        "INSERT INTO aviator_ledger_entries (entry_id,account_id,entry_type,currency,amount_minor_units,reference_id,idempotency_key,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (account_id,idempotency_key) DO NOTHING",
        [text("bet:"+betId),text(accountId),text("BET_RESERVATION"),text(amount.currency),numeric(-amount.minorUnits),text(betId),text("bet:"+betId),text(new Date().toISOString())]);
      await tx.commit();
    } catch(error){ await tx.rollback(); throw error; }
  }

  async settlePayout(accountId:string, amount:MoneyAmount, betId:string):Promise<void>{
    if(amount.minorUnits<0n) throw new Error("PAYOUT_MUST_NOT_BE_NEGATIVE");
    const tx=await this.pool.connect();
    try {
      await tx.query(
        "INSERT INTO aviator_ledger_entries (entry_id,account_id,entry_type,currency,amount_minor_units,reference_id,idempotency_key,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (account_id,idempotency_key) DO NOTHING",
        [text("payout:"+betId),text(accountId),text("PAYOUT"),text(amount.currency),numeric(amount.minorUnits),text(betId),text("payout:"+betId),text(new Date().toISOString())]);
      await tx.commit();
    } catch(error){ await tx.rollback(); throw error; }
  }
}
