# Aviator UI Transfer — Google AI Studio → Production

Source: `aviator-game-full-code.zip`

Branch: `aviator/ui-transfer-ai-studio`

Baseline: `aviator/foundation-v1`

## Transfer boundary

The Google AI Studio export is treated as a **UI source**, not as the production application runtime.

### Retain for productionisation

- Bet 1 / Bet 2 visual workspace
- BetCard and stake controls
- Auto Bet / Auto Cash Out controls
- FlightHero
- Aircraft and trajectory presentation
- Multiplier display/history
- Aviator header/navigation
- Live round and live player presentation
- Daily challenge and utility surfaces
- Wallet/profile/history/provably-fair/how-to-play/settings/chat modal UI
- Sound/haptics presentation utilities, subject to production audit
- UI types as visual reference contracts

### Explicitly exclude

- `@google/genai` and Gemini integration
- `.env.example` AI Studio configuration
- `metadata.json`
- AI Studio asset scaffolding
- `next.config.ts` AI Studio-specific configuration
- `bun.lock`
- Original AI Studio `package.json`
- `app/page.tsx` as the runtime entrypoint
- `hooks/useFlightEngine.ts`
- `lib/mockData.ts`
- `components/DevSimulationControls.tsx`

## Critical architecture rule

The existing Aviator foundation contains the production application boundary:

`IGameProvider → application/domain → presentation`

The transferred UI must be adapted to that boundary.

The AI Studio `useFlightEngine` is a client-side simulation engine and must **not** become the production game engine.

## Integration target

The next engineering stage is to:

1. port the transferred visual system into the existing Vite/TypeScript application;
2. preserve the existing provider/application/domain layers;
3. map provider snapshots into presentation view models;
4. connect Bet 1 and Bet 2 controls to `IGameProvider`;
5. preserve deterministic/provider-controlled round state;
6. remove prototype-only state and hard-coded player/game data;
7. validate desktop and mobile layouts, especially the dual-bet workspace;
8. run the existing foundation verification suite before any merge to the production branch.

No AI Studio project scaffolding is intended to enter the canonical production runtime.
