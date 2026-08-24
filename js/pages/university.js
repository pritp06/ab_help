/* ==========================================
   UNIVERSITY DETAIL PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';

export async function initUniversityDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || 'technical-university-of-munich';

    const uni = await MockDataService.getUniversityBySlug(slug);
    if (!uni) {
        window.location.href = '/404.html';
        return;
    }

    document.title = `${uni.name} — StudyBuddy`;
    document.getElementById('uni-name').textContent = uni.name;
    document.getElementById('uni-location').textContent = `${uni.city}, ${uni.countryName}`;
    document.getElementById('uni-type').textContent = uni.type;
    document.getElementById('uni-qs').textContent = `QS Rank #${uni.qsWorldRanking}`;
    document.getElementById('uni-overview').textContent = uni.overview;
    document.getElementById('uni-tuition-note').textContent = uni.tuitionNote;
    document.getElementById('uni-students').textContent = uni.totalStudents.toLocaleString();
    document.getElementById('uni-intl').textContent = uni.internationalRatio;

    const websiteBtn = document.getElementById('uni-website');
    if (websiteBtn) {
        websiteBtn.href = uni.website;
    }

    // Render courses offered by this university
    const coursesContainer = document.getElementById('uni-courses-list');
    if (coursesContainer) {
        const courses = await MockDataService.getCourses({ universitySlug: slug });
        if (!courses.length) {
            coursesContainer.innerHTML = `<div class="text-secondary">No courses currently listed for this institution.</div>`;
        } else {
            coursesContainer.innerHTML = courses.map(co => `
                <div class="card card-hover flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="badge badge-info">${co.degreeType}</span>
                        <span class="badge badge-neutral">${co.duration}</span>
                    </div>
                    <div>
                        <a href="/course.html?slug=${co.slug}" class="text-h4 text-semibold hover-link">${co.title}</a>
                        <div class="text-small text-secondary" style="margin-top: 2px;">Field: ${co.field} · ${co.language}</div>
                    </div>
                    <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--border-subtle);">
                        <span class="text-small text-semibold">${co.tuition}</span>
                        <a href="/course.html?slug=${co.slug}" class="btn btn-secondary btn-sm">View Details →</a>
                    </div>
                </div>
            `).join('');
        }
    }
}
