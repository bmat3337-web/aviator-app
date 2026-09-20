# AVIATOR Build Readiness

The foundation branch is structured as a runnable Vite + TypeScript application.

## Quota/rate-limit strategy

- Development remains on one isolated Git branch.
- Vercel deployment is disabled during construction.
- No preview deployment per incremental change.
- Changes are batched into coherent build checkpoints.
- No production providers, payment APIs, KYC APIs or SPRIBE credentials are requested by the client.
- Simulator is local and deterministic.
- Static assets remain dependency-light.
- Deployment is a final verification stage, not the development loop.

## Build gate

Run npm ci, npm run verify, then npm run build before the first Vercel deployment.
