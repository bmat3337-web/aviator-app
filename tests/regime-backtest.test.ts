import { describe, expect, it } from "vitest";
import { classifyRounds } from "../src/analysis";
import { detectRegime } from "../src/regime";
import { backtestMostFrequentNextState } from "../src/backtest";

const r=(sequence:number,multiplier:number)=>({roundId:String(sequence),sequence,multiplier,timestamp:new Date(sequence*1000).toISOString(),source:"manual" as const});

describe("regime and backtest layer",()=>{
  it("uses only the requested rolling window",()=>{
    const rounds=classifyRounds(Array.from({length:10},(_,i)=>r(i+1,1.2)));
    const result=detectRegime(rounds,5);
    expect(result.windowSize).toBe(5);
    expect(result.regime).toBe("QUIET");
  });
  it("returns auditable backtest metrics",()=>{
    const rounds=classifyRounds([r(1,1.2),r(2,2.1),r(3,2.2),r(4,2.3),r(5,1.3),r(6,2.4)]);
    const result=backtestMostFrequentNextState(rounds,4);
    expect(result.observations).toBeGreaterThan(0);
    expect(result.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.accuracy).toBeLessThanOrEqual(1);
  });
});