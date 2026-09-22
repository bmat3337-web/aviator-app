# Aviator Environment System

## Purpose

The environment layer is a presentation system only. It must never determine game outcomes, crash points, multiplier values, betting state, or aircraft physics.

## Environment library

The canonical environment set is:

- sunrise
- day
- sunset
- night
- above-clouds
- storm
- runway

These are environment families, not game states.

## Dynamic flight states

Each environment can be rendered at six presentation-intensity states:

1. calm
2. rising
3. fast
4. intense
5. pre-crash
6. reset

The states are continuous presentation targets. They must not be implemented as game-logic branches that alter outcome calculation.

## Rendering model

Preferred order:

1. Dynamic video loop when an approved asset exists.
2. Static image fallback for environments without a video asset.
3. CSS/Canvas atmospheric modulation layered above the asset where appropriate.
4. Aircraft, trajectory, multiplier and controls remain independent application layers.

The renderer should interpolate presentation intensity rather than abruptly swapping scenes.

## Asset contract

Recommended paths:

`public/assets/aviator/environments/<environment>/loop.webm`
`public/assets/aviator/environments/<environment>/loop.mp4`
`public/assets/aviator/environments/<environment>/poster.webp`

Environment identifiers are stable API values:

`sunrise | day | sunset | night | above-clouds | storm | runway`

## Video requirements

Preferred production target:

- 16:9
- 24–30 fps
- short seamless loop
- stable camera
- no aircraft
- no UI
- no text
- no logos
- no watermark
- no game-state graphics

The current Veo prototype is a visual reference/prototype only until a clean, licensed, watermark-free production asset is available.

## Current Veo prototype

The supplied prototype is 1280x720, 24 fps, 10 seconds. It demonstrates that the desired moving cloud environment is feasible.

It is **not yet a production asset** because the supplied output contains a visible generator watermark and its first/last frames are not identical enough to claim a seamless loop.

## State mapping

The environment controller should expose:

`setEnvironment(environment)`
`setFlightIntensity(state)`

It should not expose game outcome controls.

Example:

`environment = "above-clouds"`
`flightIntensity = "fast"`

The actual game engine remains the source of truth for the flight state.

## Mobile requirements

The environment must remain a background layer and must never force the betting workspace to scroll away or disappear.

Gameplay controls must remain independently positioned and responsive.

Video playback should respect reduced-motion/device constraints and provide the poster/static fallback when autoplay or video decoding is unavailable.

## Repository policy

Generated visual assets must be transferred only after their source files are available at production resolution and licensing/usage status is known.

Screenshots of AI conversations are reference material, not production assets.

Do not commit AI-generated UI artifacts, temporary exports, or prototype files into the canonical application tree.
