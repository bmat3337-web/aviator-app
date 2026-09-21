import type { IGameProvider } from "../domain/IGameProvider";
import { actionLabel, createFlightViewModel } from "./flightModel";
import { flightMotion } from "./flightAnimation";
import { nextEnvironment, type EnvironmentState } from "./environment";
import "./flight.css";

type SlotId = "BET1" | "BET2";
type BetMode = "BET" | "AUTO";

export function FlightScreen(provider: IGameProvider): HTMLElement {
  const root = document.createElement("main");
  root.className = "aviator-shell";
  let environment: EnvironmentState = { mode: "AUTO", environment: "DAY", intensity: 0.2 };
  const autoBet: Record<SlotId, boolean> = { BET1: false, BET2: false };
  const autoCashOut: Record<SlotId, number | null> = { BET1: null, BET2: null };
  const betMode: Record<SlotId, BetMode> = { BET1: "BET", BET2: "BET" };
  const stake: Record<SlotId, number> = { BET1: 0.1, BET2: 0.2 };

  const render = () => {
    const vm = createFlightViewModel(provider, [1.23, 4.56, 1.08, 12.64, 3.28, 1.45, 3.92, 2.11]);
    environment = nextEnvironment(environment, vm.multiplier);
    const motion = flightMotion(vm.multiplier, vm.crashMultiplier);
    const snapshot = provider.snapshot();
    const slot = (id: SlotId) => vm.bets[id];

    const action = (id: SlotId) => actionLabel(snapshot, id);
    const canBet = (id: SlotId) => snapshot.round.state === "BETTING_OPEN" && slot(id).state === "IDLE";
    const canCash = (id: SlotId) => snapshot.round.state === "FLYING" && (slot(id).state === "BET_PLACED" || slot(id).state === "ACTIVE");

    const betCard = (id: SlotId) => {
      const active = canBet(id) || canCash(id);
      return '<section class="bet-card '+(active ? "is-active" : "")+'">' +
        '<div class="bet-head"><div><span class="bet-name">'+(id === "BET1" ? "Bet 1" : "Bet 2")+'</span><span class="bet-state">'+slot(id).state.replaceAll("_"," ")+'</span></div>' +
        '<label class="toggle-label"><span>Auto Cash Out</span><input type="checkbox" data-auto-cash-toggle="'+id+'" '+(autoCashOut[id] !== null ? "checked" : "")+'></label></div>' +
        '<div class="bet-mode" role="tablist" aria-label="'+id+' mode"><button type="button" data-mode="'+id+'-BET" class="'+(betMode[id] === "BET" ? "selected" : "")+'">Bet</button><button type="button" data-mode="'+id+'-AUTO" class="'+(betMode[id] === "AUTO" ? "selected" : "")+'">Auto</button></div>' +
        '<div class="stake-control"><button type="button" data-step="'+id+':-0.1" aria-label="Decrease stake">−</button><output>'+stake[id].toFixed(2)+'</output><button type="button" data-step="'+id+':0.1" aria-label="Increase stake">+</button></div>' +
        '<div class="quick-stakes"><button type="button" data-quick="'+id+':0.1">0.10</button><button type="button" data-quick="'+id+':0.2">0.20</button><button type="button" data-quick="'+id+':1">1</button><button type="button" data-quick="'+id+':5">5</button></div>' +
        '<label class="auto-cash-field"><span>Auto Cash Out</span><input data-auto-cash="'+id+'" value="'+(autoCashOut[id] ?? "")+'" placeholder="2.00" inputmode="decimal" aria-label="'+id+' auto cash out"></label>' +
        '<label class="auto-bet-field"><input type="checkbox" data-auto-bet="'+id+'" '+(autoBet[id] ? "checked" : "")+'><span>Auto Bet</span></label>' +
        '<button class="primary-bet-action" data-slot="'+id+'" '+(active ? "" : "disabled")+'>'+action(id)+'</button>' +
      '</section>';
    };

    root.innerHTML =
      '<header class="aviator-header"><button class="menu-button" type="button" aria-label="Open menu">☰</button><div class="header-brand"><span>✈ AVIATOR</span><small>ONE GAME. ONE FLIGHT. ONE PREMIUM EXPERIENCE.</small></div><div class="header-actions"><div class="header-balance">$ 250.00</div><button class="deposit-button" type="button" aria-label="Deposit">+</button></div></header>' +
      '<aside class="desktop-rail left-rail"><div class="rail-title">● Live Round</div><div class="rail-subtitle">● Round #'+vm.roundId+'</div><div class="rail-status">'+vm.roundState.replaceAll("_"," ")+'</div><div class="rail-history">'+vm.history.map((x) => '<div><span class="history-pill">'+x.toFixed(2)+'x</span><small>recent</small></div>').join("")+'</div><button class="rail-link" type="button">Full History →</button></aside>' +
      '<section class="panel flight"><div class="flight-top"><div><strong>LIVE FLIGHT</strong><div class="round">ROUND #'+vm.roundId+' · '+vm.roundState.replaceAll("_"," ")+'</div></div><div class="online">● '+vm.playerCount.toLocaleString()+' Online</div></div><div class="next-round"><span>NEXT ROUND</span><strong>00:12</strong></div><div class="flight-scene"></div><div class="flight-state">'+(vm.roundState === "FLYING" ? "FLYING" : vm.roundState.replaceAll("_"," "))+'</div><div class="multiplier" aria-live="polite">'+vm.multiplier.toFixed(2)+'x</div><div class="trajectory"></div><div class="history">'+vm.history.map((x) => '<span class="chip">'+x.toFixed(2)+'x</span>').join("")+'</div></section>' +
      '<aside class="desktop-rail right-rail"><div class="rail-title">● Live Players <strong>'+vm.playerCount.toLocaleString()+'</strong></div><div class="player-list"><div>TruWin <span>2.14x</span></div><div>ZimLegend <span>1.87x</span></div><div>NiaPro <span>—</span></div><div>SkyBet <span>3.28x</span></div><div>Kuda777 <span>1.56x</span></div><div>Makanaka <span>1.56x</span></div></div><div class="stats-box"><div>♙ Players <strong>'+vm.playerCount.toLocaleString()+'</strong></div><div>♜ Total Bets <strong>ZWS 12,548</strong></div><div>⌁ Highest <strong>152.36x</strong></div><div>⌁ Lowest <strong>1.00x</strong></div></div></aside>' +
      '<section class="bet-workspace"><div class="bet-grid">'+betCard("BET1")+betCard("BET2")+'</div><div class="daily-challenge"><span class="challenge-icon">♜</span><div><strong>DAILY CHALLENGE</strong><small>Climb the leaderboard. Win rewards.</small></div><span class="challenge-time">07:38:21</span><span class="chevron">›</span></div><div class="utility-grid"><button type="button">◈<span>How to Play</span></button><button type="button">▤<span>Game Rules</span></button><button type="button">♢<span>Game Limits</span></button><button type="button">◇<span>Probably Fair</span></button></div></section>' +
      '<footer class="trust-strip"><span>⌾ Secure <small>Your funds, our priority</small></span><span>♢ Fair <small>Provably fair gaming</small></span><span>◎ Global <small>Play anytime, anywhere</small></span><span>♡ Responsible <small>Play with control</small></span></footer>';

    root.querySelectorAll<HTMLInputElement>("input[data-auto-cash]").forEach((input) => input.onchange = () => {
      const id = input.dataset.autoCash as SlotId;
      const n = Number(input.value);
      autoCashOut[id] = Number.isFinite(n) && n >= 1 ? n : null;
      render();
    });
    root.querySelectorAll<HTMLInputElement>("input[data-auto-cash-toggle]").forEach((input) => input.onchange = () => {
      const id = input.dataset.autoCashToggle as SlotId;
      if (!input.checked) autoCashOut[id] = null;
      else if (autoCashOut[id] === null) autoCashOut[id] = 2;
      render();
    });
    root.querySelectorAll<HTMLInputElement>("input[data-auto-bet]").forEach((input) => input.onchange = () => {
      autoBet[input.dataset.autoBet as SlotId] = input.checked;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("button[data-mode]").forEach((button) => button.onclick = () => {
      const [id, mode] = button.dataset.mode!.split("-");
      betMode[id as SlotId] = mode as BetMode;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("button[data-step]").forEach((button) => button.onclick = () => {
      const [id, delta] = button.dataset.step!.split(":") as [SlotId, string];
      stake[id] = Math.max(0.1, Math.round((stake[id] + Number(delta)) * 100) / 100);
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("button[data-quick]").forEach((button) => button.onclick = () => {
      const [id, value] = button.dataset.quick!.split(":") as [SlotId, string];
      stake[id] = Number(value);
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("button[data-slot]").forEach((button) => button.onclick = () => {
      const id = button.dataset.slot as SlotId;
      const b = snapshot.bets[id];
      if (canBet(id)) provider.placeBet({ slot: id, stake: stake[id], autoBet: autoBet[id], autoCashOut: autoCashOut[id] });
      else if (canCash(id)) provider.cashOut(id);
      render();
    });
  };

  provider.subscribe(render);
  render();
  return root;
}
