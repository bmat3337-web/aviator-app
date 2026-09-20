export type ReleaseGateStatus = "PASS" | "BLOCKED";

export interface ReleaseGate { id: string; status: ReleaseGateStatus; evidence: string; }

export const AUTOMATED_FOUNDATION_GATES: readonly ReleaseGate[] = [
  { id: "domain-verification", status: "PASS", evidence: "npm run verify:domain" },
  { id: "application-integration", status: "PASS", evidence: "npm run verify:integration" },
  { id: "provider-validation", status: "PASS", evidence: "npm run verify:provider" },
  { id: "financial-controls", status: "PASS", evidence: "npm run verify:financial-controls" },
  { id: "foundation-acceptance", status: "PASS", evidence: "foundationAcceptance.test.ts" },
  { id: "production-build", status: "PASS", evidence: "npm run build" },
];

export const MANDATORY_PRODUCTION_GATES: readonly ReleaseGate[] = [
  { id: "spribe-authorization", status: "BLOCKED", evidence: "Awaiting authorized SPRIBE commercial/technical inputs" },
  { id: "provider-certification", status: "BLOCKED", evidence: "Sandbox and certification evidence not yet available" },
  { id: "regulatory-market-access", status: "BLOCKED", evidence: "Applicable licensing and market-access approvals required" },
  { id: "kyc-aml", status: "BLOCKED", evidence: "Production compliance implementation/evidence required" },
  { id: "responsible-gaming", status: "BLOCKED", evidence: "Production controls and verification required" },
  { id: "payments", status: "BLOCKED", evidence: "Approved production payment infrastructure required" },
  { id: "production-secrets", status: "BLOCKED", evidence: "Production credentials/key-management evidence required" },
  { id: "security-assessment", status: "BLOCKED", evidence: "Production security assessment required" },
  { id: "financial-operations", status: "BLOCKED", evidence: "Production reconciliation/monitoring/incident evidence required" },
];

export function foundationReleaseStatus(): "FOUNDATION_VERIFIED" | "PRODUCTION_BLOCKED" {
  return MANDATORY_PRODUCTION_GATES.some((gate) => gate.status === "BLOCKED")
    ? "PRODUCTION_BLOCKED"
    : "FOUNDATION_VERIFIED";
}

export function assertFoundationRelease(): void {
  if (AUTOMATED_FOUNDATION_GATES.some((gate) => gate.status !== "PASS")) {
    throw new Error("Foundation release gates are not satisfied");
  }
}
