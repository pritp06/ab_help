/* ==========================================
   UNIVERSITIES LIST PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';
import { renderFilterSidebar } from '../components/filters.js';
import { ShortlistState } from '../state/shortlist.js';

export async function initUniversitiesPage() {
    const grid = document.getElementById('universities-grid');
    if (!grid) return;

    let currentFilters = {};
    const fetchAndRender = async () => {
        const unis = await MockDataService.getUniversities(currentFilters);
        renderUniversitiesGrid(grid, unis);
    };

    renderFilterSidebar({
        containerId: 'universities-filters-mount',
        onFilterChange: (newFilters) => {
            currentFilters = newFilters;
            fetchAndRender();
        }
    });

    // Search input listener
    const searchInput = document.getElementById('uni-search-input');
    searchInput?.addEventListener('input', (e) => {
        currentFilters.query = e.target.value;
        fetchAndRender();
    });

    await fetchAndRender();
}

function renderUniversitiesGrid(container, unis) {
    if (!unis.length) {
        container.innerHTML = `
            <div class="card text-center" style="padding: var(--space-12);">
                <h3 class="text-h3" style="margin-bottom: var(--space-2);">No Universities Found</h3>
                <p class="text-secondary">Try adjusting your filters or search keywords.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = unis.map(u => `
        <div class="card card-hover flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-h3" style="margin-bottom: 2px;">
                        <a href="/university.html?slug=${u.slug}">${u.name}</a>
                    </h2>
                    <div class="text-small text-secondary">${u.city}, ${u.countryName} · ${u.type}</div>
                </div>
                <span class="badge badge-neutral">QS #${u.qsWorldRanking}</span>
            </div>

            <p class="text-body text-secondary">${u.overview}</p>

            <div class="flex flex-wrap gap-2">
                ${u.popularFields.map(f => `<span class="badge badge-neutral">${f}</span>`).join('')}
            </div>

            <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
                <span class="text-small text-muted">${u.tuitionNote}</span>
                <a href="/university.html?slug=${u.slug}" class="btn btn-secondary btn-sm">Explore Courses →</a>
            </div>
        </div>
    `).join('');
}
