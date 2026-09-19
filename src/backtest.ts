import { ClassifiedRound } from "./domain";
import { detectRegime } from "./regime";

export interface BacktestResult {
  windowSize: number;
  observations: number;
  correct: number;
  accuracy: number;
  baselineRate: number;
  lift: number;
}

export function backtestMostFrequentNextState(rounds: ClassifiedRound[], windowSize = 30): BacktestResult {
  if (rounds.length < 2) return { windowSize, observations: 0, correct: 0, accuracy: 0, baselineRate: 0, lift: 0 };
  let correct = 0;
  let observations = 0;
  for (let i = 1; i < rounds.length; i += 1) {
    const prior = rounds.slice(Math.max(0, i - windowSize), i);
    const current = rounds[i - 1].state;
    const counts = new Map<string, number>();
    for (let j = 0; j < prior.length - 1; j += 1) {
      if (prior[j].state !== current) continue;
      const next = prior[j + 1].state;
      counts.set(next, (counts.get(next) ?? 0) + 1);
    }
    if (!counts.size) continue;
    const predicted = [...counts.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
    observations += 1;
    if (predicted === rounds[i].state) correct += 1;
  }
  const accuracy = observations ? correct / observations : 0;
  const counts = new Map<string, number>();
  for (const r of rounds) counts.set(r.state, (counts.get(r.state) ?? 0) + 1);
  const baselineRate = rounds.length ? Math.max(...counts.values()) / rounds.length : 0;
  return { windowSize, observations, correct, accuracy, baselineRate, lift: baselineRate ? accuracy / baselineRate : 0 };
}

export { detectRegime };