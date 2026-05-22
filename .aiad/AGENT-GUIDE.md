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

*(vide au démarrage)*

## Human Learnings

*(vide au démarrage)*

## État courant

- Phase : MVP en cours
- SPECs actives : aucune (SPEC-001 done)
- SPECs complétées : SPEC-001 Hello World (validée 2026-05-21)
- Prochaine étape : `/sdd-intent` pour capturer l'intention MVP (CRUD dépenses)
