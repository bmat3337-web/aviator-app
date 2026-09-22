import { actionLabel, slotStatus } from "./flightModel";
import type { GameSnapshot } from "../domain/game";

const snapshot: GameSnapshot = {
  round:{id:"SIM-TEST",state:"FLYING",multiplier:2.5,crashMultiplier:5,seed:"S",sequenceIndex:0,playerCount:42},
  bets:{
    BET1:{slot:"BET1",state:"ACTIVE",stake:2,multiplier:null,payout:0,autoBet:false,autoCashOut:3},
    BET2:{slot:"BET2",state:"CASHED_OUT",stake:1,multiplier:2.25,payout:2.25,autoBet:false,autoCashOut:null}
  }
};
if(actionLabel(snapshot,"BET1")!=="CASH OUT") throw new Error("Active action label failed");
if(slotStatus(snapshot,"BET1")!=="AUTO 3.00x") throw new Error("Auto cash-out status failed");
if(actionLabel(snapshot,"BET2")!=="CASHED OUT · 2.25") throw new Error("Payout action label failed");
if(slotStatus(snapshot,"BET2")!=="CASHED 2.25x") throw new Error("Cashout status failed");
console.log("FLIGHT PRESENTATION CONTRACT VERIFIED");
