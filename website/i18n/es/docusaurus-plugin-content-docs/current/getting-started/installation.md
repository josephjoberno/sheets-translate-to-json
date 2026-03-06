---
id: installation
title: Instalacion
sidebar_position: 1
---

# Instalacion

## Prerequisitos

- **Node.js** version 18.0 o superior
- **npm**, **yarn**, o **pnpm**

## Instalar el paquete

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install sheets-translate-to-json
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add sheets-translate-to-json
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add sheets-translate-to-json
```

</TabItem>
</Tabs>

## Importar

```typescript
// Modulos ES
import { SheetManager } from 'sheets-translate-to-json';
```

```javascript
// CommonJS
const { SheetManager } = require('sheets-translate-to-json');
```

## Siguientes pasos

Una vez instalado, necesitas [configurar tus credenciales de Google Cloud](/docs/getting-started/configuration) antes de usar la biblioteca.
