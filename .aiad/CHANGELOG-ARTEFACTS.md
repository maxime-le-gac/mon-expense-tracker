# CHANGELOG-ARTEFACTS — mon-expense-tracker

## 2026-05-27 — Drift Lock SPEC-005

- SPEC-005-tests-unitaires : statut `in-progress` → `done`
- INTENT-005-tests-unitaires : statut `draft` → `done` (toutes SPECs liées complétées)
- specs/_index.md : SQS 4/5, statut SPEC-005 mis à jour
- intents/_index.md : statut INTENT-005 mis à jour
- AGENT-GUIDE.md : état courant mis à jour (SPEC-005 done, `npm test` listé)
- ARCHITECTURE.md : répertoire `tests/` ajouté dans la structure projet
- .gitignore : `coverage/` ajouté (répertoire généré par Jest)
- Fichiers créés : tests/models/expense.test.js, tests/routes/expenses.test.js, .aiad/intents/INTENT-005-tests-unitaires.md, .aiad/specs/SPEC-005-tests-unitaires.md
- Fichiers modifiés : src/app.js (export + listen conditionnel), src/models/expense.js (TEST_DB_PATH), package.json (jest config + devDeps)
- Drift corrigé avant lock : coverage/ absent du .gitignore ; tests/ absent de ARCHITECTURE.md
- Écart SPEC vs implémentation (non-bloquant) : expense.js utilise une IIFE pour le chemin DB au lieu de l'inline proposé dans la SPEC — approche meilleure car lazy evaluation, alignée avec l'intent
- Gouvernance RGESN : devDependencies uniquement (jest, supertest), aucun impact runtime — conforme
- Résultats tests : 17/17 PASS, couverture 100 % lignes sur models + routes (cible 50 %)

## 2026-05-26 — Drift Lock SPEC-004

- SPEC-004-navigation-onglets : statut `in-progress` → `done`
- INTENT-004-navigation-onglets : statut `draft` → `done` (toutes SPECs liées complétées)
- specs/_index.md : SQS 5/5, statut SPEC-004 mis à jour
- intents/_index.md : statut INTENT-004 mis à jour
- ARCHITECTURE.md : structure projet mise à jour (stats.ejs + partials/nav.ejs)
- AGENT-GUIDE.md : état courant mis à jour (SPEC-004 done, navigation onglets listée)
- Fichiers créés : src/views/partials/nav.ejs
- Fichiers modifiés : src/views/index.ejs, src/views/add.ejs, src/views/stats.ejs, public/style.css
- Drift corrigé avant lock : ARCHITECTURE.md manquait stats.ejs et partials/nav.ejs dans la structure projet
- Gouvernance RGAA : `<nav aria-label>`, liens texte descriptifs, navigable au clavier — conforme
- Gouvernance RGESN : zéro dépendance JS, CSS minimaliste (+31 lignes) — conforme

## 2026-05-26 — Drift Lock SPEC-003

- SPEC-003-totaux-par-categorie : statut `in-progress` → `done`
- INTENT-003-totaux-par-categorie : statut `draft` → `done` (toutes SPECs liées complétées)
- specs/_index.md : SQS 5/5, statut SPEC-003 mis à jour
- intents/_index.md : statut INTENT-003 mis à jour
- ARCHITECTURE.md : routes `GET /stats` et `GET /stats?month=YYYY-MM` ajoutées
- AGENT-GUIDE.md : Lessons Learned + état courant mis à jour
- Fichiers créés : src/views/stats.ejs, .aiad/intents/INTENT-003-totaux-par-categorie.md, .aiad/specs/SPEC-003-totaux-par-categorie.md
- Fichiers modifiés : src/models/expense.js (getTotalsByCategory), src/routes/expenses.js (GET /stats + isValidMonth)
- Drift corrigé avant lock : SQL `date LIKE ?` → `strftime('%Y-%m', date) = ?` (convention AGENT-GUIDE) ; validation `month` étendue à la plage 01-12
- Gouvernance RGAA : `<th scope="col/row">`, `<label for="month">`, lang="fr" — conforme
- Gouvernance RGESN : zéro dépendance JS ajoutée, rendu server-side uniquement — conforme

## 2026-05-26 — Drift Lock SPEC-002

- SPEC-002-saisie-et-liste-depenses : statut `in-progress` → `done`
- INTENT-002-saisie-et-liste-depenses : statut `draft` → `done` (toutes SPECs liées complétées)
- specs/_index.md : SQS 5/5, statut SPEC-002 mis à jour
- intents/_index.md : statut INTENT-002 mis à jour
- AGENT-GUIDE.md : état courant mis à jour (SPEC-002 done, fonctionnel disponible listé)
- Fichiers créés : src/routes/expenses.js, src/models/expense.js, src/views/index.ejs, src/views/add.ejs, public/style.css
- Fichiers modifiés : src/app.js, package.json, package-lock.json
- Correctif gouvernance : scope="col" ajouté sur <th> dans index.ejs (RGAA 4.1)
- Human Learning consigné : cohérence cas-limites ↔ méthode de validation dans les SPECs

## 2026-05-21 — Drift Lock SPEC-001

- SPEC-001-hello-world : statut `in-progress` → `done` (validation + drift check OK)
- INTENT-001-hello-world : statut `draft` → `done` (toutes SPECs liées complétées)
- specs/_index.md : statut SPEC-001 mis à jour
- intents/_index.md : statut INTENT-001 mis à jour
- AGENT-GUIDE.md : état courant mis à jour (SPEC-001 done, prochaine étape MVP CRUD)

## 2026-05-21 — Cadrage initial

- Création PRD.md — vision produit, 4 fonctionnalités MVP (dont export CSV)
- Création ARCHITECTURE.md — stack Node.js/Express/SQLite/EJS
- Création AGENT-GUIDE.md — contexte permanent agent
- Création gouvernance/_index.md — agents Tier 1 référencés
- Création intents/_index.md et specs/_index.md — index vides
