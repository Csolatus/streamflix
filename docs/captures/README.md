# Captures du design responsive

Version **Bootstrap 5 + SASS** (branche `bootstrap-sass`). La version en CSS natif reste disponible sur la branche `cssNatif`.

| Appareil | Largeur | Premier écran | Page complète |
|---|---|---|---|
| Mobile | 375px | [1-mobile-375-accueil.png](1-mobile-375-accueil.png) | [1-mobile-375-page-complete.png](1-mobile-375-page-complete.png) |
| Tablette | 768px | [2-tablette-768-accueil.png](2-tablette-768-accueil.png) | [2-tablette-768-page-complete.png](2-tablette-768-page-complete.png) |
| Desktop | 1280px | [3-desktop-1280-accueil.png](3-desktop-1280-accueil.png) | [3-desktop-1280-page-complete.png](3-desktop-1280-page-complete.png) |

Composants interactifs :

- [4-mobile-375-menu-ouvert.png](4-mobile-375-menu-ouvert.png) : menu hamburger (collapse Bootstrap) ouvert sur mobile
- [5-desktop-1280-modal.png](5-desktop-1280-modal.png) : fenêtre « Plus d'infos » (modal Bootstrap)

## Conditions de test

- Navigateur : Google Chrome, avec émulation de la taille d'écran (mode mobile activé pour 375px).
- Aucun débordement horizontal sur les 3 tailles : la largeur de la page est égale à celle de l'écran.
- Survol testé avec une vraie souris sur les 17 éléments interactifs : tous réagissent.
- Navigation au clavier : lien d'évitement, navbar, menu profil, cartes de films, modal (focus placé dans la fenêtre, touche Échap, focus rendu au bouton).
- Préférence système « réduire les animations » : les animations sont coupées et tout le contenu reste visible.

## Ce qui change selon la taille

Les points de rupture sont ceux de Bootstrap : `md` (768px) et `lg` (992px).

- **Mobile** : menu hamburger, hero avec l'affiche en fond, grilles de films en carrousels horizontaux (`col-5`).
- **Tablette** (`md`) : hero avec fond flouté et affiche à droite, grilles de 3 colonnes (`col-sm-4`), formulaire sur 2 colonnes.
- **Desktop** (`lg`) : navbar dépliée sur une ligne, grilles de 4 colonnes (`col-lg-3`), 6 genres par ligne dans le formulaire.
