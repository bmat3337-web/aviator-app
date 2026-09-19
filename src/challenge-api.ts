import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";
import { ChallengeStore, submitPrediction, settleRound } from "./challenge-service";
import { RoundState } from "./domain";

export interface ChallengeApi {
  getChallenge(challengeId:string):Promise<Challenge|null>;
  submit(challengeId:string,prediction:ChallengePrediction):Promise<void>;
  settle(challengeId:string,roundNumber:number,actualState:RoundState):Promise<void>;
  leaderboard(challengeId:string):Promise<ChallengeScore[]>;
}

export class InMemoryChallengeApi implements ChallengeApi {
  constructor(private readonly store:ChallengeStore){}
  getChallenge(id:string){return this.store.get(id);}
  async submit(id:string,p:ChallengePrediction){if(p.challengeId!==id)throw new Error("CHALLENGE_ID_MISMATCH");await submitPrediction(this.store,p);}
  async settle(id:string,r:number,s:RoundState){await settleRound(this.store,id,r,s);}
  async leaderboard(id:string){return (await this.store.scores(id)).sort((a,b)=>b.points-a.points||b.correct-a.correct||a.participantId.localeCompare(b.participantId));}
}