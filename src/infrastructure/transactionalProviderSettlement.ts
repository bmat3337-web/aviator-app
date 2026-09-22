import type { ProviderSettlement } from "../application/providerAdapter";
import type { SqlPool, SqlValue } from "./postgresContracts";
const text=(v:string):SqlValue=>({type:"text",value:v}); const numeric=(v:bigint):SqlValue=>({type:"numeric",value:v.toString()});
export type SettlementDecision="SETTLED"|"DUPLICATE";
export class TransactionalProviderSettlement {
 constructor(private readonly pool:SqlPool){}
 async settle(s:ProviderSettlement):Promise<SettlementDecision>{
  const tx=await this.pool.connect(); const key="provider:settlement:"+s.providerBetId;
  try{
   await tx.query("SELECT pg_advisory_xact_lock(hashtext($1))",[text(s.providerBetId)]);
   const bet=await tx.query<Record<string,unknown>>("SELECT bet_id,player_id,settled_at FROM aviator_bets WHERE bet_id=$1 FOR UPDATE",[text(s.providerBetId)]);
   if(!bet.rows.length) throw new Error("BET_NOT_FOUND");
   if(bet.rows[0].settled_at!==null){await tx.rollback();return "DUPLICATE";}
   await tx.query("INSERT INTO aviator_ledger_entries (entry_id,account_id,entry_type,currency,amount_minor_units,reference_id,idempotency_key,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (account_id,idempotency_key) DO NOTHING",[text("payout:"+s.providerBetId),text(String(bet.rows[0].player_id)),text("PAYOUT"),text("ACCOUNT_CURRENCY"),numeric(s.payoutMinorUnits),text(s.providerBetId),text(key),text(s.settledAt)]);
   await tx.query("UPDATE aviator_bets SET state=$2,payout_minor_units=$3,cash_out_multiplier=$4,settled_at=$5 WHERE bet_id=$1 AND settled_at IS NULL",[text(s.providerBetId),text(s.outcome==="CASHED_OUT"?"CASHED_OUT":"CRASHED"),numeric(s.payoutMinorUnits),s.multiplier===null?{type:"null",value:null}:{type:"numeric",value:s.multiplier},text(s.settledAt)]);
   await tx.commit(); return "SETTLED";
  }catch(error){await tx.rollback();throw error;}
 }
}
