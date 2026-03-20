# Visual Regression Tests

This suite uses Playwright screenshots to catch unexpected UI changes on the highest-signal routes affected by the shared design system.

## Covered routes

- `/`
- `/writing`
- `/projects`
- `/series`
- homepage mobile menu state

Each route is captured at:

- desktop: `1440x1200`
- mobile: `390x844`

## Commands

Start the app locally on `127.0.0.1:3000`, then run:

```bash
npm run test:visual
```

To intentionally refresh baselines:

```bash
npm run test:visual:update
```

## Local vs CI behavior

- Local: the Playwright config expects an already-running dev server by default.
- CI: the Playwright config starts the Next dev server automatically.

If you want local Playwright to start the server itself, run with:

```bash
PLAYWRIGHT_WEBSERVER=1 npm run test:visual
```

## Snapshot storage

Playwright stores approved screenshots next to the spec in `tests/visual/*.spec.ts-snapshots/`.

Review snapshot updates carefully. Only accept changes when the visual difference is intentional.
