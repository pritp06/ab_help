/* ==========================================
   COURSE DETAIL PAGE CONTROLLER
   ========================================== */

import { MockDataService } from '../data/mock-service.js';
import { renderEligibilityCard } from '../components/eligibility.js';
import { ShortlistState } from '../state/shortlist.js';
import { CompareState } from '../state/compare.js';
import { PlannerState } from '../state/planner.js';
import { showToast } from '../components/toast.js';

export async function initCourseDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || 'msc-computer-science-tum';

    const course = await MockDataService.getCourseBySlug(slug);
    if (!course) {
        window.location.href = '/404.html';
        return;
    }

    document.title = `${course.title} — ${course.universityName} — StudyBuddy`;

    // Header values
    document.getElementById('course-title').textContent = course.title;
    document.getElementById('course-uni').textContent = course.universityName;
    document.getElementById('course-uni').href = `/university.html?slug=${course.universitySlug}`;
    document.getElementById('course-location').textContent = `${course.city}, ${course.countryName}`;
    document.getElementById('course-degree').textContent = course.degreeType;
    document.getElementById('course-duration').textContent = course.duration;
    document.getElementById('course-language').textContent = course.language;
    document.getElementById('course-tuition').textContent = course.tuition;
    document.getElementById('course-deadline').textContent = course.deadline;
    document.getElementById('course-overview').textContent = course.overview;

    // Source Info Badge
    const sourceBadge = document.getElementById('course-source');
    if (sourceBadge && course.sourceUrl) {
        sourceBadge.href = course.sourceUrl;
        sourceBadge.innerHTML = `
            <span>Official University Requirement</span>
            <span class="text-muted">· Verified ${course.verifiedDate}</span>
            <span style="margin-left: 4px;">↗</span>
        `;
    }

    // Render Eligibility Card
    const eligMount = document.getElementById('course-eligibility-mount');
    if (eligMount) {
        eligMount.innerHTML = renderEligibilityCard(course);
    }

    // Render Academic Requirements
    const acadReqContainer = document.getElementById('req-academic');
    if (acadReqContainer && course.requirements.academic) {
        acadReqContainer.innerHTML = course.requirements.academic.map(r => `
            <div class="requirement-row">
                <div>
                    <div class="text-body text-semibold">${r.label}</div>
                    <div class="text-small text-secondary" style="margin-top: 2px;">${r.detail}</div>
                </div>
            </div>
        `).join('');
    }

    // Render Language Requirements
    const langReqContainer = document.getElementById('req-language');
    if (langReqContainer && course.requirements.language) {
        langReqContainer.innerHTML = course.requirements.language.map(r => `
            <div class="requirement-row">
                <div>
                    <div class="text-body text-semibold">${r.label}</div>
                    <div class="text-small text-secondary" style="margin-top: 2px;">${r.detail}</div>
                </div>
            </div>
        `).join('');
    }

    // Render Additional Requirements
    const addReqContainer = document.getElementById('req-additional');
    if (addReqContainer && course.requirements.additional) {
        addReqContainer.innerHTML = course.requirements.additional.map(r => `
            <div class="requirement-row">
                <div>
                    <div class="text-body text-semibold">${r.label}</div>
                    <div class="text-small text-secondary" style="margin-top: 2px;">${r.detail}</div>
                </div>
            </div>
        `).join('');
    }

    // Render Documents Checklist
    const docContainer = document.getElementById('course-documents');
    if (docContainer && course.documents) {
        docContainer.innerHTML = course.documents.map(doc => `
            <div class="checklist-item">
                <span style="color: var(--success); font-weight:700;">✓</span>
                <span>${doc}</span>
            </div>
        `).join('');
    }

    // Actions (Save, Compare, Add to Planner)
    const saveBtn = document.getElementById('course-action-save');
    const compareBtn = document.getElementById('course-action-compare');
    const plannerBtn = document.getElementById('course-action-planner');

    const updateButtonStates = () => {
        const isSaved = ShortlistState.has(course.slug);
        const isCompared = CompareState.has(course.slug);

        if (saveBtn) {
            saveBtn.textContent = isSaved ? '♥ Saved in Shortlist' : '♡ Save to Shortlist';
            saveBtn.className = `btn btn-full ${isSaved ? 'btn-primary' : 'btn-secondary'}`;
        }
        if (compareBtn) {
            compareBtn.textContent = isCompared ? '✓ Added to Compare' : '+ Add to Compare';
            compareBtn.className = `btn btn-full ${isCompared ? 'btn-primary' : 'btn-outline'}`;
        }
    };

    saveBtn?.addEventListener('click', () => {
        const added = ShortlistState.toggle(course.slug);
        updateButtonStates();
        showToast(added ? 'Saved to Shortlist' : 'Removed from Shortlist', added ? 'success' : 'info');
    });

    compareBtn?.addEventListener('click', () => {
        const res = CompareState.toggle(course.slug);
        if (!res.success) {
            showToast(res.reason, 'warning');
        } else {
            updateButtonStates();
            showToast(res.added ? 'Added to Comparison' : 'Removed from Comparison', res.added ? 'success' : 'info');
        }
    });

    plannerBtn?.addEventListener('click', () => {
        const added = PlannerState.addCourseToPlanner(course);
        if (added) {
            showToast('Course added to Application Planner', 'success');
        } else {
            showToast('Course is already in your Application Planner', 'info');
        }
    });

    updateButtonStates();
}
