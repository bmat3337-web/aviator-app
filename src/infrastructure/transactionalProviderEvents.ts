import type { ProviderRoundEvent } from "./providerAdapter";
import type { SqlPool, SqlValue } from "./postgresContracts";
const text=(v:string):SqlValue=>({type:"text",value:v});
export type TransactionalIngestDecision="ACCEPTED"|"DUPLICATE"|"OUT_OF_ORDER";
export class TransactionalProviderEventStore {
 constructor(private readonly pool:SqlPool){}
 async ingest(event:ProviderRoundEvent):Promise<TransactionalIngestDecision>{
  const tx=await this.pool.connect(); const key=event.providerRoundId+":"+event.sequence+":"+event.type;
  try {
   await tx.query("SELECT pg_advisory_xact_lock(hashtext($1))",[text(event.providerRoundId)]);
   const existing=await tx.query<Record<string,unknown>>("SELECT event_key FROM aviator_provider_events WHERE event_key=$1",[text(key)]);
   if(existing.rows.length){await tx.rollback();return "DUPLICATE";}
   const latest=await tx.query<Record<string,unknown>>("SELECT sequence FROM aviator_provider_events WHERE provider_round_id=$1 ORDER BY sequence DESC LIMIT 1",[text(event.providerRoundId)]);
   if(latest.rows.length && event.sequence<=Number(latest.rows[0].sequence)){await tx.rollback();return "OUT_OF_ORDER";}
   await tx.query("INSERT INTO aviator_provider_events (event_key,provider_round_id,sequence,event_type,multiplier,occurred_at) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (event_key) DO NOTHING",[text(key),text(event.providerRoundId),{type:"int",value:event.sequence},text(event.type),event.multiplier===null?{type:"null",value:null}:{type:"numeric",value:event.multiplier},text(event.occurredAt)]);
   await tx.commit(); return "ACCEPTED";
  } catch(error){await tx.rollback();throw error;}
 }
}
