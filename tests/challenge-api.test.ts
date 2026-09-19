import { describe, expect, it } from "vitest";
import { InMemoryChallengeApi } from "../src/challenge-api";
import { InMemoryChallengeStore, submitPrediction } from "../src/challenge-service";

describe("challenge api",()=>{
  it("orders leaderboard deterministically",()=>{
    const store=new InMemoryChallengeStore();
    store.save({challengeId:"c1",title:"Challenge",state:"LIVE",totalRounds:2,currentRound:0,startsAt:"2026-01-01T00:00:00Z",endsAt:"2026-01-01T01:00:00Z"});
    const api=new InMemoryChallengeApi(store);
    submitPrediction(store,{challengeId:"c1",participantId:"b",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:00Z",signalVersion:"1.0.0"});
    api.settle("c1",1,"BASE");
    submitPrediction(store,{challengeId:"c1",participantId:"a",roundNumber:1,targetState:"LOW",submittedAt:"2026-01-01T00:00:00Z",signalVersion:"1.0.0"});
    api.settle("c1",1,"BASE");
    expect(api.leaderboard("c1").map(x=>x.participantId)).toEqual(["b","a"]);
  });
});