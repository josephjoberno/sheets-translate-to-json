---
id: api-reference
title: API Reference
sidebar_position: 1
---

# API Reference

## `SheetManager`

The main class for interacting with Google Sheets.

### Constructor

```typescript
const manager = new SheetManager(privateKey: string, clientEmail: string, sheetId: string);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `privateKey` | `string` | The private key from your service account JSON file. |
| `clientEmail` | `string` | The email from your service account JSON file. |
| `sheetId` | `string` | The ID of your Google Sheets spreadsheet. |

---

## Methods

### `init(userPath, sheetNames?)`

Reads data from the spreadsheet and writes JSON files to disk. This is the main method for most use cases.

```typescript
await manager.init(userPath: string, sheetNames?: string[]): Promise<void>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userPath` | `string` | Yes | Directory path where JSON files will be written. |
| `sheetNames` | `string[]` | No | Specific sheet names to process. If omitted, all sheets are processed. |

When multiple sheets are processed, their data is **merged by language** — keys from all sheets are combined into a single JSON file per language.

---

### `read(sheetPosition?)`

Reads data from a single sheet by its index position.

```typescript
await manager.read(sheetPosition?: number): Promise<SheetData>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sheetPosition` | `number` | `0` | Zero-based index of the sheet to read. |

**Returns:** `SheetData` — An object where each key is a language code and the value is the translation data.

---

### `readByName(sheetName)`

Reads data from a specific sheet by its name.

```typescript
await manager.readByName(sheetName: string): Promise<SheetData>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sheetName` | `string` | The exact name of the sheet tab. |

**Throws** an error if the sheet name is not found.

---

### `readAllSheets()`

Reads data from all sheets in the spreadsheet.

```typescript
await manager.readAllSheets(): Promise<{ [sheetName: string]: SheetData }>
```

**Returns:** An object where each key is the sheet name and the value is the corresponding `SheetData`.

---

### `write(data, directoryPath)`

Writes translation data to JSON files. One file is created per language.

```typescript
manager.write(data: SheetData, directoryPath: string): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `SheetData` | The data object returned by `read`, `readByName`, or `readAllSheets`. |
| `directoryPath` | `string` | Directory where JSON files will be saved. Created if it doesn't exist. |

:::info
This method is **synchronous** in its file creation logic (using `fs.writeFile` with callbacks internally). It does not return a Promise.
:::

---

### `listSheets()`

Returns the names of all sheets in the spreadsheet.

```typescript
await manager.listSheets(): Promise<string[]>
```

**Returns:** An array of sheet tab names.

---

### `readLocal(directoryPath)`

Reads JSON files from a local directory back into `SheetData` format.

```typescript
manager.readLocal(directoryPath: string): SheetData
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `directoryPath` | `string` | Path to the directory containing JSON translation files. |

**Returns:** `SheetData` — An object where each key is a language code and the value is the translation data.

**Throws** an error if the directory doesn't exist. Only reads `.json` files.

---

### `push(directoryPath, sheetName?)`

Reads local JSON files and uploads them to Google Sheets. Nested objects are flattened back to dot-notation.

```typescript
await manager.push(directoryPath: string, sheetName?: string): Promise<void>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `directoryPath` | `string` | Yes | Path to the directory containing JSON translation files. |
| `sheetName` | `string` | No | Target sheet name. If provided and doesn't exist, a new sheet is created. |

---

### `sync(directoryPath, options?)`

Two-way sync between local JSON files and Google Sheets.

```typescript
await manager.sync(directoryPath: string, options?: SyncOptions): Promise<SyncResult>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `directoryPath` | `string` | Yes | Path to the directory containing JSON translation files. |
| `options` | `SyncOptions` | No | Configuration for the sync behavior. |

**Returns:** `SyncResult` — An object describing what was added and updated on each side.

**Sync strategies:**

| Strategy | Description |
|----------|-------------|
| `local` | Local values override remote on conflicts. |
| `remote` | Remote values override local on conflicts. |
| `merge` (default) | Combines both sides. Prefers local on conflicts. Fills in missing values from both sides. |

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

`SheetData` is an object where:
- Each top-level key is a **language code** (matching the column headers in your spreadsheet).
- Each value is a nested object of translation key-value pairs.
- Dot-notation keys (e.g., `nav.home`) are automatically expanded into nested objects.

**Example output:**

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

---

### `SyncStrategy`

```typescript
type SyncStrategy = 'local' | 'remote' | 'merge';
```

Determines how conflicts are resolved during a two-way sync:
- `'local'` — Local values win on conflicts.
- `'remote'` — Remote values win on conflicts.
- `'merge'` — Combines both sides, prefers local on conflicts, fills in missing values from both sides.

---

### `SyncOptions`

```typescript
interface SyncOptions {
  strategy?: SyncStrategy;  // default: 'merge'
  sheetName?: string;       // specific sheet to sync with
  createSheet?: boolean;    // create sheet if not found (default: false)
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `strategy` | `SyncStrategy` | `'merge'` | The conflict resolution strategy. |
| `sheetName` | `string` | — | Specific sheet to sync with. |
| `createSheet` | `boolean` | `false` | Whether to create the sheet if it doesn't exist. |

---

### `SyncResult`

```typescript
interface SyncResult {
  added: { local: number; remote: number };
  updated: { local: number; remote: number };
  languages: string[];
}
```

| Property | Type | Description |
|----------|------|-------------|
| `added.local` | `number` | Number of keys added locally from remote. |
| `added.remote` | `number` | Number of keys added remotely from local. |
| `updated.local` | `number` | Number of keys updated locally. |
| `updated.remote` | `number` | Number of keys updated remotely. |
| `languages` | `string[]` | List of language codes that were synced. |
