# SPEC-002-saisie-et-liste-depenses

**Intent parent** : INTENT-002
**Auteur** : PE (Maxime Le Gac)
**Date** : 2026-05-26
**Statut** : done
**SQS** : 5/5 (post-corrections Gate)

---

## 1. Contexte

L'application est actuellement au stade hello-world (SPEC-001 terminée) : Express démarre et répond 200 sur `/`. Il n'existe aucune couche métier, aucun modèle de données, aucune vue.

Cette SPEC implémente le MVP fonctionnel minimal : saisir une dépense via un formulaire web et la retrouver immédiatement dans la liste complète. Pas de filtrage, pas de suppression — uniquement la boucle saisie → persistance → visualisation.

## 2. Comportement Attendu

### Input

**Formulaire `POST /add`** :
| Champ | Type | Contraintes |
|-------|------|-------------|
| `amount` | number | Nombre positif strictement (> 0), obligatoire |
| `category` | text | Non vide, obligatoire — champ texte libre (`<input type="text">`) |
| `date` | text | Format YYYY-MM-DD, obligatoire |
| `description` | text | Optionnel, peut être vide ou absent |

### Processing

1. `src/app.js` : initialise Express avec EJS comme moteur de rendu, `express.urlencoded({ extended: false })` pour parser les body de formulaire, fichiers statiques depuis `public/`, et monte le router `routes/expenses.js` à la racine.
2. `src/models/expense.js` :
   - À l'import, ouvre/crée `data/expenses.db` via `better-sqlite3`
   - Exécute `CREATE TABLE IF NOT EXISTS expenses (...)` au démarrage
   - Expose deux fonctions synchrones :
     - `getAll()` → retourne toutes les dépenses triées par date DESC
     - `add({ amount, category, date, description })` → insère et retourne l'id généré
3. `GET /` : appelle `getAll()`, rend `views/index.ejs` avec le tableau des dépenses
4. `GET /add` : rend `views/add.ejs` (formulaire vide)
5. `POST /add` :
   - Valide `amount` (parsé en float, doit être > 0 et être un nombre fini)
   - Valide `date` (regex `/^\d{4}-\d{2}-\d{2}$/`)
   - Valide `category` (non vide après trim)
   - Si validation KO → re-rend `add.ejs` avec **toutes** les erreurs accumulées (pas seulement la première) et valeurs pré-remplies. Chaque erreur correspond à un champ invalide, affichées dans un bloc en tête de formulaire.
   - Si validation OK → appelle `add()`, redirige vers `GET /` (PRG pattern)

### Output

- `GET /` → page HTML listant toutes les dépenses (id, date, category, amount, description)
- `GET /add` → page HTML avec formulaire de saisie
- `POST /add` valide → redirect 302 vers `/`
- `POST /add` invalide → page HTML avec message d'erreur explicite et champs pré-remplis

### Cas limites

1. **`amount` = 0 ou négatif** → erreur « Le montant doit être un nombre positif »
2. **`amount` = "abc" ou vide** → erreur « Le montant doit être un nombre positif »
3. **`date` mal formatée** (ex. `26/05/2026`, `2026/05/26`) → erreur « La date doit être au format YYYY-MM-DD » — Note MVP : la validation est format-uniquement (regex) ; les dates calendrièrement invalides (`2026-13-01`) sont acceptées et stockées telles quelles.
4. **`category` vide ou espaces seuls** → erreur « La catégorie est obligatoire »
5. **Base de données inexistante** → créée automatiquement au démarrage (CREATE TABLE IF NOT EXISTS)
6. **Liste vide** → `index.ejs` affiche « Aucune dépense enregistrée » plutôt qu'un tableau vide

## 3. Critères d'Acceptation

- [ ] `npm start` démarre sans erreur avec les nouveaux fichiers en place
- [ ] `GET /` répond 200 et affiche la liste (vide si aucune dépense)
- [ ] `GET /add` répond 200 et affiche le formulaire
- [ ] Soumission valide : la dépense apparaît dans `GET /` sans action supplémentaire (redirect immédiat)
- [ ] Soumission invalide (amount = -1) : la page `add.ejs` est re-rendue avec un message d'erreur visible et les champs pré-remplis
- [ ] Soumission invalide (date = "toto") : idem
- [ ] Soumission invalide (category vide) : idem
- [ ] Le fichier `data/expenses.db` est créé automatiquement s'il n'existe pas
- [ ] La liste est triée par date décroissante

## 4. Interface / API

```js
// src/models/expense.js
getAll()
// → [{ id, amount, category, date, description }, ...]  — trié date DESC

add({ amount, category, date, description })
// → { id }  — id généré par SQLite AUTOINCREMENT
```

```
Routes Express :
GET  /        → render index.ejs  { expenses: [] }
GET  /add     → render add.ejs    { error: null, values: {} }
POST /add     → redirect /  |  render add.ejs { error: string, values: {} }
```

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  amount      REAL    NOT NULL,
  category    TEXT    NOT NULL,
  date        TEXT    NOT NULL,
  description TEXT
);
```

## 5. Dépendances

- SPEC-001 (hello-world) — terminée, `src/app.js` existant à modifier
- `better-sqlite3` — déjà dans `package.json` (à vérifier)
- `ejs` — à installer si absent
- Dossier `data/` — à créer (gitignored pour `*.db`)
- Dossier `public/` — à créer pour `style.css`

## 6. Estimation Context Engineering Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~500 tokens
- ARCHITECTURE (résumé condensé) : ~300 tokens
- Cette SPEC : ~600 tokens
- `src/app.js` actuel (13 lignes) : ~100 tokens
- **Total estimé** : ~1 500 tokens

**Fenêtre disponible (Sonnet 4.6)** : 200k tokens — seuil opérationnel 60 % ≈ 120k tokens. Budget largement dans les normes.

## 7. Definition of Output Done (DoOD)

- [ ] `src/app.js` mis à jour (EJS, body-parser, router, static)
- [ ] `src/routes/expenses.js` créé
- [ ] `src/models/expense.js` créé (DB init + getAll + add)
- [ ] `src/views/index.ejs` créé (liste + état vide)
- [ ] `src/views/add.ejs` créé (formulaire + affichage erreur + pré-remplissage)
- [ ] `public/style.css` créé (style minimal fonctionnel)
- [ ] `data/` gitignored pour `*.db`
- [ ] SPEC mise à jour si écart découvert (Drift Lock)
- [ ] Gouvernance RGAA vérifiée (interface utilisateur — labels, contraste, structure sémantique)
- [ ] Gouvernance RGESN vérifiée (pas de dépendances inutiles, rendu server-side)
