import { describe, expect, it } from "vitest";
import { createProductionApplication } from "../src/production";
import { requireProductionBotToken } from "../src/server";

const db = {
  async query<T = unknown>(_sql: string, _params?: unknown[]): Promise<{ rows: T[] }> {
    return { rows: [] };
  },
};

describe("production bootstrap", () => {
  it("rejects a missing Telegram bot token", () => {
    expect(() => requireProductionBotToken(undefined)).toThrow("TELEGRAM_BOT_TOKEN_REQUIRED");
  });

  it("constructs production services with injected PostgreSQL client", () => {
    const app = createProductionApplication({ db, botToken: "test-token" });
    expect(app.analysis).toBeDefined();
    expect(app.challenges).toBeDefined();
    expect(app.botToken).toBe("test-token");
  });
});
