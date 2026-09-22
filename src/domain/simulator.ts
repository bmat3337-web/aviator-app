import type {
  BetSlot,
  GameSnapshot,
  RoundState,
  SlotId,
} from "./game";
import type {
  CashOutResult,
  IGameProvider,
  PlaceBetRequest,
} from "./IGameProvider";
import {
  BET_SLOTS,
  cashOutPayout,
  canCashOut,
  canPlaceBet,
  normalizeAutoCashOut,
  validateStake,
} from "./betRules";

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function deterministicCrash(seed: string, sequenceIndex: number): number {
  const value = hash(seed + ":" + sequenceIndex);
  const normalized = (value + 1) / 4294967297;
  const raw = 1 + normalized * 7;
  return Math.max(1.01, Number(raw.toFixed(2)));
}

function createBet(slot: SlotId): BetSlot {
  return {
    slot,
    state: "IDLE",
    stake: 0,
    multiplier: null,
    payout: 0,
    autoBet: false,
    autoCashOut: null,
  };
}

export class SimulatorProvider implements IGameProvider {
  private readonly seed: string;
  private sequenceIndex: number;
  private running = false;
  private listeners = new Set<(snapshot: GameSnapshot) => void>();
  private current: GameSnapshot;

  constructor(seed: string, sequenceIndex = 0) {
    this.seed = seed;
    this.sequenceIndex = sequenceIndex;
    this.current = this.createRound("WAITING");
  }

  private createRound(state: RoundState): GameSnapshot {
    const crashMultiplier = deterministicCrash(this.seed, this.sequenceIndex);
    return {
      round: {
        id: "SIM-" + this.sequenceIndex.toString().padStart(6, "0"),
        state,
        multiplier: 1,
        crashMultiplier,
        seed: this.seed,
        sequenceIndex: this.sequenceIndex,
        playerCount: 42,
      },
      bets: {
        BET1: createBet("BET1"),
        BET2: createBet("BET2"),
      },
    };
  }

  snapshot(): GameSnapshot {
    return structuredClone(this.current);
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  start(): void {
    this.running = true;
  }

  stop(): void {
    this.running = false;
  }

  reset(): void {
    this.sequenceIndex = 0;
    this.current = this.createRound("WAITING");
    this.emit();
  }

  private emit(): void {
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private transition(state: RoundState): void {
    this.current.round.state = state;
    this.emit();
  }

  advance(): void {
    if (!this.running) return;

    const state = this.current.round.state;

    if (state === "WAITING") {
      this.transition("BETTING_OPEN");
      return;
    }

    if (state === "BETTING_OPEN") {
      for (const slot of BET_SLOTS) {
        const bet = this.current.bets[slot];
        if (bet.autoBet && bet.state === "IDLE" && bet.stake > 0) {
          bet.state = "BET_PLACED";
        }
      }
      this.transition("BETTING_CLOSED");
      return;
    }

    if (state === "BETTING_CLOSED") {
      for (const slot of BET_SLOTS) {
        const bet = this.current.bets[slot];
        if (bet.state === "BET_PLACED") bet.state = "ACTIVE";
      }
      this.transition("FLYING");
      return;
    }

    if (state === "FLYING") {
      const nextMultiplier = Number(
        Math.min(this.current.round.crashMultiplier, this.current.round.multiplier + 0.25).toFixed(2),
      );
      this.current.round.multiplier = nextMultiplier;

      for (const slot of BET_SLOTS) {
        const bet = this.current.bets[slot];
        if (
          bet.state === "ACTIVE" &&
          bet.autoCashOut !== null &&
          nextMultiplier >= bet.autoCashOut
        ) {
          this.cashOut(slot);
        }
      }

      if (nextMultiplier >= this.current.round.crashMultiplier) {
        for (const slot of BET_SLOTS) {
          const bet = this.current.bets[slot];
          if (bet.state === "ACTIVE") {
            bet.state = "CRASHED";
            bet.multiplier = null;
            bet.payout = 0;
          }
        }
        this.transition("CRASH");
        return;
      }

      this.emit();
    }
  }

  placeBet(request: PlaceBetRequest): void {
    const bet = this.current.bets[request.slot];
    if (!canPlaceBet(this.current.round.state, bet)) return;

    try {
      bet.stake = validateStake(request.stake);
      bet.autoBet = request.autoBet === true;
      bet.autoCashOut = normalizeAutoCashOut(request.autoCashOut);
    } catch {
      return;
    }

    bet.state = "BET_PLACED";
    this.emit();
  }

  cashOut(slot: SlotId): CashOutResult {
    const bet = this.current.bets[slot];
    if (!canCashOut(this.current.round.state, bet)) {
      throw new Error("Bet slot is not cash-out eligible");
    }

    const multiplier = this.current.round.multiplier;
    const payout = cashOutPayout(bet.stake, multiplier);

    bet.state = "CASHED_OUT";
    bet.multiplier = multiplier;
    bet.payout = payout;
    this.emit();

    return { slot, multiplier, payout };
  }
}
