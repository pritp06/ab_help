/* ==========================================
   HOMEPAGE CONTROLLER (TOP UNIVERSITIES PREVIEW)
   ========================================== */

import { getTopUniversities } from '../api/rankings.js';
import { UNIVERSITIES } from '../data/universities-data.js';

export async function initHomePage() {
    const topMount = document.getElementById('home-top-universities-mount');
    if (!topMount) return;

    try {
        const res = await getTopUniversities({ provider: 'QS', year: 2027, limit: 5 });
        const items = res?.data || [];

        if (items.length > 0) {
            topMount.innerHTML = `
                <div class="card" style="overflow: hidden;">
                    <div style="padding: var(--space-6); background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border);" class="flex items-center justify-between">
                        <div>
                            <span class="badge badge-accent mb-1">QS World University Rankings 2027</span>
                            <h3 class="text-h3">Global Top 5 Preview</h3>
                        </div>
                        <a href="/universities.html" class="btn btn-primary btn-sm">
                            View Top 200 →
                        </a>
                    </div>
                    <div class="divide-y divide-border">
                        ${items.map(item => {
                            const uni = item.university;
                            const country = uni.country;
                            return `
                                <div class="flex items-center justify-between" style="padding: var(--space-4) var(--space-6);">
                                    <div class="flex items-center gap-4">
                                        <div class="text-h3 font-bold text-accent" style="min-width: 40px;">
                                            ${item.rank_display || item.rank}
                                        </div>
                                        <div>
                                            <a href="/university.html?slug=${uni.slug}" class="text-large font-bold" style="text-decoration: none; color: var(--color-text-primary);">
                                                ${uni.name}
                                            </a>
                                            <div class="text-caption text-secondary">
                                                ${uni.city ? `${uni.city}, ` : ''}${country ? country.name : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-large font-bold text-accent">${item.score !== null ? item.score : '100'}</div>
                                        <div class="text-caption text-secondary" style="font-size: 10px;">QS Score</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    } catch (e) {
        // Fallback to static preview if server offline
        topMount.innerHTML = `
            <div class="card card-body text-center">
                <a href="/universities.html" class="btn btn-primary">Explore Top 200 Universities →</a>
            </div>
        `;
    }
}
