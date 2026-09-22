import { MANDATORY_PRODUCTION_GATES } from "./releaseManifest";

const required = [
  "spribe-authorization",
  "provider-certification",
  "regulatory-market-access",
  "kyc-aml",
  "responsible-gaming",
  "payments",
  "production-secrets",
  "security-assessment",
  "financial-operations",
] as const;

const actual = new Set(MANDATORY_PRODUCTION_GATES.map((gate) => gate.id));

if (actual.size !== required.length || required.some((id) => !actual.has(id))) {
  throw new Error("Production readiness exit registry is incomplete");
}

for (const gate of MANDATORY_PRODUCTION_GATES) {
  if (gate.status !== "BLOCKED") {
    throw new Error(`Production gate is not blocked: ${gate.id}`);
  }
  if (!gate.evidence || gate.evidence.length < 10) {
    throw new Error(`Production gate lacks an explicit evidence requirement: ${gate.id}`);
  }
}

console.log("AVIATOR PRODUCTION READINESS EXIT VERIFIED: ALL MANDATORY GATES BLOCKED");
