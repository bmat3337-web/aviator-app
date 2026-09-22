import { assertFlightSnapshot, toFlightSnapshot } from "./flightSnapshot";
import type { GameSnapshot } from "../domain/game";

const base: GameSnapshot = {
  round: { id:"SIM-1", state:"FLYING", multiplier:2, crashMultiplier:4, seed:"S", sequenceIndex:1, playerCount:12 },
  bets: {
    BET1:{slot:"BET1",state:"ACTIVE",stake:1,multiplier:null,payout:0,autoBet:false,autoCashOut:2.5},
    BET2:{slot:"BET2",state:"BET_PLACED",stake:2,multiplier:null,payout:0,autoBet:false,autoCashOut:null}
  }
};
const s=toFlightSnapshot(base,"SIMULATOR","2026-09-21T00:00:00.000Z");
assertFlightSnapshot(s);
if(s.source!=="SIMULATOR") throw new Error("Snapshot source lost");
if(s.bets.BET1.autoCashOut!==2.5) throw new Error("Bet 1 control lost");
if(s.bets.BET2.stake!==2) throw new Error("Bet 2 state lost");
console.log("FLIGHT SNAPSHOT CONTRACT VERIFIED");
