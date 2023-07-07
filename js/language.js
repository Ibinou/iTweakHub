// Fonction pour charger les traductions
function loadTranslations(language) {
  fetch(`languages/${language}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('home').innerText = data.home;
      document.getElementById('wb').innerText = data.wb;
      document.getElementById('featured').innerText = data.featured;
      document.getElementById('ra').innerText = data.ra;
      document.getElementById('username-display').innerText = data.username-display;
      document.getElementById('getbtn').innerText = data.getbtn;
      document.getElementById('nat').innerText = data.nat;
      document.getElementById('signed').innerText = data.signed;
      document.getElementById('revoked').innerText = data.revoked;
    });
}

// Fonction pour changer la langue
function changeLanguage(language) {
  loadTranslations(language);
  localStorage.setItem('language', language);
}

// Vérifie si la langue est déjà enregistrée dans le local storage
var savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
  changeLanguage(savedLanguage);
} else {
  // Chargement initial des traductions (langue par défaut)
  changeLanguage('en');
}

// Fonction pour changer la langue en anglais
document.getElementById('btn-en').addEventListener('click', function() {
  changeLanguage('en');
});

// Fonction pour changer la langue en français
document.getElementById('btn-fr').addEventListener('click', function() {
  changeLanguage('fr');
});
