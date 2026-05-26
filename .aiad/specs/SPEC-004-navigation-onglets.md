# SPEC-004-navigation-onglets

**Intent parent** : INTENT-004-navigation-onglets
**Auteur** : PE (Maxime Le Gac)
**Date** : 2026-05-26
**Statut** : done
**SQS** : 5/5

---

## 1. Contexte

Les trois pages de l'application (`/`, `/add`, `/stats`) sont isolées — pas de navigation commune entre elles. L'utilisateur doit connaître les URLs ou utiliser les liens texte ad-hoc. L'objectif est d'ajouter une barre de navigation avec onglets visible sur toutes les pages, fonctionnelle sans JavaScript, et d'améliorer la cohérence visuelle globale.

## 2. Comportement Attendu

### Input

- Aucun input HTTP supplémentaire. La barre de navigation est statique, rendue server-side.
- Chaque vue reçoit une variable `activePage` (string) indiquant l'onglet actif : `'list'`, `'add'`, `'stats'`.

### Processing

1. Créer `src/views/partials/nav.ejs` — partial EJS contenant la barre de navigation
2. Modifier les 3 vues pour inclure le partial : `<%- include('partials/nav', { activePage: '...' }) %>`
3. Supprimer les liens texte de navigation ad-hoc désormais redondants (voir Output)
4. Ajouter les règles CSS de la barre de navigation dans `public/style.css`

### Output

**Partial `src/views/partials/nav.ejs`** :
```html
<nav class="nav" aria-label="Navigation principale">
  <a href="/" class="<%= activePage === 'list' ? 'active' : '' %>">Mes dépenses</a>
  <a href="/add" class="<%= activePage === 'add' ? 'active' : '' %>">Ajouter</a>
  <a href="/stats" class="<%= activePage === 'stats' ? 'active' : '' %>">Totaux</a>
</nav>
```

**Modifications des vues** :

| Vue | `activePage` | Lien à supprimer |
|-----|-------------|-----------------|
| `index.ejs` | `'list'` | `<a href="/add" class="btn">+ Ajouter une dépense</a>` |
| `add.ejs` | `'add'` | `<a href="/">← Retour à la liste</a>` |
| `stats.ejs` | `'stats'` | `<a href="/">← Retour à la liste</a>` |

Le partial est placé dans `<body>` juste avant `<main>`.

**CSS à ajouter dans `public/style.css`** :
```css
.nav {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 2px;
  padding-top: 1rem;
}

.nav a {
  padding: 0.5rem 1.2rem;
  text-decoration: none;
  color: #555;
  background: #e8e8e8;
  border-radius: 6px 6px 0 0;
  font-size: 0.95rem;
}

.nav a:hover {
  background: #d4d4d4;
  color: #333;
}

.nav a.active {
  background: #fff;
  color: #0066cc;
  font-weight: 600;
  box-shadow: 0 -2px 0 #0066cc inset;
}
```

### Cas limites

1. **JavaScript désactivé** → les onglets sont de simples `<a href>` — la navigation fonctionne normalement
2. **Page active = onglet courant** → l'onglet actif a la classe `active` (style distinctif), pas de double navigation
3. **Nouvelle page future** → ajouter simplement un `<a>` dans `nav.ejs` et une valeur `activePage` — pas de changement global
4. **Affichage mobile (viewport < 400px)** → `display: flex` adapte les onglets en ligne, les labels courts ("Mes dépenses", "Ajouter", "Totaux") restent lisibles

## 3. Critères d'Acceptation

- [ ] La barre de navigation est visible sur les 3 pages (`/`, `/add`, `/stats`)
- [ ] Cliquer sur "Mes dépenses" navigue vers `/`
- [ ] Cliquer sur "Ajouter" navigue vers `/add`
- [ ] Cliquer sur "Totaux" navigue vers `/stats`
- [ ] L'onglet correspondant à la page courante a la classe `active` (style visuellement distinct)
- [ ] La navigation fonctionne avec JavaScript désactivé dans le navigateur
- [ ] Les liens texte ad-hoc (`← Retour à la liste`, bouton `+ Ajouter une dépense` de l'index) sont supprimés
- [ ] La barre de navigation a un `aria-label="Navigation principale"`
- [ ] Aucune régression sur les formulaires existants (ajout dépense, sélecteur de mois)

## 4. Interface / API

**Fichier à créer** : `src/views/partials/nav.ejs`

**Fichiers à modifier** :
- `src/views/index.ejs` — ajouter include, supprimer bouton, passer `activePage: 'list'`
- `src/views/add.ejs` — ajouter include, supprimer lien retour, passer `activePage: 'add'`
- `src/views/stats.ejs` — ajouter include, supprimer lien retour, passer `activePage: 'stats'`
- `public/style.css` — ajouter section `.nav`

**Aucune modification** requise dans `src/routes/expenses.js` ni `src/models/expense.js`.

## 5. Dépendances

- `src/views/index.ejs`, `src/views/add.ejs`, `src/views/stats.ejs` — vues existantes
- `public/style.css` — feuille de style existante
- EJS include natif — pas de dépendance supplémentaire

## 6. Estimation Context Engineering Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~200 tokens
- Cette SPEC : ~500 tokens
- `src/views/index.ejs` : ~80 tokens
- `src/views/add.ejs` : ~130 tokens
- `src/views/stats.ejs` : ~100 tokens
- `public/style.css` : ~180 tokens
- **Total estimé** : ~1 190 tokens

*Modèle cible : Sonnet 4.6 — budget très largement sous les limites.*

## 7. Definition of Output Done (DoOD)

- [ ] `src/views/partials/nav.ejs` créé avec les 3 liens et gestion de la classe `active`
- [ ] Les 3 vues incluent le partial avec la bonne valeur `activePage`
- [ ] Les liens ad-hoc redondants supprimés dans les 3 vues
- [ ] CSS `.nav` ajouté dans `public/style.css`
- [ ] Vérification manuelle : naviguer sur les 3 pages, vérifier l'onglet actif sur chacune
- [ ] Test JS désactivé : la navigation fonctionne
- [ ] Aucune régression sur les fonctionnalités existantes (ajout, liste, stats)
- [ ] SPEC mise à jour si écart (Drift Lock)
- [ ] Gouvernance RGAA : `aria-label` sur `<nav>`, onglets accessibles au clavier
- [ ] Gouvernance RGESN : zéro JS ajouté, CSS minimaliste
