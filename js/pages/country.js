/* ==========================================
   COUNTRY DETAIL PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';

export async function initCountryDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || 'germany';

    const country = await MockDataService.getCountryBySlug(slug);
    if (!country) {
        window.location.href = '/404.html';
        return;
    }

    // Render Country Header
    document.title = `${country.name} Study Guide — StudyBuddy`;
    document.getElementById('country-name').textContent = country.name;
    document.getElementById('country-flag').textContent = country.flag;
    document.getElementById('country-region').textContent = country.region;
    document.getElementById('country-overview').textContent = country.overview;
    document.getElementById('country-tuition').textContent = country.tuitionRange;
    document.getElementById('country-living').textContent = country.livingCosts;
    document.getElementById('country-visa').textContent = country.postStudyWorkVisa;

    // Render Universities in this country
    const unisContainer = document.getElementById('country-universities');
    if (unisContainer) {
        const universities = await MockDataService.getUniversities({ countrySlug: slug });
        unisContainer.innerHTML = universities.map(u => `
            <a href="/university.html?slug=${u.slug}" class="card card-hover flex justify-between items-center">
                <div>
                    <h3 class="text-h4">${u.name}</h3>
                    <p class="text-small text-secondary">${u.city} · QS #${u.qsWorldRanking} · ${u.type}</p>
                </div>
                <span class="btn btn-secondary btn-sm">Explore Courses →</span>
            </a>
        `).join('');
    }

    // Render Courses in this country
    const coursesContainer = document.getElementById('country-courses');
    if (coursesContainer) {
        const courses = await MockDataService.getCourses({ countrySlug: slug });
        coursesContainer.innerHTML = courses.map(co => `
            <div class="card card-hover flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="badge badge-info">${co.degreeType}</span>
                    <span class="badge badge-neutral">${co.language}</span>
                </div>
                <div>
                    <a href="/course.html?slug=${co.slug}" class="text-h4 text-semibold hover-link">${co.title}</a>
                    <div class="text-small text-secondary" style="margin-top: 4px;">
                        <a href="/university.html?slug=${co.universitySlug}">${co.universityName}</a>
                    </div>
                </div>
                <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
                    <div>
                        <div class="text-meta">Tuition</div>
                        <div class="text-small text-semibold">${co.tuition}</div>
                    </div>
                    <a href="/course.html?slug=${co.slug}" class="btn btn-secondary btn-sm">View Requirements →</a>
                </div>
            </div>
        `).join('');
    }
}
