const queryString = window.location.search;
console.log(queryString);

urlParams = new URLSearchParams(queryString);
console.log(urlParams.get('name'))
document.getElementById("appName").innerHTML = urlParams.get('name')
document.getElementById("appDeveloper").innerHTML = urlParams.get('developer')
document.getElementById("appDescription").innerHTML = urlParams.get('description')
document.getElementById("appBanner").src = urlParams.get('banner')
document.getElementById("appIcon").src = urlParams.get('icon')
document.title = "iTweakHub | " + urlParams.get('name')