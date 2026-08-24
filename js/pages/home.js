/* ==========================================
   LANDING / HOME PAGE CONTROLLER
   ========================================== */

import { openSearchModal } from '../components/search.js';
import { MockDataService } from '../data/mock-service.js';

export async function initHomePage() {
    // Hero search trigger
    const heroSearchBtn = document.getElementById('hero-search-trigger');
    heroSearchBtn?.addEventListener('click', () => {
        openSearchModal();
    });

    // Render popular countries preview
    const countriesContainer = document.getElementById('home-popular-countries');
    if (countriesContainer) {
        const countries = await MockDataService.getCountries();
        countriesContainer.innerHTML = countries.slice(0, 6).map(c => `
            <a href="/country.html?slug=${c.slug}" class="card card-hover flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span style="font-size: 2rem;">${c.flag}</span>
                    <span class="badge badge-neutral">${c.universitiesCount}+ Unis</span>
                </div>
                <div>
                    <h3 class="text-h4">${c.name}</h3>
                    <p class="text-small text-secondary" style="margin-top: 4px;">${c.overview}</p>
                </div>
                <div class="flex items-center justify-between" style="margin-top: auto; padding-top: var(--space-2);">
                    <span class="text-meta">${c.englishProgramsCount}+ English Programs</span>
                    <span class="text-small text-semibold" style="color: var(--brand-blue);">Explore →</span>
                </div>
            </a>
        `).join('');
    }

    // Render featured courses preview
    const coursesContainer = document.getElementById('home-featured-courses');
    if (coursesContainer) {
        const courses = await MockDataService.getCourses();
        coursesContainer.innerHTML = courses.slice(0, 3).map(co => `
            <div class="card card-hover flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="badge badge-info">${co.degreeType}</span>
                    <span class="badge badge-neutral">${co.language}</span>
                </div>
                <div>
                    <a href="/course.html?slug=${co.slug}" class="text-h4 text-semibold hover-link">${co.title}</a>
                    <div class="text-small text-secondary" style="margin-top: 4px;">
                        <a href="/university.html?slug=${co.universitySlug}">${co.universityName}</a> · ${co.city}, ${co.countryName}
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
