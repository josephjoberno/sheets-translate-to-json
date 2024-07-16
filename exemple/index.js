import { SheetManager } from "../dist/index.js";
import creds from "./secret.json" assert { type: "json" };

const sheetManager = new SheetManager(
  creds.private_key,
  creds.client_email,
  creds.sheet_id
);

sheetManager.init("./translation");


