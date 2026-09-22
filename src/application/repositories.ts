export interface RoundRecord {
  roundId: string;
  providerRoundId: string | null;
  sequence: number;
  state: import("../domain/game").RoundState;
  crashMultiplier: number | null;
  createdAt: string;
  closedAt: string | null;
}

export interface BetRecord {
  betId: string;
  roundId: string;
  playerId: string;
  slot: import("../domain/game").SlotId;
  stakeMinorUnits: bigint;
  state: import("../domain/game").BetState;
  autoCashOut: number | null;
  cashOutMultiplier: number | null;
  payoutMinorUnits: bigint;
  createdAt: string;
  settledAt: string | null;
}

export interface RoundRepository {
  get(roundId: string): Promise<RoundRecord | null>;
  append(record: RoundRecord): Promise<void>;
  updateState(roundId: string, state: RoundRecord["state"], closedAt?: string): Promise<void>;
}

export interface BetRepository {
  get(betId: string): Promise<BetRecord | null>;
  append(record: BetRecord): Promise<void>;
  settle(betId: string, state: BetRecord["state"], payoutMinorUnits: bigint, cashOutMultiplier: number | null, settledAt: string): Promise<void>;
}
