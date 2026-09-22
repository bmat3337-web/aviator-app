export interface RiskLimits {
  minStakeMinorUnits: bigint;
  maxStakeMinorUnits: bigint;
  maxSessionLossMinorUnits: bigint;
  maxDailyLossMinorUnits: bigint;
  maxDailyWagerMinorUnits: bigint;
}

export interface RiskDecision {
  allowed: boolean;
  reasonCode: string;
}

export interface RiskService {
  evaluateBet(playerId: string, stakeMinorUnits: bigint, limits: RiskLimits): Promise<RiskDecision>;
  evaluateWithdrawal(playerId: string, amountMinorUnits: bigint): Promise<RiskDecision>;
}
