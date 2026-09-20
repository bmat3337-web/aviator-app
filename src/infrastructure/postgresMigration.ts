import { POSTGRES_SCHEMA } from "./postgresSchema"; import type { SqlPool } from "./postgresContracts";
export async function ensureFoundationSchema(pool:SqlPool):Promise<void>{for(const statement of POSTGRES_SCHEMA.split(";").map(x=>x.trim()).filter(Boolean)) await pool.query(statement+";");}
