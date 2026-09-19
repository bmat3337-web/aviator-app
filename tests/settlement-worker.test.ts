import { describe, expect, it, vi } from "vitest";
import { createSettlementWorker } from "../src/settlement-worker";

describe("settlement worker", () => {
  it("delegates settlement to the server-side ChallengeApi", async () => {
    const settle = vi.fn().mockResolvedValue(undefined);
    const api = {
      getChallenge: vi.fn(),
      submit: vi.fn(),
      settle,
      leaderboard: vi.fn(),
    };
    const worker = createSettlementWorker(api);
    await worker.process({ challengeId:"c1", roundNumber:1, actualState:"HIGH" });
    expect(settle).toHaveBeenCalledWith("c1",1,"HIGH");
  });

  it("rejects invalid round numbers before reaching persistence", async () => {
    const settle = vi.fn();
    const api = { getChallenge:vi.fn(), submit:vi.fn(), settle, leaderboard:vi.fn() };
    const worker = createSettlementWorker(api);
    await expect(worker.process({challengeId:"c1",roundNumber:0,actualState:"LOW"})).rejects.toThrow("INVALID_ROUND_NUMBER");
    expect(settle).not.toHaveBeenCalled();
  });
});
