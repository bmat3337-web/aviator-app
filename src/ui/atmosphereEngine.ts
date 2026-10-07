export type AtmosphereIntensity = 'calm' | 'rising' | 'fast' | 'intense' | 'pre-crash' | 'reset';

export type AtmosphereEngineConfig = {
  seed?: number;
  layerCount?: number;
  cloudCountPerLayer?: number;
  quality?: 'low' | 'medium' | 'high';
};

type Cloud = {
  x: number;
  y: number;
  radius: number;
  aspect: number;
  alpha: number;
  drift: number;
  phase: number;
};

type Layer = {
  depth: number;
  speed: number;
  blur: number;
  scale: number;
  clouds: Cloud[];
};

const SPEED: Record<AtmosphereIntensity, number> = {
  calm: 0.35,
  rising: 0.55,
  fast: 0.85,
  intense: 1.15,
  'pre-crash': 1.35,
  reset: 0.2,
};

function hash(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export class AtmosphereEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly layers: Layer[];
  private readonly reducedMotion: boolean;
  private intensity: AtmosphereIntensity = 'calm';
  private running = false;
  private frame = 0;
  private lastTime = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement, config: AtmosphereEngineConfig = {}) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('AtmosphereEngine requires a 2D canvas context.');

    this.canvas = canvas;
    this.ctx = ctx;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const quality = config.quality ?? 'medium';
    const layerCount = config.layerCount ?? (quality === 'low' ? 3 : quality === 'high' ? 5 : 4);
    const cloudCount = config.cloudCountPerLayer ?? (quality === 'low' ? 5 : quality === 'high' ? 9 : 7);
    const random = hash(config.seed ?? 20261007);

    this.layers = Array.from({ length: layerCount }, (_, index) => {
      const depth = (index + 1) / layerCount;
      return {
        depth,
        speed: 0.65 + depth * 0.8,
        blur: 3 + (1 - depth) * 10,
        scale: 0.75 + depth * 0.55,
        clouds: Array.from({ length: cloudCount }, () => ({
          x: random(),
          y: 0.2 + random() * 0.65,
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

  setIntensity(intensity: AtmosphereIntensity) {
    this.intensity = intensity;
  }

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
    this.render(dt);
    this.frame = requestAnimationFrame(this.tick);
  };

  private render(dt: number) {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // The atmosphere is intentionally independent of the flight trajectory.
    // It supplies depth and motion; the flight graph/aircraft remain authoritative.
    const motion = this.reducedMotion ? 0 : SPEED[this.intensity];
    const horizon = height * 0.72;

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

    const elapsed = timeSeconds(dt, this.reducedMotion ? 0 : 1);
    for (const layer of this.layers) {
      this.drawLayer(layer, elapsed, motion);
    }

    const haze = ctx.createLinearGradient(0, horizon - height * 0.18, 0, height);
    haze.addColorStop(0, 'rgba(20,35,50,0)');
    haze.addColorStop(0.55, 'rgba(20,27,38,0.10)');
    haze.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - height * 0.18, width, height * 0.28);

    this.drawVignette();
  }

  private drawLayer(layer: Layer, elapsed: number, motion: number) {
    const { ctx, width, height } = this;
    const offset = ((elapsed * motion * layer.speed * 0.025) % 1 + 1) % 1;

    ctx.save();
    ctx.filter = `blur(${layer.blur}px)`;
    ctx.globalCompositeOperation = 'screen';

    for (const cloud of layer.clouds) {
      const x = ((cloud.x + offset * cloud.drift * 12) % 1) * width;
      const y = cloud.y * height + Math.sin(elapsed * 0.15 + cloud.phase) * height * 0.006;
      const rx = cloud.radius * width * layer.scale;
      const ry = rx * cloud.aspect;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, rx);
      gradient.addColorStop(0, `rgba(176, 190, 208, ${cloud.alpha * layer.depth})`);
      gradient.addColorStop(0.42, `rgba(92, 112, 136, ${cloud.alpha * 0.68 * layer.depth})`);
      gradient.addColorStop(1, 'rgba(20, 30, 44, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawVignette() {
    const { ctx, width, height } = this;
    const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, Math.max(width, height) * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }
}

function timeSeconds(dt: number, scale: number) {
  return dt * scale;
}
