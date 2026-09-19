import { Challenge } from "./challenge";
import { ChallengeApi } from "./challenge-api";
import { RoundState } from "./domain";

export interface MiniAppChallengeModel {
  challenge: Challenge | null;
  leaderboard: Array<{ participantId: string; points: number; correct: number; settledRounds: number }>;
  availableStates: RoundState[];
}

export async function getChallengeModel(api: ChallengeApi, challengeId: string): Promise<MiniAppChallengeModel> {
  return {
    challenge: await api.getChallenge(challengeId),
    leaderboard: await api.leaderboard(challengeId),
    availableStates: ["LOW","MID","BASE","HIGH","EXTREME"],
  };
}
