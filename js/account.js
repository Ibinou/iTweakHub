// Variables pour les éléments HTML
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
const usernameInput = document.getElementById('username');
const profilePictureInput = document.getElementById('profile-picture');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const usernameDisplay = document.getElementById('username-display');
const createAccountBtn = document.getElementById('create-account-btn');
const logoutBtn = document.getElementById('logout-btn');

// Fonction pour créer un cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Fonction pour récupérer la valeur d'un cookie
function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    if (cookiePair[0].trim() === name) {
      return cookiePair[1];
    }
  }
  return null;
}

// Fonction pour supprimer un cookie
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Vérifier si un cookie d'utilisateur existe
const usernameCookie = getCookie('username');
const profilePictureCookie = getCookie('profilePicture');

if (usernameCookie && profilePictureCookie) {
  // Afficher les informations du cookie
  profilePicturePreview.src = profilePictureCookie;
  usernameDisplay.textContent = usernameCookie;

  // Masquer la création de compte et afficher la page d'accueil
  loginContainer.style.display = 'none';
  mainContainer.style.display = 'block';
}

// Événement lors de la création du compte
createAccountBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const profilePicture = profilePictureInput.files[0];

  // Vérifier si un pseudo a été saisi
  if (username.trim() === '') {
    alert('Veuillez saisir un pseudo.');
    return;
  }

  // Enregistrer les informations dans les cookies
  setCookie('username', username, 7); // Le cookie expire après 7 jours
  setCookie('profilePicture', profilePicture.name, 7);

  // Enregistrer le chemin de l'image de profil dans le localStorage
  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem('profilePicture', reader.result);
  };
  reader.readAsDataURL(profilePicture);

  // Afficher les informations sur la page d'accueil
  profilePicturePreview.src = localStorage.getItem('profilePicture');
  usernameDisplay.textContent = username;

  // Afficher la page d'accueil et masquer la création de compte
  loginContainer.style.display = 'none';
  mainContainer.style.display = 'block';
});

// Événement lors de la déconnexion
logoutBtn.addEventListener('click', () => {
  // Supprimer les cookies
  deleteCookie('username');
  deleteCookie('profilePicture');

  // Supprimer le chemin de l'image de profil du localStorage
  localStorage.removeItem('profilePicture');

  // Réinitialiser les champs de saisie et les informations affichées
  usernameInput.value = '';
  profilePictureInput.value = '';
  profilePicturePreview.src = '';
  usernameDisplay.textContent = '';

  // Masquer la page d'accueil et afficher la création de compte
  loginContainer.style.display = 'flex';
  mainContainer.style.display = 'none';
});
