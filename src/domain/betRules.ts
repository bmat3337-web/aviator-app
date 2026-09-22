import type { BetSlot, SlotId } from "./game";

export function canPlaceBet(
  roundState: "WAITING" | "BETTING_OPEN" | "BETTING_CLOSED" | "FLYING" | "CRASH" | "RESULT" | "NEXT_ROUND",
  bet: BetSlot,
): boolean {
  return roundState === "BETTING_OPEN" && bet.state === "IDLE";
}

export function canCashOut(
  roundState: "WAITING" | "BETTING_OPEN" | "BETTING_CLOSED" | "FLYING" | "CRASH" | "RESULT" | "NEXT_ROUND",
  bet: BetSlot,
): boolean {
  return (
    roundState === "FLYING" &&
    (bet.state === "BET_PLACED" || bet.state === "ACTIVE")
  );
}

export function cashOutPayout(stake: number, multiplier: number): number {
  if (!Number.isFinite(stake) || stake <= 0) {
    throw new Error("Stake must be positive");
  }
  if (!Number.isFinite(multiplier) || multiplier < 1) {
    throw new Error("Multiplier must be at least 1");
  }
  return Number((stake * multiplier).toFixed(2));
}

export function normalizeAutoCashOut(value: number | null | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (!Number.isFinite(value) || value < 1) {
    throw new Error("Auto cash out must be at least 1");
  }
  return Number(value.toFixed(2));
}

export function validateStake(stake: number): number {
  if (!Number.isFinite(stake) || stake <= 0) {
    throw new Error("Stake must be positive");
  }
  return Number(stake.toFixed(2));
}

export const BET_SLOTS: readonly SlotId[] = ["BET1", "BET2"];
