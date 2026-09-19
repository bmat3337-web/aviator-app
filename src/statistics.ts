import { ClassifiedRound, RoundState } from "./domain";

export interface ConditionalRate {
  state: RoundState;
  sampleSize: number;
  occurrences: number;
  rate: number;
}

export function conditionalNextStateRate(
  rounds: ClassifiedRound[],
  currentState: RoundState,
  targetState: RoundState,
): ConditionalRate {
  let sampleSize = 0;
  let occurrences = 0;

  for (let i = 0; i < rounds.length - 1; i += 1) {
    if (rounds[i].state !== currentState) continue;
    sampleSize += 1;
    if (rounds[i + 1].state === targetState) occurrences += 1;
  }

  return {
    state: targetState,
    sampleSize,
    occurrences,
    rate: sampleSize ? occurrences / sampleSize : 0,
  };
}

export function conditionalMatrix(rounds: ClassifiedRound[]): ConditionalRate[] {
  const states: RoundState[] = ["LOW","MID","BASE","HIGH","EXTREME"];
  return states.flatMap((from) =>
    states.map((to) => conditionalNextStateRate(rounds, from, to)),
  );
}
