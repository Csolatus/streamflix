# Captures du design responsive

Tests du design de StreamFlix sur 3 tailles d'écran (branche `cssNatif`).

| Appareil | Largeur | Premier écran | Page complète |
|---|---|---|---|
| Mobile | 375px | [1-mobile-375-accueil.png](1-mobile-375-accueil.png) | [1-mobile-375-page-complete.png](1-mobile-375-page-complete.png) |
| Tablette | 768px | [2-tablette-768-accueil.png](2-tablette-768-accueil.png) | [2-tablette-768-page-complete.png](2-tablette-768-page-complete.png) |
| Desktop | 1280px | [3-desktop-1280-accueil.png](3-desktop-1280-accueil.png) | [3-desktop-1280-page-complete.png](3-desktop-1280-page-complete.png) |

## Conditions de test

- Navigateur : Google Chrome, avec émulation de la taille d'écran (mode mobile activé pour 375px).
- Aucun débordement horizontal sur les 3 tailles : la largeur de la page est égale à celle de l'écran.
- Navigation au clavier vérifiée (touche Tab) : lien d'évitement, navigation, menu profil, cartes de films.
- Préférence système « réduire les animations » vérifiée : les animations sont coupées et tout le contenu reste visible.

## Ce qui change selon la taille

- **Mobile** : header sur 3 lignes, hero avec l'affiche en fond, grilles de films en carrousels horizontaux.
- **Tablette** : header collé en haut sur 2 lignes, hero avec fond flouté et affiche à droite, grilles de 3 colonnes, formulaire sur 2 colonnes.
- **Desktop** : header sur une ligne, grilles adaptatives (autant de colonnes que la largeur le permet).
