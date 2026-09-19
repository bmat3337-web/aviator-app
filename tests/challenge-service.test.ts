import { describe, expect, it } from "vitest";
import { InMemoryChallengeStore, submitPrediction, settleRound } from "../src/challenge-service";

const challenge={challengeId:"c1",title:"Aviator Challenge",state:"LIVE" as const,totalRounds:3,currentRound:0,startsAt:"2026-01-01T00:00:00Z",endsAt:"2026-01-01T01:00:00Z"};

describe("challenge participation service",()=>{
  it("accepts one prediction for the open round",()=>{
    const store=new InMemoryChallengeStore();store.save(challenge);
    submitPrediction(store,{challengeId:"c1",participantId:"u1",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:01Z",signalVersion:"1.0.0"});
    expect(store.predictions("c1")).toHaveLength(1);
  });
  it("settles only submitted predictions",()=>{
    const store=new InMemoryChallengeStore();store.save(challenge);
    submitPrediction(store,{challengeId:"c1",participantId:"u1",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:01Z",signalVersion:"1.0.0"});
    expect(settleRound(store,"c1",1,"BASE")[0].points).toBe(1);
  });
});