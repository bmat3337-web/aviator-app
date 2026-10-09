import { SimulatorProvider, deterministicCrash } from "./simulator";
import { BET_SLOTS, cashOutPayout, normalizeAutoCashOut, validateStake } from "./betRules";
import { shouldPlaceAutoBet } from "../ui/autoBetQueue";

const seed = "AVIATOR-DEMO-001";
const a = Array.from({ length: 10 }, (_, i) => deterministicCrash(seed, i));
const b = Array.from({ length: 10 }, (_, i) => deterministicCrash(seed, i));

if (a.join(",") !== b.join(",")) throw new Error("Deterministic replay failed");
if (BET_SLOTS.join(",") !== "BET1,BET2") throw new Error("Dual-slot registry failed");
if (validateStake(2.345) !== 2.35) throw new Error("Stake normalization failed");
if (normalizeAutoCashOut(2.345) !== 2.35) throw new Error("Auto cash-out normalization failed");
if (cashOutPayout(2, 2.5) !== 5) throw new Error("Payout calculation failed");

const p = new SimulatorProvider(seed, 0);
p.start();
p.advance();
p.placeBet({ slot: "BET1", stake: 1, autoCashOut: 2 });
p.placeBet({ slot: "BET2", stake: 2 });

p.advance();
p.advance();
const active = p.snapshot();
if (active.round.state !== "FLYING") throw new Error("Flight transition failed");
if (!["ACTIVE", "CASHED_OUT"].includes(active.bets.BET1.state)) throw new Error("Bet 1 lifecycle failed");
if (!["ACTIVE", "CASHED_OUT"].includes(active.bets.BET2.state)) throw new Error("Bet 2 lifecycle failed");

for (let i = 0; i < 40 && p.snapshot().round.state !== "CRASH"; i += 1) {
  p.advance();
}

const s = p.snapshot();
if (!["BET1", "BET2"].every((id) => id in s.bets)) {
  throw new Error("Dual-slot model failed");
}
if (s.round.state !== "CRASH") throw new Error("Crash transition not reached");

const auto = new SimulatorProvider(seed, 0);
auto.start();
auto.advance(); // BETTING_OPEN
auto.placeBet({ slot: "BET1", stake: 3, autoBet: true, autoCashOut: null });
auto.advance(); // BETTING_CLOSED
auto.advance(); // FLYING
for (let i = 0; i < 40 && auto.snapshot().round.state !== "CRASH"; i += 1) auto.advance();
if (auto.snapshot().round.state !== "CRASH") throw new Error("Auto-bet round did not crash");
auto.advance(); // next deterministic round
if (auto.snapshot().round.state !== "WAITING") throw new Error("Simulator did not reset to WAITING after crash");
if (auto.snapshot().round.sequenceIndex !== 1) throw new Error("Round sequence index did not advance");
if (auto.snapshot().bets.BET1.state !== "IDLE") throw new Error("New round retained a terminal bet state");

const boundary = new SimulatorProvider(seed, 0);
boundary.start();
boundary.advance();
boundary.placeBet({ slot: "BET1", stake: 2, autoCashOut: deterministicCrash(seed, 0) });
boundary.advance();
boundary.advance();
for (let i = 0; i < 40 && boundary.snapshot().round.state !== "CRASH"; i += 1) boundary.advance();
if (boundary.snapshot().bets.BET1.state !== "CRASHED") {
  throw new Error("A cash-out target at the crash boundary must not win");
}


const queueInput = {
  enabled: true,
  roundState: "BETTING_OPEN" as const,
  roundId: "round-1",
  slotState: "IDLE" as const,
  skipRoundId: null as string | null,
  placedRoundId: null as string | null,
};
if (shouldPlaceAutoBet({ ...queueInput, roundState: "WAITING" })) throw new Error("Auto Bet must wait while the round is WAITING");
if (!shouldPlaceAutoBet({ ...queueInput, roundState: "BETTING_OPEN" })) throw new Error("Auto Bet enabled before opening was not placed when betting opened");
if (shouldPlaceAutoBet({ ...queueInput, skipRoundId: "round-1" })) throw new Error("Enabling during an open window must skip that round");
if (!shouldPlaceAutoBet({ ...queueInput, roundId: "round-2", skipRoundId: "round-1" })) throw new Error("Skipped round did not release queue for next round");
if (shouldPlaceAutoBet({ ...queueInput, enabled: false, roundId: "round-2" })) throw new Error("Disabled Auto Bet attempted placement");
if (!shouldPlaceAutoBet({ ...queueInput, roundId: "round-3", placedRoundId: "round-2" })) throw new Error("Persistent queue failed on later round");
if (shouldPlaceAutoBet({ ...queueInput, placedRoundId: "round-1" })) throw new Error("Duplicate placement in same round was allowed");
if (!shouldPlaceAutoBet({ ...queueInput, roundId: "round-2", placedRoundId: "round-1" })) throw new Error("Slot queue did not permit a new round");
if (shouldPlaceAutoBet({ ...queueInput, slotState: "BET_PLACED" })) throw new Error("Non-idle slot accepted duplicate automatic placement");
if (shouldPlaceAutoBet({ ...queueInput, roundState: "FLYING" })) throw new Error("Automatic placement allowed during flight");

console.log("AVIATOR FOUNDATION VERIFIED", a);
