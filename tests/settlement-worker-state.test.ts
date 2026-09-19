import { describe, expect, it } from "vitest";
import { createSettlementWorker } from "../src/settlement-worker";

describe("settlement worker authorization boundary", () => {
  it("passes only validated canonical states to the ChallengeApi", async () => {
    const settle = async (_id:string,_round:number,state:"LOW"|"MID"|"BASE"|"HIGH"|"EXTREME") => {
      expect(["LOW","MID","BASE","HIGH","EXTREME"]).toContain(state);
    };
    const api = { getChallenge:async()=>null, submit:async()=>{}, settle, leaderboard:async()=>[] };
    const worker = createSettlementWorker(api);
    await worker.process({challengeId:"c1",roundNumber:1,actualState:"EXTREME"});
  });
});
