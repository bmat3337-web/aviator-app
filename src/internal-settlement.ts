import { ChallengeApi } from "./challenge-api";
import { RoundState } from "./domain";

export interface SettlementRequest {
  challengeId:string;
  roundNumber:number;
  actualState:RoundState;
}

export async function settleChallengeRound(
  api:ChallengeApi,
  request:SettlementRequest,
):Promise<void>{
  if(!request.challengeId.trim()) throw new Error("CHALLENGE_ID_REQUIRED");
  if(!Number.isInteger(request.roundNumber)||request.roundNumber<1) throw new Error("INVALID_ROUND_NUMBER");
  await api.settle(request.challengeId,request.roundNumber,request.actualState);
}
