# INTENT-002-saisie-et-liste-depenses

**Auteur** : Maxime Le Gac (maxime.le-gac@conserto.pro)
**Date** : 2026-05-26
**Statut** : done

---

## POURQUOI MAINTENANT
L'application n'existe pas encore en tant qu'outil fonctionnel. Sans la saisie et la visualisation des dépenses, elle n'a aucune valeur utilisable.

## POUR QUI
L'utilisateur unique local — une personne qui veut saisir ses dépenses depuis un navigateur et les retrouver immédiatement pour vérifier la saisie.

## OBJECTIF
Permettre de saisir une dépense (montant, catégorie, date, description optionnelle) via un formulaire web et visualiser la liste complète des dépenses enregistrées sur la même interface. Métrique : une dépense saisie apparaît dans la liste sans action supplémentaire après soumission du formulaire.

## CONTRAINTES
- Stack imposée : Node.js/Express, SQLite via `better-sqlite3` (API synchrone)
- Pas d'authentification — utilisateur local unique
- Pas de framework frontend — Vanilla JS uniquement
- Validation obligatoire : montant (nombre positif non nul), date (format YYYY-MM-DD)

## CRITÈRE DE DRIFT
L'implémentation dérive si la dépense saisie n'apparaît pas immédiatement dans la liste après soumission du formulaire — ou si le formulaire exige des champs au-delà de montant, catégorie, date et description optionnelle.

---

## SPECs liées
- [x] SPEC-002-saisie-et-liste-depenses
