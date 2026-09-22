import { SimulatorProvider, deterministicCrash } from "./simulator";
import { BET_SLOTS, cashOutPayout, normalizeAutoCashOut, validateStake } from "./betRules";

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

console.log("AVIATOR FOUNDATION VERIFIED", a);
