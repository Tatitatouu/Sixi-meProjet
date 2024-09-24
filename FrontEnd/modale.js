document.addEventListener('DOMContentLoaded', function() {
    const openModaleBtn = document.getElementById('openModale');
    const closeModaleBtn = document.getElementById('closeModale');
    const modale = document.getElementById('modale');

    // Ouvre la modale au clic du bouton "modifier"
    openModaleBtn.addEventListener('click', function() {
        modale.classList.add('active');
    });

    // Ferme la modale au clic du bouton "fermer"
    closeModaleBtn.addEventListener('click', function() {
        modale.classList.remove('active');
    });
});