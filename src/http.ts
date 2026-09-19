import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { AviatorAnalysisService } from "./service";
import { createRound } from "./ingestion";
import { toMiniAppViewModel } from "./miniapp";
import { ChallengeApi } from "./challenge-api";
import { handleChallengeHttp } from "./challenge-http";

function json(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}
async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

export function createApiServer(service: AviatorAnalysisService, challengeApi?: ChallengeApi) {
  return createServer(async (req, res) => {
    const requestId = randomUUID();
    try {
      if (req.url?.startsWith("/api/v1/challenges/")) {
        if (!challengeApi) return json(res, 503, { error: { code: "CHALLENGE_SERVICE_UNAVAILABLE", requestId } });
        const body = await readBody(req);
        const method = req.method === "POST" ? "POST" : "GET";
        const result = handleChallengeHttp(challengeApi, { method, path: req.url, body });
        return json(res, result.status, result.body);
      }
      if (req.method === "GET" && req.url === "/api/v1/analytics") {
        const snapshot = await service.snapshot();
        return json(res, 200, { version: "1", requestId, data: toMiniAppViewModel(snapshot) });
      }
      if (req.method === "POST" && req.url === "/api/v1/rounds") {
        const body = await readBody(req) as { roundId?:string; sequence?:number; multiplier?:number; timestamp?:string; source?:"manual"|"telegram"|"import"|"provider" };
        const round = createRound({ roundId:body.roundId??"", sequence:body.sequence??-1, multiplier:body.multiplier??NaN, timestamp:body.timestamp??"", source:body.source });
        await service.ingest(round);
        return json(res, 201, { version:"1", requestId, data:{ roundId:round.roundId } });
      }
      if (req.method === "GET" && req.url === "/api/v1/health") return json(res, 200, { status:"ok", version:"1" });
      return json(res, 404, { error:{ code:"NOT_FOUND", requestId } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "REQUEST_FAILED";
      const status = message.includes("DUPLICATE") ? 409 : message.includes("NOT_FOUND") ? 404 : 400;
      return json(res, status, { error:{ code:message, message, requestId } });
    }
  });
}
