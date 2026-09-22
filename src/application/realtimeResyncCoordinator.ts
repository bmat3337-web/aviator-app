import type { FlightSnapshot } from "./flightSnapshot";
import type { ProviderRoundEvent } from "./providerAdapter";
import { RealtimeFlightProjection } from "./realtimeFlightProjection";

export type ResyncStatus = "READY" | "RESYNC_REQUIRED" | "RESYNCING";

export interface ResyncCoordinatorState {
  readonly status: ResyncStatus;
  readonly lastReason: string | null;
  readonly resyncCount: number;
}

/**
 * Coordinates recovery from a stale realtime stream.
 *
 * A stale stream cannot resume by accepting incremental events. The caller
 * must install a fresh authoritative snapshot first; only then is the
 * sequence cursor reopened.
 */
export class RealtimeResyncCoordinator {
  private status: ResyncStatus = "READY";
  private lastReason: string | null = null;
  private resyncCount = 0;

  constructor(private readonly projection: RealtimeFlightProjection) {}

  markConnectionStale(reason = "connection-stale"): void {
    this.status = "RESYNC_REQUIRED";
    this.lastReason = reason;
    this.projection.markStale();
  }

  beginResync(): void {
    if (this.status !== "RESYNC_REQUIRED") {
      throw new Error("Resync is not required");
    }
    this.status = "RESYNCING";
  }

  installAuthoritativeSnapshot(snapshot: FlightSnapshot): void {
    if (this.status !== "RESYNCING") {
      throw new Error("Resync has not started");
    }
    this.projection.resync(snapshot);
    this.status = "READY";
    this.resyncCount += 1;
  }

  ingest(event: ProviderRoundEvent): boolean {
    if (this.status !== "READY") return false;
    return this.projection.ingest(event);
  }

  state(): ResyncCoordinatorState {
    return {
      status: this.status,
      lastReason: this.lastReason,
      resyncCount: this.resyncCount,
    };
  }
}
