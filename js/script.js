/* ==========================================================================
   StreamFlix - Script principal
   Chargé avec "defer" (voir index.html) : il s'exécute une fois tout le HTML lu,
   donc les éléments existent déjà quand on les sélectionne avec querySelector.
   ========================================================================== */


// ===================================
// EXERCICE 1 : Afficher/masquer sections
// ===================================
// Chaque section de films a un bouton .btn-section-toggle.
// Son attribut aria-controls contient l'id de la grille qu'il pilote.

const sectionToggles = document.querySelectorAll('.btn-section-toggle');

sectionToggles.forEach(function (button) {
    button.addEventListener('click', function () {
        const grid = document.getElementById(button.getAttribute('aria-controls'));

        // toggle() ajoute la classe si elle est absente, la retire sinon,
        // et renvoie true si la classe est présente après l'appel
        const isHidden = grid.classList.toggle('hidden');

        // Texte visible du bouton : on ne modifie que le <span>, pour garder
        // le complément caché lu par les lecteurs d'écran (" : Tendances actuelles")
        button.querySelector('.section-toggle-label').textContent = isHidden ? 'Afficher' : 'Masquer';

        // État annoncé aux lecteurs d'écran (et utilisé par le CSS pour la flèche)
        button.setAttribute('aria-expanded', String(!isHidden));
    });
});


// ===================================
// EXERCICE 2 : Compteur de films
// ===================================
// Au chargement : on compte les cartes de films (<article class="film-card">)
// et on affiche le total dans le footer, dans un paragraphe créé en JavaScript.

const filmCount = document.querySelectorAll('article.film-card').length;

const catalogCount = document.createElement('p');
catalogCount.className = 'catalog-count';
// Accord au singulier si le catalogue ne contient qu'un film
catalogCount.textContent = 'Catalogue : ' + filmCount + (filmCount > 1 ? ' films disponibles' : ' film disponible');

document.querySelector('.footer-legal').appendChild(catalogCount);


// ===================================
// EXERCICE 3 : Films vus
// ===================================
// Chaque carte a un bouton "Vu" (.btn-watched). Au clic, la carte reçoit
// ou perd la classe .watched : le CSS affiche alors le badge "✓ Vu".
// Un même film peut apparaître dans plusieurs sections (Inception, Interstellar...) :
// on met à jour toutes ses cartes, pour qu'il soit "vu" partout.

const watchedButtons = document.querySelectorAll('.btn-watched');

watchedButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        // event.target : l'élément réellement cliqué.
        // closest() remonte les parents jusqu'à trouver la carte qui le contient.
        const clickedCard = event.target.closest('.film-card');
        const title = clickedCard.querySelector('.card-title').textContent;

        // Nouvel état : l'inverse de l'état actuel de la carte cliquée
        const isWatched = !clickedCard.classList.contains('watched');

        document.querySelectorAll('.film-card').forEach(function (card) {
            if (card.querySelector('.card-title').textContent === title) {
                // toggle(classe, force) : ajoute si force vaut true, retire si false
                card.classList.toggle('watched', isWatched);
                // État du bouton bascule, annoncé aux lecteurs d'écran ("activé" / "désactivé")
                card.querySelector('.btn-watched').setAttribute('aria-pressed', String(isWatched));
            }
        });
    });
});


// ===================================
// EXERCICE 4 : Recherche
// ===================================
// À chaque frappe dans le champ de recherche du header, on filtre les films.
// Adaptations par rapport au code de base de l'énoncé :
//  - le champ s'appelle #search-input (id déjà utilisé par son <label>) ;
//  - on masque la colonne (<li>) qui contient la carte, pas l'<article> seul :
//    sinon la colonne vide resterait dans la grille Bootstrap et laisserait un trou ;
//  - on cherche dans le titre ET les genres, sans tenir compte des majuscules ni des accents ;
//  - une section sans aucun résultat est masquée entièrement.

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const searchStatus = document.querySelector('#search-status');

// Met un texte en minuscules et retire les accents : "Épopée" -> "epopee"
// (normalize('NFD') sépare chaque lettre de son accent, puis on supprime les accents)
function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function filterFilms() {
    const searchTerm = normalizeText(searchInput.value);
    let resultCount = 0;

    document.querySelectorAll('.film-section').forEach(function (section) {
        let sectionResults = 0;

        section.querySelectorAll('.film-card').forEach(function (card) {
            const title = card.querySelector('.card-title').textContent;
            const genres = card.querySelector('.genre-list').textContent;
            const isMatch = normalizeText(title + ' ' + genres).includes(searchTerm);

            // Colonne masquée si le film ne correspond pas
            card.closest('li').classList.toggle('hidden', !isMatch);

            if (isMatch) {
                sectionResults++;
            }
        });

        section.classList.toggle('hidden', sectionResults === 0);
        resultCount += sectionResults;
    });

    // Message annoncé aux lecteurs d'écran (role="status") et affiché sous le hero.
    // textContent (et non innerHTML) : le texte tapé par l'utilisateur est affiché tel quel,
    // jamais interprété comme du HTML.
    const typedText = searchInput.value.trim();
    if (searchTerm === '') {
        searchStatus.textContent = '';
    } else if (resultCount === 0) {
        searchStatus.textContent = 'Aucun résultat pour « ' + typedText + ' ».';
    } else {
        searchStatus.textContent = resultCount + (resultCount > 1 ? ' résultats' : ' résultat') + ' pour « ' + typedText + ' ».';
    }
}

// "input" : déclenché à chaque caractère tapé ou effacé (y compris avec la croix du champ)
searchInput.addEventListener('input', filterFilms);

// Touche Entrée ou bouton "Rechercher" : pas de rechargement de la page,
// on referme le menu mobile et on fait défiler jusqu'aux résultats.
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    filterFilms();

    const mainMenu = document.querySelector('#main-menu');
    if (mainMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(mainMenu).hide();
    }

    searchStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
