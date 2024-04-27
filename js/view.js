// Fonction pour vérifier si un élément est dans la zone visible de l'écran
function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function afficherDonnees() {
  var appListDiv = document.getElementById("appList");
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
          webElement.style.display = "none";
        }

        var appsData = data.apps;
        appsData.sort(function(a, b) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        var nombreApplicationsAafficher = appsData.length; 

        for (var i = 0; i < nombreApplicationsAafficher; i++) {
          var appData = appsData[i];

          var dockDiv = document.createElement("div");
          dockDiv.className = "dock";

          var appCellLeftDiv = document.createElement("div");
          appCellLeftDiv.className = "app_cell_left";

          var appIconImg = document.createElement("img");
          appIconImg.className = "appicon";
          if (appData.iconURL) {
            // Utiliser data-src au lieu de src
            appIconImg.setAttribute("data-src", appData.iconURL);
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

        // Ajout de l'écouteur d'événements pour le lazy loading
        window.addEventListener('scroll', lazyLoadImages);
        lazyLoadImages();
      })
      .catch(function(error) {
        console.log('Error', error);
      });
  } else {
    console.log("Repo URL not provided in the 'repo' parameter.");
  }
}

// Fonction pour charger les images lorsque l'utilisateur fait défiler jusqu'à elles
function lazyLoadImages() {
  var images = document.querySelectorAll('img[data-src]');
  images.forEach(function(img) {
    if (isInViewport(img)) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
  });
}
