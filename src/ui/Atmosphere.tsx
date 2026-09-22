import { useEffect, useMemo, useState } from 'react';

export type EnvironmentId =
  | 'sunrise'
  | 'day'
  | 'sunset'
  | 'night'
  | 'above-clouds'
  | 'storm'
  | 'runway';

export type FlightIntensity =
  | 'calm'
  | 'rising'
  | 'fast'
  | 'intense'
  | 'pre-crash'
  | 'reset';

type AtmosphereProps = {
  environment?: EnvironmentId;
  intensity: FlightIntensity;
};

const environmentLabel: Record<EnvironmentId, string> = {
  sunrise: 'SUNRISE',
  day: 'DAY',
  sunset: 'SUNSET',
  night: 'NIGHT',
  'above-clouds': 'ABOVE CLOUDS',
  storm: 'STORM',
  runway: 'RUNWAY',
};

const intensityLevel: Record<FlightIntensity, number> = {
  calm: 0,
  rising: 1,
  fast: 2,
  intense: 3,
  'pre-crash': 4,
  reset: 0,
};

export function environmentAsset(environment: EnvironmentId) {
  const base = '/assets/aviator/environments/' + environment;
  return {
    webm: base + '/loop.webm',
    mp4: base + '/loop.mp4',
    poster: base + '/poster.webp',
  };
}

export function Atmosphere({ environment = 'above-clouds', intensity }: AtmosphereProps) {
  const assets = useMemo(() => environmentAsset(environment), [environment]);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [environment]);

  return (
    <div
      className="atmosphere"
      data-environment={environment}
      data-intensity={intensity}
      aria-hidden="true"
    >
      {!videoFailed && (
        <video
          className="atmosphere-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={assets.poster}
          onError={() => setVideoFailed(true)}
        >
          <source src={assets.webm} type="video/webm" />
          <source src={assets.mp4} type="video/mp4" />
        </video>
      )}
      <div className="atmosphere-fallback" />
      <div
        className="atmosphere-haze"
        style={{ opacity: 0.18 + intensityLevel[intensity] * 0.07 }}
      />
      <div className="atmosphere-vignette" />
      <span className="sr-only">
        {environmentLabel[environment]} flight atmosphere
      </span>
    </div>
  );
}
