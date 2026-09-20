type EvidenceState = "PENDING" | "SUBMITTED" | "VERIFIED" | "ACCEPTED";

const allowed: Record<EvidenceState, readonly EvidenceState[]> = {
  PENDING: ["SUBMITTED"],
  SUBMITTED: ["VERIFIED", "PENDING"],
  VERIFIED: ["ACCEPTED", "PENDING"],
  ACCEPTED: ["PENDING"],
};

function transition(from: EvidenceState, to: EvidenceState): void {
  if (!allowed[from].includes(to)) {
    throw new Error(`Invalid evidence transition: ${from} -> ${to}`);
  }
}

transition("PENDING", "SUBMITTED");
transition("SUBMITTED", "VERIFIED");
transition("VERIFIED", "ACCEPTED");
transition("ACCEPTED", "PENDING");

for (const state of Object.keys(allowed) as EvidenceState[]) {
  for (const target of Object.keys(allowed) as EvidenceState[]) {
    if (allowed[state].includes(target)) continue;
    if (state === target) continue;
    try {
      transition(state, target);
      throw new Error(`Forbidden evidence transition accepted: ${state} -> ${target}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Forbidden")) throw error;
    }
  }
}

console.log("AVIATOR EVIDENCE LIFECYCLE VERIFIED");
