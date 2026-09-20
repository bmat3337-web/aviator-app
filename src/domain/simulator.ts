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

const SLOT_IDS: SlotId[] = ["BET1", "BET2"];

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
      for (const slot of SLOT_IDS) {
        const bet = this.current.bets[slot];
        if (bet.autoBet && bet.state === "IDLE" && bet.stake > 0) {
          bet.state = "BET_PLACED";
        }
      }
      this.transition("BETTING_CLOSED");
      return;
    }

    if (state === "BETTING_CLOSED") {
      for (const slot of SLOT_IDS) {
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

      for (const slot of SLOT_IDS) {
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
        for (const slot of SLOT_IDS) {
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
    if (this.current.round.state !== "BETTING_OPEN") return;

    const bet = this.current.bets[request.slot];
    if (bet.state !== "IDLE") return;
    if (!Number.isFinite(request.stake) || request.stake <= 0) return;

    bet.state = "BET_PLACED";
    bet.stake = Number(request.stake.toFixed(2));
    bet.autoBet = request.autoBet === true;
    bet.autoCashOut =
      request.autoCashOut !== undefined && request.autoCashOut !== null
        ? Number(request.autoCashOut.toFixed(2))
        : null;
    this.emit();
  }

  cashOut(slot: SlotId): CashOutResult {
    const bet = this.current.bets[slot];

    if (this.current.round.state !== "FLYING") {
      throw new Error("Cash out is only available during flight");
    }

    if (bet.state !== "BET_PLACED" && bet.state !== "ACTIVE") {
      throw new Error("Bet slot is not cash-out eligible");
    }

    const multiplier = this.current.round.multiplier;
    const payout = Number((bet.stake * multiplier).toFixed(2));

    bet.state = "CASHED_OUT";
    bet.multiplier = multiplier;
    bet.payout = payout;
    this.emit();

    return { slot, multiplier, payout };
  }
}
