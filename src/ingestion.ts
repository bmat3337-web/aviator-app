import { Round } from "./domain";

export function createRound(input: {
  roundId: string;
  sequence: number;
  multiplier: number;
  timestamp: string;
  source?: Round["source"];
}): Round {
  if (!input.roundId.trim()) throw new Error("roundId is required");
  if (!Number.isInteger(input.sequence) || input.sequence < 0) {
    throw new Error("sequence must be a non-negative integer");
  }
  if (!Number.isFinite(input.multiplier) || input.multiplier < 1) {
    throw new Error("multiplier must be a finite number >= 1");
  }
  if (Number.isNaN(Date.parse(input.timestamp))) {
    throw new Error("timestamp must be a valid ISO date");
  }

  return {
    ...input,
    source: input.source ?? "manual",
  };
}
