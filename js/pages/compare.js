/* ==========================================
   MULTI-COURSE COMPARE PAGE CONTROLLER
   ========================================== */

import { CompareState } from '../state/compare.js';
import { MockDataService } from '../data/mock-service.js';
import { showToast } from '../components/toast.js';

export async function initComparePage() {
    const container = document.getElementById('compare-content-mount');
    if (!container) return;

    const render = async () => {
        const slugs = CompareState.getAll();
        if (!slugs.length) {
            container.innerHTML = `
                <div class="card text-center" style="padding: var(--space-16);">
                    <h2 class="text-h2" style="margin-bottom: var(--space-3);">No Courses Selected for Comparison</h2>
                    <p class="text-large text-secondary" style="margin-bottom: var(--space-6);">
                        Add up to 3 courses to compare tuition, requirements, IELTS, GRE, and deadlines side by side.
                    </p>
                    <a href="/courses.html" class="btn btn-primary btn-lg">Explore Courses →</a>
                </div>
            `;
            return;
        }

        const courses = await MockDataService.getCoursesBySlugs(slugs);

        container.innerHTML = `
            <div class="flex items-center justify-between" style="margin-bottom: var(--space-6);">
                <div>
                    <h1 class="text-h2">Course Comparison Matrix</h1>
                    <p class="text-secondary">Comparing ${courses.length} selected programs</p>
                </div>
                <button class="btn btn-ghost btn-sm" id="compare-clear-btn">Clear All</button>
            </div>

            <div class="compare-table-wrapper">
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th>Specification</th>
                            ${courses.map(c => `
                                <th>
                                    <div class="flex flex-col gap-2">
                                        <a href="/course.html?slug=${c.slug}" class="text-h4 hover-link">${c.title}</a>
                                        <div class="text-small text-secondary">${c.universityName}</div>
                                        <button class="btn btn-ghost btn-sm" data-remove-compare="${c.slug}" style="margin-top: 4px; align-self: flex-start; color: var(--error);">
                                            ✕ Remove
                                        </button>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Country & City</td>
                            ${courses.map(c => `<td>${c.city}, ${c.countryName}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Degree Level</td>
                            ${courses.map(c => `<td><span class="badge badge-info">${c.degreeType}</span></td>`).join('')}
                        </tr>
                        <tr>
                            <td>Duration</td>
                            ${courses.map(c => `<td>${c.duration}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Teaching Language</td>
                            ${courses.map(c => `<td>${c.language}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Annual Tuition</td>
                            ${courses.map(c => `<td class="text-semibold">${c.tuition}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Minimum CGPA</td>
                            ${courses.map(c => `<td>${c.minCgpa ? `${c.minCgpa} / 10` : 'Not specified'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>IELTS Academic</td>
                            ${courses.map(c => `<td>${c.minIelts ? `${c.minIelts} overall` : 'Not required'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>GRE General</td>
                            ${courses.map(c => `<td>${c.greRequired ? '<span class="badge badge-warning">Mandatory</span>' : '<span class="badge badge-neutral">Not Required</span>'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Application Deadline</td>
                            ${courses.map(c => `<td class="text-semibold">${c.deadline}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Application Fee</td>
                            ${courses.map(c => `<td>${c.applicationFee}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Action</td>
                            ${courses.map(c => `
                                <td>
                                    <a href="/course.html?slug=${c.slug}" class="btn btn-primary btn-sm btn-full">
                                        View Full Course →
                                    </a>
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Event listeners
        container.querySelectorAll('[data-remove-compare]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slug = e.currentTarget.getAttribute('data-remove-compare');
                CompareState.remove(slug);
                render();
            });
        });

        document.getElementById('compare-clear-btn')?.addEventListener('click', () => {
            CompareState.clear();
            render();
        });
    };

    await render();
}
