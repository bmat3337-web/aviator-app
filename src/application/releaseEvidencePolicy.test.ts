import { FOUNDATION_EVIDENCE, REQUIRED_EXTERNAL_EVIDENCE, type ReleaseEvidence } from "./releaseEvidence";

function assertEvidenceShape(evidence: ReleaseEvidence): void {
  if (!evidence.gateId || !evidence.kind || !evidence.reference || !evidence.description) {
    throw new Error("Every release evidence record requires gate, kind, reference and description");
  }
  if (evidence.verified && evidence.reference.startsWith("PENDING-")) {
    throw new Error(`Verified evidence cannot use a pending reference: ${evidence.gateId}`);
  }
}

[...FOUNDATION_EVIDENCE, ...REQUIRED_EXTERNAL_EVIDENCE].forEach(assertEvidenceShape);

if (FOUNDATION_EVIDENCE.some((evidence) => !evidence.verified)) {
  throw new Error("All foundation evidence records must be verified");
}

if (REQUIRED_EXTERNAL_EVIDENCE.some((evidence) => evidence.verified)) {
  throw new Error("External production evidence must remain unverified until independently supplied");
}

console.log("AVIATOR EVIDENCE POLICY VERIFIED: VERIFIED RECORDS ARE TRACEABLE / PENDING RECORDS CANNOT BYPASS RELEASE");
