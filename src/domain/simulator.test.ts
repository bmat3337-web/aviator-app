import { SimulatorProvider, deterministicCrash } from "./simulator";

const seed = "AVIATOR-DEMO-001";
const a = Array.from({ length: 10 }, (_, i) => deterministicCrash(seed, i));
const b = Array.from({ length: 10 }, (_, i) => deterministicCrash(seed, i));

if (a.join(",") !== b.join(",")) throw new Error("Deterministic replay failed");

const p = new SimulatorProvider(seed, 0);
p.start();
p.advance();
p.placeBet({ slot: "BET1", stake: 1, autoCashOut: 2 });
p.placeBet({ slot: "BET2", stake: 2 });

for (let i = 0; i < 40 && p.snapshot().round.state !== "CRASH"; i += 1) {
  p.advance();
}

const s = p.snapshot();
if (!["BET1", "BET2"].every((id) => id in s.bets)) {
  throw new Error("Dual-slot model failed");
}
if (s.round.state !== "CRASH") throw new Error("Crash transition not reached");

console.log("AVIATOR FOUNDATION VERIFIED", a);
