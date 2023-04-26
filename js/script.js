function checkLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "developer" && password === "access") {
        document.getElementById("login").style.display = "none";
        document.getElementById("body").style.display = "block";
    } else {
        alert("Invalid login credentials.");
    }
}    
