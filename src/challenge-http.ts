import { InMemoryChallengeApi } from "./challenge-api";
import { ChallengePrediction } from "./challenge";
import { RoundState } from "./domain";

export interface ChallengeHttpRequest {
  method: "GET" | "POST";
  path: string;
  body?: unknown;
}

export interface ChallengeHttpResponse {
  status: number;
  body: unknown;
}

export function handleChallengeHttp(
  api: InMemoryChallengeApi,
  request: ChallengeHttpRequest,
): ChallengeHttpResponse {
  const match = request.path.match(/^\/api\/v1\/challenges\/([^/]+)(?:\/(leaderboard|predictions|settlement))?$/);
  if (!match) return { status: 404, body: { error: "NOT_FOUND" } };

  const challengeId = decodeURIComponent(match[1]);
  const action = match[2];

  try {
    if (request.method === "GET" && !action) {
      return { status: 200, body: { data: api.getChallenge(challengeId) } };
    }

    if (request.method === "GET" && action === "leaderboard") {
      return { status: 200, body: { data: api.leaderboard(challengeId) } };
    }

    if (request.method === "POST" && action === "predictions") {
      const prediction = request.body as ChallengePrediction;
      api.submit(challengeId, prediction);
      return { status: 201, body: { data: { accepted: true } } };
    }

    if (request.method === "POST" && action === "settlement") {
      const body = request.body as { roundNumber: number; actualState: RoundState };
      api.settle(challengeId, body.roundNumber, body.actualState);
      return { status: 200, body: { data: api.leaderboard(challengeId) } };
    }

    return { status: 405, body: { error: "METHOD_NOT_ALLOWED" } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "REQUEST_FAILED";
    const status = message.includes("NOT_FOUND") ? 404 : message.includes("DUPLICATE") ? 409 : 400;
    return { status, body: { error: message } };
  }
}
