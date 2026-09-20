import type { ProviderRoundEvent, ProviderSettlement } from "./providerAdapter";
import { StrictProviderEventValidator } from "./providerValidator";
export type IngestDecision="ACCEPTED"|"DUPLICATE"|"OUT_OF_ORDER";
export interface EventStore { has(key:string):Promise<boolean>; save(key:string,event:ProviderRoundEvent):Promise<void>; }
export interface SettlementStore { has(providerBetId:string):Promise<boolean>; }
export class InMemoryProviderEventStore implements EventStore { private readonly keys=new Set<string>(); async has(k:string){return this.keys.has(k)} async save(k:string){this.keys.add(k)} }
export class ProviderEventIngestor {
 constructor(private readonly events:EventStore, private readonly settlements:SettlementStore, private readonly validator=new StrictProviderEventValidator(), private readonly sequences=new Map<string,number>()) {}
 async ingestRoundEvent(event:ProviderRoundEvent):Promise<IngestDecision>{
  this.validator.validateRoundEvent(event);
  const key=`${event.providerRoundId}:${event.sequence}:${event.type}`;
  if(await this.events.has(key)) return "DUPLICATE";
  const last=this.sequences.get(event.providerRoundId);
  if(last!==undefined && event.sequence<=last) return "OUT_OF_ORDER";
  await this.events.save(key,event); this.sequences.set(event.providerRoundId,event.sequence); return "ACCEPTED";
 }
 async ingestSettlement(settlement:ProviderSettlement):Promise<"ACCEPTED"|"DUPLICATE">{
  this.validator.validateSettlement(settlement);
  if(await this.settlements.has(settlement.providerBetId)) return "DUPLICATE";
  return "ACCEPTED";
 }
}
