import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";
import { RoundState } from "./domain";
import { SqlClient } from "./postgres-repository";
import { ChallengeStore } from "./challenge-service";

type ChallengeRow = {
  challenge_id:string; title:string; state:Challenge["state"]; total_rounds:number;
  current_round:number; starts_at:string; ends_at:string;
};

type PredictionRow = {
  challenge_id:string; participant_id:string; round_number:number;
  target_state:RoundState; submitted_at:string; signal_version:string;
};

type ScoreRow = {
  challenge_id:string; participant_id:string; points:number; correct:number; settled_rounds:number;
};

export class PostgresChallengeStore implements ChallengeStore {
  constructor(private readonly db: SqlClient) {}

  async get(challengeId:string): Promise<Challenge|null> {
    const r=await this.db.query<ChallengeRow>(
      `select challenge_id,title,state,total_rounds,current_round,starts_at,ends_at
       from aviator_challenges where challenge_id=$1`,[challengeId]);
    const x=r.rows[0]; if(!x) return null;
    return {challengeId:x.challenge_id,title:x.title,state:x.state,totalRounds:x.total_rounds,currentRound:x.current_round,startsAt:x.starts_at,endsAt:x.ends_at};
  }

  async save(challenge:Challenge): Promise<void> {
    await this.db.query(
      `insert into aviator_challenges(challenge_id,title,state,total_rounds,current_round,starts_at,ends_at)
       values($1,$2,$3,$4,$5,$6,$7)
       on conflict(challenge_id) do update set title=excluded.title,state=excluded.state,
       total_rounds=excluded.total_rounds,current_round=excluded.current_round,
       starts_at=excluded.starts_at,ends_at=excluded.ends_at`,
      [challenge.challengeId,challenge.title,challenge.state,challenge.totalRounds,challenge.currentRound,challenge.startsAt,challenge.endsAt]);
  }

  async predictions(id:string):Promise<ChallengePrediction[]> {
    const r=await this.db.query<PredictionRow>(
      `select challenge_id,participant_id,round_number,target_state,submitted_at,signal_version
       from aviator_challenge_predictions where challenge_id=$1 order by round_number,participant_id`,[id]);
    return r.rows.map(x=>({challengeId:x.challenge_id,participantId:x.participant_id,roundNumber:x.round_number,targetState:x.target_state,submittedAt:x.submitted_at,signalVersion:x.signal_version}));
  }

  async addPrediction(p:ChallengePrediction):Promise<void> {
    await this.db.query(
      `insert into aviator_challenge_predictions(challenge_id,participant_id,round_number,target_state,submitted_at,signal_version)
       values($1,$2,$3,$4,$5,$6)`,
      [p.challengeId,p.participantId,p.roundNumber,p.targetState,p.submittedAt,p.signalVersion]);
  }

  async scores(id:string):Promise<ChallengeScore[]> {
    const r=await this.db.query<ScoreRow>(
      `select challenge_id,participant_id,points,correct,settled_rounds
       from aviator_challenge_scores where challenge_id=$1
       order by points desc,correct desc,participant_id asc`,[id]);
    return r.rows;
  }

  async saveScore(s:ChallengeScore):Promise<void> {
    await this.db.query(
      `insert into aviator_challenge_scores(challenge_id,participant_id,points,correct,settled_rounds)
       values($1,$2,$3,$4,$5)
       on conflict(challenge_id,participant_id) do update set points=excluded.points,
       correct=excluded.correct,settled_rounds=excluded.settled_rounds,updated_at=now()`,
      [s.challengeId,s.participantId,s.points,s.correct,s.settledRounds]);
  }

  isSettled():boolean { throw new Error("USE_DATABASE_SETTLEMENT"); }
  markSettled():void { throw new Error("USE_DATABASE_SETTLEMENT"); }
}
