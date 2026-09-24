# StreamFlix

Plateforme de streaming fictive, réalisée dans le cadre du projet fil rouge (EFREI, conception et développement frontend).

## Branches

| Branche | Contenu |
|---|---|
| `main` | Version à jour |
| `cssNatif` | Version en CSS natif (sans framework) |
| `bootstrap-sass` | Migration vers Bootstrap 5.3 et SASS |

## Installation

Prérequis : [Node.js](https://nodejs.org/) (npm est inclus).

```bash
npm install      # installe le compilateur Sass (une seule fois)
npm run dev      # recompile css/style.css à chaque sauvegarde d'un fichier .scss
npm run build    # compile la version compressée, avec source map, pour la mise en ligne
```

Ouvrir ensuite `index.html` dans un navigateur, ou utiliser un serveur local (extension Live Server de VS Code, par exemple).

> Ne jamais modifier `css/style.css` à la main : il est généré depuis `scss/` et serait écrasé à la prochaine compilation.

## Technologies

- **HTML5** sémantique et accessible (ARIA, navigation au clavier, validé W3C)
- **Bootstrap 5.3.8**, chargé par CDN (CSS et JavaScript, avec vérification d'intégrité SRI)
- **SASS**, en architecture 7-1, compilé par `npm run build` ou `npm run dev`

Composants Bootstrap utilisés : navbar, collapse (menu hamburger), dropdown (menu profil), grille (`row` / `col-*`), cards, boutons, badges, modal, champs de formulaire.

## Architecture SASS (7-1)

```
scss/
├── utils/        variables (charte), fonctions, mixins : aucun CSS produit
├── vendors/      personnalisation de Bootstrap (variables --bs-*)
├── base/         reset, typographie, accessibilité, animations
├── layout/       header, hero, footer
├── components/   boutons, cartes, badges, navigation, recherche, formulaire, modal...
├── pages/        mise en page de l'accueil
├── themes/       thème sombre
└── style.scss    point d'entrée
```

- **Charte graphique** : `scss/utils/_variables.scss`. Toutes les couleurs, polices et tailles y sont définies : modifier une valeur à cet endroit suffit à la changer sur tout le site.
- **Personnaliser Bootstrap** : Bootstrap étant chargé par CDN, on ne recompile pas ses sources. On redéfinit ses variables CSS (`--bs-primary`, `--bs-body-color`, `--bs-btn-bg`...) à partir de nos variables SASS, dans `vendors/_bootstrap-custom.scss` et dans le partial de chaque composant.
- **Media queries** : `@include respond-to(md) { ... }`, avec les mêmes points de rupture que Bootstrap (`sm`, `md`, `lg`, `xl`, `xxl`).

## Captures

Voir [docs/captures](docs/captures/README.md) : rendu sur mobile, tablette et desktop.
