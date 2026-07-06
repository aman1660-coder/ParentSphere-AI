// REGISTER USER
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password").value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const user = { username, email, password };
    localStorage.setItem("parentsphereUser", JSON.stringify(user));
    alert("Registration successful!");
    window.location.href = "index.html";
}

// LOGIN USER
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUser = JSON.parse(localStorage.getItem("parentsphereUser"));

    if (!storedUser) {
        alert("No user registered!");
        return;
    }

    if (username === storedUser.username && password === storedUser.password) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "home.html";
    } else {
        alert("Invalid credentials!");
    }
}

// AUTH CHECK
function checkAuth() {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
    }
}

// LOGOUT
function logoutUser() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}