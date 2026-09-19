import { Challenge, ChallengePrediction, ChallengeScore, scorePrediction } from "./challenge";
import { RoundState } from "./domain";

export interface ChallengeStore {
  get(challengeId: string): Promise<Challenge | null>;
  save(challenge: Challenge): Promise<void>;
  predictions(challengeId: string): Promise<ChallengePrediction[]>;
  addPrediction(prediction: ChallengePrediction): Promise<void>;
  scores(challengeId: string): Promise<ChallengeScore[]>;
  saveScore(score: ChallengeScore): Promise<void>;
  isSettled(challengeId: string, roundNumber: number): Promise<boolean>;
  markSettled(challengeId: string, roundNumber: number): Promise<void>;
}

export class InMemoryChallengeStore implements ChallengeStore {
  private challenges = new Map<string, Challenge>();
  private predictionMap = new Map<string, ChallengePrediction>();
  private scoreMap = new Map<string, ChallengeScore>();
  private settled = new Set<string>();

  async get(id:string){ return this.challenges.get(id) ?? null; }
  async save(c:Challenge){ this.challenges.set(c.challengeId,{...c}); }
  async predictions(id:string){ return [...this.predictionMap.values()].filter(p=>p.challengeId===id); }
  async addPrediction(p:ChallengePrediction){
    const key=[p.challengeId,p.participantId,p.roundNumber].join(":");
    if(this.predictionMap.has(key)) throw new Error("DUPLICATE_PREDICTION");
    this.predictionMap.set(key,{...p});
  }
  async scores(id:string){ return [...this.scoreMap.values()].filter(s=>s.challengeId===id); }
  async saveScore(s:ChallengeScore){ this.scoreMap.set([s.challengeId,s.participantId].join(":"),{...s}); }
  async isSettled(id:string,r:number){ return this.settled.has(id+":"+r); }
  async markSettled(id:string,r:number){ this.settled.add(id+":"+r); }
}

export async function submitPrediction(store:ChallengeStore,prediction:ChallengePrediction):Promise<void>{
  const challenge=await store.get(prediction.challengeId);
  if(!challenge) throw new Error("CHALLENGE_NOT_FOUND");
  if(challenge.state!=="LIVE") throw new Error("CHALLENGE_NOT_LIVE");
  if(prediction.roundNumber!==challenge.currentRound+1) throw new Error("ROUND_NOT_OPEN");
  await store.addPrediction(prediction);
}

export async function settleRound(store:ChallengeStore,challengeId:string,roundNumber:number,actualState:RoundState):Promise<ChallengeScore[]>{
  const challenge=await store.get(challengeId);
  if(!challenge) throw new Error("CHALLENGE_NOT_FOUND");

  // Repeated settlement of an already-settled round is a successful no-op.
  if(await store.isSettled(challengeId,roundNumber)) return store.scores(challengeId);

  if(challenge.state!=="LIVE"&&challenge.state!=="SETTLEMENT") throw new Error("CHALLENGE_NOT_SETTLEABLE");
  if(roundNumber!==challenge.currentRound+1) throw new Error("ROUND_NOT_OPEN");

  for(const prediction of (await store.predictions(challengeId)).filter(p=>p.roundNumber===roundNumber)){
    const existing=(await store.scores(challengeId)).find(s=>s.participantId===prediction.participantId);
    const current=existing??{challengeId,participantId:prediction.participantId,points:0,correct:0,settledRounds:0};
    const point=scorePrediction(prediction,actualState);
    current.points+=point; current.correct+=point; current.settledRounds+=1;
    await store.saveScore(current);
  }
  await store.markSettled(challengeId,roundNumber);
  const nextState=roundNumber>=challenge.totalRounds?"COMPLETED":"LIVE";
  await store.save({...challenge,currentRound:roundNumber,state:nextState});
  return store.scores(challengeId);
}