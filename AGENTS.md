# AGENTS.md

Svelte renderer that displays pdfmake document definitions as HTML. Source in `src/`, builds in `dist/` (`yarn build`).

## pdfmake upstream

The pdfmake sources are checked out in `pdfmake/` (git-ignored). Use them as the reference when comparing behavior and when porting upstream changes (layout, defaults, new properties) to the renderer. Always check out the current master.

## Visual regression tests

- Tests live in `playwright-tests/` (`custom-visual-regression/`, `pdfmake-examples/`) and run in Docker for stable screenshots.
- **Prefer extending existing test cases** with new content over adding new tests, to keep the number of screenshots small. Only add a new test/file for a genuinely new area.
- After changes, run `yarn test:update`, then **visually inspect every changed/added screenshot** in `playwright-tests/__screenshots__/` (git diff + view the images). Unexpected changes are regressions, not noise.
- `yarn test` verifies without updating. Also run `yarn lint`.

## Checking arbitrary content

`scripts/preview.mjs` renders any document definition with the standalone build and saves a screenshot, for quick iteration without touching the test suite:

```
yarn build
yarn playwright install chromium   # once, local Chromium
node scripts/preview.mjs doc.json out.png [--mode=natural]
```

`doc` is a `.json` file or an `.mjs` module with the definition as default export. Put scratch files outside the repo. The local screenshots may differ slightly from the Docker ones (fonts), so only use them for exploration, never for updating snapshots.
