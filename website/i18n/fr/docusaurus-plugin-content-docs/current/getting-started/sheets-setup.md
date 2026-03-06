---
id: sheets-setup
title: Sheets Setup
sidebar_position: 3
---

# Configurer votre Google Sheet

## Créer une nouvelle feuille de calcul

Ouvrez [Google Sheets](https://sheets.google.com) et créez une nouvelle feuille de calcul.

## Structurer votre feuille

Votre feuille de calcul doit suivre ce format :

| key | en | fr | es |
|-----|----|----|-----|
| greeting | Hello | Bonjour | Hola |
| farewell | Goodbye | Au revoir | Adios |
| nav.home | Home | Accueil | Inicio |
| nav.about | About | A propos | Acerca de |

- **Colonne A** : Clés de traduction (supporte la notation par points pour l'imbrication, par exemple `nav.home`)
- **Autres colonnes** : Une colonne par langue, avec le code de langue comme en-tête de colonne

![model-sheets](/img/sheets.png)

## Trouver l'identifiant de votre feuille de calcul

L'identifiant de la feuille de calcul se trouve dans l'URL :

```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0
```

La longue chaîne de caractères entre `/d/` et `/edit` est l'identifiant de votre feuille de calcul.

## Optionnel : Script de traduction automatique

Vous pouvez ajouter un Google Apps Script pour traduire automatiquement le texte lorsque vous tapez dans une colonne spécifique.

1. Allez dans **Extensions** > **Apps Script**.

   ![script-editor](/img/script-editor.png)

2. Collez le script suivant :

```javascript
function onEdit(e) {
  if (!e) return;

  var range = e.range;
  var sheet = range.getSheet();
  var row = range.getRow();
  var column = range.getColumn();

  // Trigger on column B (column 2), skip header row
  if (column === 2 && row > 1) {
    translateAndSet(sheet, row, range.getValue());
  }
}

function translateAndSet(sheet, row, text) {
  sheet.getRange(row, 3).setValue(LanguageApp.translate(text, "", "fr"));
  sheet.getRange(row, 4).setValue(LanguageApp.translate(text, "", "es"));
  sheet.getRange(row, 5).setValue(LanguageApp.translate(text, "", "ht"));
}
```

3. Enregistrez le script et retournez à votre feuille.

Pour ajouter d'autres langues, ajoutez une nouvelle ligne dans `translateAndSet` avec le code de langue et le numéro de colonne appropriés.

:::tip
N'oubliez pas de partager votre feuille de calcul avec l'adresse e-mail de votre compte de service.
:::
