const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'expenses.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    amount      REAL    NOT NULL,
    category    TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    description TEXT
  )
`);

function getAll() {
  return db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
}

function add({ amount, category, date, description }) {
  const stmt = db.prepare(
    'INSERT INTO expenses (amount, category, date, description) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(amount, category, date, description || null);
  return { id: result.lastInsertRowid };
}

function getTotalsByCategory(month) {
  return db.prepare(
    "SELECT category, SUM(amount) AS total FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY category ORDER BY total DESC"
  ).all(month);
}

module.exports = { getAll, add, getTotalsByCategory };
