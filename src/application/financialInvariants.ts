export interface FinancialInvariant {
  name:string;
  description:string;
}

export const FINANCIAL_INVARIANTS: readonly FinancialInvariant[]=[
 {name:"NO_NEGATIVE_RESERVATION",description:"A bet reservation may only be created when available ledger funds cover the stake."},
 {name:"IMMUTABLE_LEDGER",description:"Financial history is append-only; corrections use compensating entries rather than mutation."},
 {name:"IDEMPOTENT_SETTLEMENT",description:"A provider retry must not create a second payout for the same bet."},
 {name:"SERVER_AUTHORITATIVE_BALANCE",description:"Client-reported balances never authorize a financial operation."},
 {name:"INTEGER_MINOR_UNITS",description:"Financial amounts use integer minor units rather than floating-point currency arithmetic."},
] as const;
