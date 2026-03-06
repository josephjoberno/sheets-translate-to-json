---
id: basic-usage
title: Uso basico
sidebar_position: 1
---

# Uso basico

## Inicio rapido con `init`

La forma mas sencilla de usar `sheets-translate-to-json` es el metodo `init`, que lee todas las hojas y escribe archivos JSON en una sola llamada.

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(
  process.env.PRIVATE_KEY,
  process.env.CLIENT_EMAIL,
  process.env.SHEET_ID
);

await manager.init('./translations');
```

Esto hara lo siguiente:
1. Conectarse a tu hoja de Google Sheets
2. Leer todas las hojas y combinar sus datos por idioma
3. Crear un archivo JSON por idioma en `./translations/` (por ejemplo, `en.json`, `fr.json`, `es.json`)

## Seleccionar hojas especificas

Si tu hoja de calculo tiene varias pestanas y solo quieres algunas:

```typescript
await manager.init('./translations', ['Homepage', 'Settings']);
```

Solo se procesaran las hojas llamadas "Homepage" y "Settings", y sus datos se combinaran.

## Separar `read` y `write`

Para mayor control, usa `read` y `write` por separado:

```typescript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

// Leer datos de la primera hoja
const data = await manager.read();

// Opcionalmente transforma los datos aqui...

// Escribir en disco
manager.write(data, './translations');
```

## Leer por nombre de hoja

```typescript
const data = await manager.readByName('Homepage');
manager.write(data, './translations');
```

## Leer todas las hojas individualmente

```typescript
const allData = await manager.readAllSheets();

// allData es { [sheetName]: SheetData }
for (const [sheetName, data] of Object.entries(allData)) {
  console.log(`La hoja "${sheetName}" tiene ${Object.keys(data).length} idiomas`);
}
```

## Listar hojas disponibles

```typescript
const sheetNames = await manager.listSheets();
console.log(sheetNames); // ['Homepage', 'Settings', 'Emails']
```

## Estructura de salida

Dada una hoja de calculo con estos datos:

| key | en | fr |
|-----|----|----|
| hello | Hello | Bonjour |
| nav.home | Home | Accueil |
| nav.about | About | A propos |

El archivo `en.json` generado sera:

```json
{
  "hello": "Hello",
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

Las claves con notacion de puntos se expanden automaticamente en objetos anidados.

## Ejecutar tu script

```bash
# JavaScript
node your-script.js

# TypeScript (con ts-node)
npx ts-node your-script.ts

# TypeScript (con tsx)
npx tsx your-script.ts
```

### Resultado

Despues de ejecutar tu script, se crea una carpeta `translations/` con los archivos JSON generados:

![Carpeta con archivos JSON](/img/result-translations.png)

![Ejemplo de salida JSON](/img/exemple-translate-json.png)

## Sincronizacion bidireccional

El metodo `sync` permite sincronizar datos entre tus archivos JSON locales y Google Sheets en ambas direcciones. Es ideal cuando varios equipos trabajan simultaneamente en las traducciones desde diferentes fuentes.

### Uso basico

```typescript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

const result = await manager.sync('./translations');
console.log(result);
// { added: { local: 2, remote: 3 }, updated: { local: 1, remote: 0 }, languages: ['en', 'fr', 'es'] }
```

### Estrategias de sincronizacion

Puedes controlar como se resuelven los conflictos mediante la opcion `strategy`:

```typescript
// Los valores locales tienen prioridad en conflictos
await manager.sync('./translations', { strategy: 'local' });

// Los valores remotos tienen prioridad en conflictos
await manager.sync('./translations', { strategy: 'remote' });

// Combina ambos (por defecto), prefiere valores locales en conflictos
await manager.sync('./translations', { strategy: 'merge' });
```

### Subir traducciones locales a Google Sheets

Si solo necesitas subir tus archivos JSON a Google Sheets sin sincronizar:

```typescript
// Subir a la hoja predeterminada
await manager.push('./translations');

// Subir a una hoja especifica (se crea si no existe)
await manager.push('./translations', 'MiHoja');
```

### Leer archivos JSON locales

Para leer archivos JSON de un directorio sin conectarse a Google Sheets:

```typescript
const data = manager.readLocal('./translations');
// Retorna un objeto SheetData con los datos de todos los archivos JSON del directorio
```

### Sincronizar con una hoja especifica

```typescript
const result = await manager.sync('./translations', {
  sheetName: 'Homepage',
  strategy: 'merge',
  createSheet: true  // Crea la hoja si no existe
});
```
