import { describe, expect, it } from "vitest";
import { Pool } from "pg";
import { readFile } from "node:fs/promises";

const databaseUrl = process.env.DATABASE_URL;
const describeIntegration = databaseUrl ? describe : describe.skip;

describeIntegration("PostgreSQL challenge settlement", () => {
  const pool = new Pool({ connectionString: databaseUrl });

  it("settles once, scores predictions, and completes the final round", async () => {
    const migration1 = await readFile(new URL("../database/migrations/001_initial.sql", import.meta.url), "utf8");
    const migration2 = await readFile(new URL("../database/migrations/002_challenge_settlement.sql", import.meta.url), "utf8");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(migration1);
      await client.query(migration2);
      await client.query(
        `insert into aviator_challenges
          (challenge_id,title,state,total_rounds,current_round,starts_at,ends_at)
         values ('integration-c1','Integration','LIVE',2,1,now(),now()+interval '1 hour')`
      );
      await client.query(
        `insert into aviator_challenge_predictions
          (challenge_id,participant_id,round_number,target_state,submitted_at,signal_version)
         values ('integration-c1','user-1',2,'HIGH',now(),'1.0.0')`
      );

      await client.query("select settle_aviator_challenge_round($1,$2,$3)", ["integration-c1",2,"HIGH"]);
      await client.query("select settle_aviator_challenge_round($1,$2,$3)", ["integration-c1",2,"HIGH"]);

      const score = await client.query(
        "select points,correct,settled_rounds from aviator_challenge_scores where challenge_id=$1 and participant_id=$2",
        ["integration-c1","user-1"]
      );
      const challenge = await client.query(
        "select state,current_round from aviator_challenges where challenge_id=$1",
        ["integration-c1"]
      );
      const settlement = await client.query(
        "select count(*)::int as count from aviator_challenge_round_settlements where challenge_id=$1 and round_number=2",
        ["integration-c1"]
      );

      expect(score.rows[0]).toEqual({ points:1, correct:1, settled_rounds:1 });
      expect(challenge.rows[0]).toEqual({ state:"COMPLETED", current_round:2 });
      expect(settlement.rows[0].count).toBe(1);

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
  });

  it("rejects an out-of-sequence settlement without mutating state", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `insert into aviator_challenges
          (challenge_id,title,state,total_rounds,current_round,starts_at,ends_at)
         values ('integration-c2','Integration','LIVE',3,0,now(),now()+interval '1 hour')`
      );
      await expect(
        client.query("select settle_aviator_challenge_round($1,$2,$3)", ["integration-c2",2,"LOW"])
      ).rejects.toThrow("ROUND_NOT_OPEN");
      const challenge = await client.query(
        "select state,current_round from aviator_challenges where challenge_id=$1",
        ["integration-c2"]
      );
      expect(challenge.rows[0]).toEqual({ state:"LIVE", current_round:0 });
      await client.query("ROLLBACK");
    } catch (error) {
      try { await client.query("ROLLBACK"); } catch {}
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
  });
});
