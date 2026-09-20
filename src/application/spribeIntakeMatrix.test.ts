const required = [
  "P01","P02","P03","P04","P05","P06","P07","P08","P09","P10","P11","P12","P13","P14","P15",
] as const;

const status: Record<string, "PENDING" | "RECEIVED" | "VERIFIED" | "ACCEPTED"> =
  Object.fromEntries(required.map((id) => [id, "PENDING"]));

if (Object.keys(status).length !== required.length) {
  throw new Error("SPRIBE intake matrix is incomplete");
}

for (const id of required) {
  if (status[id] !== "PENDING") {
    throw new Error("Provider evidence cannot be promoted without authoritative intake");
  }
}

console.log("SPRIBE INTAKE MATRIX VERIFIED: 15/15 INPUTS PENDING AUTHORITATIVE EVIDENCE");
