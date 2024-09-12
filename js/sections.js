function afficherDonnees() {
  var appListDiv = document.getElementById("appList");

  // Récupérer les paramètres de l'URL
  var urlParams = new URLSearchParams(window.location.search);
  var sectionParam = urlParams.get('section');

  // Tableaux de noms d'applications par section
  var sections = {
    "Games": ["Agar.io Hack", "Among US Hack", "Minecraft", "iPogo", "iSpoofer"],
    "Utilities": ["OldOS", "Blacklist", "ScreenshotX", "Clip", "AltStore", "Filmr Pro", "iTorrent"],
    "Music": ["EeveeSpotify", "Deezer++", "Spotify++", "Spotilife", "SoundCloud++", "Spotify Tweaked"],
    "Movies": ["FlixHub", "Zinitevi++", "Streamer", "NineAnimator", "Anime Now !", "Cercube+", "Channels"],
    "Jailbreak": ["Unc0ver", "Taurine", "Odyssey", "Cowabunga", "InstaSpring", "Misaka", "TrollStore", "Blacklist"],
    "Social": ["Spotilife", "uYouPlus", "Enmity", "Instagram++", "Instagram Rhino", "Snapchat", "TikTok", "WhatsApp", "Watusi", "Facebook", "X++", "X", "BHTwitter", "Twitter++"]
  };

  // Sélectionner le tableau correspondant à la section
  var appsAInclure = sections[sectionParam] || [];

  // Fetcher les données de apps.json
  fetch('https://itweakhub.netlify.app/apps.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var appsData = data.apps; // Assurez-vous que le format JSON correspond

      // Filtre les applications incluses dans appsAInclure
      appsData = appsData.filter(function(app) {
        return appsAInclure.includes(app.name);
      });

      // Triez les applications par nom (ordre alphabétique)
      appsData.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });

      afficherApplications(appsData);

      // Récupérer les URLs des JSON depuis le localStorage
      var repoURLs = JSON.parse(localStorage.getItem('repoURLs')) || [];

      // Fetcher les données des URLs stockées dans repoURLs
      var fetchPromises = repoURLs.map(function(url) {
        return fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            var appsDataFromURL = data.apps; // Assurez-vous que le format JSON correspond

            // Filtre les applications incluses dans appsAInclure
            appsDataFromURL = appsDataFromURL.filter(function(app) {
              return appsAInclure.includes(app.name);
            });

            // Triez les applications par nom également
            appsDataFromURL.sort(function(a, b) {
              return a.name.localeCompare(b.name);
            });

            afficherApplications(appsDataFromURL, url);
          })
          .catch(function(error) {
            console.log('Error fetching data from URL', error);
          });
      });

      // Attendre que toutes les requêtes de fetch se terminent
      return Promise.all(fetchPromises);
    })
    .catch(function(error) {
      console.log('Error fetching apps.json', error);
    });

  function afficherApplications(appsData, source) {
    appsData.forEach(function(appData) {
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
          appIconImg.src = "https://github.com/Ibinou/iTweakHub/blob/main/img/blank.JPG?raw=true";
        };
        appIconImg.src = appData.iconURL;
      } else {
        // Utiliser un placeholder si aucun lien d'image n'est fourni
        appIconImg.src = "img/blank.JPG";
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
      var sourceValue = source !== undefined ? encodeURIComponent(source) : encodeURIComponent('https://ibinou.github.io/iTweakHub/apps.json');
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
// Fonction pour récupérer les paramètres de l'URL
function obtenirParametreUrl(nomParametre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nomParametre);
}

// Récupérer la valeur du paramètre "monParametre" de l'URL
const valeurParametre = obtenirParametreUrl('section');

// Afficher la valeur dans la div avec l'ID spécifié
document.getElementById('sectiontitle').innerText = valeurParametre;
