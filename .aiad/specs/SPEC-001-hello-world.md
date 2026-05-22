# SPEC-001-hello-world

**Intent parent** : INTENT-001
**Auteur** : PE (Claude Code)
**Date** : 2026-05-21
**Statut** : done
**SQS** : 5/5 — Gate OUVERTE (2026-05-21)

---

## 1. Contexte

Vérifier que le serveur Node.js/Express démarre et répond correctement avant de développer les vraies fonctionnalités. Scope minimal : aucune DB, aucune vue, aucune logique métier.

## 2. Comportement Attendu

### Input
- Commande : `npm start`
- Requête : `GET /`

### Processing
1. Initialiser un projet Node.js (`package.json`)
2. Installer Express comme unique dépendance
3. Créer `src/app.js` : serveur Express minimal
4. Déclarer une route `GET /` retournant "Hello World"
5. Démarrer le serveur sur le port 3000 (configurable via `PORT` env)

### Output
- HTTP 200 OK
- Body : `Hello World`
- Console : `Server running on port 3000`

### Cas limites
1. Port déjà utilisé → `EADDRINUSE` propagé naturellement par Node
2. Variable `PORT` non définie → fallback sur `3000`
3. Route inexistante (`GET /foo`) → 404 par défaut Express

## 3. Critères d'Acceptation

- [x] `npm install` s'exécute sans erreur
- [x] `npm start` démarre le serveur et affiche le message de confirmation en console
- [x] `GET http://localhost:3000/` retourne HTTP 200 avec le texte "Hello World"
- [x] Ctrl+C arrête proprement le serveur

## 4. Interface / API

```
GET / → 200 "Hello World"
```

## 5. Dépendances

- `express` (npm, dernière version stable)
- Node.js LTS ≥ 18

## 6. Estimation Context Engineering Budget

| Élément | Tokens estimés |
|---------|---------------|
| AGENT-GUIDE (condensé) | ~300 |
| Cette SPEC | ~400 |
| Fichiers source | 0 (création ex nihilo) |
| **Total estimé** | **~700** |

< 1 % du budget Sonnet 4.6 (200k tokens).

## 7. Definition of Output Done (DoOD)

- [x] `package.json` créé avec script `start: "node src/app.js"`
- [x] `src/app.js` créé avec Express minimal
- [x] `npm start` fonctionne et `GET /` retourne HTTP 200
- [x] SPEC mise à jour si écart constaté (Drift Lock) — aucun écart
- [x] Gouvernance RGESN : dépendance Express justifiée (framework standard, sobre)
