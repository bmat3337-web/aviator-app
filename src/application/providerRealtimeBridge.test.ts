import type { FlightSnapshot } from "./flightSnapshot";
import { RealtimeFlightProjection } from "./realtimeFlightProjection";
import { RealtimeResyncCoordinator } from "./realtimeResyncCoordinator";
import type { ProviderAdapter } from "./providerAdapter";
import { ProviderRealtimeBridge } from "./providerRealtimeBridge";

const snapshot: FlightSnapshot = {
  source:"SPRIBE", receivedAt:"2026-09-21T00:00:00.000Z",
  round:{id:"R1",state:"FLYING",multiplier:1,crashMultiplier:0,seed:"PROVIDER",sequenceIndex:1,playerCount:10},
  bets:{
    BET1:{slot:"BET1",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null},
    BET2:{slot:"BET2",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null}
  }
};

let handler: ((event:any)=>Promise<void>)|null=null;
let disconnected=false;
const adapter: ProviderAdapter = {
  providerName:"TEST-PROVIDER",
  async connect(){ disconnected=false; },
  async subscribeRoundEvents(onEvent){ handler=onEvent; return async()=>{disconnected=true;}; },
  async placeBet(){ throw new Error("Not used"); },
  async cashOut(){ throw new Error("Not used"); }
};

const projection=new RealtimeFlightProjection(snapshot);
projection.connect("R1");
const coordinator=new RealtimeResyncCoordinator(projection);
const bridge=new ProviderRealtimeBridge(adapter,coordinator);

await bridge.connect();
await bridge.subscribe();
if(!bridge.state().connected || !bridge.state().subscribed) throw new Error("Bridge did not connect");

if (handler === null) throw new Error("Provider handler was not registered");
await (handler as (event: any) => Promise<void>)({providerRoundId:"R1",sequence:0,type:"MULTIPLIER",multiplier:2,occurredAt:"2026-09-21T00:01:00.000Z"});
if(projection.state().snapshot.round.multiplier!==2) throw new Error("Provider event not bridged");

await bridge.markTransportStale("socket-lost");
if(bridge.state().coordinator.status!=="RESYNC_REQUIRED") throw new Error("Stale state not propagated");
if(bridge.state().subscribed) throw new Error("Stale bridge remained subscribed");

await bridge.resync({...snapshot,receivedAt:"2026-09-21T00:02:00.000Z"});
if(bridge.state().coordinator.status!=="READY") throw new Error("Bridge resync did not restore ready state");
await bridge.subscribe();
if(!bridge.state().subscribed) throw new Error("Fresh subscription was not restored");

await bridge.disconnect();
if(!disconnected || bridge.state().connected || bridge.state().subscribed) throw new Error("Bridge disconnect failed");

console.log("PROVIDER REALTIME BRIDGE VERIFIED");
