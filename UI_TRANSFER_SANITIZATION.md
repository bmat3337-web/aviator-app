# UI Transfer Sanitization Report

## Scope

Audit the `aviator/ui-transfer-ai-studio` branch for Google AI Studio prototype artifacts that must not enter the canonical production runtime.

## Result

**SANITIZED — no identified AI Studio runtime artifacts remain in the production tree.**

The branch retains the visual/interaction implementation while preserving the existing provider/application/domain boundary.

## Explicit exclusion verification

Repository code search returned no matches for:

- `@google/genai`
- `metadata.json`
- `useFlightEngine`
- `mockData`
- `DevSimulationControls`
- `bun.lock`

The transfer contract explicitly excludes those artifacts and the original AI Studio runtime entrypoint/configuration.

## Retained transfer material

The retained UI is limited to presentation and interaction concerns:

- dual Bet 1 / Bet 2 workspace
- stake controls
- Auto Bet / Auto Cash Out presentation
- flight presentation
- multiplier/history presentation
- responsive navigation and utility surfaces
- dynamic atmosphere renderer

The production application remains provider-driven.

## Environment assets

No generated Veo/Meta AI media has been committed to the repository.

The current Veo clip remains an external prototype/reference because it has a generator watermark and has not been verified as a seamless production loop.

Approved assets will enter only through:

`public/assets/aviator/environments/<environment>/loop.webm`
`public/assets/aviator/environments/<environment>/loop.mp4`
`public/assets/aviator/environments/<environment>/poster.webp`

## Legacy code note

The branch contains the earlier foundation `FlightScreen` presentation surface in addition to the React production presentation surface. It is not an identified Google AI Studio artifact and has therefore **not been deleted during sanitization**.

It should be treated as a separate refactoring decision, not silently removed as part of UI transfer cleanup.

## Main-branch safety

`main` remains unchanged.

The transfer branch is currently one commit behind `main` by ancestry, while its tree already contains the deterministic simulator implementation. This ancestry difference must be reconciled before merge.

## Merge gate

Do not merge until:

1. branch ancestry is reconciled;
2. UI Transfer CI completes successfully;
3. production build passes;
4. the mobile play-surface is visually verified;
5. the remaining legacy presentation surface is explicitly classified;
6. production media assets are independently approved.
