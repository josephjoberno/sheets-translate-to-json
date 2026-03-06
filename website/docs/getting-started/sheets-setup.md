---
id: sheets-setup
title: Sheets Setup
sidebar_position: 3
---

# Setting Up Your Google Sheet

## Create a new spreadsheet

Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet.

## Structure your sheet

Your spreadsheet must follow this format:

| key | en | fr | es |
|-----|----|----|-----|
| greeting | Hello | Bonjour | Hola |
| farewell | Goodbye | Au revoir | Adios |
| nav.home | Home | Accueil | Inicio |
| nav.about | About | A propos | Acerca de |

- **Column A**: Translation keys (supports dot notation for nesting, e.g., `nav.home`)
- **Other columns**: One column per language, with the column header as the language code

![model-sheets](/img/sheets.png)

## Find your spreadsheet ID

The spreadsheet ID is in the URL:

```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0
```

The long string between `/d/` and `/edit` is your spreadsheet ID.

## Optional: Auto-translation script

You can add a Google Apps Script to auto-translate text when you type in a specific column.

1. Go to **Extensions** > **Apps Script**.

   ![script-editor](/img/script-editor.png)

2. Paste the following script:

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

3. Save the script and return to your sheet.

To add more languages, add a new line in `translateAndSet` with the appropriate [language code](https://cloud.google.com/translate/docs/languages) and column number.

:::tip
Remember to share your spreadsheet with your service account email address.
:::
