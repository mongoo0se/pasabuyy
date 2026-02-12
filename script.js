// UI elements for the sliding form
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

// Supabase configuration (ready for integration)
const SUPABASE_URL = 'https://jjjjtweowzhanzkidzaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqamp0d2Vvd3poYW56a2lkemF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDgzNDEsImV4cCI6MjA4NTk4NDM0MX0.YA531eivIrpg8N8jj9KTeP4f0zl_0ew42kxQqmEbAQg';

// Create client using the UMD bundle loaded in signin.html
const supa = window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

const ADMIN_KEY = 'BES-ADMIN-2024';

// Show/hide admin key fields
function checkRole() {
    var roleSelect = document.getElementById("role-select");
    var adminField = document.getElementById("admin-key-container");
    var adminInput = document.getElementById("admin-key");

    if (roleSelect && roleSelect.value === "admin") {
        adminField.style.display = "block";
        adminInput.setAttribute("required", "true");
    } else {
        adminField.style.display = "none";
        adminInput.removeAttribute("required");
    }
}

function checkLoginRole() {
    var roleSelect = document.getElementById("login-role");
    var adminField = document.getElementById("login-admin-key-container");
    var adminInput = document.getElementById("login-admin-key");

    if (roleSelect && roleSelect.value === "admin") {
        adminField.style.display = "block";
        adminInput.setAttribute("required", "true");
    } else {
        adminField.style.display = "none";
        adminInput.removeAttribute("required");
    }
}

// Helper: simple redirect mapping
function redirectForRole(role) {
    if (role === 'store') window.location.href = 'Store/dashboard.html';
    else if (role === 'client') window.location.href = 'client/clientDashboard.html';
    else if (role === 'runner') window.location.href = 'runner/runner-dashboard.html';
    else if (role === 'admin') window.location.href = 'admin/runner.html';
}

// Login handler (queries Supabase 'users' table; this is a simple example)
document.getElementById('login').addEventListener('submit', async function(e) {
    e.preventDefault();
    const role = document.getElementById("login-role").value;
    const adminKey = document.getElementById("login-admin-key").value;

    if (role === "admin" && adminKey !== ADMIN_KEY) {
        alert("Invalid Admin Key, Bes! You are not authorized.");
        return;
    }

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!supa) {
        // No Supabase client available: fallback to local redirect based only on role
        redirectForRole(role);
        return;
    }

    try {
        const { data, error } = await supa.from('users').select('*').eq('email', email).limit(1);
        if (error) throw error;
        if (!data || data.length === 0) {
            alert('No account found for that email.');
            return;
        }
        const user = data[0];
        // NOTE: Passwords should be hashed and verified server-side; this is a simple example.
        if (user.password !== password) {
            alert('Invalid credentials.');
            return;
        }
        if (user.role !== role) {
            alert('Role does not match the account.');
            return;
        }
        redirectForRole(role);
    } catch (err) {
        console.error(err);
        alert('Login error: ' + (err.message || err));
    }
});

// Registration handler: inserts a row into 'users' table (make sure table exists in Supabase)
document.getElementById('register').addEventListener('submit', async function(e) {
    e.preventDefault();
    const role = document.getElementById("role-select").value;
    const adminKey = document.getElementById("admin-key").value;

    if (role === "admin" && adminKey !== ADMIN_KEY) {
        alert("Invalid Admin Key, Bes! You are not authorized.");
        return;
    }

    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!supa) {
        alert('Registration cannot complete: Supabase client not available.');
        return;
    }

    try {
        // TODO: Hash passwords server-side before storing in production.
        const payload = { role: role, name: name, email: email, password: password };
        const { data, error } = await supa.from('users').insert([payload]);
        if (error) throw error;
        alert('Registration successful. You can now log in.');
        // After successful registration show login form
        login();
    } catch (err) {
        console.error(err);
        alert('Registration error: ' + (err.message || err));
    }
});