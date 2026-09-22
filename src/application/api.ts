export interface RequestContext {
  requestId: string;
  actorId: string | null;
  receivedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  requestId: string;
}

export interface ApiResult<T> {
  data: T | null;
  error: ApiError | null;
}

export interface GameApi {
  getFlight(context: RequestContext, roundId: string): Promise<ApiResult<import("../domain/game").GameSnapshot>>;
  placeBet(context: RequestContext, request: import("../domain/IGameProvider").PlaceBetRequest, idempotencyKey: string): Promise<ApiResult<void>>;
  cashOut(context: RequestContext, slot: import("../domain/game").SlotId, idempotencyKey: string): Promise<ApiResult<import("../domain/IGameProvider").CashOutResult>>;
}
