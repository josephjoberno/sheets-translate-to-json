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

type SyncStrategy = 'local' | 'remote' | 'merge';

interface SyncOptions {
  strategy?: SyncStrategy;
  sheetName?: string;
  createSheet?: boolean;
}

interface SyncResult {
  added: { local: number; remote: number };
  updated: { local: number; remote: number };
  languages: string[];
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
        // Traiter plusieurs feuilles spécifiques et les combiner
        const combinedData: SheetData = {};
        
        for (const sheetName of sheetNames) {
          const data = await this.readByName(sheetName);
          if (data && Object.keys(data).length > 0) {
            // Combiner les données de cette feuille avec les données existantes
            Object.keys(data).forEach(language => {
              if (!combinedData[language]) {
                combinedData[language] = {};
              }
              // Fusionner les données de cette langue
              this.mergeNestedObjects(combinedData[language] as NestedObject, data[language] as NestedObject);
            });
          } else {
            console.warn(`No data found in sheet: ${sheetName}`);
          }
        }
        
        if (Object.keys(combinedData).length > 0) {
          this.write(combinedData, userPath);
        }
      } else {
        // Traiter toutes les feuilles et les combiner
        const allSheetsData = await this.readAllSheets();
        const combinedData: SheetData = {};
        
        // Combiner les données de toutes les feuilles
        Object.keys(allSheetsData).forEach(sheetName => {
          const sheetData = allSheetsData[sheetName];
          Object.keys(sheetData).forEach(language => {
            if (!combinedData[language]) {
              combinedData[language] = {};
            }
            // Fusionner les données de cette langue
            this.mergeNestedObjects(combinedData[language] as NestedObject, sheetData[language] as NestedObject);
          });
        });
        
        if (Object.keys(combinedData).length > 0) {
          this.write(combinedData, userPath);
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

  private mergeNestedObjects(target: NestedObject, source: NestedObject): void {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (typeof sourceValue === 'object' && sourceValue !== null && typeof targetValue === 'object' && targetValue !== null) {
          this.mergeNestedObjects(targetValue as NestedObject, sourceValue as NestedObject);
        } else {
          target[key] = sourceValue;
        }
      }
    }
  }

  write(data: SheetData, directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    Object.keys(data).forEach((key) => {
      const fileName = `${key}.json`;
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

  readLocal(directoryPath: string): SheetData {
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    const result: SheetData = {};
    const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const language = file.replace('.json', '');
      const filePath = path.join(directoryPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      result[language] = JSON.parse(content);
    }

    return result;
  }

  async push(directoryPath: string, sheetName?: string): Promise<void> {
    const localData = this.readLocal(directoryPath);

    if (Object.keys(localData).length === 0) {
      console.warn('No JSON files found in directory');
      return;
    }

    await this.doc.loadInfo();

    let sheet: any;
    if (sheetName) {
      sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        sheet = await this.doc.addSheet({ title: sheetName });
      }
    } else {
      sheet = this.doc.sheetsByIndex[0];
    }

    const languages = Object.keys(localData);
    const flatData = this.flattenAllLanguages(localData);

    await sheet.clear();
    await sheet.setHeaderRow(['key', ...languages]);

    const rows = flatData.map(entry => {
      const row: { [key: string]: string } = { key: entry.key };
      for (const lang of languages) {
        row[lang] = entry.values[lang] || '';
      }
      return row;
    });

    if (rows.length > 0) {
      await sheet.addRows(rows);
    }

    console.log(`Pushed ${rows.length} keys in ${languages.length} languages to sheet "${sheet.title}"`);
  }

  async sync(directoryPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    const { strategy = 'merge', sheetName, createSheet = false } = options;

    await this.doc.loadInfo();

    const result: SyncResult = {
      added: { local: 0, remote: 0 },
      updated: { local: 0, remote: 0 },
      languages: [],
    };

    // Read remote data
    let remoteData: SheetData;
    let sheet: any;

    if (sheetName) {
      sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        if (createSheet) {
          sheet = await this.doc.addSheet({ title: sheetName });
          remoteData = {};
        } else {
          throw new Error(`Sheet "${sheetName}" not found. Use createSheet: true to create it.`);
        }
      } else {
        remoteData = await this.processSheet(sheet);
      }
    } else {
      sheet = this.doc.sheetsByIndex[0];
      remoteData = await this.processSheet(sheet);
    }

    // Read local data
    let localData: SheetData = {};
    if (fs.existsSync(directoryPath)) {
      localData = this.readLocal(directoryPath);
    }

    // Collect all languages
    const allLanguages = new Set([
      ...Object.keys(remoteData),
      ...Object.keys(localData),
    ]);
    result.languages = [...allLanguages];

    // Merge data based on strategy
    const mergedData: SheetData = {};
    const remoteFlat = this.flattenSheetData(remoteData);
    const localFlat = this.flattenSheetData(localData);
    const allKeys = new Set([...Object.keys(remoteFlat), ...Object.keys(localFlat)]);

    for (const compositeKey of allKeys) {
      const remoteValues = remoteFlat[compositeKey] || {};
      const localValues = localFlat[compositeKey] || {};
      const isNewLocal = !remoteFlat[compositeKey];
      const isNewRemote = !localFlat[compositeKey];

      if (isNewLocal) result.added.local++;
      if (isNewRemote) result.added.remote++;

      for (const lang of allLanguages) {
        if (!mergedData[lang]) mergedData[lang] = {};

        const remoteVal = remoteValues[lang];
        const localVal = localValues[lang];
        let finalVal: string | undefined;

        if (strategy === 'local') {
          finalVal = localVal ?? remoteVal;
        } else if (strategy === 'remote') {
          finalVal = remoteVal ?? localVal;
        } else {
          // merge: prefer non-empty, local wins on conflict
          if (localVal && remoteVal && localVal !== remoteVal) {
            finalVal = localVal;
            if (!isNewLocal && !isNewRemote) result.updated.local++;
          } else {
            finalVal = localVal ?? remoteVal;
          }
        }

        if (finalVal !== undefined) {
          // Parse the composite key (lang is separate, compositeKey is the dot-path)
          const keyPath = compositeKey;
          if (keyPath.includes('.')) {
            this.setNestedValue(mergedData[lang] as NestedObject, keyPath, finalVal);
          } else {
            (mergedData[lang] as NestedObject)[keyPath] = finalVal;
          }
        }
      }
    }

    // Write merged data to local files
    this.write(mergedData, directoryPath);

    // Write merged data back to remote sheet
    const mergedLanguages = Object.keys(mergedData);
    const flatMerged = this.flattenAllLanguages(mergedData);

    await sheet.clear();
    await sheet.setHeaderRow(['key', ...mergedLanguages]);

    const rows = flatMerged.map(entry => {
      const row: { [key: string]: string } = { key: entry.key };
      for (const lang of mergedLanguages) {
        row[lang] = entry.values[lang] || '';
      }
      return row;
    });

    if (rows.length > 0) {
      await sheet.addRows(rows);
    }

    result.updated.remote = flatMerged.length;

    console.log(`Sync complete: ${result.added.local} new local keys, ${result.added.remote} new remote keys`);
    return result;
  }

  private flattenNestedObject(obj: NestedObject, prefix: string = ''): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        Object.assign(result, this.flattenNestedObject(value as NestedObject, fullKey));
      } else if (typeof value === 'string') {
        result[fullKey] = value;
      }
    }

    return result;
  }

  private flattenSheetData(data: SheetData): { [key: string]: { [lang: string]: string | undefined } } {
    const result: { [key: string]: { [lang: string]: string | undefined } } = {};

    for (const lang of Object.keys(data)) {
      const flat = this.flattenNestedObject(data[lang] as NestedObject);
      for (const key of Object.keys(flat)) {
        if (!result[key]) result[key] = {};
        result[key][lang] = flat[key];
      }
    }

    return result;
  }

  private flattenAllLanguages(data: SheetData): { key: string; values: { [lang: string]: string } }[] {
    const languages = Object.keys(data);
    const allKeys = new Set<string>();

    const flatByLang: { [lang: string]: { [key: string]: string } } = {};
    for (const lang of languages) {
      flatByLang[lang] = this.flattenNestedObject(data[lang] as NestedObject);
      for (const key of Object.keys(flatByLang[lang])) {
        allKeys.add(key);
      }
    }

    const sortedKeys = [...allKeys].sort();
    return sortedKeys.map(key => ({
      key,
      values: Object.fromEntries(
        languages.map(lang => [lang, flatByLang[lang][key] || ''])
      ),
    }));
  }
}