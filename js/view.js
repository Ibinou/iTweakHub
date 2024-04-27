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

// Fonction pour afficher les données paginées
function afficherDonnees(pageNumber, pageSize) {
  var appListDiv = document.getElementById("appList");
  var h1Element = document.getElementById("repoName");
  var pElement = document.getElementById("repoDescription");
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
        if (data.website) {
          webElement.href = data.website;
        } else {
          webElement.style.display = "none";
        }

        var appsData = data.apps;
        var totalApps = appsData.length;
        var startIndex = (pageNumber - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize, totalApps);

        for (var i = startIndex; i < endIndex; i++) {
          var appData = appsData[i];

          var dockDiv = document.createElement("div");
          dockDiv.className = "dock";

          // Création des éléments pour afficher le nom de l'application
          var appNameDiv = document.createElement("div");
          appNameDiv.className = "appname";
          appNameDiv.textContent = appData.name;

          // Ajout de l'élément du nom de l'application au conteneur du dock
          dockDiv.appendChild(appNameDiv);

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

// Appeler la fonction pour afficher les données paginées
afficherDonnees(1, 10); // Charger la première page avec 10 éléments par page

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
