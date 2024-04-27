// Fonction pour afficher les données
function afficherDonnees() {
  var appListDiv = document.getElementById("appList");

  // Fetcher les données de apps.json
  fetch('https://ibinou.github.io/iTweakHub/apps.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var appsData = data.apps; // Assurez-vous que le format JSON correspond

      // Triez les applications par nom (ordre alphabétique)
      appsData.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      // Afficher les 7 premières applications avec leurs icônes
      afficherApplications(appsData.slice(0, 7));

      // Récupérer les URLs des JSON depuis le localStorage
      var repoURLs = JSON.parse(localStorage.getItem('repoURLs')) || [];

      // Fetcher les données des URLs stockées dans repoURLs
      var fetchPromises = repoURLs.map(function(url) {
        return fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            var appsDataFromURL = data.apps;

            // Triez les applications par nom également
            appsDataFromURL.sort(function(a, b) {
              return a.name.localeCompare(b.name);
            });

            // Afficher les 7 premières applications de cette source avec leurs icônes
            afficherApplications(appsDataFromURL.slice(0, 7), url);
          })
          .catch(function(error) {
            console.log('Error fetching data from URL', error);
          });
      });

      // Attendre que toutes les requêtes de fetch se terminent
      return Promise.all(fetchPromises);
    })
    .catch(function(error) {
      console.log('Error fetching apps.json', error);
    });

  function afficherApplications(appsData, source) {
    appsData.forEach(function(appData) {
      var dockDiv = document.createElement("div");
      dockDiv.className = "dock";

      var appCellLeftDiv = document.createElement("div");
      appCellLeftDiv.className = "app_cell_left";

      var appIconImg = document.createElement("img");
      appIconImg.className = "appicon";

      // Vérifier si appData.iconURL existe
      if (appData.iconURL) {
        // Charger l'icône de l'application
        appIconImg.src = appData.iconURL;
      } else {
        // Utiliser un placeholder si aucun lien d'image est fourni
        appIconImg.src = "https://github.com/Ibinou/iTweakHub/blob/main/img/blank.JPG?raw=true";
      }

      appCellLeftDiv.appendChild(appIconImg);

      var appCellMetaDiv = document.createElement("div");
      appCellMetaDiv.className = "app_cell_meta";

      var appNameDiv = document.createElement("div");
      appNameDiv.className = "appname";
      appNameDiv.textContent = appData.name;
      appCellMetaDiv.appendChild(appNameDiv);

      var appDevDiv = document.createElement("div");
      appDevDiv.className = "appsection";
      appDevDiv.textContent = appData.developerName;
      appCellMetaDiv.appendChild(appDevDiv);

      appCellLeftDiv.appendChild(appCellMetaDiv);
      dockDiv.appendChild(appCellLeftDiv);

      var appGetDiv = document.createElement("div");
      appGetDiv.className = "appget";

      var appGetBtn = document.createElement("a");

      // Utiliser l'opérateur ternaire pour définir la valeur de source
      var sourceValue = source !== undefined ? encodeURIComponent(source) : encodeURIComponent('https://ibinou.github.io/iTweakHub/apps.json');
      appGetBtn.href = 'appinfos.html?name=' + encodeURIComponent(appData.name) + '&source=' + sourceValue;

      var getBtn = document.createElement("button");
      getBtn.className = "getbtn";
      getBtn.textContent = "GET";

      appGetBtn.appendChild(getBtn);
      appGetDiv.appendChild(appGetBtn);
      dockDiv.appendChild(appGetDiv);

      appListDiv.appendChild(dockDiv);
    });
  }

  // Fonction pour charger les icônes d'application de manière paresseuse
  function lazyLoadIcons() {
    var appIcons = document.querySelectorAll('.appicon[data-src]');

    appIcons.forEach(function(icon) {
      var rect = icon.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        // L'icône est dans la zone visible, chargez son image
        icon.src = icon.getAttribute('data-src');
        icon.removeAttribute('data-src');
      }
    });
  }

  // Gestionnaire d'événements de défilement pour le lazy loading des icônes
  window.addEventListener('scroll', lazyLoadIcons);
  window.addEventListener('resize', lazyLoadIcons);

  // Appelez lazyLoadIcons une fois pour charger les icônes visibles au chargement de la page
  lazyLoadIcons();
}

// Fonction pour filtrer les applications par nom
function filtrerApplications() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const dock = document.getElementsByClassName("dock");

  for (let i = 0; i < dock.length; i++) {
    const appNameDiv = dock[i].querySelector('.appname');
    if (appNameDiv) {
      const appName = appNameDiv.textContent.toUpperCase();
      const display = appName.includes(filter) ? "flex" : "none";
      dock[i].style.display = display;
    }
  }
}

// Appel de la fonction afficherDonnees au chargement de la page
window.addEventListener('load', afficherDonnees);

// Appel de la fonction filtrerApplications lors de la saisie dans la barre de recherche
document.getElementById("myInput").addEventListener('input', filtrerApplications);