---
id: examples
title: Ejemplos
sidebar_position: 2
---

# Ejemplos

## Proyecto de ejemplo

Un ejemplo completo y funcional esta disponible en el repositorio:

[Ver ejemplo en GitHub](https://github.com/josephjoberno/sheets-translate-to-json/tree/main/exemple)

## Tutorial en video

Para un recorrido visual sobre como configurar y usar `sheets-translate-to-json`, mira el tutorial:

[![Tutorial de Sheets Translate to JSON](https://img.youtube.com/vi/HJ0gjIsMwO8/0.jpg)](https://youtu.be/HJ0gjIsMwO8?si=jCpdXNUBjrO1ljGX)

## Integracion con frameworks de i18n

### Con `i18next`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

// Generar archivos de traduccion en tiempo de compilacion
const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./public/locales');

// Luego en tu aplicacion, apunta i18next a los archivos generados
```

### Con `react-intl`

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
const data = await manager.read();

// Usa los datos directamente o escribelos en disco
// data.en, data.fr, etc. contienen objetos de traduccion planos/anidados
```

### Como script de compilacion

Agrega a tu `package.json`:

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
  .then(() => console.log('Traducciones actualizadas.'))
  .catch(console.error);
```
