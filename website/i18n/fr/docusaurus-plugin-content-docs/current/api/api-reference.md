---
id: api-reference
title: API Reference
sidebar_position: 1
---

# Référence API

## `SheetManager`

La classe principale pour interagir avec Google Sheets.

### Constructeur

```typescript
const manager = new SheetManager(privateKey: string, clientEmail: string, sheetId: string);
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| `privateKey` | `string` | La clé privée de votre fichier JSON de compte de service. |
| `clientEmail` | `string` | L'adresse e-mail de votre fichier JSON de compte de service. |
| `sheetId` | `string` | L'identifiant de votre feuille de calcul Google Sheets. |

---

## Méthodes

### `init(userPath, sheetNames?)`

Lit les données de la feuille de calcul et écrit les fichiers JSON sur le disque. C'est la méthode principale pour la plupart des cas d'utilisation.

```typescript
await manager.init(userPath: string, sheetNames?: string[]): Promise<void>
```

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `userPath` | `string` | Oui | Chemin du répertoire où les fichiers JSON seront écrits. |
| `sheetNames` | `string[]` | Non | Noms spécifiques des feuilles à traiter. Si omis, toutes les feuilles sont traitées. |

Lorsque plusieurs feuilles sont traitées, leurs données sont **fusionnées par langue** — les clés de toutes les feuilles sont combinées dans un seul fichier JSON par langue.

---

### `read(sheetPosition?)`

Lit les données d'une seule feuille par sa position d'index.

```typescript
await manager.read(sheetPosition?: number): Promise<SheetData>
```

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `sheetPosition` | `number` | `0` | Index de la feuille à lire (commence à zéro). |

**Retourne :** `SheetData` — Un objet où chaque clé est un code de langue et la valeur contient les données de traduction.

---

### `readByName(sheetName)`

Lit les données d'une feuille spécifique par son nom.

```typescript
await manager.readByName(sheetName: string): Promise<SheetData>
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| `sheetName` | `string` | Le nom exact de l'onglet de la feuille. |

**Lève** une erreur si le nom de la feuille n'est pas trouvé.

---

### `readAllSheets()`

Lit les données de toutes les feuilles de la feuille de calcul.

```typescript
await manager.readAllSheets(): Promise<{ [sheetName: string]: SheetData }>
```

**Retourne :** Un objet où chaque clé est le nom de la feuille et la valeur est le `SheetData` correspondant.

---

### `write(data, directoryPath)`

Écrit les données de traduction dans des fichiers JSON. Un fichier est créé par langue.

```typescript
manager.write(data: SheetData, directoryPath: string): void
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| `data` | `SheetData` | L'objet de données retourné par `read`, `readByName`, ou `readAllSheets`. |
| `directoryPath` | `string` | Répertoire où les fichiers JSON seront sauvegardés. Créé s'il n'existe pas. |

:::info
Cette méthode est **synchrone** dans sa logique de création de fichiers (utilisant `fs.writeFile` avec des callbacks en interne). Elle ne retourne pas une Promise.
:::

---

### `listSheets()`

Retourne les noms de toutes les feuilles de la feuille de calcul.

```typescript
await manager.listSheets(): Promise<string[]>
```

**Retourne :** Un tableau de noms d'onglets de feuilles.

---

### `readLocal(directoryPath)`

Lit les fichiers JSON d'un répertoire local et les retourne en format `SheetData`.

```typescript
manager.readLocal(directoryPath: string): SheetData
```

| Paramètre | Type | Description |
|-----------|------|-------------|
| `directoryPath` | `string` | Chemin du répertoire contenant les fichiers JSON de traduction. |

**Retourne :** `SheetData` — Un objet où chaque clé est un code de langue et la valeur contient les données de traduction.

**Lève** une erreur si le répertoire n'existe pas.

---

### `push(directoryPath, sheetName?)`

Lit les fichiers JSON locaux et les envoie vers Google Sheets. Les objets imbriqués sont aplatis en notation pointée.

```typescript
await manager.push(directoryPath: string, sheetName?: string): Promise<void>
```

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `directoryPath` | `string` | Oui | Chemin du répertoire contenant les fichiers JSON de traduction. |
| `sheetName` | `string` | Non | Nom de la feuille cible. Si fourni et inexistant, une nouvelle feuille est créée. |

---

### `sync(directoryPath, options?)`

Synchronisation bidirectionnelle entre les fichiers JSON locaux et Google Sheets. Permet de garder les deux sources en phase selon la stratégie choisie.

```typescript
await manager.sync(directoryPath: string, options?: SyncOptions): Promise<SyncResult>
```

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `directoryPath` | `string` | Oui | Chemin du répertoire contenant les fichiers JSON de traduction. |
| `options` | `SyncOptions` | Non | Options de synchronisation (voir ci-dessous). |

**Retourne :** `SyncResult` — Un objet contenant le résumé des modifications effectuées.

#### Stratégies de synchronisation

| Stratégie | Description |
|-----------|-------------|
| `local` | Les valeurs locales écrasent les valeurs distantes en cas de conflit. |
| `remote` | Les valeurs distantes écrasent les valeurs locales en cas de conflit. |
| `merge` (défaut) | Combine les deux sources, préfère les valeurs locales en cas de conflit, et remplit les valeurs manquantes des deux côtés. |

---

## Types

### `SheetData`

```typescript
interface NestedObject {
  [key: string]: string | NestedObject | undefined;
}

interface SheetData {
  [key: string]: NestedObject;
}
```

### `SyncStrategy`

```typescript
type SyncStrategy = 'local' | 'remote' | 'merge';
```

### `SyncOptions`

```typescript
interface SyncOptions {
  strategy?: SyncStrategy;  // défaut: 'merge'
  sheetName?: string;
  createSheet?: boolean;    // défaut: false
}
```

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `strategy` | `SyncStrategy` | `'merge'` | Stratégie de résolution des conflits. |
| `sheetName` | `string` | `undefined` | Nom de la feuille cible. |
| `createSheet` | `boolean` | `false` | Si `true`, crée la feuille si elle n'existe pas. |

### `SyncResult`

```typescript
interface SyncResult {
  added: { local: number; remote: number };
  updated: { local: number; remote: number };
  languages: string[];
}
```

| Propriété | Type | Description |
|-----------|------|-------------|
| `added` | `{ local: number; remote: number }` | Nombre de clés ajoutées localement et à distance. |
| `updated` | `{ local: number; remote: number }` | Nombre de clés mises à jour localement et à distance. |
| `languages` | `string[]` | Liste des langues traitées lors de la synchronisation. |

---

`SheetData` est un objet où :
- Chaque clé de premier niveau est un **code de langue** (correspondant aux en-têtes de colonnes de votre feuille de calcul).
- Chaque valeur est un objet imbriqué de paires clé-valeur de traduction.
- Les clés en notation par points (par exemple, `nav.home`) sont automatiquement développées en objets imbriqués.

**Exemple de sortie :**

```json
{
  "en": {
    "greeting": "Hello",
    "nav": {
      "home": "Home",
      "about": "About"
    }
  },
  "fr": {
    "greeting": "Bonjour",
    "nav": {
      "home": "Accueil",
      "about": "A propos"
    }
  }
}
```
