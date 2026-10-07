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


import { AtmosphereEngine } from './Atmosphere';

const previousWindow = globalThis.window;
const previousPerformance = globalThis.performance;
const previousRequestAnimationFrame = globalThis.requestAnimationFrame;
const previousCancelAnimationFrame = globalThis.cancelAnimationFrame;

class FakeContext {
  setTransform() {}
}

class FakeCanvas {
  width = 0;
  height = 0;
  getBoundingClientRect() { return { width: 320, height: 180 }; }
  getContext() { return new FakeContext(); }
}

globalThis.window = {
  devicePixelRatio: 1,
  matchMedia: () => ({ matches: false }),
} as unknown as Window & typeof globalThis;
globalThis.performance = { now: () => 0 } as Performance;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const atmosphereA = new AtmosphereEngine(new FakeCanvas() as unknown as HTMLCanvasElement, 42);
const atmosphereB = new AtmosphereEngine(new FakeCanvas() as unknown as HTMLCanvasElement, 42);
const layersA = (atmosphereA as unknown as { layers: unknown }).layers;
const layersB = (atmosphereB as unknown as { layers: unknown }).layers;
assert.deepEqual(layersA, layersB);

atmosphereA.setIntensity('fast');
atmosphereA.start();
atmosphereA.stop();

globalThis.window = previousWindow;
globalThis.performance = previousPerformance;
globalThis.requestAnimationFrame = previousRequestAnimationFrame;
globalThis.cancelAnimationFrame = previousCancelAnimationFrame;

console.log('Atmosphere deterministic seed contract: PASS');
