---
title: sheets-translate-to-json
slug: /
---

<div class="text--center">
    <img src="img/sheets-translate-to-json.png" alt="sheets-translate-to-json logo" width="200" />
</div>

<div class="text--center" style={{fontSize: '1.2rem', margin: '1rem 0 2rem'}}>

Convierte tus traducciones de Google Sheets en archivos JSON estructurados con un solo comando.

</div>

## Inicio rapido

```bash
npm install sheets-translate-to-json
```

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./translations');
// Crea en.json, fr.json, es.json, etc.
```

## Caracteristicas

- **API sencilla** — Un solo metodo para obtener y escribir todas las traducciones
- **Soporte multi-hoja** — Lee de hojas especificas o combina todas las hojas automaticamente
- **Claves anidadas** — Las claves con notacion de puntos (`nav.home`) se expanden en objetos JSON anidados
- **TypeScript** — Definiciones de tipos completas incluidas
- **Sincronizacion bidireccional** — Sincroniza traducciones entre archivos JSON locales y Google Sheets con estrategias de resolucion de conflictos
- **Flexible** — Usa `init` para el camino rapido, o `read`/`write` por separado para control total

## Comenzar

Listo para usar **sheets-translate-to-json**? Consulta la [guia de instalacion](/docs/getting-started/installation).

## Contribuir

Las contribuciones son bienvenidas! Consulta el [repositorio de GitHub](https://github.com/josephjoberno/sheets-translate-to-json) para mas detalles.

1. Haz un fork del proyecto
2. Crea una rama de funcionalidad
3. Realiza tus cambios y agrega pruebas
4. Envia un Pull Request
