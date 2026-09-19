export interface MiniAppViewModel {
  version: "1";
  generatedAt: string;
  analytics: {
    sampleSize: number;
    latestMultiplier: number | null;
    latestState: string | null;
    currentStreak: { state: string; length: number } | null;
    regime: string;
  };
  signal: {
    direction: string;
    targetState: string | null;
    observedRate: number;
    sampleSize: number;
    confidence: string;
  };
}

export interface ChallengeViewModel {
  challengeId: string;
  title: string;
  state: string;
  currentRound: number;
  totalRounds: number;
}

export function toMiniAppViewModel(snapshot: {
  analysis: {
    sampleSize: number;
    latest?: { multiplier: number; state: string };
    currentStreak: { state: string; length: number } | null;
  };
  signal: {
    direction: string;
    targetState: string | null;
    observedRate: number;
    sampleSize: number;
    confidence: string;
    regime: string;
  };
}): MiniAppViewModel {
  return {
    version: "1",
    generatedAt: new Date().toISOString(),
    analytics: {
      sampleSize: snapshot.analysis.sampleSize,
      latestMultiplier: snapshot.analysis.latest?.multiplier ?? null,
      latestState: snapshot.analysis.latest?.state ?? null,
      currentStreak: snapshot.analysis.currentStreak,
      regime: snapshot.signal.regime,
    },
    signal: {
      direction: snapshot.signal.direction,
      targetState: snapshot.signal.targetState,
      observedRate: snapshot.signal.observedRate,
      sampleSize: snapshot.signal.sampleSize,
      confidence: snapshot.signal.confidence,
    },
  };
}
