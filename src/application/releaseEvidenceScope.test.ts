interface EvidenceRecord {
  gateId: string;
  reference: string;
  state: "PENDING" | "SUBMITTED" | "VERIFIED" | "ACCEPTED";
  scope: string | null;
  reviewAt: string | null;
}

function assertUsable(record: EvidenceRecord, now: string, requiredScope: string): void {
  if (record.state !== "ACCEPTED") throw new Error("Only accepted evidence may satisfy a production gate");
  if (!record.scope || record.scope !== requiredScope) throw new Error("Evidence scope does not match the release scope");
  if (!record.reviewAt || new Date(record.reviewAt).getTime() <= new Date(now).getTime()) {
    throw new Error("Evidence is expired or missing a future review date");
  }
}

assertUsable({
  gateId: "foundation-acceptance",
  reference: "src/application/foundationAcceptance.test.ts",
  state: "ACCEPTED",
  scope: "foundation-v1",
  reviewAt: "2027-01-01T00:00:00Z",
}, "2026-09-21T00:00:00Z", "foundation-v1");

for (const bad of [
  { state: "VERIFIED" as const, scope: "foundation-v1", reviewAt: "2027-01-01T00:00:00Z" },
  { state: "ACCEPTED" as const, scope: "other-release", reviewAt: "2027-01-01T00:00:00Z" },
  { state: "ACCEPTED" as const, scope: "foundation-v1", reviewAt: "2026-01-01T00:00:00Z" },
]) {
  try {
    assertUsable({ gateId: "x", reference: "x", ...bad }, "2026-09-21T00:00:00Z", "foundation-v1");
    throw new Error("Invalid evidence was accepted");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid evidence was accepted") throw error;
  }
}

console.log("AVIATOR EVIDENCE SCOPE VERIFIED");
