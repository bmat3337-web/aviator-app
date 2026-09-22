export interface IdempotencyRecord {
  key: string;
  scope: string;
  requestHash: string;
  responseStatus: number;
  responseBody: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface IdempotencyStore {
  get(scope: string, key: string): Promise<IdempotencyRecord | null>;
  put(record: IdempotencyRecord): Promise<void>;
}

export async function withIdempotency<T>(
  store: IdempotencyStore,
  scope: string,
  key: string,
  requestHash: string,
  operation: () => Promise<T>,
): Promise<T> {
  const existing = await store.get(scope, key);
  if (existing) {
    if (existing.requestHash !== requestHash) throw new Error("IDEMPOTENCY_KEY_REUSED");
    return JSON.parse(existing.responseBody) as T;
  }
  const result = await operation();
  await store.put({ key, scope, requestHash, responseStatus: 200, responseBody: JSON.stringify(result), createdAt: new Date().toISOString(), expiresAt: null });
  return result;
}
