// Fonction pour charger les données à partir d'une URL JSON
function chargerDonneesDepuisURL(url) {
  return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.log('Error fetching data from URL', error);
      return null;
    });
}

// Fonction pour afficher les données
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
      // Concaténer toutes les applications des différentes sources de données
      var allAppsData = [];
      dataArray.forEach(function(data) {
        if (data && data.apps && Array.isArray(data.apps)) {
          // Filtrer et formater les données essentielles pour chaque application
          var formattedApps = data.apps.map(function(app) {
            return {
              name: app.name,
              developer: app.developerName,
              iconURL: app.iconURL,
              sourceURL: 'appinfos.html?name=' + encodeURIComponent(app.name) + '&source=' + encodeURIComponent(data.url),
            };
          });
          allAppsData = allAppsData.concat(formattedApps);
        }
      });

      // Stocker les données dans le localStorage
      localStorage.setItem('appsData', JSON.stringify(allAppsData));

      // Afficher toutes les applications avec les icônes
      afficherApplications(allAppsData);
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
      if (appIcon) {
        var appname = appCell.parentElement.querySelector('.appname').textContent;
        var appData = allAppsData.find(function(app) {
          return app.name === appname;
        });

        if (appData && appData.iconURL && isInViewport(appCell)) {
          if (!appIcon.src || appIcon.src.indexOf('blank.JPG') !== -1) {
            appIcon.src = appData.iconURL;
          }
        }
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
        appIconImg.dataset.src = appData.iconURL; // Stocke l'URL de l'image pour le lazy loading
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
      appGetBtn.href = appData.sourceURL;

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


//search bar script
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