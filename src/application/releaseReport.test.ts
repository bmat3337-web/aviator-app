import { AUTOMATED_FOUNDATION_GATES, MANDATORY_PRODUCTION_GATES, foundationReleaseStatus } from "./releaseManifest";
import { FOUNDATION_EVIDENCE, REQUIRED_EXTERNAL_EVIDENCE } from "./releaseEvidence";

const report = {
  status: foundationReleaseStatus(),
  automatedFoundationGates: AUTOMATED_FOUNDATION_GATES.map((gate) => ({ id: gate.id, status: gate.status })),
  foundationEvidence: FOUNDATION_EVIDENCE.map((evidence) => ({ gateId: evidence.gateId, reference: evidence.reference, verified: evidence.verified })),
  productionGates: MANDATORY_PRODUCTION_GATES.map((gate) => ({ id: gate.id, status: gate.status })),
  externalEvidence: REQUIRED_EXTERNAL_EVIDENCE.map((evidence) => ({ gateId: evidence.gateId, reference: evidence.reference, verified: evidence.verified })),
};

if (report.status !== "PRODUCTION_BLOCKED") throw new Error("Release report must remain production blocked");
if (report.automatedFoundationGates.some((gate) => gate.status !== "PASS")) throw new Error("Foundation gate report contains a non-passing gate");
if (report.productionGates.some((gate) => gate.status !== "BLOCKED")) throw new Error("Production gate report contains an unblocked gate");
if (report.externalEvidence.some((evidence) => evidence.verified)) throw new Error("External evidence report contains unverified-to-verified bypass");

console.log(JSON.stringify({ aviatorReleaseReport: report }, null, 2));
