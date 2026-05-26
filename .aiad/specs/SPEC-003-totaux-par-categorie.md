# SPEC-003-totaux-par-categorie

**Intent parent** : INTENT-003-totaux-par-categorie
**Auteur** : PE (Maxime Le Gac)
**Date** : 2026-05-26
**Statut** : done
**SQS** : 5/5

---

## 1. Contexte

L'utilisateur a saisi des dépenses mais n'a pas de vue agrégée pour contrôler son budget global mensuel. L'application dispose déjà d'une table `expenses` (id, amount, category, date, description) et d'une route `GET /` listant les dépenses. L'objectif est d'ajouter une page dédiée affichant les totaux par catégorie pour un mois donné.

## 2. Comportement Attendu

### Input

- Requête HTTP `GET /stats` avec paramètre optionnel `?month=YYYY-MM`
- Si `month` absent ou invalide → utiliser le mois courant (format `YYYY-MM` depuis `new Date()`)

> **Note Gate** : le titre "Totaux — mai 2026" doit être obtenu via `new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(month + '-01'))`. La soumission du sélecteur de mois se fait via un `<form method="get" action="/stats">` (pas de JS, conformité RGESN).

### Processing

1. Extraire le paramètre `month` de la query string ; valider via `isValidMonth(s)` : format `/^\d{4}-\d{2}$/` **et** plage de mois 01-12 (rejet de `2026-13`)
2. Si invalide ou absent, calculer le mois courant : `new Date().toISOString().slice(0, 7)`
3. Appeler `getTotalsByCategory(month)` dans le modèle :
   ```sql
   SELECT category, SUM(amount) AS total
   FROM expenses
   WHERE strftime('%Y-%m', date) = ?
   GROUP BY category
   ORDER BY total DESC
   ```
   avec le paramètre `month` (ex. `'2026-05'`) — convention `strftime` du codebase (voir AGENT-GUIDE)
4. Calculer le grand total : somme de tous les `total` retournés
5. Passer à la vue : `{ rows, grandTotal, month }`

### Output

- Rendu EJS `stats.ejs` affichant :
  - Titre de la page avec le mois sélectionné (ex. `Totaux — mai 2026`)
  - Sélecteur de mois (input `<input type="month">`) pré-rempli avec `month`
  - Tableau : Catégorie | Total (€)
  - Ligne de total général en bas du tableau
  - Message "Aucune dépense pour ce mois" si `rows` est vide
  - Lien retour vers `/`

### Cas limites

1. **Aucune dépense pour le mois sélectionné** → afficher un message vide, pas d'erreur
2. **Paramètre `month` avec format invalide** (ex. `?month=abc`, `?month=2026-13`) → rediriger silencieusement vers le mois courant
3. **Toutes les dépenses dans une seule catégorie** → tableau à une ligne, grand total = ce total
4. **Montants à virgule flottante** → afficher avec 2 décimales (`.toFixed(2)`)
5. **Catégorie avec caractères spéciaux** → affichée telle quelle, pas d'échappement supplémentaire (EJS gère l'XSS via `<%=`)

## 3. Critères d'Acceptation

- [ ] `GET /stats` sans paramètre affiche les totaux du mois courant
- [ ] `GET /stats?month=2026-04` affiche les totaux d'avril 2026
- [ ] `GET /stats?month=invalid` affiche les totaux du mois courant (fallback silencieux)
- [ ] Si aucune dépense sur le mois : message "Aucune dépense pour ce mois" visible
- [ ] Le grand total affiché est égal à la somme des totaux par catégorie
- [ ] Les totaux sont triés du plus élevé au plus bas
- [ ] Un lien retour vers `/` est présent dans la page
- [ ] Le sélecteur de mois permet de naviguer vers un autre mois (soumission via `GET /stats`)

## 4. Interface / API

**Nouvelle fonction modèle** (`src/models/expense.js`) :
```js
function getTotalsByCategory(month) {
  // month: 'YYYY-MM'
  // returns: [{ category: string, total: number }, ...]
  return db.prepare(
    "SELECT category, SUM(amount) AS total FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY category ORDER BY total DESC"
  ).all(month);
}
```

**Nouvelle route** (`src/routes/expenses.js`) :
```
GET /stats[?month=YYYY-MM]
→ render('stats', { rows, grandTotal, month })
```

**Nouvelle vue** : `src/views/stats.ejs`

## 5. Dépendances

- `src/models/expense.js` — ajout de `getTotalsByCategory`
- `src/routes/expenses.js` — ajout du handler `GET /stats`
- `src/views/stats.ejs` — nouveau fichier à créer
- `public/style.css` — réutiliser les styles existants, aucune règle CSS spécifique requise
- Aucune migration de schéma (données déjà en base)

## 6. Estimation Context Engineering Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~200 tokens
- Cette SPEC : ~600 tokens
- `src/models/expense.js` (~33 lignes) : ~100 tokens
- `src/routes/expenses.js` (~43 lignes) : ~120 tokens
- `src/views/index.ejs` (référence style) : ~150 tokens
- **Total estimé** : ~1 170 tokens

*Modèle cible : Sonnet 4.6 (200k effectifs) — budget largement dans les limites.*

## 7. Definition of Output Done (DoOD)

- [ ] `getTotalsByCategory(month)` ajoutée dans `src/models/expense.js` et exportée
- [ ] Route `GET /stats` ajoutée dans `src/routes/expenses.js`
- [ ] Vue `src/views/stats.ejs` créée avec tableau, grand total, sélecteur de mois et lien retour
- [ ] Fallback mois courant fonctionnel (paramètre absent ou invalide)
- [ ] Vérification manuelle : démarrer `npm start`, naviguer sur `/stats`, vérifier les cas limites 1 à 5
- [ ] SPEC mise à jour si écart constaté pendant l'implémentation (Drift Lock)
- [ ] Gouvernance RGAA vérifiée : tableau avec en-têtes `<th scope="col">`, lien retour accessible
- [ ] Gouvernance RGESN vérifiée : pas de dépendance JS supplémentaire, rendu server-side uniquement
