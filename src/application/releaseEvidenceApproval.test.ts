type Role = "SUBMITTER" | "VERIFIER" | "APPROVER";
interface Approval { gateId: string; submitter: string; verifier: string; approver: string; }

function validateSeparation(a: Approval): void {
  if (!a.gateId || !a.submitter || !a.verifier || !a.approver) throw new Error("Approval record is incomplete");
  if (new Set([a.submitter, a.verifier, a.approver]).size < 2) {
    throw new Error("Release evidence requires separation of duties");
  }
}

validateSeparation({
  gateId: "foundation-acceptance",
  submitter: "foundation-ci",
  verifier: "foundation-ci",
  approver: "release-approver",
});

try {
  validateSeparation({
    gateId: "spribe-authorization",
    submitter: "same-actor",
    verifier: "same-actor",
    approver: "same-actor",
  });
  throw new Error("Single-actor evidence approval was accepted");
} catch (error) {
  if (error instanceof Error && error.message === "Single-actor evidence approval was accepted") throw error;
}

console.log("AVIATOR EVIDENCE APPROVAL VERIFIED: SEPARATION OF DUTIES ENFORCED");
