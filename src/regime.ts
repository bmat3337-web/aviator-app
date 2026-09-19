import { ClassifiedRound, RoundState } from "./domain";

export type VolatilityRegime = "QUIET" | "NORMAL" | "ELEVATED" | "EXTREME";

export interface RegimeSnapshot {
  regime: VolatilityRegime;
  windowSize: number;
  lowRate: number;
  basePlusRate: number;
  highPlusRate: number;
  extremeRate: number;
}

const rate = (rounds: ClassifiedRound[], states: RoundState[]) =>
  rounds.length ? rounds.filter((r) => states.includes(r.state)).length / rounds.length : 0;

export function detectRegime(rounds: ClassifiedRound[], windowSize = 30): RegimeSnapshot {
  const window = rounds.slice(-Math.max(1, windowSize));
  const extremeRate = rate(window, ["EXTREME"]);
  const highPlusRate = rate(window, ["HIGH", "EXTREME"]);
  const lowRate = rate(window, ["LOW"]);
  const basePlusRate = rate(window, ["BASE", "HIGH", "EXTREME"]);

  const regime: VolatilityRegime =
    extremeRate >= 0.10 ? "EXTREME" :
    highPlusRate >= 0.30 ? "ELEVATED" :
    lowRate >= 0.65 ? "QUIET" : "NORMAL";

  return { regime, windowSize: window.length, lowRate, basePlusRate, highPlusRate, extremeRate };
}