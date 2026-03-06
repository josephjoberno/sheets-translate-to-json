---
id: installation
title: Installation
sidebar_position: 1
---

# Installation

## Prérequis

- **Node.js** version 18.0 ou supérieure
- **npm**, **yarn**, ou **pnpm**

## Installer le package

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

## Importation

```typescript
// ES Modules
import { SheetManager } from 'sheets-translate-to-json';
```

```javascript
// CommonJS
const { SheetManager } = require('sheets-translate-to-json');
```

## Prochaines étapes

Une fois installé, vous devez [configurer vos identifiants Google Cloud](/docs/getting-started/configuration) avant d'utiliser la bibliothèque.
