import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";

interface NestedObject {
  [key: string]: string | NestedObject | undefined;
}

interface SheetData {
  [key: string]: NestedObject;
}

export class SheetManager {
  private doc: GoogleSpreadsheet;
  private jwt: JWT;

  constructor(
    privateKey: string,
    clientEmail: string,
    sheetId: string,
  ) {
    const SCOPES = [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ];

    this.jwt = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    this.doc = new GoogleSpreadsheet(sheetId, this.jwt);    
  }

  async init(userPath: string) {
    await this.jwt.authorize();
    this.read()
      .then((data) => {
        if (data!==null || data !== undefined) {
          console.error("No data found in the sheet");
          return;
        }
        this.write(data, userPath);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async read(sheetPosition: number = 0): Promise<SheetData> {
    if (sheetPosition < 0) {
      sheetPosition = 0;
    }
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[sheetPosition];
    await sheet.loadHeaderRow();
    const colTitles = sheet.headerValues;
    const rows = await sheet.getRows({ limit: sheet.rowCount });

    const result: SheetData = {};
    rows.forEach((row) => {
      colTitles.slice(1).forEach((title) => {
        const key = row.get(colTitles[0]);
        const value = row.get(title) !== "" ? row.get(title) : undefined;

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (key.includes(".")) {
          const keys = key.split(".");
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          result[title] = result[title] || {};
          result[title][keys[0]] = {
            ...(result[title][keys[0]] as NestedObject),
            [keys[1]]: value,
          };
        } else {
          result[title] = {
            ...result[title],
            [key]: value,
          };
        }
      });
    });

    return result;
  }

  write(data: SheetData, directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    Object.keys(data).forEach((key) => {
      const filePath = path.join(directoryPath, `${key}.json`);
      fs.writeFile(filePath, JSON.stringify(data[key], null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        // console.log(`File written: ${filePath}`);
      });
    });
  }
}
