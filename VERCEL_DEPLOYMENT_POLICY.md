# AVIATOR Vercel Deployment Policy

Canonical source: `aviator/foundation-v1` during foundation development.

## Deployment gate
1. Install dependencies with `npm ci`.
2. Run `npm run verify`.
3. Run `npm run build`.
4. Deploy only after both verification and production build succeed.

## Quota/rate-limit controls
- No deployment per edit.
- Batch changes into milestone commits.
- Do not use Vercel as the development loop.
- Do not connect real-money providers during foundation deployment.
- Keep simulator deterministic and local.
- Production deployment remains separate from provider/regulatory launch approval.
