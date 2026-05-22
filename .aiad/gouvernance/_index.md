# Gouvernance Tier 1 — mon-expense-tracker

| Agent | Fichier | Déclenché quand... |
|-------|---------|-------------------|
| AIAD-AI-ACT | AIAD-AI-ACT.md | Composant IA (ML, LLM, scoring) — non prévu au MVP |
| AIAD-RGPD | AIAD-RGPD.md | Traitement de données personnelles — dépenses financières |
| AIAD-RGAA | AIAD-RGAA.md | Toute interface utilisateur |
| AIAD-RGESN | AIAD-RGESN.md | Toute décision technique (perf, dépendances, ressources) |

## Notes MVP

- **RGPD** : données stockées localement, pas de cloud, usage solo → risque faible mais à vérifier si partage futur
- **RGAA** : formulaires et tableaux doivent être accessibles (labels, contrastes)
- **RGESN** : SQLite + Vanilla JS = choix sobre validé
