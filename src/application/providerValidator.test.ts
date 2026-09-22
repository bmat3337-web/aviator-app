import { StrictProviderEventValidator } from "./providerValidator";
const v=new StrictProviderEventValidator();
v.validateRoundEvent({providerRoundId:"R1",sequence:1,type:"MULTIPLIER",multiplier:1.25,occurredAt:new Date().toISOString()});
v.validateSettlement({providerBetId:"B1",providerRoundId:"R1",outcome:"CASHED_OUT",multiplier:2,payoutMinorUnits:250n,settledAt:new Date().toISOString()});
let rejected=false;try{v.validateSettlement({providerBetId:"",providerRoundId:"R1",outcome:"CRASHED",multiplier:null,payoutMinorUnits:0n,settledAt:new Date().toISOString()});}catch{rejected=true;}if(!rejected)throw new Error("Invalid provider settlement accepted");
console.log("AVIATOR PROVIDER CONTRACT VERIFIED");
