import { MANDATORY_PRODUCTION_GATES } from "./releaseManifest";

const required = new Set([
  "spribe-authorization",
  "provider-certification",
  "regulatory-market-access",
  "kyc-aml",
  "responsible-gaming",
  "payments",
  "production-secrets",
  "security-assessment",
  "financial-operations",
]);

const actual = new Set(MANDATORY_PRODUCTION_GATES.map((gate) => gate.id));

if (actual.size !== required.size || [...required].some((id) => !actual.has(id))) {
  throw new Error("Consolidated production readiness registry is incomplete");
}

const blocked = MANDATORY_PRODUCTION_GATES.filter((gate) => gate.status === "BLOCKED");
if (blocked.length !== MANDATORY_PRODUCTION_GATES.length) {
  throw new Error("Production readiness cannot be partially unblocked");
}

console.log(
  "AVIATOR PRODUCTION READINESS VERIFIED: " +
  blocked.length +
  "/" +
  MANDATORY_PRODUCTION_GATES.length +
  " mandatory gates BLOCKED"
);
