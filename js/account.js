// Variables pour les éléments HTML
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
const usernameInput = document.getElementById('username');
const profilePictureInput = document.getElementById('profile-picture');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const usernameDisplay = document.getElementById('username-display');
const createAccountBtn = document.getElementById('create-account-btn');
const logoutBtn = document.getElementById('logout-btn');

// Vérifier si l'utilisateur est déjà connecté
if (localStorage.getItem('username') && localStorage.getItem('profilePicture')) {
  const username = localStorage.getItem('username');
  const profilePicture = localStorage.getItem('profilePicture');

  // Afficher les informations sur la page d'accueil
  profilePicturePreview.src = profilePicture;
  usernameDisplay.textContent = username;

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

  // Enregistrer les informations dans le localStorage
  localStorage.setItem('username', username);

  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem('profilePicture', reader.result);

    // Afficher les informations sur la page d'accueil
    profilePicturePreview.src = reader.result;
    usernameDisplay.textContent = username;

    // Afficher la page d'accueil et masquer la création de compte
    loginContainer.style.display = 'none';
    mainContainer.style.display = 'block';
  };
  reader.readAsDataURL(profilePicture);
});

// Événement lors de la déconnexion
logoutBtn.addEventListener('click', () => {
  // Supprimer les informations du localStorage
  localStorage.removeItem('username');
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
