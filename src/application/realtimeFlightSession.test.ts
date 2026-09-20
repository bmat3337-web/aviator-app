import { RealtimeFlightSession } from "./realtimeFlightSession";
import type { ProviderRoundEvent } from "./providerAdapter";

const event=(sequence:number,type:ProviderRoundEvent["type"]="MULTIPLIER"):ProviderRoundEvent=>({
  providerRoundId:"SPRIBE-DEMO-1",
  sequence,
  type,
  multiplier:type==="ROUND_OPEN"?null:1+sequence,
  occurredAt:"2026-09-21T00:00:00.000Z",
});

const session=new RealtimeFlightSession();
if(session.ingest(event(0))!==null) throw new Error("Disconnected session accepted event");

session.connect();
if(session.ingest(event(0))===null) throw new Error("Initial event rejected");
if(session.ingest(event(0))!==null) throw new Error("Duplicate event accepted");
if(session.ingest(event(0,"ROUND_OPEN"))!==null) throw new Error("Repeated sequence accepted");
if(session.ingest(event(2))===null) throw new Error("Forward event rejected");
if(session.ingest(event(1))!==null) throw new Error("Out-of-order event accepted");
if(session.ingest(event(3))===null) throw new Error("Second forward event rejected");
if(session.ingest({...event(4),providerRoundId:"OTHER"})!==null) throw new Error("Foreign round accepted");

session.markStale();
if(session.ingest(event(5))!==null) throw new Error("Stale session accepted event");

const state=session.state();
if(state.status!=="STALE") throw new Error("Stale state not retained");
if(state.lastSequence!==3) throw new Error("Last accepted sequence incorrect");
if(state.acceptedEvents!==3) throw new Error("Accepted event count incorrect");
if(state.rejectedEvents!==5) throw new Error("Rejected event count incorrect");

session.connect("SPRIBE-DEMO-2");
if(session.state().lastSequence!==null) throw new Error("Reconnect did not reset cursor");
if(session.ingest({...event(0),providerRoundId:"SPRIBE-DEMO-2"})===null) throw new Error("Reconnect event rejected");

console.log("REALTIME FLIGHT SESSION VERIFIED");
