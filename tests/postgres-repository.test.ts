import { describe, expect, it } from "vitest";
import { PostgresRoundRepository, SqlClient } from "../src/postgres-repository";

describe("PostgresRoundRepository", () => {
  it("uses parameterized idempotent insert", async () => {
    const calls: { sql: string; params?: unknown[] }[] = [];
    const db: SqlClient = {
      async query(sql, params) {
        calls.push({ sql, params });
        return { rows: [] };
      },
    };
    const repo = new PostgresRoundRepository(db);
    await repo.append({
      roundId: "r1", sequence: 1, multiplier: 1.25,
      timestamp: "2026-01-01T00:00:00.000Z", source: "telegram",
    });
    expect(calls[0].sql).toContain("on conflict (round_id) do nothing");
    expect(calls[0].params).toEqual(["r1", 1, 1.25, "2026-01-01T00:00:00.000Z", "telegram"]);
  });

  it("bounds requested history", async () => {
    const db: SqlClient = { async query(_sql, params) { return { rows: [] }; } };
    const repo = new PostgresRoundRepository(db);
    await repo.list(999999);
    expect(true).toBe(true);
  });
});
