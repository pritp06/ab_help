/* ==========================================
   REST API CLIENT (FETCH WITH COOKIE CREDENTIALS)
   ========================================== */

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const config = {
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        credentials: 'include', // Include HTTP-only session cookies
        ...options
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        // Return null for unauthenticated me calls if server down
        if (endpoint.includes('/auth/me')) return null;
        throw err;
    }
}
