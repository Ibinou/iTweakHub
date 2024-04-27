// Variable pour stocker temporairement les écouteurs d'événements
var eventListeners = [];

// Variable pour stocker temporairement les href des liens
var originalHrefs = [];

// Fonction pour transformer les boutons "View" en boutons "Delete" lorsque le bouton "edit" est cliqué
function transformerBoutonsDelete() {
  var viewButtons = document.querySelectorAll('.getbtn');
  viewButtons.forEach(function(button) {
    button.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Remplacer le texte par l'icône de corbeille
    button.style.width = "71px"; // Définir la largeur temporairement à 71px
    button.style.color = "red"; // Changement de la couleur du texte en rouge
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

  // Désactiver temporairement les écouteurs d'événements sur dockDiv
  var repoDivs = document.querySelectorAll('.dock');
  repoDivs.forEach(function(dockDiv) {
    var listener = dockDiv.onclick; // Stocker l'écouteur d'événements
    eventListeners.push(listener); // Ajouter l'écouteur d'événements au tableau
    dockDiv.onclick = null; // Désactiver l'écouteur d'événements
  });

  // Modifier temporairement les href des liens vers "appsmanager.html"
  var repoLinks = document.querySelectorAll('#repos a');
  repoLinks.forEach(function(link) {
    originalHrefs.push(link.href); // Stocker l'href d'origine
    link.href = "appsmanager.html"; // Modifier l'href
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
    window.location.href = "appsmanager.html"; // Redirection vers appsmanager.html
  } else {
    alert("Source not found.");
  }
}

// Fonction pour restaurer les écouteurs d'événements sur dockDiv
function restaurerEventListeners() {
  var repoDivs = document.querySelectorAll('.dock');
  repoDivs.forEach(function(dockDiv, index) {
    dockDiv.onclick = eventListeners[index]; // Réactiver l'écouteur d'événements
  });
  // Vider le tableau des écouteurs d'événements
  eventListeners = [];

  // Restaurer les href d'origine des liens
  var repoLinks = document.querySelectorAll('#repos a');
  repoLinks.forEach(function(link, index) {
    link.href = originalHrefs[index]; // Restaurer l'href d'origine
  });
  // Vider le tableau des hrefs originaux
  originalHrefs = [];
}

// Appeler la fonction pour restaurer les écouteurs d'événements lors du chargement de la page
window.addEventListener("load", restaurerEventListeners);

// Appeler la fonction pour transformer les boutons en boutons "Delete" lorsque le bouton "edit" est pressé
var editButton = document.getElementById("edit");
editButton.addEventListener("click", function() {
  transformerBoutonsDelete();
});

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
            viewButton.textContent = data.apps.length; // Afficher seulement le nombre d'applications
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
  // Affichage du nombre d'applications au lieu de "VIEW"
  if (data.apps && Array.isArray(data.apps)) {
    getButton.textContent = data.apps.length;
  } else {
    getButton.textContent = "0";
  }
  appGetDiv.appendChild(getButton);

  // Ajouter un gestionnaire d'événements pour ouvrir la page repoview.html
  dockDiv.addEventListener("click", function() {
    window.open("repoview.html?repo=" + encodeURIComponent(url), "_blank");
  });

  return dockDiv;
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
        
        // Afficher le message "Added source"
        console.log('Added source');
        
        // Afficher les logs dans la popup log
        afficherLogs(data.apps.map(app => app.name));
      } else {
        console.log('Warning', 'Source added despite missing "apps" array or "name" property');
      }
    })
    .catch(function(error) {
      console.log('Error during fetch', error); // Ajout pour débogage
      alert('Error, unable to load the source', error);
    });
}

// Fonction pour afficher les logs dans la popup log
function afficherLogs(logs) {
  var logText = logElement.text;
  var index = 0;
  var intervalId = setInterval(function() {
    if (index < logs.length) {
      var logEntry = document.createElement("div");
      logEntry.textContent = "Added " + logs[index];
      logText.appendChild(logEntry);
      logElement.container.scrollTop = logElement.container.scrollHeight; // Faire défiler vers le bas
      index++;
    } else {
      clearInterval(intervalId); // Arrêter l'intervalle une fois que tous les logs ont été affichés
    }
  }, 200); // Délai de 0.2 seconde entre chaque app
  logElement.container.style.display = "block"; // Afficher la popup log
}
// Fonction pour créer l'élément de log
function createLogElement() {
  var logContainer = document.createElement("div");
  logContainer.className = "popup_log";

  var logText = document.createElement("div");
  logText.className = "log_text";
  logContainer.appendChild(logText);

  var closeButton = document.createElement("button");
  closeButton.className = "close_log_btn";
  closeButton.textContent = "Close";
  logContainer.appendChild(closeButton);

  document.body.appendChild(logContainer); // Ajouter le conteneur de log à la fin du body

  return {
    container: logContainer,
    text: logText,
    closeBtn: closeButton
  };
}

// Appel de la fonction pour créer l'élément de log
var logElement = createLogElement();

// Appeler la fonction pour afficher les informations depuis le JSON et enregistrer l'URL dans le localStorage
var popupButton = document.getElementById("popupButton");
popupButton.addEventListener("click", afficherInfosDepuisJSON);
