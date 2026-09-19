import { Round } from "./domain";
import { RoundRepository } from "./repository";

export interface SqlClient {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export class PostgresRoundRepository implements RoundRepository {
  constructor(private readonly db: SqlClient) {}

  async append(round: Round): Promise<void> {
    await this.db.query(
      `insert into aviator_rounds
        (round_id, sequence, multiplier, occurred_at, source)
       values ($1, $2, $3, $4, $5)
       on conflict (round_id) do nothing`,
      [round.roundId, round.sequence, round.multiplier, round.timestamp, round.source],
    );
  }

  async findById(roundId: string): Promise<Round | null> {
    const result = await this.db.query<{
      round_id: string; sequence: number; multiplier: number | string;
      occurred_at: string; source: Round["source"];
    }>(
      `select round_id, sequence, multiplier, occurred_at, source
       from aviator_rounds where round_id = $1`,
      [roundId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      roundId: row.round_id,
      sequence: row.sequence,
      multiplier: Number(row.multiplier),
      timestamp: row.occurred_at,
      source: row.source,
    };
  }

  async list(limit = 500): Promise<Round[]> {
    const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 5000);
    const result = await this.db.query<{
      round_id: string; sequence: number; multiplier: number | string;
      occurred_at: string; source: Round["source"];
    }>(
      `select round_id, sequence, multiplier, occurred_at, source
       from aviator_rounds order by sequence desc limit $1`,
      [safeLimit],
    );
    return result.rows.reverse().map((row) => ({
      roundId: row.round_id,
      sequence: row.sequence,
      multiplier: Number(row.multiplier),
      timestamp: row.occurred_at,
      source: row.source,
    }));
  }
}
