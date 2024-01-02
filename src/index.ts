import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";

interface GenericObject {
  [key: string]: any;
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
        if (!data) {
          console.error("No data found in the sheet");
          return;
        }
        this.write(data, userPath);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * 
   * @param {number} sheetPosition  the position of the sheet in the spreadsheet (0 is the first sheet)
   * @returns 
   */
  async read(sheetPosition:number=0): Promise<any> {
    if(sheetPosition < 0){
      sheetPosition = 0
    }
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[sheetPosition];
    await sheet.loadHeaderRow();
    const colTitles = sheet.headerValues;
    const rows = await sheet.getRows({ limit: sheet.rowCount });

    let result: GenericObject = {};
    rows.forEach((row) => {
      colTitles.slice(1).forEach((title) => {
        //@ts-ignore
        result[title] = result[title] || [];
        const key = row.get(colTitles[0]);
        if (key.includes(".")) {
          const keys = key.split(".");
          result = {
            ...result,
            [title]: {
              ...result[title],
              [keys[0]]: {
                ...result[title][keys[0]],
                [keys[1]]: row.get(title) !== "" ? row.get(title) : undefined,
              },
            },
          };
        } else {
          result = {
            ...result,
            [title]: {
              ...result[title],
              [key]: row.get(title) !== "" ? row.get(title) : undefined,
            },
          };
        }
      });
    });

    return result;
  }

  write(data: any, directoryPath: string): void {
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
