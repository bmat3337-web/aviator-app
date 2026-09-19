export const ANALYSIS_VERSION = "1.0.0";

export type RoundSource = "manual" | "telegram" | "import" | "provider";

export interface Round {
  roundId: string;
  sequence: number;
  multiplier: number;
  timestamp: string;
  source: RoundSource;
}

export type RoundState = "LOW" | "MID" | "BASE" | "HIGH" | "EXTREME";

export interface ClassifiedRound extends Round {
  state: RoundState;
}

export interface ThresholdProfile {
  lowMax: number;
  baseMin: number;
  highMin: number;
  extremeMin: number;
}

export interface Streak {
  state: RoundState;
  length: number;
}

export interface DistributionBucket {
  state: RoundState;
  count: number;
  percentage: number;
}

export interface AnalysisSnapshot {
  analysisVersion: string;
  sampleSize: number;
  latest?: ClassifiedRound;
  currentStreak: Streak | null;
  distribution: DistributionBucket[];
}
