import { StrictProviderEventValidator } from "./providerValidator";
import { FINANCIAL_INVARIANTS } from "./financialInvariants";
const validator=new StrictProviderEventValidator();
const now=new Date().toISOString();
validator.validateRoundEvent({providerRoundId:"R1",sequence:0,type:"ROUND_OPEN",multiplier:null,occurredAt:now});
validator.validateRoundEvent({providerRoundId:"R1",sequence:1,type:"MULTIPLIER",multiplier:1.01,occurredAt:now});
validator.validateSettlement({providerBetId:"B1",providerRoundId:"R1",outcome:"CRASHED",multiplier:null,payoutMinorUnits:0n,settledAt:now});
if(!FINANCIAL_INVARIANTS.some(x=>x.name==="SERVER_AUTHORITATIVE_BALANCE")) throw new Error("Financial authority gate missing");
console.log("AVIATOR RELEASE GATES VERIFIED");
