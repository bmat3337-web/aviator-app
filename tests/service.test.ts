import { describe, expect, it } from "vitest";
import { AviatorAnalysisService } from "../src/service";
import { InMemoryRoundRepository } from "../src/repository";

const r=(sequence:number,multiplier:number)=>({roundId:String(sequence),sequence,multiplier,timestamp:new Date(sequence*1000).toISOString(),source:"manual" as const});

describe("analysis service",()=>{
  it("stores rounds and produces an auditable snapshot",async()=>{
    const service=new AviatorAnalysisService(new InMemoryRoundRepository());
    await service.ingest(r(1,1.2));
    await service.ingest(r(2,2.2));
    const snapshot=await service.snapshot();
    expect(snapshot.rounds).toHaveLength(2);
    expect(snapshot.analysis.sampleSize).toBe(2);
    expect(snapshot.signal.signalVersion).toBe("1.0.0");
  });
});