import { Challenge, ChallengePrediction, ChallengeScore, scorePrediction } from "./challenge";
import { RoundState } from "./domain";

export interface ChallengeStore {
  get(challengeId: string): Challenge | null;
  save(challenge: Challenge): void;
  predictions(challengeId: string): ChallengePrediction[];
  addPrediction(prediction: ChallengePrediction): void;
  scores(challengeId: string): ChallengeScore[];
  saveScore(score: ChallengeScore): void;
}

export class InMemoryChallengeStore implements ChallengeStore {
  private challenges = new Map<string, Challenge>();
  private predictionMap = new Map<string, ChallengePrediction>();
  private scoreMap = new Map<string, ChallengeScore>();

  get(id: string) { return this.challenges.get(id) ?? null; }
  save(challenge: Challenge) { this.challenges.set(challenge.challengeId, { ...challenge }); }

  predictions(id: string) {
    return [...this.predictionMap.values()].filter(p => p.challengeId === id);
  }

  addPrediction(prediction: ChallengePrediction) {
    const key = [prediction.challengeId, prediction.participantId, prediction.roundNumber].join(":");
    if (this.predictionMap.has(key)) throw new Error("DUPLICATE_PREDICTION");
    this.predictionMap.set(key, { ...prediction });
  }

  scores(id: string) { return [...this.scoreMap.values()].filter(s => s.challengeId === id); }
  saveScore(score: ChallengeScore) {
    this.scoreMap.set([score.challengeId, score.participantId].join(":"), { ...score });
  }
}

export function submitPrediction(
  store: ChallengeStore,
  prediction: ChallengePrediction,
): void {
  const challenge = store.get(prediction.challengeId);
  if (!challenge) throw new Error("CHALLENGE_NOT_FOUND");
  if (challenge.state !== "LIVE") throw new Error("CHALLENGE_NOT_LIVE");
  if (prediction.roundNumber !== challenge.currentRound + 1) {
    throw new Error("ROUND_NOT_OPEN");
  }
  store.addPrediction(prediction);
}

export function settleRound(
  store: ChallengeStore,
  challengeId: string,
  roundNumber: number,
  actualState: RoundState,
): ChallengeScore[] {
  const challenge = store.get(challengeId);
  if (!challenge) throw new Error("CHALLENGE_NOT_FOUND");

  const predictions = store.predictions(challengeId)
    .filter(p => p.roundNumber === roundNumber);

  for (const prediction of predictions) {
    const existing = store.scores(challengeId)
      .find(s => s.participantId === prediction.participantId);
    const current = existing ?? {
      challengeId,
      participantId: prediction.participantId,
      points: 0,
      correct: 0,
      settledRounds: 0,
    };
    const point = scorePrediction(prediction, actualState);
    current.points += point;
    current.correct += point;
    current.settledRounds += 1;
    store.saveScore(current);
  }

  return store.scores(challengeId);
}
