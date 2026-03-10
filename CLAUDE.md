# ZLV Taxe sur la Vacance - Projet

## 📋 À propos du projet
Projet concernant la taxe sur la vacance. Stack : Vite + TypeScript + PostCSS.

## 🏗️ Structure du projet
```
.
├── src/                          # Code source principal
│   ├── app/                      # Composants React
│   ├── utils/                    # Utilitaires (moteur recherche, etc.)
│   ├── data/                     # Données (communes.ts)
│   └── styles/                   # CSS/styles
├── dist/                         # Fichiers compilés
├── guidelines/                   # Guides et documentation
├── clevercloud/                  # Configuration déploiement CleverCloud
├── package.json                  # Dépendances
├── vite.config.ts               # Configuration Vite
├── tsconfig.json                # Configuration TypeScript
├── postcss.config.mjs           # Configuration PostCSS
└── index.html                   # Point d'entrée
```

## 🛠️ Stack technique
- **Framework** : Vite (bundler)
- **Langage** : TypeScript
- **Styling** : PostCSS
- **Package manager** : pnpm (basé sur pnpm-lock.yaml)
- **Déploiement** : CleverCloud
- **Design System** : DSFR (Système de Design de l'État Français)
  - Vue.js compatible via `vue-ds`

## 📚 Ressources DSFR (CONTRAINTE IMPORTANTE)
- **Documentation officielle** : https://www.systeme-de-design.gouv.fr/version-courante/fr
- **Storybook (composants)** : https://www.systeme-de-design.gouv.fr/v1.14/storybook/index.html
- **Doc Vue.js** : https://docs.vue-ds.fr/guide/pour-commencer

⚠️ **RÈGLE** : Toujours utiliser les composants DSFR pour l'UI

## 📝 Conventions de travail
- Commits explicites avec messages clairs
- Branches pour les features/fixes
- Code TypeScript bien typé
- Suivre les patterns existants dans le projet

## 🚀 Optimisations apportées
### Module de recherche (v1)
- **Moteur de recherche indexé** (`communeSearch.ts`)
  - Map par INSEE code → O(1) lookup
  - Index par nom (prefix, exact, partial) → recherche rapide
  - Singleton pattern pour une seule instance en mémoire
  - Priorise : exact INSEE → exact nom → prefix → partial
- **Composant SearchBar optimisé**
  - `useMemo` pour filteredCommunes (évite re-calcul)
  - `useCallback` pour handleSelectCommune et handleSearch
  - Mémorisation des résultats et des callback
- **Initialisation**
  - `initializeSearchEngine()` appelé au démarrage (main.tsx)
  - Crée l'index une seule fois avec les 30k+ communes

## 🔄 Mise à jour de ce fichier
Ce fichier sera mis à jour régulièrement pour refléter :
- Les décisions d'architecture
- Les patterns établis
- Les conventions spécifiques du projet
- Les apprentissages clés et dépendances
