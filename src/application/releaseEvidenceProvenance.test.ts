export {};
interface EvidenceRecord {
  gateId: string;
  kind: "TEST" | "DOCUMENT" | "APPROVAL" | "ARTIFACT";
  reference: string;
  source: string;
  state: "PENDING" | "SUBMITTED" | "VERIFIED" | "ACCEPTED";
}

function assertProvenance(record: EvidenceRecord): void {
  if (!record.source) throw new Error("Evidence source is required");
  if (record.state === "VERIFIED" || record.state === "ACCEPTED") {
    if (record.source.startsWith("PENDING-")) throw new Error("Verified evidence cannot originate from a pending source");
    if (record.reference.startsWith("PENDING-")) throw new Error("Verified evidence cannot use a pending reference");
  }
}

assertProvenance({
  gateId: "foundation-acceptance",
  kind: "TEST",
  reference: "src/application/foundationAcceptance.test.ts",
  source: "repository",
  state: "ACCEPTED",
});

try {
  assertProvenance({
    gateId: "spribe-authorization",
    kind: "APPROVAL",
    reference: "PENDING-SPRIBE",
    source: "PENDING-SPRIBE",
    state: "VERIFIED",
  });
  throw new Error("Pending provenance was accepted as verified evidence");
} catch (error) {
  if (error instanceof Error && error.message === "Pending provenance was accepted as verified evidence") throw error;
}

console.log("AVIATOR EVIDENCE PROVENANCE VERIFIED");
