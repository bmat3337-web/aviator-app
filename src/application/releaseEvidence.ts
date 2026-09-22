export type EvidenceKind = "TEST" | "DOCUMENT" | "APPROVAL" | "ARTIFACT";

export interface ReleaseEvidence {
  gateId: string;
  kind: EvidenceKind;
  reference: string;
  description: string;
  verified: boolean;
}

export const FOUNDATION_EVIDENCE: readonly ReleaseEvidence[] = [
  { gateId: "domain-verification", kind: "TEST", reference: "src/domain/simulator.test.ts", description: "Deterministic simulator and dual-slot verification", verified: true },
  { gateId: "application-integration", kind: "TEST", reference: "src/application/integration.test.ts", description: "Application integration contract verification", verified: true },
  { gateId: "provider-validation", kind: "TEST", reference: "src/application/providerValidator.test.ts", description: "Provider event and settlement validation", verified: true },
  { gateId: "financial-controls", kind: "TEST", reference: "src/application/reconciliation.test.ts", description: "Reconciliation and financial-control verification", verified: true },
  { gateId: "foundation-acceptance", kind: "TEST", reference: "src/application/foundationAcceptance.test.ts", description: "End-to-end foundation acceptance gate", verified: true },
  { gateId: "production-build", kind: "ARTIFACT", reference: "npm run build", description: "Production TypeScript/Vite build command", verified: true },
];

export const REQUIRED_EXTERNAL_EVIDENCE: readonly ReleaseEvidence[] = [
  { gateId: "spribe-authorization", kind: "APPROVAL", reference: "PENDING-SPRIBE", description: "Authorized commercial and technical provider agreement", verified: false },
  { gateId: "provider-certification", kind: "ARTIFACT", reference: "PENDING-SPRIBE-CERTIFICATION", description: "Provider sandbox/certification evidence", verified: false },
  { gateId: "regulatory-market-access", kind: "APPROVAL", reference: "PENDING-JURISDICTION-REVIEW", description: "Applicable licensing and market-access approvals", verified: false },
  { gateId: "kyc-aml", kind: "DOCUMENT", reference: "PENDING-COMPLIANCE", description: "Production KYC/AML controls and evidence", verified: false },
  { gateId: "responsible-gaming", kind: "DOCUMENT", reference: "PENDING-RESPONSIBLE-GAMING", description: "Production responsible-gaming controls and verification", verified: false },
  { gateId: "payments", kind: "APPROVAL", reference: "PENDING-PAYMENT-PROVIDER", description: "Approved production payment infrastructure", verified: false },
  { gateId: "production-secrets", kind: "ARTIFACT", reference: "PENDING-KEY-MANAGEMENT", description: "Production credential and key-management evidence", verified: false },
  { gateId: "security-assessment", kind: "DOCUMENT", reference: "PENDING-SECURITY-ASSESSMENT", description: "Production security assessment", verified: false },
  { gateId: "financial-operations", kind: "DOCUMENT", reference: "PENDING-FINANCIAL-OPS", description: "Reconciliation, monitoring and incident procedures", verified: false },
];

export function allFoundationEvidenceVerified(): boolean {
  return FOUNDATION_EVIDENCE.every((evidence) => evidence.verified);
}

export function allExternalEvidenceVerified(): boolean {
  return REQUIRED_EXTERNAL_EVIDENCE.every((evidence) => evidence.verified);
}
