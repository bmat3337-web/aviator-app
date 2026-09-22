import { RealtimeFlightProjection } from "./realtimeFlightProjection";
import type { FlightSnapshot } from "./flightSnapshot";
import type { ProviderRoundEvent } from "./providerAdapter";

const initial: FlightSnapshot = {
  source:"SPRIBE",
  receivedAt:"2026-09-21T00:00:00.000Z",
  round:{
    id:"ROUND-1",state:"WAITING",multiplier:1,crashMultiplier:0,
    seed:"PROVIDER",sequenceIndex:7,playerCount:100
  },
  bets:{
    BET1:{slot:"BET1",state:"ACTIVE",stake:1,multiplier:null,payout:0,autoBet:false,autoCashOut:null},
    BET2:{slot:"BET2",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null}
  }
};

const event=(sequence:number,type:ProviderRoundEvent["type"],multiplier:number|null=null):ProviderRoundEvent=>({
  providerRoundId:"ROUND-1",sequence,type,multiplier,occurredAt:"2026-09-21T00:01:00.000Z"
});

const projection=new RealtimeFlightProjection(initial);
projection.connect();

if(!projection.ingest(event(0,"ROUND_OPEN"))) throw new Error("Round open rejected");
if(projection.state().snapshot.round.state!=="BETTING_OPEN") throw new Error("Round state not projected");
if(!projection.ingest(event(1,"FLIGHT_START"))) throw new Error("Flight start rejected");
if(!projection.ingest(event(2,"MULTIPLIER",3.25))) throw new Error("Multiplier rejected");
if(projection.state().snapshot.round.multiplier!==3.25) throw new Error("Multiplier not projected");
if(projection.state().snapshot.bets.BET1.stake!==1) throw new Error("Bet state was mutated");
if(projection.ingest(event(2,"MULTIPLIER",3.5))) throw new Error("Duplicate sequence accepted");

projection.markStale();
if(projection.ingest(event(3,"CRASH",4))) throw new Error("Stale event accepted");
if(projection.state().snapshot.round.state!=="FLYING") throw new Error("Stale event mutated snapshot");

const replacement=structuredClone(initial);
replacement.round.state="FLYING";
replacement.round.multiplier=2;
projection.resync(replacement);
if(projection.state().session.lastSequence!==null) throw new Error("Resync did not reset sequence");
if(projection.state().snapshot.round.multiplier!==2) throw new Error("Resync snapshot not installed");
if(!projection.ingest(event(0,"CRASH",2))) throw new Error("Post-resync event rejected");
if(projection.state().snapshot.round.state!=="CRASH") throw new Error("Crash not projected");

console.log("REALTIME FLIGHT PROJECTION VERIFIED");
