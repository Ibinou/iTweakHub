// Fonction pour charger et afficher les applications par lots
function chargerPlusApplications(pageNumber, pageSize) {
  var appListDiv = document.getElementById("appList");

  var urlParams = new URLSearchParams(window.location.search);
  var repoUrl = urlParams.get("repo");

  if (repoUrl) {
    fetch(repoUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var appsData = data.apps;
        var totalApps = appsData.length;
        var startIndex = (pageNumber - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize, totalApps);

        for (var i = startIndex; i < endIndex; i++) {
          var appData = appsData[i];
          var dockDiv = document.createElement("div");
          dockDiv.className = "dock";

          // Création et ajout des éléments pour chaque application
          var appCellLeftDiv = document.createElement("div");
          appCellLeftDiv.className = "app_cell_left";

          var appIconImg = document.createElement("img");
          appIconImg.className = "appicon";
          if (appData.iconURL) {
            appIconImg.src = appData.iconURL;
          } else {
            appIconImg.src = "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
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
          appGetBtn.href = 'appinfos.html?name=' + encodeURIComponent(appData.name) + '&source=' + encodeURIComponent(repoUrl);

          var getBtn = document.createElement("button");
          getBtn.className = "getbtn";
          getBtn.textContent = "GET";

          appGetBtn.appendChild(getBtn);
          appGetDiv.appendChild(appGetBtn);
          dockDiv.appendChild(appGetDiv);

          appListDiv.appendChild(dockDiv);
        }

        // Vérifie s'il reste des applications à charger
        if (endIndex < totalApps) {
          // Création du bouton pour charger plus d'applications
          var loadMoreBtn = document.createElement("button");
          loadMoreBtn.id = "loadMoreBtn";
          loadMoreBtn.textContent = "Charger plus d'applications";

          // Ajout de l'événement de clic pour charger plus d'applications
          loadMoreBtn.addEventListener("click", function() {
            chargerPlusApplications(pageNumber + 1, pageSize);
            loadMoreBtn.parentNode.removeChild(loadMoreBtn); // Supprimer le bouton après son utilisation
          });

          // Ajout du bouton à la fin de la liste des applications
          appListDiv.appendChild(loadMoreBtn);
        }
      })
      .catch(function(error) {
        console.log('Error', error);
      });
  } else {
    console.log("Repo URL not provided in the 'repo' parameter.");
  }
}

// Appeler la fonction pour charger initialement les 20 premières applications
chargerPlusApplications(1, 20);
