# Module de recherche TLV/THLV

Module de recherche pour vérifier si une commune est concernée par la **Taxe sur les Logements Vacants (TLV)** ou la **Taxe d'Habitation sur les Logements Vacants (THLV)**.

## 🎯 Fonctionnalités

- Recherche par nom de commune ou code INSEE
- Auto-complétion intelligente
- Affichage du type de taxe applicable (TLV, THLV ou aucune)
- Informations détaillées sur les conditions d'application
- Interface responsive et accessible

## 📊 Données

- **3 063 communes** soumises à la TLV (zones tendues)
- **6 410 communes** soumises à la THLV
- **25 402 communes** sans taxe spécifique
- **Total : 34 875 communes**

**Sources :**
- Décret du 22 décembre 2025 pour le zonage TLV
- Fichier officiel TLV/THLV avec codes INSEE
- Mapping des communes nouvelles 2019-2024 (176 correspondances)

**Note :** 4 codes INSEE du fichier source (0,04%) n'ont pas pu être mappés car obsolètes ou correspondant à des arrondissements.

Mise à jour : 19/01/2026

## 🚀 Installation

```bash
npm install
npm run dev
```

## 🏗️ Stack technique

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (icônes)

## 📝 Utilisation

1. Saisissez le nom d'une commune ou son code INSEE dans la barre de recherche
2. Sélectionnez la commune dans la liste d'auto-complétion
3. Consultez le résultat : TLV, THLV ou aucune taxe

## 🔗 Liens utiles

- [Service-Public.fr - TLV](https://www.service-public.fr/particuliers/vosdroits/F31922)
- [Impots.gouv.fr](https://www.impots.gouv.fr)

## 📄 Licence

MIT
