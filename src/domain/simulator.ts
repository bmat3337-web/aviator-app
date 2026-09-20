import type { BetSlot, GameSnapshot, Round, SlotId } from "./game";
import type { CashOutResult, IGameProvider, PlaceBetRequest } from "./IGameProvider";

const slots: Record<SlotId, BetSlot> = {
  BET1:{slot:"BET1",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null},
  BET2:{slot:"BET2",state:"IDLE",stake:0,multiplier:null,payout:0,autoBet:false,autoCashOut:null}
};

export class SimulatorProvider implements IGameProvider {
  private value: GameSnapshot;
  private listeners=new Set<(s:GameSnapshot)=>void>();
  constructor(private seed="AVIATOR-DEMO-001",private index=0){this.value=this.make("WAITING");}
  snapshot(){return structuredClone(this.value);}
  subscribe(fn:(s:GameSnapshot)=>void){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
  start(){if(this.value.round.state==="WAITING")this.transition("BETTING_OPEN");}
  stop(){}
  reset(){this.value=this.make("WAITING");this.emit();}
  placeBet(r:PlaceBetRequest){const b=this.value.bets[r.slot];if(this.value.round.state!=="BETTING_OPEN"||b.state!=="IDLE")return;this.setBet(r.slot,{state:"BET_PLACED",stake:Math.max(0,r.stake),autoBet:!!r.autoBet,autoCashOut:r.autoCashOut??null});}
  cashOut(id:SlotId):CashOutResult{const b=this.value.bets[id];if(this.value.round.state!=="FLYING"||!["BET_PLACED","ACTIVE"].includes(b.state))throw new Error("Bet is not cashable");const m=this.value.round.multiplier,p=Number((b.stake*m).toFixed(2));this.setBet(id,{state:"CASHED_OUT",multiplier:m,payout:p});return{slot:id,multiplier:m,payout:p};}
  advance(){const s=this.value.round.state;if(s==="WAITING")this.transition("BETTING_OPEN");else if(s==="BETTING_OPEN"){for(const id of ["BET1","BET2"] as SlotId[])if(this.value.bets[id].state==="BET_PLACED")this.setBet(id,{state:"ACTIVE"});this.transition("BETTING_CLOSED");}else if(s==="BETTING_CLOSED"){this.transition("FLYING");this.setMultiplier(1);}else if(s==="FLYING"){const n=Number((this.value.round.multiplier+.25).toFixed(2));if(n>=this.value.round.crashMultiplier){this.setMultiplier(this.value.round.crashMultiplier);for(const id of ["BET1","BET2"] as SlotId[]){const b=this.value.bets[id];if(b.state==="BET_PLACED"||b.state==="ACTIVE")this.setBet(id,{state:"CRASHED"});}this.transition("CRASH");}else{this.setMultiplier(n);for(const id of ["BET1","BET2"] as SlotId[]){const b=this.value.bets[id];if((b.state==="BET_PLACED"||b.state==="ACTIVE")&&b.autoCashOut&&n>=b.autoCashOut)this.cashOut(id);}}}else if(s==="CRASH")this.transition("RESULT");else if(s==="RESULT"){for(const id of ["BET1","BET2"] as SlotId[])this.setBet(id,{state:this.value.bets[id].autoBet?"IDLE":"SETTLED",multiplier:null,payout:0});this.transition("NEXT_ROUND");}else if(s==="NEXT_ROUND")this.transition("BETTING_OPEN");return this.snapshot();}
  private make(state:Round["state"]):GameSnapshot{return{round:{id:"SIM-"+(this.index+1),state,multiplier:1,crashMultiplier:deterministicCrash(this.seed,this.index),seed:this.seed,sequenceIndex:this.index,playerCount:1},bets:structuredClone(slots)};}
  private transition(state:Round["state"]){this.value={...this.value,round:{...this.value.round,state}};this.emit();}
  private setMultiplier(multiplier:number){this.value={...this.value,round:{...this.value.round,multiplier}};this.emit();}
  private setBet(id:SlotId,patch:Partial<BetSlot>){this.value={...this.value,bets:{...this.value.bets,[id]:{...this.value.bets[id],...patch}}};this.emit();}
  private emit(){const s=this.snapshot();for(const fn of this.listeners)fn(s);}
}
export function deterministicCrash(seed:string,index:number){let h=2166136261>>>0;const input=seed+":"+index;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619);}const u=(h>>>0)/4294967296;return Number(Math.max(1.01,1/Math.max(.01,1-u)).toFixed(2));}
