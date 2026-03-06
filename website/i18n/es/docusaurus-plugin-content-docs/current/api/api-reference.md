---
id: api-reference
title: Referencia API
sidebar_position: 1
---

# Referencia API

## `SheetManager`

La clase principal para interactuar con Google Sheets.

### Constructor

```typescript
const manager = new SheetManager(privateKey: string, clientEmail: string, sheetId: string);
```

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `privateKey` | `string` | La clave privada de tu archivo JSON de cuenta de servicio. |
| `clientEmail` | `string` | El correo electronico de tu archivo JSON de cuenta de servicio. |
| `sheetId` | `string` | El ID de tu hoja de calculo de Google Sheets. |

---

## Metodos

### `init(userPath, sheetNames?)`

Lee datos de la hoja de calculo y escribe archivos JSON en el disco. Este es el metodo principal para la mayoria de los casos de uso.

```typescript
await manager.init(userPath: string, sheetNames?: string[]): Promise<void>
```

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| `userPath` | `string` | Si | Ruta del directorio donde se escribiran los archivos JSON. |
| `sheetNames` | `string[]` | No | Nombres especificos de hojas a procesar. Si se omite, se procesan todas las hojas. |

Cuando se procesan varias hojas, sus datos se **combinan por idioma** — las claves de todas las hojas se combinan en un unico archivo JSON por idioma.

---

### `read(sheetPosition?)`

Lee datos de una sola hoja por su posicion de indice.

```typescript
await manager.read(sheetPosition?: number): Promise<SheetData>
```

| Parametro | Tipo | Predeterminado | Descripcion |
|-----------|------|----------------|-------------|
| `sheetPosition` | `number` | `0` | Indice basado en cero de la hoja a leer. |

**Retorna:** `SheetData` — Un objeto donde cada clave es un codigo de idioma y el valor son los datos de traduccion.

---

### `readByName(sheetName)`

Lee datos de una hoja especifica por su nombre.

```typescript
await manager.readByName(sheetName: string): Promise<SheetData>
```

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `sheetName` | `string` | El nombre exacto de la pestana de la hoja. |

**Lanza** un error si no se encuentra el nombre de la hoja.

---

### `readAllSheets()`

Lee datos de todas las hojas de la hoja de calculo.

```typescript
await manager.readAllSheets(): Promise<{ [sheetName: string]: SheetData }>
```

**Retorna:** Un objeto donde cada clave es el nombre de la hoja y el valor es el `SheetData` correspondiente.

---

### `write(data, directoryPath)`

Escribe datos de traduccion en archivos JSON. Se crea un archivo por idioma.

```typescript
manager.write(data: SheetData, directoryPath: string): void
```

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `data` | `SheetData` | El objeto de datos retornado por `read`, `readByName` o `readAllSheets`. |
| `directoryPath` | `string` | Directorio donde se guardaran los archivos JSON. Se crea si no existe. |

:::info
Este metodo es **sincrono** en su logica de creacion de archivos (usa `fs.writeFile` con callbacks internamente). No retorna una Promise.
:::

---

### `listSheets()`

Retorna los nombres de todas las hojas de la hoja de calculo.

```typescript
await manager.listSheets(): Promise<string[]>
```

**Retorna:** Un arreglo con los nombres de las pestanas de las hojas.

---

### `readLocal(directoryPath)`

Lee archivos JSON de un directorio local y los devuelve en formato `SheetData`. Lanza un error si el directorio no existe.

```typescript
manager.readLocal(directoryPath: string): SheetData
```

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `directoryPath` | `string` | Ruta del directorio que contiene los archivos JSON a leer. |

**Retorna:** `SheetData` — Un objeto donde cada clave es un codigo de idioma y el valor son los datos de traduccion.

**Lanza** un error si el directorio no existe.

---

### `push(directoryPath, sheetName?)`

Lee archivos JSON locales y los sube a Google Sheets. Aplana objetos anidados a notacion de puntos.

```typescript
await manager.push(directoryPath: string, sheetName?: string): Promise<void>
```

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| `directoryPath` | `string` | Si | Ruta del directorio que contiene los archivos JSON a subir. |
| `sheetName` | `string` | No | Nombre de la hoja de destino. Si se proporciona y no existe, crea una nueva hoja. |

---

### `sync(directoryPath, options?)`

Sincronizacion bidireccional entre archivos JSON locales y Google Sheets.

```typescript
await manager.sync(directoryPath: string, options?: SyncOptions): Promise<SyncResult>
```

| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| `directoryPath` | `string` | Si | Ruta del directorio que contiene los archivos JSON locales. |
| `options` | `SyncOptions` | No | Opciones de configuracion para la sincronizacion. |

**Retorna:** `SyncResult` — Un objeto con el resumen de los cambios aplicados.

#### Estrategias de sincronizacion

| Estrategia | Descripcion |
|------------|-------------|
| `'local'` | Los valores locales sobrescriben los remotos en conflictos. |
| `'remote'` | Los valores remotos sobrescriben los locales en conflictos. |
| `'merge'` (por defecto) | Combina ambos, prefiere valores locales en conflictos, rellena valores faltantes de ambos lados. |

---

## Tipos

### `SheetData`

```typescript
interface NestedObject {
  [key: string]: string | NestedObject | undefined;
}

interface SheetData {
  [key: string]: NestedObject;
}
```

`SheetData` es un objeto donde:
- Cada clave de nivel superior es un **codigo de idioma** (correspondiente a los encabezados de columna en tu hoja de calculo).
- Cada valor es un objeto anidado de pares clave-valor de traduccion.
- Las claves con notacion de puntos (por ejemplo, `nav.home`) se expanden automaticamente en objetos anidados.

**Ejemplo de salida:**

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

Define la estrategia de resolucion de conflictos durante la sincronizacion.

---

### `SyncOptions`

```typescript
interface SyncOptions {
  strategy?: SyncStrategy;  // por defecto: 'merge'
  sheetName?: string;
  createSheet?: boolean;    // por defecto: false
}
```

| Propiedad | Tipo | Predeterminado | Descripcion |
|-----------|------|----------------|-------------|
| `strategy` | `SyncStrategy` | `'merge'` | Estrategia de resolucion de conflictos. |
| `sheetName` | `string` | `undefined` | Nombre de la hoja de destino. |
| `createSheet` | `boolean` | `false` | Si es `true`, crea la hoja si no existe. |

---

### `SyncResult`

```typescript
interface SyncResult {
  added: { local: number; remote: number };
  updated: { local: number; remote: number };
  languages: string[];
}
```

| Propiedad | Tipo | Descripcion |
|-----------|------|-------------|
| `added.local` | `number` | Numero de claves nuevas agregadas localmente. |
| `added.remote` | `number` | Numero de claves nuevas agregadas en remoto. |
| `updated.local` | `number` | Numero de claves actualizadas localmente. |
| `updated.remote` | `number` | Numero de claves actualizadas en remoto. |
| `languages` | `string[]` | Lista de codigos de idioma procesados. |
