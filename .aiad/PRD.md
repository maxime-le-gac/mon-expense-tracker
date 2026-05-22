# PRD — mon-expense-tracker

> Vision produit. Maintenu par le PM. Ne contient pas de "comment" technique.

## Vision

Un tracker de dépenses personnelles minimaliste et personnalisable, permettant à un individu de reprendre le contrôle de ses finances sans dépendre d'outils tiers imposant leurs catégories et workflows.

## Problème

Les outils existants manquent de personnalisation : catégories fixes, interfaces surchargées, dépendances cloud non maîtrisées. L'utilisateur veut un outil qui lui ressemble, hébergé localement.

## Cible

Utilisateur individuel, à l'aise avec la technique, souhaitant héberger sa propre solution.

## Périmètre MVP

### Fonctionnalités incluses

1. **Ajouter une dépense** — montant, catégorie, date, description optionnelle
2. **Lister les dépenses par mois** — vue chronologique filtrée par mois
3. **Totaux par catégorie** — agrégats mensuels par catégorie
4. **Export CSV** - export CSV

### Hors périmètre MVP

- Authentification multi-utilisateurs
- Import bancaire automatique
- Notifications / alertes budget
- Application mobile

## Outcome Criteria

| Critère | Baseline | Cible | Méthode |
|---------|----------|-------|---------|
| Saisie d'une dépense | N/A | < 10 secondes | Test utilisateur |
| Consultation mensuelle | N/A | 1 clic depuis l'accueil | Test utilisateur |
| Démarrage local | N/A | `npm start` suffit | Test d'installation |

## Horizon

MVP : quelques jours
