



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
  
  
  
  

// Fonction pour ajouter le padding top en prenant en compte la "safe area"
function addPaddingBasedOnMediaQueries() {
    var toptitleElement = document.querySelector('.toptitle');

    // iPhone 15 and 15 Pro
    var iPhone15Query = window.matchMedia("(width: 393px) and (height: 852px) and (-webkit-device-pixel-ratio: 3)");
    // iPhone 15 Plus and 15 Pro Max
    var iPhone15PlusQuery = window.matchMedia("(width: 430px) and (height: 932px) and (-webkit-device-pixel-ratio: 3)");
    // iPhone 14
    var iPhone14Query = window.matchMedia("(width: 390px) and (height: 844px) and (-webkit-device-pixel-ratio: 3)");
    // iPhone 14 Plus
    var iPhone14PlusQuery = window.matchMedia("(width: 428px) and (height: 926px) and (-webkit-device-pixel-ratio: 3)");
    // iPhone 13 Mini
    var iPhone13MiniQuery = window.matchMedia("(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3)");
    // iPhone 11
    var iPhone11Query = window.matchMedia("(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2)");
    // iPhone 11 Pro Max
    var iPhone11ProMaxQuery = window.matchMedia("(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3)");

    // Check each media query and add padding accordingly
    if (iPhone15Query.matches || iPhone15PlusQuery.matches || iPhone14Query.matches || iPhone14PlusQuery.matches || iPhone13MiniQuery.matches) {
        // Add padding for iPhone 15, 15 Plus, 14, 14 Plus, 13 Mini
        var safeAreaHeight = window.innerHeight - document.documentElement.clientHeight;
        toptitleElement.style.paddingTop = '50px';
    } else if (iPhone11Query.matches || iPhone11ProMaxQuery.matches) {
        // Add padding for iPhone 11, 11 Pro Max
        var safeAreaHeight = window.innerHeight - document.documentElement.clientHeight;
        toptitleElement.style.paddingTop = '50px';
    } else {
        // Reset padding for other devices
        toptitleElement.style.paddingTop = '0';
    }
}

// Call the function initially and on window resize
window.addEventListener('load', addPaddingBasedOnMediaQueries);
window.addEventListener('resize', addPaddingBasedOnMediaQueries);
    
