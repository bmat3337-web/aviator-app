import { useEffect, useRef } from 'react';
export type EnvironmentId =
  | 'sunrise' | 'day' | 'sunset' | 'night' | 'above-clouds' | 'storm' | 'runway' | 'cycle';

export type FlightIntensity =
  | 'calm' | 'rising' | 'fast' | 'intense' | 'pre-crash' | 'reset';

type AtmosphereProps = {
  environment?: EnvironmentId;
  intensity: FlightIntensity;
  seed?: number;
};

type Cloud = {
  x: number; y: number; radius: number; aspect: number;
  alpha: number; drift: number; phase: number;
};

type Layer = { depth: number; speed: number; blur: number; scale: number; clouds: Cloud[] };

const SPEED: Record<FlightIntensity, number> = {
  calm: 0.35, rising: 0.55, fast: 0.85, intense: 1.15, 'pre-crash': 1.35, reset: 0.2,
};

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * AtmosphereEngine
 *
 * Product-neutral rendering boundary:
 * - owns sky/cloud/haze motion only
 * - never owns trajectory, aircraft, multiplier or betting state
 * - deterministic for a fixed seed
 * - supports reduced motion and bounded DPR
 */
export class AtmosphereEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly layers: Layer[];
  private readonly reducedMotion: boolean;
  private intensity: FlightIntensity = 'calm';
  private running = false;
  private frame = 0;
  private lastTime = 0;
  private width = 1;
  private height = 1;
  private dpr = 1;
  private elapsed = 0;

  constructor(canvas: HTMLCanvasElement, seed = 20261007) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('AtmosphereEngine requires a 2D canvas context.');
    this.canvas = canvas;
    this.ctx = ctx;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const random = seeded(seed);
    const layerCount = 4;
    const cloudsPerLayer = 7;
    this.layers = Array.from({ length: layerCount }, (_, i) => {
      const depth = (i + 1) / layerCount;
      return {
        depth,
        speed: 0.65 + depth * 0.8,
        blur: 3 + (1 - depth) * 9,
        scale: 0.75 + depth * 0.55,
        clouds: Array.from({ length: cloudsPerLayer }, () => ({
          x: random(), y: 0.18 + random() * 0.68,
          radius: 0.055 + random() * 0.11,
          aspect: 0.65 + random() * 0.8,
          alpha: 0.08 + random() * 0.13,
          drift: 0.004 + random() * 0.012,
          phase: random() * Math.PI * 2,
        })),
      };
    });
    this.resize();
  }

  setIntensity(intensity: FlightIntensity) { this.intensity = intensity; }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private readonly tick = (time: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0, (time - this.lastTime) / 1000));
    this.lastTime = time;
    this.elapsed += dt * (this.reducedMotion ? 0 : SPEED[this.intensity]);
    this.render();
    this.frame = requestAnimationFrame(this.tick);
  };

  private render() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#020812');
    sky.addColorStop(0.48, '#081b2b');
    sky.addColorStop(0.78, '#161a28');
    sky.addColorStop(1, '#030609');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.62, height * 0.56, 0, width * 0.62, height * 0.56, width * 0.62);
    glow.addColorStop(0, 'rgba(110,78,116,0.18)');
    glow.addColorStop(0.5, 'rgba(42,60,93,0.08)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const layer of this.layers) this.drawLayer(layer);

    const haze = ctx.createLinearGradient(0, height * 0.58, 0, height);
    haze.addColorStop(0, 'rgba(20,35,50,0)');
    haze.addColorStop(0.55, 'rgba(20,27,38,0.10)');
    haze.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, height * 0.58, width, height * 0.42);

    const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, Math.max(width, height) * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  private drawLayer(layer: Layer) {
    const { ctx, width, height } = this;
    const offset = (this.elapsed * layer.speed * 0.025) % 1;
    ctx.save();
    ctx.filter = `blur(${layer.blur}px)`;
    ctx.globalCompositeOperation = 'screen';

    for (const cloud of layer.clouds) {
      const x = ((cloud.x + offset * cloud.drift * 12) % 1) * width;
      const y = cloud.y * height + Math.sin(this.elapsed * 0.15 + cloud.phase) * height * 0.006;
      const rx = cloud.radius * width * layer.scale;
      const ry = rx * cloud.aspect;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, rx);
      gradient.addColorStop(0, `rgba(176,190,208,${cloud.alpha * layer.depth})`);
      gradient.addColorStop(0.42, `rgba(92,112,136,${cloud.alpha * 0.68 * layer.depth})`);
      gradient.addColorStop(1, 'rgba(20,30,44,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export function Atmosphere({ environment = 'above-clouds', intensity, seed = 20261007 }: AtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AtmosphereEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new AtmosphereEngine(canvas, seed);
    engine.setIntensity(intensity);
    engineRef.current = engine;
    engine.start();

    const resizeObserver = new ResizeObserver(() => engine.resize());
    resizeObserver.observe(canvas);
    return () => {
      resizeObserver.disconnect();
      engine.stop();
      engineRef.current = null;
    };
  }, [seed]);

  useEffect(() => {
    engineRef.current?.setIntensity(intensity);
  }, [intensity]);

  return (
    <div className="atmosphere" data-environment={environment} data-intensity={intensity} aria-hidden="true">
      <canvas ref={canvasRef} className="atmosphere-canvas" />
      <div className="atmosphere-vignette" />
      <span className="sr-only">{environment.replaceAll('-', ' ')} flight atmosphere</span>
    </div>
  );
}
