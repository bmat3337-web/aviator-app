import type { FlightSnapshot } from "./flightSnapshot";
import { assertFlightSnapshot } from "./flightSnapshot";
import type { ProviderRoundEvent } from "./providerAdapter";
import { RealtimeFlightSession } from "./realtimeFlightSession";

export interface FlightProjectionState {
  readonly snapshot: FlightSnapshot;
  readonly session: ReturnType<RealtimeFlightSession["state"]>;
}

export class RealtimeFlightProjection {
  private current: FlightSnapshot;
  private readonly session: RealtimeFlightSession;

  constructor(initial: FlightSnapshot, session = new RealtimeFlightSession()) {
    assertFlightSnapshot(initial);
    this.current = structuredClone(initial);
    this.session = session;
  }

  connect(roundId?: string): void { this.session.connect(roundId ?? this.current.round.id); }
  disconnect(): void { this.session.disconnect(); }
  markStale(): void { this.session.markStale(); }

  resync(snapshot: FlightSnapshot): void {
    assertFlightSnapshot(snapshot);
    this.current = structuredClone(snapshot);
    this.session.connect(snapshot.round.id);
  }

  ingest(event: ProviderRoundEvent): boolean {
    const accepted = this.session.ingest(event);
    if (!accepted) return false;
    if (accepted.event.providerRoundId !== this.current.round.id) return false;
    this.current = this.projectRoundEvent(this.current, accepted.event);
    return true;
  }

  state(): FlightProjectionState {
    return { snapshot: structuredClone(this.current), session: this.session.state() };
  }

  private projectRoundEvent(snapshot: FlightSnapshot, event: ProviderRoundEvent): FlightSnapshot {
    const next: FlightSnapshot = structuredClone(snapshot);
    switch (event.type) {
      case "ROUND_OPEN": next.round.state = "BETTING_OPEN"; next.round.multiplier = 1; break;
      case "ROUND_CLOSE": next.round.state = "BETTING_CLOSED"; break;
      case "FLIGHT_START": next.round.state = "FLYING"; break;
      case "MULTIPLIER": if (event.multiplier !== null) next.round.multiplier = event.multiplier; next.round.state = "FLYING"; break;
      case "CRASH": if (event.multiplier !== null) next.round.multiplier = event.multiplier; next.round.state = "CRASH"; break;
      case "SETTLED": next.round.state = "RESULT"; break;
    }
    return { ...next, receivedAt: event.occurredAt };
  }
}
