---
title: sheets-translate-to-json
slug: /
---

<div class="text--center">
    <img src="img/sheets-translate-to-json.png" alt="sheets-translate-to-json logo" width="200" />
</div>

<div class="text--center" style={{fontSize: '1.2rem', margin: '1rem 0 2rem'}}>

Convertissez vos traductions Google Sheets en fichiers JSON structurés avec une seule commande.

</div>

## Démarrage rapide

```bash
npm install sheets-translate-to-json
```

```typescript
import { SheetManager } from 'sheets-translate-to-json';

const manager = new SheetManager(privateKey, clientEmail, sheetId);
await manager.init('./translations');
// Creates en.json, fr.json, es.json, etc.
```

## Fonctionnalités

- **API simple** — Une seule méthode pour récupérer et écrire toutes les traductions
- **Support multi-feuilles** — Lisez des feuilles spécifiques ou fusionnez toutes les feuilles automatiquement
- **Clés imbriquées** — Les clés en notation par points (`nav.home`) sont développées en objets JSON imbriqués
- **TypeScript** — Définitions de types complètes incluses
- **Synchronisation bidirectionnelle** — Gardez vos fichiers JSON locaux et Google Sheets en phase avec `sync`, `push` et `readLocal`
- **Flexible** — Utilisez `init` pour le chemin rapide, ou `read`/`write` séparément pour un contrôle total

## Commencer

Prêt à utiliser **sheets-translate-to-json** ? Consultez le [guide d'installation](/docs/getting-started/installation).

## Contribuer

Les contributions sont les bienvenues ! Consultez le [dépôt GitHub](https://github.com/josephjoberno/sheets-translate-to-json) pour plus de détails.

1. Forkez le projet
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications et ajoutez des tests
4. Soumettez une Pull Request
