import { SimulatorProvider } from "../domain/simulator";
import { canCashOut, canPlaceBet, cashOutPayout } from "../domain/betRules";
import { withIdempotency, type IdempotencyRecord, type IdempotencyStore } from "./idempotency";

class MemoryIdempotencyStore implements IdempotencyStore {
  private readonly records = new Map<string, IdempotencyRecord>();
  async get(scope: string, key: string): Promise<IdempotencyRecord | null> {
    return this.records.get(scope + ":" + key) ?? null;
  }
  async put(record: IdempotencyRecord): Promise<void> {
    this.records.set(record.scope + ":" + record.key, record);
  }
}

const provider = new SimulatorProvider("INTEGRATION-001", 0);
provider.start();
provider.advance();
const waiting = provider.snapshot();
if (waiting.round.state !== "BETTING_OPEN") throw new Error("Betting window did not open");
if (!canPlaceBet(waiting.round.state, waiting.bets.BET1)) throw new Error("Bet 1 was not placeable");
if (!canPlaceBet(waiting.round.state, waiting.bets.BET2)) throw new Error("Bet 2 was not placeable");

provider.placeBet({ slot: "BET1", stake: 1, autoCashOut: 2 });
provider.placeBet({ slot: "BET2", stake: 2 });
provider.advance();
provider.advance();
const flying = provider.snapshot();
if (flying.round.state !== "FLYING") throw new Error("Flight did not start");
if (!canCashOut(flying.round.state, flying.bets.BET1)) throw new Error("Bet 1 was not cash-out eligible");
if (cashOutPayout(2, 1.5) !== 3) throw new Error("Payout invariant failed");

const store = new MemoryIdempotencyStore();
let executions = 0;
const first = await withIdempotency(store, "cashout", "req-1", "hash-a", async () => {
  executions += 1;
  return { accepted: true, execution: executions };
});
const replay = await withIdempotency(store, "cashout", "req-1", "hash-a", async () => {
  executions += 1;
  return { accepted: true, execution: executions };
});
if (executions !== 1 || first.execution !== replay.execution) throw new Error("Idempotency replay failed");
let collisionRejected = false;
try {
  await withIdempotency(store, "cashout", "req-1", "hash-b", async () => ({ accepted: true }));
} catch (error) {
  collisionRejected = error instanceof Error && error.message === "IDEMPOTENCY_KEY_REUSED";
}
if (!collisionRejected) throw new Error("Idempotency collision was not rejected");

console.log("AVIATOR APPLICATION INTEGRATION VERIFIED");
