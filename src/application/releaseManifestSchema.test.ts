import { AUTOMATED_FOUNDATION_GATES, MANDATORY_PRODUCTION_GATES } from "./releaseManifest";
import { FOUNDATION_EVIDENCE, REQUIRED_EXTERNAL_EVIDENCE } from "./releaseEvidence";

const foundationIds = new Set(AUTOMATED_FOUNDATION_GATES.map((gate) => gate.id));
const productionIds = new Set(MANDATORY_PRODUCTION_GATES.map((gate) => gate.id));

if (foundationIds.size !== AUTOMATED_FOUNDATION_GATES.length) {
  throw new Error("Foundation release gate IDs must be unique");
}
if (productionIds.size !== MANDATORY_PRODUCTION_GATES.length) {
  throw new Error("Production release gate IDs must be unique");
}

for (const evidence of FOUNDATION_EVIDENCE) {
  if (!foundationIds.has(evidence.gateId)) {
    throw new Error(`Foundation evidence references unknown gate: ${evidence.gateId}`);
  }
}

for (const evidence of REQUIRED_EXTERNAL_EVIDENCE) {
  if (!productionIds.has(evidence.gateId)) {
    throw new Error(`External evidence references unknown production gate: ${evidence.gateId}`);
  }
}

if (FOUNDATION_EVIDENCE.some((evidence) =>
  REQUIRED_EXTERNAL_EVIDENCE.some((external) => external.gateId === evidence.gateId))) {
  throw new Error("A gate cannot simultaneously belong to foundation and external production evidence");
}

console.log("AVIATOR RELEASE MANIFEST SCHEMA VERIFIED");
