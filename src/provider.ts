import { createRound } from "./ingestion";
import { AviatorRound } from "./domain";

export interface ProviderRound {
  roundId:string;
  sequence:number;
  multiplier:number;
  timestamp:string;
  source?: "provider";
  metadata?:Record<string,unknown>;
}

export interface AviatorProvider {
  readonly name:string;
  fetchLatest():Promise<ProviderRound[]>;
}

export function normalizeProviderRound(input:ProviderRound):AviatorRound {
  return createRound({
    roundId:input.roundId,
    sequence:input.sequence,
    multiplier:input.multiplier,
    timestamp:input.timestamp,
    source:"provider",
    metadata:{...(input.metadata??{}),provider:true},
  });
}
