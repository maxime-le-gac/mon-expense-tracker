# AGENT-GUIDE — mon-expense-tracker

> Contexte permanent agent. Lire en début de chaque session.
> Dernière mise à jour : 2026-05-21

## Projet en 2 phrases

Tracker de dépenses personnelles minimaliste en Node.js/Express/SQLite. L'utilisateur est le seul utilisateur — pas d'auth, données locales, personnalisation maximale.

## Stack (référence rapide)

- **Runtime** : Node.js LTS (≥ 18)
- **Framework** : Express.js
- **DB** : SQLite via `better-sqlite3` (API synchrone)
- **Views** : EJS (server-side rendering)
- **Frontend** : Vanilla JS + CSS (pas de build step)

## Règles absolues

### TOUJOURS
- Valider les montants (nombre positif, non nul)
- Valider les dates (format YYYY-MM-DD)
- Utiliser `better-sqlite3` en mode synchrone (pas de callbacks)
- Utiliser des requêtes préparées (protection injection SQL)
- Retourner des messages d'erreur compréhensibles côté utilisateur

### JAMAIS
- Stocker des données sensibles (mots de passe, infos bancaires)
- Introduire des dépendances frontend lourdes (React, Vue, Angular) sans SPEC validée
- Faire des requêtes SQL sans paramètres préparés

## Vocabulaire métier

- **Dépense** (`expense`) : montant + catégorie + date + description optionnelle
- **Catégorie** : label libre défini par l'utilisateur (ex: "Alimentation", "Transport")
- **Vue mensuelle** : liste filtrée sur YYYY-MM + totaux par catégorie
- **Export CSV** : téléchargement des dépenses d'un mois au format CSV

## Conventions de code

```js
// Requête synchrone better-sqlite3
const stmt = db.prepare(
  'SELECT * FROM expenses WHERE strftime("%Y-%m", date) = ? ORDER BY date DESC'
);
const rows = stmt.all(month); // month = "2026-05"

// Totaux par catégorie
const totals = db.prepare(
  'SELECT category, SUM(amount) as total FROM expenses WHERE strftime("%Y-%m", date) = ? GROUP BY category'
).all(month);
```

## Fonctionnalités MVP confirmées

1. Ajouter une dépense (montant, catégorie, date, description)
2. Lister les dépenses par mois
3. Totaux par catégorie
4. Export CSV

## Environnement de dev

- Npm fonctionne dans mon terminal classique mais pas dans mes sessions, je veux que toutes mes sessions démarre en préfixant mes commandes avec source ~/.nvm/nvm.sh

## Lessons Learned

- **2026-05-26 — SPEC-003** : Dans `better-sqlite3`, les guillemets doubles `"..."` sont interprétés par SQLite comme des identifiants de colonne. Les formats `strftime` doivent être en guillemets simples : `strftime('%Y-%m', date)`, pas `strftime("%Y-%m", date)`. Toujours utiliser des templates JS (template literals ou concaténation) pour construire les requêtes avec la chaîne de format en simples quotes à l'intérieur.

## Human Learnings

- **2026-05-26 — SPEC-002** : Quand une SPEC liste une valeur dans les cas limites (ex. `2026-13-01`), s'assurer que la méthode de validation spécifiée (ici : regex format) est cohérente avec le cas. Si la valeur calendrière doit être validée, préciser explicitement « valider avec `new Date()` ou un parser ISO » plutôt que regex seule.

## État courant

- Phase : MVP en cours
- SPECs actives : aucune
- SPECs complétées : SPEC-001 Hello World (2026-05-21), SPEC-002 Saisie et liste dépenses (2026-05-26), SPEC-003 Totaux par catégorie (2026-05-26), SPEC-004 Navigation onglets (2026-05-26), SPEC-005 Tests unitaires (2026-05-27)
- Fonctionnel disponible : ajout dépense (POST /add) + liste complète (GET /) + totaux par catégorie (GET /stats) + navigation par onglets (partials/nav.ejs)
- Tests : Jest + supertest, 17 tests, couverture 100 % lignes sur models + routes (`npm test`)
- Prochaine étape : filtrage mensuel sur la liste, suppression de dépense ou export CSV
