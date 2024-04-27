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
function afficherInfosDepuisJSON(url) {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
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
  var maxHeight = 150; // Hauteur maximale pour le conteneur de logs
  var intervalId = setInterval(function() {
    if (index < logs.length) {
      var logEntry = document.createElement("div");
      logEntry.textContent = "Added " + logs[index];
      logText.appendChild(logEntry);
      if (logText.scrollHeight > maxHeight) {
        logText.scrollTop = logText.scrollHeight - maxHeight;
      }
      index++;
    } else {
      clearInterval(intervalId); // Arrêter l'intervalle une fois que tous les logs ont été affichés
      // Afficher le log de confirmation final
      var confirmationLog = document.createElement("div");
      confirmationLog.textContent = "The source has been added";
      logText.appendChild(confirmationLog);
      logElement.container.scrollTop = 0; // Faire défiler vers le haut pour afficher le log de confirmation
      // Afficher le bouton de fermeture de la popup log
      logElement.closeBtn.style.display = "block";
      // Rafraîchir la page après la fermeture de la popup log
      logElement.closeBtn.addEventListener("click", function() {
        location.reload();
      });
    }
  }, 20); // Délai de 0.1 seconde entre chaque app pour une vitesse accrue
  logElement.container.style.display = "block"; // Afficher la popup log
}

// Fonction pour créer l'élément de log
function createLogElement() {
  var logContainer = document.createElement("div");
  logContainer.className = "popup_log";
  logContainer.style.display = "none"; // Caché par défaut
  logContainer.style.position = "fixed";
  logContainer.style.top = "50%";
  logContainer.style.left = "50%";
  logContainer.style.transform = "translate(-50%, -50%)";
  logContainer.style.width = "300px";
  logContainer.style.height = "222px";
  logContainer.style.backgroundColor = "#1c1c1c";
  logContainer.style.borderRadius = "20px";
  logContainer.style.padding = "20px";
  logContainer.style.boxShadow = "0 0 100px 50px rgba(0, 0, 0, 0.8)";

  var logText = document.createElement("div");
  logText.className = "log_text";
  logText.style.color = "white";
  logText.style.fontSize = "16px";
  logText.style.maxHeight = "150px";
  logText.style.overflowY = "auto";
  logContainer.appendChild(logText);

  var closeButton = document.createElement("button");
  closeButton.className = "close_log_btn";
  closeButton.textContent = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.bottom = "10px";
  closeButton.style.left = "50%";
  closeButton.style.transform = "translateX(-50%)";
  closeButton.style.backgroundColor = "#363636";
  closeButton.style.borderRadius = "20px";
  closeButton.style.color = "#fff";
  closeButton.style.width = "100px";
  closeButton.style.height = "30px";
  closeButton.style.display = "none"; // Caché par défaut
  logContainer.appendChild(closeButton);
  closeButton.style.border = "none";

  document.body.appendChild(logContainer); // Ajouter le conteneur de log à la fin du body

  return {
    container: logContainer,
    text: logText,
    closeBtn: closeButton
  };
}

// Appel de la fonction pour créer l'élément de log
var logElement = createLogElement();

// Appeler la fonction pour afficher les repos depuis le localStorage lors du chargement de la page
window.addEventListener("load", afficherReposDepuisLocalStorage);

// Écouter le clic sur le bouton de fermeture de la popup log
logElement.closeBtn.addEventListener("click", function() {
  logElement.container.style.display = "none"; // Cacher la popup log
});

// Appeler la fonction pour afficher les informations depuis le JSON et enregistrer l'URL dans le localStorage
var popupButton = document.getElementById("popupButton");
popupButton.addEventListener("click", function() {
  var url = prompt("Enter source URL:");
  if (url !== null && url.trim() !== "") {
    afficherInfosDepuisJSON(url);
  } else {
    alert("Please enter the URL of the source.");
  }
});
