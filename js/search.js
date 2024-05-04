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

      // Afficher les premières 8 applications initialement
      var initialAppsData = appsData.slice(0, 8);
      afficherApplications(initialAppsData);

      // Gestion du lazy loading lors du scroll
      window.addEventListener('scroll', function() {
        afficherLazyLoadedIcons(appsData);
      });

      function afficherLazyLoadedIcons(appsData) {
        var visibleIcons = document.querySelectorAll('.appicon:not([data-loaded])');

        visibleIcons.forEach(function(icon) {
          if (isElementInViewport(icon)) {
            var appName = icon.parentElement.parentElement.querySelector('.appname').textContent;
            var appData = appsData.find(function(app) {
              return app.name === appName;
            });

            if (appData && appData.iconURL) {
              icon.src = appData.iconURL;
              icon.setAttribute('data-loaded', 'true'); // Marquer comme chargé
            }
          }
        });
      }

      function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
    })
    .catch(function(error) {
      console.log('Error fetching apps.json', error);
    });

  function afficherApplications(appsData) {
    appsData.forEach(function(appData) {
      var dockDiv = document.createElement("div");
      dockDiv.className = "dock";

      var appCellLeftDiv = document.createElement("div");
      appCellLeftDiv.className = "app_cell_left";

      var appIconImg = document.createElement("img");
      appIconImg.className = "appicon";
      appIconImg.setAttribute('data-loaded', 'false'); // Marque l'image comme non chargée
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
      appDevDiv.textContent = appData.developerName;
      appCellMetaDiv.appendChild(appDevDiv);

      appCellLeftDiv.appendChild(appCellMetaDiv);
      dockDiv.appendChild(appCellLeftDiv);

      var appGetDiv = document.createElement("div");
      appGetDiv.className = "appget";

      var appGetBtn = document.createElement("a");
      var sourceValue = encodeURIComponent('https://ibinou.github.io/iTweakHub/apps.json');
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