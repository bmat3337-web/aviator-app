import type { ProviderRoundEvent, ProviderSettlement } from "./providerAdapter";
export interface ProviderEventValidator { validateRoundEvent(event:ProviderRoundEvent):void; validateSettlement(settlement:ProviderSettlement):void; }
export class StrictProviderEventValidator implements ProviderEventValidator {
 validateRoundEvent(e:ProviderRoundEvent):void { if(!e.providerRoundId) throw new Error("PROVIDER_ROUND_ID_REQUIRED"); if(e.sequence<0||!Number.isInteger(e.sequence)) throw new Error("PROVIDER_SEQUENCE_INVALID"); if(e.type==="MULTIPLIER"&&(e.multiplier===null||e.multiplier<1)) throw new Error("PROVIDER_MULTIPLIER_INVALID"); }
 validateSettlement(s:ProviderSettlement):void { if(!s.providerBetId||!s.providerRoundId) throw new Error("PROVIDER_SETTLEMENT_REFERENCE_REQUIRED"); if(s.payoutMinorUnits<0n) throw new Error("PROVIDER_PAYOUT_INVALID"); if(s.outcome==="CASHED_OUT"&&(s.multiplier===null||s.multiplier<1)) throw new Error("PROVIDER_CASHOUT_MULTIPLIER_INVALID"); }
}
