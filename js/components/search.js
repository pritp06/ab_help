/* ==========================================
   GLOBAL SEARCH OVERLAY COMPONENT (CMD + K)
   ========================================== */

import { MockDataService } from '../data/mock-service.js';
import { debounce } from '../utils/debounce.js';

let modalBackdrop = null;
let searchInput = null;
let resultsContainer = null;
let selectedIndex = -1;

export function initGlobalSearch() {
    createSearchModalDOM();
    bindGlobalKeybindings();
}

function createSearchModalDOM() {
    if (document.getElementById('global-search-backdrop')) return;

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'global-search-backdrop';
    modalBackdrop.className = 'search-modal-backdrop';

    modalBackdrop.innerHTML = `
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="Global Search">
            <div class="search-modal-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" class="search-modal-input" id="global-search-input" placeholder="Search countries, universities, or courses..." autocomplete="off" />
                <button class="btn-ghost btn-sm" id="global-search-close" aria-label="Close search">Esc</button>
            </div>
            <div class="search-modal-results" id="global-search-results">
                <div style="padding: var(--space-8); text-align: center; color: var(--text-muted);">
                    Type a query to search programs, universities, or countries...
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalBackdrop);

    searchInput = document.getElementById('global-search-input');
    resultsContainer = document.getElementById('global-search-results');

    // Close listeners
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeSearchModal();
    });

    document.getElementById('global-search-close')?.addEventListener('click', closeSearchModal);

    // Live search input
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (!query.trim()) {
            resultsContainer.innerHTML = `
                <div style="padding: var(--space-8); text-align: center; color: var(--text-muted);">
                    Type a query to search programs, universities, or countries...
                </div>
            `;
            return;
        }

        const data = await MockDataService.searchAll(query);
        renderSearchResults(data, query);
    }, 200));

    // Keyboard navigation inside modal
    searchInput.addEventListener('keydown', (e) => {
        const items = resultsContainer.querySelectorAll('.search-result-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            }
        }
    });
}

function updateSelection(items) {
    items.forEach((item, idx) => {
        if (idx === selectedIndex) {
            item.classList.add('is-selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('is-selected');
        }
    });
}

function renderSearchResults(data, query) {
    selectedIndex = -1;
    let html = '';

    const hasResults = data.countries.length || data.universities.length || data.courses.length;
    if (!hasResults) {
        resultsContainer.innerHTML = `
            <div style="padding: var(--space-8); text-align: center; color: var(--text-muted);">
                No results found for "${query}"
            </div>
        `;
        return;
    }

    if (data.countries.length > 0) {
        html += `<div class="search-group-title">Countries</div>`;
        data.countries.forEach(c => {
            html += `
                <a href="/country.html?slug=${c.slug}" class="search-result-item">
                    <div>
                        <div class="search-result-title">${c.flag} ${c.name}</div>
                        <div class="search-result-sub">${c.region} · ${c.universitiesCount}+ Universities</div>
                    </div>
                    <span class="text-meta">Explore →</span>
                </a>
            `;
        });
    }

    if (data.universities.length > 0) {
        html += `<div class="search-group-title">Universities</div>`;
        data.universities.forEach(u => {
            html += `
                <a href="/university.html?slug=${u.slug}" class="search-result-item">
                    <div>
                        <div class="search-result-title">${u.name}</div>
                        <div class="search-result-sub">${u.city}, ${u.countryName} · QS #${u.qsWorldRanking}</div>
                    </div>
                    <span class="text-meta">View Uni →</span>
                </a>
            `;
        });
    }

    if (data.courses.length > 0) {
        html += `<div class="search-group-title">Courses</div>`;
        data.courses.forEach(co => {
            html += `
                <a href="/course.html?slug=${co.slug}" class="search-result-item">
                    <div>
                        <div class="search-result-title">${co.title}</div>
                        <div class="search-result-sub">${co.universityName} · ${co.duration} · ${co.language}</div>
                    </div>
                    <span class="text-meta">View Course →</span>
                </a>
            `;
        });
    }

    resultsContainer.innerHTML = html;
}

export function openSearchModal() {
    if (!modalBackdrop) createSearchModalDOM();
    modalBackdrop.classList.add('is-open');
    setTimeout(() => searchInput.focus(), 50);
}

export function closeSearchModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
}

function bindGlobalKeybindings() {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (modalBackdrop && modalBackdrop.classList.contains('is-open')) {
                closeSearchModal();
            } else {
                openSearchModal();
            }
        }
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
            closeSearchModal();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('#nav-search-trigger')) {
            openSearchModal();
        }
    });
}
