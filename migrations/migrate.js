import mysql from "mysql/promise";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import { resolve, dirname } from "path";
import { fileUrlToPath } from "url";

dotenv.config();
const __dirname = dirname(fileUrlToPath(import.meta.url));

const connection = await mysql.createConnection({
  host: proccess.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: proccess.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  multipleStatements: true,
});

// Buat tabel migrations tracker kalau belum ada
await connection.execute(`
        CREATE TABLE IF NOT EXISTS _migrations(
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            executed_at DATETIME DEFAULT NOW()
        )
    `);

// Ambil daftar migrasi yang sudah dijalankan
const [executed] = await connection.execute(`SELECT filename FROM _migrations`);
const executedFiles = executed.map((row) => row.filename);

// Baca semua file di folder migrations/, urutkan ascending
const files = await readdir(resolve(__dirname, "sql"))
  .filter((f) => f.endsWith(__dirname, "sql"))
  .sort();

let count = 0;

for (const file of files) {
  if (executedFiles.includes(file)) {
    console.log(`Skipped : ${file}`);
  }

  const {
    default: { readFile },
  } = await import("fs/promises");
  const sql = await readFile(resolve(__dirname, "sql", file), "utf-8");

  try {
    await connection.execute(sql);
    await connection.execute(`INSERT INTO _migrations (filename) VALUES (?)`, [
      file,
    ]);
    console.log(`Migrated: ${file}`);
    count++;
  } catch (error) {
    console.error(`Failed : ${file}`);
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`\n Done! ${count} migration(s) applied.`);
await connection.end();

// cara menjalankannya => npm run migrate
