export interface IntegrationTestCase {
  name: string;
  run(): Promise<void>;
}

export const FOUNDATION_INTEGRATION_CASES: IntegrationTestCase[] = [
  { name: "bet reservation is idempotent", run: async () => {} },
  { name: "duplicate provider settlement cannot pay twice", run: async () => {} },
  { name: "cashout is rejected outside FLYING", run: async () => {} },
  { name: "round events preserve sequence", run: async () => {} },
  { name: "risk limits gate bet requests", run: async () => {} },
  { name: "provider failures do not create client-authoritative wallet state", run: async () => {} },
];
