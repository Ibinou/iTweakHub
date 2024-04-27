// Fonction pour charger et afficher les applications par lots
function afficherDonnees() {
  var appListDiv = document.getElementById("appList");
  var loadMoreBtn = document.getElementById("more");

  // Fetcher les données de apps.json
  fetch('https://ibinou.github.io/iTweakHub/apps.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var appsData = data.apps; // appsData

      // Triez les applications par nom (ordre alphabétique)
      appsData.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      // Afficher les 20 premières applications
      afficherApplications(appsData.slice(0, 20));

      // Vérifier s'il reste des applications à charger
      if (appsData.length > 20) {
        // Afficher le bouton "Charger plus d'applications"
        loadMoreBtn.style.display = "block";

        // Ajout de l'événement de clic pour charger plus d'applications
        loadMoreBtn.addEventListener("click", function() {
          var startIndex = appListDiv.getElementsByClassName("dock").length;
          var endIndex = Math.min(startIndex + 20, appsData.length);
          afficherApplications(appsData.slice(startIndex, endIndex));
          if (endIndex === appsData.length) {
            loadMoreBtn.style.display = "none"; // Masquer le bouton lorsque toutes les applications sont chargées
          }
        });
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

      // Vérifier si appData.iconURL existe
      if (appData.iconURL) {
        // Créer un observer d'intersection
        var observer = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              // Charger l'image
              appIconImg.src = appData.iconURL;
              observer.unobserve(entry.target); // Arrêter l'observation une fois l'image chargée
            }
          });
        });

        // Attacher l'observateur à l'élément d'icône d'application
        observer.observe(appIconImg);
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
