export {};
import { PostgreSqlAuditStore } from "./postgresAudit";
class Tx{
  rows:Set<string>; constructor(rows:Set<string>){this.rows=rows}
  async query<T extends Record<string,unknown>>(sql:string,p?:readonly any[]):Promise<{rows:T[]}>{
    const id=String(p?.[0]?.value??"");
    if(sql.startsWith("SELECT")) return {rows:(this.rows.has(id)?[{}]:[]) as T[]};
    this.rows.add(id); return {rows:[]};
  }
  async commit(){} async rollback(){}
}
class Pool{rows=new Set<string>();async connect(){return new Tx(this.rows)}}
const p=new Pool();const s=new PostgreSqlAuditStore(p as any);
const e={eventId:"Q1:CASE_RESOLVED:C1",operatorId:"O1",action:"CASE_RESOLVED" as const,caseId:"C1",requestId:"Q1",occurredAt:new Date().toISOString(),metadata:{status:"MISMATCH"}};
if(await s.append(e)!=="RECORDED")throw new Error("audit append failed");
if(await s.append(e)!=="DUPLICATE")throw new Error("audit idempotency failed");
console.log("AVIATOR AUDIT PERSISTENCE VERIFIED");
