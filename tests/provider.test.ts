import { describe, expect, it } from "vitest";
import { normalizeProviderRound } from "../src/provider";

describe("provider ingestion", () => {
  it("normalizes an external provider round into the canonical model", () => {
    const round = normalizeProviderRound({
      roundId: "provider-001",
      sequence: 1,
      multiplier: 2.35,
      timestamp: "2026-09-19T20:00:00.000Z",
      metadata: { externalId: "abc" },
    });
    expect(round.roundId).toBe("provider-001");
    expect(round.sequence).toBe(1);
    expect(round.multiplier).toBe(2.35);
    expect(round.source).toBe("provider");
    expect(round.metadata).toMatchObject({ externalId: "abc", provider: true });
  });
});
