# ARCHITECTURE — mon-expense-tracker

> Décisions techniques. Maintenu par le Tech Lead.

## Stack technique

| Couche | Technologie | Raison |
|--------|------------|--------|
| Runtime | Node.js LTS | Choix utilisateur |
| Framework web | Express.js | Minimaliste, standard Node.js |
| Base de données | SQLite via `better-sqlite3` | Fichier local, zéro infra, backup = copie |
| Frontend | HTML/CSS/Vanilla JS | Sobriété, pas de build step pour MVP |
| Template engine | EJS | Simple, intégré Express |

## Structure du projet

```
mon-expense-tracker/
├── src/
│   ├── app.js              ← Point d'entrée Express
│   ├── routes/
│   │   └── expenses.js     ← Routes CRUD dépenses
│   ├── models/
│   │   └── expense.js      ← Modèle SQLite
│   └── views/
│       ├── index.ejs           ← Liste mensuelle
│       ├── add.ejs             ← Formulaire ajout
│       ├── stats.ejs           ← Totaux par catégorie
│       └── partials/
│           └── nav.ejs         ← Barre de navigation commune
├── public/
│   └── style.css
├── data/
│   └── expenses.db         ← Fichier SQLite (gitignored)
├── package.json
└── .aiad/
```

## Modèle de données

```sql
CREATE TABLE expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  amount      REAL    NOT NULL,
  category    TEXT    NOT NULL,
  date        TEXT    NOT NULL,   -- ISO 8601 YYYY-MM-DD
  description TEXT
);
```

## Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste du mois courant + totaux par catégorie |
| GET | `/?month=YYYY-MM` | Liste filtrée par mois |
| GET | `/add` | Formulaire d'ajout |
| POST | `/add` | Enregistrer une dépense |
| GET | `/stats` | Totaux par catégorie (mois courant) |
| GET | `/stats?month=YYYY-MM` | Totaux par catégorie filtrés par mois |
| POST | `/delete/:id` | Supprimer une dépense |

## Décisions architecturales

| Décision | Raison | Alternative rejetée |
|----------|--------|---------------------|
| SQLite | Zéro infra, fichier local, backup = copie | PostgreSQL (trop lourd pour usage solo) |
| Vanilla JS | Pas de build step, MVP rapide | React/Vue (overkill pour MVP) |
| EJS | Server-side rendering, zéro complexité | SPA (complexité inutile) |
| Express | Standard Node.js, minimal | Fastify (moins courant) |
| better-sqlite3 | API synchrone, plus simple | node-sqlite3 (callbacks) |

## Contraintes

- Démarrage : `npm start`
- Pas d'authentification au MVP
- Données locales uniquement (pas de cloud)
- Compatible Node.js LTS (≥ 18)

## Résumé condensé (Context Engineering — max 500 tokens)

Stack: Node.js + Express + SQLite (better-sqlite3) + EJS. CRUD expenses. Routes: GET `/` liste+filtres mois, GET/POST `/add` formulaire, POST `/delete/:id`. DB locale `data/expenses.db`. Modèle: id, amount, category, date (YYYY-MM-DD), description. Pas d'auth MVP. Vanilla JS frontend, pas de build step.
