export type MiniAppRoute = "home" | "analytics" | "signal" | "challenge" | "leaderboard";

export interface MiniAppAction {
  type: "REFRESH" | "OPEN_ANALYTICS" | "OPEN_SIGNAL" | "OPEN_CHALLENGE" | "OPEN_LEADERBOARD";
  challengeId?: string;
}

export function parseMiniAppAction(action: MiniAppAction): MiniAppRoute {
  switch (action.type) {
    case "OPEN_ANALYTICS": return "analytics";
    case "OPEN_SIGNAL": return "signal";
    case "OPEN_CHALLENGE": return "challenge";
    case "OPEN_LEADERBOARD": return "leaderboard";
    default: return "home";
  }
}
