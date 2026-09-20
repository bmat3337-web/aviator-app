import type { GameSnapshot, BetSlot, RoundState } from "../domain/game";

export interface FlightSnapshot extends GameSnapshot {
  readonly source: "SIMULATOR" | "SPRIBE";
  readonly receivedAt: string;
}

export function toFlightSnapshot(snapshot: GameSnapshot, source: FlightSnapshot["source"], receivedAt = new Date().toISOString()): FlightSnapshot {
  return { ...snapshot, source, receivedAt };
}

export function assertFlightSnapshot(snapshot: FlightSnapshot): void {
  if (!snapshot.round.id) throw new Error("Round id required");
  if (!Number.isFinite(snapshot.round.multiplier) || snapshot.round.multiplier < 1) throw new Error("Invalid multiplier");
  for (const slot of ["BET1", "BET2"] as const) {
    const bet: BetSlot = snapshot.bets[slot];
    if (!bet || bet.slot !== slot) throw new Error(`Missing ${slot}`);
    if (!Number.isFinite(bet.stake) || bet.stake < 0) throw new Error(`Invalid ${slot} stake`);
  }
  const states: readonly RoundState[] = ["WAITING","BETTING_OPEN","BETTING_CLOSED","FLYING","CRASH","RESULT","NEXT_ROUND"];
  if (!states.includes(snapshot.round.state)) throw new Error("Invalid round state");
}
