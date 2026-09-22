import type { ProviderRoundEvent } from "./providerAdapter";

export type FlightSessionStatus = "DISCONNECTED" | "CONNECTED" | "STALE";

export interface FlightSessionEvent {
  readonly event: ProviderRoundEvent;
  readonly key: string;
}

export interface FlightSessionState {
  readonly status: FlightSessionStatus;
  readonly roundId: string | null;
  readonly lastSequence: number | null;
  readonly acceptedEvents: number;
  readonly rejectedEvents: number;
}

/**
 * Provider-neutral realtime session guard.
 *
 * It does not decide game outcomes. It only establishes transport/session
 * ordering rules before provider events reach the application domain.
 */
export class RealtimeFlightSession {
  private status: FlightSessionStatus = "DISCONNECTED";
  private roundId: string | null = null;
  private lastSequence: number | null = null;
  private acceptedEvents = 0;
  private rejectedEvents = 0;
  private seen = new Set<string>();

  connect(roundId?: string): void {
    this.status = "CONNECTED";
    this.roundId = roundId ?? null;
    this.lastSequence = null;
    this.seen.clear();
  }

  disconnect(): void {
    this.status = "DISCONNECTED";
  }

  markStale(): void {
    if (this.status === "CONNECTED") this.status = "STALE";
  }

  state(): FlightSessionState {
    return {
      status: this.status,
      roundId: this.roundId,
      lastSequence: this.lastSequence,
      acceptedEvents: this.acceptedEvents,
      rejectedEvents: this.rejectedEvents,
    };
  }

  ingest(event: ProviderRoundEvent): FlightSessionEvent | null {
    if (this.status !== "CONNECTED") return this.reject();
    if (!Number.isInteger(event.sequence) || event.sequence < 0) return this.reject();
    if (!event.providerRoundId || !event.type || !event.occurredAt) return this.reject();
    if (event.multiplier !== null && (!Number.isFinite(event.multiplier) || event.multiplier < 1)) {
      return this.reject();
    }

    if (this.roundId === null) {
      this.roundId = event.providerRoundId;
      this.lastSequence = null;
    }

    if (event.providerRoundId !== this.roundId) return this.reject();

    const key = event.providerRoundId + ":" + event.sequence + ":" + event.type;
    if (this.seen.has(key)) return this.reject();

    if (this.lastSequence !== null && event.sequence <= this.lastSequence) {
      return this.reject();
    }

    this.seen.add(key);
    this.lastSequence = event.sequence;
    this.acceptedEvents += 1;
    this.status = "CONNECTED";
    return { event, key };
  }

  private reject(): null {
    this.rejectedEvents += 1;
    return null;
  }
}
