import type { AviatorRoute } from "./navigation";
import { PRIMARY_NAVIGATION } from "./navigation";

export interface ApplicationShellState {
  route: AviatorRoute;
  walletVisible: boolean;
}

export function createApplicationShellState(): ApplicationShellState {
  return { route: "flight", walletVisible: false };
}

export function navigate(
  state: ApplicationShellState,
  route: AviatorRoute,
): ApplicationShellState {
  return { ...state, route, walletVisible: route === "wallet" };
}

export function isPrimaryRoute(route: AviatorRoute): boolean {
  return PRIMARY_NAVIGATION.some((item) => item.id === route);
}
