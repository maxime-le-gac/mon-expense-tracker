# INTENT-005-tests-unitaires

**Auteur** : maxime.le-gac@conserto.pro
**Date** : 2026-05-27
**Statut** : done

---

## POURQUOI MAINTENANT
Le projet ne dispose d'aucun test unitaire. L'absence totale de filet de sécurité expose l'équipe au risque de régressions silencieuses à chaque évolution du code.

## POUR QUI
L'équipe de développement — les développeurs qui font évoluer le projet ont besoin de confiance dans leurs changements.

## OBJECTIF
Atteindre un taux de couverture de code ≥ 50 % avec une suite de tests unitaires qui passent entièrement en CI (aucun test en échec, aucun test skipé sans justification).

## CONTRAINTES
- Stack Node.js LTS ≥ 18, Vanilla JS, pas de TypeScript
- Runner : **Jest** avec couverture de code intégrée
- Librairie `better-sqlite3` (API synchrone) — les tests de modèles doivent utiliser une DB in-memory ou un fichier temporaire
- Périmètre : `src/models/expense.js` et `src/routes/expenses.js` uniquement — les vues EJS sont hors périmètre

## CRITÈRE DE DRIFT
L'implémentation a dérivé si :
- La couverture mesurée passe sous 50 % sur les modules `src/models/` et `src/routes/`
- Des tests sont en échec ou marqués `.skip` sans commentaire justificatif
- Le runner de tests n'est pas intégré dans les scripts `package.json` (commande `npm test` doit fonctionner)

---

## SPECs liées
- [x] [SPEC-005-tests-unitaires](./../specs/SPEC-005-tests-unitaires.md)
