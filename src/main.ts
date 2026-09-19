import { Pool } from "pg";
import { createProductionServer } from "./server";

const databaseUrl = process.env.DATABASE_URL;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const port = Number(process.env.PORT ?? 3000);

if (!databaseUrl) throw new Error("DATABASE_URL_REQUIRED");
if (!botToken?.trim()) throw new Error("TELEGRAM_BOT_TOKEN_REQUIRED");
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("INVALID_PORT");

const pool = new Pool({ connectionString: databaseUrl });
const server = createProductionServer({ db: pool, botToken });

server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ service: "aviator-api", status: "listening", port }));
});

const shutdown = async (signal: string) => {
  server.close();
  await pool.end();
  console.log(JSON.stringify({ service: "aviator-api", status: "stopped", signal }));
};

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
