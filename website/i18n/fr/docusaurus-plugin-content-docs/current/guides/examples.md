---
id: examples
title: Examples
sidebar_position: 2
---

# Exemples

## Projet d'exemple

Un exemple complet et fonctionnel est disponible dans le dépôt :

[Voir l'exemple sur GitHub](https://github.com/josephjoberno/sheets-translate-to-json/tree/main/exemple)

## Tutoriel vidéo

Pour une présentation visuelle de la configuration et de l'utilisation de `sheets-translate-to-json`, regardez le tutoriel :

[![Sheets Translate to JSON Tutorial](https://img.youtube.com/vi/HJ0gjIsMwO8/0.jpg)](https://youtu.be/HJ0gjIsMwO8?si=jCpdXNUBjrO1ljGX)

## Intégration avec des frameworks i18n

### Avec `i18next`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

// Generate translation files at build time
const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./public/locales');

// Then in your app, point i18next to the generated files
```

### Avec `react-intl`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
const data = await manager.read();

// Use data directly or write to disk
// data.en, data.fr, etc. contain flat/nested translation objects
```

### En tant que script de build

Ajoutez à votre `package.json` :

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
