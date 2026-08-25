/* ==========================================
   UNIVERSITY RANKINGS REST API CLIENT
   ========================================== */

import { apiRequest } from './client.js';

export async function getTopUniversities(options = {}) {
    const params = new URLSearchParams();
    if (options.provider) params.append('provider', options.provider);
    if (options.year) params.append('year', options.year);
    if (options.limit) params.append('limit', options.limit);
    if (options.page) params.append('page', options.page);
    if (options.country) params.append('country', options.country);
    if (options.region) params.append('region', options.region);
    if (options.search) params.append('search', options.search);

    const queryString = params.toString();
    const path = `/api/v1/universities/top${queryString ? `?${queryString}` : ''}`;
    return apiRequest(path, { method: 'GET' });
}

export async function getUniversityDetail(slug) {
    return apiRequest(`/api/v1/universities/${slug}`, { method: 'GET' });
}
