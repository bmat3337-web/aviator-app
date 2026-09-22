import type { ProviderRoundEvent } from "../application/providerAdapter";
import type { EventStore, SettlementStore } from "../application/providerIngestion";
import type { BetRepository } from "../application/repositories";
import type { SqlPool, SqlValue } from "./postgresContracts";
const text=(v:string):SqlValue=>({type:"text",value:v});
export class PostgreSqlProviderEventStore implements EventStore {
  constructor(private readonly pool:SqlPool){}
  async has(key:string){const r=await this.pool.query<Record<string,unknown>>("SELECT 1 FROM aviator_provider_events WHERE event_key=$1",[text(key)]);return r.rows.length>0}
  async save(key:string,event:ProviderRoundEvent){await this.pool.query("INSERT INTO aviator_provider_events (event_key,provider_round_id,sequence,event_type,multiplier,occurred_at) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (event_key) DO NOTHING",[text(key),text(event.providerRoundId),{type:"int",value:event.sequence},text(event.type),event.multiplier===null?{type:"null",value:null}:{type:"numeric",value:event.multiplier},text(event.occurredAt)])}
}
export class PostgreSqlSettlementStore implements SettlementStore {
  constructor(private readonly bets:BetRepository){}
  async has(providerBetId:string){const bet=await this.bets.get(providerBetId);return bet!==null&&bet.settledAt!==null}
}
