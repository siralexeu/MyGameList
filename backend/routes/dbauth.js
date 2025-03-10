const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creează sau deschide baza de date
const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Eroare la conectarea la baza de date:', err);
  } else {
    console.log('Conectat la baza de date SQLite');
  }
});

// Creează tabela users dacă nu există
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
});

module.exports = db;
