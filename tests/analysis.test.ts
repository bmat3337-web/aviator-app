import { describe, expect, it } from "vitest";
import { analyze, classifyRound } from "../src/analysis";

const round = (sequence: number, multiplier: number) => ({
  roundId: String(sequence),
  sequence,
  multiplier,
  timestamp: new Date(0 + sequence * 1000).toISOString(),
  source: "manual" as const,
});

describe("Aviator analysis foundation", () => {
  it("preserves the historical threshold concepts", () => {
    expect(classifyRound(round(1, 1.5)).state).toBe("LOW");
    expect(classifyRound(round(2, 1.51)).state).toBe("MID");
    expect(classifyRound(round(3, 2)).state).toBe("BASE");
    expect(classifyRound(round(4, 5)).state).toBe("HIGH");
    expect(classifyRound(round(5, 10)).state).toBe("EXTREME");
  });

  it("calculates the latest state streak deterministically", () => {
    const result = analyze([
      round(1, 1.1),
      round(2, 1.3),
      round(3, 1.2),
      round(4, 2.2),
    ]);
    expect(result.currentStreak).toEqual({ state: "BASE", length: 1 });
  });

  it("does not invent a prediction", () => {
    const result = analyze([round(1, 1.1), round(2, 1.2)]);
    expect(result).not.toHaveProperty("prediction");
  });
});
