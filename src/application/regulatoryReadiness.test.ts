export {};
const gates = ["operator-eligibility","gaming-licence","domain-authorization","target-market-legality","kyc-identity","aml-cft","responsible-gaming","player-funds","payments","information-security","audit-reporting","supplier-approvals"] as const;
const status: Record<string, "PENDING" | "VERIFIED"> = Object.fromEntries(gates.map((id) => [id, "PENDING"]));
if (Object.keys(status).length !== gates.length) throw new Error("Regulatory readiness registry is incomplete");
if (Object.values(status).some((value) => value !== "PENDING")) throw new Error("Regulatory readiness cannot be promoted without jurisdiction-specific evidence");
console.log("AVIATOR REGULATORY READINESS VERIFIED: 12/12 GATES PENDING EVIDENCE");
