



function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}


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

    // Transition
    window.addEventListener('load', function() {
        // Sélectionnez le corps de la page
        var body = document.querySelector('body');
        
        // Définissez l'opacité sur 0 avec une transition
        body.style.opacity = 0;
        body.style.transition = 'opacity 0.5s ease-in-out';
    });


