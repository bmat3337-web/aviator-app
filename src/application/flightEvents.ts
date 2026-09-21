export type FlightEventType =
  | "ROUND_CREATED"
  | "BETTING_OPEN"
  | "BETTING_CLOSED"
  | "FLIGHT_STARTED"
  | "MULTIPLIER_UPDATED"
  | "BET_PLACED"
  | "CASHED_OUT"
  | "CRASHED"
  | "ROUND_SETTLED";

export interface FlightEvent<TPayload = Record<string, unknown>> {
  eventId: string;
  roundId: string;
  sequence: number;
  occurredAt: string;
  type: FlightEventType;
  payload: TPayload;
}

export interface RoundAuthority {
  roundId: string;
  providerRoundId: string | null;
  state: import("../domain/game").RoundState;
  sequence: number;
  authoritative: true;
}
