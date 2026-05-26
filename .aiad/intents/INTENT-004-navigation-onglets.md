# INTENT-004-navigation-onglets

**Auteur** : Maxime Le Gac
**Date** : 2026-05-26
**Statut** : done

---

## POURQUOI MAINTENANT
Les pages de l'application n'ont pas de liens entre elles et l'interface n'est pas assez soignée visuellement.

## POUR QUI
L'utilisateur unique de l'interface web.

## OBJECTIF
L'utilisateur peut naviguer entre les fonctionnalités (ajout de dépense, liste, totaux par catégorie) via des onglets visibles sur toutes les pages, et l'interface est plus agréable à utiliser.

## CONTRAINTES
- Pas de nouveau framework JS ni CSS
- Les onglets doivent fonctionner sans JavaScript (liens HTML natifs)

## CRITÈRE DE DRIFT
Si les onglets cassent la navigation sans JS activé, ou si l'implémentation introduit une dépendance JS pour le routage.

---

## SPECs liées
- [x] [SPEC-004-navigation-onglets](../specs/SPEC-004-navigation-onglets.md)
