/* ==========================================
   SHORTLIST WORKSPACE PAGE CONTROLLER
   ========================================== */

import { ShortlistState } from '../state/shortlist.js';
import { MockDataService } from '../data/mock-service.js';
import { calculateEligibility } from '../components/eligibility.js';
import { PlannerState } from '../state/planner.js';
import { showToast } from '../components/toast.js';

export async function initShortlistPage() {
    const container = document.getElementById('shortlist-content-mount');
    if (!container) return;

    const render = async () => {
        const slugs = ShortlistState.getAll();
        if (!slugs.length) {
            container.innerHTML = `
                <div class="card text-center" style="padding: var(--space-16);">
                    <h2 class="text-h2" style="margin-bottom: var(--space-3);">Your Shortlist is Empty</h2>
                    <p class="text-large text-secondary" style="margin-bottom: var(--space-6);">
                        Save programs while discovering courses to organize your application choices.
                    </p>
                    <a href="/courses.html" class="btn btn-primary btn-lg">Discover Courses →</a>
                </div>
            `;
            return;
        }

        const courses = await MockDataService.getCoursesBySlugs(slugs);

        // Group by eligibility fit
        const strong = [];
        const possible = [];
        const weak = [];

        courses.forEach(c => {
            const elig = calculateEligibility(c);
            if (elig.status === 'strong') strong.push(c);
            else if (elig.status === 'possible') possible.push(c);
            else weak.push(c);
        });

        container.innerHTML = `
            <div class="flex items-center justify-between" style="margin-bottom: var(--space-8);">
                <div>
                    <h1 class="text-h2">Shortlist Workspace</h1>
                    <p class="text-secondary">${courses.length} saved target programs categorized by academic fit</p>
                </div>
                <a href="/planner.html" class="btn btn-primary btn-sm">Go to Application Planner →</a>
            </div>

            ${renderCategoryGroup('Strong Matches', 'Highest probability based on your GPA and test scores', strong, 'badge-success')}
            ${renderCategoryGroup('Possible Matches', 'Good probability; minor prerequisites or score updates recommended', possible, 'badge-warning')}
            ${renderCategoryGroup('Reach / Challenging', 'Higher admission requirements or competitive selection process', weak, 'badge-neutral')}
        `;

        // Event listeners
        container.querySelectorAll('[data-shortlist-remove]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slug = e.currentTarget.getAttribute('data-shortlist-remove');
                ShortlistState.remove(slug);
                showToast('Removed from Shortlist', 'info');
                render();
            });
        });

        container.querySelectorAll('[data-add-planner]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const slug = e.currentTarget.getAttribute('data-add-planner');
                const course = await MockDataService.getCourseBySlug(slug);
                if (course) {
                    const added = PlannerState.addCourseToPlanner(course);
                    showToast(added ? 'Added to Application Planner' : 'Already in Application Planner', added ? 'success' : 'info');
                }
            });
        });
    };

    await render();
}

function renderCategoryGroup(title, subtitle, courses, badgeClass) {
    if (!courses.length) return '';

    return `
        <div style="margin-bottom: var(--space-10);">
            <div style="margin-bottom: var(--space-4);">
                <div class="flex items-center gap-3">
                    <h2 class="text-h3">${title}</h2>
                    <span class="badge ${badgeClass}">${courses.length}</span>
                </div>
                <p class="text-small text-secondary" style="margin-top: 2px;">${subtitle}</p>
            </div>

            <div class="grid grid-auto-fit-cards">
                ${courses.map(c => `
                    <div class="card card-hover flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                            <span class="badge badge-info">${c.degreeType}</span>
                            <button class="btn btn-ghost btn-sm" data-shortlist-remove="${c.slug}" style="color: var(--error);">✕ Remove</button>
                        </div>
                        <div>
                            <h3 class="text-h4">
                                <a href="/course.html?slug=${c.slug}">${c.title}</a>
                            </h3>
                            <div class="text-small text-secondary" style="margin-top: 4px;">
                                ${c.universityName} · ${c.city}, ${c.countryName}
                            </div>
                        </div>

                        <div class="flex flex-col gap-2" style="background-color: var(--bg-surface-elevated); padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.8125rem;">
                            <div class="flex justify-between">
                                <span class="text-muted">Tuition:</span>
                                <span class="text-semibold">${c.tuition}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted">Deadline:</span>
                                <span class="text-semibold">${c.deadline}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2" style="margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--border-subtle);">
                            <button class="btn btn-secondary btn-sm btn-full" data-add-planner="${c.slug}">
                                + Add to Planner
                            </button>
                            <a href="/course.html?slug=${c.slug}" class="btn btn-ghost btn-sm">Details →</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
