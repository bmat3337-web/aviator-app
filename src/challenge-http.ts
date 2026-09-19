import { ChallengeApi } from "./challenge-api";
import { ChallengePrediction } from "./challenge";
import { RoundState } from "./domain";
import { requireTelegramUser } from "./telegram-auth";

export interface ChallengeHttpRequest {
  method:"GET"|"POST";
  path:string;
  body?:unknown;
  headers?:Record<string,string|undefined>;
}

export interface ChallengeHttpResponse { status:number; body:unknown; }

export async function handleChallengeHttp(
  api:ChallengeApi,
  request:ChallengeHttpRequest,
  botToken:string,
):Promise<ChallengeHttpResponse>{
  const match=request.path.match(/^\/api\/v1\/challenges\/([^/]+)(?:\/(leaderboard|predictions|settlement))?$/);
  if(!match)return{status:404,body:{error:"NOT_FOUND"}};
  const challengeId=decodeURIComponent(match[1]); const action=match[2];

  try{
    if(request.method==="GET"&&!action)return{status:200,body:{data:await api.getChallenge(challengeId)}};
    if(request.method==="GET"&&action==="leaderboard")return{status:200,body:{data:await api.leaderboard(challengeId)}};

    if(request.method==="POST"&&action==="predictions"){
      const user=requireTelegramUser(request.headers??{},botToken);
      const body=request.body as Partial<ChallengePrediction>;
      if(!body||body.challengeId!==challengeId)throw new Error("CHALLENGE_ID_MISMATCH");
      if(body.participantId!==undefined&&String(body.participantId)!==String(user.id))throw new Error("PARTICIPANT_ID_MISMATCH");
      const prediction:ChallengePrediction={
        challengeId,
        participantId:String(user.id),
        roundNumber:Number(body.roundNumber),
        targetState:body.targetState as ChallengePrediction["targetState"],
        submittedAt:new Date().toISOString(),
        signalVersion:String(body.signalVersion??"1.0.0"),
      };
      await api.submit(challengeId,prediction);
      return{status:201,body:{data:{accepted:true,participantId:String(user.id)}}};
    }

    if(request.method==="POST"&&action==="settlement"){
      const user=requireTelegramUser(request.headers??{},botToken);
      if(!user)throw new Error("TELEGRAM_AUTH_REQUIRED");
      throw new Error("SETTLEMENT_FORBIDDEN");
    }

    return{status:405,body:{error:"METHOD_NOT_ALLOWED"}};
  }catch(error){
    const message=error instanceof Error?error.message:"REQUEST_FAILED";
    const status=message==="TELEGRAM_AUTH_REQUIRED"||message==="INVALID_TELEGRAM_AUTH"||message==="STALE_TELEGRAM_AUTH"?401:
      message==="SETTLEMENT_FORBIDDEN"?403:
      message.includes("NOT_FOUND")?404:message.includes("DUPLICATE")?409:400;
    return{status,body:{error:message}};
  }
}
