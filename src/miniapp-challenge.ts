import { InMemoryChallengeApi } from "./challenge-api";
import { Challenge } from "./challenge";
import { RoundState } from "./domain";

export interface MiniAppChallengeModel {
  challenge: Challenge | null;
  leaderboard: Array<{ participantId: string; points: number; correct: number; settledRounds: number }>;
  availableStates: RoundState[];
}

export function getChallengeModel(api: InMemoryChallengeApi, challengeId: string): MiniAppChallengeModel {
  return {
    challenge: api.getChallenge(challengeId),
    leaderboard: api.leaderboard(challengeId),
    availableStates: ["LOW","MID","BASE","HIGH","EXTREME"],
  };
}
