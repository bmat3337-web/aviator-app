import { AUTOMATED_FOUNDATION_GATES, MANDATORY_PRODUCTION_GATES, foundationReleaseStatus } from "./releaseManifest";
import { FOUNDATION_EVIDENCE, REQUIRED_EXTERNAL_EVIDENCE } from "./releaseEvidence";

const requiredFoundation = [
  "domain-verification",
  "application-integration",
  "provider-validation",
  "financial-controls",
  "foundation-acceptance",
  "production-build",
];

for (const id of requiredFoundation) {
  const gate = AUTOMATED_FOUNDATION_GATES.find((item) => item.id === id);
  if (!gate || gate.status !== "PASS") throw new Error(`Foundation sprint gate incomplete: ${id}`);
  if (!FOUNDATION_EVIDENCE.some((item) => item.gateId === id && item.verified)) {
    throw new Error(`Foundation sprint evidence incomplete: ${id}`);
  }
}

if (MANDATORY_PRODUCTION_GATES.some((gate) => gate.status !== "BLOCKED")) {
  throw new Error("Foundation sprint cannot unblock production");
}
if (REQUIRED_EXTERNAL_EVIDENCE.some((evidence) => evidence.verified)) {
  throw new Error("Foundation sprint cannot fabricate external production evidence");
}
if (foundationReleaseStatus() !== "PRODUCTION_BLOCKED") {
  throw new Error("Foundation sprint exit status must be PRODUCTION_BLOCKED");
}

console.log("AVIATOR FOUNDATION SPRINT EXIT GATE VERIFIED");
