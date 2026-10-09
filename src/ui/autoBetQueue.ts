import type { BetState, RoundState } from '../domain/game';

export function shouldPlaceAutoBet(input: {
  enabled: boolean;
  roundState: RoundState;
  roundId: string;
  slotState: BetState;
  skipRoundId: string | null;
  placedRoundId: string | null;
}): boolean {
  return input.enabled &&
    input.roundState === 'BETTING_OPEN' &&
    input.slotState === 'IDLE' &&
    input.skipRoundId !== input.roundId &&
    input.placedRoundId !== input.roundId;
}
