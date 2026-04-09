const authForm = document.getElementById('auth-form');
const authCard = document.getElementById('auth-card');
const userDashboard = document.getElementById('user-dashboard');
const displayUsername = document.getElementById('display-username');
const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const messageEl = document.getElementById('message');
const logoutBtn = document.getElementById('logout-btn');

let isLogin = true;

// Toggle between Login and Signup
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Please enter your details to sign in';
        btnText.textContent = 'Sign In';
        toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Sign up</a>`;
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join us today and enjoy premium access';
        btnText.textContent = 'Sign Up';
        toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Sign in</a>`;
    }
    
    // Re-attach listener to the new link
    document.getElementById('toggle-link').addEventListener('click', arguments.callee);
    messageEl.textContent = '';
    messageEl.className = 'message';
});

// Handle Form Submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    setLoading(true);
    messageEl.textContent = '';
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            if (isLogin) {
                // Successful login
                showDashboard(data.username);
            } else {
                // Successful signup, switch to login
                setTimeout(() => {
                    toggleLink.click();
                }, 1500);
            }
        } else {
            showMessage(data.message || 'Something went wrong', 'error');
        }
    } catch (err) {
        showMessage('Connection error. Is the server running?', 'error');
    } finally {
        setLoading(false);
    }
});

// Logout handle
logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/auth/logout');
        location.reload();
    } catch (err) {
        console.error('Logout failed');
    }
});

// Check if already logged in on load
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            showDashboard(data.user.username);
        }
    } catch (err) {
        // Not logged in or server down - stay on login page
    }
}

function showDashboard(username) {
    displayUsername.textContent = username;
    authCard.classList.add('hidden');
    userDashboard.classList.remove('hidden');
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Check auth status on startup
checkAuth();
