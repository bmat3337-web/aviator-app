import type { GameSnapshot, SlotId } from "./game";

export interface PlaceBetRequest {
  slot: SlotId;
  stake: number;
  autoBet?: boolean;
  autoCashOut?: number | null;
}

export interface CashOutResult {
  slot: SlotId;
  multiplier: number;
  payout: number;
}

/** Provider boundary. Production adapters must be based on authorized provider contracts. */
export interface IGameProvider {
  snapshot(): GameSnapshot;
  subscribe(listener: (snapshot: GameSnapshot) => void): () => void;
  start(): void;
  stop(): void;
  placeBet(request: PlaceBetRequest): void;
  cashOut(slot: SlotId): CashOutResult;
  reset(): void;
}
