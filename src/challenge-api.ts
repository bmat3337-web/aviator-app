import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";
import { ChallengeStore } from "./challenge-service";
import { RoundState } from "./domain";

export interface ChallengeApi {
  getChallenge(challengeId:string):Promise<Challenge|null>;
  submit(challengeId:string,prediction:ChallengePrediction):Promise<void>;
  settle(challengeId:string,roundNumber:number,actualState:RoundState):Promise<void>;
  leaderboard(challengeId:string):Promise<ChallengeScore[]>;
}

export class ChallengeServiceApi implements ChallengeApi {
  constructor(private readonly store:ChallengeStore){}
  async getChallenge(id:string){return this.store.get(id);}
  async submit(id:string,p:ChallengePrediction){
    if(p.challengeId!==id)throw new Error("CHALLENGE_ID_MISMATCH");
    const c=await this.store.get(id);
    if(!c)throw new Error("CHALLENGE_NOT_FOUND");
    if(c.state!=="LIVE")throw new Error("CHALLENGE_NOT_LIVE");
    if(p.roundNumber!==c.currentRound+1)throw new Error("ROUND_NOT_OPEN");
    await this.store.addPrediction(p);
  }
  async settle(id:string,r:number,s:RoundState){
    const store=this.store as ChallengeStore & { settleRound?: (id:string,r:number,s:RoundState)=>Promise<void> };
    if(typeof store.settleRound==="function"){await store.settleRound(id,r,s);return;}
    throw new Error("DATABASE_SETTLEMENT_REQUIRED");
  }
  async leaderboard(id:string){return (await this.store.scores(id)).sort((a,b)=>b.points-a.points||b.correct-a.correct||a.participantId.localeCompare(b.participantId));}
}
