# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Always source nvm before running npm commands
source ~/.nvm/nvm.sh && npm start        # Start the Express server (port 3000 by default)
source ~/.nvm/nvm.sh && npm install      # Install dependencies
```

No test runner or linter is configured yet. No build step required.

## Architecture

Node.js/Express server with server-side rendering via EJS templates. SQLite database (`data/expenses.db`) accessed synchronously via `better-sqlite3`. No frontend framework — Vanilla JS only.

**Request flow:** Express route → model function (better-sqlite3 prepared statement) → EJS template render.

**Planned structure** (from `.aiad/ARCHITECTURE.md` — not all files exist yet):

```
src/
├── app.js              ← Express entry point
├── routes/expenses.js  ← CRUD routes
├── models/expense.js   ← SQLite queries
└── views/
    ├── index.ejs       ← Monthly list + category totals
    └── add.ejs         ← Add expense form
public/style.css
data/expenses.db        ← gitignored
```

**Routes:**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Current month list + category totals |
| GET | `/?month=YYYY-MM` | Filtered by month |
| GET | `/add` | Add expense form |
| POST | `/add` | Save expense |
| POST | `/delete/:id` | Delete expense |

**DB schema:**

```sql
CREATE TABLE expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  amount      REAL    NOT NULL,
  category    TEXT    NOT NULL,
  date        TEXT    NOT NULL,   -- YYYY-MM-DD
  description TEXT
);
```

## Key constraints

- Always use `better-sqlite3` synchronous API — no callbacks, no promises
- Always use prepared statements — never string-concatenate SQL
- Validate: amount (positive non-zero number), date (YYYY-MM-DD format)
- No authentication — single local user only
- Node.js LTS ≥ 18 required

## SDD Mode

This project follows the SDD cycle (`.aiad/` directory). Read `.aiad/AGENT-GUIDE.md` at session start. Do not implement features without a validated SPEC (SQS ≥ 4/5).
