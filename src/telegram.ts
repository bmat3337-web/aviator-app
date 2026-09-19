import { AviatorAnalysisService } from "./service";
import { AnalysisSignal } from "./signal";
import { Challenge, ChallengePrediction, ChallengeScore } from "./challenge";

export interface TelegramCommandContext {
  chatId: string;
  userId: string;
  args: string[];
}

export interface TelegramReply {
  text: string;
  parseMode?: "HTML";
}

export function formatSignal(signal: AnalysisSignal): TelegramReply {
  const target = signal.targetState ?? "NONE";
  return {
    parseMode: "HTML",
    text: [
      "<b>Aviator Analysis Signal</b>",
      `State: <b>${signal.currentState}</b>`,
      `Regime: <b>${signal.regime}</b>`,
      `Observed target: <b>${target}</b>`,
      `Observed rate: <b>${(signal.observedRate * 100).toFixed(2)}%</b>`,
      `Sample size: <b>${signal.sampleSize}</b>`,
      `Confidence: <b>${signal.confidence}</b>`,
      `Mode: <b>${signal.direction}</b>`,
      "",
      "Historical statistic only; not a guarantee of the next game outcome.",
    ].join("\n"),
  };
}

export function formatChallenge(challenge: Challenge): TelegramReply {
  return {
    parseMode: "HTML",
    text: [
      `<b>${challenge.title}</b>`,
      `Status: <b>${challenge.state}</b>`,
      `Round: <b>${challenge.currentRound}/${challenge.totalRounds}</b>`,
      `Starts: ${challenge.startsAt}`,
      `Ends: ${challenge.endsAt}`,
    ].join("\n"),
  };
}

export function formatScores(scores: ChallengeScore[]): TelegramReply {
  if (!scores.length) return { text: "No settled scores yet." };
  return {
    parseMode: "HTML",
    text: ["<b>Challenge Scores</b>", ...scores.map((s, i) =>
      `${i + 1}. <b>${s.participantId}</b> — ${s.points} pts (${s.correct}/${s.settledRounds})`
    )].join("\n"),
  };
}

export async function handleAnalysisCommand(
  command: string,
  service: AviatorAnalysisService,
): Promise<TelegramReply> {
  switch (command) {
    case "/start":
      return { text: "Aviator Analysis\n\n/analytics — current engine snapshot\n/signal — current statistical signal\n/history — latest rounds" };
    case "/analytics": {
      const snapshot = await service.snapshot();
      return {
        parseMode: "HTML",
        text: `<b>Analytics</b>\nRounds: ${snapshot.analysis.sampleSize}\nLatest: ${snapshot.analysis.latest?.multiplier.toFixed(2) ?? "—"}x\nRegime: ${snapshot.signal.regime}`,
      };
    }
    case "/signal": {
      const snapshot = await service.snapshot();
      return formatSignal(snapshot.signal);
    }
    case "/history": {
      const snapshot = await service.snapshot();
      return { text: snapshot.rounds.slice(-20).map(r => `${r.sequence}: ${r.multiplier.toFixed(2)}x [${r.state}]`).join("\n") || "No rounds logged." };
    }
    default:
      return { text: "Unknown command. Use /start for available commands." };
  }
}

export type { Challenge, ChallengePrediction, ChallengeScore };
