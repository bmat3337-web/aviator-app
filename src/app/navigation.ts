export type AviatorRoute =
  | "flight"
  | "challenge"
  | "social"
  | "history"
  | "wallet"
  | "profile";

export interface NavigationItem {
  id: AviatorRoute;
  label: string;
  primary: boolean;
}

export const PRIMARY_NAVIGATION: NavigationItem[] = [
  { id: "flight", label: "Flight", primary: true },
  { id: "challenge", label: "Challenge", primary: true },
  { id: "social", label: "Social", primary: true },
  { id: "history", label: "History", primary: true },
  { id: "profile", label: "Profile", primary: true },
];

export const SECONDARY_NAVIGATION: NavigationItem[] = [
  { id: "wallet", label: "Wallet", primary: false },
];

export function isAviatorRoute(value: string): value is AviatorRoute {
  return [
    "flight",
    "challenge",
    "social",
    "history",
    "wallet",
    "profile",
  ].includes(value);
}
