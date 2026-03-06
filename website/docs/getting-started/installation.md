---
id: installation
title: Installation
sidebar_position: 1
---

# Installation

## Prerequisites

- **Node.js** version 18.0 or higher
- **npm**, **yarn**, or **pnpm**

## Install the package

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

## Import

```typescript
// ES Modules
import { SheetManager } from 'sheets-translate-to-json';
```

```javascript
// CommonJS
const { SheetManager } = require('sheets-translate-to-json');
```

## Next steps

Once installed, you need to [configure your Google Cloud credentials](/docs/getting-started/configuration) before using the library.
