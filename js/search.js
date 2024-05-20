// Fonction pour charger les données à partir d'une URL JSON
function chargerDonneesDepuisURL(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.log('Error fetching data from URL', error);
      return null;
    });
}

// Fonction principale pour charger et afficher les données des applications
function afficherDonnees() {
  var appListDiv = document.getElementById("appList");

  // Liste des URLs à charger (y compris apps.json et les URLs de repoURLs du localStorage)
  var urls = [
    'https://ibinou.github.io/iTweakHub/apps.json', // URL de apps.json
  ];

  // Récupérer les URLs de repoURLs du localStorage
  var repoURLs = JSON.parse(localStorage.getItem('repoURLs')) || [];

  // Ajouter les URLs de repoURLs à la liste d'URLs à charger
  urls = urls.concat(repoURLs);

  // Fetcher toutes les données depuis les URLs
  Promise.all(urls.map(chargerDonneesDepuisURL))
    .then(function(dataArray) {
      var allAppsData = [];
      var iconURLs = [];

      dataArray.forEach(function(data, index) {
        if (data) {
          if (data.apps && Array.isArray(data.apps)) {
            // Filtrer et formater les données essentielles pour chaque application
            var formattedApps = data.apps.map(function(app) {
              return {
                name: app.name,
                developer: app.developerName,
                iconURL: app.iconURL,
                sourceURL: urls[index] || '', // Utiliser l'URL source ou une chaîne vide comme fallback
              };
            });
            allAppsData = allAppsData.concat(formattedApps);
          }

          // Récupérer les iconURLs des trois dernières sources
          if (data.iconURL) {
            iconURLs.push(data.iconURL);
          }

          // Ajouter l'URL source au data
          data.sourceURL = urls[index];
        }
      });

      // Afficher les applications
      afficherApplications(allAppsData);

      // Afficher les icônes dans les cercles
      afficherIconesCercles(iconURLs.slice(-3));

      // Afficher les sources dans la modale
      afficherSourcesModale(dataArray);

      // Défilement automatique vers le bas pour déclencher le lazy loading
      window.scrollTo(0, 1); // Défilement d'un pixel vers le bas
    })
    .catch(function(error) {
      console.log('Error fetching or processing data', error);
    });

  // Gestion du lazy loading lors du scroll
  window.addEventListener('scroll', function() {
    chargerIconesVisibles();
  });

  function chargerIconesVisibles() {
    var appCells = document.querySelectorAll('.app_cell_left');

    appCells.forEach(function(appCell) {
      var appIcon = appCell.querySelector('.appicon');
      if (appIcon && appIcon.dataset.src && isInViewport(appCell)) {
        // Charger l'icône uniquement si elle n'est pas déjà chargée
        appIcon.src = appIcon.dataset.src;
        delete appIcon.dataset.src; // Supprimer l'attribut dataset après chargement
      }
    });
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function afficherApplications(appsData) {
    appsData.forEach(function(appData) {
      var dockDiv = document.createElement("div");
      dockDiv.className = "dock";

      var appCellLeftDiv = document.createElement("div");
      appCellLeftDiv.className = "app_cell_left";

      var appIconImg = document.createElement("img");
      appIconImg.className = "appicon";
      appIconImg.src = "https://github.com/Ibinou/iTweakHub/blob/main/img/blank.JPG?raw=true"; // Placeholder par défaut

      if (appData.iconURL) {
        // Stocker l'URL de l'image dans un attribut dataset pour le lazy loading
        appIconImg.dataset.src = appData.iconURL;
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
      appDevDiv.textContent = appData.developer;
      appCellMetaDiv.appendChild(appDevDiv);

      appCellLeftDiv.appendChild(appCellMetaDiv);
      dockDiv.appendChild(appCellLeftDiv);

      var appGetDiv = document.createElement("div");
      appGetDiv.className = "appget";

      var appGetBtn = document.createElement("a");
      // Utiliser l'opérateur ternaire pour définir la valeur de source
      var sourceValue = appData.sourceURL ? encodeURIComponent(appData.sourceURL) : encodeURIComponent('https://ibinou.github.io/iTweakHub/apps.json');
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

  function afficherIconesCercles(iconURLs) {
    const cercles = ['circle1', 'circle2', 'circle3'];
    iconURLs.forEach((iconURL, index) => {
      const circleElement = document.getElementById(cercles[index]);
      if (circleElement) {
        circleElement.style.backgroundImage = `url(${iconURL})`;
        circleElement.style.backgroundSize = 'cover';
      }
    });
  }

  function afficherSourcesModale(dataArray) {
    var modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = ''; // Clear existing content

    dataArray.forEach(function(data) {
      if (data && data.iconURL && data.name) {
        var sourceItemDiv = document.createElement("div");
        sourceItemDiv.className = "source-item";

        var sourceIconImg = document.createElement("img");
        sourceIconImg.src = data.iconURL;
        sourceIconImg.alt = data.name + " Icon";
        sourceItemDiv.appendChild(sourceIconImg);

        var sourceNameSpan = document.createElement("span");
        sourceNameSpan.textContent = data.name;
        sourceItemDiv.appendChild(sourceNameSpan);

        // Récupérer l'URL du JSON correspondant à cette source
        var jsonURL = data.sourceURL;

        // Ajouter un attribut HTML personnalisé pour stocker l'URL du JSON
        sourceItemDiv.setAttribute("data-json-url", jsonURL);

        var chevronIcon = document.createElement("i");
        chevronIcon.className = "fas fa-chevron-right";
        sourceItemDiv.appendChild(chevronIcon);

        // Créer le lien avec l'URL correcte
        var sourceLink = document.createElement("a");
        sourceLink.href = 'repoview.html?repo=' + encodeURIComponent(jsonURL);
        sourceLink.appendChild(sourceItemDiv);

        modalBody.appendChild(sourceLink);
      }
    });
  }
}

// search bar script
function myFunction() {
  const input = document.getElementById("myInput1");
  const filter = input.value.toUpperCase();
  const dock = document.getElementsByClassName("dock");

  for (let i = 0; i < dock.length; i++) {
    const appname = dock[i].getElementsByClassName("appname")[0];
    const display = appname.innerText.toUpperCase().includes(filter) ? "flex" : "none";
    dock[i].style.display = display;
  }
}
