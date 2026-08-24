/* ==========================================
   AUTHENTICATION STATE MANAGER (BACKEND INTEGRATED)
   ========================================== */

import { getCurrentUser, loginUser, registerUser, logoutUser } from '../api/auth.js';

let currentUser = null;
let isLoading = true;

export const AuthState = {
    async loadCurrentUser() {
        isLoading = true;
        try {
            const res = await getCurrentUser();
            currentUser = res?.data?.user || null;
        } catch (e) {
            currentUser = null;
        } finally {
            isLoading = false;
            window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
        }
        return currentUser;
    },

    getUser() {
        return currentUser;
    },

    isLoggedIn() {
        return !!currentUser;
    },

    isLoading() {
        return isLoading;
    },

    async login(email, password) {
        const res = await loginUser(email, password);
        currentUser = res?.data?.user || null;
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
        return currentUser;
    },

    async signup(firstName, lastName, email, password) {
        const res = await registerUser(email, password, firstName, lastName);
        currentUser = res?.data?.user || null;
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: currentUser } }));
        return currentUser;
    },

    async logout() {
        try {
            await logoutUser();
        } catch (e) {
            // Proceed to clear local state even if session already expired
        } finally {
            currentUser = null;
            window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));
        }
    }
};
