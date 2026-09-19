import { createApiServer } from "./http";
import { createProductionApplication, ProductionDependencies } from "./production";

export function requireProductionBotToken(value: string | undefined): string {
  if (!value?.trim()) throw new Error("TELEGRAM_BOT_TOKEN_REQUIRED");
  return value;
}

export function createProductionServer(deps: ProductionDependencies) {
  const app = createProductionApplication({
    db: deps.db,
    botToken: requireProductionBotToken(deps.botToken),
  });
  return createApiServer(app.analysis, app.challenges, app.botToken);
}
