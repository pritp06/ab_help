/* ==========================================
   AUTHENTICATION & PROFILE API ENDPOINTS
   ========================================== */

import { apiRequest } from './client.js';

export async function registerUser(email, password, firstName = '', lastName = '') {
    return apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: {
            email,
            password,
            first_name: firstName,
            last_name: lastName
        }
    });
}

export async function loginUser(email, password) {
    return apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password }
    });
}

export async function logoutUser() {
    return apiRequest('/api/v1/auth/logout', {
        method: 'POST'
    });
}

export async function getCurrentUser() {
    return apiRequest('/api/v1/auth/me', {
        method: 'GET'
    });
}

export async function getUserProfile() {
    return apiRequest('/api/v1/profile', {
        method: 'GET'
    });
}

export async function updateUserProfile(profileData) {
    return apiRequest('/api/v1/profile', {
        method: 'PUT',
        body: profileData
    });
}
