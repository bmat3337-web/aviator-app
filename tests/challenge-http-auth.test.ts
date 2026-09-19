import { describe, expect, it } from "vitest";
import { handleChallengeHttp } from "../src/challenge-http";
import { ChallengeServiceApi } from "../src/challenge-api";
import { InMemoryChallengeStore } from "../src/challenge-service";

describe("authenticated challenge http boundary",()=>{
  it("requires telegram authentication for predictions",async()=>{
    const api=new ChallengeServiceApi(new InMemoryChallengeStore());
    const r=await handleChallengeHttp(api,{method:"POST",path:"/api/v1/challenges/c1/predictions",body:{}}, "test-token");
    expect(r.status).toBe(401);
  });
  it("never exposes client-triggered settlement",async()=>{
    const api=new ChallengeServiceApi(new InMemoryChallengeStore());
    const r=await handleChallengeHttp(api,{method:"POST",path:"/api/v1/challenges/c1/settlement",body:{roundNumber:1,actualState:"BASE"}}, "test-token");
    expect([401,403]).toContain(r.status);
  });
});