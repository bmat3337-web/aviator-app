import type { GameSnapshot, SlotId } from "../domain/game";
import type { CashOutResult, PlaceBetRequest } from "../domain/IGameProvider";

export interface ServerGameSession {
  getSnapshot(): Promise<GameSnapshot>;
  placeBet(playerId: string, request: PlaceBetRequest, idempotencyKey: string): Promise<void>;
  cashOut(playerId: string, slot: SlotId, idempotencyKey: string): Promise<CashOutResult>;
}

/** Adapter boundary for an authorized external game provider. */
export interface AuthorizedGameProvider {
  readonly name: string;
  readonly version: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getRound(roundId: string): Promise<GameSnapshot>;
  placeBet(request: PlaceBetRequest): Promise<void>;
  cashOut(slot: SlotId): Promise<CashOutResult>;
}
