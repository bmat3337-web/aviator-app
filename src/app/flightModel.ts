import type { GameSnapshot, SlotId } from "../domain/game";
import type { IGameProvider } from "../domain/IGameProvider";

export interface FlightViewModel {
  roundState: GameSnapshot["round"]["state"];
  multiplier: number;
  crashMultiplier: number;
  roundId: string;
  playerCount: number;
  history: number[];
  bets: GameSnapshot["bets"];
}

export function createFlightViewModel(provider: IGameProvider, history: number[] = []): FlightViewModel {
  const s = provider.snapshot();
  return {
    roundState: s.round.state,
    multiplier: s.round.multiplier,
    crashMultiplier: s.round.crashMultiplier,
    roundId: s.round.id,
    playerCount: s.round.playerCount,
    history,
    bets: s.bets
  };
}

export function actionLabel(snapshot: GameSnapshot, slot: SlotId): string {
  const bet = snapshot.bets[slot];
  if (snapshot.round.state === "BETTING_OPEN" && bet.state === "IDLE") return "PLACE BET";
  if (snapshot.round.state === "FLYING" && (bet.state === "BET_PLACED" || bet.state === "ACTIVE")) return "CASH OUT";
  if (bet.state === "CASHED_OUT") return bet.payout > 0 ? `CASHED OUT · ${bet.payout.toFixed(2)}` : "CASHED OUT";
  if (bet.state === "CRASHED") return "CRASHED";
  if (bet.state === "SETTLED") return bet.payout > 0 ? `SETTLED · ${bet.payout.toFixed(2)}` : "SETTLED";
  if (snapshot.round.state === "BETTING_CLOSED") return "BETTING CLOSED";
  if (snapshot.round.state === "CRASH" || snapshot.round.state === "RESULT") return "NEXT ROUND";
  return "WAITING";
}

export function slotStatus(snapshot: GameSnapshot, slot: SlotId): string {
  const bet = snapshot.bets[slot];
  if (bet.state === "BET_PLACED" || bet.state === "ACTIVE") {
    return bet.autoCashOut !== null ? `AUTO ${bet.autoCashOut.toFixed(2)}x` : "LIVE";
  }
  if (bet.state === "CASHED_OUT") {
    return bet.multiplier !== null ? `CASHED ${bet.multiplier.toFixed(2)}x` : "CASHED OUT";
  }
  if (bet.state === "CRASHED") return "CRASHED";
  if (bet.state === "SETTLED") return `PAYOUT ${bet.payout.toFixed(2)}`;
  return bet.state.replaceAll("_", " ");
}
