import { RealtimeResyncCoordinator } from "./realtimeResyncCoordinator";
import { RealtimeFlightProjection } from "./realtimeFlightProjection";
import type { FlightSnapshot } from "./flightSnapshot";
import type { ProviderRoundEvent } from "./providerAdapter";

const snapshot=(roundId:string,multiplier:number,state:FlightSnapshot["round"]["state"]):FlightSnapshot=>({
  source:"SPRIBE",
  receivedAt:"2026-09-21T00:02:00.000Z",
  round:{id:roundId,state,multiplier,crashMultiplier:0,seed:"PROVIDER",sequenceIndex:1,playerCount:50},
  bets:{
    BET1:{slot:"BET1",state:"ACTIVE",stake:1,multiplier:null,payout:0,autoBet:false,autoCashOut:null},
    BET2:{slot:"BET2",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null}
  }
});

const event=(roundId:string,sequence:number,type:ProviderRoundEvent["type"],multiplier:number|null=null):ProviderRoundEvent=>({
  providerRoundId:roundId,sequence,type,multiplier,occurredAt:"2026-09-21T00:03:00.000Z"
});

const projection=new RealtimeFlightProjection(snapshot("R1",1,"FLYING"));
projection.connect("R1");
const coordinator=new RealtimeResyncCoordinator(projection);

if(!coordinator.ingest(event("R1",1,"MULTIPLIER",2))) throw new Error("Initial realtime event rejected");
coordinator.markConnectionStale("socket-closed");
if(coordinator.ingest(event("R1",2,"MULTIPLIER",3))) throw new Error("Stale stream accepted");
if(coordinator.state().status!=="RESYNC_REQUIRED") throw new Error("Resync requirement not recorded");

coordinator.beginResync();
if(coordinator.state().status!=="RESYNCING") throw new Error("Resync did not begin");
if(coordinator.ingest(event("R1",2,"MULTIPLIER",3))) throw new Error("Resyncing stream accepted");

coordinator.installAuthoritativeSnapshot(snapshot("R1",2.5,"FLYING"));
if(coordinator.state().status!=="READY") throw new Error("Coordinator did not return to ready");
if(coordinator.state().resyncCount!==1) throw new Error("Resync count incorrect");

if(!coordinator.ingest(event("R1",0,"MULTIPLIER",2.75))) throw new Error("Fresh stream rejected after resync");
if(coordinator.ingest(event("R2",1,"MULTIPLIER",3))) throw new Error("Foreign round accepted");

const final=projection.state();
if(final.snapshot.round.multiplier!==2.75) throw new Error("Projection not updated after resync");
if(final.snapshot.bets.BET1.stake!==1) throw new Error("Financial bet state changed during resync");

console.log("REALTIME RESYNC COORDINATOR VERIFIED");
