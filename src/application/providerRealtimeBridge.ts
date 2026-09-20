import type { FlightSnapshot } from "./flightSnapshot";
import { RealtimeResyncCoordinator } from "./realtimeResyncCoordinator";
import type { ProviderAdapter, ProviderRoundEvent } from "./providerAdapter";

export interface ProviderRealtimeBridgeState {
  readonly connected: boolean;
  readonly subscribed: boolean;
  readonly coordinator: ReturnType<RealtimeResyncCoordinator["state"]>;
}

/**
 * Bridges a ProviderAdapter into the provider-neutral realtime coordinator.
 *
 * This class deliberately contains no provider-specific protocol knowledge.
 * The adapter owns authentication/transport; the bridge owns lifecycle and
 * application handoff.
 */
export class ProviderRealtimeBridge {
  private connected = false;
  private subscribed = false;
  private unsubscribe: (() => Promise<void>) | null = null;

  constructor(
    private readonly adapter: ProviderAdapter,
    private readonly coordinator: RealtimeResyncCoordinator,
  ) {}

  async connect(): Promise<void> {
    await this.adapter.connect();
    this.connected = true;
  }

  async subscribe(): Promise<void> {
    if (!this.connected) throw new Error("Provider must be connected before subscribe");
    if (this.subscribed) return;

    this.unsubscribe = await this.adapter.subscribeRoundEvents(
      async (event: ProviderRoundEvent) => {
        this.coordinator.ingest(event);
      },
    );
    this.subscribed = true;
  }

  markTransportStale(reason = "provider-stream-stale"): void {
    this.coordinator.markConnectionStale(reason);
    this.subscribed = false;
  }

  async disconnect(): Promise<void> {
    if (this.unsubscribe) {
      await this.unsubscribe();
      this.unsubscribe = null;
    }
    this.subscribed = false;
    this.connected = false;
  }

  async resync(snapshot: FlightSnapshot): Promise<void> {
    if (!this.connected) throw new Error("Provider must be connected before resync");
    if (this.coordinator.state().status !== "RESYNC_REQUIRED") {
      throw new Error("Resync is not required");
    }
    this.coordinator.beginResync();
    this.coordinator.installAuthoritativeSnapshot(snapshot);
  }

  state(): ProviderRealtimeBridgeState {
    return {
      connected: this.connected,
      subscribed: this.subscribed,
      coordinator: this.coordinator.state(),
    };
  }
}
