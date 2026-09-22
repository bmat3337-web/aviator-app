import { ProviderEventIngestor, InMemoryProviderEventStore } from "./providerIngestion";
import type { ProviderSettlement } from "./providerAdapter";
class SettlementStore { constructor(private readonly ids=new Set<string>()){} async has(id:string){return this.ids.has(id)} add(id:string){this.ids.add(id)} }
const events=new InMemoryProviderEventStore(); const settlements=new SettlementStore(); const ingestor=new ProviderEventIngestor(events,settlements); const now=new Date().toISOString();
const e={providerRoundId:"R1",sequence:1,type:"MULTIPLIER" as const,multiplier:1.5,occurredAt:now};
if(await ingestor.ingestRoundEvent(e)!=="ACCEPTED") throw new Error("Initial event rejected");
if(await ingestor.ingestRoundEvent(e)!=="DUPLICATE") throw new Error("Duplicate event not suppressed");
const old={...e,sequence:0}; if(await ingestor.ingestRoundEvent(old)!=="OUT_OF_ORDER") throw new Error("Out-of-order event not rejected");
const s:ProviderSettlement={providerBetId:"B1",providerRoundId:"R1",outcome:"CRASHED",multiplier:null,payoutMinorUnits:0n,settledAt:now};
if(await ingestor.ingestSettlement(s)!=="ACCEPTED") throw new Error("Settlement rejected"); settlements.add("B1"); if(await ingestor.ingestSettlement(s)!=="DUPLICATE") throw new Error("Settlement duplicate not suppressed");
console.log("AVIATOR PROVIDER INGESTION VERIFIED");
