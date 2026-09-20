# AVIATOR Foundation Performance & Quota Controls

## Runtime rules
- The flight surface is the highest-priority rendering path.
- Keep multiplier/aircraft animation isolated from non-flight navigation.
- Prefer transform/opacity animation over layout-triggering properties.
- Do not poll external providers from the browser.
- Do not put wallet, KYC, social or challenge data into the flight render loop.
- Keep simulator state deterministic and local during development.

## Network rules
- One authoritative API boundary for production game state.
- WebSocket/realtime traffic is reserved for required live-round events.
- No client-authoritative wallet balance.
- Provider traffic is server-side through the IGameProvider boundary.

## Deployment/quota rules
- Batch changes into milestone commits.
- CI validates the foundation branch and PR.
- Vercel is not the development loop.
- Preview/production deployment happens only at explicit release checkpoints.
- No real-money provider calls in the foundation environment.

## Release gate
1. CI verification passes.
2. Production build passes.
3. Security/provider boundary review passes.
4. Deployment is manually initiated.
5. Deployed smoke test passes.
