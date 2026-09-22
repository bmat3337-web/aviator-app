import { assertFoundationRelease, foundationReleaseStatus } from "./releaseManifest";

assertFoundationRelease();
if (foundationReleaseStatus() !== "PRODUCTION_BLOCKED") {
  throw new Error("Production must remain blocked until mandatory launch evidence exists");
}

console.log("AVIATOR RELEASE MANIFEST VERIFIED: FOUNDATION VERIFIED / PRODUCTION BLOCKED");
