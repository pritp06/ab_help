/* ==========================================
   FLOATING COMPARE TRAY COMPONENT
   ========================================== */

import { CompareState } from '../state/compare.js';
import { MockDataService } from '../data/mock-service.js';

let trayEl = null;

export function initCompareTray() {
    createTrayDOM();
    updateTray();

    window.addEventListener('compareChanged', () => {
        updateTray();
    });
}

function createTrayDOM() {
    if (document.getElementById('compare-tray')) return;

    trayEl = document.createElement('div');
    trayEl.id = 'compare-tray';
    trayEl.className = 'compare-tray';

    document.body.appendChild(trayEl);
}

async function updateTray() {
    if (!trayEl) createTrayDOM();

    const slugs = CompareState.getAll();
    if (!slugs || slugs.length === 0) {
        trayEl.classList.remove('is-visible');
        return;
    }

    const courses = await MockDataService.getCoursesBySlugs(slugs);

    trayEl.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-small text-semibold">${courses.length} Selected</span>
            <div class="compare-tray-items">
                ${courses.map(c => `
                    <div class="compare-chip">
                        <span>${c.universityName.split(' ')[0]} · ${c.title.replace('MSc ', '')}</span>
                        <span class="compare-chip-remove" data-remove="${c.slug}">✕</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="flex items-center gap-2">
            <button class="btn btn-ghost btn-sm" id="compare-clear-all">Clear</button>
            <a href="/compare.html" class="btn btn-primary btn-sm">Compare (${courses.length}) →</a>
        </div>
    `;

    trayEl.classList.add('is-visible');

    // Remove event listener delegate
    trayEl.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.target.getAttribute('data-remove');
            CompareState.remove(slug);
        });
    });

    document.getElementById('compare-clear-all')?.addEventListener('click', () => {
        CompareState.clear();
    });
}
