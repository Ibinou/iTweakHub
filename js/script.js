function checkLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "dev" && password === "enter") {
        document.getElementById("login").style.display = "none";
        document.getElementById("content").style.display = "block";
    } else {
        alert("Invalid login credentials.");
    }
}
