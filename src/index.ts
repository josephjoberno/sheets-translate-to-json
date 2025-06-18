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

  async init(userPath: string, sheetNames?: string[]) {
    try {
      await this.jwt.authorize();
      
      if (sheetNames && sheetNames.length > 0) {
        // Traiter plusieurs feuilles spécifiques
        for (const sheetName of sheetNames) {
          const data = await this.readByName(sheetName);
          if (data && Object.keys(data).length > 0) {
            this.write(data, userPath, sheetName);
          } else {
            console.warn(`No data found in sheet: ${sheetName}`);
          }
        }
      } else {
        // Traiter toutes les feuilles
        const data = await this.read();
        if (data && Object.keys(data).length > 0) {
          this.write(data, userPath);
        } else {
          console.error("No data found in the sheet");
        }
      }
    } catch (err) {
      console.error("Error during initialization:", err);
    }
  }

  async read(sheetPosition: number = 0): Promise<SheetData> {
    if (sheetPosition < 0) {
      sheetPosition = 0;
    }
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[sheetPosition];
    return this.processSheet(sheet);
  }

  async readByName(sheetName: string): Promise<SheetData> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle[sheetName];
    
    if (!sheet) {
      throw new Error(`Sheet with name "${sheetName}" not found`);
    }
    
    return this.processSheet(sheet);
  }

  async readAllSheets(): Promise<{ [sheetName: string]: SheetData }> {
    await this.doc.loadInfo();
    const allData: { [sheetName: string]: SheetData } = {};
    
    for (const sheet of this.doc.sheetsByIndex) {
      try {
        const data = await this.processSheet(sheet);
        if (data && Object.keys(data).length > 0) {
          allData[sheet.title] = data;
        }
      } catch (error) {
        console.error(`Error processing sheet "${sheet.title}":`, error);
      }
    }
    
    return allData;
  }

  private async processSheet(sheet: any): Promise<SheetData> {
    await sheet.loadHeaderRow();
    const colTitles = sheet.headerValues;
    const rows = await sheet.getRows({ limit: sheet.rowCount });

    const result: SheetData = {};
    
    rows.forEach((row: any) => {
      // Vérifier si la ligne n'est pas vide
      const keyValue = row.get(colTitles[0]);
      
      // Ignorer les lignes vides ou avec une clé vide/undefined
      if (!keyValue || keyValue.trim() === '') {
        return;
      }

      colTitles.slice(1).forEach((title: string) => {
        const key = keyValue.trim();
        const value = row.get(title);
        const cleanValue = value && value.trim() !== '' ? value.trim() : undefined;

        // Initialiser la structure pour cette colonne si elle n'existe pas
        if (!result[title]) {
          result[title] = {};
        }

        // Gérer les clés imbriquées avec support de plusieurs niveaux
        if (key.includes(".")) {
          this.setNestedValue(result[title] as NestedObject, key, cleanValue);
        } else {
          (result[title] as NestedObject)[key] = cleanValue;
        }
      });
    });

    return result;
  }

  private setNestedValue(obj: NestedObject, keyPath: string, value: string | undefined): void {
    const keys = keyPath.split(".");
    let current = obj;

    // Naviguer jusqu'à l'avant-dernier niveau
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      
      current = current[key] as NestedObject;
    }

    // Définir la valeur finale
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;
  }

  write(data: SheetData, directoryPath: string, sheetPrefix?: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    Object.keys(data).forEach((key) => {
      const fileName = sheetPrefix ? `${sheetPrefix}_${key}.json` : `${key}.json`;
      const filePath = path.join(directoryPath, fileName);
      
      fs.writeFile(filePath, JSON.stringify(data[key], null, 2), (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}:`, err);
          return;
        }
        console.log(`File written: ${filePath}`);
      });
    });
  }

  // Méthode utilitaire pour lister toutes les feuilles disponibles
  async listSheets(): Promise<string[]> {
    await this.doc.loadInfo();
    return this.doc.sheetsByIndex.map(sheet => sheet.title);
  }
}