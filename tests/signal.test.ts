import { describe, expect, it } from "vitest";
import { classifyRounds } from "../src/analysis";
import { generateSignal } from "../src/signal";

const r=(sequence:number,multiplier:number)=>({roundId:String(sequence),sequence,multiplier,timestamp:new Date(sequence*1000).toISOString(),source:"manual" as const});

describe("signal engine",()=>{
  it("refuses to issue a strong signal with insufficient history",()=>{
    const rounds=classifyRounds([r(1,1.2),r(2,2.1)]);
    expect(generateSignal(rounds).direction).toBe("OBSERVE");
  });
  it("emits auditable evidence fields",()=>{
    const rounds=classifyRounds([r(1,1.2),r(2,2.1),r(3,2.2),r(4,1.3),r(5,2.4)]);
    const signal=generateSignal(rounds);
    expect(signal.signalVersion).toBe("1.0.0");
    expect(signal.sampleSize).toBeGreaterThanOrEqual(0);
    expect(signal.rationale).toContain("Historical statistic only");
  });
});