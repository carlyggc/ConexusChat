import sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const dbPath = join(process.cwd(), "src", "database", "database.db");
const schemaPath = join(process.cwd(), "src", "database", "schema.sql");

const db = new sqlite3.Database(dbPath);
const schema = readFileSync(schemaPath, "utf8");
db.exec(schema);

export default db;
