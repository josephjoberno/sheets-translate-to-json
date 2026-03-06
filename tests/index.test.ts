import { SheetManager } from "../src";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";

// Mock des dépendances
jest.mock("google-spreadsheet");
jest.mock("google-auth-library");
jest.mock("fs");
jest.mock("path");

const mockedGoogleSpreadsheet = GoogleSpreadsheet as jest.MockedClass<
  typeof GoogleSpreadsheet
>;
const mockedJWT = JWT as jest.MockedClass<typeof JWT>;
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe("SheetManager", () => {
  let sheetManager: SheetManager;
  let mockDoc: jest.Mocked<GoogleSpreadsheet>;
  let mockJwt: jest.Mocked<JWT>;
  let mockSheet: any;

  const PRIVATE_KEY = "mock-private-key";
  const CLIENT_EMAIL = "mock-client-email";
  const SPREADSHEET_ID = "mock-spreadsheet-id";
  
  const mockPrivateKey = PRIVATE_KEY;
  const mockClientEmail = CLIENT_EMAIL;
  const mockSheetId = SPREADSHEET_ID;

  beforeEach(() => {
    // Reset tous les mocks
    jest.clearAllMocks();

    // Mock JWT
    mockJwt = {
      authorize: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockedJWT.mockImplementation(() => mockJwt);

    // Mock Sheet
    mockSheet = {
      title: "translations",
      loadHeaderRow: jest.fn().mockResolvedValue(undefined),
      headerValues: ["key", "en", "fr", "es"],
      rowCount: 10,
      getRows: jest.fn(),
    };

    // Mock GoogleSpreadsheet
    mockDoc = {
      loadInfo: jest.fn().mockResolvedValue(undefined),
      sheetsByIndex: [mockSheet],
      sheetsByTitle: { translations: mockSheet, dashboard: mockSheet },
    } as any;

    mockedGoogleSpreadsheet.mockImplementation(() => mockDoc);

    // Mock fs
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.mkdirSync.mockReturnValue(undefined as any);
    mockedFs.writeFile.mockImplementation((path, data, callback: any) => {
      callback(null);
    });

    // Mock path
    mockedPath.join.mockImplementation((...args) => args.join("/"));

    sheetManager = new SheetManager(
      mockPrivateKey,
      mockClientEmail,
      mockSheetId
    );
  });

  describe("Constructor", () => {
    it("should create SheetManager instance with correct parameters", () => {
      expect(mockedJWT).toHaveBeenCalledWith({
        email: mockClientEmail,
        key: mockPrivateKey,
        scopes: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive.file",
        ],
      });

      expect(mockedGoogleSpreadsheet).toHaveBeenCalledWith(
        mockSheetId,
        mockJwt
      );
    });
  });

  describe("init", () => {
    it("should initialize and process single sheet when no sheet names provided", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("about.title")
            .mockReturnValueOnce("Who are we?")
            .mockReturnValueOnce("Qui sommes-nous ?")
            .mockReturnValueOnce("¿Quiénes somos?"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      await sheetManager.init("./output");

      expect(mockJwt.authorize).toHaveBeenCalled();
      expect(mockDoc.loadInfo).toHaveBeenCalled();
      expect(mockSheet.loadHeaderRow).toHaveBeenCalled();
      expect(mockSheet.getRows).toHaveBeenCalled();
    });

    it("should process specific sheets when sheet names provided", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("test.key")
            .mockReturnValueOnce("Test Value")
            .mockReturnValueOnce("Valeur Test")
            .mockReturnValueOnce("Valor Prueba"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      await sheetManager.init("./output", ["translations", "dashboard"]);

      expect(mockJwt.authorize).toHaveBeenCalled();
      expect(mockDoc.loadInfo).toHaveBeenCalledTimes(2); // Une fois par feuille
    });

    it("should handle errors gracefully", async () => {
      // Sauvegarder l'implémentation originale
      const originalAuthorize = mockJwt.authorize;

      // Temporairement changer le comportement du mock
      mockJwt.authorize = jest.fn().mockRejectedValue(new Error("Auth failed"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await sheetManager.init("./output");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during initialization:",
        expect.any(Error)
      );

      // Restaurer les mocks
      consoleSpy.mockRestore();
      mockJwt.authorize = originalAuthorize;
    });
  });

  describe("read", () => {
    it("should read and process sheet data correctly", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("simple.key")
            .mockReturnValueOnce("Simple Value")
            .mockReturnValueOnce("Valeur Simple")
            .mockReturnValueOnce("Valor Simple"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.read(0);

      expect(result).toEqual({
        en: {
          simple: {
            key: "Simple Value",
          },
        },
        fr: {
          simple: {
            key: "Valeur Simple",
          },
        },
        es: {
          simple: {
            key: "Valor Simple",
          },
        },
      });
    });

    it("should handle multi-level nested keys", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("services.marketing.social.optimize")
            .mockReturnValueOnce("Optimize Social")
            .mockReturnValueOnce("Optimiser Social")
            .mockReturnValueOnce("Optimizar Social"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.read(0);

      expect(result).toEqual({
        en: {
          services: {
            marketing: {
              social: {
                optimize: "Optimize Social",
              },
            },
          },
        },
        fr: {
          services: {
            marketing: {
              social: {
                optimize: "Optimiser Social",
              },
            },
          },
        },
        es: {
          services: {
            marketing: {
              social: {
                optimize: "Optimizar Social",
              },
            },
          },
        },
      });
    });

    it("should handle empty rows gracefully", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("") // Clé vide
            .mockReturnValueOnce("Value")
            .mockReturnValueOnce("Valeur")
            .mockReturnValueOnce("Valor"),
        },
        {
          get: jest
            .fn()
            .mockReturnValueOnce(undefined) // Clé undefined
            .mockReturnValueOnce("Another Value")
            .mockReturnValueOnce("Autre Valeur")
            .mockReturnValueOnce("Otro Valor"),
        },
        {
          get: jest
            .fn()
            .mockReturnValueOnce("valid.key")
            .mockReturnValueOnce("Valid Value")
            .mockReturnValueOnce("Valeur Valide")
            .mockReturnValueOnce("Valor Válido"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.read(0);

      // Seule la ligne avec une clé valide doit être traitée
      expect(result).toEqual({
        en: {
          valid: {
            key: "Valid Value",
          },
        },
        fr: {
          valid: {
            key: "Valeur Valide",
          },
        },
        es: {
          valid: {
            key: "Valor Válido",
          },
        },
      });
    });

    it("should handle empty values correctly", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("test.key")
            .mockReturnValueOnce("Has Value")
            .mockReturnValueOnce("") // Valeur vide
            .mockReturnValueOnce("   "), // Valeur avec espaces
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.read(0);

      expect(result).toEqual({
        en: {
          test: {
            key: "Has Value",
          },
        },
        fr: {
          test: {
            key: undefined,
          },
        },
        es: {
          test: {
            key: undefined,
          },
        },
      });
    });
  });

  describe("readByName", () => {
    it("should read sheet by name successfully", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("dashboard.stats")
            .mockReturnValueOnce("Stats")
            .mockReturnValueOnce("Statistiques")
            .mockReturnValueOnce("Estadísticas"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.readByName("dashboard");

      expect(result).toEqual({
        en: {
          dashboard: {
            stats: "Stats",
          },
        },
        fr: {
          dashboard: {
            stats: "Statistiques",
          },
        },
        es: {
          dashboard: {
            stats: "Estadísticas",
          },
        },
      });
    });

    it("should throw error for non-existent sheet", async () => {
      await expect(sheetManager.readByName("nonexistent")).rejects.toThrow(
        'Sheet with name "nonexistent" not found'
      );
    });
  });

  describe("readAllSheets", () => {
    it("should read all sheets successfully", async () => {
      const mockRows = [
        {
          get: jest
            .fn()
            .mockReturnValueOnce("test.key")
            .mockReturnValueOnce("Test")
            .mockReturnValueOnce("Test FR")
            .mockReturnValueOnce("Test ES"),
        },
      ];

      mockSheet.getRows.mockResolvedValue(mockRows);

      const result = await sheetManager.readAllSheets();

      expect(result).toHaveProperty("translations");
      expect(result.translations).toEqual({
        en: { test: { key: "Test" } },
        fr: { test: { key: "Test FR" } },
        es: { test: { key: "Test ES" } },
      });
    });

    it("should handle errors in individual sheets", async () => {
      const originalLoadHeaderRow = mockSheet.loadHeaderRow;
      mockSheet.loadHeaderRow = jest
        .fn()
        .mockRejectedValue(new Error("Sheet error"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await sheetManager.readAllSheets();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error processing sheet "translations":',
        expect.any(Error)
      );
      expect(result).toEqual({});

      // Restaurer les mocks
      consoleSpy.mockRestore();
      mockSheet.loadHeaderRow = originalLoadHeaderRow;
    });
  });

  describe("write", () => {
    const mockData = {
      en: { test: { key: "value" } },
      fr: { test: { key: "valeur" } },
    };

    beforeEach(() => {
      mockedFs.existsSync.mockReturnValue(false);
    });

    it("should create directory if it does not exist", () => {
      sheetManager.write(mockData, "./output");

      expect(mockedFs.mkdirSync).toHaveBeenCalledWith("./output", {
        recursive: true,
      });
    });

    it("should write files for each language", () => {
      sheetManager.write(mockData, "./output");

      expect(mockedFs.writeFile).toHaveBeenCalledTimes(2);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        "./output/en.json",
        JSON.stringify(mockData.en, null, 2),
        expect.any(Function)
      );
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        "./output/fr.json",
        JSON.stringify(mockData.fr, null, 2),
        expect.any(Function)
      );
    });

    it("should write files without sheet prefix", () => {
      sheetManager.write(mockData, "./output");

      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        "./output/en.json",
        JSON.stringify(mockData.en, null, 2),
        expect.any(Function)
      );
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        "./output/fr.json",
        JSON.stringify(mockData.fr, null, 2),
        expect.any(Function)
      );
    });

    it("should handle file write errors", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockedFs.writeFile.mockImplementation((path, data, callback: any) => {
        callback(new Error("Write failed"));
      });

      sheetManager.write(mockData, "./output");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error writing file ./output/en.json:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("listSheets", () => {
    it("should return list of sheet titles", async () => {
      const mockSheet2 = { title: "dashboard" };
      // Utiliser Object.defineProperty pour modifier la propriété readonly
      Object.defineProperty(mockDoc, "sheetsByIndex", {
        value: [mockSheet, mockSheet2],
        writable: true,
        configurable: true,
      });

      const result = await sheetManager.listSheets();

      expect(result).toEqual(["translations", "dashboard"]);
    });
  });

  describe("readLocal", () => {
    it("should read JSON files from directory", () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json", "fr.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ greeting: "Hello" }))
        .mockReturnValueOnce(JSON.stringify({ greeting: "Bonjour" }));

      const result = sheetManager.readLocal("./translations");

      expect(result).toEqual({
        en: { greeting: "Hello" },
        fr: { greeting: "Bonjour" },
      });
    });

    it("should throw if directory does not exist", () => {
      mockedFs.existsSync.mockReturnValue(false);

      expect(() => sheetManager.readLocal("./nonexistent")).toThrow(
        "Directory not found: ./nonexistent"
      );
    });

    it("should ignore non-JSON files", () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json", "readme.txt"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ key: "value" }));

      const result = sheetManager.readLocal("./translations");

      expect(result).toEqual({
        en: { key: "value" },
      });
    });
  });

  describe("push", () => {
    it("should push local JSON data to Google Sheets", async () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json", "fr.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ greeting: "Hello", nav: { home: "Home" } }))
        .mockReturnValueOnce(JSON.stringify({ greeting: "Bonjour", nav: { home: "Accueil" } }));

      mockSheet.clear = jest.fn().mockResolvedValue(undefined);
      mockSheet.setHeaderRow = jest.fn().mockResolvedValue(undefined);
      mockSheet.addRows = jest.fn().mockResolvedValue(undefined);

      await sheetManager.push("./translations");

      expect(mockSheet.clear).toHaveBeenCalled();
      expect(mockSheet.setHeaderRow).toHaveBeenCalledWith(["key", "en", "fr"]);
      expect(mockSheet.addRows).toHaveBeenCalledWith([
        { key: "greeting", en: "Hello", fr: "Bonjour" },
        { key: "nav.home", en: "Home", fr: "Accueil" },
      ]);
    });

    it("should create a new sheet if sheetName does not exist", async () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ hello: "Hello" }));

      const newSheet = {
        title: "NewSheet",
        clear: jest.fn().mockResolvedValue(undefined),
        setHeaderRow: jest.fn().mockResolvedValue(undefined),
        addRows: jest.fn().mockResolvedValue(undefined),
      };

      mockDoc.addSheet = jest.fn().mockResolvedValue(newSheet);

      await sheetManager.push("./translations", "NewSheet");

      expect(mockDoc.addSheet).toHaveBeenCalledWith({ title: "NewSheet" });
      expect(newSheet.clear).toHaveBeenCalled();
      expect(newSheet.addRows).toHaveBeenCalledWith([
        { key: "hello", en: "Hello" },
      ]);
    });

    it("should warn when no JSON files found", async () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue([]);

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      await sheetManager.push("./translations");

      expect(consoleSpy).toHaveBeenCalledWith("No JSON files found in directory");
      consoleSpy.mockRestore();
    });
  });

  describe("sync", () => {
    beforeEach(() => {
      mockSheet.clear = jest.fn().mockResolvedValue(undefined);
      mockSheet.setHeaderRow = jest.fn().mockResolvedValue(undefined);
      mockSheet.addRows = jest.fn().mockResolvedValue(undefined);
    });

    it("should sync local and remote data with merge strategy", async () => {
      // Remote has: greeting = "Hello" / "Bonjour"
      const mockRows = [
        {
          get: jest.fn()
            .mockReturnValueOnce("greeting")
            .mockReturnValueOnce("Hello")
            .mockReturnValueOnce("Bonjour")
            .mockReturnValueOnce(""),
        },
      ];
      mockSheet.getRows.mockResolvedValue(mockRows);

      // Local has: greeting + farewell
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json", "fr.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ greeting: "Hi", farewell: "Bye" }))
        .mockReturnValueOnce(JSON.stringify({ greeting: "Salut", farewell: "Au revoir" }));

      mockedFs.writeFile.mockImplementation((_path, _data, callback: any) => {
        callback(null);
      });

      const result = await sheetManager.sync("./translations");

      expect(result.languages).toContain("en");
      expect(result.languages).toContain("fr");
      expect(result.added.local).toBe(1); // farewell is new to remote
      expect(mockSheet.clear).toHaveBeenCalled();
      expect(mockSheet.addRows).toHaveBeenCalled();
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it("should use remote strategy when specified", async () => {
      const mockRows = [
        {
          get: jest.fn()
            .mockReturnValueOnce("greeting")
            .mockReturnValueOnce("Hello")
            .mockReturnValueOnce("Bonjour")
            .mockReturnValueOnce("Hola"),
        },
      ];
      mockSheet.getRows.mockResolvedValue(mockRows);

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ greeting: "Hi" }));

      mockedFs.writeFile.mockImplementation((_path, _data, callback: any) => {
        callback(null);
      });

      const result = await sheetManager.sync("./translations", { strategy: "remote" });

      // With remote strategy, remote value wins
      expect(result.languages.length).toBeGreaterThan(0);
      expect(mockSheet.addRows).toHaveBeenCalled();
    });

    it("should throw if sheet not found and createSheet is false", async () => {
      await expect(
        sheetManager.sync("./translations", { sheetName: "nonexistent" })
      ).rejects.toThrow('Sheet "nonexistent" not found');
    });

    it("should create sheet when createSheet is true", async () => {
      const newSheet = {
        title: "NewSheet",
        clear: jest.fn().mockResolvedValue(undefined),
        setHeaderRow: jest.fn().mockResolvedValue(undefined),
        addRows: jest.fn().mockResolvedValue(undefined),
        loadHeaderRow: jest.fn().mockResolvedValue(undefined),
        headerValues: [],
        rowCount: 0,
        getRows: jest.fn().mockResolvedValue([]),
      };

      mockDoc.addSheet = jest.fn().mockResolvedValue(newSheet);

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(["en.json"]);
      (mockedFs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({ hello: "Hello" }));

      mockedFs.writeFile.mockImplementation((_path, _data, callback: any) => {
        callback(null);
      });

      const result = await sheetManager.sync("./translations", {
        sheetName: "NewSheet",
        createSheet: true,
      });

      expect(mockDoc.addSheet).toHaveBeenCalledWith({ title: "NewSheet" });
      expect(result.added.local).toBe(1);
    });
  });
});
