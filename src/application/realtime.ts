import type { FlightEvent } from "./flightEvents";

export interface RealtimeEnvelope<TPayload = Record<string, unknown>> {
  version: 1;
  requestId: string;
  emittedAt: string;
  event: FlightEvent<TPayload>;
}

export interface RealtimePublisher {
  publish<TPayload>(channel: string, envelope: RealtimeEnvelope<TPayload>): Promise<void>;
}

export interface RealtimeSubscriber {
  subscribe(channel: string, onEvent: (envelope: RealtimeEnvelope) => void): () => void;
}
