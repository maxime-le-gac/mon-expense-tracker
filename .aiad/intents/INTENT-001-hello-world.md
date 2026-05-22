# INTENT-001-hello-world

**Auteur** : Maxime Le Gac (maxime.le-gac@conserto.pro)
**Date** : 2026-05-21
**Statut** : done

---

## POURQUOI MAINTENANT
Avant de développer les vraies fonctionnalités, vérifier que le serveur Node.js/Express démarre et répond correctement.

## POUR QUI
Le développeur (usage interne, vérification technique).

## OBJECTIF
`npm start` démarre sans erreur et GET `/` retourne une réponse HTTP 200 visible dans le navigateur.

## CONTRAINTES
Pas de base de données, pas de vues complexes — juste la preuve que Express tourne.

## CRITÈRE DE DRIFT
L'implémentation dérive si elle va au-delà d'une réponse "Hello World" (connexion DB, templates EJS, logique métier).

---

## SPECs liées
- [x] SPEC-001-hello-world
