import type { IGameProvider } from "../domain/IGameProvider";
import { actionLabel, createFlightViewModel } from "./flightModel";
import "./flight.css";

export function FlightScreen(provider: IGameProvider): HTMLElement {
  const root=document.createElement("main");
  root.className="aviator-shell";
  const render=()=>{const vm=createFlightViewModel(provider,[1.24,2.06,3.53,5.98,2.64]);
    root.innerHTML=`
      <aside class="panel nav"><div class="brand">AVIATOR</div><div class="nav-item active">Flight</div><div class="nav-item">Challenge</div><div class="nav-item">Social</div><div class="nav-item">History</div><div class="nav-item">Profile</div></aside>
      <section class="panel flight"><div class="flight-top"><div><strong>LIVE FLIGHT</strong><div class="round">${vm.roundId}</div></div><div>Players ${vm.playerCount}</div></div><div class="multiplier">${vm.multiplier.toFixed(2)}x</div><div class="sky"></div><div class="trajectory"></div><div class="plane">✈</div><div class="history">${vm.history.map(x=>`<span class="chip">${x.toFixed(2)}x</span>`).join("")}</div></section>
      <aside class="panel bets"><div class="bet"><div class="bet-head"><span class="bet-name">BET 1</span><span>${vm.bets.BET1.state}</span></div><div class="bet-actions"><input class="stake" value="${vm.bets.BET1.stake||1}" aria-label="Bet 1 stake"><button data-slot="BET1" class="${vm.bets.BET1.state==="ACTIVE"?"cash":""}">${actionLabel(provider.snapshot(),"BET1")}</button></div></div>
      <div class="bet"><div class="bet-head"><span class="bet-name">BET 2</span><span>${vm.bets.BET2.state}</span></div><div class="bet-actions"><input class="stake" value="${vm.bets.BET2.stake||1}" aria-label="Bet 2 stake"><button data-slot="BET2" class="${vm.bets.BET2.state==="ACTIVE"?"cash":""}">${actionLabel(provider.snapshot(),"BET2")}</button></div></div>
      <div class="support"><div class="support-row"><span>Round</span><strong>${vm.roundState}</strong></div><div class="support-row"><span>Balance</span><strong>SIMULATION</strong></div></div></aside>`;
    root.querySelectorAll<HTMLButtonElement>("button[data-slot]").forEach(btn=>btn.onclick=()=>{const id=btn.dataset.slot as "BET1"|"BET2";const s=provider.snapshot();const b=s.bets[id];if(s.round.state==="BETTING_OPEN"&&b.state==="IDLE"){const input=btn.parentElement?.querySelector<HTMLInputElement>("input");provider.placeBet({slot:id,stake:Number(input?.value||1)});}else if(s.round.state==="FLYING"&&(b.state==="BET_PLACED"||b.state==="ACTIVE"))provider.cashOut(id);render();});};
  provider.subscribe(render);render();return root;
}
