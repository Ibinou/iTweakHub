function addRepo(repo) {
    alert("Work in progress, installed repo: ", repo.value)
}

function openApp(name, developer) {
    window.open("appinfos.html")
    document.getElementById("appName").innerHTML = name
    document.getElementById("appDeveloper").innerHTML = developer
}