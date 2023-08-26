document.addEventListener('keydown', function(event) {

  if (event.ctrlKey && event.altKey && event.key === 'o') {

    window.open('devs.html', '_blank');
  }
});


// Repo js
function addRepo(repo) {
  alert("Work in progress, installed repo: ", repo.value);
}

function openApp(name, developer, description, banner, icon) {
  window.open(
    "appinfos.html?name=" +
      name +
      "&developer=" +
      developer +
      "&description=" +
      description +
      "&banner=" +
      banner +
      "&icon=" +
      icon,
    "_parent"
  );
}

function loadAppInfo(name, developer) {}

function reloadRepos() {
  alert("Work in progress");
}

function displayApp() {
  alert("App info system is work in progress!");
}

function removeStylesheets() {
  var stylesheets = document.getElementsByTagName("link");
  for (var i = 0; i < stylesheets.length; i++) {
    if (
      stylesheets[i].getAttribute("rel") == "stylesheet" &&
      !stylesheets[i].hasAttribute("keep")
    ) {
      stylesheets[i].parentNode.removeChild(stylesheets[i]);
    }
  }
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function resetTheme() {
    var cookies = document.cookie.split("; ");
    var visitedCookieValue = null;
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf("visited=") === 0) {
        visitedCookieValue = cookies[i].substring(8);
      } else {
        document.cookie = cookies[i] + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
    if (visitedCookieValue !== null) {
      document.cookie = "visited=" + visitedCookieValue + "; path=/;";
      location.reload();
    } else {
      alert("No need to reset, you haven't selected any other theme than the default one. If you don't like the default theme, you can change it in the settings.");
    }
  }
  
  
function loadTheme(file) {
  document.cookie = file;
  loadAll();
}

function loadAll() {
    var cookies = document.cookie.split("; ");
    var themeCookie = null;
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf("visited=") !== 0) {
        themeCookie = cookies[i];
        break;
      }
    }
    if (themeCookie !== null) {
      removeStylesheets();
      const link = document.createElement("link");
      link.href = themeCookie + ".css";
      link.rel = "stylesheet";
      console.log("Selected theme found, loading theme...");
      document.getElementsByTagName("head")[0].appendChild(link);
      console.log(document.cookie);
      console.log("Successfully loaded the theme and other things.");
    } else {
      console.log("No selected theme was found, going back to regular theme.")
      console.log(document.cookie);
      console.log("Successfully loaded the theme and other things.");
    }
  }
  
loadAll();

//oled theme

document.addEventListener("DOMContentLoaded", function() {
  const checkbox = document.getElementById("checkbox");

  // Vérifiez si le thème est enregistré dans les cookies et mettez à jour si nécessaire
  const theme = getCookie("theme");
  if (theme === "dark") {
    checkbox.checked = true;
  }

  // Ajoutez un écouteur pour suivre les changements de la case à cocher
  checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
      document.body.style.backgroundColor = "#000";
      setCookie("theme", "dark", 365); // Enregistrez le thème dans les cookies pour 1 an
    } else {
      document.body.style.backgroundColor = "#121212";
      setCookie("theme", "", -1); // Supprimez le cookie en lui donnant une date d'expiration passée
    }
  });
});

// Fonction pour obtenir la valeur d'un cookie
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Fonction pour définir un cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
}


