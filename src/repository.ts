import { Round } from "./domain";

export interface RoundRepository {
  append(round: Round): Promise<void>;
  findById(roundId: string): Promise<Round | null>;
  list(limit?: number): Promise<Round[]>;
}

export class InMemoryRoundRepository implements RoundRepository {
  private readonly rounds = new Map<string, Round>();

  async append(round: Round): Promise<void> {
    if (this.rounds.has(round.roundId)) throw new Error("DUPLICATE_ROUND");
    this.rounds.set(round.roundId, Object.freeze({ ...round }));
  }

  async findById(roundId: string): Promise<Round | null> {
    return this.rounds.get(roundId) ?? null;
  }

  async list(limit = 100): Promise<Round[]> {
    return [...this.rounds.values()].sort((a,b) => a.sequence-b.sequence).slice(-Math.max(1, limit));
  }
}