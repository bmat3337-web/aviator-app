import { describe, expect, it } from "vitest";
import { createProductionApplication } from "../src/production";
import { requireProductionBotToken, requireProductionIngestionToken } from "../src/server";

const db = {
  async query<T = unknown>(_sql: string, _params?: unknown[]): Promise<{ rows: T[] }> {
    return { rows: [] };
  },
};

describe("production bootstrap", () => {
  it("rejects missing production secrets", () => {
    expect(() => requireProductionBotToken(undefined)).toThrow("TELEGRAM_BOT_TOKEN_REQUIRED");
    expect(() => requireProductionIngestionToken(undefined)).toThrow("INGESTION_TOKEN_REQUIRED");
  });

  it("constructs production services with injected PostgreSQL client", () => {
    const app = createProductionApplication({ db, botToken: "test-token", ingestionToken: "ingestion-secret" });
    expect(app.analysis).toBeDefined();
    expect(app.challenges).toBeDefined();
    expect(app.botToken).toBe("test-token");
    expect(app.ingestionToken).toBe("ingestion-secret");
  });
});
