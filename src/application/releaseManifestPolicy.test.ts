import { AUTOMATED_FOUNDATION_GATES, MANDATORY_PRODUCTION_GATES, assertFoundationRelease, foundationReleaseStatus } from "./releaseManifest";

assertFoundationRelease();

if (AUTOMATED_FOUNDATION_GATES.some((gate) => gate.status !== "PASS")) {
  throw new Error("Every automated foundation gate must be PASS");
}
if (MANDATORY_PRODUCTION_GATES.length === 0) {
  throw new Error("Mandatory production gate registry must not be empty");
}
if (MANDATORY_PRODUCTION_GATES.some((gate) => gate.status !== "BLOCKED")) {
  throw new Error("Production gates must remain BLOCKED until independently verified evidence is supplied");
}
if (foundationReleaseStatus() !== "PRODUCTION_BLOCKED") {
  throw new Error("Foundation branch cannot report production readiness");
}

console.log("AVIATOR RELEASE POLICY VERIFIED: NO PRODUCTION BYPASS");
