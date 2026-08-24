/* ==========================================
   UNIVERSAL API CLIENT WITH CREDENTIALS
   ========================================== */

const API_BASE_URL = 'http://localhost:8000';

export async function apiRequest(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const config = {
        ...options,
        credentials: 'include', // Includes HTTP-only session cookie
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = data?.error?.message || `HTTP ${response.status}: Request failed`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.code = data?.error?.code || 'UNKNOWN_ERROR';
            throw error;
        }

        return data;
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            const networkErr = new Error('We couldn’t connect to the StudyBuddy server. Please check your connection.');
            networkErr.status = 0;
            throw networkErr;
        }
        throw err;
    }
}
