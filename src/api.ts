import { Round } from "./domain";
import { AnalysisSignal } from "./signal";
import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";

export interface ApiEnvelope<T> {
  version: "1";
  requestId: string;
  data: T;
}

export interface IngestRoundRequest { round: Omit<Round, "source"> & { source?: Round["source"] } }
export interface AnalysisResponse { rounds: Round[]; signal?: AnalysisSignal }
export interface ChallengeResponse { challenge: Challenge; predictions: ChallengePrediction[]; scores: ChallengeScore[] }

export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "DUPLICATE_ROUND"
  | "ROUND_NOT_FOUND"
  | "CHALLENGE_LOCKED"
  | "UNAUTHORIZED";

export interface ApiError { code: ApiErrorCode; message: string; requestId: string }