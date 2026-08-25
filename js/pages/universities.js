/* ==========================================
   QS 2026 TOP 250 UNIVERSITIES PAGE CONTROLLER
   ========================================== */

import { getTopUniversities } from '../data/university-data.js';
import { createRankingItemHTML } from '../components/ranking-item.js';
import { debounce } from '../utils/debounce.js';

let filterState = {
    maxRank: 250,
    query: ''
};

export async function initUniversitiesPage() {
    const mount = document.getElementById('qs-2026-rankings-mount');
    if (!mount) return;

    const searchInput = document.getElementById('qs-2026-search-input');
    const rangeBtns = document.querySelectorAll('.qs-2026-range-btn');

    // Read initial URL params
    const urlParams = new URLSearchParams(window.location.search);
    const initialRankParam = parseInt(urlParams.get('rank') || '250', 10);
    const initialSearchParam = urlParams.get('search') || '';

    if ([10, 50, 100, 200, 250].includes(initialRankParam)) {
        filterState.maxRank = initialRankParam;
    }
    if (initialSearchParam) {
        filterState.query = initialSearchParam;
        if (searchInput) searchInput.value = initialSearchParam;
    }

    // Set initial active state on range buttons
    updateRangeButtonsUI();

    async function renderList() {
        const items = await getTopUniversities({
            maxRank: filterState.maxRank,
            query: filterState.query
        });

        if (items.length === 0) {
            mount.innerHTML = `
                <div class="card card-body text-center" style="padding: var(--space-8);">
                    <p class="text-large font-bold" style="margin-bottom: var(--space-2);">No universities matched your search.</p>
                    <p class="text-secondary">Try searching for another university name or clear your filters.</p>
                </div>
            `;
            return;
        }

        const listHeaderHTML = `
            <div class="grid grid-cols-12 gap-4 items-center" style="padding: var(--space-4) var(--space-6); background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border); font-size: var(--text-xs); font-weight: var(--font-semibold); text-transform: uppercase; color: var(--color-text-secondary); letter-spacing: 0.05em;">
                <div class="col-span-3 md:col-span-2 text-center">Rank</div>
                <div class="col-span-9 md:col-span-8">University Name</div>
                <div class="hidden md:block md:col-span-2 text-right">Action</div>
            </div>
        `;

        const rowsHTML = items.map(item => createRankingItemHTML(item)).join('');

        mount.innerHTML = `
            <div class="card" style="overflow: hidden;">
                ${listHeaderHTML}
                <div class="ranking-items-container divide-y divide-border">
                    ${rowsHTML}
                </div>
            </div>
        `;
    }

    function updateUrlState() {
        const params = new URLSearchParams();
        if (filterState.maxRank < 250) {
            params.set('rank', filterState.maxRank.toString());
        }
        if (filterState.query.trim()) {
            params.set('search', filterState.query.trim());
        }
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState(null, '', newUrl);
    }

    function updateRangeButtonsUI() {
        rangeBtns.forEach(btn => {
            const btnRank = parseInt(btn.dataset.rank || '250', 10);
            if (btnRank === filterState.maxRank) {
                btn.classList.remove('btn-ghost');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-ghost');
            }
        });
    }

    // Event listeners
    searchInput?.addEventListener('input', debounce((e) => {
        filterState.query = e.target.value;
        updateUrlState();
        renderList();
    }, 150));

    rangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newRank = parseInt(btn.dataset.rank || '250', 10);
            if (filterState.maxRank === newRank) return;
            filterState.maxRank = newRank;
            updateRangeButtonsUI();
            updateUrlState();
            renderList();
        });
    });

    // Initial render
    await renderList();
}
