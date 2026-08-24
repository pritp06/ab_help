/* ==========================================
   ELIGIBILITY ASSESSMENT ENGINE & COMPONENT
   ========================================== */

import { ProfileState } from '../state/profile.js';

export function calculateEligibility(course, profile = ProfileState.getProfile()) {
    if (!profile || !profile.isOnboarded) {
        return {
            status: 'unknown',
            label: 'Unknown Fit',
            badgeClass: 'badge-neutral',
            summary: 'Complete your profile to assess academic eligibility.',
            breakdown: []
        };
    }

    const breakdown = [];
    let satisfied = 0;
    let totalChecked = 0;

    // 1. CGPA Check
    if (course.minCgpa) {
        totalChecked++;
        const userCgpa = profile.cgpa || 0;
        const matched = userCgpa >= course.minCgpa;
        if (matched) satisfied++;
        breakdown.push({
            title: 'Minimum CGPA Requirement',
            status: matched ? 'matched' : 'mismatched',
            userVal: `${userCgpa} / ${profile.cgpaMax || 10}`,
            reqVal: `${course.minCgpa} / 10`,
            detail: matched ? `Your CGPA meets the minimum entry threshold of ${course.minCgpa}.` : `Your CGPA (${userCgpa}) is below the required ${course.minCgpa}.`
        });
    }

    // 2. IELTS / English Proficiency Check
    if (course.minIelts) {
        totalChecked++;
        const userIelts = profile.ieltsScore || 0;
        const matched = userIelts >= course.minIelts;
        if (matched) satisfied++;
        breakdown.push({
            title: 'English Language (IELTS)',
            status: matched ? 'matched' : 'mismatched',
            userVal: `${userIelts}`,
            reqVal: `${course.minIelts}`,
            detail: matched ? `Your IELTS score (${userIelts}) satisfies the language requirement.` : `Required: ${course.minIelts}. You may need to retake IELTS or provide TOEFL.`
        });
    }

    // 3. GRE Check
    if (course.greRequired) {
        totalChecked++;
        const hasGre = profile.hasGre || profile.greQuantScore > 0;
        if (hasGre) satisfied++;
        breakdown.push({
            title: 'GRE General Score',
            status: hasGre ? 'matched' : 'mismatched',
            userVal: hasGre ? `Quant: ${profile.greQuantScore || 'Yes'}` : 'Not Provided',
            reqVal: 'Mandatory',
            detail: hasGre ? 'GRE score provided.' : 'This program strictly requires a official GRE test score.'
        });
    }

    // Determine overall status
    let status = 'possible';
    let label = 'Possible Match';
    let badgeClass = 'badge-warning';

    if (totalChecked > 0) {
        const ratio = satisfied / totalChecked;
        if (ratio === 1) {
            status = 'strong';
            label = 'Strong Match';
            badgeClass = 'badge-success';
        } else if (ratio >= 0.5) {
            status = 'possible';
            label = 'Possible Match';
            badgeClass = 'badge-warning';
        } else {
            status = 'weak';
            label = 'Weak Match';
            badgeClass = 'badge-error';
        }
    }

    return {
        status,
        label,
        badgeClass,
        satisfied,
        totalChecked,
        summary: `${satisfied} of ${totalChecked} evaluated requirements satisfied`,
        breakdown
    };
}

export function renderEligibilityCard(course) {
    const result = calculateEligibility(course);
    
    return `
        <div class="card" style="margin-bottom: var(--space-8);">
            <div class="flex items-center justify-between" style="margin-bottom: var(--space-4);">
                <div>
                    <h3 class="text-h3" style="margin-bottom: 2px;">Eligibility Assessment</h3>
                    <p class="text-small text-secondary">Based on your academic profile</p>
                </div>
                <span class="badge ${result.badgeClass}" style="font-size: 0.875rem; padding: 6px 14px;">${result.label}</span>
            </div>

            <p class="text-body" style="font-weight: 500; margin-bottom: var(--space-6);">${result.summary}</p>

            <div class="flex flex-col gap-3">
                ${result.breakdown.map(item => `
                    <div class="requirement-row">
                        <div>
                            <div class="text-body text-semibold flex items-center gap-2">
                                ${item.status === 'matched' 
                                    ? '<span style="color: var(--success);">✓</span>' 
                                    : '<span style="color: var(--error);">✕</span>'}
                                ${item.title}
                            </div>
                            <div class="text-small text-secondary" style="margin-top: 2px;">${item.detail}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-small text-muted">Your Profile: <strong style="color: var(--text-primary);">${item.userVal}</strong></div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: var(--space-6); text-align: right;">
                <a href="/profile.html" class="btn btn-ghost btn-sm">Update Academic Profile →</a>
            </div>
        </div>
    `;
}
