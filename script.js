var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
    x.style.left = "-400px";
    y.style.left = "40px";
    z.style.left = "110px";
}

function login() {
    x.style.left = "40px";
    y.style.left = "450px";
    z.style.left = "0";
}

// Handle login for all roles
document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();
    const role = document.getElementById("login-role").value;
    const adminKey = document.getElementById("login-admin-key").value;
    const correctKey = "BES-ADMIN-2024";

    // Validate admin key if logging in as admin
    if (role === "admin" && adminKey !== correctKey) {
        alert("Invalid Admin Key, Bes! You are not authorized.");
        return;
    }

    // Store role for the session
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === 'store') {
        window.location.href = 'Store/dashboard.html';
    } else if (role === 'client') {
        window.location.href = 'client/clientDashboard.html';
    } else if (role === 'runner') {
        window.location.href = 'runner/runner-dashboard.html';
    } else if (role === 'admin') {
        window.location.href = 'admin/runner.html';
    }
});

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
    x.style.left = "-400px";
    y.style.left = "40px";
    z.style.left = "110px";
}

function login() {
    x.style.left = "40px";
    y.style.left = "450px";
    z.style.left = "0";
}

// Function to show/hide Admin Key
function checkRole() {
    var roleSelect = document.getElementById("role-select");
    var adminField = document.getElementById("admin-key-container");
    var adminInput = document.getElementById("admin-key");

    if (roleSelect.value === "admin") {
        adminField.style.display = "block";
        adminInput.setAttribute("required", "true");
    } else {
        adminField.style.display = "none";
        adminInput.removeAttribute("required");
    }
}

// Function to show/hide Admin Key on the login form
function checkLoginRole() {
    var roleSelect = document.getElementById("login-role");
    var adminField = document.getElementById("login-admin-key-container");
    var adminInput = document.getElementById("login-admin-key");

    if (roleSelect.value === "admin") {
        adminField.style.display = "block";
        adminInput.setAttribute("required", "true");
    } else {
        adminField.style.display = "none";
        adminInput.removeAttribute("required");
    }
}

// Logic for submission validation
document.getElementById('register').addEventListener('submit', function(e) {
    const role = document.getElementById("role-select").value;
    const adminKey = document.getElementById("admin-key").value;
    const correctKey = "BES-ADMIN-2024"; // You can change this secret key

    if (role === "admin" && adminKey !== correctKey) {
        e.preventDefault();
        alert("Maling Admin Key, Bes! You are not authorized.");
    } else {
        alert("Registration successful for " + role + "!");
    }
});