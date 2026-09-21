/* ==========================================
   AUTH STATE MANAGER
   ========================================== */

import { apiRequest } from '../api/client.js';

export const AuthState = {
    user: null,
    isAuthenticated: false,

    async loadCurrentUser() {
        try {
            const res = await apiRequest('/api/v1/auth/me', { method: 'GET' });
            if (res && res.data) {
                this.user = res.data;
                this.isAuthenticated = true;
            } else {
                this.user = null;
                this.isAuthenticated = false;
            }
        } catch (e) {
            this.user = null;
            this.isAuthenticated = false;
        }
        return this.user;
    },

    getUser() {
        return this.user;
    }
};
