---
id: examples
title: Examples
sidebar_position: 2
---

# Examples

## Example project

A complete working example is available in the repository:

[View example on GitHub](https://github.com/josephjoberno/sheets-translate-to-json/tree/main/exemple)

## Video tutorial

For a visual walkthrough of setting up and using `sheets-translate-to-json`, watch the tutorial:

[![Sheets Translate to JSON Tutorial](https://img.youtube.com/vi/HJ0gjIsMwO8/0.jpg)](https://youtu.be/HJ0gjIsMwO8?si=jCpdXNUBjrO1ljGX)

## Integration with i18n frameworks

### With `i18next`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

// Generate translation files at build time
const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./public/locales');

// Then in your app, point i18next to the generated files
```

### With `react-intl`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
const data = await manager.read();

// Use data directly or write to disk
// data.en, data.fr, etc. contain flat/nested translation objects
```

### As a build script

Add to your `package.json`:

```json
{
  "scripts": {
    "translations": "node scripts/fetch-translations.js",
    "prebuild": "npm run translations"
  }
}
```

```javascript
// scripts/fetch-translations.js
const { SheetManager } = require('sheets-translate-to-json');

const manager = new SheetManager(
  process.env.PRIVATE_KEY,
  process.env.CLIENT_EMAIL,
  process.env.SHEET_ID
);

manager.init('./src/translations')
  .then(() => console.log('Translations updated.'))
  .catch(console.error);
```
