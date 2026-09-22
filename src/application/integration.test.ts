import assert from "node:assert/strict";
import { FOUNDATION_INTEGRATION_CASES } from "./integrationCases";

for (const testCase of FOUNDATION_INTEGRATION_CASES) {
  await testCase.run();
}

assert.equal(FOUNDATION_INTEGRATION_CASES.length, 6);
assert.deepEqual(
  FOUNDATION_INTEGRATION_CASES.map((testCase) => testCase.name),
  [
    "bet reservation is idempotent",
    "duplicate provider settlement cannot pay twice",
    "cashout is rejected outside FLYING",
    "round events preserve sequence",
    "risk limits gate bet requests",
    "provider failures do not create client-authoritative wallet state"
  ]
);

console.log("AVIATOR INTEGRATION CASES VERIFIED", FOUNDATION_INTEGRATION_CASES.length);
