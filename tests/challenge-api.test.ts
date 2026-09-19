import { describe, expect, it } from "vitest";
import { ChallengeServiceApi } from "../src/challenge-api";
import { InMemoryChallengeStore } from "../src/challenge-service";

describe("challenge api",()=>{
  it("orders leaderboard deterministically",async()=>{
    const store=new InMemoryChallengeStore();
    await store.save({challengeId:"c1",title:"Challenge",state:"LIVE",totalRounds:2,currentRound:0,startsAt:"2026-01-01T00:00:00Z",endsAt:"2026-01-01T01:00:00Z"});
    const api=new ChallengeServiceApi(store);
    await store.addPrediction({challengeId:"c1",participantId:"b",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:00Z",signalVersion:"1.0.0"});
    await store.addPrediction({challengeId:"c1",participantId:"a",roundNumber:1,targetState:"LOW",submittedAt:"2026-01-01T00:00:00Z",signalVersion:"1.0.0"});
    await store.saveScore({challengeId:"c1",participantId:"b",points:1,correct:1,settledRounds:1});
    await store.saveScore({challengeId:"c1",participantId:"a",points:0,correct:0,settledRounds:1});
    expect((await api.leaderboard("c1")).map(x=>x.participantId)).toEqual(["b","a"]);
  });
});