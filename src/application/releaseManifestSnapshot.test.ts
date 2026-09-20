import { AUTOMATED_FOUNDATION_GATES, MANDATORY_PRODUCTION_GATES } from "./releaseManifest";
import { FOUNDATION_EVIDENCE, REQUIRED_EXTERNAL_EVIDENCE } from "./releaseEvidence";

const snapshot = Object.freeze({
  manifestVersion: "1.0.0",
  branch: "aviator/foundation-v1",
  generatedFor: "foundation-release",
  automatedGates: AUTOMATED_FOUNDATION_GATES.map((g) => Object.freeze({ ...g })),
  productionGates: MANDATORY_PRODUCTION_GATES.map((g) => Object.freeze({ ...g })),
  foundationEvidence: FOUNDATION_EVIDENCE.map((e) => Object.freeze({ ...e })),
  externalEvidence: REQUIRED_EXTERNAL_EVIDENCE.map((e) => Object.freeze({ ...e })),
});

if (snapshot.manifestVersion !== "1.0.0") throw new Error("Unexpected release manifest version");
if (snapshot.branch !== "aviator/foundation-v1") throw new Error("Release snapshot must identify the foundation branch");
if (snapshot.productionGates.some((g) => g.status !== "BLOCKED")) throw new Error("Snapshot cannot expose an unblocked production gate");
if (snapshot.externalEvidence.some((e) => e.verified)) throw new Error("Snapshot cannot expose verified external evidence");

console.log("AVIATOR RELEASE SNAPSHOT VERIFIED");
