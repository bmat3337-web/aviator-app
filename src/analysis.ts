import {
  ANALYSIS_VERSION,
  AnalysisSnapshot,
  ClassifiedRound,
  DistributionBucket,
  Round,
  RoundState,
  Streak,
  ThresholdProfile,
} from "./domain";

export const DEFAULT_THRESHOLDS: ThresholdProfile = {
  lowMax: 1.5,
  baseMin: 2.0,
  highMin: 5.0,
  extremeMin: 10.0,
};

export function classifyRound(
  round: Round,
  thresholds: ThresholdProfile = DEFAULT_THRESHOLDS,
): ClassifiedRound {
  if (!Number.isFinite(round.multiplier) || round.multiplier < 1) {
    throw new Error("Multiplier must be a finite number >= 1");
  }

  let state: RoundState;
  if (round.multiplier <= thresholds.lowMax) state = "LOW";
  else if (round.multiplier < thresholds.baseMin) state = "MID";
  else if (round.multiplier < thresholds.highMin) state = "BASE";
  else if (round.multiplier < thresholds.extremeMin) state = "HIGH";
  else state = "EXTREME";

  return { ...round, state };
}

export function classifyRounds(
  rounds: Round[],
  thresholds: ThresholdProfile = DEFAULT_THRESHOLDS,
): ClassifiedRound[] {
  return [...rounds]
    .sort((a, b) => a.sequence - b.sequence)
    .map((round) => classifyRound(round, thresholds));
}

export function currentStreak(rounds: ClassifiedRound[]): Streak | null {
  if (!rounds.length) return null;
  const latest = rounds[rounds.length - 1];
  let length = 1;

  for (let i = rounds.length - 2; i >= 0; i--) {
    if (rounds[i].state !== latest.state) break;
    length += 1;
  }

  return { state: latest.state, length };
}

export function distribution(rounds: ClassifiedRound[]): DistributionBucket[] {
  const states: RoundState[] = ["LOW", "MID", "BASE", "HIGH", "EXTREME"];
  const total = rounds.length;

  return states.map((state) => {
    const count = rounds.filter((round) => round.state === state).length;
    return {
      state,
      count,
      percentage: total ? Number(((count / total) * 100).toFixed(4)) : 0,
    };
  });
}

export function analyze(
  rounds: Round[],
  thresholds: ThresholdProfile = DEFAULT_THRESHOLDS,
): AnalysisSnapshot {
  const classified = classifyRounds(rounds, thresholds);

  return {
    analysisVersion: ANALYSIS_VERSION,
    sampleSize: classified.length,
    latest: classified.at(-1),
    currentStreak: currentStreak(classified),
    distribution: distribution(classified),
  };
}
