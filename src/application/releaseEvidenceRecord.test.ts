export {};
type EvidenceState = "PENDING" | "SUBMITTED" | "VERIFIED" | "ACCEPTED";

interface EvidenceRecord {
  gateId: string;
  kind: "TEST" | "DOCUMENT" | "APPROVAL" | "ARTIFACT";
  reference: string;
  description: string;
  state: EvidenceState;
  submittedAt: string | null;
  verifiedAt: string | null;
  verifier: string | null;
  scope: string | null;
  reviewAt: string | null;
}

function validate(record: EvidenceRecord): void {
  if (!record.gateId || !record.reference || !record.description) throw new Error("Evidence identity is incomplete");
  if (record.state === "SUBMITTED" && !record.submittedAt) throw new Error("Submitted evidence requires submittedAt");
  if ((record.state === "VERIFIED" || record.state === "ACCEPTED") && (!record.verifiedAt || !record.verifier)) {
    throw new Error("Verified evidence requires verifiedAt and verifier");
  }
  if (record.state === "ACCEPTED" && !record.reviewAt) throw new Error("Accepted evidence requires reviewAt");
}

validate({
  gateId: "domain-verification",
  kind: "TEST",
  reference: "src/domain/simulator.test.ts",
  description: "Deterministic simulator and dual-slot verification",
  state: "ACCEPTED",
  submittedAt: "2026-09-21T00:00:00Z",
  verifiedAt: "2026-09-21T00:01:00Z",
  verifier: "foundation-ci",
  scope: "foundation-v1",
  reviewAt: "2026-12-21T00:00:00Z",
});

try {
  validate({
    gateId: "spribe-authorization",
    kind: "APPROVAL",
    reference: "PENDING-SPRIBE",
    description: "Provider authorization",
    state: "VERIFIED",
    submittedAt: "2026-09-21T00:00:00Z",
    verifiedAt: null,
    verifier: null,
    scope: null,
    reviewAt: null,
  });
  throw new Error("Incomplete verified evidence was accepted");
} catch (error) {
  if (error instanceof Error && error.message === "Incomplete verified evidence was accepted") throw error;
}

console.log("AVIATOR EVIDENCE RECORD VERIFIED");
