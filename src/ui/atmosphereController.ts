import type { FlightIntensity } from './Atmosphere';
import type { GameSnapshot } from '../domain/game';

export function flightIntensityFromSnapshot(snapshot: GameSnapshot): FlightIntensity {
  if (snapshot.round.state === 'BETTING_OPEN') return 'calm';
  if (snapshot.round.state === 'CRASH') return 'pre-crash';
  if (snapshot.round.state === 'RESULT') return 'reset';

  const multiplier = snapshot.round.multiplier;

  if (multiplier >= 8) return 'pre-crash';
  if (multiplier >= 4) return 'intense';
  if (multiplier >= 2) return 'fast';
  return 'rising';
}
