/* ==========================================
   COURSES DISCOVERY PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';
import { renderFilterSidebar } from '../components/filters.js';
import { ShortlistState } from '../state/shortlist.js';
import { CompareState } from '../state/compare.js';
import { showToast } from '../components/toast.js';

export async function initCoursesPage() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;

    let currentFilters = {};

    const fetchAndRender = async () => {
        const courses = await MockDataService.getCourses(currentFilters);
        renderCoursesGrid(grid, courses);
    };

    renderFilterSidebar({
        containerId: 'courses-filters-mount',
        onFilterChange: (newFilters) => {
            currentFilters = newFilters;
            fetchAndRender();
        }
    });

    // Search input
    const searchInput = document.getElementById('course-search-input');
    searchInput?.addEventListener('input', (e) => {
        currentFilters.query = e.target.value;
        fetchAndRender();
    });

    // Shortlist / Compare events sync
    window.addEventListener('shortlistChanged', fetchAndRender);
    window.addEventListener('compareChanged', fetchAndRender);

    await fetchAndRender();
}

function renderCoursesGrid(container, courses) {
    if (!courses.length) {
        container.innerHTML = `
            <div class="card text-center" style="padding: var(--space-12);">
                <h3 class="text-h3" style="margin-bottom: var(--space-2);">No Courses Found</h3>
                <p class="text-secondary">Try adjusting your filter selection or clear your search keyword.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(c => {
        const isSaved = ShortlistState.has(c.slug);
        const isCompared = CompareState.has(c.slug);

        return `
            <div class="card card-hover flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <span class="badge badge-info">${c.degreeType}</span>
                    <span class="badge badge-neutral">${c.language}</span>
                </div>

                <div>
                    <h2 class="text-h3" style="margin-bottom: 4px;">
                        <a href="/course.html?slug=${c.slug}">${c.title}</a>
                    </h2>
                    <div class="text-small text-secondary">
                        <a href="/university.html?slug=${c.universitySlug}">${c.universityName}</a> · ${c.city}, ${c.countryName}
                    </div>
                </div>

                <div class="flex flex-col gap-2" style="background-color: var(--bg-surface-elevated); padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.8125rem;">
                    <div class="flex justify-between">
                        <span class="text-muted">Duration:</span>
                        <span class="text-semibold">${c.duration}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Tuition:</span>
                        <span class="text-semibold">${c.tuition}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted">Deadline:</span>
                        <span class="text-semibold">${c.deadline}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--border-subtle);">
                    <div class="flex items-center gap-2">
                        <button class="btn btn-secondary btn-sm ${isSaved ? 'btn-primary' : ''}" data-save="${c.slug}">
                            ${isSaved ? '♥ Saved' : '♡ Save'}
                        </button>
                        <button class="btn btn-outline btn-sm ${isCompared ? 'btn-primary' : ''}" data-compare="${c.slug}">
                            ${isCompared ? '✓ Comparing' : '+ Compare'}
                        </button>
                    </div>
                    <a href="/course.html?slug=${c.slug}" class="btn btn-ghost btn-sm">Details →</a>
                </div>
            </div>
        `;
    }).join('');

    // Event listeners
    container.querySelectorAll('[data-save]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.currentTarget.getAttribute('data-save');
            const added = ShortlistState.toggle(slug);
            showToast(added ? 'Added to Shortlist' : 'Removed from Shortlist', added ? 'success' : 'info');
        });
    });

    container.querySelectorAll('[data-compare]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.currentTarget.getAttribute('data-compare');
            const res = CompareState.toggle(slug);
            if (!res.success) {
                showToast(res.reason, 'warning');
            } else {
                showToast(res.added ? 'Added to Comparison' : 'Removed from Comparison', res.added ? 'success' : 'info');
            }
        });
    });
}
