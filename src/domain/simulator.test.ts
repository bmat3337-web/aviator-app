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
p.placeBet({ slot: "BET1", stake: 1, autoBet: true, autoCashOut: 2 });
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

p.advance();
if (p.snapshot().round.state !== "RESULT") throw new Error("CRASH did not progress to RESULT");
p.advance();
if (p.snapshot().round.state !== "NEXT_ROUND") throw new Error("RESULT did not progress to NEXT_ROUND");
const completedRoundId = p.snapshot().round.id;
p.advance();
const next = p.snapshot();
if (next.round.state !== "WAITING") throw new Error("NEXT_ROUND did not initialize WAITING");
if (next.round.id === completedRoundId) throw new Error("Round identifier did not advance");
if (next.round.sequenceIndex !== 1) throw new Error("Round sequence index did not advance");
if (next.bets.BET1.state !== "IDLE") throw new Error("Bet 1 state was not reset");
if (next.bets.BET1.autoBet !== true) throw new Error("Bet 1 Auto Bet preference was not preserved");
if (next.bets.BET1.stake !== 1) throw new Error("Bet 1 stake preference was not preserved");
p.advance(); // WAITING -> BETTING_OPEN
p.advance(); // Auto Bet placement, then BETTING_CLOSED
if (p.snapshot().bets.BET1.state !== "BET_PLACED") throw new Error("Auto Bet did not place in the next eligible round");
if (p.snapshot().bets.BET2.state !== "IDLE") throw new Error("Bet 2 changed despite Auto Bet being disabled");

p.stop();
const stoppedSnapshot = p.snapshot();
p.advance();
if (p.snapshot().round.state !== stoppedSnapshot.round.state) throw new Error("Stopped simulator advanced");

console.log("AVIATOR FOUNDATION VERIFIED", a);
