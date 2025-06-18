---

id: sheets
title: Sheets
sidebar_position: 3
---

## Creating a New Google Sheet

Open [Google Sheets](https://sheets.google.com) in your browser.

Click on '+ Create a spreadsheet' to open a new document.

## Finding the ID of a Google Sheets Spreadsheet

1. **Open the spreadsheet for which you need the ID.**

2. **Look at your browser's address bar.** The URL of your spreadsheet will look something like this:
   `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G/edit#gid=0`

3. **The ID of your spreadsheet is the long string of characters located between `/d/` and `/edit`.** In the example above, the ID would be:
   ```1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G```

## Create a sheet like this

![model-sheets](/img/sheets.png)

---

## Adding Translation Script to Google Sheets

This guide will walk you through adding a Google Apps Script to your Google Sheets for automatic translation.

## Access the Script Editor

1. **Go to the Extensions menu** in the top menu bar of your Google Sheet.
2. **Select 'Apps Script'** to open the script editor.

  ![script-editor](/img/script-editor.png)

## Step 3: Add the Translation Script

1. **Copy the translation script** provided above.
2. **Paste the script** into the Apps Script editor.

    ```javascript
    function onEdit(e) {
    // Check if the event object is defined
    if (!e) {
        return;
    }

    var range = e.range;
    var sheet = range.getSheet();
    var row = range.getRow();
    var column = range.getColumn();

    // Check if the edit took place in column B (column 2) and the row is greater than 1
    if (column === 2 && row > 1) {
        var text = range.getValue();
        // Call the translation function
        translateAndSet(sheet, row, text);
    }
    }

    function translateAndSet(sheet, row, text) {
    // Translate the text and set values in columns C, D, and F
    sheet.getRange(row, 3).setValue(LanguageApp.translate(text, "", "fr")); // French
    sheet.getRange(row, 4).setValue(LanguageApp.translate(text, "", "es")); // Spanish
    sheet.getRange(row, 5).setValue(LanguageApp.translate(text, "", "ht")); // Haitian
    }
    ```

3. **Save the script** by clicking the disk icon or File > Save.

## Step 4: Test the Script

1. **Return to your Google Sheet.**
2. **Enter some text in column B (column 2).**
3. **The script should automatically translate the text** into French, Spanish, and Haitian in columns C, D, and F, respectively.

## Modifying the Script to Add a New Language

To add a new language to the translation script:

1. **Open the script in the Apps Script editor.**
2. **Add a new line in the `translateAndSet` function** with the desired language code. For example, to add German:

   ```javascript
   sheet.getRange(row, 6).setValue(LanguageApp.translate(text, "", "de")); // German
   ```

3. **This line will translate the text into German** and set it in column E (or another column of your choice).

4. **Save and test the script** as before.

---

This guide should help you set up and modify the translation script in your Google Sheets. Remember to replace the language codes with the ones you need, and adjust the column numbers as per your sheet's layout.

### Important Tips

- **Keep the ID safe:** The ID of your spreadsheet can allow anyone to access it if the sharing settings of the sheet are set to "Anyone with the link can edit."
- **Check permissions:** Ensure that your spreadsheet's permissions are correctly configured to prevent unauthorized access.

## Sheet Methods

### readByName()
The `readByName()` method allows you to read data from a specific sheet by its name.

```typescript
const sheet = await sheets.readByName("Sheet1");
```

This method returns the data from the specified sheet name. If the sheet doesn't exist, it will throw an error.

### readAllSheets()
The `readAllSheets()` method reads data from all sheets in the spreadsheet.

```typescript
const allSheets = await sheets.readAllSheets();
```

This method returns an object where each key is the sheet name and the value is the sheet's data.

### listSheets()
The `listSheets()` method returns a list of all sheet names in the spreadsheet.

```typescript
const sheetNames = await sheets.listSheets();
```

This method returns an array of strings containing all sheet names in the spreadsheet.

---
