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


// ===================================
// EXERCICE 5 : Modal
// ===================================
// Clic sur une carte (ou sur "Plus d'infos" du hero) -> la fenêtre de détails s'ouvre
// avec les informations du film cliqué.
// - Titre, affiche et métadonnées sont lus dans la carte cliquée (le DOM).
// - Synopsis, réalisation et casting ne figurent pas dans les cartes :
//   ils sont rangés ici, une fiche par titre.
// - La fenêtre est le modal Bootstrap #film-modal : on l'ouvre et on le ferme
//   avec son API (show / hide). Bootstrap gère Échap, le clic à l'extérieur
//   et garde le focus clavier dans la fenêtre tant qu'elle est ouverte.

const FILM_DETAILS = {
    'The Dark Knight': {
        synopsis: "Batman s'allie au commissaire Gordon et au procureur Harvey Dent pour démanteler le crime organisé à Gotham, jusqu'à l'arrivée du Joker, un criminel qui ne cherche qu'à semer le chaos.",
        director: 'Christopher Nolan',
        cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Gary Oldman'
    },
    'Interstellar': {
        synopsis: "Alors que la Terre devient inhabitable, un ancien pilote part avec une équipe d'explorateurs à travers un trou de ver, à la recherche d'une nouvelle planète pour l'humanité.",
        director: 'Christopher Nolan',
        cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine'
    },
    'Pulp Fiction': {
        synopsis: "Deux tueurs à gages, un boxeur, la femme d'un gangster et un couple de braqueurs : leurs histoires s'entrecroisent à Los Angeles, dans un récit volontairement désordonné.",
        director: 'Quentin Tarantino',
        cast: 'John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis'
    },
    'Inception': {
        synopsis: "Un voleur qui s'infiltre dans les rêves des autres pour voler leurs secrets découvre qu'il doit réaliser l'impossible : planter une idée plutôt que de la voler.",
        director: 'Christopher Nolan',
        cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy'
    },
    'The Matrix': {
        synopsis: "Un pirate informatique découvre que le monde qu'il connaît n'est qu'une simulation créée par des machines, et rejoint la résistance qui tente de libérer l'humanité.",
        director: 'Lana et Lilly Wachowski',
        cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving'
    },
    'Forrest Gump': {
        synopsis: "Assis sur un banc, un homme simple au grand cœur raconte sa vie hors du commun, traversée par les grands événements de l'histoire américaine.",
        director: 'Robert Zemeckis',
        cast: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field'
    }
};

const modalElement = document.querySelector('#film-modal');
const filmModal = bootstrap.Modal.getOrCreateInstance(modalElement);

// Élément qui a ouvert la fenêtre : il retrouvera le focus à la fermeture
let modalTrigger = null;

// source : l'élément qui contient les infos du film (une carte, ou le hero)
// trigger : l'élément cliqué (lien de la carte, bouton du hero)
function openModal(source, trigger) {
    const title = source.querySelector('h2, h3').textContent.trim();
    const poster = source.querySelector('img');
    const details = FILM_DETAILS[title];

    document.querySelector('#film-modal-title').textContent = title;
    document.querySelector('#film-modal-play-label').textContent = ' : ' + title;

    const modalPoster = document.querySelector('#film-modal-poster');
    modalPoster.src = poster.getAttribute('src');
    modalPoster.width = poster.getAttribute('width');
    modalPoster.height = poster.getAttribute('height');
    modalPoster.alt = 'Affiche du film ' + title;

    // Copie des métadonnées de la carte (année, durée, note, genres) :
    // cloneNode(true) duplique l'élément avec tout son contenu,
    // replaceChildren() remplace l'ancien contenu de la fenêtre par cette copie
    const meta = source.querySelector('.film-meta');
    document.querySelector('#film-modal-meta').replaceChildren(meta.cloneNode(true));

    // textContent (et non innerHTML) : le texte est inséré tel quel, jamais interprété comme du HTML
    if (details) {
        document.querySelector('#film-modal-synopsis').textContent = details.synopsis;
        document.querySelector('#film-modal-director').textContent = details.director;
        document.querySelector('#film-modal-cast').textContent = details.cast;
    }

    modalTrigger = trigger;
    filmModal.show();
}

function closeModal() {
    filmModal.hide();
}

// Cartes de films : le lien du titre couvre toute la carte (.stretched-link).
// preventDefault() : on ouvre la fenêtre au lieu de suivre le lien vers la fiche du film.
// Au clavier, la touche Entrée sur le lien déclenche aussi cet événement "click".
document.querySelectorAll('.film-card .stretched-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        openModal(link.closest('.film-card'), link);
    });
});

// Bouton "Plus d'infos" du hero : même fenêtre, avec les infos du film vedette
const moreInfoButton = document.querySelector('.btn-more-info');
moreInfoButton.addEventListener('click', function () {
    openModal(document.querySelector('.hero'), moreInfoButton);
});

// Croix et bouton "Fermer"
document.querySelectorAll('.modal-close').forEach(function (button) {
    button.addEventListener('click', closeModal);
});

// Une fois la fenêtre refermée (croix, Fermer, Échap ou clic à l'extérieur),
// le focus revient sur l'élément qui l'avait ouverte : l'utilisateur au clavier
// reprend là où il en était.
modalElement.addEventListener('hidden.bs.modal', function () {
    if (modalTrigger) {
        modalTrigger.focus();
    }
});
