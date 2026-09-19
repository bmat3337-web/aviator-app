import { ChallengeApi } from "./challenge-api";
import { RoundState } from "./domain";
import { settleChallengeRound } from "./internal-settlement";

export interface SettlementWorkerInput {
  challengeId:string;
  roundNumber:number;
  actualState:RoundState;
}

export interface SettlementWorker {
  process(input:SettlementWorkerInput):Promise<void>;
}

export function createSettlementWorker(api:ChallengeApi):SettlementWorker {
  return {
    async process(input) {
      await settleChallengeRound(api,input);
    },
  };
}
