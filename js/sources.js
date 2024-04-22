// Fonction pour transformer les boutons "View" en boutons "Delete" lorsque le bouton "edit" est cliqué
function transformerBoutonsDelete() {
  var viewButtons = document.querySelectorAll('.getbtn');
  viewButtons.forEach(function(button) {
    button.textContent = "DELETE";
    button.style.backgroundColor = "red";
    button.removeAttribute("onclick");
    var url = button.dataset.url; // Récupérer l'URL à partir de l'attribut de données
    button.addEventListener("click", function() {
      var confirmation = confirm("Are you sure you want to delete this source?");
      if (confirmation) {
        // Supprimer la source
        supprimerSource(url);
      }
    });
  });
}

// Fonction pour supprimer une source
function supprimerSource(url) {
  // Obtenir les URL des repos depuis le localStorage
  var repoURLs = JSON.parse(localStorage.getItem("repoURLs")) || [];
  
  // Trouver et supprimer l'URL spécifiée
  var index = repoURLs.indexOf(url);
  if (index !== -1) {
    repoURLs.splice(index, 1);
    localStorage.setItem("repoURLs", JSON.stringify(repoURLs));
    alert("Source deleted successfully.");
    location.reload(); // Recharger la page pour refléter les changements
  } else {
    alert("Source not found.");
  }
}
// Fonction pour afficher les informations depuis le JSON et enregistrer l'URL dans le localStorage
function afficherInfosDepuisJSON() {
  var url = prompt("Enter source URL:");

  console.log('Before fetch. URL:', url); // Ajout pour débogage

  fetch(url)
    .then(function(response) {
      console.log('After fetch, before response.json(). Status:', response.status); // Ajout pour débogage
      return response.json();
    })
    .then(function(data) {
      console.log('After response.json(), data:', data); // Ajout pour débogage

      if (data.apps && Array.isArray(data.apps) && data.name) {
        var reposDiv = document.getElementById("repos");
        var infoDiv = createRepoElement(data, url);

        var repoLink = document.createElement("a");
        repoLink.href = "repoview.html?repo=" + encodeURIComponent(url);
        repoLink.appendChild(infoDiv);

        reposDiv.appendChild(repoLink);

        // Enregistrer l'URL du repo dans le localStorage
        var repoURLs = JSON.parse(localStorage.getItem("repoURLs")) || [];
        repoURLs.push(url);
        localStorage.setItem("repoURLs", JSON.stringify(repoURLs));
        location.reload();
      } else {
        console.log('Warning', 'Source added despite missing "apps" array or "name" property');
      }
    })
    .catch(function(error) {
      console.log('Error during fetch', error); // Ajout pour débogage
      alert('Error, unable to load the source', error);
    });
}
// Fonction pour afficher les repos depuis le localStorage
function afficherReposDepuisLocalStorage() {
  var repoURLs = JSON.parse(localStorage.getItem("repoURLs")) || [];
  var appListDiv = document.getElementById("sourceList");

  repoURLs.forEach(function (url) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.apps && Array.isArray(data.apps) && data.name) {
          var repoElement = createRepoElement(data, url);
          appListDiv.appendChild(repoElement);
          // Ajouter l'attribut de données data-url au bouton "View"
          var viewButton = repoElement.querySelector('.getbtn');
          if (viewButton) {
            viewButton.dataset.url = url;
          }
        } else {
          console.log('Warning', 'Source added despite missing "apps" array or "name" property');
        }
      })
      .catch(function (error) {
        console.log('Error', error);
      });
  });
}

// Fonction pour créer l'élément de la source
function createRepoElement(data, url) {
  var dockDiv = document.createElement("div");
  dockDiv.className = "dock";

  var appCellLeftDiv = document.createElement("div");
  appCellLeftDiv.className = "app_cell_left";
  dockDiv.appendChild(appCellLeftDiv);

  var iconElement = document.createElement("img");
  iconElement.className = "appicon";
  iconElement.src = data.iconURL || "https://raw.githubusercontent.com/Ibinou/iTweakHub/main/img/blank.JPG";
  appCellLeftDiv.appendChild(iconElement);

  var appCellMetaDiv = document.createElement("div");
  appCellMetaDiv.className = "app_cell_meta";
  appCellLeftDiv.appendChild(appCellMetaDiv);

  var appNameDiv = document.createElement("div");
  appNameDiv.className = "appname";
  appNameDiv.textContent = data.name || "Untitled Source";
  appCellMetaDiv.appendChild(appNameDiv);

  var appSectionDiv = document.createElement("div");
  appSectionDiv.className = "appsection";
  appSectionDiv.textContent = data.author || "Unknown Author";
  appCellMetaDiv.appendChild(appSectionDiv);

  var appGetDiv = document.createElement("div");
  appGetDiv.className = "appget";
  dockDiv.appendChild(appGetDiv);

  var getButton = document.createElement("button");
  getButton.className = "getbtn";
  getButton.textContent = "VIEW";
  appGetDiv.appendChild(getButton);

  // Ajouter un gestionnaire d'événements pour ouvrir la page repoview.html
  dockDiv.addEventListener("click", function() {
    window.open("repoview.html?repo=" + encodeURIComponent(url), "_blank");
  });

  return dockDiv;
}

// Appeler la fonction pour afficher les repos depuis le localStorage lors du chargement de la page
window.addEventListener("load", function() {
  afficherReposDepuisLocalStorage();
  transformerBoutonsDelete(); // Appeler la fonction pour transformer les boutons
});

var popupButton = document.getElementById("popupButton");
popupButton.addEventListener("click", afficherInfosDepuisJSON);