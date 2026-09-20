import type { AviatorRoute } from "./navigation";

export interface RouteSurface {
  route: AviatorRoute;
  title: string;
  description: string;
  implemented: boolean;
}

export const ROUTE_SURFACES: RouteSurface[] = [
  {
    route: "flight",
    title: "Flight",
    description: "Live Aviator round and betting surface.",
    implemented: true,
  },
  {
    route: "challenge",
    title: "Challenge",
    description: "Challenges, achievements and leaderboards.",
    implemented: false,
  },
  {
    route: "social",
    title: "Social",
    description: "Chat, winners and live activity.",
    implemented: false,
  },
  {
    route: "history",
    title: "History",
    description: "Bets, wins, losses and rounds.",
    implemented: false,
  },
  {
    route: "wallet",
    title: "Wallet",
    description: "Balance, deposits, withdrawals and transactions.",
    implemented: false,
  },
  {
    route: "profile",
    title: "Profile",
    description: "Limits, responsible gaming, settings and support.",
    implemented: false,
  },
];

export function getRouteSurface(route: AviatorRoute): RouteSurface {
  return ROUTE_SURFACES.find((surface) => surface.route === route) ?? ROUTE_SURFACES[0];
}
