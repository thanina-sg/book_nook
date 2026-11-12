const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  // Create Books table
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      genre TEXT,
      price REAL,
      stock INTEGER
    )
  `);

  // Seed default admin (admin / admin123)
  db.run(`
    INSERT OR IGNORE INTO users (id, username, password, role)
    VALUES (1, 'admin', 'admin123', 'admin')
  `);

  // Seed sample books
  db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO books (title, author, genre, price, stock) VALUES (?, ?, ?, ?, ?)");
      stmt.run("The Shadow of the Wind", "Carlos Ruiz Zafón", "Fiction", 14.99, 12);
      stmt.run("Dune", "Frank Herbert", "Sci-Fi", 18.50, 8);
      stmt.run("Pride and Prejudice", "Jane Austen", "Classic", 9.99, 15);
      stmt.finalize();
    }
  });
});

module.exports = db;