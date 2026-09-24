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
