---

id: usage
title: Usage
sidebar_position: 3
---

## Initialization

To start using `sheets-translate-to-json`, you first need to create an instance of the `SheetManager` class.

### Constructor

```javascript
const manager = new SheetManager(privateKey, clientEmail, sheetId);
```

| Parameter   | Type   | Description                                   |
|-------------|--------|-----------------------------------------------|
| privateKey  | String | The private key of your service account.      |
| clientEmail | String | The email associated with your service account.|
| sheetId     | String | The ID of your Google Sheets sheet.           |

## Methods

### init

Initializes the connection to the spreadsheet and writes data to a specified path.

```javascript
manager.init(userPath);
```

| Parameter | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| userPath  | String | The path of the folder where to write data.  |

### read (async)

Reads data from the specified spreadsheet.

```javascript
manager.read(sheetPosition).then(data => {
  // Use the data here
});
```

| Parameter    | Type   | Description                                       |
|--------------|--------|---------------------------------------------------|
| sheetPosition| Number | The position of the sheet in the workbook (0-index).|

### write (async)

Writes data to a JSON file in the specified path.

```javascript
manager.write(data, directoryPath);
```

| Parameter    | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| data         | Object | The data to write.                               |
| directoryPath| String | The path of the folder where to write JSON files.|

## Examples of Using SheetManager

### Using the `init` Method

The `init` method of `SheetManager` automates the process of reading data from the Google Sheets spreadsheet and writing this data into JSON files.

```javascript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

// Path where JSON files will be saved
const userPath = './translations';

// Initialization and automatic processing
manager.init(userPath)
  .then(() => console.log('Data successfully read and written.'))
  .catch(err => console.error('Error during initialization:', err));
```

In this example, `init` takes care of the entire process: it establishes the connection, reads the data from the specified spreadsheet, and writes this data to the `./translations` directory.

### Separately Using the `read` and `write` Methods

If you prefer more control over the process, you can use the `read` and `write` methods separately. This allows you to manipulate the data between reading and writing if necessary.

```javascript
const manager = new SheetManager(privateKey, clientEmail, sheetId);

// Reading data from the first spreadsheet
manager.read()
  .then(data => {
    console.log('Data successfully read.');
    // Data processing or manipulation here if needed

    // Path where JSON files will be saved
    const directoryPath = './translations';
    // Writing data into JSON files
    manager.write(data, directoryPath);
    console.log('Data written into JSON files.');
  })
  .catch(err => console.error('Error during reading:', err));
```

In this scenario, `read` is used to retrieve the data from the spreadsheet, and after any potential data processing, `write` is used to write this data into local JSON files.



---

### Result of Executing the SheetManager Script

After running the `SheetManager` script, the following folder is created with the generated JSON files:

![Folder with JSON files](/img/result-translations.png)

---
