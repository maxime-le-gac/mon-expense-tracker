# CHANGELOG-ARTEFACTS — mon-expense-tracker

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
