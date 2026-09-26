export type RoundState =
  | "WAITING" | "PREPARING" | "BETTING_OPEN" | "BETTING_CLOSED" | "FLYING"
  | "CRASH" | "RESULT" | "NEXT_ROUND";

export type BetState =
  | "IDLE" | "BETTING_OPEN" | "BET_PLACED" | "ACTIVE"
  | "CASHED_OUT" | "CRASHED" | "SETTLED";

export type SlotId = "BET1" | "BET2";

export interface Round {
  id: string;
  state: RoundState;
  multiplier: number;
  crashMultiplier: number;
  seed: string;
  sequenceIndex: number;
  playerCount: number;
}

export interface BetSlot {
  slot: SlotId;
  state: BetState;
  stake: number;
  multiplier: number | null;
  payout: number;
  autoBet: boolean;
  autoCashOut: number | null;
}

export interface GameSnapshot {
  round: Round;
  bets: Record<SlotId, BetSlot>;
}
