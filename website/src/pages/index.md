---
title: sheets-translate-to-json
slug: /
---

<div class="text--center">
    <img src="img/sheets-translate-to-json.png" alt="sheets-translate-to-json logo" width="200" />
</div>

<div class="text--center" style={{fontSize: '1.2rem', margin: '1rem 0 2rem'}}>

Convert your Google Sheets translations into structured JSON files with a single command.

</div>

## Quick start

```bash
npm install sheets-translate-to-json
```

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./translations');
// Creates en.json, fr.json, es.json, etc.
```

## Features

- **Simple API** — One method to fetch and write all translations
- **Multi-sheet support** — Read from specific sheets or merge all sheets automatically
- **Nested keys** — Dot-notation keys (`nav.home`) are expanded into nested JSON objects
- **TypeScript** — Full type definitions included
- **Flexible** — Use `init` for the quick path, or `read`/`write` separately for full control
- **Two-way sync** — Push local changes back to Google Sheets, or use `sync` to reconcile both directions with configurable conflict strategies

## Get started

Ready to use **sheets-translate-to-json**? Check out the [Installation guide](/docs/getting-started/installation).

## Contributing

We welcome contributions! See the [GitHub repository](https://github.com/josephjoberno/sheets-translate-to-json) for details.

1. Fork the project
2. Create a feature branch
3. Make your changes and add tests
4. Submit a Pull Request
