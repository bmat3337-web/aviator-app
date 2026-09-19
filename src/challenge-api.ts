import { ChallengeStore, submitPrediction, settleRound } from "./challenge-service";
import { Challenge, ChallengePrediction } from "./challenge";
import { RoundState } from "./domain";

export interface ChallengeApi {
  getChallenge(challengeId: string): Challenge | null;
  submit(challengeId: string, prediction: ChallengePrediction): void;
  settle(challengeId: string, roundNumber: number, actualState: RoundState): void;
  leaderboard(challengeId: string): ReturnType<ChallengeStore["scores"]>;
}

export class InMemoryChallengeApi implements ChallengeApi {
  constructor(private readonly store: ChallengeStore) {}

  getChallenge(challengeId: string) { return this.store.get(challengeId); }

  submit(challengeId: string, prediction: ChallengePrediction) {
    if (prediction.challengeId !== challengeId) throw new Error("CHALLENGE_ID_MISMATCH");
    submitPrediction(this.store, prediction);
  }

  settle(challengeId: string, roundNumber: number, actualState: RoundState) {
    settleRound(this.store, challengeId, roundNumber, actualState);
  }

  leaderboard(challengeId: string) {
    return this.store.scores(challengeId).sort(
      (a,b) => b.points-a.points || b.correct-a.correct || a.participantId.localeCompare(b.participantId),
    );
  }
}
