import { describe, expect, it } from "vitest";
import { classifyRounds } from "../src/analysis";
import { conditionalNextStateRate } from "../src/statistics";

const r=(sequence:number,multiplier:number)=>({roundId:String(sequence),sequence,multiplier,timestamp:new Date(sequence*1000).toISOString(),source:"manual" as const});

describe("conditional statistics",()=>{
  it("calculates observed state transitions without predicting",()=>{
    const rounds=classifyRounds([r(1,1.2),r(2,2.1),r(3,2.2),r(4,1.3)]);
    const rate=conditionalNextStateRate(rounds,"LOW","BASE");
    expect(rate.sampleSize).toBe(1);
    expect(rate.occurrences).toBe(1);
    expect(rate.rate).toBe(1);
  });
});
