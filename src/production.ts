import { AviatorAnalysisService } from "./service";
import { PostgresRoundRepository, SqlClient } from "./postgres-repository";
import { ChallengeServiceApi } from "./challenge-api";
import { PostgresChallengeStore } from "./postgres-challenge-store";

export interface ProductionDependencies {
  db: SqlClient;
  botToken: string;
  ingestionToken: string;
}

export interface ProductionApplication {
  analysis: AviatorAnalysisService;
  challenges: ChallengeServiceApi;
  botToken: string;
  ingestionToken: string;
}

export function createProductionApplication(deps: ProductionDependencies): ProductionApplication {
  if (!deps.db) throw new Error("DATABASE_REQUIRED");
  if (!deps.botToken.trim()) throw new Error("TELEGRAM_BOT_TOKEN_REQUIRED");
  if (!deps.ingestionToken.trim()) throw new Error("INGESTION_TOKEN_REQUIRED");

  const roundRepository = new PostgresRoundRepository(deps.db);
  const challengeStore = new PostgresChallengeStore(deps.db);

  return {
    analysis: new AviatorAnalysisService(roundRepository),
    challenges: new ChallengeServiceApi(challengeStore),
    botToken: deps.botToken,
    ingestionToken: deps.ingestionToken,
  };
}
