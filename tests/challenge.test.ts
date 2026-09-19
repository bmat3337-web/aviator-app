import { describe, expect, it } from "vitest";
import { settleChallenge, validateSignalForChallenge, Challenge } from "../src/challenge";
import { AnalysisSignal } from "../src/signal";

const challenge: Challenge={challengeId:"c1",title:"Aviator Challenge",state:"SETTLEMENT",totalRounds:3,currentRound:3,startsAt:"2026-01-01T00:00:00Z",endsAt:"2026-01-01T01:00:00Z"};

describe("challenge engine",()=>{
  it("settles deterministic participant scores",()=>{
    const predictions=[{challengeId:"c1",participantId:"u1",roundNumber:1,targetState:"LOW" as const,submittedAt:"2026-01-01T00:00:00Z",signalVersion:"1.0.0"}];
    expect(settleChallenge(challenge,predictions,["LOW","BASE","HIGH"])[0].points).toBe(1);
  });
  it("requires evidence before a signal enters a challenge",()=>{
    const signal={signalVersion:"1.0.0",direction:"OBSERVE" as const,currentState:"LOW" as const,regime:"NORMAL" as const,targetState:"BASE" as const,observedRate:.5,sampleSize:5,confidence:"LOW" as const,rationale:"x"} as AnalysisSignal;
    expect(validateSignalForChallenge(signal)).toBe(false);
  });
});