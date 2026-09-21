import type { IGameProvider } from "../domain/IGameProvider";
import { actionLabel, createFlightViewModel } from "./flightModel";
import { flightMotion } from "./flightAnimation";
import { nextEnvironment, type EnvironmentState } from "./environment";
import "./flight.css";

type SlotId = "BET1" | "BET2";

export function FlightScreen(provider: IGameProvider): HTMLElement {
  const root=document.createElement("main"); root.className="aviator-shell";
  let environment: EnvironmentState={mode:"AUTO",environment:"DAY",intensity:.2};
  const autoBet: Record<SlotId, boolean>={BET1:false,BET2:false};
  const autoCashOut: Record<SlotId, number | null>={BET1:null,BET2:null};
  const render=()=>{
    const vm=createFlightViewModel(provider,[1.24,2.06,3.53,5.98,2.64]);
    environment=nextEnvironment(environment,vm.multiplier);
    const motion=flightMotion(vm.multiplier,vm.crashMultiplier);
    const snapshot=provider.snapshot();
    const slot=(id:SlotId)=>vm.bets[id];
    root.innerHTML='<aside class="panel nav"><div class="brand">AVIATOR</div><div class="nav-item active">Flight</div><div class="nav-item">Challenge</div><div class="nav-item">Social</div><div class="nav-item">History</div><div class="nav-item">Profile</div></aside>'+
    '<section class="panel flight"><div class="flight-top"><div><strong>LIVE FLIGHT</strong><div class="round">'+vm.roundId+' · '+vm.roundState+'</div></div><div>Players '+vm.playerCount+'</div></div><div class="multiplier" aria-live="polite">'+vm.multiplier.toFixed(2)+'x</div><div class="sky '+environment.environment+'"></div><div class="trajectory"></div><div class="plane" style="--plane-x:'+String(18+motion.progress*64)+'%;--plane-y:'+String(64-motion.progress*30)+'%;--plane-angle:'+String(motion.angle)+'deg">✈</div><div class="history">'+vm.history.map(x=>'<span class="chip">'+x.toFixed(2)+'x</span>').join("")+'</div></section>'+
    '<aside class="panel bets">'+(["BET1","BET2"] as SlotId[]).map(id=>'<div class="bet"><div class="bet-head"><span class="bet-name">'+(id==="BET1"?"BET 1":"BET 2")+'</span><span class="bet-state">'+slot(id).state.replaceAll("_"," ")+'</span></div><div class="bet-actions"><label class="stake-label">Stake<input class="stake" data-stake="'+id+'" value="'+(slot(id).stake||1)+'" inputmode="decimal" aria-label="'+id+' stake"></label><button data-slot="'+id+'" '+((snapshot.round.state==="BETTING_OPEN"&&slot(id).state==="IDLE") || (snapshot.round.state==="FLYING"&&(slot(id).state==="BET_PLACED"||slot(id).state==="ACTIVE")) ? "" : "disabled")+'>'+actionLabel(snapshot,id)+'</button></div><div class="bet-options"><label class="auto-control"><input type="checkbox" data-auto="'+id+'" '+(autoBet[id]?"checked":"")+'> <span>Auto Bet</span></label><label class="auto-control cashout-control"><span>Auto Cash Out</span><input class="auto-input" data-auto-cash="'+id+'" value="'+(autoCashOut[id]??"")+'" placeholder="2.00" inputmode="decimal" aria-label="'+id+' auto cash out"></label></div></div>').join("")+
    '<div class="support"><div class="support-row"><span>Environment</span><strong>'+environment.environment+'</strong></div><div class="support-row"><span>Round</span><strong>'+vm.roundState.replaceAll("_"," ")+'</strong></div><div class="support-row"><span>Balance</span><strong>SIMULATION</strong></div></div></aside>';
    root.querySelectorAll<HTMLInputElement>("input[data-auto-cash]").forEach(input=>input.onchange=()=>{const id=input.dataset.autoCash as SlotId;const n=Number(input.value);autoCashOut[id]=Number.isFinite(n)&&n>=1?n:null;});
    root.querySelectorAll<HTMLInputElement>("input[data-auto]").forEach(input=>input.onchange=()=>{const id=input.dataset.auto as SlotId;autoBet[id]=input.checked;});
    root.querySelectorAll<HTMLButtonElement>("button[data-slot]").forEach(btn=>btn.onclick=()=>{
      const id=btn.dataset.slot as SlotId,b=snapshot.bets[id],input=root.querySelector<HTMLInputElement>('input[data-stake="'+id+'"]');
      if(snapshot.round.state==="BETTING_OPEN"&&b.state==="IDLE") provider.placeBet({slot:id,stake:Number(input?.value||1),autoBet:autoBet[id],autoCashOut:autoCashOut[id]});
      else if(snapshot.round.state==="FLYING"&&(b.state==="BET_PLACED"||b.state==="ACTIVE")) provider.cashOut(id);
      render();
    });
  };
  provider.subscribe(render); render(); return root;
}
