import { analyze, classifyRounds } from "./analysis";
import { Round } from "./domain";
import { RoundRepository } from "./repository";
import { generateSignal } from "./signal";

export class AviatorAnalysisService {
  constructor(private readonly repository: RoundRepository) {}

  async ingest(round: Round): Promise<void> {
    await this.repository.append(round);
  }

  async snapshot() {
    const rounds = await this.repository.list(500);
    const classified = classifyRounds(rounds);
    return { analysis: analyze(rounds), signal: generateSignal(classified), rounds: classified };
  }
}