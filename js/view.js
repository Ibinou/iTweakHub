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

// Fonction pour afficher les données
function afficherDonnees() {
  var appListDiv = document.getElementById("appList");
  var h1Element = document.getElementById("repoName"); // Élément h1 pour afficher le nom du repo
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
        // Afficher les infos
        h1Element.textContent = data.name;
        pElement.textContent = data.description;
        if (data.iconURL) {
           imgElement.onload = function() {
           // L'image a été chargée avec succès
        };
           imgElement.onerror = function() {
           // Le lien d'image n'est pas valide, utiliser un placeholder
           imgElement.src = "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
         };
           imgElement.src = data.iconURL;
        } else {
        // Utiliser un placeholder si aucun lien d'image n'est fourni
        imgElement.src = "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
        }
        if (data.website) {
  webElement.href = data.website;
} else {
  // Cacher l'élément website s'il n'y a pas de lien de site web
  webElement.style.display = "none";
}

        var appsData = data.apps;

        appsData.sort(function(a, b) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        var nombreApplicationsAafficher = appsData.length; // Comptez le nombre d'applications dans le JSON

        // Utilisez une boucle for pour itérer sur le nombre d'applications à afficher
        for (var i = 0; i < nombreApplicationsAafficher; i++) {
          var appData = appsData[i];

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
              appIconImg.src = "img/blank.JPG";
            };
            appIconImg.setAttribute('data-src', appData.iconURL); // Utilisez data-src pour lazy loading
          } else {
            // Utiliser un placeholder si aucun lien d'image n'est fourni
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
          // Ajouter la source directe à l'URL
          appGetBtn.href = 'appinfos.html?name=' + encodeURIComponent(appData.name) + '&source=' + encodeURIComponent(repoUrl);

          var getBtn = document.createElement("button");
          getBtn.className = "getbtn";
          getBtn.textContent = "GET";

          appGetBtn.appendChild(getBtn);
          appGetDiv.appendChild(appGetBtn);
          dockDiv.appendChild(appGetDiv);

          appListDiv.appendChild(dockDiv);
        }
      })
      .catch(function(error) {
        console.log('Error', error);
      });
  } else {
    console.log("Repo URL not provided in the 'repo' parameter.");
  }
}
