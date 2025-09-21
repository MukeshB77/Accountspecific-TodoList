// Toggle between login and signup forms
var authSwitchLink = document.getElementById('auth-switch-link');
var formTitle = document.getElementById('form-title');
var formSubtitle = document.getElementById('form-subtitle');
var submitBtn = document.getElementById('submit-btn');
var authSwitchText = document.getElementById('auth-switch-text');
var nameGroup = document.getElementById('name-group');
var confirmPasswordGroup = document.getElementById('confirm-password-group');
var loginOptions = document.getElementById('login-options');
var isLoginMode = true;
authSwitchLink.addEventListener('click', function (e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to manage your tasks';
        submitBtn.textContent = 'Sign In';
        authSwitchText.textContent = "Don't have an account?";
        authSwitchLink.textContent = 'Sign up';
        nameGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        loginOptions.style.display = 'flex';
    }
    else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Sign up to get started with your tasks';
        submitBtn.textContent = 'Sign Up';
        authSwitchText.textContent = "Already have an account?";
        authSwitchLink.textContent = 'Sign in';
        nameGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        loginOptions.style.display = 'none';
    }
    // Clear error messages
    var errorDiv = document.getElementById('error-message');
    var successDiv = document.getElementById('success-message');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
});
// Handle form submission
document.getElementById('authForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var errorDiv = document.getElementById('error-message');
    var successDiv = document.getElementById('success-message');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    if (isLoginMode) {
        // Login logic
        var usernameInput = document.getElementById('username');
        var passwordInput = document.getElementById('password');
        var username = usernameInput.value.trim();
        var password = passwordInput.value.trim();
        // Simple validation
        if (!username || !password) {
            errorDiv.textContent = 'Please fill in all fields.';
            errorDiv.style.display = 'block';
            return;
        }
        // Check if user exists
        var users = JSON.parse(localStorage.getItem('users') || '{}');
        if (!users[username]) {
            errorDiv.textContent = 'No account found with this username.';
            errorDiv.style.display = 'block';
            return;
        }
        // Check password
        if (users[username].password !== password) {
            errorDiv.textContent = 'Incorrect password.';
            errorDiv.style.display = 'block';
            return;
        }
        // Login successful
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    }
    else {
        // Registration logic
        var nameInput = document.getElementById('name');
        var usernameInput = document.getElementById('username');
        var passwordInput = document.getElementById('password');
        var confirmPasswordInput = document.getElementById('confirm-password');
        var name_1 = nameInput.value.trim();
        var username = usernameInput.value.trim();
        var password = passwordInput.value.trim();
        var confirmPassword = confirmPasswordInput.value.trim();
        // Validation
        if (!name_1 || !username || !password || !confirmPassword) {
            errorDiv.textContent = 'Please fill in all fields.';
            errorDiv.style.display = 'block';
            return;
        }
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match.';
            errorDiv.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters.';
            errorDiv.style.display = 'block';
            return;
        }
        // Check if user already exists
        var users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[username]) {
            errorDiv.textContent = 'An account with this username already exists.';
            errorDiv.style.display = 'block';
            return;
        }
        // Create new user
        users[username] = {
            name: name_1,
            password: password,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify(users));
        // Initialize empty task lists for new user
        localStorage.setItem("tasks_".concat(username), JSON.stringify([]));
        localStorage.setItem("allTasks_".concat(username), JSON.stringify([]));
        // Show success message
        successDiv.textContent = 'Account created successfully! You can now login.';
        successDiv.style.display = 'block';
        // Switch to login mode
        setTimeout(function () {
            isLoginMode = true;
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Sign in to manage your tasks';
            submitBtn.textContent = 'Sign In';
            authSwitchText.textContent = "Don't have an account?";
            authSwitchLink.textContent = 'Sign up';
            nameGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';
            loginOptions.style.display = 'flex';
            successDiv.style.display = 'none';
        }, 2000);
    }
});
