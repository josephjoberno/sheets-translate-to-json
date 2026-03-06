# sheets-translate-to-json

## Project overview

A Node.js/TypeScript library that converts Google Sheets translations into structured JSON files for i18n workflows.

## Architecture

- **Source code**: `src/index.ts` — Single file exporting `SheetManager` class
- **Build**: `tsup` compiles to `dist/` (CJS + ESM + types)
- **Tests**: `jest` with `ts-jest`, located in `tests/`
- **Docs website**: `website/` — Docusaurus v3 with i18n (en, fr, es)
- **Example**: `exemple/` — Working example project

## Key commands

```bash
npm run build        # Build the library (tsup)
npm run test         # Run tests (jest)
npm run lint         # Lint source (eslint)
npm run release      # Release with release-it

# Website (from website/ directory)
npm start            # Dev server
npm run build        # Build static site
```

## SDK public API

`SheetManager` class with these public methods:

- `constructor(privateKey, clientEmail, sheetId)` — Create instance
- `init(userPath, sheetNames?)` — Read sheets + write JSON files (main method)
- `read(sheetPosition?)` — Read single sheet by index (default: 0)
- `readByName(sheetName)` — Read single sheet by name
- `readAllSheets()` — Read all sheets
- `write(data, directoryPath)` — Write SheetData to JSON files (synchronous)
- `listSheets()` — List all sheet names
- `readLocal(directoryPath)` — Read local JSON files back into SheetData format (synchronous)
- `push(directoryPath, sheetName?)` — Upload local JSON files to Google Sheets (flattens nested objects to dot-notation)
- `sync(directoryPath, options?)` — Two-way sync between local JSON and Google Sheets (strategies: local, remote, merge)

## Conventions

- Commits: Use conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- No `Co-Authored-By: Claude` in commits
- TypeScript for source code
- Documentation in English (source), translated to French and Spanish via Docusaurus i18n

## Dependencies

- `google-spreadsheet` ~4.1.1
- `google-auth-library` ~9.4.1

## File structure

```
src/index.ts          — Library source
dist/                 — Built output (CJS + ESM + types)
tests/                — Jest tests
website/              — Docusaurus documentation site
  docs/               — English docs (source of truth)
    getting-started/  — Installation, configuration, sheets setup
    api/              — API reference
    guides/           — Usage guides and examples
  i18n/fr/            — French translations
  i18n/es/            — Spanish translations
exemple/              — Example project
```
