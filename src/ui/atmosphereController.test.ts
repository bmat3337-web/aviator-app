import { strict as assert } from 'node:assert';
import { flightIntensityFromSnapshot } from './atmosphereController';
import type { GameSnapshot } from '../domain/game';

const base = (state: GameSnapshot['round']['state'], multiplier: number): GameSnapshot => ({
  round: { id: 'TEST', state, multiplier, playerCount: 0 },
  bets: {
    BET1: { state: 'IDLE', stake: 0 },
    BET2: { state: 'IDLE', stake: 0 },
  },
} as GameSnapshot);

assert.equal(flightIntensityFromSnapshot(base('BETTING_OPEN', 1)), 'calm');
assert.equal(flightIntensityFromSnapshot(base('FLYING', 1.5)), 'rising');
assert.equal(flightIntensityFromSnapshot(base('FLYING', 2)), 'fast');
assert.equal(flightIntensityFromSnapshot(base('FLYING', 4)), 'intense');
assert.equal(flightIntensityFromSnapshot(base('FLYING', 8)), 'pre-crash');
assert.equal(flightIntensityFromSnapshot(base('CRASH', 3.2)), 'pre-crash');
assert.equal(flightIntensityFromSnapshot(base('RESULT', 3.2)), 'reset');

console.log('Atmosphere presentation mapping: PASS');
