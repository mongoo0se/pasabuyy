// Auth UI helpers for Pa-Buy (Login + Register)

function register() {
    const x = document.getElementById('login');
    const y = document.getElementById('register');
    const z = document.getElementById('btn');

    x.style.left = '-400px';
    y.style.left = '40px';
    z.style.left = '110px';
}

function login() {
    const x = document.getElementById('login');
    const y = document.getElementById('register');
    const z = document.getElementById('btn');

    x.style.left = '40px';
    y.style.left = '450px';
    z.style.left = '0';
}

// Admin key guard (demo only)
const ADMIN_KEY = 'BES-ADMIN-2024';

// Session helpers (persist current user for navigation)
const CURRENT_USER_KEY = 'pb_currentUser';

function setCurrentUser(user) {
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch {
        // ignore
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    } catch {
        return null;
    }
}

function checkRole() {
    const roleSelect = document.getElementById('role-select');
    const adminField = document.getElementById('admin-key-container');
    const adminInput = document.getElementById('admin-key');

    if (roleSelect && roleSelect.value === 'admin') {
        adminField.style.display = 'block';
        adminInput.setAttribute('required', 'true');
    } else {
        adminField.style.display = 'none';
        adminInput.removeAttribute('required');
    }
}

function checkLoginRole() {
    const roleSelect = document.getElementById('login-role');
    const adminField = document.getElementById('login-admin-key-container');
    const adminInput = document.getElementById('login-admin-key');

    if (roleSelect && roleSelect.value === 'admin') {
        adminField.style.display = 'block';
        adminInput.setAttribute('required', 'true');
    } else {
        adminField.style.display = 'none';
        adminInput.removeAttribute('required');
    }
}

function redirectForRole(role) {
    if (role === 'store') window.location.href = 'Store/dashboard.html';
    else if (role === 'client') window.location.href = 'client/clientDashboard.html';
    else if (role === 'runner') window.location.href = 'runner/runner-dashboard.html';
    else if (role === 'admin') window.location.href = 'admin/runner.html';
}


// Login handler (queries Supabase 'users' table)
document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const adminKey = document.getElementById('login-admin-key').value;

    if (role === 'admin' && adminKey !== ADMIN_KEY) {
        alert('Invalid Admin Key, Bes! You are not authorized.');
        return;
    }

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const supa = await window.supabaseClient.ensureSupabase();
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
        setCurrentUser(user);
        redirectForRole(role);
    } catch (err) {
        console.error(err);
        alert('Login error: ' + (err?.message || err));
    }
});

// Registration handler: inserts a row into 'users' table (make sure table exists in Supabase)
document.getElementById('register').addEventListener('submit', async function (e) {
    e.preventDefault();
    const role = document.getElementById('role-select').value;
    const adminKey = document.getElementById('admin-key').value;

    if (role === 'admin' && adminKey !== ADMIN_KEY) {
        alert('Invalid Admin Key, Bes! You are not authorized.');
        return;
    }

    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    const payload = { role, name, email, password };

    try {
        const supa = await window.supabaseClient.ensureSupabase();
        const { data: userData, error: userError } = await supa
            .from('users')
            .insert([payload])
            .select('*')
            .single();
        if (userError) throw userError;

        if (role === 'store') {
            await supa.from('stores').insert([
                {
                    owner_id: userData.id,
                    name,
                    email,
                    category: 'restaurants',
                    rating: 4.5,
                    delivery_time: '30-45 mins',
                    delivery_fee: 50,
                    min_order: 150,
                    published: false
                }
            ]);
        }

        setCurrentUser(userData);
        redirectForRole(role);
    } catch (err) {
        console.error(err);
        alert('Registration error: ' + (err?.message || err));
    }
});
