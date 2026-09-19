import { ClassifiedRound, RoundState } from "./domain";
import { detectRegime, VolatilityRegime } from "./regime";
import { conditionalNextStateRate } from "./statistics";

export type SignalDirection = "OBSERVE" | "FOLLOW_STATE" | "NO_SIGNAL";

export interface AnalysisSignal {
  signalVersion: string;
  direction: SignalDirection;
  currentState: RoundState;
  regime: VolatilityRegime;
  targetState: RoundState | null;
  observedRate: number;
  sampleSize: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  rationale: string;
}

export function generateSignal(rounds: ClassifiedRound[], windowSize = 100): AnalysisSignal {
  const window = rounds.slice(-Math.max(1, windowSize));
  if (!window.length) return { signalVersion:"1.0.0", direction:"NO_SIGNAL", currentState:"LOW", regime:"NORMAL", targetState:null, observedRate:0, sampleSize:0, confidence:"LOW", rationale:"No rounds available." };
  const currentState = window[window.length - 1].state;
  const regime = detectRegime(window, Math.min(30, window.length));
  const states: RoundState[] = ["LOW","MID","BASE","HIGH","EXTREME"];
  const candidates = states.map((targetState) => conditionalNextStateRate(window, currentState, targetState))
    .sort((a,b) => b.rate-a.rate || b.sampleSize-a.sampleSize);
  const best = candidates[0];
  const confidence = best.sampleSize >= 50 ? "HIGH" : best.sampleSize >= 15 ? "MEDIUM" : "LOW";
  const direction: SignalDirection = best.sampleSize >= 10 ? "FOLLOW_STATE" : "OBSERVE";
  return { signalVersion:"1.0.0", direction, currentState, regime:regime.regime, targetState:best.state, observedRate:Number(best.rate.toFixed(4)), sampleSize:best.sampleSize, confidence, rationale:`Observed transition frequency from ${currentState} to ${best.state}; n=${best.sampleSize}. Historical statistic only.` };
}