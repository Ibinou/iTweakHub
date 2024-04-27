// Fonction pour charger et afficher les applications de manière paginée
async function chargerApplications(pageSize, pageNumber) {
  try {
    const response = await fetch('https://ibinou.github.io/iTweakHub/apps.json');
    const data = await response.json();

    // Pagination des données
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginatedApps = data.apps.slice(start, end);

    // Afficher les applications paginées
    afficherApplications(paginatedApps);

    // Stockage local des données pour une utilisation future
    localStorage.setItem('appsData', JSON.stringify(data.apps));

  } catch (error) {
    console.log('Error fetching or displaying apps:', error);
  }
}

// Vérification périodique des mises à jour du fichier JSON distant
setInterval(async () => {
  try {
    const response = await fetch('https://ibinou.github.io/iTweakHub/apps.json');
    const latestData = await response.json();
    const storedData = JSON.parse(localStorage.getItem('appsData')) || [];

    // Vérifier si les données locales sont obsolètes
    if (JSON.stringify(latestData.apps) !== JSON.stringify(storedData)) {
      // Mettre à jour les données locales avec la version la plus récente
      localStorage.setItem('appsData', JSON.stringify(latestData.apps));
      // Rafraîchir l'affichage si nécessaire
      filtrerApplications(); // Met à jour l'affichage en cas de changement
    }
  } catch (error) {
    console.log('Error checking for updates:', error);
  }
}, 60000); // Vérifier toutes les 60 secondes (ajustez selon vos besoins)

// Fonction pour afficher les applications
function afficherApplications(appsData) {
  const appListDiv = document.getElementById("appList");
  appListDiv.innerHTML = ''; // Effacer le contenu précédent

  appsData.forEach(function(appData) {
    const dockDiv = document.createElement("div");
    dockDiv.className = "dock";

    // Créer et ajouter les éléments HTML pour chaque application
    const appIconImg = document.createElement("img");
    appIconImg.className = "appicon";
    appIconImg.src = appData.iconURL || "https://github.com/Ibinou/iTweakHub/blob/main/img/blank.JPG?raw=true";
    dockDiv.appendChild(appIconImg);

    const appNameDiv = document.createElement("div");
    appNameDiv.className = "appname";
    appNameDiv.textContent = appData.name;
    dockDiv.appendChild(appNameDiv);

    const appDevDiv = document.createElement("div");
    appDevDiv.className = "appsection";
    appDevDiv.textContent = appData.developerName;
    dockDiv.appendChild(appDevDiv);

    const getBtn = document.createElement("button");
    getBtn.className = "getbtn";
    getBtn.textContent = "GET";
    dockDiv.appendChild(getBtn);

    appListDiv.appendChild(dockDiv);
  });
}

// Fonction pour filtrer les applications en temps réel
function filtrerApplications() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const storedData = JSON.parse(localStorage.getItem('appsData')) || [];

  const filteredApps = storedData.filter(function(appData) {
    return appData.name.toUpperCase().includes(filter) || appData.developerName.toUpperCase().includes(filter);
  });

  afficherApplications(filteredApps);
}

// Charger les premières applications lors du chargement initial de la page
chargerApplications(20, 1);