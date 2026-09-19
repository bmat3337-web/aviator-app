import { RoundState } from "./domain";
import { AnalysisSignal } from "./signal";

export type ChallengeState = "DRAFT" | "SCHEDULED" | "LIVE" | "LOCKED" | "SETTLEMENT" | "COMPLETED";

export interface Challenge {
  challengeId: string;
  title: string;
  state: ChallengeState;
  totalRounds: number;
  currentRound: number;
  startsAt: string;
  endsAt: string;
}

export interface ChallengePrediction {
  challengeId: string;
  participantId: string;
  roundNumber: number;
  targetState: RoundState;
  submittedAt: string;
  signalVersion: string;
}

export interface ChallengeScore {
  challengeId: string;
  participantId: string;
  points: number;
  correct: number;
  settledRounds: number;
}

export function scorePrediction(prediction: ChallengePrediction, actualState: RoundState): number {
  return prediction.targetState === actualState ? 1 : 0;
}

export function settleChallenge(challenge: Challenge, predictions: ChallengePrediction[], actualStates: RoundState[]): ChallengeScore[] {
  const scores = new Map<string, ChallengeScore>();
  for (const prediction of predictions) {
    if (prediction.challengeId !== challenge.challengeId) continue;
    const actual = actualStates[prediction.roundNumber - 1];
    if (!actual) continue;
    const key = prediction.participantId;
    const current = scores.get(key) ?? { challengeId: challenge.challengeId, participantId: key, points: 0, correct: 0, settledRounds: 0 };
    const point = scorePrediction(prediction, actual);
    current.points += point;
    current.correct += point;
    current.settledRounds += 1;
    scores.set(key, current);
  }
  return [...scores.values()].sort((a,b) => b.points-a.points || b.correct-a.correct || a.participantId.localeCompare(b.participantId));
}

export function validateSignalForChallenge(signal: AnalysisSignal): boolean {
  return signal.direction !== "NO_SIGNAL" && signal.sampleSize >= 10;
}