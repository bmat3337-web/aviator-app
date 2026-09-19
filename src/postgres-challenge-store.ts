import { SqlClient } from "./postgres-repository";
import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";
import { ChallengeStore } from "./challenge-service";
import { RoundState } from "./domain";

export class PostgresChallengeStore implements ChallengeStore {
  constructor(private readonly db: SqlClient) {}

  async get(id:string):Promise<Challenge|null>{
    const r=await this.db.query<any>(
      `select challenge_id,title,state,total_rounds,current_round,starts_at,ends_at
       from aviator_challenges where challenge_id=$1`,[id]);
    const x=r.rows[0]; if(!x)return null;
    return {challengeId:x.challenge_id,title:x.title,state:x.state,totalRounds:x.total_rounds,currentRound:x.current_round,startsAt:x.starts_at,endsAt:x.ends_at};
  }

  async save(c:Challenge):Promise<void>{
    await this.db.query(
      `insert into aviator_challenges(challenge_id,title,state,total_rounds,current_round,starts_at,ends_at)
       values($1,$2,$3,$4,$5,$6,$7)
       on conflict(challenge_id) do update set title=excluded.title,state=excluded.state,
       total_rounds=excluded.total_rounds,current_round=excluded.current_round,
       starts_at=excluded.starts_at,ends_at=excluded.ends_at`,
      [c.challengeId,c.title,c.state,c.totalRounds,c.currentRound,c.startsAt,c.endsAt]);
  }

  async predictions(id:string):Promise<ChallengePrediction[]>{
    const r=await this.db.query<any>(
      `select challenge_id,participant_id,round_number,target_state,submitted_at,signal_version
       from aviator_challenge_predictions where challenge_id=$1
       order by round_number,participant_id`,[id]);
    return r.rows.map((x:any)=>({challengeId:x.challenge_id,participantId:x.participant_id,roundNumber:x.round_number,targetState:x.target_state,submittedAt:x.submitted_at,signalVersion:x.signal_version}));
  }

  async addPrediction(p:ChallengePrediction):Promise<void>{
    await this.db.query(
      `insert into aviator_challenge_predictions(challenge_id,participant_id,round_number,target_state,submitted_at,signal_version)
       values($1,$2,$3,$4,$5,$6)`,
      [p.challengeId,p.participantId,p.roundNumber,p.targetState,p.submittedAt,p.signalVersion]);
  }

  async scores(id:string):Promise<ChallengeScore[]>{
    const r=await this.db.query<any>(
      `select challenge_id,participant_id,points,correct,settled_rounds
       from aviator_challenge_scores where challenge_id=$1
       order by points desc,correct desc,participant_id asc`,[id]);
    return r.rows;
  }

  async saveScore(s:ChallengeScore):Promise<void>{
    await this.db.query(
      `insert into aviator_challenge_scores(challenge_id,participant_id,points,correct,settled_rounds)
       values($1,$2,$3,$4,$5)
       on conflict(challenge_id,participant_id) do update set points=excluded.points,
       correct=excluded.correct,settled_rounds=excluded.settled_rounds,updated_at=now()`,
      [s.challengeId,s.participantId,s.points,s.correct,s.settledRounds]);
  }

  async isSettled(id:string,round:number):Promise<boolean>{
    const r=await this.db.query(
      `select 1 from aviator_challenge_round_settlements where challenge_id=$1 and round_number=$2`,
      [id,round]);
    return r.rows.length>0;
  }

  async markSettled(id:string,round:number):Promise<void>{
    await this.db.query(
      `insert into aviator_challenge_round_settlements(challenge_id,round_number,actual_state)
       values($1,$2,'LOW') on conflict(challenge_id,round_number) do nothing`,
      [id,round]);
  }

  async settleRound(challengeId:string,roundNumber:number,actualState:RoundState):Promise<void>{
    await this.db.query(
      "select settle_aviator_challenge_round($1,$2,$3)",
      [challengeId,roundNumber,actualState]);
  }
}
