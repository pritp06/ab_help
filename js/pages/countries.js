/* ==========================================
   COUNTRIES GRID PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';

export async function initCountriesPage() {
    const grid = document.getElementById('countries-grid');
    if (!grid) return;

    const countries = await MockDataService.getCountries();
    renderCountriesGrid(grid, countries);

    // Region filter buttons
    document.querySelectorAll('[data-region]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelectorAll('[data-region]').forEach(b => b.classList.remove('btn-primary'));
            document.querySelectorAll('[data-region]').forEach(b => b.classList.add('btn-ghost'));
            
            btn.classList.remove('btn-ghost');
            btn.classList.add('btn-primary');

            const region = btn.getAttribute('data-region');
            const filtered = await MockDataService.getCountries({ region });
            renderCountriesGrid(grid, filtered);
        });
    });
}

function renderCountriesGrid(container, countries) {
    if (!countries.length) {
        container.innerHTML = `<div class="text-large text-muted">No countries found matching region.</div>`;
        return;
    }

    container.innerHTML = countries.map(c => `
        <a href="/country.html?slug=${c.slug}" class="card card-hover flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <span style="font-size: 2.5rem;">${c.flag}</span>
                <span class="badge badge-neutral">${c.region}</span>
            </div>
            <div>
                <h2 class="text-h3" style="margin-bottom: var(--space-1);">${c.name}</h2>
                <p class="text-small text-secondary">${c.overview}</p>
            </div>
            <div class="flex flex-col gap-2" style="background-color: var(--bg-surface-elevated); padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.8125rem;">
                <div class="flex justify-between">
                    <span class="text-muted">Public Tuition:</span>
                    <span class="text-semibold">${c.tuitionRange}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Living Costs:</span>
                    <span class="text-semibold">${c.livingCosts}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted">Post-Study Visa:</span>
                    <span class="text-semibold">${c.postStudyWorkVisa}</span>
                </div>
            </div>
            <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-2);">
                <span class="text-meta">${c.universitiesCount}+ Universities · ${c.englishProgramsCount}+ Courses</span>
                <span class="text-small text-semibold" style="color: var(--brand-blue);">Explore →</span>
            </div>
        </a>
    `).join('');
}
