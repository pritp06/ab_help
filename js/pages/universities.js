/* ==========================================
   QS TOP 200 UNIVERSITIES PAGE CONTROLLER
   ========================================== */

import { getTopUniversities } from '../api/rankings.js';
import { debounce } from '../utils/debounce.js';
import { showToast } from '../components/toast.js';

let currentLimit = 200;

export async function initUniversitiesPage() {
    const mount = document.getElementById('qs-rankings-mount');
    if (!mount) return;

    const searchInput = document.getElementById('qs-search-input');
    const countrySelect = document.getElementById('qs-country-select');
    const regionSelect = document.getElementById('qs-region-select');
    const rangeBtns = document.querySelectorAll('.qs-range-btn');

    async function loadAndRender() {
        mount.innerHTML = `
            <div class="flex flex-col gap-3" style="padding: var(--space-8); text-align: center;">
                <div class="spinner" style="margin: 0 auto;"></div>
                <p class="text-secondary">Loading official QS Rankings from database...</p>
            </div>
        `;

        try {
            const queryOptions = {
                provider: 'QS',
                year: 2027,
                limit: currentLimit,
                search: searchInput?.value?.trim() || '',
                country: countrySelect?.value || '',
                region: regionSelect?.value || ''
            };

            const res = await getTopUniversities(queryOptions);
            const items = res?.data || [];
            const meta = res?.meta || {};

            if (items.length === 0) {
                mount.innerHTML = `
                    <div class="card card-body text-center" style="padding: var(--space-8);">
                        <p class="text-large font-bold" style="margin-bottom: var(--space-2);">No universities matched your search filter.</p>
                        <p class="text-secondary">Try adjusting your search keywords, region, or country filter.</p>
                    </div>
                `;
                return;
            }

            // Render Editorial Ranking List
            const html = `
                <div class="card" style="overflow: hidden;">
                    <!-- Table Header -->
                    <div class="grid grid-cols-12 gap-4 items-center" style="padding: var(--space-4) var(--space-6); background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border); font-size: var(--text-xs); font-weight: var(--font-semibold); text-transform: uppercase; color: var(--color-text-secondary); letter-spacing: 0.05em;">
                        <div class="col-span-2 md:col-span-1 text-center">Rank</div>
                        <div class="col-span-7 md:col-span-7">University & Institution</div>
                        <div class="col-span-3 md:col-span-2 text-right">QS Score</div>
                        <div class="hidden md:block md:col-span-2 text-right">Action</div>
                    </div>

                    <!-- Ranking List Rows -->
                    <div class="divide-y divide-border">
                        ${items.map(item => {
                            const uni = item.university;
                            const country = uni.country;
                            const formattedRank = item.rank < 10 ? `0${item.rank}` : `${item.rank}`;
                            const displayRank = item.rank_status === 'tied' ? `=0${item.rank}`.replace('=01', '=01').replace('=02', '=02') : formattedRank;
                            const isTied = item.rank_status === 'tied';

                            return `
                                <div class="grid grid-cols-12 gap-4 items-center ranking-row-hover" style="padding: var(--space-4) var(--space-6); transition: background-color var(--transition-fast);">
                                    <!-- Rank Number -->
                                    <div class="col-span-2 md:col-span-1 text-center">
                                        <span class="text-h3" style="font-weight: var(--font-bold); color: ${isTied ? 'var(--color-accent-primary)' : 'var(--color-text-primary)'}; font-feature-settings: 'tnum';">
                                            ${item.rank_display || displayRank}
                                        </span>
                                        ${isTied ? `<div class="text-caption" style="font-size: 10px; color: var(--color-accent-primary);">Tied</div>` : ''}
                                    </div>

                                    <!-- University Details -->
                                    <div class="col-span-7 md:col-span-7">
                                        <a href="/university.html?slug=${uni.slug}" class="text-large font-bold" style="color: var(--color-text-primary); text-decoration: none;">
                                            ${uni.name}
                                        </a>
                                        <div class="flex items-center gap-2 text-caption text-secondary" style="margin-top: 2px;">
                                            <span>${uni.city ? `${uni.city} · ` : ''}${country ? country.name : ''}</span>
                                            ${uni.institution_type ? `<span class="badge badge-neutral" style="font-size: 10px;">${uni.institution_type}</span>` : ''}
                                        </div>
                                    </div>

                                    <!-- QS Score -->
                                    <div class="col-span-3 md:col-span-2 text-right">
                                        <div class="text-large font-bold" style="color: var(--color-accent-primary);">
                                            ${item.score !== null ? item.score : 'N/A'}
                                        </div>
                                        <div class="text-caption text-secondary" style="font-size: 11px;">Overall Score</div>
                                    </div>

                                    <!-- Action -->
                                    <div class="hidden md:block md:col-span-2 text-right">
                                        <a href="/university.html?slug=${uni.slug}" class="btn btn-outline btn-sm">
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            mount.innerHTML = html;
        } catch (err) {
            showToast('Failed to load ranking data from server.', 'error');
            mount.innerHTML = `
                <div class="card card-body text-center" style="padding: var(--space-8);">
                    <p class="text-large text-danger" style="margin-bottom: var(--space-4);">We couldn’t load the QS Rankings right now.</p>
                    <button class="btn btn-primary" id="qs-retry-btn">Try Again</button>
                </div>
            `;
            document.getElementById('qs-retry-btn')?.addEventListener('click', loadAndRender);
        }
    }

    // Event listeners
    searchInput?.addEventListener('input', debounce(loadAndRender, 300));
    countrySelect?.addEventListener('change', loadAndRender);
    regionSelect?.addEventListener('change', loadAndRender);

    rangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rangeBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-ghost');
            });
            btn.classList.remove('btn-ghost');
            btn.classList.add('btn-primary');

            currentLimit = parseInt(btn.dataset.limit || '200', 10);
            loadAndRender();
        });
    });

    // Initial load
    await loadAndRender();
}
