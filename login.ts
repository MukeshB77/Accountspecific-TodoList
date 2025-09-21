// Define user interface
interface User {
    name: string;
    password: string;
    createdAt: string;
}

// Define users object type
interface Users {
    [username: string]: User;
}

// Toggle between login and signup forms
(() => {
    const authSwitchLink = document.getElementById('auth-switch-link') as HTMLAnchorElement;
    const formTitle = document.getElementById('form-title') as HTMLHeadingElement;
    const formSubtitle = document.getElementById('form-subtitle') as HTMLParagraphElement;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const authSwitchText = document.getElementById('auth-switch-text') as HTMLSpanElement;
    const nameGroup = document.getElementById('name-group') as HTMLDivElement;
    const confirmPasswordGroup = document.getElementById('confirm-password-group') as HTMLDivElement;
    const loginOptions = document.getElementById('login-options') as HTMLDivElement;
    let isLoginMode: boolean = true;

    authSwitchLink.addEventListener('click', function(e: Event) {
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
        } else {
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
        const errorDiv = document.getElementById('error-message') as HTMLDivElement;
        const successDiv = document.getElementById('success-message') as HTMLDivElement;
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
    });

    // Handle form submission
    document.getElementById('authForm')!.addEventListener('submit', function(e: Event) {
        e.preventDefault();
        const errorDiv = document.getElementById('error-message') as HTMLDivElement;
        const successDiv = document.getElementById('success-message') as HTMLDivElement;
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        if (isLoginMode) {
            // Login logic
            const usernameInput = document.getElementById('username') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Simple validation
            if (!username || !password) {
                errorDiv.textContent = 'Please fill in all fields.';
                errorDiv.style.display = 'block';
                return;
            }
            
            // Check if user exists
            const users: Users = JSON.parse(localStorage.getItem('users') || '{}');
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
            window.location.href = 'login.html';
            
        } else {
            // Registration logic
            const nameInput = document.getElementById('name') as HTMLInputElement;
            const usernameInput = document.getElementById('username') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
            
            const name = nameInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            // Validation
            if (!name || !username || !password || !confirmPassword) {
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
            const users: Users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username]) {
                errorDiv.textContent = 'An account with this username already exists.';
                errorDiv.style.display = 'block';
                return;
            }
            
            // Create new user
            users[username] = {
                name: name,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Initialize empty task lists for new user
            localStorage.setItem(`tasks_${username}`, JSON.stringify([]));
            localStorage.setItem(`allTasks_${username}`, JSON.stringify([]));
            
            // Show success message
            successDiv.textContent = 'Account created successfully! You can now login.';
            successDiv.style.display = 'block';
            
            // Switch to login mode
            setTimeout(() => {
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
})();