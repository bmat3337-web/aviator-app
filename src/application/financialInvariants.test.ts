import { FINANCIAL_INVARIANTS } from "./financialInvariants";
if(FINANCIAL_INVARIANTS.length!==5) throw new Error("Financial invariant registry incomplete");
if(!FINANCIAL_INVARIANTS.some(x=>x.name==="IDEMPOTENT_SETTLEMENT")) throw new Error("Settlement invariant missing");
if(!FINANCIAL_INVARIANTS.some(x=>x.name==="SERVER_AUTHORITATIVE_BALANCE")) throw new Error("Authority invariant missing");
console.log("AVIATOR FINANCIAL INVARIANTS VERIFIED");
