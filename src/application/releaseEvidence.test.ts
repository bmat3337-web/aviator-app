import { allExternalEvidenceVerified, allFoundationEvidenceVerified, REQUIRED_EXTERNAL_EVIDENCE } from "./releaseEvidence";

if (!allFoundationEvidenceVerified()) throw new Error("Foundation evidence registry is incomplete");
if (REQUIRED_EXTERNAL_EVIDENCE.length === 0) throw new Error("External production evidence registry must not be empty");
if (allExternalEvidenceVerified()) throw new Error("Production evidence cannot be marked complete without actual external evidence");

console.log("AVIATOR RELEASE EVIDENCE VERIFIED: FOUNDATION EVIDENCE PRESENT / EXTERNAL EVIDENCE PENDING");
