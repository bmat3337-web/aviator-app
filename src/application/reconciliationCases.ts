import type { ReconciliationResult } from "./reconciliation";
export type CaseState="OPEN"|"ACKNOWLEDGED"|"RESOLVED"; export interface ReconciliationCase {caseId:string;providerBetId:string;status:ReconciliationResult["status"];reason:string;state:CaseState;createdAt:string;resolvedAt:string|null;}
export function createReconciliationCase(result:ReconciliationResult,now:string):ReconciliationCase|null {if(result.status==="MATCHED")return null;return {caseId:"recon:"+result.providerBetId+":"+now,providerBetId:result.providerBetId,status:result.status,reason:result.reason,state:"OPEN",createdAt:now,resolvedAt:null};}
export function acknowledgeCase(c:ReconciliationCase):ReconciliationCase {if(c.state!=="OPEN")throw new Error("CASE_NOT_OPEN");return {...c,state:"ACKNOWLEDGED"};}
export function resolveCase(c:ReconciliationCase,now:string):ReconciliationCase {if(c.state==="RESOLVED")throw new Error("CASE_ALREADY_RESOLVED");return {...c,state:"RESOLVED",resolvedAt:now};}
