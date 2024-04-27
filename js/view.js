// Fonction pour charger et afficher les applications par lots
function chargerPlusApplications(pageNumber, pageSize) {
  var appListDiv = document.getElementById("appList");
  var loadMoreBtn = document.getElementById("more");
  var h1Element = document.getElementById("repoName");
  var pElement = document.getElementById("repoDescription");
  var imgElement = document.getElementById("source_icon");
  var webElement = document.getElementById("source_website");

  var urlParams = new URLSearchParams(window.location.search);
  var repoUrl = urlParams.get("repo");

  if (repoUrl) {
    fetch(repoUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Afficher les informations de la source
        h1Element.textContent = data.name;
        pElement.textContent = data.description;
        if (data.iconURL) {
          imgElement.src = data.iconURL;
        } else {
          imgElement.src = "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
        }
        if (data.website) {
          webElement.href = data.website;
        } else {
          webElement.style.display = "none";
        }

        var appsData = data.apps;
        appsData.sort(function(a, b) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

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
          appNameDiv.textContent = appData.name; // Affichage du nom de l'application
          appCellMetaDiv.appendChild(appNameDiv);

          var appDevDiv = document.createElement("div");
          appDevDiv.className = "appsection";
          appDevDiv.textContent = appData.developerName; // Affichage du nom du développeur
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
          // Afficher le bouton "Charger plus d'applications"
          loadMoreBtn.style.display = "block";

          // Ajout de l'événement de clic pour charger plus d'applications
          loadMoreBtn.addEventListener("click", function() {
            chargerPlusApplications(pageNumber + 1, pageSize);
            loadMoreBtn.style.display = "none"; // Masquer le bouton après son utilisation
          });
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
