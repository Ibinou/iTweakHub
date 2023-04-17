function addRepo(repo) {
    alert("Work in progress, installed repo: ", repo.value)
}

function openApp(name, developer) {
    window.open("appinfos.html", "_parent")
    document.getElementById("appName").innerHTML = name
    document.getElementById("appDeveloper").innerHTML = developer
    document.title = name
}

_iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
if(_iOSDevice) {
 _iOSVersion = (navigator.userAgent.match(/\b[0-9]+_[0-9]+(?:_[0-9]+)?\b/)||[''])[0].replace(/_/g,'.');
} else {
    _iOSVersion = ""
}

var signed = true

if(signed) {
    document.getElementById("signed").style.color = "#00c227"
} else {
    document.getElementById("signed").style.color = "red"
}

document.getElementById('iosVer').innerHTML = _iOSVersion

function reloadRepos() {
    alert("Work in progress")
}