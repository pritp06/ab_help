/* ==========================================
   UNIVERSITY DETAIL PAGE CONTROLLER
   ========================================== */

import { getUniversityDetail } from '../api/rankings.js';
import { UNIVERSITIES } from '../data/universities-data.js';
import { COURSES } from '../data/courses-data.js';

export async function initUniversityDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || 'technical-university-of-munich';

    // 1. Try fetching real DB record from API
    let uniData = null;
    let rankingData = null;

    try {
        const res = await getUniversityDetail(slug);
        if (res?.data) {
            uniData = res.data;
            rankingData = res.data.ranking;
        }
    } catch (e) {
        // Fallback to local mock array if server offline
        uniData = UNIVERSITIES.find(u => u.slug === slug) || UNIVERSITIES[0];
    }

    if (!uniData) return;

    // Render Hero & Title
    const nameEl = document.getElementById('uni-name');
    const locEl = document.getElementById('uni-location');
    const typeEl = document.getElementById('uni-type');
    const rankEl = document.getElementById('uni-qs-rank');
    const websiteEl = document.getElementById('uni-website');
    const overviewEl = document.getElementById('uni-overview');

    if (nameEl) nameEl.textContent = uniData.name;
    if (locEl) locEl.textContent = `${uniData.city || ''}, ${uniData.country?.name || uniData.countryName || ''}`;
    if (typeEl) typeEl.textContent = uniData.institution_type || uniData.type || 'Public University';

    // Render Official QS 2027 Ranking Badge from DB
    if (rankEl) {
        if (rankingData) {
            rankEl.innerHTML = `
                <div class="card card-body flex items-center justify-between" style="border-left: 4px solid var(--color-accent-primary);">
                    <div>
                        <div class="badge badge-accent mb-1">${rankingData.edition_name || 'QS World University Rankings 2027'}</div>
                        <div class="text-h2 font-bold" style="color: var(--color-accent-primary);">
                            #${rankingData.rank_display || rankingData.rank}
                        </div>
                        <div class="text-caption text-secondary">
                            Official Overall Score: ${rankingData.score ? rankingData.score : 'N/A'}
                        </div>
                    </div>
                    <a href="${rankingData.source_url || 'https://www.topuniversities.com/world-university-rankings/2027'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                        Source ↗
                    </a>
                </div>
            `;
        } else if (uniData.qsWorldRanking) {
            rankEl.innerHTML = `
                <div class="badge badge-accent">
                    QS World Ranking 2027: #${uniData.qsWorldRanking}
                </div>
            `;
        }
    }

    if (websiteEl && (uniData.website_url || uniData.website)) {
        websiteEl.href = uniData.website_url || uniData.website;
    }
    if (overviewEl && (uniData.description || uniData.overview)) {
        overviewEl.textContent = uniData.description || uniData.overview;
    }

    // Render Related Courses
    const coursesGrid = document.getElementById('uni-courses-grid');
    if (coursesGrid) {
        const matching = COURSES.filter(c => c.universitySlug === slug || c.universityName === uniData.name);
        if (matching.length > 0) {
            coursesGrid.innerHTML = matching.map(c => `
                <div class="card card-body flex flex-col justify-between">
                    <div>
                        <div class="badge badge-neutral mb-2">${c.degreeLevel}</div>
                        <h4 class="text-h4 mb-1">${c.title}</h4>
                        <p class="text-caption text-secondary mb-3">${c.fieldOfStudy} · ${c.durationMonths} Months</p>
                    </div>
                    <div class="flex items-center justify-between pt-3" style="border-top: 1px solid var(--color-border);">
                        <span class="font-bold text-accent">${c.tuitionPerYearEur ? `€${c.tuitionPerYearEur.toLocaleString()}/yr` : 'No Tuition'}</span>
                        <a href="/course.html?id=${c.id}" class="btn btn-sm btn-outline">Course Details</a>
                    </div>
                </div>
            `).join('');
        }
    }
}
