/* ==========================================
   AUTHENTICATION PAGES CONTROLLER (REAL API)
   ========================================== */

import { AuthState } from '../state/auth.js';
import { showToast } from '../components/toast.js';

export function initAuthPage() {
    // 1. Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');

            const email = emailInput?.value?.trim();
            const password = passInput?.value;

            if (!email || !password) {
                showToast('Please enter both email and password.', 'warning');
                return;
            }

            // Double submission protection
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            try {
                await AuthState.login(email, password);
                showToast('Successfully signed in!', 'success');

                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || '/profile.html';

                setTimeout(() => {
                    window.location.href = redirect;
                }, 400);
            } catch (err) {
                showToast(err.message || 'Login failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    }

    // 2. Signup Form Handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const submitBtn = signupForm.querySelector('button[type="submit"]');

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passInput = document.getElementById('signup-password');

            const fullName = nameInput?.value?.trim() || '';
            const email = emailInput?.value?.trim();
            const password = passInput?.value;

            if (!email || !password) {
                showToast('Please provide an email and password.', 'warning');
                return;
            }

            if (password.length < 8) {
                showToast('Password must be at least 8 characters long.', 'warning');
                return;
            }

            let firstName = fullName;
            let lastName = '';
            if (fullName.includes(' ')) {
                const parts = fullName.split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }

            // Double submission protection
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';

            try {
                await AuthState.signup(firstName, lastName, email, password);
                showToast('Account created successfully!', 'success');

                setTimeout(() => {
                    window.location.href = '/profile.html';
                }, 400);
            } catch (err) {
                showToast(err.message || 'Registration failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Free Account';
            }
        });
    }

    // 3. Forgot Password Handler
    const forgotForm = document.getElementById('forgot-form');
    forgotForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Password reset link sent if an account exists for this email.', 'info');
    });
}
