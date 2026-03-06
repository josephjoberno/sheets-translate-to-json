---
id: basic-usage
title: Basic Usage
sidebar_position: 1
---

# Utilisation de base

## Démarrage rapide avec `init`

La manière la plus simple d'utiliser `sheets-translate-to-json` est la méthode `init`, qui lit toutes les feuilles et écrit les fichiers JSON en un seul appel.

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(
  process.env.PRIVATE_KEY,
  process.env.CLIENT_EMAIL,
  process.env.SHEET_ID
);

await manager.init('./translations');
```

Cela va :
1. Se connecter à votre Google Sheet
2. Lire toutes les feuilles et fusionner leurs données par langue
3. Créer un fichier JSON par langue dans `./translations/` (par exemple, `en.json`, `fr.json`, `es.json`)

## Sélectionner des feuilles spécifiques

Si votre feuille de calcul a plusieurs onglets et que vous n'en voulez que certains :

```typescript
await manager.init('./translations', ['Homepage', 'Settings']);
```

Seules les feuilles nommées "Homepage" et "Settings" seront traitées, et leurs données fusionnées.

## Séparer `read` et `write`

Pour plus de contrôle, utilisez `read` et `write` séparément :

```typescript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

// Read data from the first sheet
const data = await manager.read();

// Optionally transform the data here...

// Write to disk
manager.write(data, './translations');
```

## Lire par nom de feuille

```typescript
const data = await manager.readByName('Homepage');
manager.write(data, './translations');
```

## Lire toutes les feuilles individuellement

```typescript
const allData = await manager.readAllSheets();

// allData is { [sheetName]: SheetData }
for (const [sheetName, data] of Object.entries(allData)) {
  console.log(`Sheet "${sheetName}" has ${Object.keys(data).length} languages`);
}
```

## Lister les feuilles disponibles

```typescript
const sheetNames = await manager.listSheets();
console.log(sheetNames); // ['Homepage', 'Settings', 'Emails']
```

## Structure de sortie

Étant donné une feuille de calcul avec ces données :

| key | en | fr |
|-----|----|----|
| hello | Hello | Bonjour |
| nav.home | Home | Accueil |
| nav.about | About | A propos |

Le fichier `en.json` généré sera :

```json
{
  "hello": "Hello",
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

Les clés en notation par points sont automatiquement développées en objets imbriqués.

## Exécuter votre script

```bash
# JavaScript
node your-script.js

# TypeScript (with ts-node)
npx ts-node your-script.ts

# TypeScript (with tsx)
npx tsx your-script.ts
```

### Résultat

Après l'exécution de votre script, un dossier `translations/` est créé avec les fichiers JSON générés :

![Dossier avec les fichiers JSON](/img/result-translations.png)

![Exemple de sortie JSON](/img/exemple-translate-json.png)

## Synchronisation bidirectionnelle

La méthode `sync` permet de garder vos fichiers JSON locaux et Google Sheets en phase. Elle détecte les différences entre les deux sources et les réconcilie selon la stratégie choisie.

### Synchronisation de base (stratégie `merge`)

Par défaut, `sync` utilise la stratégie `merge` : elle combine les deux sources, préfère les valeurs locales en cas de conflit, et remplit les valeurs manquantes des deux côtés.

```typescript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

const result = await manager.sync('./translations');
console.log(result);
// {
//   added: { local: 2, remote: 5 },
//   updated: { local: 0, remote: 3 },
//   languages: ['en', 'fr', 'es']
// }
```

### Privilégier les valeurs locales

Utilisez la stratégie `local` pour que vos fichiers JSON locaux écrasent les valeurs distantes en cas de conflit :

```typescript
await manager.sync('./translations', { strategy: 'local' });
```

### Privilégier les valeurs distantes

Utilisez la stratégie `remote` pour que les valeurs de Google Sheets écrasent les valeurs locales en cas de conflit :

```typescript
await manager.sync('./translations', { strategy: 'remote' });
```

### Synchroniser avec une feuille spécifique

Vous pouvez cibler une feuille spécifique et la créer si elle n'existe pas :

```typescript
await manager.sync('./translations', {
  sheetName: 'Homepage',
  createSheet: true,
  strategy: 'merge'
});
```

### Envoyer les fichiers locaux vers Google Sheets

Si vous souhaitez uniquement envoyer vos fichiers JSON locaux vers Google Sheets sans synchronisation bidirectionnelle, utilisez `push` :

```typescript
await manager.push('./translations');

// Ou vers une feuille spécifique
await manager.push('./translations', 'Homepage');
```

### Lire les fichiers locaux

Vous pouvez aussi lire les fichiers JSON locaux en format `SheetData` sans accéder à Google Sheets :

```typescript
const data = manager.readLocal('./translations');
console.log(data);
// { en: { greeting: "Hello", ... }, fr: { greeting: "Bonjour", ... } }
```
