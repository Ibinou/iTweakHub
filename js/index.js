document.addEventListener('DOMContentLoaded', (event) => {
    const checkbox = document.getElementById('bordersCheck');
    const borderRule = '* { border: red 0.5px solid; }';

    // Vérifie l'état de la case à cocher dans localStorage
    if (localStorage.getItem('bordersEnabled') === 'true') {
        checkbox.checked = true;
        applyBorder();
    }

    // Ajoute l'événement de changement à la case à cocher
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            applyBorder();
            localStorage.setItem('bordersEnabled', 'true');
            location.reload()
        } else {
            removeBorder();
            localStorage.setItem('bordersEnabled', 'false');
            location.reload()
        }
    });

    function applyBorder() {
        document.styleSheets[0].insertRule(borderRule, 0);
    }

    function removeBorder() {
        for (let i = 0; i < document.styleSheets[0].cssRules.length; i++) {
            if (document.styleSheets[0].cssRules[i].cssText === borderRule) {
                document.styleSheets[0].deleteRule(i);
                break;
            }
        }
    }
});



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

    // Attendez que la page soit entièrement chargée
    window.addEventListener('load', function() {
        // Sélectionnez le corps de la page
        var body = document.querySelector('body');
        
        // Définissez l'opacité sur 0 avec une transition
        body.style.opacity = 1;
        body.style.transition = 'opacity 0.5s ease-in-out';
    });
  
  
  
  


    
