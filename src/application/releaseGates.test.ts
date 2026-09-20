import { StrictProviderEventValidator } from "./providerValidator";
const validator=new StrictProviderEventValidator();
const now=new Date().toISOString();
validator.validateRoundEvent({providerRoundId:"R1",sequence:0,type:"ROUND_OPEN",multiplier:null,occurredAt:now});
validator.validateRoundEvent({providerRoundId:"R1",sequence:1,type:"MULTIPLIER",multiplier:1.01,occurredAt:now});
validator.validateSettlement({providerBetId:"B1",providerRoundId:"R1",outcome:"CRASHED",multiplier:null,payoutMinorUnits:0n,settledAt:now});
let rejected=false; try { validator.validateSettlement({providerBetId:"",providerRoundId:"R1",outcome:"CRASHED",multiplier:null,payoutMinorUnits:0n,settledAt:now}); } catch { rejected=true; }
if(!rejected) throw new Error("Invalid provider settlement accepted");
console.log("AVIATOR RELEASE GATES VERIFIED");
