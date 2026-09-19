import { Round } from "./domain";

export function toRoundRow(round: Round) {
  return {
    round_id: round.roundId,
    sequence: round.sequence,
    multiplier: round.multiplier,
    occurred_at: round.timestamp,
    source: round.source,
  };
}

export function fromRoundRow(row: {
  round_id: string;
  sequence: number;
  multiplier: number | string;
  occurred_at: string;
  source: Round["source"];
}): Round {
  return {
    roundId: row.round_id,
    sequence: row.sequence,
    multiplier: Number(row.multiplier),
    timestamp: row.occurred_at,
    source: row.source,
  };
}
