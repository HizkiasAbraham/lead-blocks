import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

// Re-export the DB type so it can be used in our public API
export type SqliteDatabase = Database.Database

// Lazy-initialised singleton instance
let db: SqliteDatabase | null = null

const getDatabasePath = () => {
  // Store SQLite file under backend/data/app.db
  const dbDir = path.join(__dirname, '..', '..', 'data')

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  return path.join(dbDir, 'app.db')
}

const createConnection = (): SqliteDatabase => {
  const dbPath = getDatabasePath()
  const instance = new Database(dbPath)

  // Enable foreign key constraints
  instance.pragma('foreign_keys = ON')

  // Example schema; adjust or extend as your app grows
  instance.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT,
      website TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company_id INTEGER,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)

  // Seed default admin user if table is empty
  const userCountRow = instance
    .prepare('SELECT COUNT(*) as count FROM users')
    .get() as { count: number }

  if (userCountRow.count === 0) {
    const hashedPassword = bcrypt.hashSync('Pass12@rd!', 10)

    const insertStmt = instance.prepare(
      'INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)',
    )
    insertStmt.run('admin@leadblocks.com', 'Laura', hashedPassword)
  }

  return instance
}

export const getDb = (): SqliteDatabase => {
  if (!db) {
    db = createConnection()
  }

  return db
}


