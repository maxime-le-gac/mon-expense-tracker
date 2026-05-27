# SPEC-005-tests-unitaires

**Intent parent** : INTENT-005-tests-unitaires
**Auteur** : PE
**Date** : 2026-05-27
**Statut** : done
**SQS** : 4/5

---

## 1. Contexte

Le projet n'a aucun test unitaire. L'équipe de développement a besoin d'un filet de sécurité contre les régressions. Objectif : couverture ≥ 50 % sur `src/models/expense.js` et `src/routes/expenses.js`, avec Jest comme runner, et `npm test` opérationnel.

## 2. Comportement Attendu

### Input

- Code source existant inchangé fonctionnellement (sauf les deux refactos listées ci-dessous)
- Commande : `npm test`

### Processing

**Refacto 1 — `src/app.js` (testabilité supertest)**

Séparer la création de l'app de son démarrage :

```js
// src/app.js
const app = express();
// ... configuration middleware et routes ...
module.exports = app;            // ← exporter l'app

// Démarrer uniquement si exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
```

**Refacto 2 — `src/models/expense.js` (DB in-memory pour tests)**

Remplacer le chemin hardcodé par :

```js
const DB_PATH = process.env.TEST_DB_PATH || path.join(dataDir, 'expenses.db');
const db = new Database(DB_PATH);
```

**Configuration Jest — `package.json`**

```json
"scripts": {
  "start": "node src/app.js",
  "test": "jest --coverage"
},
"jest": {
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "src/models/**/*.js",
    "src/routes/**/*.js"
  ],
  "coverageThreshold": {
    "global": { "lines": 50 }
  }
}
```

**Dépendances dev à ajouter :**
- `jest`
- `supertest`

**Structure des fichiers de tests :**

```
tests/
├── models/
│   └── expense.test.js
└── routes/
    └── expenses.test.js
```

**`tests/models/expense.test.js`**

Stratégie : DB in-memory via `TEST_DB_PATH=':memory:'` + `jest.resetModules()` pour isoler chaque describe.

```
beforeAll: process.env.TEST_DB_PATH = ':memory:', jest.resetModules(), re-require le modèle
afterAll: supprimer process.env.TEST_DB_PATH
```

Cas à couvrir :
- `getAll()` sur DB vide → retourne `[]`
- `getAll()` après 2 insertions → retourne 2 lignes ordonnées par date DESC
- `add({ amount, category, date, description })` → retourne `{ id }` avec id > 0
- `add()` avec `description` omise → s'insère sans erreur, description = null en base
- `getTotalsByCategory('2026-05')` avec données → retourne agrégats corrects
- `getTotalsByCategory('2099-01')` mois sans données → retourne `[]`

**`tests/routes/expenses.test.js`**

Stratégie : `jest.mock('../../src/models/expense')` + supertest sur l'app exportée.

```
jest.mock('../../src/models/expense') — mock automatique de getAll, add, getTotalsByCategory
beforeEach: réinitialiser les mocks
```

Cas à couvrir :
- `GET /` → 200, appelle `getAll()`
- `GET /add` → 200
- `POST /add` valide (amount=10, category=Food, date=2026-05-01) → redirect 302 vers `/`, appelle `add()`
- `POST /add` amount manquant → 200 (re-render), N'appelle PAS `add()`
- `POST /add` amount négatif (`-5`) → 200, N'appelle PAS `add()`
- `POST /add` amount zéro → 200, N'appelle PAS `add()`
- `POST /add` date malformée (`2026/05/01`) → 200, N'appelle PAS `add()`
- `POST /add` category vide → 200, N'appelle PAS `add()`
- `GET /stats` sans param → 200, appelle `getTotalsByCategory` avec le mois courant
- `GET /stats?month=2026-05` → 200, appelle `getTotalsByCategory('2026-05')`
- `GET /stats?month=invalid` → 200, fallback sur le mois courant

### Output

- Suite Jest qui passe à 100 % (zéro échec)
- Couverture ≥ 50 % en `lines` sur les deux modules ciblés
- `npm test` exécutable sans serveur démarré

### Cas limites

1. `better-sqlite3` avec `:memory:` — la DB est détruite quand le process se termine, pas entre les tests du même fichier : gérer l'isolation via `beforeEach` avec `DELETE FROM expenses`
2. `app.js` avec `require.main === module` — vérifier que supertest n'appelle pas `listen()` lors de l'import
3. Mock `getTotalsByCategory` dans les tests de routes — doit retourner `[]` par défaut pour éviter les erreurs de rendu EJS sur `rows.reduce`

## 3. Critères d'Acceptation

- [ ] `npm test` s'exécute sans erreur depuis la racine du projet
- [ ] Zéro test en échec, zéro test `.skip` sans commentaire justificatif
- [ ] Coverage report affiche ≥ 50 % en `lines` sur `src/models/expense.js`
- [ ] Coverage report affiche ≥ 50 % en `lines` sur `src/routes/expenses.js`
- [ ] `npm start` fonctionne toujours après les refactos (non-régression)
- [ ] Les 6 cas modèle et les 11 cas routes listés ci-dessus sont présents dans les fichiers de test

## 4. Interface / API

```
# Installation
npm install --save-dev jest supertest

# Exécution
npm test                          # tests + coverage
npm test -- --watchAll            # mode watch
npm test -- --coverage --verbose  # détail par fichier
```

```
# Rapport attendu (exemple)
PASS tests/models/expense.test.js
PASS tests/routes/expenses.test.js

----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
expense.js|   85.71 |    66.67 |  100.00 |   85.71 |
expenses.js|  72.41 |    60.00 |  100.00 |   72.41 |
----------|---------|----------|---------|---------|
```

## 5. Dépendances

- `better-sqlite3` ≥ 12.x (déjà installé) — supporte `:memory:` nativement
- `express` ≥ 4.x (déjà installé)
- `ejs` ≥ 6.x (déjà installé) — les vues doivent être trouvables par supertest (chemin relatif à `src/app.js`)
- SPEC-002 (modèle + routes fonctionnels) — prérequis implicite, déjà done

## 6. Estimation Context Engineering Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~300 tokens
- Cette SPEC : ~600 tokens
- `src/models/expense.js` : ~80 tokens
- `src/routes/expenses.js` : ~120 tokens
- `src/app.js` : ~40 tokens
- `package.json` : ~30 tokens
- **Total estimé** : ~1 170 tokens

> Bien en dessous du seuil opérationnel Sonnet 4.6 (140k tokens effectifs). Aucune compression nécessaire.

## 7. Definition of Output Done (DoOD)

- [ ] `src/app.js` refactorisé (export app + listen conditionnel)
- [ ] `src/models/expense.js` refactorisé (support `TEST_DB_PATH`)
- [ ] `jest` et `supertest` ajoutés en `devDependencies`
- [ ] Config Jest ajoutée dans `package.json` avec seuil de couverture à 50 %
- [ ] `tests/models/expense.test.js` créé et couvre les 6 cas listés
- [ ] `tests/routes/expenses.test.js` créé et couvre les 11 cas listés
- [ ] `npm test` passe entièrement
- [ ] `npm start` non-régressé
- [ ] SPEC mise à jour si écart constaté (Drift Lock)
- [ ] Gouvernance : RGESN (dépendances dev légères, pas d'impact runtime) — pas de veto attendu
