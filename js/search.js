// Fonction pour afficher les données
function afficherDonnees() {
  var appListDiv = document.getElementById("appList");

  // Promesse pour fetcher les données de apps.json
  fetch('https://ibinou.github.io/iTweakHub/apps.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var appsData = data.apps || []; // Liste des applications de apps.json

      // Récupérer les URLs des JSON depuis le localStorage
      var repoURLs = JSON.parse(localStorage.getItem('repoURLs')) || [];

      // Promesses pour fetcher les données de toutes les URLs stockées dans repoURLs
      var fetchPromises = repoURLs.map(function(url) {
        return fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            return data.apps || []; // Liste des applications de l'URL
          })
          .catch(function(error) {
            console.log('Error fetching data from URL', error);
            return []; // Retourne une liste vide en cas d'erreur
          });
      });

      // Attendre que toutes les requêtes de fetch se terminent
      Promise.all(fetchPromises)
        .then(function(results) {
          // Concaténer toutes les listes d'applications en une seule
          var allAppsData = appsData.concat(...results);

          // Triez toutes les applications par nom (ordre alphabétique)
          allAppsData.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });

          // Afficher les applications triées
          afficherApplications(allAppsData);
        })
        .catch(function(error) {
          console.log('Error fetching app data', error);
        });
    })
    .catch(function(error) {
      console.log('Error fetching apps.json', error);
    });

  // Fonction pour afficher les applications dans le DOM
  function afficherApplications(appsData) {
    appListDiv.innerHTML = ''; // Effacer le contenu actuel de appListDiv

    appsData.forEach(function(appData) {
      var dockDiv = document.createElement("div");
      dockDiv.className = "dock";

      var appCellLeftDiv = document.createElement("div");
      appCellLeftDiv.className = "app_cell_left";

      var appIconImg = document.createElement("img");
      appIconImg.className = "appicon";

      // Vérifier si appData.iconURL existe
      if (appData.iconURL) {
        // Vérifier si le lien d'image est valide
        appIconImg.onload = function() {
          // L'image a été chargée avec succès
        };
        appIconImg.onerror = function() {
          // Le lien d'image n'est pas valide, utiliser un placeholder
          appIconImg.src = "https://github.com/Ibinou/iTweakHub/blob/main/img/blank.JPG?raw=true";
        };
        appIconImg.src = appData.iconURL;
      } else {
        // Utiliser un placeholder si aucun lien d'image n'est fourni
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
      var sourceValue = encodeURIComponent(appData.source || 'https://ibinou.github.io/iTweakHub/apps.json');
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
}

// Fonction pour filtrer les applications par nom
function myFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const dock = document.getElementsByClassName("dock");

  for (let i = 0; i < dock.length; i++) {
    const appname = dock[i].getElementsByClassName("appname")[0];
    const display = appname.innerText.toUpperCase().includes(filter) ? "flex" : "none";
    dock[i].style.display = display;
  }
}

// Appel de la fonction afficherDonnees au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  afficherDonnees();
});