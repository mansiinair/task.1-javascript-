import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "data.db");
sqlite3.verbose();
export const db = new sqlite3.Database(dbPath);

// Promise wrappers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function init() {
  await run(`PRAGMA foreign_keys = ON;`);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  // Seed some data
  const userCount = await get(`SELECT COUNT(*) as c FROM users;`);
  if ((userCount?.c ?? 0) === 0) {
    await run(`INSERT INTO users (name, avatar) VALUES
      ('Alice', 'https://i.pravatar.cc/48?img=1'),
      ('Bob', 'https://i.pravatar.cc/48?img=2'),
      ('Charlie', 'https://i.pravatar.cc/48?img=3')
    ;`);
  }

  const postCount = await get(`SELECT COUNT(*) as c FROM posts;`);
  if ((postCount?.c ?? 0) === 0) {
    await run(`INSERT INTO posts (user_id, content) VALUES
      (1, 'Hello world! This is my first post.'),
      (2, 'Just finished building a dashboard!'),
      (3, 'React + Express = ❤️')
    ;`);

    await run(`INSERT INTO comments (post_id, user_id, content) VALUES
      (1, 2, 'Welcome Alice!'),
      (1, 3, 'Let’s go!'),
      (2, 1, 'Cool stuff!')
    ;`);

    await run(`INSERT OR IGNORE INTO likes (user_id, post_id) VALUES
      (1,1),(2,1),(3,1),(2,2)
    ;`);
  }
}

// ✅ Export these so server.js can use them
export const queries = { run, all, get };
