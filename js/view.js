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
            // Charger l'icône de manière paresseuse lorsqu'elle devient visible
            appIconImg.dataset.src = appData.iconURL;
            appIconImg.src = "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
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

        // Défilement automatique vers le bas pour déclencher le lazy loading
        window.scrollTo(0, 1); // Défilement d'un pixel vers le bas
      })
      .catch(function(error) {
        console.log('Error', error);
      });
  } else {
    console.log("Repo URL not provided in the 'repo' parameter.");
  }

  // Gestion du lazy loading lors du scroll
  window.addEventListener('scroll', function() {
    chargerIconesVisibles();
  });

  function chargerIconesVisibles() {
    var appIcons = document.querySelectorAll('.appicon');

    appIcons.forEach(function(appIcon) {
      if (appIcon.dataset.src && isInViewport(appIcon)) {
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
}
