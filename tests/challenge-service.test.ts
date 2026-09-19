import { describe, expect, it } from "vitest";
import { InMemoryChallengeStore, submitPrediction, settleRound } from "../src/challenge-service";

const challenge={challengeId:"c1",title:"Aviator Challenge",state:"LIVE" as const,totalRounds:2,currentRound:0,startsAt:"2026-01-01T00:00:00Z",endsAt:"2026-01-01T01:00:00Z"};

describe("async challenge service",()=>{
 it("accepts and settles a prediction",async()=>{
  const store=new InMemoryChallengeStore();await store.save(challenge);
  await submitPrediction(store,{challengeId:"c1",participantId:"u1",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:01Z",signalVersion:"1.0.0"});
  expect((await settleRound(store,"c1",1,"BASE"))[0].points).toBe(1);
 });
 it("is idempotent for repeated settlement",async()=>{
  const store=new InMemoryChallengeStore();await store.save(challenge);
  await submitPrediction(store,{challengeId:"c1",participantId:"u1",roundNumber:1,targetState:"BASE",submittedAt:"2026-01-01T00:00:01Z",signalVersion:"1.0.0"});
  await settleRound(store,"c1",1,"BASE"); await settleRound(store,"c1",1,"BASE");
  expect((await store.scores("c1"))[0].points).toBe(1);
 });
});